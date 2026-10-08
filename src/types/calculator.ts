export interface CategoryRate {
  id: string;
  name: string;
  feePct: number;
  estWeightG: number;
}

export type ShippingMethod = 'express' | 'regular' | 'handcarry' | 'cargo';

export type PackagingOption = 'standard' | 'reinforced';

export interface DestinationZone {
  id: string;
  name: string;
  ratePerKg: number;
}

export interface CalculationResult {
  priceJpy: number;
  exchangeRate: number;
  priceIdr: number;
  feePct: number;
  feeAmount: number;
  weightG: number;
  shippingRatePer100g: number;
  shippingCost: number;
  packagingCost: number;
  domesticShippingCost: number;
  totalCost: number;
}
