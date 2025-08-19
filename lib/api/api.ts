import axios from "axios";
import type { Note, NoteTag, CreateNoteData } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

// ✅ базовый экземпляр axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // локально через Next.js API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;

// ---------------- NOTES ----------------

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
    if (search) params.search = search;
    if (tag && tag.toLowerCase() !== "all") params.tag = tag;

    const response = await api.get<FetchNotesResponse>("/notes", { params });
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching notes:", error);
    throw new Error("Failed to fetch notes");
  }
}

export async function createNote(payload: CreateNoteData): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
}
