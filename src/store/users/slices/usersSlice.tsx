import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  updateUser,
} from "../../../api/auth";
import type { User } from "../../../types.ts/types";
import { getErrorMessage } from "../../../helpers/errorMessage";

export const fetchUsersThunk = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetch", async (_, { rejectWithValue }) => {
  try {
    const response = await getAllUsers();
    return Array.isArray(response.data) ? response.data : response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const blockUserThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("users/block", async (id, { rejectWithValue }) => {
  try {
    await blockUser(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const unblockUserThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("users/unblock", async (id, { rejectWithValue }) => {
  try {
    await unblockUser(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserThunk = createAsyncThunk<
  User,
  { id: number; data: Partial<Pick<User, "username" | "email" | "phoneNumber" | "roles">> },
  { rejectValue: string }
>("users/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateUser(id, data);
    return response;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

interface UsersState {
  users: User[];
  loading: boolean;
  actionLoading: number | null;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  actionLoading: null,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(blockUserThunk.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) user.isBlocked = true;
        state.actionLoading = null;
      })
      .addCase(blockUserThunk.rejected, (state) => {
        state.actionLoading = null;
      })

      .addCase(unblockUserThunk.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) user.isBlocked = false;
        state.actionLoading = null;
      })
      .addCase(unblockUserThunk.rejected, (state) => {
        state.actionLoading = null;
      })

      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      });
  },
});

export default usersSlice.reducer;
