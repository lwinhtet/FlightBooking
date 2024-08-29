import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { IFormInput } from '@/pages/FlightSearchPage';
import { TripType } from '@/interfaces/tripType';
import { addDays } from 'date-fns';
import { toQueryStringForFlightsSearch } from '@/utils/helper';
import Flight from '@/interfaces/Flight';

const useFlightSearchForm = () => {
  const currentDate = new Date();

  const storedFormData = localStorage.getItem('flightSearchParams');

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
    const parsed = JSON.parse(storedFormData);
    const { from, to } = parsed.dates;
    initialValues = {
      origin: parsed.origin,
      destination: parsed.destination,
      tripType: parsed.tripType,
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

  const displayErrorMsg = () =>
    setErrorMessage('Please fill in all required search fields.');

  const fetchFlights = async () => {
    const { origin, destination, tripType, dates } = values;
    const { from: departDate, to: returnDate } = dates as DateRange;

    if (!origin || !destination || !tripType) {
      displayErrorMsg();
      return;
    }

    if (tripType === TripType.ROUND_TRIP && (!departDate || !returnDate)) {
      displayErrorMsg();
      return;
    }

    if (tripType === TripType.ONE_WAY && !departDate) {
      displayErrorMsg();
      return;
    }

    const queryString = toQueryStringForFlightsSearch(values);

    const url = `${import.meta.env.VITE_API_BASE_URL}/flights?${queryString}`;
    const newUrl = `${window.location.pathname}?${queryString}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    localStorage.setItem('flightSearchParams', JSON.stringify(values));

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
      destination: value,
    });
  };

  const handleTypeTripChange = (value: string) => {
    console.log(44, value);
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
  ] as const;
};

export default useFlightSearchForm;
