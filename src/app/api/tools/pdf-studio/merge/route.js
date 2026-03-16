import { NextResponse } from "next/server";
import {
  extractFiles,
  mergePdfBuffers,
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
  const countError = validateFileCount(files, { min: 2 });
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

  try {
    const buffers = await Promise.all(files.map((file) => file.arrayBuffer()));
    const mergedBytes = await mergePdfBuffers(buffers);

    return new NextResponse(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"pdf-studio-merge.pdf\"",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "PDF merge failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
