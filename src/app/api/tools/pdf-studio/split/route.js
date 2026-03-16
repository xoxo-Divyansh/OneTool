import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import {
  extractFiles,
  parsePageSelection,
  validateFileCount,
  validateFileSizes,
  validatePdfFiles,
} from "@/tools/pdf-studio/pdfStudio.server";

export const runtime = "nodejs";

export async function POST(req) {
  let formData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid form data." },
      { status: 400 },
    );
  }

  const files = extractFiles(formData);
  const countError = validateFileCount(files, { min: 1, max: 1 });
  if (countError) {
    return NextResponse.json({ success: false, message: countError }, { status: 400 });
  }

  const sizeError = validateFileSizes(files);
  if (sizeError) {
    return NextResponse.json({ success: false, message: sizeError }, { status: 400 });
  }

  const typeError = validatePdfFiles(files);
  if (typeError) {
    return NextResponse.json({ success: false, message: typeError }, { status: 400 });
  }

  const pageSelection = formData.get("pages");

  try {
    const buffer = await files[0].arrayBuffer();
    const source = await PDFDocument.load(buffer);
    const parsed = parsePageSelection(pageSelection, source.getPageCount());

    if (!parsed.ok) {
      return NextResponse.json({ success: false, message: parsed.error }, { status: 400 });
    }

    const target = await PDFDocument.create();
    const indices = parsed.pages.map((page) => page - 1);
    const pages = await target.copyPages(source, indices);
    pages.forEach((page) => target.addPage(page));
    const splitBytes = await target.save();

    return new NextResponse(Buffer.from(splitBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"pdf-studio-split.pdf\"",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF split failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
