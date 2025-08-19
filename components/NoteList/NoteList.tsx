"use client";

import type { Note } from "@/types/note";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/api";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: removeNote, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Delete this note? This action cannot be undone.")) {
      removeNote(id);
    }
  };

  if (!notes || notes.length === 0) {
    return <p className={css.empty}>No notes available.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.content}>
            {note.content.substring(0, 120)}
            {note.content.length > 120 ? "…" : ""}
          </p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
              <Link href={`/notes/${note.id}`} className={css.link}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={(e) => handleDelete(note.id, e)}
                disabled={isPending}
                aria-label={`Delete note: ${note.title}`}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
