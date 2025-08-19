import axios from "axios";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

// ✅ базовый экземпляр axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // переменная из .env или Vercel
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Получить текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>("/api/users/me");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

// Регистрация
export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const response = await api.post<User>("/api/auth/register", {
    email,
    password,
  });
  const user = response.data;

  // сохраняем в Zustand
  useAuthStore.getState().setUser(user);

  return user;
}

// Логин
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const response = await api.post<User>("/api/auth/login", { email, password });
  const user = response.data;

  // сохраняем в Zustand
  useAuthStore.getState().setUser(user);

  return user;
}

// Логаут
export async function logoutUser(): Promise<void> {
  await api.post("/api/auth/logout");
  useAuthStore.getState().clearIsAuthenticated();
}
