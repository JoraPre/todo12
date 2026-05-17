import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers } from "../../../api/user";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type {
  MetaResponse,
  User,
  UserFilters,
} from "../../../types/typesUsers";

export const fetchUsersThunk = createAsyncThunk<
  MetaResponse<User>,
  UserFilters | undefined,
  { rejectValue: string }
>("users/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await getUsers(params);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
