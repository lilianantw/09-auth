"use client";
import { create } from "zustand";
import { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  clearIsAuthenticated: () =>
    set({ user: null, token: null, isAuthenticated: false }),
}));
