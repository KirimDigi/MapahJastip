import React from 'react';
import { useExchangeRate } from '../../context/ExchangeRateContext';

export const AnnouncementBar: React.FC = () => {
  const { rate, isLive, isLoading, refetch } = useExchangeRate();

  return (
    <div className="w-full bg-gradient-to-r from-surface-light-blue via-surface to-surface-light-blue border-b border-border-subtle/60 py-2.5 px-4 sm:px-6 lg:px-12 text-label-sm font-label-sm text-text-secondary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-success-bg text-success-text font-label-sm font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-success animate-ping mr-1.5 inline-block" />
            Live Shopper Tokyo JST 14:20
          </span>
          <span className="text-on-surface font-title-md text-label-sm">
            Batch #48 Tokyo Sedang Hunting di Ginza, Shibuya &amp; Akihabara!
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
              title={isLive ? 'Kurs live diperbarui otomatis via API' : 'Kurs acuan statis'}
            />
            <span>
              Kurs Acuan {isLive ? 'Live' : ''}:{' '}
              <strong className="text-primary font-bold">1 JPY = Rp {rate.toFixed(2)}</strong>
            </span>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              title="Perbarui kurs live sekarang"
              aria-label="Perbarui kurs"
              className="p-1 rounded-full hover:bg-surface-light-blue text-text-secondary hover:text-primary transition-colors disabled:opacity-50 inline-flex items-center"
            >
              <svg
                className={`w-3.5 h-3.5 fill-current ${isLoading ? 'animate-spin' : ''}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
              </svg>
            </button>
          </div>
          <span className="hidden sm:inline text-border-subtle">•</span>
          <span className="text-success-text flex items-center gap-1 font-semibold">
            <svg className="w-3.5 h-3.5 fill-current text-success" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
            100% Struk Resmi Asli
          </span>
        </div>
      </div>
    </div>
  );
};
