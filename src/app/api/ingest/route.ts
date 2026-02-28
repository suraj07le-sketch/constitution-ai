import { NextRequest, NextResponse } from "next/server";
import { loadConstitutionPDF, getPDFMetadata } from "@/lib/pdf-loader";
import { chunkText } from "@/lib/chunker";
import { storeChunks, isCollectionPopulated, getCollectionCount } from "@/lib/vector-store";

export const dynamic = "force-dynamic";

/**
 * POST /api/ingest
 * Triggers the full PDF → chunk → embed → store pipeline.
 * Idempotent: returns early if collection is already populated.
 */
export async function POST(request: NextRequest) {
    try {
        // Check if already ingested
        const populated = await isCollectionPopulated();
        if (populated) {
            const count = await getCollectionCount();
            return NextResponse.json({
                success: true,
                message: "Constitution already ingested",
                chunksStored: count,
                alreadyPopulated: true,
            });
        }

        // Step 1: Load PDF
        const text = await loadConstitutionPDF();
        const metadata = await getPDFMetadata();

        // Step 2: Chunk the text
        const chunks = chunkText(text);

        // Step 3: Embed and store chunks
        const storedCount = await storeChunks(chunks);

        return NextResponse.json({
            success: true,
            message: "Constitution ingested successfully",
            pdfPages: metadata.pages,
            totalChunks: chunks.length,
            chunksStored: storedCount,
            alreadyPopulated: false,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Ingestion error:", message);

        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/ingest
 * Returns the current ingestion status.
 */
export async function GET() {
    try {
        const populated = await isCollectionPopulated();
        const count = await getCollectionCount();

        return NextResponse.json({
            populated,
            chunksStored: count,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
