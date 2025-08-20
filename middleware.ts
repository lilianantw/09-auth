import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Допоміжна функція перевірки токена через бекенд
async function verifySession(token: string | undefined) {
  if (!token) return { valid: false };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `token=${token}` },
      credentials: "include",
    });

    if (res.ok) {
      // якщо бекенд повернув новий токен
      const setCookie = res.headers.get("set-cookie");
      return { valid: true, setCookie };
    }

    return { valid: false };
  } catch (err) {
    return { valid: false };
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isPrivatePage =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // 🔹 Перевіряємо токен через бекенд
  const session = await verifySession(token);

  // 🔹 Якщо немає валідного токена → редірект на /sign-in
  if (!session.valid && isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🔹 Якщо токен валідний і користувач заходить на sign-in / sign-up → редірект на /
  if (session.valid && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔹 Якщо бекенд повернув оновлений токен → додаємо його у відповідь
  const res = NextResponse.next();
  if (session.setCookie) {
    res.headers.set("set-cookie", session.setCookie);
  }

  return res;
}

export const config = {
  matcher: ["/profile", "/notes/:path*", "/sign-in", "/sign-up"],
};
