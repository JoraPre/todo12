import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, authTokenStore, getMe, updateUser } from '../../../api/auth';
import { getErrorMessage } from '../../../helpers/errorMessage';
import type { User } from '../../../types.ts/types';

interface AuthState {
  isAuthorized: boolean;
  currentUser: User | null;
  loading: boolean;
  profileLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthorized: false,
  currentUser: null,
  loading: false,
  profileLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await loginUser(credentials);
      authTokenStore.setAccessToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      dispatch(fetchMeThunk());
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const fetchMeThunk = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      return await getMe();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateMeThunk = createAsyncThunk<
  User,
  Partial<Pick<User, 'username' | 'email' | 'phoneNumber'>>,
  { rejectValue: string }
>('auth/updateMe', async (data, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const id = state.auth.currentUser?.id;
    if (!id) throw new Error('Пользователь не найден');
    return await updateUser(id, data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authTokenStore.clearAccessToken();
      localStorage.removeItem('refreshToken');
      state.isAuthorized = false;
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state) => { state.loading = false; state.isAuthorized = true; })
      .addCase(loginThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(fetchMeThunk.pending, (state) => { state.profileLoading = true; })
      .addCase(fetchMeThunk.fulfilled, (state, action) => { state.currentUser = action.payload; state.profileLoading = false; state.isAuthorized = true; })
      .addCase(fetchMeThunk.rejected, (state) => { state.profileLoading = false; })

      .addCase(updateMeThunk.fulfilled, (state, action) => { state.currentUser = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
