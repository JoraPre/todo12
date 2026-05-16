import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { selectIsAuthorized } from "../store/auth/selectors";

export default function AuthLayout() {
  const isAuthorized = useAppSelector(selectIsAuthorized);

  if (isAuthorized) {
    return <Navigate to="/todo" replace />;
  }

  return <Outlet />;
}
