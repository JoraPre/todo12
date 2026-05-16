import { useAppSelector } from "../store/hooks";
import { Navigate, Outlet } from "react-router-dom";

import { Spin } from "antd";
import { Roles } from "../types/typesUsers";
import {
  selectAuthStatus,
  selectIsAuthorized,
  selectUserRoles,
} from "../store/auth/selectors";

interface ProtectedRouterProps {
  allowedRoles?: Roles[];
}

export default function ProtectedRouter({
  allowedRoles = [],
}: ProtectedRouterProps) {
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const status = useAppSelector(selectAuthStatus);
  const roles = useAppSelector(selectUserRoles);

  if (status === "idle" || status === "loading") {
    return <Spin spinning tip="Загрузка... Проверка авторизации" fullscreen />;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess =
    allowedRoles.length === 0 ||
    allowedRoles.some((role) => roles.includes(role));

  if (!hasAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
