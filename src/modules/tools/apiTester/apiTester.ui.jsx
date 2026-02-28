"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  buildHeadersObject,
  createHeaderRow,
  HTTP_METHODS,
  sendRequest,
} from "@/modules/tools/apiTester/apiTester.logic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

function formatHeadersForView(headers) {
  return Object.entries(headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

export default function ApiTesterUI({ defaults }) {
  const [method, setMethod] = useState(defaults.method);
  const [url, setUrl] = useState(defaults.url);
  const [body, setBody] = useState(defaults.body);
  const [headers, setHeaders] = useState(defaults.headers);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [requestError, setRequestError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [activeResponseTab, setActiveResponseTab] = useState("body");

  const responseBodyView = useMemo(() => {
    if (!responseData) return "";
    return responseData.bodyText || "";
  }, [responseData]);

  const responseHeadersView = useMemo(() => {
    if (!responseData) return "";
    return formatHeadersForView(responseData.headers);
  }, [responseData]);

  function updateHeader(id, field, value) {
    setHeaders((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        return { ...row, [field]: value };
      })
    );
  }

  function addHeaderRow() {
    setHeaders((prev) => [...prev, createHeaderRow()]);
  }

  function removeHeaderRow(id) {
    setHeaders((prev) => prev.filter((row) => row.id !== id));
  }

  function onClear() {
    setUrl("");
    setBody("");
    setHeaders([createHeaderRow()]);
    setResponseData(null);
    setRequestError("");
    setStatus("Cleared");
  }

  function onLoadSample() {
    setMethod("GET");
    setUrl(defaults.url);
    setBody(defaults.body);
    setHeaders(defaults.headers);
    setRequestError("");
    setStatus("Sample loaded");
  }

  async function onSend() {
    setIsSending(true);
    setRequestError("");
    setStatus("Sending request...");

    const result = await sendRequest({
      method,
      url,
      headers: buildHeadersObject(headers),
      body,
    });

    if (!result.ok) {
      setRequestError(result.error);
      setResponseData(null);
      setStatus("Request failed");
      setIsSending(false);
      return;
    }

    setResponseData(result.response);
    setStatus("Response received");
    setIsSending(false);
  }

  return (
    <section className="tool-page">
      <header className="tool-header">
        <div>
          <h1>API Tester</h1>
          <p>Send requests, inspect responses, and iterate faster.</p>
        </div>
        <span className="tool-status">{status}</span>
      </header>

      <div className="tool-actions">
        <button type="button" className="btn-cta-green" onClick={onSend} disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
        <button type="button" className="cmd-btn" onClick={onLoadSample}>
          Load Sample
        </button>
        <button type="button" className="cmd-btn" onClick={onClear}>
          Clear
        </button>
      </div>

      {requestError ? <p className="tool-error">{requestError}</p> : null}

      <div className="api-grid">
        <section className="api-panel">
          <h2>Request Builder</h2>

          <div className="api-request-line">
            <select
              className="api-select"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              className="api-url-input"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://api.example.com/v1/items"
            />
          </div>

          <div className="api-subpanel">
            <div className="api-subpanel-head">
              <h3>Headers</h3>
              <button type="button" className="cmd-btn" onClick={addHeaderRow}>
                Add Header
              </button>
            </div>

            <div className="api-headers">
              {headers.map((row) => (
                <div key={row.id} className="api-header-row">
                  <input
                    value={row.key}
                    onChange={(event) => updateHeader(row.id, "key", event.target.value)}
                    placeholder="Header key"
                  />
                  <input
                    value={row.value}
                    onChange={(event) => updateHeader(row.id, "value", event.target.value)}
                    placeholder="Header value"
                  />
                  <button
                    type="button"
                    className="api-remove-header"
                    onClick={() => removeHeaderRow(row.id)}
                    aria-label="Remove header row"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="api-subpanel">
            <h3>Body</h3>
            <MonacoEditor
              height="260px"
              defaultLanguage="json"
              value={body}
              onChange={(nextValue) => setBody(nextValue ?? "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
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
        </section>

        <section className="api-panel">
          <h2>Response Inspector</h2>

          {responseData ? (
            <>
              <div className="api-metrics">
                <span className={`api-badge ${responseData.ok ? "success" : "error"}`}>
                  {responseData.status} {responseData.statusText}
                </span>
                <span>{responseData.durationMs} ms</span>
                <span>{responseData.sizeBytes} bytes</span>
              </div>

              <div className="api-tabs">
                <button
                  type="button"
                  className={activeResponseTab === "body" ? "active" : ""}
                  onClick={() => setActiveResponseTab("body")}
                >
                  Body
                </button>
                <button
                  type="button"
                  className={activeResponseTab === "headers" ? "active" : ""}
                  onClick={() => setActiveResponseTab("headers")}
                >
                  Headers
                </button>
              </div>

              <div className="api-response-view">
                {activeResponseTab === "body" ? (
                  <MonacoEditor
                    height="430px"
                    defaultLanguage={responseData.isJson ? "json" : "plaintext"}
                    value={responseBodyView}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                ) : (
                  <MonacoEditor
                    height="430px"
                    defaultLanguage="plaintext"
                    value={responseHeadersView}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                    }}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="json-helper-panel">
              <p>Send a request to inspect response body, status, and headers.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
