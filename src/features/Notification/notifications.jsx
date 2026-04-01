import { Title, Text, Paper, Stack } from '@mantine/core';

export default function Notification() {
  return (
    <Stack>
      <Title order={2}>Notifications</Title>
      <Paper withBorder p="md" radius="md">
        <Text size="sm">You have no new notifications at this time.</Text>
      </Paper>
    </Stack>
  );
}