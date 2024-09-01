import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Flight from '@/interfaces/Flight';
import { formatUTCToLocalTime } from '@/utils/helper';

type PropsType = {
  flight: Flight;
  flightType: string;
  onSelect?: (flight: Flight) => void;
  onEdit?: () => void;
};

const FlightCard = ({ flight, flightType, onSelect, onEdit }: PropsType) => {
  const departTime = formatUTCToLocalTime(flight.departureDate);
  const arrivalTime = formatUTCToLocalTime(flight.arrivalDate);
  const date1 = new Date(flight.departureDate);
  const date2 = new Date(flight.arrivalDate);
  const diff: number = date2.getTime() - date1.getTime();
  const hour: number = Math.floor(diff / (1000 * 60 * 60));
  const min: number = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="flex flex-col pt-4 pb-8 px-6 border rounded-md bg-white shadow-sm">
      <div className="flex-between">
        <Badge variant="default" className="bg-my-fourth">
          Economy
        </Badge>
        <div className="flex flex-row">
          <span className="mx-1">$</span>{' '}
          <span className="text-xl font-semibold">{flight.EconomyPrice}</span>
        </div>
      </div>
      <div className="flex-between mb-4">
        <p className="text-[12px] font-medium text-gray-500">
          {flightType === 'depart' ? 'Depart' : 'Return'} - {flight.airline}
        </p>
        <p className="text-[10px] font-medium text-gray-500">/ 1 guest*</p>
      </div>
      <div className="flex-between flex-nowrap justify-center gap-2">
        <div className="flex flex-row">
          <Avatar className="w-[100px]  ml-4 mr-16 my-4">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarImage src="/profiles/thai.png" className="object-cover" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-3 gap-x-4 items-center">
            <p className="text-[12px]  font-medium text-left">{departTime}</p>
            <div className="col-span-1 border-t-2 border-dotted border-gray-300"></div>
            <p className="text-[12px]  font-medium text-left">{arrivalTime}</p>

            <p className="text-[14px]  font-medium text-left">
              {flight.origin}
            </p>
            <div className="col-span-1 border-t-2 border-dotted border-gray-300"></div>
            <p className="text-[14px]  font-medium text-left">
              {flight.destination}
            </p>
          </div>
          <p className="px-10 self-center text-[12px] font-medium text-left">
            {hour.toString()}:{min.toString()}
          </p>
          <p className="px-8 self-center text-[12px] font-medium text-left">
            non-stop
          </p>
        </div>
        {onSelect && (
          <Button
            className="self-end bg-my-secondary"
            onClick={() => onSelect(flight)}
          >
            Select
          </Button>
        )}
        {onEdit && (
          <Button className="self-end bg-my-secondary" onClick={() => onEdit()}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
