import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * Парсер строки Set-Cookie -> { name, value, options }
 * Поддерживает основные атрибуты: Path, Expires, Max-Age, HttpOnly, Secure, SameSite
 */
function parseSetCookie(cookieStr: string) {
  const parts = cookieStr.split(";").map((p) => p.trim());
  const [nameValue, ...attrs] = parts;
  const eqIndex = nameValue.indexOf("=");
  const name = nameValue.substring(0, eqIndex);
  const value = nameValue.substring(eqIndex + 1);

  const options: {
    path?: string;
    expires?: Date;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  } = {};

  for (const attr of attrs) {
    const [kRaw, ...vParts] = attr.split("=");
    const k = kRaw.toLowerCase();
    const v = vParts.join("=");

    if (k === "path") options.path = v;
    else if (k === "expires") {
      const date = new Date(v);
      if (!Number.isNaN(date.getTime())) options.expires = date;
    } else if (k === "max-age") {
      const n = Number(v);
      if (!Number.isNaN(n)) options.maxAge = n;
    } else if (k === "httponly") options.httpOnly = true;
    else if (k === "secure") options.secure = true;
    else if (k === "samesite") {
      const val = v.toLowerCase();
      if (val === "lax" || val === "strict" || val === "none") {
        options.sameSite = val;
      }
    }
  }

  return { name, value, options };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Базовый URL бэкенда из env (без лишнего слэша)
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    const target = `${base}/auth/login`;

    // Передаём куки, которые пришли в запросе (если есть)
    const incomingCookie = req.headers.get("cookie") ?? "";

    const apiRes = await axios.post(target, body, {
      headers: {
        "Content-Type": "application/json",
        Cookie: incomingCookie,
      },
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: () => true, // будем обрабатывать статус сами
    });

    // Создаем NextResponse с телом и статусом от бэкенда
    const res = NextResponse.json(apiRes.data, { status: apiRes.status });

    // Если бэкенд установил Set-Cookie — копируем их в ответ
    const setCookieHeader = apiRes.headers?.["set-cookie"];
    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      for (const cookieStr of cookieArray) {
        const { name, value, options } = parseSetCookie(cookieStr);
        res.cookies.set({
          name,
          value: String(value ?? ""),
          path: options.path ?? "/",
          httpOnly: options.httpOnly ?? false,
          secure: options.secure ?? false,
          sameSite: options.sameSite,
          expires: options.expires,
          maxAge: options.maxAge,
        });
      }
    }

    return res;
  } catch (error: unknown) {
    // Если это axios-ошибка — вернём то, что вернул бэкенд (или 500)
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const data = error.response?.data ?? { message: error.message };
      return NextResponse.json(data, { status });
    }

    // Иначе — Internal Server Error
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
