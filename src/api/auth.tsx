import axios from "axios";
import type {
  AuthData,
  Token,
  Profile,
  RefreshToken,
} from "../types/typesAuth";

let _accessToken: string | null = null;

export const authTokenStore = {
  getAccessToken: (): string | null => _accessToken,
  setAccessToken: (token: string): void => {
    _accessToken = token;
  },
  clearAccessToken: (): void => {
    _accessToken = null;
  },
};

export const api = axios.create({
  baseURL: "https://easydev.club/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

const refreshAPI = axios.create({
  baseURL: "https://easydev.club/api/v1",
});

api.interceptors.request.use((config) => {
  const token = authTokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._isRetry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        authTokenStore.clearAccessToken();
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      try {
        const response = await refreshAPI.post<Token>("/auth/refresh", {
          refreshToken,
        });
        authTokenStore.setAccessToken(response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api.request(originalRequest);
      } catch {
        authTokenStore.clearAccessToken();
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export async function loginUser(data: AuthData): Promise<Token> {
  const response = await api.post<Token>("/auth/signin", data);
  return response.data;
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get<Profile>("/user/profile");
  return response.data;
}

export async function refreshTokenRequest(data: RefreshToken): Promise<Token> {
  const response = await api.post<Token>("/auth/refresh", data);
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await api.post("/user/logout");
}

export async function blockUser(id: number) {
  const response = await api.patch(`/admin/users/${id}/block`);
  return response.data;
}

export async function unblockUser(id: number) {
  const response = await api.patch(`/admin/users/${id}/unblock`);
  return response.data;
}

export async function updateUser(
  id: number,
  data: Partial<Pick<Profile, "username" | "email" | "phoneNumber" | "roles">>,
) {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
}
