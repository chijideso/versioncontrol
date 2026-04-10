import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import AppRoutes from './routes/approutes.jsx';

const theme = createTheme({
  primaryColor: 'indigo',
  primaryShade: { light: 6, dark: 6 },
  colors: {
    'socialIndigo': ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
    'socialOrange': ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
    'socialTeal': ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a'],
  },
  defaultRadius: 'lg', // Increased to 'lg' for a softer, more modern social look
  components: {
    Button: {
      styles: (theme) => ({
        root: {
          // Fixed the gradient syntax for CSS
          backgroundImage: 'linear-gradient(135deg, var(--mantine-color-indigo-6) 0%, var(--mantine-color-violet-6) 100%)',
          transition: 'transform 150ms ease',
          '&:active': { transform: 'scale(0.98)' },
        }
      })
    },
    Card: {
      defaultProps: {
        shadow: 'xl', // Stronger shadow for depth
        padding: 'lg',
        withBorder: true,
      }
    }
  }
});

function App() {
  return (
    // Only one provider is needed here with your custom theme
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" zIndex={1000} />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;