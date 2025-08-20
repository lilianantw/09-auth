import Image from "next/image";
import Link from "next/link";
import css from "./ProfilePage.module.css";
import type { Metadata } from "next";
import { getCurrentUserServer } from "@/lib/api/serverApi";
import type { User } from "@/types/user";

// Метаданные страницы
export const metadata: Metadata = {
  title: "NoteHub",
  description:
    "NoteHub helps you create and organize notes with category filters. Quick search and clean design for work and study.",
  openGraph: {
    title: "NoteHub",
    description:
      "NoteHub helps you create and organize notes by filtering by category. Quick search, clean design — ideal for work, study, and brainstorming.",
    siteName: "NoteHub",
    url: "https://09-auth-nine-tawny.vercel.app/",
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

// Серверный компонент профиля
export default async function ProfilePage() {
  const user: User | null = await getCurrentUserServer();

  if (!user) {
    return <p>User not found or not authenticated</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
