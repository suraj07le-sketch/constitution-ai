
const OpenAI = require("openai");

async function test() {
    console.log("Testing OpenRouter Embedding API...");
    const openai = new OpenAI({
        apiKey: "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",
        baseURL: "https://openrouter.ai/api/v1",
    });

    try {
        const response = await openai.embeddings.create({
            model: "openai/text-embedding-3-small",
            input: "Hello world",
        });
        console.log("Success! Embedding length:", response.data[0].embedding.length);
    } catch (e) {
        console.error("Failed:", e.message);
    }
}

test();
