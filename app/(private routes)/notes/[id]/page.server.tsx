import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getNoteById } from "@/lib/api/clientApi"; // <- исправлено

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await getNoteById(id); // <- исправлено
    return {
      title: `${note.title} | NoteHub`,
      description:
        note.content.substring(0, 160) +
        (note.content.length > 160 ? "..." : ""),
      openGraph: {
        title: `${note.title} | NoteHub`,
        description:
          note.content.substring(0, 160) +
          (note.content.length > 160 ? "..." : ""),
        url: `https://09-auth-nine-tawny.vercel.app/notes/${id}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
        type: "article",
      },
    };
  } catch {
    return {
      title: `Note: ${id} | NoteHub`,
      description:
        "View this note on NoteHub, your app for creating and organizing notes.",
      openGraph: {
        title: `Note: ${id} | NoteHub`,
        description:
          "View this note on NoteHub, your app for creating and organizing notes.",
        url: `https://09-auth-nine-tawny.vercel.app/${id}`,
        siteName: "NoteHub",
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
            alt: `Note: ${id}`,
          },
        ],
        type: "article",
      },
    };
  }
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();

  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
