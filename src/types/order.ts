import { CartItem } from './cart';

export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export type PaymentMethod = "bca" | "mandiri" | "qris" | "jenius";

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  address: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  shippingMethod: string;
  subtotalIdr: number;
  jastipFeeIdr: number;
  shippingCostIdr: number;
  totalAmountIdr: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
}
