"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore(); // Zustand store для текущего пользователя

  const [username, setUsername] = useState(user?.name || ""); // локальное состояние для username

  // Сохранение изменений
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUser({ ...user, name: username }); // обновляем только имя пользователя в store
    router.push("/profile"); // редирект на страницу профиля
  };

  // Отмена редактирования
  const handleCancel = () => {
    router.push("/profile"); // возвращаемся на страницу профиля
  };

  return (
    <main className={css.mainContent}>
      {" "}
      {/* Основной контейнер страницы */}
      <div className={css.profileCard}>
        {" "}
        {/* Карточка профиля */}
        <h1 className={css.formTitle}>Edit Profile</h1> {/* Заголовок */}
        {/* Аватар пользователя */}
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || "/default-avatar.png"} // fallback если аватара нет
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        {/* Форма редактирования */}
        <form onSubmit={handleSave} className={css.profileInfo}>
          {/* Поле для редактирования username */}
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={css.input}
            />
          </div>

          {/* Отображение email (только чтение) */}
          <p>Email: {user?.email || "unknown@example.com"}</p>

          {/* Кнопки действий */}
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              {" "}
              {/* Сохранить изменения */}
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton} /* Отмена редактирования */
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
