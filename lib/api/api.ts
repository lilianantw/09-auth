// lib/api.ts
import axios from "axios";
import type { Note, NoteTag, CreateNoteData } from "../types/note";

// Тип відповіді для списку нотаток
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Payload для створення нотатки
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

// Создаём экземпляр axios с базовым URL из .env
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://notehub-public.goit.study/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем интерцептор для авторизации
api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Получить все заметки (с пагинацией, поиском и фильтром по тегу)
export async function fetchNotes({
  page = 1,
  search = "",
  tag,
}: {
  page?: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  try {
    const params: Record<string, string | number | undefined> = { page };

    if (search) {
      params.search = search;
    }
    if (tag && tag.toLowerCase() !== "all") {
      params.tag = tag;
    }

    const response = await api.get<FetchNotesResponse>("/notes", { params });
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching notes:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch notes: ${error.message}`
        : "Unknown error occurred while fetching notes"
    );
  }
}

// Создать новую заметку
export async function createNote(payload: CreateNoteData): Promise<Note> {
  try {
    const response = await api.post<Note>("/notes", payload);
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating note:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to create note: ${error.message}`
        : "Unknown error occurred while creating note"
    );
  }
}

// Удалить заметку по ID
export async function deleteNote(id: string): Promise<Note> {
  try {
    const response = await api.delete<Note>(`/notes/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting note:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to delete note: ${error.message}`
        : "Unknown error occurred while deleting note"
    );
  }
}

// Получить заметку по ID
export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const response = await api.get<Note>(`/notes/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching note by ID:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch note by ID: ${error.message}`
        : "Unknown error occurred while fetching note by ID"
    );
  }
}
