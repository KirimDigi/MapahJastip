import { CURRENT_EXCHANGE_RATE } from '../constants/rates';

const CACHE_KEY = 'mapah_jastip_jpy_rate';
const CACHE_TIMESTAMP_KEY = 'mapah_jastip_jpy_timestamp';
const CACHE_DATE_STR_KEY = 'mapah_jastip_jpy_datestr';
const CACHE_SOURCE_KEY = 'mapah_jastip_jpy_source';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 menit cache agar lebih responsif

export interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
  source: string;
  isLive: boolean;
}

/**
 * Format timestamp ISO or UNIX ke format waktu Indonesia (WIB)
 */
function formatIndonesianDateTime(dateObj: Date): string {
  try {
    return dateObj.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';
  } catch (e) {
    return dateObj.toLocaleDateString('id-ID') + ' (Live)';
  }
}

/**
 * Fetch live JPY to IDR exchange rate dengan prioritas API Real-Time
 */
export async function fetchLiveJpyToIdr(): Promise<ExchangeRateData> {
  // 1. Prioritas 1: FxRatesAPI (Real-time intra-day Forex, update setiap menit, CORS bebas)
  try {
    const res = await fetch('https://api.fxratesapi.com/latest?base=JPY&symbols=IDR', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.rates && typeof data.rates.IDR === 'number') {
        const rate = Math.round(data.rates.IDR * 100) / 100;
        const dateObj = data.timestamp ? new Date(data.timestamp * 1000) : new Date();
        return {
          rate,
          lastUpdated: formatIndonesianDateTime(dateObj),
          source: 'FxRates Live',
          isLive: true,
        };
      }
    }
  } catch (err) {
    console.warn('FxRatesAPI unavailable, trying ExchangeRate-API...', err);
  }

  // 2. Prioritas 2: ExchangeRate-API (open.er-api.com)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/JPY', {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates.IDR === 'number') {
        const rate = Math.round(data.rates.IDR * 100) / 100;
        const dateObj = data.time_last_update_unix ? new Date(data.time_last_update_unix * 1000) : new Date();
        return {
          rate,
          lastUpdated: formatIndonesianDateTime(dateObj),
          source: 'ExchangeRate-API',
          isLive: true,
        };
      }
    }
  } catch (err) {
    console.warn('ExchangeRate-API unavailable, trying Frankfurter...', err);
  }

  // 3. Prioritas 3: Frankfurter (European Central Bank)
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=JPY&to=IDR', {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && typeof data.rates.IDR === 'number') {
        const rate = Math.round(data.rates.IDR * 100) / 100;
        const dateObj = data.date ? new Date(data.date) : new Date();
        return {
          rate,
          lastUpdated: formatIndonesianDateTime(dateObj),
          source: 'Frankfurter (ECB)',
          isLive: true,
        };
      }
    }
  } catch (err) {
    console.warn('Frankfurter API unavailable, trying Currency-API CDN...', err);
  }

  // 4. Default fallback jika semua offline
  return {
    rate: CURRENT_EXCHANGE_RATE,
    lastUpdated: formatIndonesianDateTime(new Date()),
    source: 'Default Acuan Jastip',
    isLive: false,
  };
}

/**
 * Get cached rate or fetch fresh rate
 */
export async function getExchangeRate(forceFresh = false): Promise<ExchangeRateData> {
  if (!forceFresh) {
    try {
      const cachedRate = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      const cachedDateStr = localStorage.getItem(CACHE_DATE_STR_KEY);
      const cachedSource = localStorage.getItem(CACHE_SOURCE_KEY);

      if (cachedRate && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp, 10);
        if (age < CACHE_DURATION_MS) {
          return {
            rate: parseFloat(cachedRate),
            lastUpdated: cachedDateStr || formatIndonesianDateTime(new Date(parseInt(cachedTimestamp, 10))),
            source: cachedSource || 'Local Cache',
            isLive: true,
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  const fresh = await fetchLiveJpyToIdr();
  if (fresh.isLive) {
    try {
      localStorage.setItem(CACHE_KEY, fresh.rate.toString());
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      localStorage.setItem(CACHE_DATE_STR_KEY, fresh.lastUpdated);
      localStorage.setItem(CACHE_SOURCE_KEY, fresh.source);
    } catch (e) {
      // ignore
    }
  }

  return fresh;
}
