import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateUser } from "../../../api/user";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type { User, UserRequest } from "../../../types/typesUsers";

export const updateUserThunk = createAsyncThunk<
  User,
  { id: number; data: UserRequest },
  { rejectValue: string }
>("users/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateUser(id, data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
