import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../../helpers/errorMessage";
import { blockUser, unblockUser } from "../../../api/user";
import type { User } from "../../../types/typesUsers";

export const blockUserThunk = createAsyncThunk<
  User,
  { id: number },
  { rejectValue: string }
>("users/blockUser", async ({ id }, { rejectWithValue }) => {
  try {
    return await blockUser(id);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const unblockUserThunk = createAsyncThunk<
  User,
  { id: number },
  { rejectValue: string }
>("users/unblockUser", async ({ id }, { rejectWithValue }) => {
  try {
    return await unblockUser(id);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
