import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../../api/auth";
import { authTokenStore } from "../../../api/auth";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type { AuthData } from "../../../types/typesAuth";

export const loginThunk = createAsyncThunk<
  void,
  AuthData,
  { rejectValue: string }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await loginUser(data);

    authTokenStore.setAccessToken(response.accessToken);

    localStorage.setItem("refreshToken", response.refreshToken);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
