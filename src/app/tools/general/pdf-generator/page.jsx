import ToolLayout from "@/components/tools/ToolLayout";

export default function PdfGeneratorPage() {
  return (
    <ToolLayout
      title="PDF Generator"
      description="This tool is scaffolded and ready for the next implementation pass."
    >
      <div className="dashboard-panel">
        <p className="dashboard-subtitle">
          Planned feature set: text to PDF with direct file download.
        </p>
      </div>
    </ToolLayout>
  );
}

