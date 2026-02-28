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

/**
 * Generate embeddings for an array of text chunks using OpenRouter's
 * embedding endpoint with text-embedding-3-small model.
 */
export async function createEmbeddings(
    texts: string[]
): Promise<number[][]> {
    // Batch in groups of 100 to respect API limits
    const batchSize = 100;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);

        const response = await getOpenRouter().embeddings.create({
            model: "openai/text-embedding-3-small",
            input: batch,
        });

        const embeddings = response.data.map((d: { embedding: number[] }) => d.embedding);
        allEmbeddings.push(...embeddings);
    }

    return allEmbeddings;
}

/**
 * Generate a single embedding for a query string with timeout and retry.
 */
export async function createQueryEmbedding(
    query: string,
    attempt = 0
): Promise<number[]> {
    try {
        console.log(`[Embeddings] Creating query embedding (Attempt ${attempt + 1})...`);
        const response = await getOpenRouter().embeddings.create({
            model: "openai/text-embedding-3-small",
            input: query,
        }, {
            timeout: 10000, // 10 second timeout
        });

        if (!response.data?.[0]?.embedding) {
            throw new Error("Invalid embedding response structure");
        }

        console.log(`[Embeddings] Successfully created embedding.`);
        return response.data[0].embedding;
    } catch (error: any) {
        console.error(`[Embeddings] Creation failed:`, error.message);
        if (attempt < 2) { // try 3 times total
            console.log(`[Embeddings] Retrying in 2 seconds...`);
            await new Promise(r => setTimeout(r, 2000));
            return createQueryEmbedding(query, attempt + 1);
        }
        throw error;
    }
}
