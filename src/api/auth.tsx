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
