import React, { useState } from 'react';
import { generateWhatsAppUrl } from '../utils/whatsapp';

export const ConsultationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [itemQuery, setItemQuery] = useState('');
  const [storeLocation, setStoreLocation] = useState('Tokyo (Shibuya/Ginza/Akihabara)');
  const [notes, setNotes] = useState('');

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Halo Personal Shopper MapahJastip,\nSaya ${name || 'Pelanggan'} ingin konsultasi titipan:\n\n` +
      `• Barang / Link: ${itemQuery || '-'}\n` +
      `• Area Pencarian: ${storeLocation}\n` +
      `• Catatan Tambahan: ${notes || '-'}\n\n` +
      `Bisa dibantu cek ketersediaan dan estimasi harganya kak? Terima kasih!`;
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="w-full bg-surface pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-10 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light-blue text-primary font-label-md text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">support_agent</span>
            100% Gratis Tanpa Komitmen
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface font-bold">
            Konsultasi Gratis / Hubungi Personal Shopper
          </h1>
          <p className="font-body-md text-body-md text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Ingin titip barang yang tidak ada di katalog? Bingung mencari ukuran sepatu, lelang Mercari, atau ketersediaan di toko fisik Tokyo? Diskusikan langsung dengan tim concierge kami!
          </p>
        </div>

        {/* Shopper Profiles Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-xs flex items-center gap-4">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX8AsZCHpHjnw56twWdzvZM_CB9cepAAVVjfHeSXfUjvkF4TqzBFcwE1tlvVwB65I9CAk8p0Nfa_cXLNejWT5mHENCedxlnc8VB8ZvP-bimSqwiXO54lW-Ad5tb6eiAvW7sNvQyDXuVddd0kfB0rAbcxGumsz-LOq9rCzIaR0BoB85Sxgas3m45Tx7W6SNfDyNMs-n7_sVQrSuW9q8wov7GhIlqglr6uIiCtC7vGzsokyQ_SIGtZo9"
                alt="Shopper Dimas"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-success-text uppercase block">Live di Tokyo</span>
              <h3 className="font-title-md text-base text-on-surface font-bold">Shopper Dimas</h3>
              <p className="text-xs text-text-secondary">Spesialis Anime, Fashion Streetwear &amp; Ginza Boutiques</p>
            </div>
          </div>

          <div className="p-5 bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-xs flex items-center gap-4">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAelsEhjQAkzLtYISd1jVD-quAIqjF3ObWurhEbsExi3HoDJapi3E_RTvV5LJ6uB9OWLbnyI_uKcjqXuTK1H4VGt11pLIzIUbcKI0PWsd5lcXg8fbaKL83LuiKwCvADQlB8DBzgSlU0ATS2aPNdqpxHCJ3jCifL8CYdU0ZvuDK2hYZj_ZitSeVn8jLQjMjoSP5sCasT9RljVuFQw6zI0MMqRMNMac1OE8x6BHG8RXQrUPWLQow-9M0p"
                alt="Shopper Rina"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-success-text uppercase block">Live di Osaka &amp; Kyoto</span>
              <h3 className="font-title-md text-base text-on-surface font-bold">Shopper Rina</h3>
              <p className="text-xs text-text-secondary">Spesialis Skincare Jepang, Snack Uji Matcha &amp; Lifestyle Goods</p>
            </div>
          </div>
        </div>

        {/* Quick Consultation Form */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-border-subtle shadow-md space-y-6">
          <div className="space-y-1">
            <h2 className="font-headline-sm text-xl text-on-surface font-bold">
              Formulir Permintaan Titip Barang
            </h2>
            <p className="text-xs text-text-secondary">
              Isi rincian di bawah ini, lalu klik tombol untuk langsung terhubung dengan WhatsApp Shopper kami.
            </p>
          </div>

          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface block" htmlFor="c-name">
                  Nama Kamu
                </label>
                <input
                  id="c-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Dinda Pratiwi"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface block" htmlFor="c-location">
                  Target Lokasi Belanja
                </label>
                <select
                  id="c-location"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle/50 cursor-pointer"
                >
                  <option value="Tokyo (Shibuya/Ginza/Akihabara)">Tokyo (Shibuya/Ginza/Akihabara)</option>
                  <option value="Osaka (Dotonbori/Shinsaibashi)">Osaka (Dotonbori/Shinsaibashi)</option>
                  <option value="Kyoto Traditional Goods">Kyoto Traditional Goods</option>
                  <option value="Online (Amazon JP / Rakuten / Mercari)">Online (Amazon JP / Rakuten / Mercari)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block" htmlFor="c-query">
                Nama Barang, Merek, atau Link URL Produk
              </label>
              <textarea
                id="c-query"
                rows={3}
                required
                value={itemQuery}
                onChange={(e) => setItemQuery(e.target.value)}
                placeholder="Misal: Sepatu Onitsuka Tiger Nippon Made size 42, atau link dari Mercari JP..."
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface block" htmlFor="c-notes">
                Catatan Tambahan (Varian warna, size alternatif, dll)
              </label>
              <input
                id="c-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Kalau warna navy habis boleh warna putih"
                className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-success hover:bg-success-text text-white font-label-md rounded-xl shadow-md transition-all font-bold flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>Kirim Permintaan ke WhatsApp Shopper</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
