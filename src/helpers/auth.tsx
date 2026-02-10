import { redirect } from "react-router-dom";
import { tokenManager } from "../tokenmanager/tokenmanager.tsx";
import { api } from "../Api/apiclone1.tsx";
export async function checkAuthLoader() {
  const token = tokenManager.getAccessToken();
  const refresh = tokenManager.getRefreshToken();

  if (!token && refresh) {
    try {
      const response = await api.post("/auth/refresh", {
        refreshToken: refresh,
      });
      tokenManager.setAccessToken(response.data.accessToken);
      tokenManager.setRefreshToken(response.data.refreshToken);
      return null;
    } catch {
      tokenManager.removeTokens();
      return redirect("/auth?mode=signin");
    }
  }

  if (!token) {
    return redirect("/auth?mode=signin");
  }

  return null;
}
