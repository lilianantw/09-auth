"use client";
import css from "./Header.module.css";
import Link from "next/link";
import TagsMenu from "../TagsMenu/TagsMenu";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function Header() {
  const { isAuthenticated } = useAuthStore();

  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        NoteHub
      </Link>
      <nav className={css.navContainer}>
        <ul className={css.navigation}>
          <li>
            <Link href="/" className={css.navLink}>
              Home
            </Link>
          </li>
          <li>
            <TagsMenu />
          </li>
        </ul>

        <AuthNavigation />
      </nav>
    </header>
  );
}
