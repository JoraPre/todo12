import { ApiResponse, Task } from "../types.ts/Todot";
import axios from "axios";

const API = "https://easydev.club/api/v2/todos";

export const fetchTasks = async (
  status: "all" | "inWork" | "completed" = "all"
) => {
  try {
    const response = await axios.get<ApiResponse>(`${API}?filter=${status}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке данныхх:", error);
    throw error;
  }
};

export const removeTask = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API}/${id}`);
  } catch (error) {
    console.error("Не удалось удалить todo:", error);
  }
};

export const addTask = async (title: string): Promise<Task> => {
  try {
    const response = await axios.post(API, {
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
    const response = await axios.put(`${API}/${id}`, {
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
    const response = await axios.put(`${API}/${id}`, {
      isDone,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при смене задачи:", error);
    throw error;
  }
};
