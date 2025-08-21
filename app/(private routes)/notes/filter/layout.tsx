// app/notes/filter/layout.tsx
import "./LayoutNotes.module.css";

export const metadata = {
  title: "NoteHub",
  description: "Заметки с фильтрацией и модалками",
};

export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <section style={{ display: "flex" }}>
      <aside style={{ width: "200px" }}>{sidebar}</aside>
      <main style={{ flex: 1 }}>{children}</main>
    </section>
  );
}
