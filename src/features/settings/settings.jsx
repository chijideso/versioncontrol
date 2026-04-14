import { useState } from 'react';
import { Title, Switch, Stack, Paper, Button, Group, Avatar, Text, Container, Badge, SimpleGrid, Tabs, Progress, SegmentedControl } from '@mantine/core';
import { IconLogout, IconUser, IconBell, IconLock, IconAtom, IconBrandTwitter, IconBrandInstagram, IconMail, IconPhone } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; 

export default function Settings() {
  const { logout, user } = useAuth();

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">Settings</Title>
          <Text size="sm" c="dimmed">Manage your account and preferences</Text>
        </div>

        <Tabs defaultValue="account" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="account" leftSection={<IconUser size="1rem" />}>Account</Tabs.Tab>
            <Tabs.Tab value="privacy" leftSection={<IconLock size="1rem" />}>Privacy</Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size="1rem" />}>Notifications</Tabs.Tab>
            <Tabs.Tab value="social" leftSection={<IconAtom size="1rem" />}>Social</Tabs.Tab>
          </Tabs.List>

          {/* Account Tab */}
          <Tabs.Panel value="account" pt="xl">
            <Stack gap="lg">
              {/* Profile Card */}
              <Paper withBorder p="xl" radius="md" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Group mb="lg">
                  <Avatar 
                    src={user?.photoURL} 
                    size="80" 
                    radius="xl" 
                    color="blue"
                    style={{ border: '3px solid white' }}
                  >
                    {user?.displayName?.[0] || user?.email?.[0]}
                  </Avatar>
                  <div>
                    <Text fw={500} size="lg" c="white">{user?.displayName || 'Update your profile'}</Text>
                    <Text size="sm" c="rgba(255,255,255,0.8)">{user?.email}</Text>
                    <Badge color="green" mt="xs">Active</Badge>
                  </div>
                </Group>
              </Paper>

              {/* Stats */}
              <SimpleGrid cols={3} spacing="md">
                <Paper withBorder p="md" radius="md" ta="center">
                  <Text size="xs" c="dimmed" fw={500} mb="xs">Posts</Text>
                  <Text fw={700} size="xl">24</Text>
                </Paper>
                <Paper withBorder p="md" radius="md" ta="center">
                  <Text size="xs" c="dimmed" fw={500} mb="xs">Followers</Text>
                  <Text fw={700} size="xl">1.2K</Text>
                </Paper>
                <Paper withBorder p="md" radius="md" ta="center">
                  <Text size="xs" c="dimmed" fw={500} mb="xs">Following</Text>
                  <Text fw={700} size="xl">340</Text>
                </Paper>
              </SimpleGrid>

              {/* Storage */}
              <Paper withBorder p="md" radius="md">
                <Group justify="space-between" mb="sm">
                  <Text fw={500}>Storage</Text>
                  <Text size="sm" c="dimmed">2.3 GB / 15 GB</Text>
                </Group>
                <Progress value={15} color="blue" />
              </Paper>

              {/* Actions */}
              <Button variant="light" fullWidth>Change Password</Button>
              <Button variant="light" fullWidth>Download Your Data</Button>
              <Button 
                fullWidth 
                variant="filled" 
                color="red"
                leftSection={<IconLogout size="1rem" />}
                onClick={logout}
              >
                Log out from all devices
              </Button>
            </Stack>
          </Tabs.Panel>

          {/* Privacy Tab */}
          <Tabs.Panel value="privacy" pt="xl">
            <Stack gap="lg">
              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Profile Visibility</Title>
                <Switch label="Make profile public" defaultChecked mb="sm" description="Allow others to find and view your profile" />
                <Switch label="Show online status" defaultChecked mb="sm" description="Let others see when you are active" />
                <Switch label="Allow message requests" defaultChecked description="Let anyone send you messages" />
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Search & Discovery</Title>
                <Switch label="Appear in search results" defaultChecked mb="sm" />
                <Switch label="Let search engines index profile" defaultChecked />
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Data & Privacy</Title>
                <Switch label="Share analytics data" defaultChecked mb="sm" description="Help us improve SocialConnect" />
                <Button variant="light" fullWidth mt="md">View Privacy Policy</Button>
                <Button variant="light" fullWidth mt="sm" color="red">Delete Account</Button>
              </Paper>
            </Stack>
          </Tabs.Panel>

          {/* Notifications Tab */}
          <Tabs.Panel value="notifications" pt="xl">
            <Stack gap="lg">
              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Email Notifications</Title>
                <Switch label="New follower notifications" defaultChecked mb="sm" />
                <Switch label="Post likes & comments" defaultChecked mb="sm" />
                <Switch label="Direct messages" defaultChecked mb="sm" />
                <Switch label="Weekly digest" defaultChecked />
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Push Notifications</Title>
                <Switch label="Enable push notifications" defaultChecked mb="sm" />
                <Switch label="Sound alerts" defaultChecked mb="sm" />
                <Switch label="Show preview" defaultChecked />
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Quiet Hours</Title>
                <Group mb="md">
                  <Text size="sm">Silent notifications from</Text>
                </Group>
                <SegmentedControl 
                  data={['10 PM - 8 AM', '11 PM - 7 AM', 'Custom']}
                  fullWidth
                  defaultValue="10 PM - 8 AM"
                />
              </Paper>
            </Stack>
          </Tabs.Panel>

          {/* Social Tab */}
          <Tabs.Panel value="social" pt="xl">
            <Stack gap="lg">
              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Connected Accounts</Title>
                <Group mb="sm">
                  <IconBrandTwitter size="1.5rem" color="#1DA1F2" />
                  <Text>Twitter</Text>
                  <Button size="xs" ml="auto" variant="default">Connect</Button>
                </Group>
                <Group mb="sm">
                  <IconBrandInstagram size="1.5rem" color="#E4405F" />
                  <Text>Instagram</Text>
                  <Button size="xs" ml="auto" variant="default">Connect</Button>
                </Group>
              </Paper>

              <Paper withBorder p="md" radius="md">
                <Title order={5} mb="md">Contact & Support</Title>
                <Group mb="sm">
                  <IconMail size="1rem" />
                  <Text size="sm">Email Support</Text>
                </Group>
                <Group mb="sm">
                  <IconPhone size="1rem" />
                  <Text size="sm">+1 (555) 123-4567</Text>
                </Group>
                <Button fullWidth variant="light" mt="md">Contact Us</Button>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* App Info Footer */}
        <Paper withBorder p="md" radius="md" bg="gray.1" mt="xl">
          <Group justify="space-between" mb="sm">
            <Text size="sm" fw={500}>SocialConnect</Text>
            <Badge color="blue">v1.0.0</Badge>
          </Group>
          <Text size="xs" c="dimmed">© 2026 SocialConnect. All rights reserved.</Text>
        </Paper>
      </Stack>
    </Container>
  );
}