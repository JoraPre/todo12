import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import TodoListPage from "../pages/TodoListPage/TodoListPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegistrationPage from "../pages/RegistrationPage/RegistrationPage";
import ProtectedRouter from "./ProtectedRouter";
import AuthLayout from "../components/AuthLayout";
import UsersPage from "../pages/UsersPage/UsersPage";
import { Roles } from "../types/typesUsers";
import { UserEditPage } from "../pages/UserEditPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "registration", element: <RegistrationPage /> },
    ],
  },

  {
    element: <ProtectedRouter />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "todo", element: <TodoListPage /> },
          { path: "profile", element: <ProfilePage /> },

          {
            element: (
              <ProtectedRouter allowedRoles={[Roles.ADMIN, Roles.MODERATOR]} />
            ),
            children: [
              { path: "users", element: <UsersPage /> },
              { path: "users/:id", element: <UserEditPage /> },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "/forbidden",
    element: <div>403 Forbidden — У вас нет доступа к этой странице</div>,
  },

  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
