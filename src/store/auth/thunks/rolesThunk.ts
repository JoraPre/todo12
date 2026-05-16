import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfile } from "../../../api/auth";
import { getErrorMessage } from "../../../helpers/errorMessage";
import { Profile } from "../../../types/typesAuth";

export const fetchProfileThunk = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>("user/profile", async (_, { rejectWithValue }) => {
  try {
    const response = await getProfile();
    return response;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error));
  }
});
