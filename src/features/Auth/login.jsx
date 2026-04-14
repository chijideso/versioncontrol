import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Container, Text, Anchor, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../hooks/useNotification';
import { ROUTES } from '../../routes/routeTypes';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await login(formData.get('email'), formData.get('password'));
      showSuccess('Welcome back!', 'Successfully signed in.');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      showError('Login Failed', 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={60}>
      <Title ta="center" fw={900}>SocialApp</Title>

      <Paper withBorder shadow="xl" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput label="Email" name="email" required />
            <PasswordInput label="Password" name="password" required />
            <Anchor size="sm" component="button" type="button" onClick={open}>
              Forgot password?
            </Anchor>
            <Button type="submit" fullWidth loading={loading}>Sign in</Button>
          </Stack>
        </form>
      </Paper>

      {/* ✅ Added register link */}
      <Text ta="center" mt="md" size="sm">
        Don't have an account?{' '}
        <Anchor onClick={() => navigate(ROUTES.REGISTER)}>Create one</Anchor>
      </Text>

      <Modal opened={opened} onClose={close} title="Reset Password" centered>
        <Stack>
          <Text size="sm">Enter your email to receive a reset link.</Text>
          <TextInput label="Email" placeholder="your@email.com" required />
          <Button fullWidth onClick={() => { showSuccess('Reset Link Sent', 'Check your email inbox.'); close(); }}>
            Send Link
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}