import NotesClient from "./Notes.client";
import { getNotesServer } from "@/lib/api/serverApi";
import { Metadata } from "next";
import type { Note } from "@/types/note";

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
      url: `https://09-auth-nine-tawny.vercel.app/notes/${tag ?? ""}`.replace(
        /\s+/g,
        ""
      ),
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

  let allNotes: Note[] = [];
  let totalPages = 1;

  try {
    const rawData = await getNotesServer();

    // Явно вказуємо тип для безпечного доступу
    if (rawData && typeof rawData === "object") {
      if ("notes" in rawData) {
        const data = rawData as { notes: Note[]; totalPages?: number };
        if (Array.isArray(data.notes)) {
          allNotes = data.notes;
          totalPages =
            typeof data.totalPages === "number" ? data.totalPages : 1;
        }
      } else if (Array.isArray(rawData)) {
        allNotes = rawData;
      }
    } else if (Array.isArray(rawData)) {
      allNotes = rawData;
    }
  } catch (error) {
    console.error("❌ [page.tsx] Failed to load notes:", error);
  }

  const filteredNotes = tag
    ? allNotes.filter((note) => note?.tag === tag)
    : allNotes;

  return (
    <NotesClient
      initialNotes={filteredNotes}
      initialTotalPages={totalPages}
      selectedTag={tag}
    />
  );
}
