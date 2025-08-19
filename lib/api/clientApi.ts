import axios from "axios";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

// используем только переменную окружения
const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Регистрация
export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  const response = await apiInstance.post<User>("/auth/register", {
    email,
    password,
  });
  const user = response.data;
  useAuthStore.getState().setUser(user);
  return user;
}

// Логин
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const response = await apiInstance.post<User>("/auth/login", {
    email,
    password,
  });
  const user = response.data;
  useAuthStore.getState().setUser(user);
  return user;
}

// Логаут
export async function logoutUser(): Promise<void> {
  await apiInstance.post("/auth/logout");
  useAuthStore.getState().clearIsAuthenticated();
}

// Получить текущего пользователя
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiInstance.get<User>("/users/me");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401)
      return null;
    throw error;
  }
}
