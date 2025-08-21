"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { getCurrentUser, checkSession } from "@/lib/api/clientApi";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setAuth, clearAuth } = useAuthStore(); // обновлено под новый store
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function verifyAuth() {
      try {
        const sessionValid = await checkSession();

        if (sessionValid) {
          const user = await getCurrentUser();
          if (user) {
            setAuth(user);
            if (
              pathname.startsWith("/sign-in") ||
              pathname.startsWith("/sign-up")
            ) {
              router.replace("/profile");
            }
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
          if (pathname.startsWith("/profile")) router.replace("/sign-in");
        }
      } catch {
        clearAuth();
        if (pathname.startsWith("/profile")) router.replace("/sign-in");
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
