import React from 'react';
import { useExchangeRate } from '../../context/ExchangeRateContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { LanguageSelector } from '../common/LanguageSelector';

export const AnnouncementBar: React.FC = () => {
  const { rate, isLive, isLoading, refetch } = useExchangeRate();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative z-[60] w-full bg-gradient-to-r from-surface-light-blue via-surface to-surface-light-blue border-b border-border-subtle/60 py-1.5 px-3 sm:px-6 lg:px-12 text-label-sm font-label-sm text-text-secondary">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Sisi Kiri: Kurs Acuan (Compact di Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-4 text-xs font-medium shrink-0 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
              title={isLive ? 'Kurs live diperbarui otomatis setiap 1 menit' : 'Kurs acuan statis'}
            />
            <span className="whitespace-nowrap text-[11px] sm:text-xs">
              <span className="hidden sm:inline">{t('bar.rateTitle')} {isLive ? 'Live' : ''}: </span>
              <strong className="text-primary font-bold">1 JPY = Rp {rate.toFixed(2)}</strong>
            </span>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              title="Auto-refresh setiap 1 menit (Klik untuk perbarui manual sekarang)"
              aria-label="Perbarui kurs"
              className="p-0.5 sm:p-1 rounded-full hover:bg-surface-light-blue text-text-secondary hover:text-primary transition-colors disabled:opacity-50 inline-flex items-center cursor-pointer shrink-0"
            >
              <svg
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ${isLoading ? 'animate-spin' : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
              </svg>
            </button>
          </div>
          <span className="hidden sm:inline text-border-subtle">•</span>
          <span className="text-success-text hidden sm:flex items-center gap-1 font-semibold">
            <svg className="w-3.5 h-3.5 fill-current text-success" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            {t('bar.receiptGuarantee')}
          </span>
        </div>

        {/* Sisi Kanan: Bahasa & Mode Cahaya Terang/Gelap (1 Baris Rapi) */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium shrink-0">
          {/* Top 3 Language Selector */}
          <LanguageSelector variant="compact" />
          {/* Theme Mode Toggle (Gelap / Terang) */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Mode Gelap aktif. Klik untuk beralih ke Mode Terang' : 'Mode Terang aktif. Klik untuk beralih ke Mode Gelap'}
            title={theme === 'dark' ? 'Mode Gelap (Klik untuk beralih ke Terang)' : 'Mode Terang (Klik untuk beralih ke Gelap)'}
            className="flex items-center justify-center p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-border-subtle bg-surface-container-low hover:bg-surface-light-blue hover:border-primary/40 text-on-surface hover:text-primary transition-all cursor-pointer select-none focus:outline-none shrink-0"
          >
            {theme === 'dark' ? (
              <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 fill-current text-amber-500" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
