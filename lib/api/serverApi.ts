import axios from "axios";
import { cookies } from "next/headers";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// Базовый экземпляр axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ===== Пользователь =====

// Получить текущего пользователя (серверная функция)
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    const response = await api.get<User>("/api/users/me", {
      headers: { Cookie: cookie },
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

// Обновить профиль пользователя
export async function updateUserProfileServer(
  data: Partial<User>
): Promise<User> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  const response = await api.put<User>("/api/users/me", data, {
    headers: { Cookie: cookie },
    withCredentials: true,
  });

  return response.data;
}

// Проверить активную сессию
export async function checkSessionServer(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.toString();

    await api.get("/api/auth/session", {
      headers: { Cookie: cookie },
      withCredentials: true,
    });

    return true;
  } catch {
    return false;
  }
}

// ===== Заметки =====

// Получить все заметки
export async function getNotesServer(): Promise<Note[]> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  const response = await api.get<Note[]>("/api/notes", {
    headers: { Cookie: cookie },
    withCredentials: true,
  });

  return response.data;
}

// Получить заметку по ID
export async function getNoteByIdServer(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  const response = await api.get<Note>(`/api/notes/${id}`, {
    headers: { Cookie: cookie },
    withCredentials: true,
  });

  return response.data;
}

// Создать заметку
export async function createNoteServer(
  note: Pick<Note, "title" | "content" | "tag">
): Promise<Note> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  const response = await api.post<Note>("/api/notes", note, {
    headers: { Cookie: cookie },
    withCredentials: true,
  });

  return response.data;
}

// Удалить заметку
export async function deleteNoteServer(id: string): Promise<void> {
  const cookieStore = await cookies();
  const cookie = cookieStore.toString();

  await api.delete(`/api/notes/${id}`, {
    headers: { Cookie: cookie },
    withCredentials: true,
  });
}
