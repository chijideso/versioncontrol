import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Container, Text, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await login(email, password);
      notifications.show({
        title: 'Welcome!',
        message: 'Successfully logged in.',
        color: 'teal',
      });
      navigate('/'); // Navigation happens here now
    } catch (err) {
      notifications.show({
        title: 'Login Failed',
        message: 'Invalid email or password.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={60}>
      <Title ta="center" fw={900}>SocialApp</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput label="Email" name="email" placeholder="hello@example.com" required />
            <PasswordInput label="Password" name="password" placeholder="Your password" required />
            <Button type="submit" fullWidth loading={loading}>Sign in</Button>
          </Stack>
        </form>
        <Text ta="center" mt="md">
          New here? <Anchor onClick={() => navigate('/register')}>Create account</Anchor>
        </Text>
      </Paper>
    </Container>
  );
}