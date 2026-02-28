import { NextRequest, NextResponse } from "next/server";
import { queryVectorStore } from "@/lib/vector-store";
import { buildSystemPrompt, Scenario, LearningMode } from "@/lib/prompts";
import { streamLLMResponse, getLLMResponse } from "@/lib/llm";

export const dynamic = "force-dynamic";

/**
 * POST /api/ask
 * RAG-powered question answering with streaming response.
 *
 * Body: { question: string, scenario?: Scenario, mode?: LearningMode }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            question,
            scenario = "general" as Scenario,
            mode = "citizen" as LearningMode,
            language = "en-IN",
        } = body;

        if (!question || typeof question !== "string") {
            return NextResponse.json(
                { error: "Question is required" },
                { status: 400 }
            );
        }

        // Step 1: Pre-process the query with LLM to optimize for RAG search
        console.log(`[Ask API] Original question: "${question.substring(0, 50)}..."`);
        const optimizationPrompt = `You are an AI search query optimization assistant.
Your task is to convert the user's input into a precise, keyword-rich search query optimized for vector-database RAG search against the Constitution of India.
Extract key legal terms, concepts, or article numbers. Ignore conversational filler.
Respond ONLY with the optimized search phrase, nothing else.`;

        let optimizedQuery = question;
        try {
            optimizedQuery = await getLLMResponse(optimizationPrompt, question);
            optimizedQuery = optimizedQuery.replace(/^"|"$/g, '').trim(); // Remove quotes if any
            console.log(`[Ask API] Optimized query: "${optimizedQuery}"`);
        } catch (e) {
            console.warn(`[Ask API] Query optimization failed, falling back to original question.`, e);
            optimizedQuery = question;
        }

        // Step 2: Search for relevant constitutional text using the optimized query
        const results = await queryVectorStore(optimizedQuery, 5);

        if (results.length === 0) {
            console.warn(`[Ask API] No relevant content found.`);
            return NextResponse.json(
                {
                    error:
                        "No constitutional data found. Please ingest the Constitution PDF first by calling POST /api/ingest",
                },
                { status: 404 }
            );
        }

        console.log(`[Ask API] Found ${results.length} relevant chunks.`);

        // Step 2: Build context from search results
        const context = results
            .map(
                (r, i) =>
                    `[Source ${i + 1} — ${r.articles}]\n${r.text}`
            )
            .join("\n\n---\n\n");

        // Step 3: Build the prompt
        const systemPrompt = buildSystemPrompt(scenario, mode, context, language);

        // Step 4: Stream the LLM response
        console.log(`[Ask API] Starting stream for scenario: ${scenario}, mode: ${mode}`);
        const stream = await streamLLMResponse(systemPrompt, question, request.signal);

        // Return as a streaming response with source metadata in headers
        const articlesCited = [
            ...new Set(results.map((r) => r.articles)),
        ]
            .join(" | ")
            .replace(/[\n\r]/g, " ")
            .trim();

        console.log(`[Ask API] Returning stream. Cited: ${articlesCited}`);
        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "X-Articles-Cited": articlesCited,
                "X-Sources-Count": String(results.length),
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Ask error:", message);

        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
