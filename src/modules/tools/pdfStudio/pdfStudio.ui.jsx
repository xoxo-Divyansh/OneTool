"use client";

import { useMemo, useState } from "react";
import { Image as ImageIcon, Layers, Scissors } from "lucide-react";
import { InlineSpinner } from "@/components/UI/LoadingSpinner";
import DropzoneUploader from "@/components/upload/DropzoneUploader";
import {
  pdfStudioDefaults,
  pdfStudioModules,
  getLimitSummary,
} from "@/modules/tools/pdfStudio/pdfStudio.logic";
import {
  PDF_STUDIO_ACCEPT_CONFIG,
  PDF_STUDIO_LIMITS,
} from "@/tools/pdf-studio/pdfStudio.constants";

function buildDownloadName(prefix) {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  return `${prefix}-${stamp}.pdf`;
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function PdfStudioUI({ defaults = pdfStudioDefaults }) {
  const [activeTab, setActiveTab] = useState(defaults.activeTab);
  const [mergeFiles, setMergeFiles] = useState([]);
  const [splitFile, setSplitFile] = useState(null);
  const [splitRange, setSplitRange] = useState(defaults.splitRange);
  const [imageFiles, setImageFiles] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const activeModule = useMemo(
    () => pdfStudioModules.find((module) => module.id === activeTab) || pdfStudioModules[0],
    [activeTab],
  );

  const limitSummary = useMemo(() => getLimitSummary(), []);

  function resetStatus() {
    if (status.type !== "idle") {
      setStatus({ type: "idle", message: "" });
    }
  }

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    resetStatus();
  }

  async function runRequest({ endpoint, formData, filename, actionLabel }) {
    setIsProcessing(true);
    setStatus({ type: "processing", message: `${actionLabel}...` });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong. Please try again.";
        try {
          const data = await response.json();
          errorMessage = data?.message || errorMessage;
        } catch {
          // ignore
        }
        setStatus({ type: "error", message: errorMessage });
        return;
      }

      const blob = await response.blob();
      triggerDownload(blob, filename);
      setStatus({ type: "success", message: "Your PDF is ready to download." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed.";
      setStatus({ type: "error", message });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleMerge() {
    if (mergeFiles.length < 2) {
      setStatus({ type: "error", message: "Add at least two PDFs to merge." });
      return;
    }

    const formData = new FormData();
    mergeFiles.forEach((file) => formData.append("files", file));

    await runRequest({
      endpoint: "/api/tools/pdf-studio/merge",
      formData,
      filename: buildDownloadName("pdf-studio-merge"),
      actionLabel: "Merging PDFs",
    });
  }

  async function handleSplit() {
    if (!splitFile) {
      setStatus({ type: "error", message: "Upload a PDF to split." });
      return;
    }

    if (!splitRange.trim()) {
      setStatus({ type: "error", message: "Enter the page range to extract." });
      return;
    }

    const formData = new FormData();
    formData.append("files", splitFile);
    formData.append("pages", splitRange);

    await runRequest({
      endpoint: "/api/tools/pdf-studio/split",
      formData,
      filename: buildDownloadName("pdf-studio-split"),
      actionLabel: "Splitting PDF",
    });
  }

  async function handleImageToPdf() {
    if (imageFiles.length === 0) {
      setStatus({ type: "error", message: "Add at least one image to convert." });
      return;
    }

    const formData = new FormData();
    imageFiles.forEach((file) => formData.append("files", file));

    await runRequest({
      endpoint: "/api/tools/pdf-studio/image-to-pdf",
      formData,
      filename: buildDownloadName("pdf-studio-images"),
      actionLabel: "Generating PDF",
    });
  }

  return (
    <section className="tool-page pdf-studio">
      <header className="tool-header">
        <div>
          <p className="tool-kicker">PDF Studio</p>
          <h1>PDF Studio</h1>
          <p>Merge, split, and convert PDFs in one workspace.</p>
        </div>
        <span className="tool-status">Server-side processing</span>
      </header>

      <div className="pdf-tabs" role="tablist" aria-label="PDF Studio modules">
        {pdfStudioModules.map((module) => (
          <button
            key={module.id}
            type="button"
            className={`pdf-tab ${activeTab === module.id ? "active" : ""}`}
            onClick={() => handleTabChange(module.id)}
          >
            {module.id === "merge" && <Layers className="w-4 h-4" />}
            {module.id === "split" && <Scissors className="w-4 h-4" />}
            {module.id === "image" && <ImageIcon className="w-4 h-4" />}
            <span>{module.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-panel pdf-workspace">
        <div className="pdf-module-header">
          <div>
            <h2>{activeModule.label}</h2>
            <p>{activeModule.description}</p>
          </div>
          <span className="pdf-limit">{limitSummary}</span>
        </div>

        {activeTab === "merge" && (
          <div className="pdf-module-body">
            <DropzoneUploader
              title="Drop PDFs here or click to upload"
              subtitle="Upload at least two files to merge."
              helper={activeModule.helper}
              accept={PDF_STUDIO_ACCEPT_CONFIG.pdf}
              multiple
              maxFiles={PDF_STUDIO_LIMITS.maxFiles}
              maxSize={PDF_STUDIO_LIMITS.maxFileSizeBytes}
              files={mergeFiles}
              onChange={(next) => {
                setMergeFiles(next);
                resetStatus();
              }}
              allowReorder
              hint="Drag to reorder using the arrows."        
            />

            <div className="pdf-action-row">
              <button
                type="button"
                className="btn-cta-green flex items-center gap-2"
                onClick={handleMerge}
                disabled={isProcessing}
              >
                {isProcessing && <InlineSpinner />}
                {isProcessing ? "Merging..." : "Merge PDFs"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "split" && (
          <div className="pdf-module-body">
            <DropzoneUploader
              title="Upload the PDF you want to split"
              subtitle="Extract a specific range of pages."
              helper={activeModule.helper}
              accept={PDF_STUDIO_ACCEPT_CONFIG.pdf}
              multiple={false}
              maxFiles={1}
              maxSize={PDF_STUDIO_LIMITS.maxFileSizeBytes}
              files={splitFile ? [splitFile] : []}
              onChange={(next) => {
                setSplitFile(next[0] || null);
                resetStatus();
              }}
            />

            <div className="pdf-range">
              <label htmlFor="pdf-range" className="pdf-range-label">Page range</label>
              <input
                id="pdf-range"
                value={splitRange}
                onChange={(event) => setSplitRange(event.target.value)}
                placeholder="1-3,5"
                className="pdf-range-input"
              />
            </div>

            <div className="pdf-action-row">
              <button
                type="button"
                className="btn-cta-green flex items-center gap-2"
                onClick={handleSplit}
                disabled={isProcessing}
              >
                {isProcessing && <InlineSpinner />}
                {isProcessing ? "Splitting..." : "Split PDF"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "image" && (
          <div className="pdf-module-body">
            <DropzoneUploader
              title="Drop images here or click to upload"
              subtitle="PNG and JPG images are supported."
              helper={activeModule.helper}
              accept={PDF_STUDIO_ACCEPT_CONFIG.image}
              multiple
              maxFiles={PDF_STUDIO_LIMITS.maxFiles}
              maxSize={PDF_STUDIO_LIMITS.maxFileSizeBytes}
              files={imageFiles}
              onChange={(next) => {
                setImageFiles(next);
                resetStatus();
              }}
            />

            <div className="pdf-action-row">
              <button
                type="button"
                className="btn-cta-green flex items-center gap-2"
                onClick={handleImageToPdf}
                disabled={isProcessing}
              >
                {isProcessing && <InlineSpinner />}
                {isProcessing ? "Converting..." : "Convert to PDF"}
              </button>
            </div>
          </div>
        )}

        {status.type !== "idle" && (
          <div className={`pdf-status ${status.type}`}>
            <span>{status.message}</span>
          </div>
        )}
      </div>
    </section>
  );
}
