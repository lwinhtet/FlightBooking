import prisma from '../prisma/client.js';
import catchAsync from '../utils/catchAsync.js';
import TripType from '../constants/tripType.js';

export const sanitizeQueryParamsAllFlights = (req, res, next) => {
  const allowedParams = [
    'origin',
    'destination',
    'departureDate',
    'returnDate',
    'tripType',
  ];

  req.query = Object.keys(req.query)
    .filter((key) => allowedParams.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.query[key];
      return obj;
    }, {});

  next();
};

export const getAllFlights = catchAsync(async (req, res, next) => {
  const { origin, destination, departureDate, returnDate, tripType } =
    req.query;

  let dep = new Date(departureDate);

  const departFlightFilter = {
    origin,
    destination,
    departureDate: {
      gte: dep, // Start of the departure date
      lt: new Date(dep.getTime() + 24 * 60 * 60 * 1000), // Start of the next day
    },
  };

  const departFlights = await prisma.flight.findMany({
    where: departFlightFilter,
  });

  let returnFlights;
  if (tripType === TripType.ROUND_TRIP) {
    let ret = new Date(returnDate);

    const returnFlightFilter = {
      origin: destination,
      destination: origin,
      departureDate: {
        gte: ret, // Start of the return date
        lt: new Date(ret.getTime() + 24 * 60 * 60 * 1000),
      },
    };

    returnFlights = await prisma.flight.findMany({
      where: returnFlightFilter,
    });
    console.log(returnFlights);
  }

  return res.status(200).json({
    status: 'success',
    data: {
      departFlights,
      returnFlights,
      tripType,
    },
  });
});

export const getFlight = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const flight = await prisma.flight.findFirstOrThrow({
    where: { id: parseInt(id) },
  });

  res.status(200).json({
    status: 'success',
    data: flight,
  });
});
