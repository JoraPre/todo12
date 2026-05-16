import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, UserRolesRequest } from "../../../types/typesUsers";
import { getErrorMessage } from "../../../helpers/errorMessage";
import { updateUserRights } from "../../../api/user";

export const updateUserRightsThunk = createAsyncThunk<
  User,
  { id: number; data: UserRolesRequest },
  { rejectValue: string }
>("users/updateRights", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateUserRights(id, data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
