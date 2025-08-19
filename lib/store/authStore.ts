// lib/store/authStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Встановлюємо користувача після успішного логіну або отримання сесії
      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // Очищаємо стан при логауті
      clearIsAuthenticated: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // ключ для localStorage
    }
  )
);
