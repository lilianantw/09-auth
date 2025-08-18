// Тип для тегів
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// Інтерфейс для нотатки
export interface Note {
  id: string; // Унікальний ID (має бути рядком, згідно API)
  title: string; // Заголовок (3-50 символів)
  content: string; // Вміст (макс. 500 символів)
  createdAt: string; // Дата створення (ISO-рядок)
  updatedAt: string; // Дата оновлення (ISO-рядок)
  tag: NoteTag; // Тег
  date: string;
}

// Інтерфейс для створення нотатки
export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

// Інтерфейс для оновлення нотатки
export interface UpdateNoteData {
  title?: string;
  content?: string;
  tag?: NoteTag;
}
