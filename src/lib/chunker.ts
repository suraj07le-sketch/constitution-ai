export interface TextChunk {
    id: string;
    text: string;
    index: number;
    metadata: {
        startChar: number;
        endChar: number;
        approximateArticles: string;
    };
}

/**
 * Smart overlap-based text chunking that tries to preserve
 * article/section boundaries in the Indian Constitution.
 *
 * @param text - Full extracted text from the PDF
 * @param chunkSize - Target characters per chunk (~500 tokens ≈ 2000 chars)
 * @param overlap - Overlap between chunks to maintain context
 */
export function chunkText(
    text: string,
    chunkSize: number = 2000,
    overlap: number = 200
): TextChunk[] {
    const chunks: TextChunk[] = [];

    // Try to detect article boundaries for smarter splitting
    const articlePattern = /(?:Article\s+\d+[A-Z]?\.?|PART\s+[IVXLCDM]+|SCHEDULE)/gi;

    let position = 0;
    let index = 0;

    while (position < text.length) {
        let end = Math.min(position + chunkSize, text.length);

        // Try to end at a natural boundary (sentence/paragraph end)
        if (end < text.length) {
            // Look for a good break point near the end
            const searchWindow = text.slice(end - 200, end + 200);
            const breakPoints = [
                searchWindow.lastIndexOf("\n\n"),
                searchWindow.lastIndexOf(".\n"),
                searchWindow.lastIndexOf(". "),
                searchWindow.lastIndexOf("\n"),
            ];

            for (const bp of breakPoints) {
                if (bp > 0) {
                    end = end - 200 + bp + 1;
                    break;
                }
            }
        }

        const chunkText = text.slice(position, end).trim();

        if (chunkText.length > 0) {
            // Try to detect which articles are referenced in this chunk
            const articleMatches = chunkText.match(articlePattern) || [];
            const uniqueArticles = [...new Set(articleMatches)].slice(0, 5);

            chunks.push({
                id: `chunk-${index}`,
                text: chunkText,
                index,
                metadata: {
                    startChar: position,
                    endChar: end,
                    approximateArticles: uniqueArticles.join(", ") || "General",
                },
            });

            index++;
        }

        // Move to next chunk with overlap, ensuring forward progress
        position = Math.max(position + 100, end - overlap);
        if (position >= text.length) break;
    }

    return chunks;
}
