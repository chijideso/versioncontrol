import { Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import AppLayout from './features/Applayout/applayout';
import Login from './features/Auth/login';
import Register from './features/Auth/register';
import Dashboard from './features/Dashboard/dashboard';
import Notification from './features/Notification/notifications';
import Messages from './features/Messages/messages';
import Hashtags from './features/Hashtags/hashtags';
import Profile from './features/profile/profile';
import { ROUTES } from './routes/routeTypes';

// 1. Guard for pages that require a login
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

// 2. The routing logic
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public: Redirect to Dashboard if already logged in */}
      <Route 
        path={ROUTES.LOGIN} 
        element={!user ? <Login /> : <Navigate to={ROUTES.DASHBOARD} replace />} 
      />
      <Route 
        path={ROUTES.REGISTER} 
        element={!user ? <Register /> : <Navigate to={ROUTES.DASHBOARD} replace />} 
      />

      {/* Protected: All these share the AppLayout (Sidebar/Header) */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="messages" element={<Messages />} />
        <Route path="hashtags" element={<Hashtags />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div>Settings coming soon</div>} />
      </Route>

      {/* Fallback: Send strangers to Login */}
      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}

// 3. The Root Component (NO BrowserRouter here!)
export default function App() {
  return (
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MantineProvider>
  );
}