import type { RootState } from "../index";

export const selectUsers = (state: RootState) => state.users.users;

export const selectUsersStatus = (state: RootState) => state.users.listStatus;

export const selectUsersMeta = (state: RootState) => state.users.meta;

export const selectUserId = (state: RootState) => state.users.selectedUser;

export const selectUserIdStatus = (state: RootState) => state.users.userStatus;

export const selectUserSaving = (state: RootState) => state.users.isSaving;

export const selectUserError = (state: RootState) => state.users.error;

export const selectDeletingId = (state: RootState) => state.users.deletingId;
