import React from 'react';

export const OmotenashiFlow: React.FC = () => {
  const steps = [
    {
      kanji: '一',
      stepNumber: 'Langkah 01',
      title: 'Kirim Link / Foto Barang',
      description:
        'Kirimkan tautan e-commerce Jepang (Amazon JP, Rakuten, Mercari, Yahoo Auction) atau snapshot etalase toko fisik (Don Quijote, Matsumoto Kiyoshi, Pokemon Center).',
      highlightTitle: 'Cek Stok & Kalkulasi',
      highlightDesc: 'Shopper memvalidasi keaslian, ketersediaan, dan mengunci estimasi harga All-in.',
      progressWidth: 'w-1/4',
    },
    {
      kanji: '二',
      stepNumber: 'Langkah 02',
      title: 'Konfirmasi & Pembayaran DP',
      description:
        'Setelah rincian disepakati, bayar DP 50% atau pelunasan penuh melalui rekening terverifikasi (BCA, Mandiri, Virtual Account, atau QRIS instan).',
      highlightTitle: 'Proteksi Kurs Terkunci',
      highlightDesc: 'Nilai tukar JPY ke IDR dikunci tetap saat pembayaran. Tidak ada biaya siluman fluktuasi valuta.',
      progressWidth: 'w-2/4',
    },
    {
      kanji: '三',
      stepNumber: 'Langkah 03',
      title: 'Belanja Langsung di Jepang',
      description:
        'Personal shopper kami mendatangi lokasi resmi di Tokyo atau checkout pesanan toko online dengan verifikasi struk resmi bersegel kasir Jepang.',
      highlightTitle: 'Live Photo & Bukti Struk',
      highlightDesc: 'Foto barang di rak toko fisik dan register receipt resmi dikirim langsung ke WhatsApp Anda.',
      progressWidth: 'w-3/4',
    },
    {
      kanji: '四',
      stepNumber: 'Langkah 04',
      title: 'Packing Ekstra & Kirim ke Rumah',
      description:
        'Barang dipacking dengan standar kargo Jepang (bubble wrap ganda & corner box guard), lalu diterbangkan dan dikirim ke depan pintu Anda.',
      highlightTitle: 'Resi Domestik Aman',
      highlightDesc: 'Paket diteruskan via kurir Paxel / JNE dengan asuransi kargo penuh bebas risiko.',
      progressWidth: 'w-full',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16" id="langkah-belanja">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="font-label-md text-label-md text-tertiary-container uppercase tracking-wider block mb-1 font-bold">
            Panduan Alur Layanan
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Proses 4 Langkah Omotenashi
          </h2>
        </div>
        <p className="font-body-md text-body-md text-text-secondary max-w-md">
          Setiap pesanan diawasi personal shopper bersertifikasi dengan standar kehati-hatian khas logistik Jepang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((st, i) => (
          <div
            key={i}
            className="group relative bg-surface-container-lowest rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-border-subtle/80 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-xl bg-surface-light-blue text-primary font-headline-md text-xl flex items-center justify-center font-bold border border-border-subtle">
                  {st.kanji}
                </span>
                <span className="font-label-sm text-label-sm text-text-secondary uppercase tracking-widest font-semibold">
                  {st.stepNumber}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-headline-sm text-lg text-on-surface font-bold group-hover:text-primary transition-colors">
                  {st.title}
                </h3>
                <p className="font-body-sm text-xs text-text-secondary leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl text-text-secondary font-body-sm space-y-1 border border-border-subtle/50">
                <p className="font-label-sm text-xs text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[15px]">verified</span>
                  {st.highlightTitle}
                </p>
                <p className="text-[11px] leading-relaxed">{st.highlightDesc}</p>
              </div>
            </div>

            <div className="pt-2 mt-auto">
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className={`bg-primary h-full rounded-full ${st.progressWidth}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
