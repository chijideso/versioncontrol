import { Title, Text, Container, Stack, Paper, Badge, Group, Avatar } from '@mantine/core';

export default function Notification() {
  return (
    <Container size="sm" py="xl">
      <Title order={2} mb="lg">Notifications</Title>
      <Stack gap="md">
        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="sm">
            <div>
              <Text fw={500}>Alice Johnson liked your post</Text>
              <Text size="sm" c="dimmed">2 hours ago</Text>
            </div>
            <Badge color="green">New</Badge>
          </Group>
          <Text size="sm">"Great insights! Loved your post about React..."</Text>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="sm">
            <div>
              <Text fw={500}>Bob Smith commented on your post</Text>
              <Text size="sm" c="dimmed">4 hours ago</Text>
            </div>
            <Badge color="green">New</Badge>
          </Group>
          <Text size="sm">"Thanks for sharing this! Very helpful"</Text>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="sm">
            <div>
              <Text fw={500}>Charlie started following you</Text>
              <Text size="sm" c="dimmed">1 day ago</Text>
            </div>
          </Group>
          <Text size="sm">You have 5 new followers this week!</Text>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Group justify="space-between" mb="sm">
            <div>
              <Text fw={500}>Welcome to SocialConnect!</Text>
              <Text size="sm" c="dimmed">2 days ago</Text>
            </div>
          </Group>
          <Text size="sm">You have successfully set up your account. Start following people and posting!</Text>
        </Paper>
      </Stack>
    </Container>
  );
}