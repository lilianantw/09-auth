import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getNoteByIdServer } from "@/lib/api/serverApi"; // <- виправлений імпорт
import NoteDetailsClient from "./NoteDetails.client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import type { Note } from "@/types/note";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteByIdServer(id); // <- serverApi

  if (!note || !note.id) {
    return {
      title: "Note Not Found | NoteHub",
      description: "The requested note could not be found on NoteHub.",
      openGraph: {
        title: "Note Not Found | NoteHub",
        description: "The requested note could not be found on NoteHub.",
        url: "https://09-auth-nine-tawny.vercel.app/",
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

  const pageTitle = `Note: ${note.title} | NoteHub`;
  const pageDescription =
    note.content.slice(0, 160) ||
    "View this note on NoteHub, your app for creating and organizing notes.";

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://09-auth-nine-tawny.vercel.app/notes/${id}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Note: ${note.title}`,
        },
      ],
      type: "article",
    },
  };
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;
  if (!id) notFound();

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => getNoteByIdServer(id), // <- serverApi
    });

    const note = queryClient.getQueryData(["note", id]) as Note | undefined;
    if (!note || !note.id) notFound();
  } catch (error) {
    console.error("Failed to fetch note:", error);
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} />
    </HydrationBoundary>
  );
}
