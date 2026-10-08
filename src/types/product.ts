export type ProductCategory =
  | 'skincare'
  | 'makanan'
  | 'kesehatan'
  | 'fashion'
  | 'elektronik'
  | 'ibu_anak'
  | 'rumah_tangga'
  | 'karakter'
  | 'anime'
  | 'lainnya'
  | string;

export interface Product {
  id: string;
  name: string;
  originalNameJp?: string;
  category: ProductCategory;
  categoryLabel: string;
  storeBadge: string;
  storeLocation: string;
  tag?: string;
  isReadyTokyo?: boolean;
  priceJpy: number;
  priceIdr: number;
  weightG: number;
  imageUrl: string;
  description: string;
  features?: string[];
  stockStatus: 'available' | 'limited' | 'request_size' | 'preorder';
  stockLabel?: string;
  rating?: number;
  reviewCount?: number;
}
