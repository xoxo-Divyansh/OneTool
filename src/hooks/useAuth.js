"use client";

import { useAuthStore } from "@/store/auth.store";
import { useEffect } from "react";

export function useAuth() {
  const { user, loading, login, logout, register, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { user, loading, login, logout, register };
}
