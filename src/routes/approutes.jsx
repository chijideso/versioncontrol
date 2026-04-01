import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routeTypes';

// We add .jsx explicitly to help Vite resolve the path in cloned repos
import AppLayout from '../features/applayout/applayout.jsx';
import Login from '../features/auth/login.jsx';
import Dashboard from '../features/Dasboard/dashborad.jsx';
import Notification from '../features/Notification/notifications.jsx';
import Settings from '../features/settings/settings.jsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notification />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}