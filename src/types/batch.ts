export interface FlightBatch {
  id: string;
  batchNumber: number;
  title: string;
  route: string;
  flightCode: string;
  departureCity: string;
  destinationCity: string;
  status: 'active' | 'open' | 'filling' | 'in_flight' | 'landed';
  statusBadge: string;
  cutOffDate: string;
  cutOffTime: string;
  shoppingPeriod: string;
  domesticDeliveryDate: string;
  totalQuotaKg: number;
  usedQuotaKg: number;
  remainingKg: number;
  usedPercentage: number;
  highlightNote: string;
}
