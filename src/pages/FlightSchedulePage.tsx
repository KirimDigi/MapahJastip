import React, { useState, useEffect } from 'react';
import { FlightScheduleCard } from '../components/flights/FlightScheduleCard';
import { generateResellerRegistrationUrl } from '../utils/whatsapp';
import { formatIdr } from '../utils/currency';

export const FlightSchedulePage: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
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

  return (
    <div className="w-full bg-surface min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-[16px] animate-pulse">flight_takeoff</span>
            <span>JADWAL PENERBANGAN REAL-TIME</span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-4xl font-extrabold text-on-surface">
            Jadwal Penerbangan
          </h1>
          <p className="font-body-md text-text-secondary text-sm sm:text-base max-w-3xl">
            Update jadwal terbaru untuk pengadaan barang dan pengiriman jastip.
          </p>

          {/* Time Sync Badges */}
          <div className="inline-flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-surface-container-low border border-border-subtle flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              <span className="text-text-secondary">Waktu Tokyo (JST):</span>
              <strong className="text-on-surface font-mono">{jstTime}</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-surface-container-low border border-border-subtle flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-text-secondary">Waktu Jakarta (WIB):</span>
              <strong className="text-primary font-mono">{wibTime}</strong>
            </div>
          </div>
        </div>

        {/* Main Grid: Card Table on Left + Info Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <FlightScheduleCard />
          </div>

          {/* Right Column: Program Reseller Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-7 border border-border-subtle shadow-md space-y-5">
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">groups</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-on-surface">Program Reseller</h3>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    Dapatkan harga khusus dan keuntungan lebih banyak!
                  </p>
                </div>
              </div>

              {/* Benefits Checklist */}
              <ul className="space-y-2.5 text-xs text-on-surface">
                {[
                  'Harga reseller lebih murah',
                  'Bisa jual kembali (untung sendiri)',
                  'Tanpa minimum order',
                  'Akses produk lebih lengkap',
                  'Support materi promosi',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </span>
                    <span className="font-medium text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button: Daftar Reseller Sekarang -> WhatsApp */}
              <a
                href={generateResellerRegistrationUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <span>Daftar Reseller Sekarang</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>

              {/* Price Comparison Table */}
              <div className="pt-2 space-y-2.5 border-t border-border-subtle/80">
                <h4 className="font-bold text-xs sm:text-sm text-on-surface">Perbandingan Harga</h4>
                <div className="overflow-x-auto rounded-xl border border-border-subtle text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-text-secondary text-[11px] border-b border-border-subtle font-semibold">
                        <th className="py-2.5 px-3">Produk</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap">Harga Normal</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap">Harga Reseller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/50 bg-surface-container-lowest">
                      {[
                        {
                          name: 'Onitsuka Tiger Mexico 66',
                          normalPrice: 2057000,
                          resellerPrice: 1850000,
                        },
                        {
                          name: 'SK-II Facial Treatment 230ml',
                          normalPrice: 2493000,
                          resellerPrice: 2250000,
                        },
                        {
                          name: 'Tokyo Banana Classic 8 Pcs',
                          normalPrice: 175000,
                          resellerPrice: 150000,
                        },
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-low/40 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-on-surface">
                            {item.name}
                          </td>
                          <td className="py-2.5 px-3 text-right text-text-secondary whitespace-nowrap font-medium">
                            {formatIdr(item.normalPrice)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-rose-600 whitespace-nowrap">
                            {formatIdr(item.resellerPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
