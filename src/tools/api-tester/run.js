const SUPPORTED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

function sanitizeHeaders(inputHeaders = {}) {
  const sanitized = {};
  const blocked = new Set(["host", "content-length", "cookie"]);

  for (const [key, rawValue] of Object.entries(inputHeaders)) {
    if (typeof key !== "string") continue;
    if (blocked.has(key.toLowerCase())) continue;

    const value = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
    if (!key.trim()) continue;

    sanitized[key.trim()] = value;
  }

  return sanitized;
}

function validateUrl(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
    return { ok: false, error: "URL is required" };
  }

  try {
    const parsed = new URL(rawUrl.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { ok: false, error: "Only HTTP/HTTPS URLs are supported" };
    }
    return { ok: true, normalized: parsed.toString() };
  } catch {
    return { ok: false, error: "Invalid URL format" };
  }
}

function parseResponseBody(text, contentType = "") {
  const lowerType = contentType.toLowerCase();

  if (lowerType.includes("application/json")) {
    try {
      const bodyJson = JSON.parse(text);
      return {
        isJson: true,
        bodyJson,
        bodyText: JSON.stringify(bodyJson, null, 2),
      };
    } catch {
      return { isJson: false, bodyJson: null, bodyText: text };
    }
  }

  return { isJson: false, bodyJson: null, bodyText: text };
}

export async function run(input) {
  const method = String(input?.method || "GET").toUpperCase();
  const urlValidation = validateUrl(input?.url);
  const headers = sanitizeHeaders(input?.headers);
  const bodyText = typeof input?.body === "string" ? input.body : "";

  if (!SUPPORTED_METHODS.has(method)) {
    return { ok: false, error: "Unsupported HTTP method" };
  }

  if (!urlValidation.ok) {
    return { ok: false, error: urlValidation.error };
  }

  const requestInit = {
    method,
    headers,
  };

  if (!["GET", "HEAD"].includes(method) && bodyText.trim().length > 0) {
    requestInit.body = bodyText;
  }

  const startedAt = Date.now();

  try {
    const upstream = await fetch(urlValidation.normalized, requestInit);
    const durationMs = Date.now() - startedAt;
    const responseHeaders = Object.fromEntries(upstream.headers.entries());
    const contentType = responseHeaders["content-type"] || "";
    const rawText = await upstream.text();
    const parsedBody = parseResponseBody(rawText, contentType);

    return {
      ok: true,
      response: {
        status: upstream.status,
        statusText: upstream.statusText,
        ok: upstream.ok,
        durationMs,
        headers: responseHeaders,
        contentType,
        sizeBytes: new TextEncoder().encode(rawText).length,
        ...parsedBody,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Request failed",
    };
  }
}

