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

// Array of high-performance free models on OpenRouter to ensure uptime
const FREE_MODELS = [
    "google/gemma-3-27b-it:free",
    "openrouter/free"
];

/**
 * Helper to try multiple models in case of failure
 */
async function createChatCompletion(options: any, attempt = 0): Promise<any> {
    const model = FREE_MODELS[attempt % FREE_MODELS.length];

    // Use a faster timeout for initial attempts to rotate quickly if stuck
    const timeout = attempt < 3 ? 12000 : 25000;

    console.log(`[LLM] Model: ${model} | Timeout: ${timeout}ms | Attempt: ${attempt + 1}`);

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
        console.error(`[LLM] Error (${model}):`, error.message);

        // If we have more models to try, recurse
        if (attempt < FREE_MODELS.length - 1) {
            console.log(`[LLM] Rotating to model ${FREE_MODELS[attempt + 1]}...`);
            await new Promise(r => setTimeout(r, 2000)); // wait 2s before retry
            return createChatCompletion(options, attempt + 1);
        }

        // If all else fails, throw the last error
        throw error;
    }
}

/**
 * Send a question with RAG context to the LLM and stream the response.
 * Returns a ReadableStream for streaming to the client.
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
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
    });

    // Convert OpenAI stream to a web ReadableStream
    const encoder = new TextEncoder();

    return new ReadableStream({
        async start(controller) {
            try {
                let chunkCount = 0;
                let hasLoggedFirstChunk = false;

                for await (const chunk of response) {
                    if (signal?.aborted) {
                        console.log("[LLM Stream] Stream aborted by signal");
                        break;
                    }

                    const delta = chunk.choices[0]?.delta as any;
                    let content = delta?.content || "";

                    if (delta?.reasoning) {
                        content = delta.reasoning + content;
                    }

                    if (content) {
                        chunkCount++;
                        if (!hasLoggedFirstChunk) {
                            console.log("[LLM Stream] First data chunk arrived");
                            hasLoggedFirstChunk = true;
                        }
                        controller.enqueue(encoder.encode(content));
                    }
                }

                console.log(`[LLM Stream] Completed successfully. Total chunks: ${chunkCount}`);
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
        temperature: 0.7,
        max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || "No response generated.";
}
