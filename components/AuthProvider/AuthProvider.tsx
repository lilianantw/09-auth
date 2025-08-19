"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // емуляція перевірки сесії (наприклад, перевірка токена в cookies чи localStorage)
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (!token && pathname.startsWith("/profile")) {
      clearIsAuthenticated();
      router.push("/sign-in");
    }

    setLoading(false);
  }, [pathname, clearIsAuthenticated, router]);

  if (loading) {
    return <p>Loading...</p>; // тут можна підключити свій спінер
  }

  return <>{children}</>;
}
