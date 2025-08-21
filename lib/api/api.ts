"use client";

import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { useAuthStore } from "@/lib/store/authStore";

// --- Створюємо інстанс axios ---
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ================= AUTH / USER =================

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<User>("/auth/session");
    if (data) useAuthStore.getState().setAuth(data);
    return data;
  } catch {
    useAuthStore.getState().clearAuth();
    return null;
  }
}

export async function checkSession(): Promise<boolean> {
  try {
    await api.get("/auth/session");
    return true;
  } catch {
    return false;
  }
}

export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const { data } = await api.post<User>("/auth/register", { email, password });
  useAuthStore.getState().setAuth(data);
  return data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    await api.post("/auth/login", { email, password }); // сервер ставит cookies
    const user = await getCurrentUser();
    if (!user)
      throw new Error("Не вдалося отримати дані користувача після логіну");
    return user;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    useAuthStore.getState().clearAuth();
  }
}

export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>("/users/me", updates);
  useAuthStore.getState().setAuth(data);
  return data;
}

// ================= NOTES =================

export type FetchNotesParams = {
  page?: number;
  search?: string;
  tag?: string;
  perPage?: number;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function getNotes({
  page = 1,
  search = "",
  tag = "",
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag) params.tag = tag;

  const res = await api.get<Note[]>("/notes", { params });

  let totalPages = 1;
  const totalCountHeader =
    (res.headers["x-total-count"] as string | undefined) ??
    (res.headers["X-Total-Count" as keyof typeof res.headers] as unknown as
      | string
      | undefined);

  if (totalCountHeader) {
    const count = parseInt(totalCountHeader, 10);
    if (!Number.isNaN(count) && perPage > 0)
      totalPages = Math.max(1, Math.ceil(count / perPage));
  }

  return { notes: res.data, totalPages };
}

export async function getNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt">
): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}
