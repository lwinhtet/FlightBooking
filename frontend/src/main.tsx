import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import './index.css';
import { BookingProvider } from './contexts/BookingProvider';
import { AuthProvider } from './contexts/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BookingProvider>
        <RouterProvider router={router} />
      </BookingProvider>
    </AuthProvider>
  </StrictMode>
);
