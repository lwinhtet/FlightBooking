import prisma from './client.js';
import { faker } from '@faker-js/faker';
import { parseArgs } from 'node:util';

const options = {
  count: { type: 'string' }, // Number of days
};
// Default to 30 days if not provided

const DEFAULT_COUNT = '30';
const origins = [
  'Paris',
  'London',
  'Rome',
  'Tokyo',
  'Barcelona',
  'Dubai',
  'Bangkok',
  'Singapore',
  'Sydney',
  'Berlin',
];

const destinations = [
  'New York City',
  'Milan',
  'Lisbon',
  'Toronto',
  'Mumbai',
  'Kuala Lumpur',
  'Dublin',
  'Beijing',
  'Stockholm',
  'Zurich',
];

const airlines = [
  'American Airlines',
  'Delta Air Lines',
  'United Airlines',
  'Southwest Airlines',
  'British Airways',
  'Air France',
  'Lufthansa',
  'Emirates',
  'Qatar Airways',
  'Singapore Airlines',
  'Qantas',
  'KLM',
  'Japan Airlines',
  'Etihad Airways',
  'Swiss International Air Lines',
  'Alaska Airlines',
];

async function main() {
  // Disable foreign key constraints
  await prisma.$executeRaw`SET session_replication_role = 'replica';`;

  await prisma.payment.deleteMany({});
  await prisma.flight.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('💥  All records have been deleted. Creating New Data...');

  const {
    values: { count = DEFAULT_COUNT },
  } = parseArgs({ options });

  const countValue = parseInt(count, 10);
  const today = new Date();

  for (let i = 0; i < countValue; i++) {
    const departureDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000); // Days from today

    for (const origin of origins) {
      for (const destination of destinations) {
        // Generate a random number of flights (between 6 and 9) for each origin-destination pair
        const numFlights = faker.number.int({ min: 6, max: 9 });

        for (let j = 0; j < numFlights; j++) {
          const departureTime = faker.date.between({
            from: departureDate,
            to: new Date(departureDate.getTime() + 1000 * 60 * 60 * 24), // Up to 24 hours later
          });
          const arrivalDate = faker.date.between({
            from: departureTime,
            to: new Date(departureTime.getTime() + 1000 * 60 * 60 * 24), // Up to 24 hours later
          });

          await prisma.flight.create({
            data: {
              airline: faker.helpers.arrayElement(airlines),
              flightNumber: faker.string.alphanumeric(6).toUpperCase(),
              origin: origin,
              destination: destination,
              departureDate: departureTime,
              arrivalDate: arrivalDate,
              EconomyPrice: parseFloat(
                faker.commerce.price({ min: 100, max: 500, dec: 2 })
              ),
              BusinessPrice: parseFloat(
                faker.commerce.price({ min: 500, max: 1000, dec: 2 })
              ),
              capacity: faker.number.int({ min: 100, max: 300 }),
            },
          });

          await prisma.flight.create({
            data: {
              airline: faker.helpers.arrayElement(airlines),
              flightNumber: faker.string.alphanumeric(6).toUpperCase(),
              origin: destination,
              destination: origin,
              departureDate: departureTime,
              arrivalDate: arrivalDate,
              EconomyPrice: parseFloat(
                faker.commerce.price({ min: 100, max: 500, dec: 2 })
              ),
              BusinessPrice: parseFloat(
                faker.commerce.price({ min: 500, max: 1000, dec: 2 })
              ),
              capacity: faker.number.int({ min: 100, max: 300 }),
            },
          });
        }
      }
    }
  }

  console.log('🟢  Records have been created');
}

main()
  .then(async () => {
    // Re-enable foreign key constraints
    await prisma.$executeRaw`SET session_replication_role = 'origin';`;
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
