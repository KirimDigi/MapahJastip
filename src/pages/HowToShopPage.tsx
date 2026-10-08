import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OmotenashiFlow } from '../components/guide/OmotenashiFlow';
import { useExchangeRate } from '../context/ExchangeRateContext';
import { generateGeneralConsultationUrl } from '../utils/whatsapp';

export const HowToShopPage: React.FC = () => {
  const { rate } = useExchangeRate();
  const [trackNumber, setTrackNumber] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  const handleSimulateTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackNumber.trim()) {
      setTrackResult('Silakan masukkan nomor resi atau ID order Anda.');
      return;
    }
    setTrackResult(
      `Status Resi #${trackNumber}: Paket Batch #48 sedang transit di Haneda Tokyo Hub (QC Check lolos). Dijadwalkan terbang menuju Jakarta CGK pada 28 Maret.`
    );
  };

  return (
    <div className="w-full bg-surface pb-16">
      {/* Top Banner / Scrim Header */}
      <section className="relative w-full bg-surface-container-low overflow-hidden py-12 px-6 lg:px-12 border-b border-border-subtle">
        <div className="absolute -right-20 -top-24 w-96 h-96 rounded-full bg-surface-container-highest/60 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-surface-light-blue/80 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light-blue text-primary shadow-xs border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="font-label-sm text-xs font-semibold tracking-wide uppercase">
                  Alur Mudah &amp; Transparan
                </span>
              </div>
              <h1 className="font-headline-lg text-4xl lg:text-headline-lg text-on-surface tracking-tight leading-tight">
                Cara Kerja &amp; Alur Titip Belanja dari Jepang
              </h1>
              <p className="font-body-lg text-body-lg text-text-secondary leading-relaxed">
                Hanya butuh 4 langkah mudah dari request barang hingga paket tiba dengan selamat di depan pintu rumah Anda tanpa kerumitan bea cukai.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#tracking-widget"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-sm shadow-md hover:bg-primary-dark transition-all font-semibold"
                >
                  <span className="material-symbols-outlined text-[20px]">search_check</span>
                  Lacak Pesanan Anda
                </a>
                <a
                  href="#langkah-belanja"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-lowest text-primary font-label-md text-sm shadow-xs hover:bg-surface-light-blue transition-all border border-border-subtle font-semibold"
                >
                  <span className="material-symbols-outlined text-[20px]">explore</span>
                  Pelajari 4 Langkah
                </a>
              </div>
            </div>

            {/* Metric Snapshot Bento Card */}
            <div className="w-full lg:w-96 bg-surface-container-lowest p-6 rounded-2xl shadow-md border border-border-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">flight_takeoff</span>
                  <span className="font-title-md text-title-md text-on-surface font-bold">
                    Batch Tokyo Terjadwal
                  </span>
                </div>
                <span className="font-label-sm text-xs px-2.5 py-0.5 rounded-full bg-success-bg text-success-text font-bold">
                  Slot Terbuka
                </span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl space-y-1.5 border border-border-subtle/50 text-xs">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Next Flight NRT ➔ CGK</span>
                  <span className="font-price-md font-bold text-on-surface">28 Maret 2025</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Batas Submit Request</span>
                  <span className="font-semibold text-warning-text">26 Mar, 20:00 WIB</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">currency_yen</span>
                  <span>Kurs Kunci Hari Ini:</span>
                </div>
                <span className="font-price-md font-bold text-primary">
                  1 JPY = Rp {rate.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps Omotenashi Flow */}
      <OmotenashiFlow />

      {/* Trust & Guarantee Deep Dive Section */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-surface-light-blue text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">lock_reset</span>
            </div>
            <h3 className="font-title-md text-lg text-on-surface font-bold">
              Transparansi Kurs Terkunci
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Kurs yang disepakati saat Anda mentransfer DP adalah kurs final yang dikunci. Tidak ada biaya siluman karena fluktuasi mata uang Yen.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-surface-light-blue text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">receipt</span>
            </div>
            <h3 className="font-title-md text-lg text-on-surface font-bold">
              Bukti Struk Pembelian Fisik
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Setiap barang belanjaan selalu dilampirkan bukti register struk kasir asli toko Jepang, memastikan keaslian produk 100%.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-surface-light-blue text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">package_2</span>
            </div>
            <h3 className="font-title-md text-lg text-on-surface font-bold">
              Kemasan Standar Logistik Tokyo
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Bubble wrap 3 lapis, pelindung sudut kotak figur (corner guard), serta penanganan khusus snack mudah hancur.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Simulation Widget */}
      <section className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-10" id="tracking-widget">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-border-subtle shadow-md space-y-6">
          <div className="space-y-1 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-light-blue text-primary text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px]">radar</span>
              Simulasi Pelacakan Pengiriman
            </div>
            <h2 className="font-headline-sm text-2xl text-on-surface font-bold">
              Lacak Status Titipanmu Real-Time
            </h2>
            <p className="text-sm text-text-secondary">
              Ketikkan nomor invoice / nomor pesanan titipanmu (misal: <code>MPJ-48-901</code>)
            </p>
          </div>

          <form onSubmit={handleSimulateTrack} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={trackNumber}
              onChange={(e) => setTrackNumber(e.target.value)}
              placeholder="Masukkan No. Resi atau ID Titipan (mis: MPJ-48-901)"
              className="flex-1 px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle/50"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-primary-container text-white font-label-md rounded-xl hover:bg-primary-dark transition-colors shadow-sm font-semibold flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>Cek Status</span>
            </button>
          </form>

          {trackResult && (
            <div className="p-4 bg-surface-soft-blue rounded-2xl border border-border-subtle text-sm text-on-surface leading-relaxed animate-fadeIn flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                info
              </span>
              <div>
                <p className="font-semibold text-primary mb-1">Hasil Pelacakan Titipan</p>
                <p>{trackResult}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        <div className="bg-gradient-to-r from-surface-light-blue to-surface-container-highest p-8 rounded-3xl border border-border-subtle flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-headline-sm text-xl text-on-surface font-bold">
              Sudah Siap Menitip Barang Impianmu?
            </h3>
            <p className="text-sm text-text-secondary">
              Konsultasikan langsung dengan shopper kami di Tokyo secara gratis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/estimasi"
              className="px-5 py-3 bg-surface-container-lowest text-primary rounded-xl font-label-md hover:bg-white transition-all border border-border-subtle font-semibold shadow-xs"
            >
              Kalkulator Biaya
            </Link>
            <a
              href={generateGeneralConsultationUrl()}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-primary-container text-white rounded-xl font-label-md hover:bg-primary-dark transition-all shadow-sm font-semibold flex items-center gap-2"
            >
              <span>Hubungi Shopper</span>
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
