import React from 'react';

export const OmotenashiFlow: React.FC = () => {
  const steps = [
    {
      icon: 'shopping_bag',
      title: 'Pilih Produk',
      desc: 'Cari produk yang ingin kamu titip.',
      isHighlight: false,
    },
    {
      icon: 'luggage',
      title: 'Pilih Metode',
      desc: 'Handcarry, Bagasi atau Cargo.',
      isHighlight: false,
    },
    {
      icon: 'local_shipping',
      title: 'Lakukan Pembayaran',
      desc: 'Transfer / E-wallet.',
      isHighlight: false,
    },
    {
      icon: 'inventory_2',
      title: 'Kami Belanjakan & Kirim',
      desc: 'Pantau status di akun kamu.',
      isHighlight: true,
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-12 py-8 sm:py-14" id="langkah-belanja">
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 border border-border-subtle/80 shadow-xs space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface tracking-tight">
            Cara Order di <span className="text-primary">MapahJastip.id</span>
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 font-medium">
            Mudah, aman, dan transparan.
          </p>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((st, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              {/* Step Icon Circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50/80 border border-blue-100 flex items-center justify-center text-primary shadow-xs group-hover:scale-105 group-hover:bg-blue-100/70 transition-all duration-300 mb-3.5">
                <span className="material-symbols-outlined text-[32px] sm:text-[40px] text-primary">
                  {st.icon}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 max-w-[200px]">
                <h3
                  className={`font-bold text-sm sm:text-base leading-snug ${
                    st.isHighlight ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {st.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {/* Connector Arrow (Visible between items on Desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-7 -right-3 sm:-right-4 text-primary/40 pointer-events-none">
                  <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


