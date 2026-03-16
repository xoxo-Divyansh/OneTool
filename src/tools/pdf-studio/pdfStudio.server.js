import { PDFDocument } from "pdf-lib";
import {
  PDF_STUDIO_LIMITS,
  PDF_STUDIO_SUPPORTED_IMAGE_TYPES,
} from "@/tools/pdf-studio/pdfStudio.constants";

const { maxFiles, maxFileSizeBytes } = PDF_STUDIO_LIMITS;

function isFile(value) {
  return value && typeof value === "object" && typeof value.arrayBuffer === "function";
}

export function extractFiles(formData, fieldName = "files") {
  const raw = formData.getAll(fieldName);
  return raw.filter((item) => isFile(item));
}

export function validateFileCount(files, { min = 1, max = maxFiles } = {}) {
  if (!files || files.length < min) {
    return `Upload at least ${min} file${min === 1 ? "" : "s"}.`;
  }
  if (files.length > max) {
    return `You can upload up to ${max} files at a time.`;
  }
  return null;
}

export function validateFileSizes(files) {
  const overs = files.filter((file) => file.size > maxFileSizeBytes);
  if (overs.length === 0) return null;
  return `Each file must be under ${Math.round(maxFileSizeBytes / 1024 / 1024)}MB.`;
}

export function validatePdfFiles(files) {
  const invalid = files.filter((file) => file.type !== "application/pdf");
  if (invalid.length === 0) return null;
  return "Only PDF files are supported for this action.";
}

export function validateImageFiles(files) {
  const invalid = files.filter((file) => !file.type?.startsWith("image/"));
  if (invalid.length > 0) {
    return "Only image files are supported for this action.";
  }

  const unsupported = files.filter(
    (file) => !PDF_STUDIO_SUPPORTED_IMAGE_TYPES.has(file.type),
  );
  if (unsupported.length > 0) {
    return "Only PNG and JPG images are supported right now.";
  }

  return null;
}

export function parsePageSelection(input, maxPages) {
  const normalized = String(input || "").replace(/\s+/g, "");
  if (!normalized) {
    return { ok: false, error: "Provide a page range like 1-3,5." };
  }

  const pages = new Set();
  const segments = normalized.split(",");

  for (const segment of segments) {
    if (!segment) continue;
    if (segment.includes("-")) {
      const [startRaw, endRaw] = segment.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < 1) {
        return { ok: false, error: "Invalid page range format." };
      }
      if (start > end) {
        return { ok: false, error: "Page ranges must be ascending." };
      }
      for (let page = start; page <= end; page += 1) {
        pages.add(page);
      }
    } else {
      const page = Number(segment);
      if (!Number.isInteger(page) || page < 1) {
        return { ok: false, error: "Invalid page number provided." };
      }
      pages.add(page);
    }
  }

  const pageArray = Array.from(pages).sort((a, b) => a - b);
  const outOfRange = pageArray.find((page) => page > maxPages);
  if (outOfRange) {
    return { ok: false, error: `Page ${outOfRange} exceeds the document length.` };
  }

  if (pageArray.length === 0) {
    return { ok: false, error: "Select at least one page to extract." };
  }

  return { ok: true, pages: pageArray };
}

export async function mergePdfBuffers(buffers) {
  const merged = await PDFDocument.create();

  for (const buffer of buffers) {
    const doc = await PDFDocument.load(buffer);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}

export async function splitPdfBuffer(buffer, pageNumbers) {
  const source = await PDFDocument.load(buffer);
  const target = await PDFDocument.create();
  const indices = pageNumbers.map((page) => page - 1);
  const pages = await target.copyPages(source, indices);
  pages.forEach((page) => target.addPage(page));
  return target.save();
}

export async function imagesToPdfBuffers(images) {
  const doc = await PDFDocument.create();

  for (const { bytes, type } of images) {
    const image =
      type === "image/png"
        ? await doc.embedPng(bytes)
        : await doc.embedJpg(bytes);

    const { width, height } = image.scale(1);
    const page = doc.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  return doc.save();
}
