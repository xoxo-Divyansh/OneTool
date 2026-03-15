import PdfGeneratorToolPage from "@/tools/pdf-generator/page";

export const metadata = {
  id: "pdf-generator",
  name: "PDF Generator",
  category: "general",
  description: "Generate and download PDF documents from custom inputs.",
  icon: "PD",
  comingSoon: true,
  requiresAuth: false,
};

const pdfGeneratorToolConfig = {
  ...metadata,
  component: PdfGeneratorToolPage,
};

export default pdfGeneratorToolConfig;
