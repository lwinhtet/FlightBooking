import { useContext } from 'react';
import BookingContext from '@/contexts/BookingProvider';
import { BookingContextType } from '@/contexts/BookingProvider';

const useBooking = (): BookingContextType => {
  return useContext(BookingContext);
};

export default useBooking;
