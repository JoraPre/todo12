import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/slices/authSlice";

import usersReducer from "./users/slices/usersSlice";

import listenerMiddleware from "./middleware/authListeners";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
