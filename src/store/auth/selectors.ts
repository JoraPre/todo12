import { RootState } from "../index";
import { Roles } from "../../types/typesUsers";

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthorized = (state: RootState) => state.auth.isAuthorized;

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectUserProfile = (state: RootState) => state.auth.user;

const emptyRoles: Roles[] = [];

export const selectUserRoles = (state: RootState) =>
  state.auth.user?.roles ?? emptyRoles;

export const selectHasRole = (role: Roles) => (state: RootState) =>
  selectUserRoles(state).includes(role);

export const selectIsAdmin = (state: RootState) =>
  selectUserRoles(state).includes(Roles.ADMIN);

export const selectIsModerator = (state: RootState) =>
  selectUserRoles(state).includes(Roles.MODERATOR);

export const selectIsUser = (state: RootState) =>
  selectUserRoles(state).includes(Roles.USER);

export const selectCanModerate = (state: RootState) =>
  selectIsAdmin(state) || selectIsModerator(state);
