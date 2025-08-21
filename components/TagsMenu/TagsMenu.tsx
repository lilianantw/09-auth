"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./TagsMenu.module.css";
import Link from "next/link";

const tags = [
  { name: "All", slug: "All" },
  { name: "Todo", slug: "Todo" },
  { name: "Work", slug: "Work" },
  { name: "Personal", slug: "Personal" },
  { name: "Meeting", slug: "Meeting" },
  { name: "Shopping", slug: "Shopping" },
];

export default function TagsMenu() {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu}>
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag.slug} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag.slug}`}
                className={css.menuLink}
                onClick={toggleMenu}
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
