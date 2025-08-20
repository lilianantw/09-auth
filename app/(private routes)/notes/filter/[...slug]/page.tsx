import NotesClient from "./Notes.client";
import { getNotesServer } from "@/lib/api/serverApi"; // <- правильный импорт
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0]?.toLowerCase() === "all" ? undefined : slug?.[0];

  const pageTitle = tag ? `Notes - ${tag} | NoteHub` : "All Notes | NoteHub";
  const pageDescription = tag
    ? `Browse notes filtered by ${tag} on NoteHub. Create and organize notes with quick search and clean design.`
    : "Explore all notes on NoteHub. Create and organize notes with category filters, quick search, and clean design for work and study.";

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://09-auth-nine-tawny.vercel.app/notes/${tag ?? ""}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub - Manage your notes efficiently",
        },
      ],
      type: "website",
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0]?.toLowerCase() === "all" ? undefined : slug?.[0];

  // Получаем все заметки с сервера
  const allNotes = await getNotesServer();

  // Фильтруем по тегу, если указан
  const filteredNotes = tag
    ? allNotes.filter((note) => note.tag === tag)
    : allNotes;

  const totalPages = 1; // пока что можно фиксировать 1, если пагинация не нужна

  return (
    <NotesClient
      initialNotes={filteredNotes}
      initialTotalPages={totalPages}
      selectedTag={tag}
    />
  );
}
