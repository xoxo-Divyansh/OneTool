"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUp,
  ArrowDown,
  HardDrive,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Zap,
} from "lucide-react";

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getRejectionMessage(rejections, { maxFiles, maxSize } = {}) {
  if (!rejections || rejections.length === 0) return "";
  const error = rejections[0]?.errors?.[0];
  if (!error) return "Unsupported file.";

  switch (error.code) {
    case "file-invalid-type":
      return "Unsupported file type.";
    case "too-many-files":
      return `Upload up to ${maxFiles} files at a time.`;
    case "file-too-large":
      return maxSize
        ? `Each file must be under ${Math.round(maxSize / 1024 / 1024)}MB.`
        : "File is too large.";
    default:
      return error.message || "File could not be added.";
  }
}

const DEFAULT_TRUST_ITEMS = [
  {
    id: "fast",
    label: "Fast Processing",
    tooltip: "Files are processed on optimized servers for faster performance.",
    icon: Zap,
  },
  {
    id: "secure",
    label: "Secure Handling",
    tooltip: "Files are processed securely and automatically removed after processing.",
    icon: ShieldCheck,
  },
  {
    id: "large",
    label: "Large Files Supported",
    tooltip: "Server processing supports up to 20MB per file for this tool.",
    icon: HardDrive,
  },
];

export default function DropzoneUploader({
  title,
  subtitle,
  helper,
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize,
  files = [],
  onChange,
  allowReorder = false,
  hint,
  privacyNote = "Files are processed securely and not stored.",
  showTrust = true,
  trustItems = DEFAULT_TRUST_ITEMS,
}) {
  const [localError, setLocalError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      setLocalError("");
      const rejectionMessage = getRejectionMessage(fileRejections, { maxFiles, maxSize });
      if (rejectionMessage) {
        setLocalError(rejectionMessage);
      }

      if (!acceptedFiles.length) return;

      if (!multiple) {
        onChange(acceptedFiles.slice(0, 1));
        return;
      }

      const next = [...files, ...acceptedFiles];
      if (next.length > maxFiles) {
        setLocalError(`Only the first ${maxFiles} files were added.`);
        onChange(next.slice(0, maxFiles));
        return;
      }

      onChange(next);
    },
    [files, maxFiles, maxSize, multiple, onChange],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
    maxSize,
  });

  const dropzoneClass = useMemo(() => {
    if (isDragReject) return "pdf-dropzone is-reject";
    if (isDragActive) return "pdf-dropzone is-active";
    return "pdf-dropzone";
  }, [isDragActive, isDragReject]);

  const showList = files && files.length > 0;

  function removeFile(index) {
    const next = files.filter((_, idx) => idx !== index);
    onChange(next);
  }

  function moveFile(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const next = [...files];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    onChange(next);
  }

  return (
    <div className="pdf-uploader">
      <div {...getRootProps({ className: dropzoneClass })}>
        <input {...getInputProps()} />
        <div>
          <p className="pdf-drop-title">{title}</p>
          <p className="pdf-drop-subtitle">{subtitle}</p>
          {hint ? <p className="pdf-drop-hint">{hint}</p> : null}
        </div>
        <UploadCloud className="w-5 h-5" />
      </div>

      {localError ? <p className="pdf-inline-error">{localError}</p> : null}

      {showTrust && trustItems?.length ? (
        <div className="pdf-trustbar" aria-label="PDF Studio trust indicators">
          {trustItems.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.id}
                className="pdf-trust-badge"
                data-tooltip={item.tooltip}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </span>
            );
          })}
        </div>
      ) : null}

      {showList && (
        <div className="pdf-file-list">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="pdf-file-item">
              <div>
                <p className="pdf-file-name">{file.name}</p>
                <span className="pdf-file-size">{formatBytes(file.size)}</span>
              </div>
              <div className="pdf-file-actions">
                {allowReorder ? (
                  <>
                    <button
                      type="button"
                      className="pdf-move-btn"
                      onClick={() => moveFile(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="pdf-move-btn"
                      onClick={() => moveFile(index, 1)}
                      disabled={index === files.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="pdf-file-remove"
                  onClick={() => removeFile(index)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pdf-uploader-footer">
        <p className="pdf-helper">{helper}</p>
        <span className="pdf-privacy">{privacyNote}</span>
      </div>
    </div>
  );
}
