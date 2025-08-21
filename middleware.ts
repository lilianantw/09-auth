import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

interface CookieWithOptions {
  name: string;
  value: string | undefined;
  options?: Partial<ResponseCookie>;
}

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies(); // ✅ додали await
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isPrivatePage =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const session = await checkSession(accessToken, refreshToken);

  if (!session.valid && isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (session.valid && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const res = NextResponse.next();
  if (session.cookies) {
    session.cookies.forEach((cookie: CookieWithOptions) => {
      // Only set the cookie if the value is not undefined
      if (cookie.value !== undefined) {
        res.cookies.set(cookie.name, cookie.value, cookie.options);
      }
    });
  }

  return res;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
