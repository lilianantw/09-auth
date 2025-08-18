import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Якщо slug перший елемент 'all', то тег не вказуємо (undefined)
  const tag = slug?.[0]?.toLowerCase() === "all" ? undefined : slug?.[0];

  // Формуємо назву та опис з урахуванням фільтру, узгоджені з layout.tsx
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
      url: `https://08-zustand-ten-lake.vercel.app/notes/${tag ?? ""}`,
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

  const { notes, totalPages } = await fetchNotes({ page: 1, search: "", tag });

  return (
    <NotesClient
      initialNotes={notes}
      initialTotalPages={totalPages}
      selectedTag={tag}
    />
  );
}
