import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export interface FlightItem {
  id: string;
  flightCode: string;
  airline: 'ANA' | 'JAL' | 'Garuda';
  airlineName: string;
  route: string;
  depAirport: string;
  arrAirport: string;
  depTime: string;
  arrTime: string;
  dayOffset: number; // Days from today
  status: 'open' | 'boarding' | 'scheduled';
  remainingQuotaKg: number;
  terminal: string;
}

const STATIC_SCHEDULE_CONFIG: Omit<FlightItem, 'id'>[] = [
  {
    flightCode: 'NH855',
    airline: 'ANA',
    airlineName: 'All Nippon Airways',
    route: 'HND → CGK',
    depAirport: 'Tokyo Haneda (HND)',
    arrAirport: 'Soekarno Hatta (CGK)',
    depTime: '10:20',
    arrTime: '16:20',
    dayOffset: 2,
    status: 'open',
    remainingQuotaKg: 18,
    terminal: 'T3 Haneda ➔ T3 CGK',
  },
  {
    flightCode: 'JL725',
    airline: 'JAL',
    airlineName: 'Japan Airlines',
    route: 'NRT → CGK',
    depAirport: 'Tokyo Narita (NRT)',
    arrAirport: 'Soekarno Hatta (CGK)',
    depTime: '10:50',
    arrTime: '16:55',
    dayOffset: 4,
    status: 'open',
    remainingQuotaKg: 32,
    terminal: 'T2 Narita ➔ T3 CGK',
  },
  {
    flightCode: 'GA875',
    airline: 'Garuda',
    airlineName: 'Garuda Indonesia',
    route: 'HND → CGK',
    depAirport: 'Tokyo Haneda (HND)',
    arrAirport: 'Soekarno Hatta (CGK)',
    depTime: '11:45',
    arrTime: '17:35',
    dayOffset: 7,
    status: 'scheduled',
    remainingQuotaKg: 45,
    terminal: 'T3 Haneda ➔ T3 CGK',
  },
  {
    flightCode: 'NH835',
    airline: 'ANA',
    airlineName: 'All Nippon Airways',
    route: 'NRT → CGK',
    depAirport: 'Tokyo Narita (NRT)',
    arrAirport: 'Soekarno Hatta (CGK)',
    depTime: '17:45',
    arrTime: '23:55',
    dayOffset: 11,
    status: 'scheduled',
    remainingQuotaKg: 50,
    terminal: 'T1 Narita ➔ T3 CGK',
  },
  {
    flightCode: 'JL729',
    airline: 'JAL',
    airlineName: 'Japan Airlines',
    route: 'NRT → CGK',
    depAirport: 'Tokyo Narita (NRT)',
    arrAirport: 'Soekarno Hatta (CGK)',
    depTime: '18:00',
    arrTime: '00:05 (+1)',
    dayOffset: 15,
    status: 'scheduled',
    remainingQuotaKg: 55,
    terminal: 'T2 Narita ➔ T3 CGK',
  },
];

