import { TripType } from '@/interfaces/tripType';
import { IFormInput } from '@/pages/FlightSearchPage';

export const toQueryStringForFlightsSearch = (input: IFormInput): string => {
  const params = new URLSearchParams();
  console.log(input);
  params.append('origin', input.origin);
  params.append('destination', input.destination);
  params.append('tripType', input.tripType);

  if (input.dates) {
    params.append('departureDate', (input.dates.from as Date).toISOString());

    if (input.tripType === TripType.ROUND_TRIP) {
      params.append('returnDate', (input.dates.to as Date).toISOString());
    }
  }

  return params.toString();
};

export const formatUTCToLocalTime = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
