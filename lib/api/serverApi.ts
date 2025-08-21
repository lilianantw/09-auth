"use server";

import axios, { type AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { parse } from "cookie";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// Налаштований екземпляр Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api", // додаємо /api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ===== Користувач =====

// Отримати поточного користувача
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieStr = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const response = await api.get<User>("/users/me", {
      headers: { Cookie: cookieStr },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401)
      return null;
    throw error;
  }
}

// Оновити профіль користувача
export async function updateUserProfileServer(
  data: Partial<User>
): Promise<User> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await api.patch<User>("/users/me", data, {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

// Перевірити активну сесію
export async function checkSessionServer(): Promise<AxiosResponse> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return api.get("/auth/session", {
    headers: { Cookie: cookieStr },
  });
}

// Перевірка сесії з токенами
export async function checkSession(
  accessToken?: string,
  refreshToken?: string
) {
  try {
    if (accessToken) return { valid: true, cookies: [] };

    if (refreshToken) {
      const cookieStore = await cookies();
      const cookieStr = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

      const apiRes = await api.get("/auth/session", {
        headers: { Cookie: cookieStr },
      });

      const setCookie = apiRes.headers["set-cookie"];
      let cookiesArray: Array<{
        name: string;
        value: string | undefined;
        options: { expires?: Date; path?: string; maxAge?: number };
      }> = [];

      if (setCookie) {
        const arr = Array.isArray(setCookie) ? setCookie : [setCookie];
        cookiesArray = arr.map((cookieStr) => {
          const parsed = parse(cookieStr);
          const name = Object.keys(parsed)[0];
          return {
            name,
            value: parsed[name],
            options: {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            },
          };
        });
      }

      return { valid: true, cookies: cookiesArray };
    }

    return { valid: false, cookies: [] };
  } catch {
    return { valid: false, cookies: [] };
  }
}

// ===== Заметки =====

// Отримати всі заметки
export async function getNotesServer(): Promise<Note[]> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await api.get<Note[]>("/notes", {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

// Отримати заметку по ID
export async function getNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

// Створити заметку
export async function createNoteServer(
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await api.post<Note>("/notes", note, {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

// Видалити заметку
export async function deleteNoteServer(id: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  await api.delete(`/notes/${id}`, {
    headers: { Cookie: cookieStr },
  });
}
