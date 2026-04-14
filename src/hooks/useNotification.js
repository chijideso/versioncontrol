import { notifications } from '@mantine/notifications';

export const useNotification = () => {
  const showSuccess = (title, message) => {
    notifications.show({ title, message, color: 'teal', autoClose: 5000 });
  };

  const showError = (title, message) => {
    notifications.show({ title, message, color: 'red', autoClose: 5000 });
  };

  return { showSuccess, showError };
};