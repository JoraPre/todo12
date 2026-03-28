import {
  configureStore,
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  signIn as apiSignIn,
  signUp as apiSignUp,
  logout as apiLogout,
  getProfile,
} from "../api/api";
import { tokenManager } from "../tokenManager/tokenManager";
import type { UserLogin, UserRegistration } from "../types/auth";
import type { Profile } from "../types/user";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  isAuth: boolean;
  user: Profile | null;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  isAuth: !!tokenManager.getRefreshToken(),
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      const response = await apiSignIn(credentials);
      tokenManager.setAccessToken(response.token.accessToken);
      tokenManager.setRefreshToken(response.token.refreshToken);
      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ошибка авторизации";
      return rejectWithValue(message);
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: UserRegistration, { rejectWithValue }) => {
    try {
      return await apiSignUp(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Ошибка регистрации";
      return rejectWithValue(message);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await getProfile();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Не удалось загрузить профиль";
      return rejectWithValue(message);
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await apiLogout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isAuth = true;
        state.status = "succeeded";
      })
      .addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action: PayloadAction<unknown>) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(
        fetchProfile.rejected,
        (state, action: PayloadAction<unknown>) => {
          state.error = action.payload as string;
        },
      );

    // logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuth = false;
      state.user = null;
      state.status = "idle";
    });
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
