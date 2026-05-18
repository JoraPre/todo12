import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../../api/auth";
import { getErrorMessage } from "../../../helpers/errorMessage";

interface AuthState {
  isAuthorized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthorized: false,
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { login: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.accessToken || response.token);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.isAuthorized = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthorized = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
