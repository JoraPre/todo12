import axios from "axios";

const API_BASE = "https://easydev.club/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginUser(data: { login: string; password: string }) {
  const response = await api.post("/auth/signin", data);
  return response.data;
}

export async function getAllUsers() {
  const response = await api.get("/admin/users?limit=1000&page=1");
  return response.data;
}

export async function blockUser(id: number) {
  const response = await api.patch(`/admin/users/${id}/block`);
  return response.data;
}

export async function unblockUser(id: number) {
  const response = await api.patch(`/admin/users/${id}/unblock`);
  return response.data;
}

export async function getUserById(id: number) {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
}

export async function updateUser(id: number, data: Partial<{ username: string; email: string; phoneNumber: string; roles: string[] }>) {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data;
}

export async function getMe() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
}
