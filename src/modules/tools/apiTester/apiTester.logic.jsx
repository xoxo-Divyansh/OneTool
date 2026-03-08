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
const API_TESTER_RUN_ENDPOINT = "/api/tools/api-tester/run";
const API_TESTER_HISTORY_ENDPOINT = "/api/tools/api-tester/history";

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

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(response, payload, fallback) {
  if (payload?.message) return payload.message;
  if (payload?.error) return payload.error;

  if (response.status === 401) {
    return "You must be logged in to use API Tester.";
  }

  if (response.status === 429) {
    return "Quota exceeded. Please wait for reset or upgrade your plan.";
  }

  return fallback;
}

export async function runApiRequest({ method, url, headers, body }) {
  const urlValidation = validateUrl(url);
  if (!urlValidation.ok) {
    return { ok: false, error: urlValidation.error };
  }

  const requestBody = buildRequestPayload({ method, headers, body });
  if (!requestBody.ok) {
    return { ok: false, error: requestBody.error };
  }

  try {
    const response = await fetch(API_TESTER_RUN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        method,
        url,
        headers,
        body: requestBody.body ?? "",
      }),
    });

    const payload = await parseJsonResponse(response);
    if (!response.ok) {
      return {
        ok: false,
        error: extractErrorMessage(response, payload, "Request failed"),
        status: response.status,
      };
    }

    return {
      ok: true,
      response: payload?.response,
      historyEntry: payload?.historyEntry ?? null,
      quota: payload?.quota ?? null,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network request failed",
    };
  }
}

function normalizeHistoryEntry(entry) {
  if (!entry) return null;

  const bodyText =
    typeof entry?.response?.bodyText === "string"
      ? entry.response.bodyText
      : typeof entry?.response?.bodyJson !== "undefined"
        ? JSON.stringify(entry.response.bodyJson, null, 2)
        : typeof entry?.response?.error === "string"
          ? entry.response.error
          : "";
  const contentType = entry?.response?.contentType ?? "";
  const parsedBody = parseResponseBody(bodyText, contentType);

  return {
    id: entry.id,
    title: entry.title,
    request: entry.request,
    response: {
      ...entry.response,
      ...parsedBody,
      bodyText,
    },
    meta: entry.meta,
    createdAt: entry.createdAt,
  };
}

export async function fetchApiHistory({ page = 1, pageSize = 10 } = {}) {
  try {
    const response = await fetch(
      `${API_TESTER_HISTORY_ENDPOINT}?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const payload = await parseJsonResponse(response);
    if (!response.ok) {
      return {
        ok: false,
        error: extractErrorMessage(response, payload, "Failed to load history"),
        status: response.status,
      };
    }

    return {
      ok: true,
      items: (payload?.items || []).map(normalizeHistoryEntry).filter(Boolean),
      page: payload?.page ?? page,
      pageSize: payload?.pageSize ?? pageSize,
      total: payload?.total ?? 0,
      hasMore: Boolean(payload?.hasMore),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to load history",
    };
  }
}
