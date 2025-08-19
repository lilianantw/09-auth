"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/api";
import css from "./NoteDetails.module.css";
import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";

interface NoteDetailsClientProps {
  noteId: string;
}

export default function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const closeModal = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={closeModal}>
        <div>Загрузка...</div>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={closeModal}>
        <div className={css.container}>
          <h2 className={css.header}>Ошибка: заметка не найдена</h2>
          <button onClick={closeModal} className={css.link}>
            ← Назад
          </button>
        </div>
      </Modal>
    );
  }

  // Форматируем дату (пример)
  const formattedDate = new Date(note.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <div className={css.date}>{formattedDate}</div>
          <div className={css.tag}>{note.tag}</div>
          <button onClick={closeModal} className={css.link}>
            ← Закрыть
          </button>
        </div>
      </div>
    </Modal>
  );
}
