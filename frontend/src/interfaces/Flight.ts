export default interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  EconomyPrice: number;
  BusinessPrice: number;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}
