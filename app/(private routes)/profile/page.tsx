"use client";

import Image from "next/image";
import css from "./ProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuthStore();

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
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.name || "Anonymous"}</p>
          <p>Email: {user?.email || "unknown@example.com"}</p>
        </div>
      </div>
    </main>
  );
}
