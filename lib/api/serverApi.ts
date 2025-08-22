"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { parse } from "cookie";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { nextServer } from "./api";

// ===== Користувач =====

export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieStr = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    const response = await nextServer.get<User>("/users/me", {
      headers: { Cookie: cookieStr },
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401)
      return null;
    throw error;
  }
}

export async function updateUserProfileServer(
  data: Partial<User>
): Promise<User> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await nextServer.patch<User>("/users/me", data, {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

export async function checkSessionServer() {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return nextServer.get("/auth/session", {
    headers: { Cookie: cookieStr },
  });
}

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

      const apiRes = await nextServer.get("/auth/session", {
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
export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
) => {
  const cookieStore = await cookies();
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 12,
  };
  const headers = {
    Cookie: cookieStore.toString(),
  };
  const response = await nextServer.get("/notes", {
    params,
    headers,
  });
  return response.data;
};

export async function getNotesServer(): Promise<Note[]> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await nextServer.get<Note[]>("/notes", {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

export async function getNotesWithPaginationServer(
  page: number = 1,
  search: string = "",
  tag: string = "",
  perPage: number = 12
): Promise<{ notes: Note[]; totalPages: number }> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const response = await nextServer.get<Note[]>("/notes", {
    params,
    headers: { Cookie: cookieStr },
  });

  let totalPages = 1;
  const totalPagesHeader = (response.headers["x-total-pages"] ??
    response.headers["X-Total-Pages"]) as string | undefined;
  const totalCountHeader = (response.headers["x-total-count"] ??
    response.headers["X-Total-Count"]) as string | undefined;

  if (totalPagesHeader) {
    const n = parseInt(totalPagesHeader, 10);
    if (!Number.isNaN(n) && n > 0) totalPages = n;
  } else if (totalCountHeader) {
    const count = parseInt(totalCountHeader, 10);
    if (!Number.isNaN(count) && perPage > 0)
      totalPages = Math.max(1, Math.ceil(count / perPage));
  }

  return { notes: response.data, totalPages };
}

export async function getNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}
//********/
export async function createNoteServer(
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const response = await nextServer.post<Note>("/notes", note, {
    headers: { Cookie: cookieStr },
  });

  return response.data;
}

export async function deleteNoteServer(id: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieStr = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  await nextServer.delete(`/notes/${id}`, {
    headers: { Cookie: cookieStr },
  });
}
