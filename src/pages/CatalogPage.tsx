import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { DUMMY_PRODUCTS } from '../constants/dummyProducts';
import { CATALOG_CATEGORY_FILTERS } from '../constants/categories';
import { generateCustomLinkRequestUrl } from '../utils/whatsapp';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('kategori') || 'semua';
  const urlQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState('populer');

  useEffect(() => {
    const cat = searchParams.get('kategori');
    setActiveCategory(cat || 'semua');

    const q = searchParams.get('q');
    if (q !== null) {
      setSearchQuery(q);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const newParams: Record<string, string> = {};
    if (catId !== 'semua') newParams.kategori = catId;
    if (searchQuery.trim()) newParams.q = searchQuery.trim();
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams: Record<string, string> = {};
    if (activeCategory !== 'semua') newParams.kategori = activeCategory;
    if (val.trim()) newParams.q = val.trim();
    setSearchParams(newParams, { replace: true });
  };

  // Calculate real-time counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      semua: DUMMY_PRODUCTS.length,
    };
    DUMMY_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS];

    // Filter Category
    if (activeCategory !== 'semua') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.originalNameJp && p.originalNameJp.toLowerCase().includes(q)) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.storeBadge.toLowerCase().includes(q) ||
          p.storeLocation.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'termurah') {
      result.sort((a, b) => a.priceIdr - b.priceIdr);
    } else if (sortBy === 'tertinggi') {
      result.sort((a, b) => b.priceIdr - a.priceIdr);
    } else if (sortBy === 'populer') {
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  const activeCategoryObj = useMemo(() => {
    return (
      CATALOG_CATEGORY_FILTERS.find((c) => c.id === activeCategory) ||
      CATALOG_CATEGORY_FILTERS[0]
    );
  }, [activeCategory]);

  return (
    <div className="w-full bg-surface pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-6">
        {/* Current Location Indicator */}
        {activeCategory !== 'semua' ? (
          <div className="flex items-center gap-2 text-xs text-text-secondary pb-3">
            <button
              onClick={() => handleCategoryChange('semua')}
              className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Semua Produk Jepang
            </button>
            <span className="text-border-subtle">›</span>
            <span className="text-primary font-semibold">{activeCategoryObj.label}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-text-secondary pb-3">
            <span className="text-primary font-semibold">Semua Produk Jepang</span>
            <span className="text-xs text-text-secondary">({DUMMY_PRODUCTS.length} Produk)</span>
          </div>
        )}

        {/* MOBILE TOP TOOLBAR (Capsule Search Bar) */}
        <div className="lg:hidden space-y-3 mb-4">
          {/* Mobile Search Bar - Capsule Pill Style */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchChange(searchQuery);
            }}
            className="relative flex items-stretch bg-surface-container-lowest rounded-full border border-slate-200 dark:border-border-subtle shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden pl-4 pr-0"
          >
            <span className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari produk..."
              enterKeyHint="search"
              className="flex-1 min-w-0 px-2 py-2.5 bg-transparent text-on-surface text-sm placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="flex items-center text-slate-400 hover:text-on-surface px-2 cursor-pointer transition-colors"
                aria-label="Hapus kata kunci"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label="Cari"
              className="bg-primary hover:bg-primary-dark active:opacity-90 text-white px-5 rounded-r-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </form>
        </div>

        {/* 1. MOBILE CATEGORY GRID: Rapi 2 Kolom, Simetris, Tanpa 'Semua Produk' */}
        <div className="sm:hidden mb-4">
          <div className="grid grid-cols-2 gap-2">
            {CATALOG_CATEGORY_FILTERS.filter((cat) => cat.id !== 'semua').map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(isActive ? 'semua' : cat.id)}
                  className={`w-full min-h-[46px] px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border shadow-2xs active:scale-[0.98] ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-xs font-bold'
                      : 'bg-surface-container-lowest text-on-surface hover:border-primary/40 border-slate-200 dark:border-border-subtle'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] shrink-0 ${isActive ? 'text-white' : 'text-primary'}`}>
                    {cat.icon}
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-left break-words">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Bar on Mobile */}
          {activeCategory !== 'semua' && (
            <div className="mt-2.5 flex items-center justify-between px-3 py-2 bg-primary/10 rounded-xl border border-primary/20 text-xs">
              <div className="flex items-center gap-1.5 text-primary font-semibold min-w-0 pr-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">filter_alt</span>
                <span className="truncate">Filter: <strong>{activeCategoryObj.label}</strong></span>
              </div>
              <button
                onClick={() => handleCategoryChange('semua')}
                className="text-primary hover:underline font-bold text-xs flex items-center gap-0.5 shrink-0 cursor-pointer"
              >
                <span>Lihat Semua Produk</span>
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. DESKTOP & TABLET CATEGORY PILLS: Tetap ada 'Semua Produk' */}
        <div className="hidden sm:block mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
            {CATALOG_CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-2 border shadow-xs hover:shadow-sm ${
                    isActive
                      ? 'bg-surface-light-blue text-primary border-primary/40 font-bold shadow-xs'
                      : 'bg-white dark:bg-surface-container-lowest text-on-surface hover:text-primary hover:border-primary/40 border-slate-200 dark:border-border-subtle'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[19px] shrink-0 ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-surface-container-low text-text-secondary'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Catalog Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: KATEGORI (Cols 1-3, Hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-3 w-full">
            <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-xs p-4 sm:p-5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle/70">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    category
                  </span>
                  <h2 className="font-title-md text-base text-on-surface font-bold tracking-tight">
                    Kategori
                  </h2>
                </div>
                <span className="text-xs text-text-secondary font-medium">
                  {DUMMY_PRODUCTS.length} Item
                </span>
              </div>

              {/* Category Nav List */}
              <nav className="flex flex-col gap-1">
                {CATALOG_CATEGORY_FILTERS.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const count = categoryCounts[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategoryChange(cat.id);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-surface-light-blue text-primary font-bold shadow-xs border border-primary/25'
                          : 'text-on-surface hover:bg-surface-soft-blue hover:text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`material-symbols-outlined text-[20px] transition-colors shrink-0 ${
                            isActive
                              ? 'text-primary'
                              : 'text-text-secondary group-hover:text-primary'
                          }`}
                        >
                          {cat.icon}
                        </span>
                        <span className="truncate">{cat.label}</span>
                      </div>

                      {count > 0 && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-semibold transition-colors ${
                            isActive
                              ? 'bg-primary text-white'
                              : 'bg-surface-container-low text-text-secondary group-hover:bg-surface-light-blue group-hover:text-primary'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Assistance Callout */}
              <div className="pt-3 border-t border-border-subtle/70">
                <div className="p-3 bg-surface-soft-blue rounded-xl border border-border-subtle/50 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      live_help
                    </span>
                    <span>Cari Barang Spesifik?</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    Punya link Mercari, Rakuten, atau foto toko fisik Jepang? Tim Shopper kami siap bantu carikan.
                  </p>
                  <a
                    href={generateCustomLinkRequestUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-xs pt-0.5"
                  >
                    <span>Request Titipan via WA</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT: PRODUK JEPANG (Cols 4-12) */}
          <main className="lg:col-span-9 w-full space-y-6">
            {/* Top Toolbar: Heading, Search & Sort */}
            <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2.5 sm:space-y-4">
              <div className="flex flex-row items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-headline-md text-base sm:text-3xl text-on-surface font-extrabold tracking-tight">
                    {activeCategory === 'semua' ? 'Semua Produk Jepang' : activeCategoryObj.label}
                  </h1>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Menampilkan <strong className="text-on-surface">{filteredProducts.length}</strong> produk langsung dari Tokyo &amp; Osaka
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-text-secondary font-medium hidden sm:inline">
                    Urutkan:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-surface-container-low text-on-surface text-xs font-semibold rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="populer">Paling Populer</option>
                    <option value="termurah">Harga: Termurah</option>
                    <option value="tertinggi">Harga: Tertinggi</option>
                  </select>
                </div>
              </div>

              {/* Integrated Search Input - Desktop & Tablet Only */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchChange(searchQuery);
                }}
                className="hidden sm:flex relative items-stretch bg-surface-container-lowest rounded-full border border-slate-200 dark:border-border-subtle shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden pl-4 sm:pl-5 pr-0 py-0"
              >
                <span className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Cari produk..."
                  enterKeyHint="search"
                  className="flex-1 min-w-0 px-2 sm:px-3 py-2.5 sm:py-3 bg-transparent text-on-surface text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="flex items-center text-slate-400 hover:text-on-surface px-2 transition-colors cursor-pointer"
                    title="Hapus pencarian"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Cari Produk"
                  className="bg-primary hover:bg-primary-dark active:opacity-90 text-white px-5 rounded-r-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Product Grid - 2 Kolom Kanan & Kiri di HP */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-lowest p-12 rounded-3xl border border-border-subtle text-center space-y-4">
                <span className="material-symbols-outlined text-6xl text-text-secondary">
                  search_off
                </span>
                <div className="space-y-1">
                  <h3 className="font-headline-sm text-lg text-on-surface font-bold">
                    Produk Tidak Ditemukan
                  </h3>
                  <p className="text-sm text-text-secondary max-w-md mx-auto">
                    Tidak ada produk di kategori ini yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('semua');
                    }}
                    className="px-5 py-2.5 bg-surface-container-low text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-light-blue transition-colors cursor-pointer"
                  >
                    Reset Filter &amp; Pencarian
                  </button>
                  <a
                    href={generateCustomLinkRequestUrl(searchQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-primary-dark transition-colors shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>Minta Shopper Carikan di Tokyo</span>
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
