import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useBooking from '@/hooks/useBooking';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { getToken } from '@/utils/responseHelper';
import { useNavigate } from 'react-router-dom';
import { removeLocalStorageData } from '@/utils/storageUtils';

const BookingDetailPage = () => {
  const { departFlight, returnFlight } = useBooking();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [passengerAge, setPassengerAge] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const departPrice = Number(departFlight?.EconomyPrice) || 0;
  const returnPrice = Number(returnFlight?.EconomyPrice) || 0;
  const totalAmount = departPrice + returnPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData = {
      passengerName,
      passengerEmail,
      passengerAge,
      cardNumber,
      expiryDate,
      departFlightId: departFlight?.id,
      returnFlightId: returnFlight?.id,
      departPrice,
      returnPrice,
      isRoundTrip: Boolean(returnFlight),
    };

    const token = getToken();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      await response.json();

      toast({
        title: 'Booking Confirmed!',
        description:
          'Your flight has been booked successfully. You will receive a confirmation email shortly with all the details of your reservation.',
      });
      removeLocalStorageData('departFlight');
      removeLocalStorageData('returnFlight');
      removeLocalStorageData('flightSearchParams');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="border-t border-gray-300 pt-4 pb-8">
            <h3 className="text-xl font-medium mb-6 text-left">
              Guest Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passengerName" className="text-right">
                  Name
                </Label>
                <Input
                  id="passengerName"
                  placeholder="John Doe"
                  className="col-span-3"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passengerEmail" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="passengerEmail"
                  placeholder="john.doe@example.com"
                  className="col-span-3"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="passengerAge" className="text-right">
                  Age
                </Label>
                <Input
                  type="number"
                  id="passengerAge"
                  placeholder="30"
                  className="col-span-3"
                  value={passengerAge}
                  onChange={(e) => setPassengerAge(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 pb-8">
            <h3 className="text-xl font-medium mb-6 text-left">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cardNumber" className="text-right">
                  Card Number
                </Label>
                <Input
                  type="number"
                  id="cardNumber"
                  placeholder="**** **** **** 1234"
                  className="col-span-3"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">
                  Expiry Date
                </Label>
                <Input
                  type="text"
                  id="expiryDate"
                  placeholder="MM/YY"
                  className="col-span-3"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 pb-8">
            <h3 className="text-xl font-medium mb-6 text-left">
              Amount Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Depart Flight:</span>
                <span>${departPrice.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-medium">Return Flight:</span>
                <span>${returnPrice.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 items-center gap-4 border-t border-gray-300 pt-4">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-semibold">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Book Flight
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingDetailPage;
