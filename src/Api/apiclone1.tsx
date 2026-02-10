import axios, { AxiosError } from "axios";

import { tokenManager } from "../tokenmanager/tokenmanager.tsx";
import type {
  Todo,
  TodoInfo,
  TaskCategory,
  UserRegistration,
  UserLogin,
  // Token,
  Profile,
  AuthResponse,
} from "../types/type.tsx";

export const api = axios.create({
  baseURL: "https://easydev.club/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});
// const API = "https://easydev.club/api/";

// export const apiClient = axios.create({
//   baseURL: API,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

let refreshPromise: Promise<string | null> | null = null;

const refreshToken = async (): Promise<string | null> => {
  try {
    const storedRefreshToken = tokenManager.getRefreshToken();
    if (!storedRefreshToken) {
      throw new Error("No refresh token found.");
    }

    const response = await api.post("/auth/refresh", {
      refreshToken: storedRefreshToken,
    });

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    tokenManager.setAccessToken(newAccessToken);
    tokenManager.setRefreshToken(newRefreshToken);

    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    tokenManager.removeTokens();
    return null;
  } finally {
    refreshPromise = null;
  }
};

api.interceptors.request.use((config) => {
  const isProtected = ![
    "/auth/signin",
    "/auth/signup",
    "/auth/refresh",
  ].includes(config.url || "");
  const token = tokenManager.getAccessToken();

  if (isProtected && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      error.config?.url?.includes("/auth/signin") ||
      error.config?.url?.includes("/auth/signup") ||
      error.config?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshToken();
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        return Promise.reject(new AxiosError("Unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

const handleApiError = (error: unknown, defaultStatus = 500) => {
  if (axios.isAxiosError(error) && error.response) {
    return { status: error.response.status };
  }
  console.error("An unexpected error occurred:", error);
  return { status: defaultStatus };
};

export async function getTasks(
  status: TaskCategory = "all"
): Promise<{ data: Todo[]; info: TodoInfo }> {
  const response = await api.get("/todos", {
    params: { filter: status },
  });
  return response.data;
}

export async function createTask(title: string): Promise<Todo> {
  const response = await api.post("/todos", {
    isDone: false,
    title: title,
  });
  return response.data;
}

export async function deleteTask(id: number): Promise<string> {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
}

export async function updateTask(task: Todo): Promise<Todo> {
  const response = await api.put(`/todos/${task.id}`, {
    isDone: task.isDone,
    title: task.title,
  });
  return response.data;
}

export async function signUp(
  registrationData: UserRegistration
): Promise<{ status: number }> {
  try {
    const response = await api.post("/auth/signup", registrationData);
    return { status: response.status };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function signIn(authData: UserLogin): Promise<AuthResponse> {
  try {
    const response = await api.post("/auth/signin", authData);
    return {
      status: response.status,
      token: {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      },
    };
  } catch (error) {
    const { status } = handleApiError(error);
    return { status };
  }
}

export async function getProfile(): Promise<Profile> {
  const response = await api.get("/user/profile");
  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/user/logout");
  } catch (error) {
    console.error(error);
  } finally {
    tokenManager.removeTokens();
  }
}
