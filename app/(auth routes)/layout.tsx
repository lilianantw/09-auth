"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    // Обновляем маршрутизатор при монтировании
    router.refresh();
  }, [router]);

  return <main>{children}</main>;
}
