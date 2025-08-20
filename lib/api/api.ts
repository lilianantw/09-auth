"use client";

import axios, { InternalAxiosRequestConfig } from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { useAuthStore } from "@/lib/store/authStore";

interface LoginResponse {
  token?: string;
}

// Базовый axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Интерцептор для токена
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Получение текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>("/api/users/me");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401)
      return null;
    throw error;
  }
}

// Регистрация
export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await api.post<User>("/api/auth/register", {
      email,
      password,
    });
    const user = response.data;
    useAuthStore.getState().setUser(user);
    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error("Пользователь с таким email уже существует");
    }
    throw error;
  }
}

// Логин
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await api.post<LoginResponse & User>("/api/auth/login", {
      email,
      password,
    });
    const user = response.data as User;
    const token = (response.data as LoginResponse).token;
    if (token) useAuthStore.getState().setToken(token);
    useAuthStore.getState().setUser(user);
    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Неверный email или пароль");
    }
    throw error;
  }
}

// Логаут
export async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/auth/logout");
  } finally {
    useAuthStore.getState().clearIsAuthenticated();
  }
}

// Проверка сессии
export async function checkSession(): Promise<User | null> {
  try {
    const response = await api.get<User>("/api/auth/session");
    return response.data;
  } catch {
    return null;
  }
}

// Обновление профиля
export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  const response = await api.put<User>("/api/users/me", updates);
  const user = response.data;
  useAuthStore.getState().setUser(user);
  return user;
}

// === Заметки ===
export async function getNotes(): Promise<Note[]> {
  const response = await api.get<Note[]>("/api/notes");
  return response.data;
}

// Функция для получения заметок с пагинацией, поиском и фильтрацией по тегу
export async function fetchNotes({
  page = 1,
  search = "",
  tag = "",
}: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const params: Record<string, string | number> = {
    page,
    perPage: 12, // как в route.ts
  };

  if (search) params.search = search;
  if (tag) params.tag = tag;

  const response = await api.get<Note[]>("/api/notes", { params });
  // Пока что возвращаем фиксированное значение totalPages, так как API может не возвращать эту информацию
  // В будущем это значение должно быть получено из заголовков ответа или из самого ответа API
  return {
    notes: response.data,
    totalPages: 1, // фиксированное значение, как в page.tsx
  };
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/api/notes/${id}`);
  return response.data;
}

export async function createNote(
  note: Omit<Note, "id" | "createdAt">
): Promise<Note> {
  const response = await api.post<Note>("/api/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/api/notes/${id}`);
}
