import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ValueProps } from '../components/home/ValueProps';
import { OmotenashiFlow } from '../components/guide/OmotenashiFlow';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { DUMMY_REVIEWS } from '../constants/dummyReviews';
import { DUMMY_PRODUCTS } from '../constants/dummyProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { FlightScheduleCard } from '../components/flights/FlightScheduleCard';
import { useCart } from '../context/CartContext';
import { formatIdr } from '../utils/currency';
import { generateGeneralConsultationUrl, generateResellerRegistrationUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

const HERO_CATEGORY_CARDS = [
  {
    id: 'skincare',
    name: 'Skincare & Beauty',
    image: '/Logo%20Produk/01_Skincare_Beauty.png',
    link: '/katalog?kategori=skincare',
  },
  {
    id: 'makanan',
    name: 'Makanan & Minuman',
    image: '/Logo%20Produk/02_Makanan_Snack.png',
    link: '/katalog?kategori=makanan',
  },
  {
    id: 'fashion',
    name: 'Fashion & Brand',
    image: '/Logo%20Produk/03_Fashion_Brand.png',
    link: '/katalog?kategori=fashion',
  },
  {
    id: 'elektronik',
    name: 'Elektronik',
    image: '/Logo%20Produk/04_Elektronik.png',
    link: '/katalog?kategori=elektronik',
  },
  {
    id: 'karakter',
    name: 'Jepang Character',
    image: '/Logo%20Produk/05_Jepang_Character.png',
    link: '/katalog?kategori=karakter',
  },
  {
    id: 'kesehatan',
    name: 'Vitamin & Kesehatan',
    image: '/Logo%20Produk/06_Obat_Kesehatan_1.png',
    link: '/katalog?kategori=kesehatan',
  },
  {
    id: 'lainnya',
    name: 'Lainnya',
    image: '/Logo%20Produk/08_Lainnya.png',
    link: '/katalog',
  },
];

const HOME_FEATURED_CATEGORIES = [
  { id: 'semua', label: 'Semua Produk', icon: 'apps' },
  { id: 'skincare', label: 'Skincare & Beauty', icon: 'face_retouching_natural' },
  { id: 'makanan', label: 'Makanan & Minuman', icon: 'fastfood' },
  { id: 'fashion', label: 'Fashion & Brand', icon: 'apparel' },
  { id: 'elektronik', label: 'Elektronik', icon: 'devices' },
  { id: 'karakter', label: 'Jepang Character', icon: 'smart_toy' },
  { id: 'kesehatan', label: 'Vitamin & Kesehatan', icon: 'health_and_safety' },
  { id: 'anime', label: 'Anime & Hobi', icon: 'sports_esports' },
];

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { totalPriceIdr, totalItems } = useCart();
  const [homeCategory, setHomeCategory] = useState<string>('semua');
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const displayedProducts = useMemo(() => {
    if (homeCategory === 'semua') {
      return DUMMY_PRODUCTS.slice(0, 8);
    }
    return DUMMY_PRODUCTS.filter((p) => p.category === homeCategory).slice(0, 8);
  }, [homeCategory]);

  const handleReviewScroll = () => {
    if (reviewScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewScrollRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.75));
      setActiveReviewIndex(Math.min(Math.max(index, 0), DUMMY_REVIEWS.length - 1));
    }
  };

  const scrollToReview = (index: number) => {
    if (reviewScrollRef.current) {
      const card = reviewScrollRef.current.children[index] as HTMLElement;
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION & 7 KARTU KATEGORI SESUAI GAMBAR REFERENSI */}
      <section className="w-full bg-gradient-to-b from-surface via-surface to-surface-container-low pt-4 sm:pt-6 pb-6 sm:pb-8 border-b border-border-subtle/50">
        <div className="max-w-[1480px] mx-auto px-3 sm:px-5 lg:px-6 space-y-4 sm:space-y-5">
          {/* Banner Hero Full Width */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-border-subtle/70 bg-surface-container-lowest select-none">
            <img
              src="/images/hero-mapahjastip.png"
              alt="MapahJastip.id - Titip Belanja di Jepang, Kami yang Urus"
              className="w-full h-auto block select-none pointer-events-none"
              loading="eager"
            />

            {/* Hotspot Link: Hanya area tombol 'Titip Sekarang' yang bisa diklik mengarah ke WhatsApp */}
            <a
              href={generateGeneralConsultationUrl()}
              target="_blank"
              rel="noreferrer"
              style={{
                left: '4.21%',
                top: '76.24%',
                width: '27.18%',
                height: '13.32%',
              }}
              className="absolute rounded-full cursor-pointer transition-all duration-200 hover:ring-4 hover:ring-white/70 hover:bg-white/10 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary shadow-sm"
              title="Konsultasi & Titip Sekarang via WhatsApp"
              aria-label="Titip Sekarang via WhatsApp"
            />
          </div>

          {/* 7 Kartu Kategori Tepat di Bawah Gambar Background */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 lg:grid-cols-7 sm:gap-3.5">
            {HERO_CATEGORY_CARDS.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="min-w-[105px] sm:min-w-0 bg-surface-container-lowest hover:bg-surface-light-blue/40 border border-border-subtle/80 hover:border-primary/40 rounded-xl sm:rounded-3xl p-2 sm:p-3 flex flex-col items-center justify-between shadow-2xs hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden py-1">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="eager"
                  />
                </div>
                <div className="w-full pt-1.5 flex items-center justify-center gap-0.5 text-center">
                  <span className="text-[11px] sm:text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {cat.name}
                  </span>
                  {cat.id !== 'lainnya' && (
                    <span className="material-symbols-outlined text-[13px] sm:text-[14px] text-primary shrink-0 group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. JADWAL PENERBANGAN REAL-TIME SECTION */}
      <section className="w-full py-8 bg-surface-container-low/40 border-b border-border-subtle/50">
        <div className="max-w-[1480px] mx-auto px-3 sm:px-5 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col">
              <FlightScheduleCard className="h-full" />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-border-subtle/80 shadow-md space-y-4 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">groups</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-on-surface">Program Reseller</h3>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                      Dapatkan harga khusus dan keuntungan lebih banyak!
                    </p>
                  </div>
                </div>

                {/* Benefits Checklist */}
                <ul className="space-y-2 text-xs text-on-surface">
                  {[
                    'Harga reseller lebih murah',
                    'Bisa jual kembali (untung sendiri)',
                    'Tanpa minimum order',
                    'Akses produk lebih lengkap',
                    'Support materi promosi',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                      </span>
                      <span className="font-medium text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button: Daftar Reseller Sekarang -> WhatsApp */}
                <a
                  href={generateResellerRegistrationUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <span>Daftar Reseller Sekarang</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>

                {/* Price Comparison Table */}
                <div className="pt-2 space-y-2 border-t border-border-subtle/80">
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface">Perbandingan Harga</h4>
                  <div className="overflow-x-auto rounded-xl border border-border-subtle text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-text-secondary text-[11px] border-b border-border-subtle font-semibold">
                          <th className="py-2 px-3">Produk</th>
                          <th className="py-2 px-3 text-right whitespace-nowrap">Harga Normal</th>
                          <th className="py-2 px-3 text-right whitespace-nowrap">Harga Reseller</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle/50 bg-surface-container-lowest">
                        {[
                          {
                            name: 'Onitsuka Tiger Mexico 66',
                            normalPrice: 2057000,
                            resellerPrice: 1850000,
                          },
                          {
                            name: 'SK-II Facial Treatment 230ml',
                            normalPrice: 2493000,
                            resellerPrice: 2250000,
                          },
                          {
                            name: 'Tokyo Banana Classic 8 Pcs',
                            normalPrice: 175000,
                            resellerPrice: 150000,
                          },
                        ].map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-2 px-3 font-medium text-on-surface">
                              {item.name}
                            </td>
                            <td className="py-2 px-3 text-right text-text-secondary whitespace-nowrap font-medium">
                              {formatIdr(item.normalPrice)}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-rose-600 whitespace-nowrap">
                              {formatIdr(item.resellerPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUK PILIHAN LANGSUNG CHECKOUT (INSTANT CHECKOUT FEATURE) */}
      <section className="w-full py-10 sm:py-14 bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low border-b border-border-subtle/50">
        <div className="max-w-[1480px] mx-auto px-3 sm:px-5 lg:px-6 space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-[15px] animate-pulse">bolt</span>
                <span>BELANJA JEPANG • LANGSUNG CHECKOUT</span>
              </div>
              <h2 className="font-headline-md sm:font-headline-lg text-lg sm:text-2xl lg:text-3xl font-extrabold text-on-surface">
                Pilih Titipan Favorit &amp; Langsung Checkout
              </h2>
              <p className="font-body-sm sm:font-body-md text-text-secondary text-xs sm:text-sm mt-1 max-w-2xl">
                Tambah ke keranjang atau langsung klik tombol <strong>Checkout</strong> untuk menyelesaikan pesanan tanpa perlu bolak-balik halaman.
              </p>
            </div>

            <Link
              to="/katalog"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-dark transition-colors self-start md:self-end group"
            >
              <span>Lihat Katalog Lengkap ({DUMMY_PRODUCTS.length}+)</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {HOME_FEATURED_CATEGORIES.map((cat) => {
              const isActive = homeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setHomeCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20 scale-[1.02]'
                      : 'bg-surface-container-lowest text-text-secondary hover:text-primary border border-border-subtle/80 hover:bg-surface-light-blue'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Mini Quick-Checkout Banner if Cart Has Items */}
          {totalItems > 0 && (
            <div className="bg-gradient-to-r from-primary-container/15 via-primary/10 to-surface-soft-blue border border-primary/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">shopping_cart_checkout</span>
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-text-secondary font-medium">Keranjang Belanja Aktif:</div>
                  <div className="text-sm sm:text-base font-bold text-on-surface">
                    <span className="text-primary font-extrabold">{totalItems} barang</span> terpilih • Total: <span className="text-primary font-extrabold">{formatIdr(totalPriceIdr)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Link
                  to="/checkout"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Selesaikan di Checkout Sekarang</span>
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Explore Link */}
          <div className="text-center pt-2">
            <Link
              to={`/katalog${homeCategory !== 'semua' ? `?kategori=${homeCategory}` : ''}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest hover:bg-surface-light-blue text-primary border border-primary/30 font-semibold text-xs sm:text-sm shadow-xs transition-all group"
            >
              <span>Jelajahi Semua Produk {homeCategory !== 'semua' ? 'di Kategori Ini' : 'di Katalog'} ({DUMMY_PRODUCTS.length}+ Pilihan)</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. KEUNGGULAN / VALUE PROPOSITION (4 PILAR) */}
      <ValueProps />


      {/* 6. BUKTI STRUK & TESTIMONI PELANGGAN */}
      <section className="w-full py-8 sm:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-12">
            <div>
              <span className="text-[11px] sm:text-xs text-primary uppercase font-bold tracking-wider">
                {t('testi.badge')}
              </span>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight mt-0.5 leading-snug">
                {t('testi.title')}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">
                {t('testi.desc')}
              </p>
            </div>
            <div className="inline-flex self-start md:self-end items-center gap-2 sm:gap-3 bg-surface-container-low px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl border border-border-subtle shadow-2xs">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px] sm:text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-on-surface font-extrabold">4.98 / 5.0</span>
              <span className="text-text-secondary text-[11px] sm:text-xs">{t('reviews.reviewScore')}</span>
            </div>
          </div>

          <div
            ref={reviewScrollRef}
            onScroll={handleReviewScroll}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory -mx-3.5 px-3.5 md:mx-0 md:px-0 py-2"
          >
            {DUMMY_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="w-[78vw] max-w-[290px] shrink-0 md:w-auto md:max-w-none md:shrink snap-center flex flex-col"
              >
                <ReviewCard review={rev} />
              </div>
            ))}
          </div>

          {/* Mobile Swipe Indicators */}
          <div className="flex md:hidden justify-center items-center gap-1.5 mt-4">
            {DUMMY_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Testimoni ${idx + 1}`}
                onClick={() => scrollToReview(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeReviewIndex === idx
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-border-subtle hover:bg-text-secondary/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. 4 LANGKAH OMOTENASHI FLOW */}
      <OmotenashiFlow />

    </div>
  );
};
