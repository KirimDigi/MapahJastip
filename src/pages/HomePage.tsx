import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ValueProps } from '../components/home/ValueProps';
import { QuickEstimator } from '../components/home/QuickEstimator';
import { OmotenashiFlow } from '../components/guide/OmotenashiFlow';
import { FaqAccordion } from '../components/home/FaqAccordion';
import { WhatsAppCTA } from '../components/common/WhatsAppCTA';
import { ProductCard } from '../components/catalog/ProductCard';
import { FlightCard } from '../components/flights/FlightCard';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { DUMMY_PRODUCTS } from '../constants/dummyProducts';
import { FLIGHT_BATCHES } from '../constants/flightBatches';
import { DUMMY_REVIEWS } from '../constants/dummyReviews';
import { CATALOG_CATEGORY_FILTERS } from '../constants/categories';
import { generateCustomLinkRequestUrl } from '../utils/whatsapp';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [activeCatalogCategory, setActiveCatalogCategory] = useState<string>('all');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchQuery.trim()) {
      navigate(`/katalog?q=${encodeURIComponent(heroSearchQuery.trim())}`);
    } else {
      navigate('/katalog');
    }
  };

  const trendingTags = [
    'SK-II Facial Treatment',
    'Onitsuka Tiger',
    'Melano CC',
    'Tokyo Banana',
    'Chiikawa',
    'Matcha Kyoto',
  ];

  const filteredProducts = activeCatalogCategory === 'all'
    ? DUMMY_PRODUCTS.slice(0, 4)
    : DUMMY_PRODUCTS.filter((p) => p.category === activeCatalogCategory).slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-surface via-surface to-surface-container-low pt-8 pb-16 lg:pb-24 border-b border-border-subtle/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Value Messaging (Col 1-7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-light-blue text-primary shadow-xs border border-primary/20">
                <span className="text-base">🇯🇵</span>
                <span className="font-label-md text-label-md text-primary font-semibold tracking-tight">
                  Jasa Titip Personal Shopper Jepang Terpercaya &amp; Amanah
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.15] font-extrabold">
                Titip Belanja di Jepang,{' '}
                <span className="text-primary block sm:inline">Kami yang Urus.</span>
              </h1>

              <p className="font-body-lg text-lg text-text-secondary max-w-2xl leading-relaxed">
                Belanja produk Jepang favoritmu, kami belanjakan, bawa, dan kirim sampai Indonesia.
              </p>

              {/* HERO SEARCH BAR - PILL CAPSULE STYLE */}
              <form onSubmit={handleHeroSearch} className="space-y-3 pt-1 max-w-2xl">
                <div className="relative flex items-stretch bg-surface-container-lowest rounded-full border-2 border-slate-200 dark:border-border-subtle shadow-[0_4px_20px_rgba(8,119,204,0.12)] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-hidden pl-4 sm:pl-5 pr-0 py-0">
                  {/* Left Muted Search Icon */}
                  <div className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </div>

                  {/* Input Field */}
                  <input
                    type="text"
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    placeholder="Cari produk, merek, atau kata kunci..."
                    className="flex-1 min-w-0 px-2 sm:px-3 py-3 sm:py-3.5 bg-transparent text-on-surface text-sm sm:text-base font-medium placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none"
                  />

                  {/* Clear Button */}
                  {heroSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setHeroSearchQuery('')}
                      className="flex items-center text-slate-400 hover:text-on-surface px-2 transition-colors cursor-pointer"
                      aria-label="Hapus teks pencarian"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}

                  {/* Right Blue Rounded Button */}
                  <button
                    type="submit"
                    aria-label="Cari produk"
                    className="px-5 sm:px-6 bg-primary hover:bg-primary-dark text-white rounded-r-full flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </button>
                </div>

                {/* Trending Search Tags */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-text-secondary font-semibold flex items-center gap-1">
                    <span className="text-amber-500 font-bold">🔥</span>
                    Populer:
                  </span>
                  {trendingTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => navigate(`/katalog?q=${encodeURIComponent(tag)}`)}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-light-blue hover:text-primary text-text-secondary border border-border-subtle transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Horizontal Colorful Category Pills (Tokopedia Style) */}
                <div className="pt-1 -mx-2 px-2 overflow-x-auto scrollbar-none">
                  <div className="flex items-center gap-2 pb-0.5">
                    {CATALOG_CATEGORY_FILTERS.slice(1).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => navigate(`/katalog?kategori=${cat.id}`)}
                        className="px-3.5 py-1.5 rounded-full bg-white dark:bg-surface-container-lowest border border-slate-200 dark:border-border-subtle hover:border-primary/50 text-on-surface hover:text-primary text-xs font-semibold whitespace-nowrap shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer group"
                      >
                        <span className="material-symbols-outlined text-[17px] text-text-secondary group-hover:text-primary transition-colors">
                          {cat.icon}
                        </span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* 4 Feature Pills from Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-border-subtle shadow-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <span className="text-xs font-semibold text-on-surface">Produk Original</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-border-subtle shadow-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                  <span className="text-xs font-semibold text-on-surface">Harga Transparan</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-border-subtle shadow-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                  <span className="text-xs font-semibold text-on-surface">Aman &amp; Terpercaya</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-border-subtle shadow-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">update</span>
                  <span className="text-xs font-semibold text-on-surface">Update Real-time</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#quick-calculator"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-primary hover:bg-primary-dark text-white font-label-md text-label-md rounded-2xl shadow-[0_6px_20px_rgba(8,119,204,0.3)] transition-all transform hover:-translate-y-0.5 font-bold"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Titip Sekarang</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </a>
                <Link
                  to="/estimasi"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-container-lowest hover:bg-surface-light-blue text-primary font-label-md text-label-md rounded-2xl shadow-xs transition-all border border-border-subtle font-semibold"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
                  <span>Hitung Estimasi Biaya</span>
                </Link>
              </div>

              {/* Trust Micro-stats */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-border-subtle/70">
                  <div className="font-headline-sm text-headline-sm text-primary font-bold">5,000+</div>
                  <div className="font-body-sm text-body-sm text-text-secondary">Pesanan Terkirim</div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-border-subtle/70">
                  <div className="font-headline-sm text-headline-sm text-success-text font-bold">100%</div>
                  <div className="font-body-sm text-body-sm text-text-secondary">Produk Original</div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-border-subtle/70">
                  <div className="font-headline-sm text-headline-sm text-on-surface font-bold">Rate Nyaman</div>
                  <div className="font-body-sm text-body-sm text-text-secondary">Kurs Transparan</div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-border-subtle/70">
                  <div className="font-headline-sm text-headline-sm text-tertiary font-bold">Full Cover</div>
                  <div className="font-body-sm text-body-sm text-text-secondary">Asuransi Kargo</div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Dynamic Concierge Card & Flight Simulation (Col 8-12) */}
            <div className="lg:col-span-5 relative">
              {/* Ambient Glow */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col gap-4">
                {/* Shopper Live Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_32px_rgba(18,59,120,0.10)] border border-border-subtle space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                          alt="Shopper Dimas"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX8AsZCHpHjnw56twWdzvZM_CB9cepAAVVjfHeSXfUjvkF4TqzBFcwE1tlvVwB65I9CAk8p0Nfa_cXLNejWT5mHENCedxlnc8VB8ZvP-bimSqwiXO54lW-Ad5tb6eiAvW7sNvQyDXuVddd0kfB0rAbcxGumsz-LOq9rCzIaR0BoB85Sxgas3m45Tx7W6SNfDyNMs-n7_sVQrSuW9q8wov7GhIlqglr6uIiCtC7vGzsokyQ_SIGtZo9"
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-white" />
                      </div>
                      <div>
                        <h2 className="font-title-md text-title-md text-on-surface font-bold">
                          Shopper Dimas (Tokyo Team)
                        </h2>
                        <p className="font-label-sm text-label-sm text-text-secondary">
                          Shibuya ⇄ Akihabara Concierge
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-bg text-success-text font-label-sm text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Live Hunt
                    </span>
                  </div>

                  {/* Store Tag */}
                  <div className="p-3 bg-surface-soft-blue rounded-xl flex items-center justify-between text-body-sm font-body-sm border border-border-subtle/50">
                    <div className="flex items-center gap-2 text-on-surface font-medium">
                      <span className="material-symbols-outlined text-primary text-[19px]">storefront</span>
                      <span>Bic Camera &amp; Animate Ikebukuro</span>
                    </div>
                    <span className="text-tertiary font-label-sm text-xs font-semibold">
                      Sedang Hunting
                    </span>
                  </div>

                  {/* Item Micro Snapshots */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="bg-surface-container-low rounded-xl p-2 flex flex-col items-center text-center border border-border-subtle/40">
                      <img
                        className="w-14 h-14 object-cover rounded-lg mb-1.5"
                        alt="Melano CC"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYFw4wGXwCFMb0eFdDgRQPdiXDdGkmq8excjFWU1-M3D1t9zyxFmYRsIErYlkV5OdI2wGvFNQHV6meKqQn5Cp3X5xJWLtGqhlMuloSBEA1kIYlhpdR5gxctI6jc_p8rs-ACmxS4npdLrbCMm4m-IODdHA7aZuQ3SXpUw_aIWMHZ9zkiu4MHlBB5mVJUZvvXAkKQ_j-i0upZs4Vb71dColRKaFyKv4zJiuTRiDAYyBxTTfpIuPGn_EO"
                      />
                      <span className="font-label-sm text-xs font-semibold text-on-surface truncate w-full">
                        Melano CC
                      </span>
                      <span className="text-[11px] text-text-secondary">¥1,280</span>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-2 flex flex-col items-center text-center border border-border-subtle/40">
                      <img
                        className="w-14 h-14 object-cover rounded-lg mb-1.5"
                        alt="JJK Jump Shop"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_H6b6EH-JLzDXUgMQAmuMxGisMr5agos-rJZzzxTdRJXqXDvT4FmNMzvOw0dI1FhMTsDdX5tmpKTsCVigz8AXbG256C8UmFdSFTMrSEtlKJKXrJGBiyLQQaSD3Ulk1yCxj7BPf5-ROUDmVlAsXzR8KVubv0vIMtuM6rpRZVj4WIMEcgjEQnTIFjHmGzVdqF8LGSEWtTK18sH0ICrxLTzdU6dFGfqHQ6tEyKdTYshu1ieNGUJGHP8-"
                      />
                      <span className="font-label-sm text-xs font-semibold text-on-surface truncate w-full">
                        JJK Jump Shop
                      </span>
                      <span className="text-[11px] text-text-secondary">¥1,850</span>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-2 flex flex-col items-center text-center border border-border-subtle/40">
                      <img
                        className="w-14 h-14 object-cover rounded-lg mb-1.5"
                        alt="Tokyo Banana"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYprIDSYu0J0Vn7VU6Xn5qqfsNXpE20Pm7iK80DfOrG64gFL_hNaVhYDGpurZ7wPQsLcciYneETM10iS4KFWU-HBGSvRsnxajbmIxbr6quLOHOzTieR_3v7V-1va4cN8xsuytF_rTC_lvM1GfYV1INjijZu8z09xxoi7TKT-M9Xmcq3dfHXa4k3Wdx6DUCqdZGjpn5r-MQ_i2zYYB0mYUCzYe8yZpmPUungdmguRy0AgrxZTDNg9nS"
                      />
                      <span className="font-label-sm text-xs font-semibold text-on-surface truncate w-full">
                        Tokyo Banana
                      </span>
                      <span className="text-[11px] text-text-secondary">¥1,180</span>
                    </div>
                  </div>
                </div>

                {/* Simulation Flight Tracking Ribbon Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_8px_24px_rgba(18,59,120,0.06)] border border-border-subtle space-y-3">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="font-title-md text-label-md text-on-surface flex items-center gap-1.5 font-bold">
                      <span className="material-symbols-outlined text-primary text-[19px]">flight_takeoff</span>
                      Batch 47 Tracking Live
                    </span>
                    <span className="font-label-sm text-xs text-primary bg-surface-light-blue px-2.5 py-0.5 rounded-full font-semibold border border-primary/20">
                      In Flight NH855
                    </span>
                  </div>

                  {/* Track Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-label-sm font-label-sm text-text-secondary text-xs">
                      <span className="font-semibold text-on-surface">Tokyo Haneda (HND)</span>
                      <span className="text-primary font-bold">Sedang Terbang</span>
                      <span className="font-semibold text-on-surface">Jakarta (CGK)</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden relative">
                      <div className="bg-gradient-to-r from-primary to-tertiary h-full rounded-full w-3/4 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-secondary pt-0.5">
                      <span>Berangkat 27 Mar, 10:15 JST</span>
                      <span>Est. Tiba 27 Mar, 16:30 WIB</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-success-bg rounded-xl flex items-center justify-between text-xs text-success-text font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px]">lock</span>
                      42 Box Kloter Aman &amp; Bebas Cukai
                    </span>
                    <Link to="/status-pesanan" className="underline hover:text-success cursor-pointer">
                      Lihat Resi Kargo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEUNGGULAN / VALUE PROPOSITION (4 PILAR) */}
      <ValueProps />

      {/* 3. KALKULATOR ESTIMASI BIAYA INTERAKTIF */}
      <QuickEstimator />

      {/* 4. KATEGORI & KATALOG TITIP TERPOPULER */}
      <section className="w-full py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-label-md text-label-md text-primary uppercase font-semibold">
                Koleksi &amp; Rekomendasi Terhangat
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Katalog Titip Favorit dari Jepang
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCatalogCategory('all')}
                className={`px-4 py-1.5 rounded-full font-label-md text-sm font-semibold transition-all ${
                  activeCatalogCategory === 'all'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface-container-low text-text-secondary hover:text-on-surface'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveCatalogCategory('skincare')}
                className={`px-4 py-1.5 rounded-full font-label-md text-sm font-semibold transition-all ${
                  activeCatalogCategory === 'skincare'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface-container-low text-text-secondary hover:text-on-surface'
                }`}
              >
                Skincare &amp; Suplemen
              </button>
              <button
                onClick={() => setActiveCatalogCategory('anime')}
                className={`px-4 py-1.5 rounded-full font-label-md text-sm font-semibold transition-all ${
                  activeCatalogCategory === 'anime'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface-container-low text-text-secondary hover:text-on-surface'
                }`}
              >
                Anime &amp; Figure
              </button>
              <button
                onClick={() => setActiveCatalogCategory('snack')}
                className={`px-4 py-1.5 rounded-full font-label-md text-sm font-semibold transition-all ${
                  activeCatalogCategory === 'snack'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface-container-low text-text-secondary hover:text-on-surface'
                }`}
              >
                Snack &amp; Matcha
              </button>
              <button
                onClick={() => setActiveCatalogCategory('fashion')}
                className={`px-4 py-1.5 rounded-full font-label-md text-sm font-semibold transition-all ${
                  activeCatalogCategory === 'fashion'
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface-container-low text-text-secondary hover:text-on-surface'
                }`}
              >
                Fashion Sneakers
              </button>
            </div>
          </div>

          {/* Catalog Grid - 2 Kolom Kanan & Kiri di HP */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Bottom Banner for Custom Mercari/Yahoo Hunting */}
          <div className="mt-8 bg-gradient-to-r from-surface-light-blue to-surface-container-highest p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border border-border-subtle">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[26px]">travel_explore</span>
              </div>
              <div>
                <h4 className="font-title-md text-title-md text-on-surface font-bold">
                  Punya Link Mercari, Yahoo Auction, atau Rakuten?
                </h4>
                <p className="font-body-sm text-body-sm text-text-secondary">
                  Cukup kirimkan link barang idaman Anda, kami urus proses negosiasi, verifikasi rating seller, dan pembayaran aman.
                </p>
              </div>
            </div>
            <a
              className="shrink-0 px-5 py-3 bg-primary text-white rounded-xl font-label-md text-label-md hover:bg-primary-dark shadow-sm transition-all flex items-center gap-2 font-semibold"
              href={generateCustomLinkRequestUrl()}
              target="_blank"
              rel="noreferrer"
            >
              <span>Kirim Link Barang via WA</span>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
          </div>
        </div>
      </section>

      {/* 5. SCHEDULE BATCH PENERBANGAN TERDEKAT */}
      <section className="w-full py-16 bg-surface-container-low border-y border-border-subtle/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="font-label-md text-label-md text-primary uppercase font-semibold">
              Jadwal Keberangkatan &amp; Kargo
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Jadwal Batch Titipan Jepang 2025
            </h2>
            <p className="font-body-md text-body-md text-text-secondary">
              Pantau tanggal cut-off order dan jadwal pengiriman Jakarta agar titipan Anda tidak tertinggal penerbangan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {FLIGHT_BATCHES.slice(0, 2).map((batch) => (
              <FlightCard key={batch.id} batch={batch} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. BUKTI STRUK & TESTIMONI PELANGGAN */}
      <section className="w-full py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-label-md text-label-md text-primary uppercase font-semibold">
                Transparansi Nyata
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Bukti Struk Toko &amp; Unboxing Pelanggan
              </h2>
              <p className="font-body-md text-body-md text-text-secondary">
                Ribuan titipan sukses sampai di tangan pemiliknya dengan kondisi mulus dan struk kasir asli terlampir.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-border-subtle">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="font-label-md text-label-md text-on-surface font-bold">4.98 / 5.0</span>
              <span className="text-text-secondary text-label-sm">(1,240+ Review)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DUMMY_REVIEWS.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. 4 LANGKAH OMOTENASHI FLOW */}
      <OmotenashiFlow />

      {/* 8. FAQ RINGKAS */}
      <section className="w-full py-16 bg-surface-container-low border-t border-border-subtle">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-label-md text-label-md text-primary uppercase font-semibold">
              Tanya Jawab
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Pertanyaan Seputar Jasa Titip Jepang
            </h2>
            <p className="font-body-md text-body-md text-text-secondary">
              Semua yang perlu Anda ketahui tentang alur pemesanan, asuransi, dan regulasi kepabeanan.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* 9. WHATSAPP FINAL CTA BANNER */}
      <WhatsAppCTA />
    </div>
  );
};
