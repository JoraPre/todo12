import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slices/authSlice";
import dashboardReducer from "./dashboard/slices/dashboardSlice";
import usersReducer from "./users/slices/usersSlice";
import notificationsReducer from "./notifications/slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
