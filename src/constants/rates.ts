import { DestinationZone } from '../types/calculator';

export const CURRENT_EXCHANGE_RATE = 113.33; // 1 JPY = Rp 113.33

/**
 * TARIF ONGKIR NYATA JEPANG (OSAKA / TOKYO) KE JAKARTA (CGK)
 * Mengacu pada standar pasaran riil Jastip Handcarry & Air Cargo Forwarder Indonesia-Jepang (All-in Cukai/Pajak)
 */

// 1. Handcarry Koper Shopper (Bawa Langsung di Bagasi Pesawat, 3-5 Hari Kerja)
// Standar pasaran jastip koper: Rp 280.000 / kg = Rp 28.000 / 100g
export const HANDCARRY_RATE_PER_100G = 28000;

// 2. Air Cargo Terjadwal All-in (Kargo Udara Forwarder Resmi, 7-10 Hari Kerja)
// Standar pasaran kargo udara all-in cukai: Rp 240.000 / kg = Rp 24.000 / 100g
export const CARGO_EXPRESS_RATE_PER_100G = 24000;

// 3. Air Express / EMS Prioritas (Kargo Kilat Pesawat Udara Langsung, 3-5 Hari)
// Standar pasaran prioritas: Rp 350.000 / kg = Rp 35.000 / 100g
export const AIR_EXPRESS_RATE_PER_100G = 35000;

// 4. Air Regular Konsolidasi (Penerbangan Standar Terjadwal, 10-14 Hari)
// Standar pasaran konsolidasi: Rp 220.000 / kg = Rp 22.000 / 100g
export const AIR_REGULAR_RATE_PER_100G = 22000;

// Biaya Packing Ekstra (Kardus Double Wall Tebal + Corner Guard Pelindung Sudut Anti-Penyok)
export const REINFORCED_BOX_FEE = 35000;

// Tarif Kurir Domestik dari Hub Jakarta (Soekarno-Hatta) ke Alamat Tujuan di Indonesia
export const DESTINATION_ZONES: DestinationZone[] = [
  { id: 'jabodetabek', name: 'DKI Jakarta & Bodetabek (Paxel / JNE / SiCepat)', ratePerKg: 15000 },
  { id: 'jabar', name: 'Jawa Barat & Banten (Bandung, Serang, dll)', ratePerKg: 20000 },
  { id: 'jateng_diy', name: 'Jawa Tengah & D.I. Yogyakarta (Semarang, Solo, Jogja)', ratePerKg: 24000 },
  { id: 'jatim', name: 'Jawa Timur & Bali (Surabaya, Malang, Denpasar)', ratePerKg: 28000 },
  { id: 'luar_jawa', name: 'Luar Pulau Jawa (Sumatera, Kalimantan, Sulawesi, Papua)', ratePerKg: 45000 },
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
