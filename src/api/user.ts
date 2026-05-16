import { api } from "./auth";

import type {
  User,
  UserFilters,
  MetaResponse,
  UserRequest,
  UserRolesRequest,
} from "../types/typesUsers";

import type { Filter, Todo } from "../types/typesTodo";

export async function getUsers(
  filters: UserFilters = {},
): Promise<MetaResponse<User>> {
  const response = await api.get<MetaResponse<User>>("/admin/users", {
    params: filters,
  });
  return response.data;
}

export async function getUser(params: { id: number }): Promise<User> {
  const response = await api.get<User>(`/admin/users/${params.id}`);
  return response.data;
}

export async function updateUserRights(
  id: number,
  data: UserRolesRequest,
): Promise<User> {
  const response = await api.post<User>(`/admin/users/${id}/rights`, data);
  return response.data;
}

export async function updateUser(id: number, data: UserRequest): Promise<User> {
  const response = await api.put<User>(`/admin/users/${id}`, data);
  return response.data;
}

export async function blockUser(id: number): Promise<User> {
  const response = await api.post<User>(`/admin/users/${id}/block`);
  return response.data;
}

export async function unblockUser(id: number): Promise<User> {
  const response = await api.post<User>(`/admin/users/${id}/unblock`);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

export async function getTodos(filter: Filter) {
  const response = await api.get("/todo", {
    params: { filter },
  });
  return response.data;
}

export async function createTodo(title: string) {
  const response = await api.post("/todo", { title });
  return response.data;
}

export async function updateTodo(id: number, data: Partial<Todo>) {
  const response = await api.put(`/todo/${id}`, data);
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todo/${id}`);
}
