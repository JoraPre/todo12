import { api } from "./auth";
import type { AppDispatch } from "../store";
import { logout } from "../store/auth/slices/authSlice";

export function setupInterceptors(dispatch: AppDispatch) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return Promise.reject(error);
    },
  );
}
