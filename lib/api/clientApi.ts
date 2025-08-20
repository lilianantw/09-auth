"use client";

import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import { useAuthStore } from "@/lib/store/authStore";

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // обязательно для cookie
});

// ====== AUTH / USER ======
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>("/api/auth/session");
    const user = response.data;
    if (user) useAuthStore.getState().setUser(user);
    return user;
  } catch {
    useAuthStore.getState().clearIsAuthenticated();
    return null;
  }
}

export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const response = await api.post<User>("/api/auth/register", {
    email,
    password,
  });
  useAuthStore.getState().setUser(response.data);
  return response.data;
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    // 1. Логинимся через cookie
    await api.post("/api/auth/login", { email, password });
    // 2. Получаем текущего пользователя через сессию
    const user = await getCurrentUser();
    if (!user)
      throw new Error("Не удалось получить данные пользователя после логина");
    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Неверный email или пароль");
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/auth/logout");
    useAuthStore.getState().clearIsAuthenticated();
  } catch (error) {
    console.error("Ошибка при логауте:", error);
  }
}

// ====== PROFILE ======
export async function updateUserProfile(updates: Partial<User>): Promise<User> {
  const response = await api.put<User>("/api/users/me", updates);
  useAuthStore.getState().setUser(response.data);
  return response.data;
}

// ====== NOTES ======
export async function getNotes(): Promise<Note[]> {
  const response = await api.get<Note[]>("/api/notes");
  return response.data;
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
