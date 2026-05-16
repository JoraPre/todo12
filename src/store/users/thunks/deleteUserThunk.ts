import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteUser } from "../../../api/user";
import { getErrorMessage } from "../../../helpers/errorMessage";

export const deleteUserThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("users/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteUser(id);
    return id;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
