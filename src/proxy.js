import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function getUserIdFromToken(token) {
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard/tools")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
