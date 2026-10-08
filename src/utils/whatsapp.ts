import { formatIdr, formatJpy } from './currency';

const DEFAULT_WA_NUMBER = '6281280905425';

export function generateWhatsAppUrl(message: string, phoneNumber = DEFAULT_WA_NUMBER): string {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export function generateQuoteWhatsAppUrl(
  productName: string,
  priceJpy: number,
  category: string,
  totalEstIdr: number,
  shippingMethod: string
): string {
  const msg = `Halo Personal Shopper MapahJastip,\nSaya mau titip barang dari Jepang dengan estimasi rincian:\n\n` +
    `• Barang: ${productName || 'Custom Request'}\n` +
    `• Kategori: ${category}\n` +
    `• Harga Toko: ${formatJpy(priceJpy)}\n` +
    `• Pengiriman: ${shippingMethod}\n` +
    `• Total Estimasi Bersih: ${formatIdr(totalEstIdr)}\n\n` +
    `Mohon info ketersediaan slot kloter dan pengecekan toko fisiknya ya kak. Terima kasih!`;
  return generateWhatsAppUrl(msg);
}

export function generateGeneralConsultationUrl(): string {
  const msg = `Halo Personal Shopper MapahJastip! Saya mau konsultasi titip belanja produk dari Jepang (toko fisik Tokyo / marketplace online).`;
  return generateWhatsAppUrl(msg);
}

export function generateCustomLinkRequestUrl(urlOrName = ''): string {
  const msg = `Halo Admin MapahJastip! Saya punya link / incaran barang dari Jepang:\n${urlOrName}\nBisa bantu cek ketersediaan dan estimasi biayanya?`;
  return generateWhatsAppUrl(msg);
}
