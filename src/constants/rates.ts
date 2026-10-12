import { DestinationZone } from '../types/calculator';

export const CURRENT_EXCHANGE_RATE = 113.33; // 1 JPY = Rp 113.33

/**
 * TARIF ONGKIR NYATA JEPANG (OSAKA / TOKYO) KE JAKARTA (CGK)
 * Mengacu pada standar pasaran riil Jastip Handcarry & Air Cargo Forwarder Indonesia-Jepang (All-in Cukai/Pajak)
 */

// 1. EMS Japan Post Express (Pos Kilat Internasional Tokyo Direct, 3-5 Hari)
// Standar resmi pos Jepang EMS: ~Rp 250.000 / kg = Rp 25.000 / 100g
export const AIR_EXPRESS_RATE_PER_100G = 25000;

// 2. Reguler Pos Udara Jepang (Air Parcel Tokyo Standard, 7-10 Hari)
// Standar resmi pos udara reguler Jepang: ~Rp 165.000 / kg = Rp 16.500 / 100g
export const AIR_REGULAR_RATE_PER_100G = 16500;

// 3. Handcarry Koper Shopper (Bawa Langsung di Bagasi Pesawat, 3-5 Hari Kerja)
export const HANDCARRY_RATE_PER_100G = 28000;

// 4. Air Cargo Terjadwal (Kargo Udara Forwarder Resmi, 7-10 Hari Kerja)
export const CARGO_EXPRESS_RATE_PER_100G = 24000;

// Biaya Packing Ekstra (Kardus Double Wall Tebal + Corner Guard Pelindung Sudut Anti-Penyok)
export const REINFORCED_BOX_FEE = 35000;

// Tarif Kurir Domestik dari Hub Jakarta (Soekarno-Hatta) ke Alamat Tujuan di Indonesia (Standar Riil JNE / SiCepat / J&T / Paxel)
export const DESTINATION_ZONES: DestinationZone[] = [
  { id: 'jabodetabek', name: 'DKI Jakarta & Bodetabek (JNE / SiCepat / Paxel)', ratePerKg: 10000 },
  { id: 'jabar', name: 'Jawa Barat & Banten (Bandung, Serang, dll)', ratePerKg: 15000 },
  { id: 'jateng_diy', name: 'Jawa Tengah & D.I. Yogyakarta (Semarang, Solo, Jogja)', ratePerKg: 20000 },
  { id: 'jatim_bali', name: 'Jawa Timur & Bali (Surabaya, Malang, Denpasar)', ratePerKg: 24000 },
  { id: 'sumatera', name: 'Sumatera (Medan, Palembang, Lampung, Riau, dll)', ratePerKg: 38000 },
  { id: 'kalimantan_sulawesi', name: 'Kalimantan & Sulawesi (Balikpapan, Makassar, Manado)', ratePerKg: 55000 },
  { id: 'timur_papua', name: 'Indonesia Timur & Papua (Maluku, NTT, Jayapura, dll)', ratePerKg: 85000 },
];

export const JAPAN_MERCHANTS = [
  'Toko Fisik / Butik Resmi (Shibuya/Ginza/Shinsaibashi)',
  'Don Quijote (Donki Dotonbori / Akihabara)',
  'Bic Camera / Yodobashi Camera Umeda',
  'Uniqlo / GU JP Official Store',
  'Pokemon Center (Osaka DX / Tokyo DX)',
  'Mercari Japan (Marketplace C2C)',
  'Amazon Japan / Rakuten Online',
  'Matsumoto Kiyoshi / Sundrug Drugstore',
  'Jump Shop / Animate Store',
  'AmiAmi / Surugaya Akihabara',
];
