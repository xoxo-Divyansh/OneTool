import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";

export async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifyToken(token);
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

export function unauthorizedResponse(message = "Authentication required") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}