import { createSlice } from "@reduxjs/toolkit";

import { loginThunk } from "../thunks/loginThunk";
import { Profile } from "../../../types/typesAuth";
import { fetchProfileThunk } from "../thunks/profileThunk";
import { logoutThunk } from "../thunks/logoutThunk";
import { initAppThunk } from "../thunks/initAppThunk";
import { registrationThunk } from "../thunks/registrationThunk";

interface AuthState {
  isAuthorized: boolean;
  user: Profile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  registrationStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: AuthState = {
  isAuthorized: false,
  user: null,
  status: "idle",
  error: null,
  registrationStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      state.isAuthorized = false;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthorized = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Ошибка авторизации";

        state.isAuthorized = false;
        state.user = null;
      })

      .addCase(fetchProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthorized = true;
      })
      .addCase(fetchProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Ошибка получения профиля";
        state.isAuthorized = false;
        state.user = null;
      })

      .addCase(logoutThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.isAuthorized = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Ошибка при выходе из аккаунта";
      })

      .addCase(initAppThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initAppThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthorized = action.payload;
      })
      .addCase(initAppThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Ошибка инициализации";
        state.isAuthorized = false;
        state.user = null;
      })

      .addCase(registrationThunk.pending, (state) => {
        state.registrationStatus = "loading";
        state.error = null;
      })
      .addCase(registrationThunk.fulfilled, (state) => {
        state.registrationStatus = "succeeded";
        state.error = null;
      })
      .addCase(registrationThunk.rejected, (state, action) => {
        state.registrationStatus = "failed";
        state.error = action.payload ?? "Ошибка регистрации";
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;

export type { AuthState };
