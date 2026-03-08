import { NextResponse } from "next/server";

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
  return atob(padded);
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  let userId = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const decoded = decodeBase64Url(parts[1]);
        const payload = JSON.parse(decoded);
        userId = payload?.id ?? null;
      }
    } catch {
      userId = null;
    }
  }

  if (!userId) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tools/:path*"],
};
