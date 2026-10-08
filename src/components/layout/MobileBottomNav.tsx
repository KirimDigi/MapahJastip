import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { CATALOG_CATEGORY_FILTERS } from '../../constants/categories';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/katalog', label: 'Produk' },
    { to: '/cara-kerja', label: 'Cara Kerja' },
    { to: '/estimasi', label: 'Estimasi Biaya' },
    { to: '/live-belanja', label: 'Live Belanja Jepang' },
    { to: '/testimoni', label: 'Testimoni' },
    { to: '/status-pesanan', label: 'Status Pesanan' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (searchQuery.trim()) {
      navigate(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/katalog');
    }
  };

  const isCurrentActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/katalog') return location.pathname === '/katalog' || location.pathname === '/produk';
    if (path === '/cara-kerja') return location.pathname === '/cara-kerja' || location.pathname === '/cara-belanja';
    return location.pathname === path;
  };

  return (
    <>
      {/* 1. FIXED BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border-subtle shadow-[0_-4px_24px_rgba(0,0,0,0.08)] safe-area-bottom"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* Tab 1: Beranda */}
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex flex-col items-center justify-center py-1 transition-all"
          >
            {() => {
              const active = isCurrentActive('/') && !isMenuOpen;
              return (
                <>
                  <div
                    className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                      active ? 'bg-surface-light-blue text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                    </svg>
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight mt-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    Beranda
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 2: Produk */}
          <NavLink
            to="/katalog"
            onClick={() => setIsMenuOpen(false)}
            className="flex flex-col items-center justify-center py-1 transition-all"
          >
            {() => {
              const active = isCurrentActive('/katalog') && !isMenuOpen;
              return (
                <>
                  <div
                    className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                      active ? 'bg-surface-light-blue text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M4 4h16l1.5 5.5v1.5h-.5a2.5 2.5 0 01-5 0H8a2.5 2.5 0 01-5 0H2.5V9.5L4 4zm1 9v7h14v-7a4.5 4.5 0 01-3 1.1 4.5 4.5 0 01-4-2.1 4.5 4.5 0 01-4 2.1 4.5 4.5 0 01-3-1.1z" />
                    </svg>
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight mt-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    Produk
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 3: Cara Kerja */}
          <NavLink
            to="/cara-kerja"
            onClick={() => setIsMenuOpen(false)}
            className="flex flex-col items-center justify-center py-1 transition-all"
          >
            {() => {
              const active = isCurrentActive('/cara-kerja') && !isMenuOpen;
              return (
                <>
                  <div
                    className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                      active ? 'bg-surface-light-blue text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-4-2.5 4-2.5v5zm1.5-6.5h-5V8h5v2z" />
                    </svg>
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight mt-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    Cara Kerja
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 4: Estimasi */}
          <NavLink
            to="/estimasi"
            onClick={() => setIsMenuOpen(false)}
            className="flex flex-col items-center justify-center py-1 transition-all"
          >
            {() => {
              const active = isCurrentActive('/estimasi') && !isMenuOpen;
              return (
                <>
                  <div
                    className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                      active ? 'bg-surface-light-blue text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2zM7 7h4v2H7V7zm0 4h4v2H7v-2zm0 4h4v2H7v-2z" />
                    </svg>
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-tight mt-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    Estimasi
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 5: Menu (Buka Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex flex-col items-center justify-center py-1 transition-all cursor-pointer focus:outline-none"
            aria-label={isMenuOpen ? 'Tutup Menu' : 'Buka Menu Lengkap'}
          >
            <div
              className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                isMenuOpen || ['/live-belanja', '/testimoni', '/status-pesanan'].includes(location.pathname)
                  ? 'bg-surface-light-blue text-primary'
                  : 'text-text-secondary'
              }`}
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              )}
            </div>
            <span
              className={`text-[11px] font-semibold leading-tight mt-0.5 ${
                isMenuOpen || ['/live-belanja', '/testimoni', '/status-pesanan'].includes(location.pathname)
                  ? 'text-primary'
                  : 'text-text-secondary'
              }`}
            >
              {isMenuOpen ? 'Tutup' : 'Menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* 2. MOBILE BOTTOM SHEET DRAWER */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-full max-h-[82vh] bg-surface-container-lowest rounded-t-3xl border-t border-border-subtle shadow-2xl p-5 pb-8 flex flex-col space-y-4 animate-slide-up overflow-y-auto safe-area-bottom">
            {/* Grab handle bar */}
            <div className="w-12 h-1.5 bg-border-subtle rounded-full mx-auto -mt-1 mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle/70">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-on-surface">Menu Navigasi MapahJastip</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container-low text-text-secondary hover:text-on-surface cursor-pointer"
                aria-label="Tutup Menu"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Mobile Search Form - Capsule Pill Style */}
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-stretch bg-surface-container-low rounded-full border border-slate-200 dark:border-border-subtle shadow-xs focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden pl-4 pr-0">
                <span className="flex items-center text-slate-400 dark:text-text-secondary shrink-0 pointer-events-none pr-1">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari produk, merek, atau kata kunci..."
                  className="flex-1 min-w-0 px-2 py-2.5 bg-transparent text-on-surface text-sm placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
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
                  className="bg-primary hover:bg-primary-dark text-white px-4 rounded-r-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Navigation Links in requested order */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = isCurrentActive(link.to);

                if (link.to === '/katalog') {
                  return (
                    <div key={link.to} className="space-y-1">
                      <div className="flex items-center justify-between rounded-xl">
                        <NavLink
                          to={link.to}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex-1 px-4 py-2.5 rounded-l-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                            isActive
                              ? 'bg-surface-light-blue text-primary'
                              : 'text-on-surface-variant hover:bg-surface-soft-blue'
                          }`}
                        >
                          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M4 4h16l1.5 5.5v1.5h-.5a2.5 2.5 0 01-5 0H8a2.5 2.5 0 01-5 0H2.5V9.5L4 4zm1 9v7h14v-7a4.5 4.5 0 01-3 1.1 4.5 4.5 0 01-4-2.1 4.5 4.5 0 01-4 2.1 4.5 4.5 0 01-3-1.1z" />
                          </svg>
                          <span>{link.label}</span>
                        </NavLink>
                        <button
                          onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                          className="px-3 py-2.5 text-text-secondary hover:text-primary rounded-r-xl hover:bg-surface-soft-blue cursor-pointer"
                          aria-label="Buka Kategori Produk"
                        >
                          <svg
                            className={`w-5 h-5 fill-current transition-transform duration-200 ${
                              isProductsDropdownOpen ? 'rotate-180' : ''
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
                        </button>
                      </div>

                      {isProductsDropdownOpen && (
                        <div className="pl-3 pr-1 py-1.5 grid grid-cols-2 gap-1 bg-surface-container-low/50 rounded-xl">
                          {CATALOG_CATEGORY_FILTERS.map((cat) => (
                            <Link
                              key={cat.id}
                              to={cat.id === 'semua' ? '/katalog' : `/katalog?kategori=${cat.id}`}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-on-surface hover:text-primary hover:bg-surface-light-blue transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px] text-text-secondary">
                                {cat.icon}
                              </span>
                              <span className="truncate">{cat.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-surface-light-blue text-primary'
                        : 'text-on-surface-variant hover:bg-surface-soft-blue'
                    }`}
                  >
                    <span>{link.label}</span>
                    <svg className="w-4 h-4 fill-current text-text-secondary" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-border-subtle flex flex-col gap-2.5">
              <button
                onClick={toggleTheme}
                className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-surface-container-low text-on-surface text-sm font-medium rounded-xl hover:bg-surface-light-blue transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>Mode Tampilan</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-light-blue text-primary font-semibold">
                  {theme === 'dark' ? '🌙 Gelap' : '☀️ Terang'}
                </span>
              </button>

              <a
                href="https://wa.me/6281280905425?text=Halo%20Personal%20Shopper%20MapahJastip!%20Saya%20mau%20konsultasi%20titip%20belanja%20produk%20dari%20Jepang."
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">support_agent</span>
                <span>Hubungi Shopper (WA: 0812-8090-5425)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
