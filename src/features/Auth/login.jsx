import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routeTypes';

export default function Login() {
  const navigate = useNavigate();
  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome Back!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="you@example.com" required />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}