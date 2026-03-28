import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";

import { RootLayout, AppLayout } from "./Layouts.tsx/Layouts.tsx";
import { TodoListPage } from "./pages/autenthasd/profilepagee/todolistPage.tsx";
import { ProfilePage } from "./pages/autenthasd/profilepagee/profilePage.tsx";
import { ErrorPage } from "./pages/autenthasd/profilepagee/errorPage.tsx";
import AuthenticationPage, {
  action as authAction,
} from "./pages/autenthasd/Authentication1.tsx";

import { checkAuthLoader } from "./helpers/auth.tsx";
import { store } from "./store/AuthStore1.tsx";

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route element={<AppLayout />} loader={checkAuthLoader}>
          <Route index element={<TodoListPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route
          path="auth"
          element={<AuthenticationPage />}
          action={authAction}
        />
      </Route>
    )
  );
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
