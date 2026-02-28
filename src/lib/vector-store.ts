import { TextChunk } from "./chunker";
import { createEmbeddings, createQueryEmbedding } from "./embeddings";
import { getSupabase } from "./supabase";

/**
 * Supabase-backed vector store using pgvector for similarity search.
 *
 * Requires:
 * - The `vector` extension enabled in Supabase
 * - A `constitution_chunks` table with an `embedding vector(1536)` column
 * - A `match_chunks` RPC function for cosine similarity search
 *
 * Run the SQL migration in the Supabase SQL Editor to set these up.
 */

const TABLE = "constitution_chunks";

/**
 * Store text chunks with their embeddings in Supabase.
 */
export async function storeChunks(chunks: TextChunk[]): Promise<number> {
    const supabase = getSupabase();

    // Generate embeddings for all chunks
    const texts = chunks.map((c) => c.text);
    const embeddings = await createEmbeddings(texts);

    // Prepare rows for insertion
    const rows = chunks.map((chunk, i) => ({
        id: chunk.id,
        content: chunk.text,
        embedding: JSON.stringify(embeddings[i]),
        chunk_index: chunk.index,
        start_char: chunk.metadata.startChar,
        end_char: chunk.metadata.endChar,
        approximate_articles: chunk.metadata.approximateArticles,
    }));

    // Insert in batches of 50 to avoid payload limits
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const { error } = await supabase.from(TABLE).upsert(batch);

        if (error) {
            console.error(`Batch insert error at offset ${i}:`, error.message);
            throw new Error(`Failed to store chunks: ${error.message}`);
        }

        insertedCount += batch.length;
    }

    return insertedCount;
}

/**
 * Query the vector store with a question and return the most relevant chunks.
 * Uses the `match_chunks` Postgres RPC function for pgvector cosine similarity.
 */
export async function queryVectorStore(
    question: string,
    topK: number = 5
): Promise<
    {
        text: string;
        score: number;
        articles: string;
    }[]
> {
    const supabase = getSupabase();

    // Embed the question
    const queryEmbedding = await createQueryEmbedding(question);

    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc("match_chunks", {
        query_embedding: JSON.stringify(queryEmbedding),
        match_count: topK,
    });

    if (error) {
        console.error("Vector search error:", error.message);
        throw new Error(`Vector search failed: ${error.message}`);
    }

    return (data || []).map(
        (row: {
            content: string;
            similarity: number;
            approximate_articles: string;
        }) => ({
            text: row.content,
            score: row.similarity,
            articles: row.approximate_articles || "General",
        })
    );
}

/**
 * Check if the store has already been populated.
 */
export async function isCollectionPopulated(): Promise<boolean> {
    const count = await getCollectionCount();
    return count > 0;
}

/**
 * Get the number of documents in the store.
 */
export async function getCollectionCount(): Promise<number> {
    const supabase = getSupabase();

    const { count, error } = await supabase
        .from(TABLE)
        .select("*", { count: "exact", head: true });

    if (error) {
        console.error("Count error:", error.message);
        return 0;
    }

    return count ?? 0;
}
