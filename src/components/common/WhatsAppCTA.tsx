import React from 'react';
import { Link } from 'react-router-dom';
import { generateGeneralConsultationUrl } from '../../utils/whatsapp';

export const WhatsAppCTA: React.FC = () => {
  return (
    <section className="w-full py-16 bg-surface-container-low">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="bg-gradient-to-br from-surface-light-blue via-surface-soft-blue to-surface-container-highest p-8 md:p-12 rounded-3xl shadow-md text-center space-y-6 relative overflow-hidden border border-border-subtle">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md font-semibold shadow-xs">
              <span className="material-symbols-outlined text-success text-[18px]">support_agent</span>
              Personal Concierge Siap Membantu
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Punya Barang Incaran dari Jepang Hari Ini?
            </h2>
            <p className="font-body-lg text-body-lg text-text-secondary leading-relaxed">
              Cukup kirim foto atau link barang ke Shopper kami. Dapatkan penawaran harga instan dengan kurs terbaik, bebas repot urus pengiriman internasional.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-container hover:bg-primary-dark text-on-primary-container font-label-md text-label-md rounded-xl shadow-[0_6px_20px_rgba(8,119,204,0.3)] transition-all transform hover:-translate-y-0.5"
              href={generateGeneralConsultationUrl()}
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-symbols-outlined text-[24px]">chat</span>
              <span>Hubungi Personal Shopper via WhatsApp</span>
            </a>
            <Link
              to="/estimasi"
              className="inline-flex items-center gap-2 px-6 py-4 bg-surface-container-lowest hover:bg-white text-on-surface font-label-md text-label-md rounded-xl shadow-xs transition-all border border-border-subtle"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">calculate</span>
              <span>Hitung Simulasi Harga</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-label-sm font-label-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-success text-[17px]">verified</span>
              Respon Cepat &lt; 15 Menit
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[17px]">receipt</span>
              Struk Belanja Asli
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-tertiary text-[17px]">lock</span>
              Transaksi Bebas Risiko
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
