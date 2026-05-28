import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRouter from './ProtectedRouter';
import LoginPage from '../PAges/LoginPage';
import AppLayout from '../components/AppLayout';
import DashboardPage from '../PAges/DashboardPage';
import UsersPage from '../PAges/UsersPage';
import ProfilePage from '../PAges/ProfilePage';
import SettingsPage from '../PAges/SettingsPage';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRouter />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/users', element: <UsersPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <div>404 Not Found</div> },
]);
