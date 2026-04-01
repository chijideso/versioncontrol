import { AppShell, Burger, NavLink, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IconHome2, IconBell, IconSettings, IconLogout } from '@tabler/icons-react';
import { ROUTES } from '../../routes/routeTypes';

export default function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

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
          <Title order={3} c="blue">SocialConnect</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {data.map((item) => (
          <NavLink
            key={item.label}
            label={item.label}
            leftSection={<item.icon size="1rem" stroke={1.5} />}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
        <NavLink
          label="Logout"
          leftSection={<IconLogout size="1rem" stroke={1.5} />}
          onClick={() => navigate(ROUTES.LOGIN)}
          color="red"
          mt="auto"
        />
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}