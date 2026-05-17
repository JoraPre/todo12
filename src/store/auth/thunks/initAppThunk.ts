import { authTokenStore, refreshTokenRequest } from "../../../api/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../../helpers/errorMessage";
import { fetchProfileThunk } from "./rolesThunk";

export const initAppThunk = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("auth/initApp", async (_, { dispatch, rejectWithValue }) => {
  try {
    const accessToken = authTokenStore.getAccessToken();
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      authTokenStore.clearAccessToken();
      return false;
    }

    if (!accessToken) {
      const refreshResponse = await refreshTokenRequest({ refreshToken });
      authTokenStore.setAccessToken(refreshResponse.accessToken);
      localStorage.setItem("refreshToken", refreshResponse.refreshToken);
    }

    await dispatch(fetchProfileThunk()).unwrap();

    return true;
  } catch (error: unknown) {
    authTokenStore.clearAccessToken();
    localStorage.removeItem("refreshToken");
    return rejectWithValue(getErrorMessage(error));
  }
});
