import axios from "axios"; // обязательно для isAxiosError
import api from "./api";
import type { User } from "@/types/user";
import type { NextRequest } from "next/server";

// Получить профиль текущего пользователя (серверный вызов)
// Важно: передаем cookies в headers
export async function getCurrentUserServer(
  req: NextRequest
): Promise<User | null> {
  try {
    const cookie = req.headers.get("cookie") || "";
    const response = await api.get<User>("/users/me", {
      headers: {
        Cookie: cookie,
      },
      withCredentials: true, // для поддержки cookies
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
