import * as authService from "@/services/auth.service";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user, loading: false }),
  clearUser: () => set({ user: null, loading: false }),
  setLoading: (loading) => set({ loading }),

  hydrate: async () => {
    set({ loading: true });
    try {
      const res = await authService.me();
      set({ user: res.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true });
    try {
      const res = await authService.login(payload);
      set({ user: res.user });
      return res;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true });
    try {
      const res = await authService.register(payload);
      set({ user: res.user });
      return res;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
