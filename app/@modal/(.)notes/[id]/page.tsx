import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NotePreviewModal from "./NotePreview.client";
import type { Note } from "@/types/note";
import { getNoteByIdServer } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ id: string }>;
};

const queryKeys = {
  note: (id: string) => ["note", id] as const,
};

export default async function NotePage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<Note>({
    queryKey: queryKeys.note(id),
    queryFn: () => getNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewModal noteId={id} />
    </HydrationBoundary>
  );
}
