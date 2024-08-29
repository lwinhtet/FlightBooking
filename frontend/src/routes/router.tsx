import { createBrowserRouter, Navigate } from 'react-router-dom';
import ErrorPage from '@/error-page';
import App from '@/App';
import FlightSearchPage from '@/pages/FlightSearchPage';
import BookingDetailPage from '@/pages/BookingDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Navigate to="/flights" />, // Redirect from root to /flights
      },
      {
        path: 'flights',
        element: <FlightSearchPage />,
      },
      {
        path: 'bookingDetails',
        element: <BookingDetailPage />,
      },
    ],
  },
]);

export default router;
