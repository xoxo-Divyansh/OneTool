import { PDF_STUDIO_LIMITS } from "@/tools/pdf-studio/pdfStudio.constants";

export const pdfStudioDefaults = {
  activeTab: "merge",
  splitRange: "1-2",
};

export const pdfStudioModules = [
  {
    id: "merge",
    label: "Merge",
    description: "Combine multiple PDFs into a single document.",
    helper: "Add at least two PDFs to merge into one file.",
  },
  {
    id: "split",
    label: "Split",
    description: "Extract a set of pages into a new PDF.",
    helper: "Provide a page range like 1-3,5.",
  },
  {
    id: "image",
    label: "Image ? PDF",
    description: "Convert a set of images into a multi-page PDF.",
    helper: "PNG and JPG images are supported in this release.",
  },
];

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function getLimitSummary() {
  return `Max ${PDF_STUDIO_LIMITS.maxFiles} files • ${Math.round(
    PDF_STUDIO_LIMITS.maxFileSizeBytes / 1024 / 1024,
  )}MB per file`;
}
