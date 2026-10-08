import { CategoryRate } from '../types/calculator';

export const CATEGORIES: CategoryRate[] = [
  { id: 'skincare', name: 'Skincare & Beauty', feePct: 12, estWeightG: 300 },
  { id: 'makanan', name: 'Makanan & Minuman', feePct: 10, estWeightG: 400 },
  { id: 'kesehatan', name: 'Vitamin & Kesehatan', feePct: 10, estWeightG: 250 },
  { id: 'fashion', name: 'Fashion & Brand', feePct: 10, estWeightG: 850 },
  { id: 'elektronik', name: 'Elektronik', feePct: 8, estWeightG: 600 },
  { id: 'ibu_anak', name: 'Ibu & Anak', feePct: 10, estWeightG: 450 },
  { id: 'rumah_tangga', name: 'Rumah Tangga', feePct: 12, estWeightG: 650 },
  { id: 'karakter', name: 'Jepang Character', feePct: 15, estWeightG: 350 },
  { id: 'anime', name: 'Anime & Hobi', feePct: 15, estWeightG: 500 },
  { id: 'lainnya', name: 'Lainnya', feePct: 10, estWeightG: 400 },
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
