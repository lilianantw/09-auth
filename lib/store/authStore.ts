// lib/store/authStore.ts
"use client";

import { create } from "zustand";
import { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

// Используем требуемый шаблон create<AuthStore>()(...)
export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user: User) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
