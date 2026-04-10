import { AppShell, Burger, NavLink, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, useLocation } from 'react-router-dom'; // Keep this one
import { IconHome2, IconBell, IconSettings, IconLogout } from '@tabler/icons-react';
import { ROUTES } from '../../routes/routeTypes';
import { useAuth } from '../../contexts/AuthContext.jsx';
// I deleted the duplicate 'import { useNavigate }' from here

export default function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const data = [
    { icon: IconHome2, label: 'Feed', path: ROUTES.DASHBOARD },
    { icon: IconBell, label: 'Notifications', path: ROUTES.NOTIFICATIONS },
    { icon: IconSettings, label: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
<Title order={3}>SocialConnect</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {data.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            leftSection={<item.icon size="1rem" stroke={1.5} />}
            active={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (opened) toggle(); // Closes mobile menu on click
            }}
          />
        ))}
        <NavLink
          label="Logout"
          leftSection={<IconLogout size="1rem" stroke={1.5} />}
          onClick={logout}
          color="red"
          variant="subtle"
          mt="auto"
        />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}