import OpenAI from "openai";

let _openrouter: OpenAI | null = null;
function getOpenRouter(): OpenAI {
    if (!_openrouter) {
        _openrouter = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });
    }
    return _openrouter;
}

// Large pool of free models on OpenRouter — if one is rate-limited or down, rotate to the next
const FREE_MODELS = [
    "google/gemma-3-27b-it:free",
    "google/gemma-3-12b-it:free",
    "meta-llama/llama-3.3-8b-instruct:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "qwen/qwen3-14b:free",
    "qwen/qwen3-8b:free",
    "deepseek/deepseek-r1-0528:free",
    "microsoft/phi-4-reasoning:free",
    "google/gemma-3-4b-it:free",
    "meta-llama/llama-4-scout:free",
];

/**
 * Clean the LLM output: strip reasoning, thinking, meta-commentary.
 * Some models (gemma) emit their reasoning as part of the content itself.
 */
function cleanLLMOutput(text: string): string {
    let cleaned = text;

    // Remove <think>...</think> blocks (some models use XML-style thinking tags)
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");

    // Remove lines that start with common reasoning patterns
    const reasoningPatterns = [
        /^(Okay|OK|Alright|So|Let me|Let's|First|Now|Hmm|Right),?\s*(let me|let's|I need to|I will|I should|I'll|we need to|we should).*/gim,
        /^(I need to|I will|I should|I'll|We need to|We should|Let me|Let's)\s+(analyze|think|consider|tackle|examine|look|check|figure|process|understand|evaluate|address|respond|follow|break|determine).*/gim,
        /^(The user|The question|This question|The query|She|He|They)\s+(is asking|wants|asked|needs|seems|appears|provides|mentions).*/gim,
        /^(Based on my instructions|As per the rules|Following the guidelines|According to my system|I must respond|I should respond|I will respond|Must obey).*/gim,
        /^(First|Second|Third|Next|Then|Also|Additionally|Furthermore|Moreover|Finally),?\s+(I need to|I will|I should|let me|let's|we need).*/gim,
    ];

    const lines = cleaned.split("\n");
    const filteredLines: string[] = [];
    let skipMode = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines at the very start
        if (filteredLines.length === 0 && trimmed === "") continue;

        // Check if line matches reasoning patterns
        let isReasoning = false;
        for (const pattern of reasoningPatterns) {
            // Reset regex lastIndex since they are global
            pattern.lastIndex = 0;
            if (pattern.test(trimmed)) {
                isReasoning = true;
                break;
            }
        }

        if (isReasoning) {
            skipMode = true;
            continue;
        }

        // If we hit a non-reasoning line, stop skipping
        if (skipMode && trimmed !== "") {
            skipMode = false;
        }

        if (!skipMode) {
            filteredLines.push(line);
        }
    }

    cleaned = filteredLines.join("\n").trim();

    // Remove any leading dashes or bullets that are just filler
    cleaned = cleaned.replace(/^[\s\n]*---[\s\n]*/g, "");

    return cleaned;
}

/**
 * Helper to try multiple models in case of failure.
 * On rate limit (429) → immediately rotate to next model (no delay).
 * On other errors → wait 1s then try next model.
 * Tries ALL models before giving up.
 */
async function createChatCompletion(options: any, attempt = 0): Promise<any> {
    const model = FREE_MODELS[attempt % FREE_MODELS.length];

    // Generous timeouts
    const timeout = 45000;

    console.log(`[LLM] Model: ${model} | Attempt: ${attempt + 1}/${FREE_MODELS.length}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const result = await getOpenRouter().chat.completions.create({
            ...options,
            model: model,
        }, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return result;
    } catch (error: any) {
        clearTimeout(timeoutId);
        const errMsg = error.message || "";
        const isRateLimit = errMsg.includes("429") || errMsg.includes("Rate limit") || errMsg.includes("rate limit");
        console.error(`[LLM] ${isRateLimit ? "RATE LIMITED" : "Error"} (${model}):`, errMsg.substring(0, 100));

        // If we have more models to try, rotate
        if (attempt < FREE_MODELS.length - 1) {
            const nextModel = FREE_MODELS[(attempt + 1) % FREE_MODELS.length];
            if (isRateLimit) {
                // Rate limited → immediately rotate, no delay
                console.log(`[LLM] ⚡ Rate limited → instant rotate to ${nextModel}`);
            } else {
                // Other error → brief delay then rotate
                console.log(`[LLM] 🔄 Error → rotating to ${nextModel} in 1s...`);
                await new Promise(r => setTimeout(r, 1000));
            }
            return createChatCompletion(options, attempt + 1);
        }

        // All models exhausted
        console.error(`[LLM] ❌ All ${FREE_MODELS.length} models failed.`);
        throw error;
    }
}

/**
 * Send a question with RAG context to the LLM and stream the response.
 * Buffers the full response first to strip any reasoning/thinking patterns,
 * then streams the cleaned content to the client.
 */
export async function streamLLMResponse(
    systemPrompt: string,
    userQuestion: string,
    signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
    const response = await createChatCompletion({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuestion },
        ],
        temperature: 0.4,
        max_tokens: 2048,
        stream: true,
    });

    const encoder = new TextEncoder();

    return new ReadableStream({
        async start(controller) {
            try {
                let fullRaw = "";
                let hasLoggedFirstChunk = false;

                // Phase 1: Buffer the entire raw response
                for await (const chunk of response) {
                    if (signal?.aborted) {
                        console.log("[LLM Stream] Stream aborted by signal");
                        break;
                    }

                    const delta = chunk.choices[0]?.delta as any;
                    const content = delta?.content || "";

                    if (content) {
                        if (!hasLoggedFirstChunk) {
                            console.log("[LLM Stream] First data chunk arrived");
                            hasLoggedFirstChunk = true;
                        }
                        fullRaw += content;
                    }
                }

                // Phase 2: Clean the full response to strip reasoning
                const cleaned = cleanLLMOutput(fullRaw);
                console.log(`[LLM Stream] Raw: ${fullRaw.length} chars → Cleaned: ${cleaned.length} chars`);

                // Phase 3: Stream the cleaned content to the client in chunks
                const chunkSize = 20; // characters per chunk for smooth streaming feel
                for (let i = 0; i < cleaned.length; i += chunkSize) {
                    if (signal?.aborted) break;
                    const slice = cleaned.substring(i, i + chunkSize);
                    controller.enqueue(encoder.encode(slice));
                    // Small delay for a natural streaming feel
                    await new Promise(r => setTimeout(r, 10));
                }

                console.log(`[LLM Stream] Completed successfully.`);
                if (!signal?.aborted) {
                    controller.close();
                }
            } catch (error: any) {
                if (error.name !== "AbortError" && !signal?.aborted) {
                    console.error("[LLM Stream] Error during streaming:", error);
                    try { controller.error(error); } catch (e) { }
                } else {
                    try { controller.close(); } catch (e) { }
                }
            }
        },
        cancel() {
            if (response.controller) {
                response.controller.abort();
            }
        }
    });
}

/**
 * Non-streaming version for simpler use cases.
 */
export async function getLLMResponse(
    systemPrompt: string,
    userQuestion: string
): Promise<string> {
    const response = await createChatCompletion({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuestion },
        ],
        temperature: 0.4,
        max_tokens: 2048,
    });

    const raw = response.choices[0]?.message?.content || "No response generated.";
    return cleanLLMOutput(raw);
}
