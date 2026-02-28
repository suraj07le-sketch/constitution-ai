import fs from "fs";
import path from "path";
/**
 * Loads and parses the Indian Constitution PDF from public/constitution.pdf
 * Returns the extracted text content.
 */
export async function loadConstitutionPDF(): Promise<string> {
  const pdfPath = path.join(process.cwd(), "public", "constitution.pdf");

  if (!fs.existsSync(pdfPath)) {
    throw new Error(
      "Constitution PDF not found. Please place your PDF at public/constitution.pdf"
    );
  }

  const dataBuffer = fs.readFileSync(pdfPath);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(dataBuffer);

  // Clean up common PDF artifacts
  let text = data.text;

  // Remove excessive whitespace and normalize line breaks
  text = text.replace(/\r\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]{2,}/g, " ");

  // Remove page numbers (common patterns like "Page 1", "- 1 -", etc.)
  text = text.replace(/\n\s*Page\s+\d+\s*\n/gi, "\n");
  text = text.replace(/\n\s*-\s*\d+\s*-\s*\n/g, "\n");

  return text.trim();
}

/**
 * Extract metadata about the PDF
 */
export async function getPDFMetadata(): Promise<{
  pages: number;
  title: string;
  textLength: number;
}> {
  const pdfPath = path.join(process.cwd(), "public", "constitution.pdf");

  if (!fs.existsSync(pdfPath)) {
    throw new Error("Constitution PDF not found at public/constitution.pdf");
  }

  const dataBuffer = fs.readFileSync(pdfPath);

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse");
  const data = await pdfParse(dataBuffer);

  return {
    pages: data.numpages,
    title: data.info?.Title || "The Constitution of India",
    textLength: data.text.length,
  };
}
