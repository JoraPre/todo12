import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthorized, selectAuthStatus } from '../store/auth/selectors';

export default function ProtectedRouter() {
  const isAuthorized = useAppSelector(selectIsAuthorized);
  const status = useAppSelector(selectAuthStatus);

  if (status === 'idle' || status === 'loading') {
    return <Spin spinning fullscreen tip="Проверка авторизации..." />;
  }

  if (!isAuthorized) return <Navigate to="/login" replace />;

  return <Outlet />;
}
