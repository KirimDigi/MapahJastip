import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { DUMMY_PRODUCTS } from '../constants/dummyProducts';
import { CATALOG_CATEGORY_FILTERS } from '../constants/categories';
import { generateCustomLinkRequestUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
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

  // Helper to translate category label
  const getCategoryLabel = (catId: string, defaultLabel: string) => {
    if (catId === 'semua') return t('cat.all');
    return t(`cat.${catId}`, defaultLabel);
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
    if (sortBy === 'harga-rendah' || sortBy === 'termurah') {
      result.sort((a, b) => a.priceIdr - b.priceIdr);
    } else if (sortBy === 'harga-tinggi' || sortBy === 'tertinggi') {
      result.sort((a, b) => b.priceIdr - a.priceIdr);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'nama-az') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));
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
              {t('cat.allJapanese')}
            </button>
            <span className="text-border-subtle">›</span>
            <span className="text-primary font-semibold">
              {getCategoryLabel(activeCategoryObj.id, activeCategoryObj.label)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-text-secondary pb-3">
            <span className="text-primary font-semibold">{t('cat.allJapanese')}</span>
            <span className="text-xs text-text-secondary">({DUMMY_PRODUCTS.length})</span>
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
              placeholder={t('cat.searchPlaceholder')}
              enterKeyHint="search"
              className="flex-1 min-w-0 px-2 py-2.5 bg-transparent text-on-surface text-sm placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="flex items-center text-slate-400 hover:text-on-surface px-2 cursor-pointer transition-colors"
                aria-label={t('cat.clearSearch')}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label={t('cat.searchBtn')}
              className="bg-primary hover:bg-primary-dark active:opacity-90 text-white px-5 rounded-r-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </form>
        </div>

        {/* 1. MOBILE CATEGORY GRID */}
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
                    {getCategoryLabel(cat.id, cat.label)}
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
                <span className="truncate">Filter: <strong>{getCategoryLabel(activeCategoryObj.id, activeCategoryObj.label)}</strong></span>
              </div>
              <button
                onClick={() => handleCategoryChange('semua')}
                className="text-primary hover:underline font-bold text-xs flex items-center gap-0.5 shrink-0 cursor-pointer"
              >
                <span>{t('cat.filterAll')}</span>
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. DESKTOP & TABLET CATEGORY PILLS (2 BARIS RAPI TANPA SCROLL KESAMPING) */}
        <div className="hidden sm:block mb-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {CATALOG_CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border shadow-xs hover:shadow-sm ${
                    isActive
                      ? 'bg-surface-light-blue text-primary border-primary/40 font-bold shadow-xs'
                      : 'bg-white dark:bg-surface-container-lowest text-on-surface hover:text-primary hover:border-primary/40 border-slate-200 dark:border-border-subtle'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[19px] shrink-0 ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                    {cat.icon}
                  </span>
                  <span>{getCategoryLabel(cat.id, cat.label)}</span>
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

        {/* Main Catalog Content */}
        <main className="w-full space-y-6">
          {/* Top Toolbar: Heading, Search & Sort */}
          <div className="bg-surface-container-lowest p-3.5 sm:p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2.5 sm:space-y-4">
              <div className="flex flex-row items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-headline-md text-base sm:text-3xl text-on-surface font-extrabold tracking-tight">
                    {activeCategory === 'semua' ? t('cat.allJapanese') : getCategoryLabel(activeCategoryObj.id, activeCategoryObj.label)}
                  </h1>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {t('cat.showing')} <strong className="text-on-surface">{filteredProducts.length}</strong> {t('cat.productsFrom')}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-text-secondary font-medium hidden sm:inline">
                    {t('cat.sort')}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-surface-container-low text-on-surface text-xs font-semibold rounded-xl border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="populer">{t('cat.sortPopular')}</option>
                    <option value="harga-rendah">{t('cat.sortPriceLow')}</option>
                    <option value="harga-tinggi">{t('cat.sortPriceHigh')}</option>
                    <option value="rating">{t('cat.sortRating')}</option>
                    <option value="nama-az">{t('cat.sortName')}</option>
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
                  placeholder={t('cat.searchPlaceholder')}
                  enterKeyHint="search"
                  className="flex-1 min-w-0 px-2 sm:px-3 py-2.5 sm:py-3 bg-transparent text-on-surface text-sm font-medium placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="flex items-center text-slate-400 hover:text-on-surface px-2 transition-colors cursor-pointer"
                    title={t('cat.clearSearch')}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  aria-label={t('cat.searchBtn')}
                  className="bg-primary hover:bg-primary-dark active:opacity-90 text-white px-5 rounded-r-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
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
                    {t('cat.notFoundTitle')}
                  </h3>
                  <p className="text-sm text-text-secondary max-w-md mx-auto">
                    {t('cat.notFoundDesc')} &ldquo;{searchQuery}&rdquo;.
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
                    {t('cat.resetFilter')}
                  </button>
                  <a
                    href={generateCustomLinkRequestUrl(searchQuery)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-primary-dark transition-colors shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>{t('cat.askShopper')}</span>
                  </a>
                </div>
              </div>
            )}
          </main>
      </div>
    </div>
  );
};
