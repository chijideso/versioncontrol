import React from 'react';
import ReactDOM from 'react-dom/client'; // This is the missing line!
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

// Using ReactDOM.createRoot correctly
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);