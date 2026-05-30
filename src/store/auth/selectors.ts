import type { RootState } from '../index';

export const selectIsAuthorized = (state: RootState) => state.auth.isAuthorized;
// authSlice uses boolean loading, not status string — map it here
export const selectAuthStatus = (state: RootState) =>
  state.auth.loading ? 'loading' : 'succeeded';
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserProfile = (state: RootState) => state.auth.currentUser;
