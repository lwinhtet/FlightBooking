import catchAsync from '../utils/catchAsync.js';
import prisma from '../prisma/client.js';

export const saveBooking = catchAsync(async (req, res, next) => {
  const {
    passengerName,
    passengerEmail,
    passengerAge,
    cardNumber,
    expiryDate,
    departFlightId,
    returnFlightId,
    returnPrice,
    departPrice,
    isRoundTrip,
  } = req.body;
  const user = req.user;
  const payment = await prisma.payment.create({
    data: {
      userId: user.id,
      cardNumber: cardNumber,
      expiry: expiryDate,
      paymentMethod: 'card',
    },
  });

  const bookingData = {
    passengerName,
    passengerEmail,
    passengerAge: Number(passengerAge),
    paymentId: payment.id,
    userId: user.id,
  };

  let bookings = [];

  const departBooking = await prisma.booking.create({
    data: {
      ...bookingData,
      flightId: departFlightId,
      price: departPrice,
      payment_status: 'completed',
    },
  });

  bookings.push(departBooking);

  if (isRoundTrip) {
    const returnBooking = await prisma.booking.create({
      data: {
        ...bookingData,
        flightId: returnFlightId,
        price: returnPrice,
        payment_status: 'completed',
      },
    });
    bookings.push(returnBooking);
  }

  // Step 3: Return response
  return res.status(200).json({
    status: 'success',
    data: bookings,
  });
});
