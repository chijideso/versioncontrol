import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Stack, Container, Text, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (password.length < 8) {
      notifications.show({ title: 'Error', message: 'Minimum 8 characters', color: 'red' });
      setLoading(false);
      return;
    }

    try {
      await register(email, password);
      notifications.show({ title: 'Success', message: 'Account created!', color: 'teal' });
      navigate('/');
    } catch (err) {
      notifications.show({ title: 'Failed', message: err.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={60}>
      <Title ta="center" fw={900}>Join SocialApp</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleRegister}>
          <Stack>
            <TextInput label="Email" name="email" required />
            <PasswordInput label="Password" name="password" required />
            <Button type="submit" fullWidth loading={loading} color="teal">Register</Button>
          </Stack>
        </form>
        <Text ta="center" mt="md">
          Already have an account? <Anchor onClick={() => navigate('/login')}>Login</Anchor>
        </Text>
      </Paper>
    </Container>
  );
}