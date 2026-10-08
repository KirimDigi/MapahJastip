import React, { useState } from 'react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah ada batasan minimal nilai belanja?',
    answer:
      'Tidak ada minimal belanja! Anda bisa menitip barang satuan seperti gantungan kunci seharga ¥500 atau pesanan kosmetik tunggal. Fee disesuaikan secara proporsional sesuai berat dan kategori barang.',
  },
  {
    id: 'faq-2',
    question: 'Bagaimana jika barang yang dititipkan habis atau out of stock?',
    answer:
      'Shopper kami akan mengabari langsung melalui WhatsApp secara real-time dan memberikan opsi alternatif barang serupa di toko fisik lainnya. Apabila Anda tidak berkenan, dana deposit pembelian barang akan di-refund 100% tanpa potongan biaya apapun dalam waktu 1x24 jam.',
  },
  {
    id: 'faq-3',
    question: 'Apakah bisa bantu bidding lelang di Mercari atau Yahoo Auction?',
    answer:
      'Bisa banget! Tim concierge kami memiliki akun terverifikasi bintang 5 di Mercari JP dan Yahoo Auctions. Kami akan mengecek reputasi seller Jepang tersebut terlebih dahulu sebelum melakukan penawaran untuk memastikan transaksi aman.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana dengan perhitungan bea cukai dan pajak impornya?',
    answer:
      'Semua paket dikirim melalui jalur kargo resmi berizin kepabeanan Indonesia dengan pelunasan Bea Masuk, PPN, dan PPh impor resmi. Biaya yang tertera pada invoice MapahJastip sudah all-in hingga gudang Jakarta, jadi Anda tidak perlu khawatir ditagih pajak susulan di rumah.',
  },
  {
    id: 'faq-5',
    question: 'Apakah saya bisa menitip barang cair, parfum, atau snack mudah hancur?',
    answer:
      'Bisa! Kami menyediakan kemasan protektif standar Jepang seperti bubble wrap tebal berlapis dan Armor Box dengan corner guard agar kotak makanan dan kosmetik cair tetap utuh tidak bocor saat penerbangan.',
  },
];

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-3.5 max-w-3xl mx-auto w-full">
      {FAQ_DATA.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-border-subtle/80 cursor-pointer transition-all hover:border-primary/40"
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                {item.question}
              </h3>
              <span
                className={`material-symbols-outlined text-text-secondary transition-transform duration-300 text-[22px] shrink-0 ${
                  isOpen ? 'rotate-180 text-primary' : ''
                }`}
              >
                expand_more
              </span>
            </div>
            {isOpen && (
              <div className="pt-3 text-body-md text-text-secondary leading-relaxed border-t border-border-subtle/40 mt-3 animate-fadeIn">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
