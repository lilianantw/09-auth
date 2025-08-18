import Link from "next/link";
import css from "@/components/TagsMenu/TagsMenu.module.css";

const tags = [
  { name: "All notes", slug: "All" },
  { name: "Todo", slug: "Todo" },
  { name: "Work", slug: "Work" },
  { name: "Personal", slug: "Personal" },
  { name: "Meeting", slug: "Meeting" },
  { name: "Shopping", slug: "Shopping" },
];

interface TagsMenuProps {
  activeTag?: string;
}

export default function TagsMenu({ activeTag }: TagsMenuProps) {
  return (
    <nav className={css.menuContainer}>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag.slug} className={css.menuItem}>
            <Link
              href={`/notes/filter/${tag.slug}`}
              className={`${css.menuLink} ${
                activeTag === tag.slug ? css.active : ""
              }`}
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
