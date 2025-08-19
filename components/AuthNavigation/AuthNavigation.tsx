"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";
import Link from "next/link";

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = () => {
    // Очищуємо стан користувача
    clearIsAuthenticated();
    // Редірект на сторінку логіну
    router.push("/sign-in");
  };

  return (
    <ul className={css.navigationList}>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" className={css.navigationLink}>
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
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
