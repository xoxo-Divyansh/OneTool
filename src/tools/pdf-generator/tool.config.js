import PdfGeneratorToolPage from "@/tools/pdf-generator/page";

export const metadata = {
  id: "pdf-generator",
  name: "PDF Generator",
  category: "general",
  description: "Create downloadable PDF files from text.",
  icon: "PD",
  comingSoon: true,
};

const pdfGeneratorToolConfig = {
  ...metadata,
  component: PdfGeneratorToolPage,
};

export default pdfGeneratorToolConfig;
