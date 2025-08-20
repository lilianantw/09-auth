"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { logoutUser, getCurrentUser } from "@/lib/api/clientApi";
import css from "./Header.module.css";

function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, clearIsAuthenticated } =
    useAuthStore();

  // Проверяем сессию при загрузке компонента
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) clearIsAuthenticated();
      else setUser(currentUser);
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/sign-in");
    } catch (err) {
      console.error("Ошибка при логауте:", err);
    } finally {
      clearIsAuthenticated();
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>
        NoteHub
      </Link>
      <ul className={css.navigation}>
        <AuthNavigation />
      </ul>
    </header>
  );
}
