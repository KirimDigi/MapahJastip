export interface Review {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  comment: string;
  verified: boolean;
  itemPurchased: string;
  receiptProof: boolean;
  imageUrl: string;
}
