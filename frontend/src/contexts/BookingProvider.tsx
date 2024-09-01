import Flight from '@/interfaces/Flight';
import { getLocalStorageData } from '@/utils/storageUtils';
import React, { createContext, useState, ReactElement } from 'react';

export interface BookingContextType {
  departFlight?: Flight;
  returnFlight?: Flight;
  setDepartFlight: React.Dispatch<React.SetStateAction<Flight | undefined>>;
  setReturnFlight: React.Dispatch<React.SetStateAction<Flight | undefined>>;
}

const initBookingState: BookingContextType = {
  departFlight: undefined,
  returnFlight: undefined,
  setDepartFlight: () => {},
  setReturnFlight: () => {},
};

const BookingContext = createContext<BookingContextType>(initBookingState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const BookingProvider = ({ children }: ChildrenType): ReactElement => {
  const initDF = getLocalStorageData('departFlight');
  const initRF = getLocalStorageData('returnFlight');
  const [departFlight, setDepartFlight] = useState<Flight | undefined>(
    initDF ? initDF : undefined
  );
  const [returnFlight, setReturnFlight] = useState<Flight | undefined>(
    initRF ? initRF : undefined
  );

  return (
    <BookingContext.Provider
      value={{ departFlight, returnFlight, setDepartFlight, setReturnFlight }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
