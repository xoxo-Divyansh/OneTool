import { NextResponse } from "next/server";
import {
  extractFiles,
  imagesToPdfBuffers,
  validateFileCount,
  validateFileSizes,
  validateImageFiles,
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
  const countError = validateFileCount(files, { min: 1 });
  if (countError) {
    return NextResponse.json({ success: false, message: countError }, { status: 400 });
  }

  const sizeError = validateFileSizes(files);
  if (sizeError) {
    return NextResponse.json({ success: false, message: sizeError }, { status: 400 });
  }

  const typeError = validateImageFiles(files);
  if (typeError) {
    return NextResponse.json({ success: false, message: typeError }, { status: 400 });
  }

  try {
    const images = await Promise.all(
      files.map(async (file) => ({
        bytes: await file.arrayBuffer(),
        type: file.type,
      })),
    );

    const pdfBytes = await imagesToPdfBuffers(images);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"pdf-studio-images.pdf\"",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image conversion failed.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
