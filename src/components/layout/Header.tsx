import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { CATALOG_CATEGORY_FILTERS } from '../../constants/categories';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/katalog', label: 'Produk' },
    { to: '/cara-kerja', label: 'Cara Kerja' },
    { to: '/estimasi', label: 'Estimasi Biaya' },
    { to: '/live-belanja', label: 'Live Belanja Jepang' },
    { to: '/testimoni', label: 'Testimoni' },
    { to: '/status-pesanan', label: 'Status Pesanan' },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border-subtle/80 shadow-[0_1px_8px_rgba(18,59,120,0.06)] transition-all">
      <div className="h-20 w-full max-w-[1480px] mx-auto px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 lg:gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <Logo className="h-9 sm:h-11 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            if (link.to === '/katalog') {
              return (
                <div key={link.to} className="relative group">
                  <NavLink
                    to={link.to}
                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 2xl:px-3 2xl:py-2 rounded-lg text-xs 2xl:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-surface-light-blue text-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-soft-blue'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:rotate-180">
                      expand_more
                    </span>
                  </NavLink>

                  {/* Mega Menu Category Dropdown */}
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                    <div className="w-[480px] bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_rgba(18,59,120,0.16)] border border-border-subtle p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle/70">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[17px]">category</span>
                          Kategori Produk Jepang
                        </span>
                        <Link
                          to="/katalog"
                          className="text-xs text-text-secondary hover:text-primary font-semibold flex items-center gap-0.5"
                        >
                          <span>Lihat Semua</span>
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </Link>
                      </div>

                      {/* 2-Columns of Categories with Icons */}
                      <div className="grid grid-cols-2 gap-1">
                        {CATALOG_CATEGORY_FILTERS.map((cat) => (
                          <Link
                            key={cat.id}
                            to={cat.id === 'semua' ? '/katalog' : `/katalog?kategori=${cat.id}`}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-light-blue hover:text-primary font-medium transition-colors group/item"
                          >
                            <span className="material-symbols-outlined text-[18px] text-text-secondary group-hover/item:text-primary shrink-0 transition-colors">
                              {cat.icon}
                            </span>
                            <span className="truncate">{cat.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`px-2.5 py-1.5 2xl:px-3 2xl:py-2 rounded-lg text-xs 2xl:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-surface-light-blue text-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-soft-blue'
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
          {/* Header Search Bar (Pill Capsule Style - Desktop) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (headerSearchQuery.trim()) {
                navigate(`/katalog?q=${encodeURIComponent(headerSearchQuery.trim())}`);
              } else {
                navigate('/katalog');
              }
            }}
            className="hidden md:flex items-stretch bg-surface-container-low rounded-full border border-slate-200 dark:border-border-subtle shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden pl-3 pr-0 py-0 w-36 lg:w-44 xl:w-56 2xl:w-64"
          >
            <span className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </span>
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="flex-1 min-w-0 px-1.5 py-2 bg-transparent text-on-surface text-xs font-medium placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none"
            />
            {headerSearchQuery && (
              <button
                type="button"
                onClick={() => setHeaderSearchQuery('')}
                className="flex items-center text-slate-400 hover:text-on-surface px-1 transition-colors cursor-pointer"
                aria-label="Hapus kata kunci"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label="Cari"
              className="bg-primary hover:bg-primary-dark text-white px-3 rounded-r-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </form>

          {/* Quick Search Button (Mobile only) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Cari Produk Jepang"
            title="Cari Produk Jepang (Buka Pencarian)"
            className="md:hidden p-2 rounded-lg bg-surface-container-low hover:bg-surface-light-blue text-on-surface hover:text-primary transition-all flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>

          {/* Theme Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mode Gelap aktif. Klik untuk beralih ke Mode Terang' : 'Mode Terang aktif. Klik untuk beralih ke Mode Gelap'}
            title={theme === 'dark' ? 'Mode Gelap (Klik untuk beralih ke Terang)' : 'Mode Terang (Klik untuk beralih ke Gelap)'}
            className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-light-blue text-on-surface hover:text-primary transition-all flex items-center justify-center focus:outline-none cursor-pointer"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-amber-500" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Lihat Keranjang Belanja"
            className="relative p-2 rounded-lg bg-surface-container-low hover:bg-surface-light-blue text-on-surface hover:text-primary transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0020.01 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-scale">
                {totalItems}
              </span>
            )}
          </button>


          {/* Profile Avatar / User status */}
          <div className="hidden md:flex items-center pl-0.5">
            <img
              alt="Concierge Profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-surface-light-blue shadow-[0_2px_6px_rgba(18,59,120,0.12)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAelsEhjQAkzLtYISd1jVD-quAIqjF3ObWurhEbsExi3HoDJapi3E_RTvV5LJ6uB9OWLbnyI_uKcjqXuTK1H4VGt11pLIzIUbcKI0PWsd5lcXg8fbaKL83LuiKwCvADQlB8DBzgSlU0ATS2aPNdqpxHCJ3jCifL8CYdU0ZvuDK2hYZj_ZitSeVn8jLQjMjoSP5sCasT9RljVuFQw6zI0MMqRMNMac1OE8x6BHG8RXQrUPWLQow-9M0p"
            />
          </div>
        </div>
      </div>
    </header>

    {/* INTERACTIVE SEARCH MODAL OVERLAY */}
    {isSearchOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4">
        {/* Backdrop */}
        <div
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        />

        {/* Modal Window */}
        <div className="relative z-10 w-full max-w-2xl bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-2xl p-5 sm:p-6 space-y-4 animate-scale">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <h2 className="font-bold text-base text-on-surface">Pencarian Produk Jepang</h2>
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 rounded-full hover:bg-surface-container-low text-text-secondary hover:text-on-surface transition-colors cursor-pointer"
              aria-label="Tutup pencarian"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Search Form - Capsule Pill Style */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsSearchOpen(false);
              if (headerSearchQuery.trim()) {
                navigate(`/katalog?q=${encodeURIComponent(headerSearchQuery.trim())}`);
              } else {
                navigate('/katalog');
              }
            }}
            className="w-full"
          >
            <div className="relative flex items-stretch bg-surface-container-low rounded-full border-2 border-slate-200 dark:border-border-subtle shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all overflow-hidden pl-4 pr-0">
              <span className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </span>
              <input
                type="text"
                autoFocus
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                placeholder="Cari produk, merek, atau kata kunci..."
                className="flex-1 min-w-0 px-2 py-3 bg-transparent text-on-surface text-sm sm:text-base font-medium placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none"
              />
              {headerSearchQuery && (
                <button
                  type="button"
                  onClick={() => setHeaderSearchQuery('')}
                  className="flex items-center text-slate-400 hover:text-on-surface px-2 transition-colors cursor-pointer"
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
                className="bg-primary hover:bg-primary-dark text-white px-5 sm:px-6 rounded-r-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Quick Trending Tags */}
          <div className="space-y-2 pt-1">
            <span className="text-xs text-text-secondary font-semibold flex items-center gap-1">
              <span>🔥</span> Rekomendasi Populer:
            </span>
            <div className="flex flex-wrap gap-2">
              {['SK-II Facial Treatment', 'Onitsuka Tiger', 'Tokyo Banana', 'Melano CC', 'Chiikawa', 'Matcha'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate(`/katalog?q=${encodeURIComponent(tag)}`);
                  }}
                  className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-light-blue hover:text-primary text-text-secondary text-xs rounded-xl border border-border-subtle transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);
};
