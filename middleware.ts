// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // беремо токен з cookies
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage = pathname.startsWith("/profile");

  // Якщо немає токена і користувач хоче відкрити приватну сторінку → редірект
  if (!token && isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Якщо є токен і користувач хоче відкрити sign-in або sign-up → редірект
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

// Вказуємо для яких маршрутів працює middleware
export const config = {
  matcher: ["/profile", "/sign-in", "/sign-up"],
};
