import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Flight from '@/interfaces/Flight';
import { formatUTCToLocalTime } from '@/utils/helper';

type PropsType = {
  flight: Flight;
  flightType: string;
  onSelect: (flight: Flight) => void;
};

const FlightCard = ({ flight, flightType, onSelect }: PropsType) => {
  const departTime = formatUTCToLocalTime(flight.departureDate);
  const arrivalTime = formatUTCToLocalTime(flight.arrivalDate);

  return (
    <div className="flex flex-col pt-4 pb-8 px-6 border rounded-md bg-white shadow-sm">
      <div className="flex-between">
        <Badge variant="default">Economy</Badge>
        <div className="flex flex-row">
          <span className="mx-1">$</span>{' '}
          <span className="text-xl font-semibold">{flight.EconomyPrice}</span>
        </div>
      </div>
      <div className="flex-between mb-4">
        <p className="text-[14px] font-medium text-gray-500">
          {flightType === 'depart' ? 'Depart' : 'Return'} - {flight.airline}
        </p>
        <p className="text-[12px] font-medium text-gray-500">/ 1 guest*</p>
      </div>
      <div className="flex-between justify-center gap-2">
        <div className="flex flex-row">
          <Avatar className="ml-8 mr-16 my-4">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-3 gap-x-4 items-center">
            <p className="text-[12px] text-gray-500 font-medium text-left">
              {departTime}
            </p>
            <div className="col-span-1 border-t-2 border-dotted border-gray-300"></div>
            <p className="text-[12px] text-gray-500 font-medium text-left">
              {arrivalTime}
            </p>

            <p className="text-[14px] text-gray-500 font-medium text-left">
              {flight.origin}
            </p>
            <div className="col-span-1 border-t-2 border-dotted border-gray-300"></div>
            <p className="text-[14px] text-gray-500 font-medium text-left">
              {flight.destination}
            </p>
          </div>
        </div>
        <Button className="self-end" onClick={() => onSelect(flight)}>
          Select
        </Button>
      </div>
    </div>
  );
};

export default FlightCard;
