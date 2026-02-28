import { cookies } from "next/headers";

export function setAuthCookies(accessToken, refreshToken) {
  const cookieStore = cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
