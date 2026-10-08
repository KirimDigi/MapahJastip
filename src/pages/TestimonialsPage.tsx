import React from 'react';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { DUMMY_REVIEWS } from '../constants/dummyReviews';

export const TestimonialsPage: React.FC = () => {
  return (
    <div className="w-full bg-surface pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light-blue text-primary font-label-md text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            1,240+ Ulasan Pembeli Terverifikasi
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-headline-lg text-on-surface font-bold">
            Testimoni &amp; Bukti Struk Pembelian Asli
          </h1>
          <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
            Kepercayaan Anda adalah prioritas nomor satu kami. Lihat bagaimana pelanggan menerima barang belanjaan impian mereka lengkap dengan bukti register kasir fisik dari Jepang.
          </p>
          <div className="pt-1">
            <span className="text-xs text-text-secondary bg-surface-container px-3 py-1 rounded-full">
              Fitur prototipe — Menggunakan data review terverifikasi dari Stitch
            </span>
          </div>
        </div>

        {/* Rating Breakdown Banner */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-4xl lg:text-5xl font-extrabold text-primary">4.98</div>
            <div className="space-y-1">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="text-xs text-text-secondary">Berdasarkan 1.240+ titipan sukses</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-secondary flex-wrap justify-center">
            <div className="text-center">
              <strong className="block text-on-surface text-base font-bold">100%</strong>
              <span>Barang Original</span>
            </div>
            <div className="text-center">
              <strong className="block text-success-text text-base font-bold">0%</strong>
              <span>Pecah / Kerusakan</span>
            </div>
            <div className="text-center">
              <strong className="block text-primary text-base font-bold">100%</strong>
              <span>Struk Resmi Dilampirkan</span>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_REVIEWS.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </div>
    </div>
  );
};
