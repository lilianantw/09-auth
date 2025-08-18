import { Metadata } from "next";
import css from "./CreateNote.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";

// Метаданные для страницы создания нотатки
export const metadata: Metadata = {
  title: "Create New Note | NoteHub",
  description:
    "Create a new note and save it as a draft or publish immediately.",
  openGraph: {
    title: "Create New Note | NoteHub",
    description:
      "Create a new note and save it as a draft or publish immediately.",
    url: "https://08-zustand-ten-lake.vercel.app/notes/action/create",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - Create New Note",
      },
    ],
    type: "website",
  },
};

export default function CreateNote() {
  // NoteForm component handles its own store usage

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
