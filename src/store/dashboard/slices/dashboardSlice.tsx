import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, computeStats } from "../../../api/dashboard";
import type { DashboardStats, PeriodType } from "../../../types";
import { getErrorMessage } from "../../../helpers/errorMessage";

export const fetchDashboardThunk = createAsyncThunk<
  DashboardStats,
  PeriodType,
  { rejectValue: string }
>("dashboard/fetch", async (period, { rejectWithValue }) => {
  try {
    const response = await getAllUsers();
    const users = Array.isArray(response.data) ? response.data : response;
    return computeStats(users, period);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
