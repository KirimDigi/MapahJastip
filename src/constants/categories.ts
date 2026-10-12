import { CategoryRate } from '../types/calculator';

export const CATEGORIES: CategoryRate[] = [
  { id: 'sepatu', name: 'Sepatu & Alas Kaki (Sneakers)', feePct: 10, estWeightG: 1200, customsTaxPct: 45 },
  { id: 'tas', name: 'Tas & Koper (Branded/Boutique)', feePct: 10, estWeightG: 900, customsTaxPct: 35 },
  { id: 'pakaian', name: 'Pakaian & Tekstil (Baju/Jaket)', feePct: 10, estWeightG: 600, customsTaxPct: 35 },
  { id: 'fashion', name: 'Fashion & Brand', feePct: 10, estWeightG: 850, customsTaxPct: 35 },
  { id: 'skincare', name: 'Skincare & Beauty', feePct: 12, estWeightG: 300, customsTaxPct: 18.5 },
  { id: 'makanan', name: 'Makanan & Snack Jepang', feePct: 10, estWeightG: 400, customsTaxPct: 18.5 },
  { id: 'kesehatan', name: 'Vitamin & Obat Kesehatan', feePct: 10, estWeightG: 250, customsTaxPct: 18.5 },
  { id: 'elektronik', name: 'Elektronik & Gadget', feePct: 8, estWeightG: 600, customsTaxPct: 18.5 },
  { id: 'karakter', name: 'Jepang Character & Plush', feePct: 15, estWeightG: 350, customsTaxPct: 18.5 },
  { id: 'anime', name: 'Anime, Hobi & Figure', feePct: 15, estWeightG: 500, customsTaxPct: 18.5 },
  { id: 'rumah_tangga', name: 'Rumah Tangga & Dapur', feePct: 12, estWeightG: 650, customsTaxPct: 18.5 },
  { id: 'ibu_anak', name: 'Ibu & Anak', feePct: 10, estWeightG: 450, customsTaxPct: 18.5 },
  { id: 'lainnya', name: 'Lainnya / Request Khusus', feePct: 10, estWeightG: 400, customsTaxPct: 18.5 },
];

export interface CategoryFilterItem {
  id: string;
  label: string;
  icon: string;
  emoji: string;
  colorClass: string;
}

export const CATALOG_CATEGORY_FILTERS: CategoryFilterItem[] = [
  { id: 'semua', label: 'Semua Produk', icon: 'apps', emoji: '✨', colorClass: 'text-blue-500' },
  { id: 'skincare', label: 'Skincare & Beauty', icon: 'face_retouching_natural', emoji: '🧴', colorClass: 'text-pink-500' },
  { id: 'makanan', label: 'Makanan & Minuman', icon: 'fastfood', emoji: '🍱🥤', colorClass: 'text-amber-500' },
  { id: 'kesehatan', label: 'Vitamin & Kesehatan', icon: 'health_and_safety', emoji: '💊', colorClass: 'text-emerald-500' },
  { id: 'fashion', label: 'Fashion & Brand', icon: 'apparel', emoji: '👟', colorClass: 'text-purple-500' },
  { id: 'elektronik', label: 'Elektronik', icon: 'devices', emoji: '🎧', colorClass: 'text-rose-500' },
  { id: 'ibu_anak', label: 'Ibu & Anak', icon: 'family_restroom', emoji: '🍼', colorClass: 'text-orange-500' },
  { id: 'rumah_tangga', label: 'Rumah Tangga', icon: 'cottage', emoji: '🏡', colorClass: 'text-teal-500' },
  { id: 'karakter', label: 'Jepang Character', icon: 'smart_toy', emoji: '🧸', colorClass: 'text-yellow-500' },
  { id: 'anime', label: 'Anime & Hobi', icon: 'sports_esports', emoji: '🎌', colorClass: 'text-red-500' },
  { id: 'lainnya', label: 'Lainnya', icon: 'category', emoji: '🎁', colorClass: 'text-indigo-500' },
];

export const TRENDING_KEYWORDS = [
  'SK-II Facial Treatment Essence',
  'Onitsuka Tiger Nippon Made',
  'Tokyo Banana Sakura',
  'Melano CC Premium',
  'Shiseido Fino Mask',
  'Chiikawa Plush Keychain',
  'DHC Vitamin C',
  'Pokemon Center Shibuya',
  'Nintendo Switch OLED',
];
