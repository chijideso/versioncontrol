import { Title, Text, Container, Stack, Paper } from '@mantine/core';

export default function Notification() {
  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg">Notifications</Title>
      <Stack>
        <Paper withBorder p="md" radius="md">
          <Text fw={500}>Welcome to SocialApp!</Text>
          <Text size="sm" c="dimmed">You have successfully set up your account.</Text>
        </Paper>
      </Stack>
    </Container>
  );
}