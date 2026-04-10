import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routeTypes';
import AppLayout from '../features/Applayout/applayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Login from '../features/auth/login.jsx';
import Register from '../features/auth/register.jsx';
import Dashboard from '../features/Dashboard/dashboard.jsx';
import Notification from '../features/Notification/notifications.jsx';
import Settings from '../features/settings/settings.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path={ROUTES.NOTIFICATIONS} element={<Notification />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>
    </Routes>
  );
}