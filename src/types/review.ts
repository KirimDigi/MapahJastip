export interface Review {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  comment: string;
  localizedComment?: {
    id: string;
    en: string;
    ja: string;
  };
  verified: boolean;
  itemPurchased: string;
  localizedItemPurchased?: {
    id: string;
    en: string;
    ja: string;
  };
  receiptProof: boolean;
  imageUrl: string;
}
