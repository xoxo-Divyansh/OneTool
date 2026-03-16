import { pdfStudioDefaults } from "@/modules/tools/pdfStudio/pdfStudio.logic";
import PdfStudioUI from "@/modules/tools/pdfStudio/pdfStudio.ui";

export default function PdfStudioPage() {
  return <PdfStudioUI defaults={pdfStudioDefaults} />;
}
