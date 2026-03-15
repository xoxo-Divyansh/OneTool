import {
  getAuthenticatedUserId,
  unauthorizedResponse,
} from "@/lib/auth/requireAuth";
import { connectDB } from "@/lib/db/models/connect";
import ToolHistory from "@/lib/db/models/toolHistory.model";
import { NextResponse } from "next/server";
import { promises as dns } from "node:dns";
import net from "node:net";

const SUPPORTED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);
const DEFAULT_DAILY_LIMIT = 100;
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
]);
const BLOCKED_HOST_SUFFIXES = [
  ".local",
  ".internal",
  ".localhost",
];

function isPrivateIpv4(ip) {
  const parts = ip.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [a, b] = parts;

  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 192 && b === 0) return true;
  if (a === 198 && (b === 18 || b === 19)) return true;
  if (a === 203 && b === 0) return true;
  if (a >= 224) return true;

  return false;
}

function isPrivateIpv6(ip) {
  const normalized = ip.toLowerCase();

  if (normalized === "::1" || normalized === "::") return true;
  if (normalized.startsWith("fe80:")) return true;
  if (normalized.startsWith("fec0:")) return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("ff")) return true;
  if (normalized.startsWith("2001:db8:")) return true;

  return false;
}

function isPrivateIp(ip) {
  const version = net.isIP(ip);
  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) {
    if (ip.startsWith("::ffff:")) {
      const v4 = ip.slice(7);
      if (net.isIP(v4) === 4) {
        return isPrivateIpv4(v4);
      }
    }
    return isPrivateIpv6(ip);
  }
  return false;
}

async function resolveAndValidateHost(hostname) {
  if (!hostname || typeof hostname !== "string") {
    return { ok: false, error: "Invalid host" };
  }

  const normalized = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(normalized)) {
    return { ok: false, error: "Blocked host" };
  }
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => normalized.endsWith(suffix))) {
    return { ok: false, error: "Blocked host" };
  }

  if (net.isIP(hostname)) {
    return isPrivateIp(hostname)
      ? { ok: false, error: "Blocked host" }
      : { ok: true };
  }

  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (!records || records.length === 0) {
      return { ok: false, error: "Unable to resolve host" };
    }

    for (const record of records) {
      if (isPrivateIp(record.address)) {
        return { ok: false, error: "Blocked host" };
      }
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Unable to resolve host" };
  }
}

function sanitizeHeaders(inputHeaders = {}) {
  const sanitized = {};
  const blocked = new Set(["host", "content-length", "cookie"]);

  for (const [key, rawValue] of Object.entries(inputHeaders)) {
    if (typeof key !== "string") continue;
    if (blocked.has(key.toLowerCase())) continue;

    const value =
      typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
    if (!key.trim()) continue;

    sanitized[key.trim()] = value;
  }

  return sanitized;
}

async function validateUrl(rawUrl) {
  if (typeof rawUrl !== "string" || rawUrl.trim().length === 0) {
    return { ok: false, error: "URL is required" };
  }

  try {
    const parsed = new URL(rawUrl.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { ok: false, error: "Only HTTP/HTTPS URLs are supported" };
    }
    const hostCheck = await resolveAndValidateHost(parsed.hostname);
    if (!hostCheck.ok) {
      return hostCheck;
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

async function enforceDailyLimit(userId) {
  const limit = Number(
    process.env.API_TESTER_DAILY_LIMIT || DEFAULT_DAILY_LIMIT,
  );
  const startOfWindow = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const used = await ToolHistory.countDocuments({
    userId,
    tool: "api-tester",
    createdAt: { $gte: startOfWindow },
  });

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    resetAt: new Date(
      startOfWindow.getTime() + 24 * 60 * 60 * 1000,
    ).toISOString(),
    exhausted: used >= limit,
  };
}

export async function POST(req) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return unauthorizedResponse();
  }

  await connectDB();

  const quota = await enforceDailyLimit(userId);
  if (quota.exhausted) {
    return NextResponse.json(
      {
        success: false,
        message: "Daily API Tester quota reached. Please try again later.",
        quota,
      },
      { status: 429 },
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const method = String(payload?.method || "GET").toUpperCase();
  const urlValidation = await validateUrl(payload?.url);
  const headers = sanitizeHeaders(payload?.headers);
  const bodyText = typeof payload?.body === "string" ? payload.body : "";

  if (!SUPPORTED_METHODS.has(method)) {
    return NextResponse.json(
      { success: false, message: "Unsupported HTTP method" },
      { status: 400 },
    );
  }

  if (!urlValidation.ok) {
    return NextResponse.json(
      { success: false, message: urlValidation.error },
      { status: 400 },
    );
  }

  const requestInit = {
    method,
    headers,
    redirect: "manual",
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

    const responseData = {
      status: upstream.status,
      statusText: upstream.statusText,
      ok: upstream.ok,
      durationMs,
      headers: responseHeaders,
      contentType,
      sizeBytes: new TextEncoder().encode(rawText).length,
      ...parsedBody,
    };

    const history = await ToolHistory.create({
      userId,
      tool: "api-tester",
      title: `${method} ${urlValidation.normalized}`,
      input: {
        method,
        url: urlValidation.normalized,
        headers,
        body: bodyText,
      },
      output: responseData,
      meta: {
        duration: durationMs,
        status: upstream.ok ? "success" : "error",
      },
    });

    return NextResponse.json({
      success: true,
      response: responseData,
      historyEntry: {
        id: history._id.toString(),
        title: history.title,
        request: history.input,
        response: history.output,
        createdAt: history.createdAt,
      },
      quota: {
        ...quota,
        used: quota.used + 1,
        remaining: Math.max(0, quota.remaining - 1),
      },
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    const message = error instanceof Error ? error.message : "Request failed";

    await ToolHistory.create({
      userId,
      tool: "api-tester",
      title: `${method} ${urlValidation.normalized}`,
      input: {
        method,
        url: urlValidation.normalized,
        headers,
        body: bodyText,
      },
      output: {
        error: message,
        durationMs,
      },
      meta: {
        duration: durationMs,
        status: "error",
      },
    });

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 502 },
    );
  }
}
