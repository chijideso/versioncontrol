import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routeTypes';
import AppLayout from '../features/Applayout/applayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../features/Auth/login.jsx';
import Register from '../features/Auth/register.jsx';
import Dashboard from '../features/Dashboard/dashboard.jsx';
import Notification from '../features/Notification/notifications.jsx';
import Settings from '../features/settings/settings.jsx';
import Profile from '../features/profile/profile.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Notification />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
      </Route>

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}