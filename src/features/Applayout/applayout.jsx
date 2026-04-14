import { AppShell, Burger, NavLink, Group, Title, Stack, Text, Divider, Indicator, Avatar, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { IconHome2, IconBell, IconSettings, IconLogout, IconUserCircle, IconMoon, IconSun, IconMessage, IconTrendingUp } from '@tabler/icons-react';
import { ROUTES } from '../../routes/routeTypes';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const navItems = [
    { icon: IconHome2, label: 'Feed', path: ROUTES.DASHBOARD },
    { icon: IconBell, label: 'Notifications', path: ROUTES.NOTIFICATIONS, badge: 3 },
    { icon: IconMessage, label: 'Messages', path: ROUTES.MESSAGES },
    { icon: IconTrendingUp, label: 'Trending', path: ROUTES.HASHTAGS },
    { icon: IconSettings, label: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} c="indigo">SocialConnect</Title>
          </Group>
          <ActionIcon variant="default" onClick={toggleColorScheme} size="lg">
            {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoon size="1.2rem" />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs" style={{ flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              leftSection={
                item.badge ? (
                  <Indicator label={item.badge} size={16} color="red">
                    <item.icon size="1.2rem" stroke={1.5} />
                  </Indicator>
                ) : (
                  <item.icon size="1.2rem" stroke={1.5} />
                )
              }
              active={location.pathname === item.path}
              onClick={() => { navigate(item.path); if (opened) toggle(); }}
              radius="md"
            />
          ))}
        </Stack>

        <Stack gap="xs">
          <Divider />

          {/* Clickable user info → goes to profile */}
          <Group
            px="xs"
            py="sm"
            style={{ cursor: 'pointer', borderRadius: 8 }}
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            <Avatar
              src={user?.photoURL}
              radius="xl"
              size="md"
              color="indigo"
            >
              <IconUserCircle size="1.4rem" />
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500} truncate>
                {user?.displayName || user?.email || 'Guest User'}
              </Text>
              <Text size="xs" c="dimmed" truncate>View profile</Text>
            </div>
          </Group>

          <NavLink
            label="Logout"
            leftSection={<IconLogout size="1.2rem" stroke={1.5} />}
            onClick={logout}
            color="red"
            variant="light"
            radius="md"
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}