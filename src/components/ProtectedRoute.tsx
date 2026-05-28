import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchMeThunk } from "../store/auth/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const { isAuthorized, currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthorized && !currentUser) {
      dispatch(fetchMeThunk());
    }
  }, [isAuthorized, currentUser, dispatch]);

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
