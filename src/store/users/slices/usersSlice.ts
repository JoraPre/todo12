import type { User } from "../../../types/typesUsers";
import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersThunk } from "../thunks/fetchUsersThunk";
import { deleteUserThunk } from "../thunks/deleteUserThunk";
import { userByIdThunk } from "../thunks/userByIdThunk";
import { updateUserThunk } from "../thunks/updateUserThunk";
import { blockUserThunk, unblockUserThunk } from "../thunks/isBlockedUserThunk";
import { updateUserRightsThunk } from "../thunks/updateUserRightsThunk";

type Status = "idle" | "loading" | "succeeded" | "failed";

type UsersState = {
  users: User[];
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  } | null;
  selectedUser: User | null;
  listStatus: Status;
  userStatus: Status;
  deletingId: number | null;
  isSaving: boolean;
  isUpdatingRoles: boolean;
  isBlocking: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  meta: null,
  selectedUser: null,
  listStatus: "idle",
  userStatus: "idle",
  deletingId: null,
  isSaving: false,
  isUpdatingRoles: false,
  isBlocking: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
      state.userStatus = "idle";
      state.error = null;
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchUsersThunk.pending, (state) => {
        state.listStatus = "loading";
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.users = action.payload.data;
        state.meta = action.payload.meta;
        state.error = null;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload ?? "Ошибка загрузки пользователей";
        state.meta = null;
      })

      .addCase(userByIdThunk.pending, (state) => {
        state.userStatus = "loading";
        state.error = null;
      })
      .addCase(userByIdThunk.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(userByIdThunk.rejected, (state, action) => {
        state.userStatus = "failed";
        state.error = action.payload ?? "Ошибка загрузки пользователя";
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.userStatus = "loading";
        state.error = null;
        state.isSaving = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.userStatus = "succeeded";
        state.selectedUser = action.payload;
        state.isSaving = false;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.userStatus = "failed";
        state.error = action.payload ?? "Ошибка обновления";
        state.isSaving = false;
      })

      .addCase(deleteUserThunk.pending, (state, action) => {
        state.deletingId = action.meta.arg;

        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.deletingId = null;
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload ?? "Ошибка удаления";
      })

      .addCase(blockUserThunk.pending, (state) => {
        state.isBlocking = true;
        state.error = null;
      })
      .addCase(blockUserThunk.fulfilled, (state, action) => {
        state.isBlocking = false;

        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        );
      })
      .addCase(blockUserThunk.rejected, (state, action) => {
        state.isBlocking = false;
        state.error = action.payload ?? "Ошибка блокировки";
      })

      .addCase(unblockUserThunk.pending, (state) => {
        state.isBlocking = true;
        state.error = null;
      })
      .addCase(unblockUserThunk.fulfilled, (state, action) => {
        state.isBlocking = false;
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        );
      })
      .addCase(unblockUserThunk.rejected, (state, action) => {
        state.isBlocking = false;
        state.error = action.payload ?? "Ошибка разблокировки";
      })

      .addCase(updateUserRightsThunk.pending, (state) => {
        state.isUpdatingRoles = true;
        state.error = null;
      })
      .addCase(updateUserRightsThunk.fulfilled, (state, action) => {
        state.isUpdatingRoles = false;
        state.users = state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        );
      })
      .addCase(updateUserRightsThunk.rejected, (state, action) => {
        state.isUpdatingRoles = false;
        state.error = action.payload ?? "Ошибка обновления ролей";
      });
  },
});

export const { clearSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
export type { UsersState };
