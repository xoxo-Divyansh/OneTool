"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  getOffsetFromLineColumn,
  minifyJson,
  parseJson,
  prettifyJson,
} from "@/modules/tools/jsonFormatter/json.logic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function JsonFormatterUI({ defaults }) {
  const [input, setInput] = useState(defaults.input);
  const [output, setOutput] = useState(defaults.input);
  const [status, setStatus] = useState("Ready");
  const [errorInfo, setErrorInfo] = useState(null);
  const [monacoApi, setMonacoApi] = useState(null);
  const [inputEditor, setInputEditor] = useState(null);

  const isOutputEmpty = useMemo(() => output.trim().length === 0, [output]);

  function clearErrorState() {
    setErrorInfo(null);
    if (!monacoApi || !inputEditor) return;

    const model = inputEditor.getModel();
    if (!model) return;

    monacoApi.editor.setModelMarkers(model, "json-formatter", []);
  }

  function applyErrorState(result) {
    setErrorInfo(result);

    if (!monacoApi || !inputEditor) return;

    const model = inputEditor.getModel();
    if (!model) return;

    if (!result?.line || !result?.column) {
      monacoApi.editor.setModelMarkers(model, "json-formatter", []);
      return;
    }

    monacoApi.editor.setModelMarkers(model, "json-formatter", [
      {
        startLineNumber: result.line,
        startColumn: result.column,
        endLineNumber: result.line,
        endColumn: result.column + 1,
        message: result.error,
        severity: monacoApi.MarkerSeverity.Error,
      },
    ]);
  }

  function handleInputMount(editor, monaco) {
    setInputEditor(editor);
    setMonacoApi(monaco);
  }

  function onFormat() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      applyErrorState(result);
      return;
    }

    setOutput(prettifyJson(result.data));
    setStatus("Formatted");
    clearErrorState();
  }

  function onMinify() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      applyErrorState(result);
      return;
    }

    setOutput(minifyJson(result.data));
    setStatus("Minified");
    clearErrorState();
  }

  function onValidate() {
    const result = parseJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      applyErrorState(result);
      return;
    }

    setStatus("Valid JSON");
    clearErrorState();
  }

  async function onCopyOutput() {
    if (isOutputEmpty) return;

    try {
      await navigator.clipboard.writeText(output);
      setStatus("Output copied");
      clearErrorState();
    } catch {
      setStatus("Copy failed");
    }
  }

  function onClear() {
    setInput("");
    setOutput("");
    setStatus("Cleared");
    clearErrorState();
  }

  function onLoadSample() {
    setInput(defaults.input);
    setOutput(defaults.input);
    setStatus("Sample loaded");
    clearErrorState();
  }

  function onInputChange(nextValue) {
    setInput(nextValue ?? "");
    if (errorInfo) {
      clearErrorState();
      setStatus("Editing");
    }
  }

  function onJumpToError() {
    if (!inputEditor || !errorInfo?.line || !errorInfo?.column) return;

    const offset = getOffsetFromLineColumn(input, errorInfo.line, errorInfo.column);
    if (offset === null) return;

    inputEditor.focus();
    inputEditor.setPosition({
      lineNumber: errorInfo.line,
      column: errorInfo.column,
    });
    inputEditor.revealPositionInCenter({
      lineNumber: errorInfo.line,
      column: errorInfo.column,
    });

    inputEditor.setSelection({
      startLineNumber: errorInfo.line,
      startColumn: errorInfo.column,
      endLineNumber: errorInfo.line,
      endColumn: errorInfo.column + 1,
    });
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
          {errorInfo.line && errorInfo.column ? (
            <button type="button" className="tool-error-jump" onClick={onJumpToError}>
              Jump to error
            </button>
          ) : null}
        </p>
      ) : null}

      <div className="tool-grid">
        <div className="tool-block">
          <span>Input JSON</span>
          <MonacoEditor
            height="420px"
            defaultLanguage="json"
            value={input}
            onChange={onInputChange}
            onMount={handleInputMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              glyphMargin: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: "on",
              guides: {
                indentation: true,
              },
            }}
          />
        </div>

        <div className="tool-block">
          <span>Output</span>
          <MonacoEditor
            height="420px"
            defaultLanguage="json"
            value={output}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2,
              wordWrap: "on",
              guides: {
                indentation: true,
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}
