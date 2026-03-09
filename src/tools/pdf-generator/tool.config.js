import PdfGeneratorToolPage from "@/tools/pdf-generator/page";

const pdfGeneratorToolConfig = {
  id: "pdf-generator",
  name: "PDF Generator",
  category: "general",
  description: "Create downloadable PDF files from text.",
  icon: "PD",
  comingSoon: true,
  component: PdfGeneratorToolPage,
};

export default pdfGeneratorToolConfig;

