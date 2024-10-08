import { DatePicker } from '@/components/DatePicker';
import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { SelectScrollable } from '@/components/SelectScrollable';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { destinations, origins } from '@/constants/cities';
import { TripType } from '@/interfaces/tripType';
import Flight from '@/interfaces/Flight';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import useFlightSearchForm from '@/hooks/useFlightSearchForm';
import FlightCard from '@/components/FlightCard';
import useBooking from '@/hooks/useBooking';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  removeLocalStorageData,
  storeLocalStorageData,
} from '@/utils/storageUtils';

export interface IFormInput {
  origin: string;
  destination: string;
  tripType: string;
  dates: DateRange | undefined;
}

const FlightSearchPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const { departFlight, setDepartFlight, setReturnFlight } = useBooking();

  const [
    formData,
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
  ] = useFlightSearchForm();

  const onSelectDepartFlight = (flight: Flight) => {
    if (formData.tripType === TripType.ROUND_TRIP) {
      setStep(2);
    } else {
      if (!isAuthenticated) {
        toastPlsLogin();
        return;
      }
      navigate('/bookingDetails');
    }
    setDepartFlight(flight);
    storeLocalStorageData('departFlight', flight);
  };

  const onEditDepartFlight = () => {
    setDepartFlight(undefined);
    removeLocalStorageData('departFlight');
    setStep(1);
  };

  const onSelectReturnFlight = (flight: Flight) => {
    if (!isAuthenticated) {
      toastPlsLogin();
      return;
    }
    setReturnFlight(flight);
    storeLocalStorageData('returnFlight', flight);
    navigate('/bookingDetails');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage('');

    await fetchFlights();
  };

  useEffect(() => {
    setStep(1);
    if (formData.tripType === TripType.ONE_WAY) {
      setReturnFlight(undefined);
      removeLocalStorageData('returnFlight');
    }
    setDepartFlight(undefined);
    removeLocalStorageData('departFlight');
    setDepartFlights(undefined);
    setReturnFlights(undefined);
  }, [
    formData.tripType,
    setDepartFlight,
    setDepartFlights,
    setReturnFlight,
    setReturnFlights,
  ]);

  const toastPlsLogin = () => {
    toast({
      title: 'Please Log In to Book a Flight',
      description:
        'To proceed with booking a flight, you need to be logged in. Please sign in to your account or register if you don’t have one.',
    });
  };

  const TripTypeRadioGroup = (
    <RadioGroup
      defaultValue={formData.tripType}
      onValueChange={handleTypeTripChange}
      className="flex flex-row gap-10 max-w-6xl mx-auto mt-1 mb-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={TripType.ROUND_TRIP} id={TripType.ROUND_TRIP} />
        <Label htmlFor={TripType.ROUND_TRIP}>Round-trip</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={TripType.ONE_WAY} id={TripType.ONE_WAY} />
        <Label htmlFor={TripType.ONE_WAY}>One-way</Label>
      </div>
    </RadioGroup>
  );

  const DatePickerContent =
    formData.tripType === TripType.ROUND_TRIP ? (
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="terms" className="font-light text-[12px]">
          Depart Date - Return Date
        </Label>
        <DatePickerWithRange
          date={formData.dates}
          setDate={handleDateRangeChange}
        />
      </div>
    ) : (
      <div className="flex flex-col items-start space-y-2">
        <Label htmlFor="terms" className="font-light text-[12px]">
          Depart Date
        </Label>
        <DatePicker date={formData?.dates?.from} setDate={handleDateChange} />
      </div>
    );

  const SearchFlightInputs = (
    <form onSubmit={handleSubmit}>
      <div className="flex-between max-w-6xl mx-auto">
        <div className="flex flex-row flex-nowrap gap-5">
          <div className="flex flex-col items-start space-y-2">
            <Label htmlFor="terms" className="font-light text-[12px]">
              Flying From:
            </Label>
            <SelectScrollable
              placeholder="Flying From"
              data={origins}
              value={formData.origin}
              onValueChange={onOriginChange}
            />
          </div>
          <div className="flex flex-col items-start space-y-2">
            <Label htmlFor="terms" className="font-light text-[12px]">
              Going To:
            </Label>
            <SelectScrollable
              placeholder="Going To"
              data={destinations}
              value={formData.destination}
              onValueChange={onDestinationChange}
            />
          </div>
          {DatePickerContent}
        </div>
        <Button
          type="submit"
          className="self-end mx-10 w-full bg-my-primary hover:bg-my-third"
        >
          Search
        </Button>
      </div>
    </form>
  );

  const DepartFlightList = () => {
    if (departFlights === undefined) {
      return (
        <div className="flex flex-col gap-4 mt-32">
          <p className="text-2xl font-semibold">
            Welcome! Ready to find your next flight?
          </p>
          <p className="text-base text-gray-500">
            Enter your departure and destination, select your travel dates, and
            let us help you find the best options.
          </p>
        </div>
      );
    }

    if (departFlights.length === 0) {
      return (
        <div className="flex flex-col gap-4 mt-32">
          <p className="text-2xl font-semibold">{`Uh oh! We couldn’t find any flights to ${formData.destination}`}</p>
          <p className="text-base text-gray-500">
            Try another date. Who knows? You might just find a better deal.
          </p>
        </div>
      );
    }

    return departFlights.map((flight) => (
      <FlightCard
        key={flight.id}
        flight={flight}
        flightType="depart"
        onSelect={onSelectDepartFlight}
      />
    ));
  };

  const ReturnFlightList = () => {
    if (returnFlights === undefined || returnFlights.length === 0) {
      return (
        <div className="flex flex-col gap-4 mt-32">
          <p className="text-2xl font-semibold">{`Uh oh! We couldn’t find any flights back to ${formData.origin}`}</p>
          <p className="text-base text-gray-500">
            Try another date. Who knows? You might just find a better deal.
          </p>
        </div>
      );
    }

    return returnFlights.map((flight) => (
      <FlightCard
        key={flight.id}
        flight={flight}
        flightType="return"
        onSelect={onSelectReturnFlight}
      />
    ));
  };

  return (
    <>
      <Toaster />
      <div className="fixed top-16 left-0 w-full bg-main-2 p-6 shadow-md z-40">
        {TripTypeRadioGroup}

        {SearchFlightInputs}
        {errorMessage && (
          <div className="mt-4 text-red-700 max-w-[1150px] mx-auto border border-solid border-gray-300 px-7 py-1.5 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
      <div className="pt-[8rem]">
        <div className="flex flex-row space-x-4">
          {/* Filter */}
          <div className="w-1/4 p-4 rounded-lg">
            <h2 className="text-base text-left font-medium mb-4">Filter By</h2>
            <Separator className="my-4" />
          </div>

          {/* List */}
          <div className="flex-grow p-4 rounded-lg">
            {step === 1 && (
              <>
                {departFlights && departFlights.length > 0 && (
                  <h2 className="text-lg text-left font-medium mb-4">
                    Departing Flights
                  </h2>
                )}
                <div className="flex flex-col gap-y-4">
                  {DepartFlightList()}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {departFlight && (
                  <>
                    <div className="flex flex-col mb-4">
                      <h2 className="text-base text-left font-medium mb-4">
                        Selected Departing Flights
                      </h2>
                      <div className="flex flex-col gap-y-4">
                        <FlightCard
                          flight={departFlight}
                          flightType="depart"
                          onEdit={onEditDepartFlight}
                        />
                      </div>
                    </div>
                  </>
                )}

                {returnFlights && returnFlights.length > 0 && (
                  <h2 className="text-base text-left font-medium mb-4">
                    Return Flights
                  </h2>
                )}
                <div className="flex flex-col gap-y-4">
                  {ReturnFlightList()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightSearchPage;
