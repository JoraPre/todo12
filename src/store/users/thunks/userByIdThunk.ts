import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "../../../api/user";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type { User } from "../../../types/typesUsers";

export const userByIdThunk = createAsyncThunk<
  User,
  number,
  { rejectValue: string }
>("users/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await getUser({ id });
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
