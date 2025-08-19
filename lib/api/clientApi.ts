import axios from "axios"; // обязательно для isAxiosError
import api from "./api";
import type { User } from "@/types/user";

// Получить профиль текущего пользователя (клиентский вызов)
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get<User>("/users/me", {
      withCredentials: true, // для отправки cookies
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Неавторизованный пользователь
      return null;
    }
    throw error;
  }
}

// Регистрация нового пользователя
export async function registerUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await api.post<User>(
      "/auth/register",
      { email, password },
      { withCredentials: true } // поддержка cookies
    );
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
}

// Авторизация пользователя (логин)
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const response = await api.post<User>(
      "/auth/login",
      { email, password },
      { withCredentials: true } // поддержка cookies
    );
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
}
