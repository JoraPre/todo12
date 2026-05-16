import { createAsyncThunk } from "@reduxjs/toolkit";
import { logoutUser } from "../../../api/auth";
import { authTokenStore } from "../../../api/auth";
import { getErrorMessage } from "../../../helpers/errorMessage";

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  } finally {
    authTokenStore.clearAccessToken();
    localStorage.removeItem("refreshToken");
  }
});
