import { Title, Switch, Stack, Paper, Button, Group, Avatar, Text } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
// FIXED: Changed from '../../../' to '../../'
import { useAuth } from '../../contexts/AuthContext.jsx'; 

export default function Settings() {
  const { logout, user } = useAuth();

  return (
    <Stack>
      <Title order={2}>Settings</Title>
      <Paper withBorder p="md" radius="md">
        <Group mb="md">
          <Avatar color="socialTeal" radius="xl">
            <IconUser />
          </Avatar>
          <div>
            <Text fw={500}>Current User</Text>
            {/* Dynamically show the logged-in user's email */}
            <Text size="sm" c="dimmed">{user?.email || 'Not logged in'}</Text>
          </div>
        </Group>
        <Switch label="Email Notifications" defaultChecked mb="md" />
        <Switch label="Push Notifications" mb="md" />
        <Switch label="Dark Mode" />
        <Button 
          fullWidth 
          variant="outline" 
          color="socialOrange"
          leftSection={<IconLogout size="1rem" />}
          mt="xl"
          onClick={logout}
        >
          Log out
        </Button>
      </Paper>
    </Stack>
  );
}