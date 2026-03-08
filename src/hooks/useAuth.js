"use client";

import { useAuthStore } from "@/store/auth.store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { user, loading, login, logout, register, hydrate } = useAuthStore();
  const pathname = usePathname() || "";

  useEffect(() => {
    const isProtectedPath =
      pathname.startsWith("/dashboard") || pathname.startsWith("/tools");

    if (isProtectedPath) {
      hydrate().catch(() => {});
    }
  }, [hydrate, pathname]);

  return { user, loading, login, logout, register };
}
