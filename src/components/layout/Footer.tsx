import React from 'react';
import { Logo } from '../common/Logo';
import { generateGeneralConsultationUrl } from '../../utils/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-border-subtle shadow-[0_-1px_8px_rgba(18,59,120,0.04)] mt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
              Layanan Japanese personal shopper &amp; concierge tepercaya. Pengadaan barang orisinal, pelacakan live shopping transparan, dan jaminan keamanan regulasi impor resmi ke Indonesia.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-success-bg text-success-text font-label-sm text-label-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                Shopper On Duty: Tokyo Shibuya
              </span>
            </div>
          </div>

          {/* Col 2: Operational Hubs */}
          <div className="space-y-3">
            <span className="font-title-md text-title-md text-on-surface font-semibold block">
              Hub &amp; Kantor Operasional
            </span>
            <div className="space-y-2.5 font-body-sm text-body-sm text-text-secondary">
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-border-subtle/50">
                <p className="font-label-md text-label-md text-on-surface font-semibold mb-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  Tokyo Concierge Desk
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Shibuya-ku, Dogenzaka 1-Chome, Tokyo 150-0043, Japan
                </p>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-border-subtle/50">
                <p className="font-label-md text-label-md text-on-surface font-semibold mb-0.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">warehouse</span>
                  Jakarta Distribution Hub
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Kawasan Logistik Soewarna, Cengkareng, DKI Jakarta 19110
                </p>
              </div>
            </div>
          </div>

          {/* Col 3: Customer Service & Working Hours */}
          <div className="space-y-3">
            <span className="font-title-md text-title-md text-on-surface font-semibold block">
              Layanan Pelanggan &amp; WhatsApp
            </span>
            <p className="font-body-sm text-body-sm text-text-secondary">
              Konsultasi langsung dengan Shopper di Tokyo untuk cek ketersediaan stok toko fisik:
            </p>
            <div className="space-y-2.5">
              <a
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container-lowest hover:bg-surface-light-blue text-primary font-label-md text-label-md rounded-xl w-full border border-border-subtle transition-colors shadow-xs"
                href={generateGeneralConsultationUrl()}
                target="_blank"
                rel="noreferrer"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">chat</span>
                WhatsApp Concierge Direct
              </a>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-border-subtle/50 text-text-secondary font-body-sm text-body-sm">
                <p className="text-on-surface font-label-md text-label-md font-semibold mb-0.5">
                  Jam Operasional JST / WIB
                </p>
                <p className="text-xs">Senin - Minggu: 08:00 - 22:00 WIB (10:00 - 00:00 JST)</p>
              </div>
            </div>
          </div>

          {/* Col 4: Guarantees */}
          <div className="space-y-3">
            <span className="font-title-md text-title-md text-on-surface font-semibold block">
              Standar Garansi Jastip
            </span>
            <ul className="space-y-2.5 font-body-sm text-body-sm text-text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-success text-[18px] mt-0.5 shrink-0">
                  verified
                </span>
                <span>
                  <strong className="text-on-surface">100% Original:</strong> Pembelian langsung dari official boutique &amp; store Jepang.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                  shield
                </span>
                <span>
                  <strong className="text-on-surface">Aman &amp; Berasuransi:</strong> Proteksi kargo penuh dari Tokyo hingga ke alamat tujuan.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-tertiary-container text-[18px] mt-0.5 shrink-0">
                  receipt_long
                </span>
                <span>
                  <strong className="text-on-surface">Bukti Struk Asli:</strong> Dilengkapi register purchase receipt resmi untuk setiap barang.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-text-secondary font-label-sm text-label-sm flex-wrap">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Metode Pembayaran Resmi:
            </span>
            <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle">
              BCA
            </span>
            <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle">
              Mandiri
            </span>
            <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle">
              QRIS
            </span>
            <span className="px-2.5 py-1 bg-surface-container-lowest rounded-md font-price-md text-xs font-bold text-on-surface border border-border-subtle">
              Jenius
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary text-center md:text-right">
            &copy; {new Date().getFullYear()} MapahJastip.id. Hak Cipta Dilindungi Undang-Undang. PT Mapah Belanja Jepang.
          </p>
        </div>
      </div>
    </footer>
  );
};
