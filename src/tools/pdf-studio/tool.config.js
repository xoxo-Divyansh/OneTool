import PdfStudioToolPage from "@/tools/pdf-studio/page";

export const metadata = {
  id: "pdf-studio",
  name: "PDF Studio",
  category: "general",
  description: "Merge, split, and convert PDFs in one workspace",
  route: "/tools/pdf-studio",
  icon: "PD",
  comingSoon: false,
  requiresAuth: false,
  keywords: ["pdf", "merge", "split", "convert", "image", "compress"],
};

const pdfStudioToolConfig = {
  ...metadata,
  component: PdfStudioToolPage,
};

export default pdfStudioToolConfig;
