// src/App.jsx
import '@mantine/core/styles.css'; // Essential for Mantine components
import { MantineProvider } from '@mantine/core';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <AppRoutes />
    </MantineProvider>
  );
}

export default App;