import React from 'react';
import { Link } from 'react-router-dom';

export const ValueProps: React.FC = () => {
  const pillars = [
    {
      icon: 'receipt_long',
      title: 'Struk Pembelian Asli & Legal',
      description:
        'Setiap pesanan dilengkapi bukti kasir fisik (receipt) resmi dari boutique atau store Jepang asli. Jaminan mutlak original tanpa barang tiruan.',
      ctaText: 'Foto Struk Dikirim ke Chat',
      link: '/cara-kerja',
    },
    {
      icon: 'category',
      title: 'Bisa Request Barang Apapun',
      description:
        'Skincare musiman, snack viral, anime merchandise langka di Nakano Broadway, hingga lelang Mercari & Yahoo Auction bisa kami bantu belikan.',
      ctaText: 'Kirim Link / Foto Barang',
      link: '/konsultasi-shopper',
    },
    {
      icon: 'currency_exchange',
      title: 'Transparansi Biaya & Kalkulator Jelas',
      description:
        'Tidak ada biaya tersembunyi tiba-tiba di akhir. Kurs harian transparan, kalkulasi fee jastip dan ongkir per gram tertera sebelum Anda transfer.',
      ctaText: 'Simulasi Biaya Otomatis',
      link: '/estimasi',
    },
    {
      icon: 'inventory_2',
      title: 'Packing Ekstra Standar Jepang',
      description:
        'Standar perlindungan kargo ketat: bubble wrap ganda berlapis, corner protector anti peyok, serta boks kokoh menjamin snack dan figur Anda mulus.',
      ctaText: 'Garansi Aman Sampai',
      link: '/cara-kerja',
    },
  ];

  return (
    <section className="w-full py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="font-label-md text-label-md text-primary tracking-wide uppercase font-semibold">
            Mengapa Percayakan Belanja ke MapahJastip?
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Standar Concierge Jepang: Jujur, Tepat, dan Amanah
          </h2>
          <p className="font-body-md text-body-md text-text-secondary">
            Kami menjembatani keinginan Anda untuk memiliki barang eksklusif dari Jepang tanpa pusing bahasa, batasan pembayaran internasional, maupun prosedur kepabeanan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <Link
              key={idx}
              to={p.link}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 border border-border-subtle/70 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-surface-light-blue text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="font-body-md text-sm text-text-secondary leading-relaxed">
                  {p.description}
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1 pt-2">
                {p.ctaText}
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
