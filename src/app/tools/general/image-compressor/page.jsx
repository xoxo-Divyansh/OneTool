"use client";

import { useEffect, useMemo, useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

function readImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to read image."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Compression failed."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

export default function ImageCompressorPage() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(75);
  const [compressedBlob, setCompressedBlob] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const originalUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  const compressedUrl = useMemo(() => {
    if (!compressedBlob) return "";
    return URL.createObjectURL(compressedBlob);
  }, [compressedBlob]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setCompressedBlob(null);
    setError("");
  };

  const handleCompress = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    try {
      setError("");
      setIsProcessing(true);

      const image = await readImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas is not supported in this browser.");
      }

      context.drawImage(image, 0, 0);
      const blob = await canvasToBlob(canvas, "image/jpeg", quality / 100);
      setCompressedBlob(blob);
    } catch (compressionError) {
      setError(compressionError.message || "Could not compress this image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadName = file ? `compressed-${file.name.replace(/\.[^.]+$/, "")}.jpg` : "compressed.jpg";

  return (
    <ToolLayout
      title="Image Compressor"
      description="Upload an image, choose quality, compress it, and download the result."
    >
      <div className="dashboard-panel">
        <label htmlFor="image-upload" className="block text-sm text-slate-300 mb-2">
          Upload image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="search-input w-full"
        />

        <div className="mt-5">
          <label htmlFor="quality-range" className="block text-sm text-slate-300 mb-2">
            Compression quality: {quality}%
          </label>
          <input
            id="quality-range"
            type="range"
            min="20"
            max="95"
            step="5"
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={handleCompress} className="btn-cta-green" disabled={isProcessing}>
            {isProcessing ? "Compressing..." : "Compress image"}
          </button>
          {compressedUrl ? (
            <a href={compressedUrl} download={downloadName} className="btn-cta-dark">
              Download image
            </a>
          ) : null}
        </div>

        {error ? (
          <p className="tool-error mt-4">
            <span>{error}</span>
          </p>
        ) : null}
      </div>

      <div className="tool-grid">
        <div className="dashboard-panel">
          <h2 className="m-0 mb-3">Original</h2>
          {originalUrl ? (
            <img src={originalUrl} alt="Original preview" className="w-full rounded-xl border border-slate-700/70" />
          ) : (
            <p className="dashboard-subtitle">No image selected.</p>
          )}
          {file ? <p className="dashboard-subtitle mt-3">Size: {(file.size / 1024).toFixed(1)} KB</p> : null}
        </div>

        <div className="dashboard-panel">
          <h2 className="m-0 mb-3">Compressed</h2>
          {compressedUrl ? (
            <img
              src={compressedUrl}
              alt="Compressed preview"
              className="w-full rounded-xl border border-slate-700/70"
            />
          ) : (
            <p className="dashboard-subtitle">Compress an image to preview it here.</p>
          )}
          {compressedBlob ? (
            <p className="dashboard-subtitle mt-3">Size: {(compressedBlob.size / 1024).toFixed(1)} KB</p>
          ) : null}
        </div>
      </div>
    </ToolLayout>
  );
}

