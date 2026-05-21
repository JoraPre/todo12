import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, getMe } from "../../../api/auth";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type { User } from "../../../types.ts/types";

interface AuthState {
  isAuthorized: boolean;
  currentUser: User | null;
  loading: boolean;
  profileLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthorized: !!localStorage.getItem("token"),
  currentUser: null,
  loading: false,
  profileLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { login: string; password: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.accessToken || response.token);
      dispatch(fetchMeThunk());
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchMeThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const response = await getMe();
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateMeThunk = createAsyncThunk<
  User,
  Partial<Pick<User, "username" | "email" | "phoneNumber">>,
  { rejectValue: string }
>("auth/updateMe", async (data, { rejectWithValue }) => {
  try {
    const { updateUser, getMe: getMeFn } = await import("../../../api/auth");
    const me = await getMeFn();
    const updated = await updateUser(me.id, data);
    return updated;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.isAuthorized = false;
      state.currentUser = null;
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
      })

      .addCase(fetchMeThunk.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(fetchMeThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.profileLoading = false;
      })
      .addCase(fetchMeThunk.rejected, (state) => {
        state.profileLoading = false;
      })

      .addCase(updateMeThunk.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
