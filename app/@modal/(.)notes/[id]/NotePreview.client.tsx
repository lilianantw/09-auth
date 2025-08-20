"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import { getNoteById } from "@/lib/api/clientApi"; // <- правильний імпорт з clientApi
import type { Note } from "@/types/note";

interface NotePreviewModalProps {
  noteId: string;
}

export default function NotePreviewModal({ noteId }: NotePreviewModalProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery<Note, Error>({
    queryKey: ["notePreview", noteId],
    queryFn: () => getNoteById(noteId), // <- clientApi
    refetchOnMount: false,
    staleTime: 5000,
  });

  const closeModal = () => router.back();

  if (isLoading)
    return (
      <Modal onClose={closeModal}>
        <div>Загрузка...</div>
      </Modal>
    );

  if (error)
    return (
      <Modal onClose={closeModal}>
        <div>Ошибка: {error.message}</div>
      </Modal>
    );

  if (!note)
    return (
      <Modal onClose={closeModal}>
        <div>Заметка не найдена</div>
      </Modal>
    );

  return (
    <Modal onClose={closeModal}>
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <p>
          <strong>Тег:</strong> {note.tag}
        </p>
        <p>
          <strong>Дата создания:</strong>{" "}
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Modal>
  );
}
