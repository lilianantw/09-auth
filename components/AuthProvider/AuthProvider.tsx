"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser, checkSession } from "@/lib/api/clientApi";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verifyAuth() {
      try {
        // 1. Перевіряємо чи є валідна сесія
        const sessionValid = await checkSession();

        if (sessionValid) {
          // 2. Якщо є сесія — отримуємо користувача
          const user = await getCurrentUser();

          if (user) {
            setUser(user);

            if (
              pathname.startsWith("/sign-in") ||
              pathname.startsWith("/sign-up")
            ) {
              router.replace("/profile");
            }
          } else {
            clearIsAuthenticated();
          }
        } else {
          clearIsAuthenticated();

          if (pathname.startsWith("/profile")) {
            router.replace("/sign-in");
          }
        }
      } catch {
        clearIsAuthenticated();
        if (pathname.startsWith("/profile")) {
          router.replace("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    }

    verifyAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