export const FlightScheduleCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { language } = useLanguage();
  const [now, setNow] = useState<Date>(new Date());
  const [selectedFlight, setSelectedFlight] = useState<FlightItem | null>(null);

  // Live real-time clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wibTime = now.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const jstTime = now.toLocaleTimeString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Calculate dynamic flight dates relative to real-time current date
  const formatFlightDate = (offsetDays: number): string => {
    const flightDate = new Date(now.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    const mIndex = flightDate.getMonth();
    const allMonthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const allMonthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const month = language === 'en' ? allMonthsEn[mIndex] : allMonthsId[mIndex];
    return `${flightDate.getDate()} ${month} ${flightDate.getFullYear()}`;
  };

  const flights: FlightItem[] = STATIC_SCHEDULE_CONFIG.map((f, idx) => ({
    ...f,
    id: `flight-${idx + 1}`,
  }));

  // Render authentic airline logos
  const renderAirlineLogo = (airline: 'ANA' | 'JAL' | 'Garuda') => {
    if (airline === 'ANA') {
      return (
        <div className="flex items-center gap-1 font-black italic tracking-tighter text-[#002B7F] select-none">
          <svg className="w-4 h-3.5 fill-[#008CD6]" viewBox="0 0 24 24">
            <path d="M2.5 19h4L14 5h-4zM10.5 19h4l7.5-14h-4z" />
          </svg>
          <span className="text-[13px] sm:text-sm font-extrabold text-[#002B7F]">ANA</span>
        </div>
      );
    }
    if (airline === 'JAL') {
      return (
        <div className="flex items-center gap-1.5 select-none">
          <div className="w-4 h-4 rounded-full bg-[#D91E18] flex items-center justify-center shrink-0 shadow-2xs">
            {/* Tsurumaru Crane silhouette */}
            <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z" />
            </svg>
          </div>
          <span className="text-[12px] sm:text-[13px] font-black text-on-surface tracking-tight">JAL</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 select-none">
        <svg className="w-3.5 h-3.5 fill-[#0A3B72]" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#0A3B72] tracking-tight leading-none whitespace-nowrap hidden xs:inline sm:inline">
          Garuda Indonesia
        </span>
        <span className="text-[11px] font-bold text-[#0A3B72] tracking-tight leading-none xs:hidden sm:hidden">
          Garuda
        </span>
      </div>
    );
  };

  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_8px_24px_rgba(18,59,120,0.06)] border border-border-subtle/80 flex flex-col justify-between transition-all ${className}`}
    >
      <div className="space-y-3.5">
        {/* Header Title & Real-Time Sync Indicator */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-title-md text-base sm:text-lg text-on-surface font-extrabold text-[#0B2540]">
                Jadwal Penerbangan
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-bg text-success-text text-[9.5px] sm:text-[10px] font-bold border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span>Live Real-Time</span>
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 leading-snug">
              Update jadwal terbaru untuk pengadaan barang dan pengiriman jastip.
            </p>
          </div>
        </div>

        {/* Live Clock Bar */}
        <div className="px-3 py-1.5 bg-surface-soft-blue/70 rounded-xl flex items-center justify-between text-[10.5px] sm:text-xs text-text-secondary border border-border-subtle/50">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
            <span className="font-medium">
              Tokyo: <strong className="text-on-surface font-mono">{jstTime}</strong> JST
            </span>
          </div>
          <div className="text-border-subtle">|</div>
          <div className="font-medium">
            Jakarta: <strong className="text-primary font-mono">{wibTime}</strong> WIB
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface font-bold text-[11px] sm:text-xs rounded-lg">
                <th className="py-2.5 px-2.5 rounded-l-lg whitespace-nowrap font-bold text-on-surface">Tanggal</th>
                <th className="py-2.5 px-2 whitespace-nowrap font-bold text-on-surface">Maskapai</th>
                <th className="py-2.5 px-2 whitespace-nowrap font-bold text-on-surface">Rute</th>
                <th className="py-2.5 px-2 whitespace-nowrap font-bold text-on-surface">Berangkat</th>
                <th className="py-2.5 px-2.5 rounded-r-lg whitespace-nowrap font-bold text-on-surface">Tiba</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {flights.map((item, idx) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedFlight(item)}
                  className={`hover:bg-surface-light-blue/60 transition-colors group cursor-pointer ${
                    idx === 0 ? 'bg-primary/3' : ''
                  }`}
                  title={`Klik untuk rincian penerbangan ${item.flightCode}`}
                >
                  {/* Tanggal */}
                  <td className="py-2.5 px-2.5 font-medium text-on-surface whitespace-nowrap text-[11.5px] sm:text-xs">
                    <div className="flex items-center gap-1.5">
                      <span>{formatFlightDate(item.dayOffset)}</span>
                      {idx === 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping shrink-0" title="Kloter Terdekat" />
                      )}
                    </div>
                  </td>

                  {/* Maskapai */}
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    {renderAirlineLogo(item.airline)}
                  </td>

                  {/* Rute */}
                  <td className="py-2.5 px-2 whitespace-nowrap text-[11.5px] sm:text-xs text-text-secondary font-medium">
                    <span className="group-hover:text-primary transition-colors">{item.route}</span>
                  </td>

                  {/* Berangkat */}
                  <td className="py-2.5 px-2 whitespace-nowrap text-[11.5px] sm:text-xs text-on-surface font-medium tabular-nums">
                    {item.depTime}
                  </td>

                  {/* Tiba */}
                  <td className="py-2.5 px-2.5 whitespace-nowrap text-[11.5px] sm:text-xs text-on-surface font-medium tabular-nums">
                    <span>{item.arrTime}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Button: Lihat Jadwal Lengkap */}
      <div className="pt-3 mt-1 border-t border-border-subtle/40 flex items-center justify-between gap-3">
        <Link
          to="/jadwal-penerbangan"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/35 text-primary hover:bg-surface-light-blue hover:border-primary active:scale-95 font-bold text-xs sm:text-sm transition-all shadow-2xs group cursor-pointer"
        >
          <span>Lihat Jadwal Lengkap</span>
          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </Link>

        <span className="text-[11px] text-text-secondary hidden xs:inline sm:inline">
          *Handcarry &amp; Air Cargo Bergaransi
        </span>
      </div>

      {/* Flight Detail Modal Popup if a flight is clicked */}
      {selectedFlight && (
        <div
          className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedFlight(null)}
        >
          <div
            className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-5 sm:p-6 shadow-2xl border border-border-subtle space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">flight_takeoff</span>
                <h4 className="font-bold text-base text-on-surface">
                  Rincian Penerbangan {selectedFlight.flightCode}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFlight(null)}
                className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-text-secondary hover:text-on-surface cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40">
                <span className="text-text-secondary">Maskapai:</span>
                <span className="font-bold text-on-surface">{selectedFlight.airlineName} ({selectedFlight.flightCode})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40">
                <span className="text-text-secondary">Tanggal Berangkat:</span>
                <span className="font-bold text-primary">{formatFlightDate(selectedFlight.dayOffset)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40">
                <span className="text-text-secondary">Rute Bandara:</span>
                <span className="font-bold text-on-surface">{selectedFlight.depAirport} ➔ {selectedFlight.arrAirport}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40">
                <span className="text-text-secondary">Jadwal Waktu:</span>
                <span className="font-bold text-on-surface">{selectedFlight.depTime} JST ➔ {selectedFlight.arrTime} WIB</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40">
                <span className="text-text-secondary">Terminal:</span>
                <span className="font-semibold text-on-surface">{selectedFlight.terminal}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40">
                <span className="text-text-secondary">Sisa Bagasi Titipan:</span>
                <span className="font-bold text-success-text">{selectedFlight.remainingQuotaKg} kg Tersedia</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border-subtle/40 items-center">
                <span className="text-text-secondary">Radar Pesawat:</span>
                <a
                  href={`https://www.flightradar24.com/data/flights/${selectedFlight.flightCode.toLowerCase()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Live di FlightRadar24</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <Link
                to="/jadwal-penerbangan"
                onClick={() => setSelectedFlight(null)}
                className="flex-1 py-2.5 bg-surface-light-blue text-primary border border-primary/30 rounded-xl font-bold text-xs text-center hover:bg-primary/10 transition-colors"
              >
                Semua Jadwal
              </Link>
              <a
                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                  `Halo Admin MapahJastip, saya mau titip belanjaan untuk penerbangan ${selectedFlight.flightCode} (${formatFlightDate(
                    selectedFlight.dayOffset
                  )}). Apakah kuota bagasi masih bisa?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-xs text-center hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px]">send</span>
                <span>Booking Titip</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
