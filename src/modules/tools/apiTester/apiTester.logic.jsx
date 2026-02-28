export const apiTesterDefaults = {
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/todos/1",
  body: '{\n  "title": "Buy milk",\n  "completed": false\n}',
  headers: [
    { id: "header-1", key: "Accept", value: "application/json" },
    { id: "header-2", key: "Content-Type", value: "application/json" },
  ],
};

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export function createHeaderRow() {
  return {
    id: `header-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    key: "",
    value: "",
  };
}

export function validateUrl(url) {
  if (!url || url.trim().length === 0) {
    return { ok: false, error: "URL is required" };
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { ok: false, error: "Only HTTP/HTTPS URLs are supported" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Invalid URL format" };
  }
}

export function buildHeadersObject(headerRows) {
  const headers = {};

  for (const row of headerRows) {
    const key = row.key.trim();
    const value = row.value.trim();

    if (!key) continue;
    headers[key] = value;
  }

  return headers;
}

function methodSupportsBody(method) {
  return !["GET", "HEAD"].includes(method);
}

function shouldTreatAsJson(body, headers) {
  const contentTypeHeader = Object.keys(headers).find(
    (key) => key.toLowerCase() === "content-type"
  );

  if (!contentTypeHeader) return false;
  const value = headers[contentTypeHeader].toLowerCase();
  return value.includes("application/json");
}

export function buildRequestPayload({ method, headers, body }) {
  if (!methodSupportsBody(method) || body.trim().length === 0) {
    return { ok: true, body: undefined };
  }

  if (shouldTreatAsJson(body, headers)) {
    try {
      const parsed = JSON.parse(body);
      return { ok: true, body: JSON.stringify(parsed) };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? `Invalid JSON body: ${error.message}` : "Invalid JSON body",
      };
    }
  }

  return { ok: true, body };
}

function parseResponseBody(text, contentType = "") {
  const lower = contentType.toLowerCase();

  if (lower.includes("application/json")) {
    try {
      const json = JSON.parse(text);
      return {
        isJson: true,
        bodyJson: json,
        bodyText: JSON.stringify(json, null, 2),
      };
    } catch {
      return { isJson: false, bodyJson: null, bodyText: text };
    }
  }

  return { isJson: false, bodyJson: null, bodyText: text };
}

export async function sendRequest({ method, url, headers, body }) {
  const urlValidation = validateUrl(url);
  if (!urlValidation.ok) {
    return { ok: false, error: urlValidation.error };
  }

  const requestBody = buildRequestPayload({ method, headers, body });
  if (!requestBody.ok) {
    return { ok: false, error: requestBody.error };
  }

  const start = performance.now();

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: requestBody.body,
      credentials: "include",
    });

    const durationMs = Math.round(performance.now() - start);
    const headersObj = Object.fromEntries(response.headers.entries());
    const contentType = headersObj["content-type"] || "";
    const text = await response.text();
    const parsedBody = parseResponseBody(text, contentType);

    return {
      ok: true,
      response: {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        durationMs,
        headers: headersObj,
        contentType,
        sizeBytes: new TextEncoder().encode(text).length,
        ...parsedBody,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network request failed",
    };
  }
}
