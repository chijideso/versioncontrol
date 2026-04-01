import { Title, Switch, Stack, Paper } from '@mantine/core';

export default function Settings() {
  return (
    <Stack>
      <Title order={2}>Settings</Title>
      <Paper withBorder p="md" radius="md">
        <Switch label="Email Notifications" defaultChecked />
        <Switch label="Dark Mode" mt="md" />
      </Paper>
    </Stack>
  );
}