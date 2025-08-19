import axios from "axios";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

// ✅ базовый экземпляр axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // будет http://localhost:3000 локально и Vercel URL в продакшне
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
  try {
    const response = await api.post<User>("/api/auth/register", {
      email,
      password,
    });
    const user = response.data;
    useAuthStore.getState().setUser(user);
    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      throw new Error("Пользователь с таким email уже существует");
    }
    throw error;
  }
}

// Логин
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await api.post<User>("/api/auth/login", {
      email,
      password,
    });
    const user = response.data;
    useAuthStore.getState().setUser(user);
    return user;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Неверный email или пароль");
    }
    throw error;
  }
}

// Логаут
export async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/auth/logout");
    useAuthStore.getState().clearIsAuthenticated();
  } catch (error) {
    console.error("Ошибка при логауте:", error);
  }
}
