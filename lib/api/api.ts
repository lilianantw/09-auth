"use client";

import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Вспомогательный fetch с токеном ---
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    const typedHeaders = headers as Record<string, string>;
    typedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Ошибка API: ${res.status}`);
  }

  return res.json();
}

// === Пользователи ===
export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiFetch<User>("/users/me");
  } catch {
    return null;
  }
}

export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const user = await apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  useAuthStore.getState().setUser(user);
  return user;
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const data = await apiFetch<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    useAuthStore.getState().setToken(data.token); // теперь TS не ругается
  }
  useAuthStore.getState().setUser(data.user);
  return data.user;
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
  useAuthStore.getState().clearIsAuthenticated();
}

export async function checkSession(): Promise<User | null> {
  try {
    return await apiFetch<User>("/auth/session");
  } catch {
    return null;
  }
}

export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  const user = await apiFetch<User>("/users/me", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  useAuthStore.getState().setUser(user);
  return user;
}

// === Заметки ===
export async function getNotes(params?: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.search) query.append("search", params.search);
  if (params?.tag) query.append("tag", params.tag);

  return apiFetch<{ notes: Note[]; totalPages: number }>(
    `/notes?${query.toString()}`
  );
}

export async function getNoteById(id: string): Promise<Note> {
  return apiFetch<Note>(`/notes/${id}`);
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt">
): Promise<Note> {
  return apiFetch<Note>("/notes", {
    method: "POST",
    body: JSON.stringify(note),
  });
}

export async function deleteNote(id: string): Promise<void> {
  await apiFetch(`/notes/${id}`, { method: "DELETE" });
}
