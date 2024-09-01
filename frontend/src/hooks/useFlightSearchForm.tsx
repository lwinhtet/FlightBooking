import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { IFormInput } from '@/pages/FlightSearchPage';
import { TripType } from '@/interfaces/tripType';
import { addDays } from 'date-fns';
import { toQueryStringForFlightsSearch } from '@/utils/helper';
import Flight from '@/interfaces/Flight';
import { useNavigate } from 'react-router-dom';
import {
  getLocalStorageData,
  removeLocalStorageData,
  storeLocalStorageData,
} from '@/utils/storageUtils';

const useFlightSearchForm = () => {
  const navigate = useNavigate();
  const currentDate = new Date();

  const storedFormData = getLocalStorageData('flightSearchParams');

  let initialValues = {
    origin: '',
    destination: '',
    tripType: TripType.ROUND_TRIP,
    dates: {
      from: currentDate,
      to: addDays(currentDate, 6),
    },
  };

  if (storedFormData) {
    const { from, to } = storedFormData.dates;
    initialValues = {
      origin: storedFormData.origin,
      destination: storedFormData.destination,
      tripType: storedFormData.tripType,
      dates: {
        from: new Date(from),
        to: new Date(to),
      },
    };
  }

  const [values, setValues] = useState<IFormInput>(initialValues);
  const [departFlights, setDepartFlights] = useState<Flight[] | undefined>(
    undefined
  );
  const [returnFlights, setReturnFlights] = useState<Flight[] | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetParams = () => {
    setErrorMessage('Please fill in all required search fields.');
    // remove query string
    navigate('/flights', { replace: true });
    removeLocalStorageData('flightSearchParams');
  };

  const fetchFlights = async () => {
    const { origin, destination, tripType, dates } = values;
    const { from: departDate, to: returnDate } = dates as DateRange;

    if (!origin || !destination || !tripType) {
      resetParams();
      return;
    }

    if (tripType === TripType.ROUND_TRIP && (!departDate || !returnDate)) {
      resetParams();
      return;
    }

    if (tripType === TripType.ONE_WAY && !departDate) {
      resetParams();
      return;
    }

    const queryString = toQueryStringForFlightsSearch(values);

    const url = `${import.meta.env.VITE_API_BASE_URL}/flights?${queryString}`;
    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    storeLocalStorageData('flightSearchParams', values);

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { data } = await response.json();
      const { departFlights, returnFlights, tripType } = data;

      setDepartFlights(departFlights);

      if (tripType === TripType.ROUND_TRIP) {
        setReturnFlights(returnFlights);
      } else {
        setReturnFlights(undefined);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMessage('Failed to fetch flights');
    }
  };

  useEffect(() => {
    if (storedFormData) {
      fetchFlights();
    }
  }, []); // Empty dependency array to run only on mount

  const onOriginChange = (value: string) => {
    setValues({
      ...values,
      origin: value !== '0' ? value : '',
    });
  };

  const onDestinationChange = (value: string) => {
    setValues({
      ...values,
      destination: value !== '0' ? value : '',
    });
  };

  const handleTypeTripChange = (value: string) => {
    setValues({
      ...values,
      tripType: value,
      dates: {
        from: values.dates?.from,
        to:
          value === TripType.ROUND_TRIP
            ? addDays(values.dates?.from as Date, 6)
            : undefined,
      },
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    setValues({
      ...values,
      dates: {
        from: date,
        to: undefined,
      },
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setValues({
      ...values,
      dates: {
        from: range?.from,
        to: range?.to,
      },
    });
  };

  return [
    values,
    onOriginChange,
    onDestinationChange,
    handleTypeTripChange,
    handleDateChange,
    handleDateRangeChange,
    departFlights,
    returnFlights,
    errorMessage,
    setErrorMessage,
    fetchFlights,
    setDepartFlights,
    setReturnFlights,
  ] as const;
};

export default useFlightSearchForm;
