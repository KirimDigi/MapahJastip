import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen, clearCart } = useCart();
  const { user, isLoggedIn, logout, isAdmin } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/katalog', label: t('nav.products') },
    { to: '/cara-kerja', label: t('nav.howItWorks') },
    { to: '/jadwal-penerbangan', label: t('nav.flightSchedule') },
    { to: '/estimasi', label: t('nav.costEstimator') },
    { to: '/testimoni', label: t('nav.testimonials') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/status-pesanan', label: t('nav.orderStatus') },
  ];

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border-subtle/80 shadow-[0_1px_8px_rgba(18,59,120,0.06)] transition-all">
      <div className="h-14 sm:h-16 lg:h-20 w-full max-w-[1480px] mx-auto px-2.5 sm:px-5 lg:px-6 flex items-center justify-between gap-2 lg:gap-3">
        {/* Brand Logo & Mobile Menu Hamburger (Inline Horizontal Layout) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-menu'))}
            className="xl:hidden p-1.5 -ml-1 rounded-lg text-on-surface hover:text-primary hover:bg-surface-light-blue active:scale-95 transition-all cursor-pointer select-none flex items-center justify-center"
            aria-label="Buka Menu Navigasi"
            title="Buka Menu Navigasi"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </button>
          <Logo className="h-7 sm:h-9 lg:h-11 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
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
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-2.5 flex-1 md:flex-initial justify-end">
          {/* Header Search Bar (Pill Capsule Style) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (headerSearchQuery.trim()) {
                navigate(`/katalog?q=${encodeURIComponent(headerSearchQuery.trim())}`);
              } else {
                navigate('/katalog');
              }
            }}
            className="flex items-stretch flex-1 min-w-[110px] max-w-[210px] sm:max-w-xs md:max-w-none md:flex-initial md:w-36 lg:w-44 xl:w-56 2xl:w-64 h-8.5 sm:h-10 bg-surface-container-low rounded-full border border-slate-200 dark:border-border-subtle shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden pl-2.5 sm:pl-3 pr-0 py-0"
          >
            <span className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </span>
            <input
              type="text"
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
              placeholder={t('cat.searchPlaceholder')}
              className="flex-1 min-w-0 px-1 py-1 bg-transparent text-on-surface text-[11px] sm:text-xs font-medium placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none"
            />
            {headerSearchQuery && (
              <button
                type="button"
                onClick={() => setHeaderSearchQuery('')}
                className="flex items-center text-slate-400 hover:text-on-surface px-1 transition-colors cursor-pointer"
                aria-label={t('cat.clearSearch')}
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label={t('cat.searchBtn')}
              className="bg-primary hover:bg-primary-dark text-white px-2.5 sm:px-3 rounded-r-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </form>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Lihat Keranjang Belanja"
            className="relative p-1.5 sm:p-2 rounded-xl bg-surface-container-low hover:bg-surface-light-blue text-on-surface hover:text-primary transition-colors flex items-center justify-center focus:outline-none cursor-pointer shrink-0"
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


          {/* User Account / Login Button (Desktop only; on mobile it is in the bottom navigation bar) */}
          {!isLoggedIn ? (
            <Link
              to="/masuk"
              aria-label="Masuk atau Daftar Akun"
              className="hidden xl:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200 dark:border-border-subtle bg-white dark:bg-surface-container-lowest hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-surface-container-low transition-all text-xs font-semibold text-on-surface shadow-2xs active:scale-95 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[20px] text-primary shrink-0">
                account_circle
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {t('header.login')}
              </span>
            </Link>
          ) : (
            <div className="relative hidden xl:block">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="Menu Akun Saya"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-all text-xs font-bold text-primary shadow-2xs active:scale-95 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[19px] text-primary shrink-0">
                  account_circle
                </span>
                <span className="max-w-[70px] sm:max-w-[100px] truncate text-xs">
                  {user?.name.split(' ')[0]}
                </span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-xl p-2 z-50 animate-scale space-y-1">
                  <div className="px-3 py-2 border-b border-border-subtle/70">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-on-surface truncate">{user?.name}</p>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-primary text-white shrink-0">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-secondary truncate">{user?.email || user?.phone}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                      <span>Buka Panel Admin</span>
                    </Link>
                  )}
                  <Link
                    to="/masuk"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-light-blue hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">badge</span>
                    <span>Profil Akun Saya</span>
                  </Link>
                  <Link
                    to="/status-pesanan"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-on-surface hover:bg-surface-light-blue hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">local_shipping</span>
                    <span>Lacak Resi Kargo</span>
                  </Link>
                  <button
                    onClick={() => {
                      clearCart();
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-error hover:bg-error/10 transition-colors cursor-pointer text-left"
                  >
                    <span className="material-symbols-outlined text-[17px]">logout</span>
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          )}
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
