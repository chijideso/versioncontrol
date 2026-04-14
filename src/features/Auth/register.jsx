import { useState } from 'react';
import {
  TextInput, PasswordInput, Button, Paper, Title, Stack,
  Container, Text, Anchor, SimpleGrid, Select, NumberInput, Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../hooks/useNotification';
import { ROUTES } from '../../routes/routeTypes';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await register(formData.get('email'), formData.get('password'));
      await signOut(auth);
      showSuccess('Account Created', 'Please sign in with your new credentials.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      showError('Registration Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={500} my={40}>
      <Title ta="center" fw={900}>Create your Account</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleRegister}>
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput label="First Name" name="firstName" required />
              <TextInput label="Last Name" name="lastName" required />
            </SimpleGrid>

            <TextInput label="Middle Name (Optional)" name="middleName" />

            <SimpleGrid cols={2}>
              <NumberInput label="Age" name="age" min={13} max={120} required />
              <Select
                label="Gender"
                name="gender"
                placeholder="Pick one"
                data={['Male', 'Female', 'Other', 'Prefer not to say']}
                required
              />
            </SimpleGrid>

            <TextInput label="Country" name="country" required />
            <TextInput label="Email Address" name="email" required />
            <PasswordInput label="Password" name="password" required />

            <Button type="submit" fullWidth mt="md" loading={loading} color="indigo">
              Register Account
            </Button>
          </Stack>
        </form>

        <Text ta="center" mt="md" size="sm">
          Already have an account?{' '}
          <Anchor onClick={() => navigate(ROUTES.LOGIN)}>Sign in</Anchor>
        </Text>
      </Paper>

      <Modal opened={opened} onClose={close} title="Reset Password" centered>
        <Stack>
          <Text size="sm">Enter your email and we'll send you a reset link.</Text>
          <TextInput label="Email" placeholder="your@email.com" required />
          <Button fullWidth onClick={() => {
            showSuccess('Email Sent', 'Check your inbox for instructions.');
            close();
          }}>
            Send Reset Link
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}