import { createAsyncThunk } from "@reduxjs/toolkit";
import { register } from "../../../api/auth";
import { getErrorMessage } from "../../../helpers/errorMessage";
import type { UserRegistration } from "../../../types/typesAuth";

export const registrationThunk = createAsyncThunk<
  void,
  UserRegistration,
  { rejectValue: string }
>("auth/registration", async (data, { rejectWithValue }) => {
  try {
    await register(data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
