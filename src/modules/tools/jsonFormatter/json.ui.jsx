"use client";

import { useMemo, useState } from "react";
import {
  minifyJson,
  parseJson,
  prettifyJson,
} from "@/modules/tools/jsonFormatter/json.logic";

export default function JsonFormatterUI({ defaults }) {
  const [input, setInput] = useState(defaults.input);
  const [output, setOutput] = useState(defaults.input);
  const [status, setStatus] = useState("Ready");
  const [errorInfo, setErrorInfo] = useState(null);

  const isOutputEmpty = useMemo(() => output.trim().length === 0, [output]);

  function clearError() {
    setErrorInfo(null);
  }

  function onFormat() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      setErrorInfo(result);
      return;
    }

    setOutput(prettifyJson(result.data));
    setStatus("Formatted");
    clearError();
  }

  function onMinify() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      setErrorInfo(result);
      return;
    }

    setOutput(minifyJson(result.data));
    setStatus("Minified");
    clearError();
  }

  function onValidate() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      setErrorInfo(result);
      return;
    }

    setStatus("Valid JSON");
    clearError();
  }

  async function onCopyOutput() {
    if (isOutputEmpty) return;

    try {
      await navigator.clipboard.writeText(output);
      setStatus("Output copied");
      clearError();
    } catch {
      setStatus("Copy failed");
    }
  }

  function onClear() {
    setInput("");
    setOutput("");
    setStatus("Cleared");
    clearError();
  }

  function onLoadSample() {
    setInput(defaults.input);
    setOutput(defaults.input);
    setStatus("Sample loaded");
    clearError();
  }

  return (
    <section className="tool-page">
      <header className="tool-header">
        <div>
          <h1>JSON Formatter</h1>
          <p>Validate, pretty-print, and minify JSON payloads.</p>
        </div>
        <span className="tool-status">{status}</span>
      </header>

      <div className="tool-actions">
        <button type="button" className="btn-cta-red" onClick={onFormat}>
          Format
        </button>
        <button type="button" className="btn-cta-green" onClick={onMinify}>
          Minify
        </button>
        <button type="button" className="cmd-btn" onClick={onValidate}>
          Validate
        </button>
        <button type="button" className="cmd-btn" onClick={onCopyOutput}>
          Copy Output
        </button>
        <button type="button" className="cmd-btn" onClick={onLoadSample}>
          Load Sample
        </button>
        <button type="button" className="cmd-btn" onClick={onClear}>
          Clear
        </button>
      </div>

      {errorInfo ? (
        <p className="tool-error">
          {errorInfo.error}
          {errorInfo.line && errorInfo.column
            ? ` (line ${errorInfo.line}, col ${errorInfo.column})`
            : ""}
        </p>
      ) : null}

      <div className="tool-grid">
        <label className="tool-block">
          <span>Input JSON</span>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder='{"example":"value"}'
            spellCheck={false}
          />
        </label>

        <label className="tool-block">
          <span>Output</span>
          <textarea
            className="tool-textarea tool-textarea-readonly"
            value={output}
            readOnly
            spellCheck={false}
          />
        </label>
      </div>
    </section>
  );
}
