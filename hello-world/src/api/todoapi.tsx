import { ApiResponse, Task } from "../types.ts/Todot";
import axios from "axios";

const API = "https://easydev.club/api/";

export const apiClient = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchTasks = async (
  status: "all" | "inWork" | "completed" = "all"
): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get<ApiResponse>("/v1/todos", {
      params: { filter: status },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    throw error;
  }
};

export const removeTask = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/v1/todos/${id}`);
  } catch (error) {
    console.error("Не удалось удалить todo:", error);
    throw error;
  }
};

export const addTask = async (title: string): Promise<Task> => {
  try {
    const response = await apiClient.post<Task>("/v1/todos", {
      title,
      isDone: false,
    });
    return response.data;
  } catch (error) {
    console.error("Возникла ошибка при добавлении todo:", error);
    throw error;
  }
};

export const editTask = async (id: number, newTitle: string): Promise<Task> => {
  try {
    const response = await apiClient.put<Task>(`/v1/todos/${id}`, {
      title: newTitle,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при изменении задачи", error);
    throw error;
  }
};

export const toggleTaskStatus = async (
  id: number,
  isDone: boolean
): Promise<Task> => {
  try {
    const response = await apiClient.put<Task>(`/v1/todos/${id}`, {
      isDone,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при смене задачи:", error);
    throw error;
  }
};
