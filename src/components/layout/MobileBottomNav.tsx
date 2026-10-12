import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageSelector } from '../common/LanguageSelector';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useLanguage();
  const { user, isLoggedIn } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const getTabHowItWorksLabel = () => {
    if (language === 'ja') return '利用案内';
    if (language === 'en') return 'Cara Kerja';
    return 'Cara Kerja';
  };

  const getTabEstimasiLabel = () => {
    if (language === 'ja') return '見積もり';
    if (language === 'en') return 'Estimator';
    return 'Estimasi';
  };

  useEffect(() => {
    const handleOpenMenu = () => setIsMenuOpen(true);
    const handleCloseMenu = () => setIsMenuOpen(false);
    const handleToggleMenu = () => setIsMenuOpen((prev) => !prev);
    window.addEventListener('open-mobile-menu', handleOpenMenu);
    window.addEventListener('close-mobile-menu', handleCloseMenu);
    window.addEventListener('toggle-mobile-menu', handleToggleMenu);
    return () => {
      window.removeEventListener('open-mobile-menu', handleOpenMenu);
      window.removeEventListener('close-mobile-menu', handleCloseMenu);
      window.removeEventListener('toggle-mobile-menu', handleToggleMenu);
    };
  }, []);

  return (
    <>
      {/* 1. FIXED BOTTOM NAVIGATION BAR (RAPI, SEJAJAR & TANPA OUTLINE) */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border-subtle shadow-[0_-4px_24px_rgba(0,0,0,0.08)] safe-area-bottom select-none"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* Tab 1: Home */}
          <NavLink
            to="/"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="h-full flex flex-col items-center justify-center py-1 transition-all outline-none focus:outline-none focus:ring-0 active:outline-none border-none ring-0 select-none"
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
                    className={`text-[10px] sm:text-[11px] font-semibold leading-none mt-1 text-center whitespace-nowrap truncate max-w-full px-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {t('nav.home')}
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 2: Products */}
          <NavLink
            to="/katalog"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="h-full flex flex-col items-center justify-center py-1 transition-all outline-none focus:outline-none focus:ring-0 active:outline-none border-none ring-0 select-none"
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
                    className={`text-[10px] sm:text-[11px] font-semibold leading-none mt-1 text-center whitespace-nowrap truncate max-w-full px-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {t('nav.products')}
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 3: How It Works */}
          <NavLink
            to="/cara-kerja"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="h-full flex flex-col items-center justify-center py-1 transition-all outline-none focus:outline-none focus:ring-0 active:outline-none border-none ring-0 select-none"
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
                    className={`text-[10px] sm:text-[11px] font-semibold leading-none mt-1 text-center whitespace-nowrap truncate max-w-full px-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {getTabHowItWorksLabel()}
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 4: Cost Estimator */}
          <NavLink
            to="/estimasi"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="h-full flex flex-col items-center justify-center py-1 transition-all outline-none focus:outline-none focus:ring-0 active:outline-none border-none ring-0 select-none"
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
                    className={`text-[10px] sm:text-[11px] font-semibold leading-none mt-1 text-center whitespace-nowrap truncate max-w-full px-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {getTabEstimasiLabel()}
                  </span>
                </>
              );
            }}
          </NavLink>

          {/* Tab 5: Akun / Masuk (Pojok Kanan Bawah Menggantikan Posisi Menu) */}
          <NavLink
            to="/masuk"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="h-full flex flex-col items-center justify-center py-1 transition-all outline-none focus:outline-none focus:ring-0 active:outline-none border-none ring-0 select-none"
          >
            {() => {
              const active = ['/masuk', '/login', '/daftar', '/register'].includes(location.pathname) && !isMenuOpen;
              return (
                <>
                  <div
                    className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                      active ? 'bg-surface-light-blue text-primary' : 'text-text-secondary'
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold leading-none mt-1 text-center whitespace-nowrap truncate max-w-full px-0.5 ${
                      active ? 'text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {isLoggedIn ? (user?.name?.split(' ')[0] || t('header.myAccount')) : (language === 'ja' ? 'アカウント' : language === 'en' ? 'Account' : 'Akun')}
                  </span>
                </>
              );
            }}
          </NavLink>
        </div>
      </nav>

      {/* 2. MOBILE LEFT SIDEBAR DRAWER */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[100] flex justify-start">
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Left Drawer Content */}
          <div className="relative z-10 w-[84vw] max-w-[320px] h-full bg-surface-container-lowest rounded-r-2xl sm:rounded-r-3xl border-r border-border-subtle shadow-2xl p-5 pb-8 flex flex-col space-y-4 animate-slide-left overflow-y-auto safe-area-bottom">

            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-border-subtle/70">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-on-surface">{t('mob.menuTitle')}</span>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector variant="compact" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-surface-container-low text-text-secondary hover:text-on-surface cursor-pointer"
                  aria-label={t('mob.close')}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
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
                  placeholder={t('cat.searchPlaceholder')}
                  className="flex-1 min-w-0 px-2 py-2.5 bg-transparent text-on-surface text-sm placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="flex items-center text-slate-400 hover:text-on-surface px-2 transition-colors cursor-pointer"
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
                  className="bg-primary hover:bg-primary-dark text-white px-4 rounded-r-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Navigation Links in requested order */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = isCurrentActive(link.to);

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center ${
                      isActive
                        ? 'bg-surface-light-blue text-primary'
                        : 'text-on-surface-variant hover:bg-surface-soft-blue'
                    }`}
                  >
                    <span>{link.label}</span>
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
