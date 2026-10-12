import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CURRENT_EXCHANGE_RATE } from '../constants/rates';
import { getExchangeRate, fetchLiveJpyToIdr, ExchangeRateData } from '../services/currencyApi';

interface ExchangeRateContextType {
  rate: number;
  isLive: boolean;
  isLoading: boolean;
  source: string;
  lastUpdated: string;
  refetch: () => Promise<void>;
  setCustomRate: (rate: number) => void;
}

const ExchangeRateContext = createContext<ExchangeRateContextType>({
  rate: CURRENT_EXCHANGE_RATE,
  isLive: false,
  isLoading: false,
  source: 'Default',
  lastUpdated: '',
  refetch: async () => {},
  setCustomRate: () => {},
});

export const ExchangeRateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ExchangeRateData>({
    rate: CURRENT_EXCHANGE_RATE,
    lastUpdated: '',
    source: 'Memuat...',
    isLive: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isManual, setIsManual] = useState(false);

  const loadRate = useCallback(async (forceFresh = false) => {
    setIsLoading(true);
    try {
      const res = forceFresh ? await fetchLiveJpyToIdr() : await getExchangeRate(forceFresh);
      setData(res);
      setIsManual(false);
    } catch (err) {
      console.error('Failed to get exchange rate:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch saat aplikasi dimuat
    loadRate(false);

    // Auto-refresh tiap 1 menit (60 detik)
    const interval = setInterval(() => {
      if (!isManual) {
        loadRate(true);
      }
    }, 60 * 1000);

    // Refresh otomatis ketika user kembali membuka tab browser
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isManual) {
        loadRate(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadRate, isManual]);

  const refetch = useCallback(async () => {
    await loadRate(true);
  }, [loadRate]);

  const setCustomRate = useCallback((customRate: number) => {
    setIsManual(true);
    setData({
      rate: Math.round(customRate * 100) / 100,
      lastUpdated: new Date().toLocaleTimeString('id-ID') + ' WIB (Manual)',
      source: 'Input Manual',
      isLive: true,
    });
  }, []);

  return (
    <ExchangeRateContext.Provider
      value={{
        rate: data.rate,
        isLive: data.isLive,
        isLoading,
        source: data.source,
        lastUpdated: data.lastUpdated,
        refetch,
        setCustomRate,
      }}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
};

export function useExchangeRate() {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error('useExchangeRate must be used within an ExchangeRateProvider');
  }
  return context;
}
