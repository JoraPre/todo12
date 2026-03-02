import { redirect } from "react-router-dom";
import { tokenManager } from "../tokenManager/tokenManager";

export async function checkAuthLoader() {
  const token = tokenManager.getAccessToken();
  const refresh = tokenManager.getRefreshToken();

  if (!token && !refresh) {
    return redirect("/auth?mode=signin");
  }

  return null;
}
