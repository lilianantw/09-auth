import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0]?.toLowerCase() === "All" ? undefined : slug?.[0];

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
  const tag = slug[0] === "All" ? "" : slug?.[0];
  const rawData = await fetchNotes("", 1, tag);
  return <NotesClient initialData={rawData} initialTag={tag} />;
}
