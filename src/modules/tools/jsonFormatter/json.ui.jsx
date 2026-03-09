"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { executeTool } from "@/core/tool-system/tool-engine";
import JsonTree from "@/modules/tools/jsonFormatter/tree/JsonTree";
import {
  getOffsetFromLineColumn,
  parseJson as parseInputJson,
} from "@/modules/tools/jsonFormatter/json.logic";
import {
  extractByJsonPath,
  printJson,
} from "@/modules/tools/jsonFormatter/tree/tree.utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function JsonFormatterUI({ defaults }) {
  const initialParsed = parseInputJson(defaults.input);

  const [input, setInput] = useState(defaults.input);
  const [output, setOutput] = useState(defaults.input);
  const [status, setStatus] = useState("Ready");
  const [errorInfo, setErrorInfo] = useState(null);
  const [parsedData, setParsedData] = useState(initialParsed.ok ? initialParsed.data : null);
  const [selectedPath, setSelectedPath] = useState("$");
  const [pathQuery, setPathQuery] = useState("$");
  const [pathResult, setPathResult] = useState("");
  const [pathError, setPathError] = useState("");
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

  function clearPathState() {
    setPathError("");
    setPathResult("");
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

  function parseInputForTooling() {
    const result = parseInputJson(input);

    if (!result.ok) {
      setStatus("Invalid JSON");
      setParsedData(null);
      applyErrorState(result);
      return null;
    }

    clearErrorState();
    setParsedData(result.data);
    return result.data;
  }

  async function runJsonFormatter(mode) {
    const result = await executeTool("json-formatter", input, { mode });

    if (!result.ok) {
      setStatus("Invalid JSON");
      setParsedData(null);
      applyErrorState(result);
      return;
    }

    clearErrorState();
    setParsedData(result.data);

    if (mode !== "validate") {
      setOutput(result.output ?? "");
    }

    setStatus(mode === "format" ? "Formatted" : mode === "minify" ? "Minified" : "Valid JSON");
    clearPathState();
  }

  function onFormat() {
    runJsonFormatter("format");
  }

  function onMinify() {
    runJsonFormatter("minify");
  }

  function onValidate() {
    runJsonFormatter("validate");
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
    setParsedData(null);
    setSelectedPath("$");
    setPathQuery("$");
    clearPathState();
    setStatus("Cleared");
    clearErrorState();
  }

  function onLoadSample() {
    setInput(defaults.input);
    setOutput(defaults.input);
    setSelectedPath("$");
    setPathQuery("$");
    const sampleParsed = parseInputJson(defaults.input);
    setParsedData(sampleParsed.ok ? sampleParsed.data : null);
    clearPathState();
    setStatus("Sample loaded");
    clearErrorState();
  }

  function onInputChange(nextValue) {
    setInput(nextValue ?? "");
    setParsedData(null);
    clearPathState();
    if (errorInfo) {
      clearErrorState();
    }
    setStatus("Editing");
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

  async function onCopyPath(path) {
    try {
      await navigator.clipboard.writeText(path);
      setStatus(`Path copied: ${path}`);
    } catch {
      setStatus("Path copy failed");
    }
  }

  function onRunPathQuery() {
    const data = parseInputForTooling();
    if (!data) return;

    const result = extractByJsonPath(data, pathQuery);

    if (!result.ok) {
      setPathError(result.error);
      setPathResult("");
      setStatus("Path failed");
      return;
    }

    setPathError("");
    setPathResult(printJson(result.value));
    setStatus("Path resolved");
  }

  function onUseSelectedPath() {
    setPathQuery(selectedPath || "$");
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

      {parsedData ? (
        <div className="json-tool-lower-grid">
          <JsonTree
            data={parsedData}
            selectedPath={selectedPath}
            onSelectPath={setSelectedPath}
            onCopyPath={onCopyPath}
          />

          <section className="json-path-panel">
            <header className="json-path-header">
              <h2>JSON Path Engine</h2>
              <p>Extract nested values quickly from the parsed tree.</p>
            </header>

            <div className="json-path-controls">
              <input
                className="json-path-input"
                value={pathQuery}
                onChange={(event) => setPathQuery(event.target.value)}
                placeholder="$.user.skills[0]"
              />
              <button type="button" className="btn-cta-green" onClick={onRunPathQuery}>
                Run Path
              </button>
              <button type="button" className="cmd-btn" onClick={onUseSelectedPath}>
                Use Selected Path
              </button>
            </div>

            {pathError ? <p className="tool-error">{pathError}</p> : null}

            <div className="json-path-result">
              <span>Result</span>
              <pre>{pathResult || "Run a path query to view extracted JSON."}</pre>
            </div>
          </section>
        </div>
      ) : (
        <section className="json-helper-panel">
          <p>Valid JSON is required to render tree viewer and path engine.</p>
        </section>
      )}
    </section>
  );
}
