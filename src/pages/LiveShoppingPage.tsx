import React from 'react';
import { generateGeneralConsultationUrl } from '../utils/whatsapp';

export const LiveShoppingPage: React.FC = () => {
  const liveLocations = [
    {
      store: 'Bic Camera Shibuya Hachiko-mae',
      city: 'Tokyo',
      timeJst: '14:20 JST',
      status: 'Sedang Belanja di Kasir',
      items: 'Kamera digital, instax, skincare Rohto, tetes mata Santen FX',
      shopper: 'Dimas (Tokyo Hub)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX8AsZCHpHjnw56twWdzvZM_CB9cepAAVVjfHeSXfUjvkF4TqzBFcwE1tlvVwB65I9CAk8p0Nfa_cXLNejWT5mHENCedxlnc8VB8ZvP-bimSqwiXO54lW-Ad5tb6eiAvW7sNvQyDXuVddd0kfB0rAbcxGumsz-LOq9rCzIaR0BoB85Sxgas3m45Tx7W6SNfDyNMs-n7_sVQrSuW9q8wov7GhIlqglr6uIiCtC7vGzsokyQ_SIGtZo9',
    },
    {
      store: 'Jump Shop Tokyo Dome City',
      city: 'Tokyo',
      timeJst: '16:00 JST (Terjadwal)',
      status: 'Antrian Masuk Toko',
      items: 'Limited Acrylic Stand Jujutsu Kaisen, One Piece Card Game',
      shopper: 'Dimas (Tokyo Hub)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX8AsZCHpHjnw56twWdzvZM_CB9cepAAVVjfHeSXfUjvkF4TqzBFcwE1tlvVwB65I9CAk8p0Nfa_cXLNejWT5mHENCedxlnc8VB8ZvP-bimSqwiXO54lW-Ad5tb6eiAvW7sNvQyDXuVddd0kfB0rAbcxGumsz-LOq9rCzIaR0BoB85Sxgas3m45Tx7W6SNfDyNMs-n7_sVQrSuW9q8wov7GhIlqglr6uIiCtC7vGzsokyQ_SIGtZo9',
    },
    {
      store: 'Don Quijote Dotonbori',
      city: 'Osaka',
      timeJst: 'Batch #49 (Next Week)',
      status: 'Menunggu Kloter',
      items: 'KitKat Matcha Uji, Snack Ichiran Ramen, Kosmetik Canmake',
      shopper: 'Rina (Kansai Hub)',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAelsEhjQAkzLtYISd1jVD-quAIqjF3ObWurhEbsExi3HoDJapi3E_RTvV5LJ6uB9OWLbnyI_uKcjqXuTK1H4VGt11pLIzIUbcKI0PWsd5lcXg8fbaKL83LuiKwCvADQlB8DBzgSlU0ATS2aPNdqpxHCJ3jCifL8CYdU0ZvuDK2hYZj_ZitSeVn8jLQjMjoSP5sCasT9RljVuFQw6zI0MMqRMNMac1OE8x6BHG8RXQrUPWLQow-9M0p',
    },
  ];

  return (
    <div className="w-full bg-surface pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light-blue text-primary font-label-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            Live Shopping Coverage Tokyo &amp; Osaka
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl lg:text-headline-lg text-on-surface font-bold">
            Live Belanja Langsung dari Jepang
          </h1>
          <p className="font-body-md text-body-md text-text-secondary leading-relaxed">
            Ikuti perjalanan belanja personal shopper kami langsung di toko fisik Tokyo &amp; Osaka. Kamu bisa titip saat shopper sedang berada di toko secara real-time!
          </p>
          <div className="pt-1">
            <span className="text-xs text-text-secondary bg-surface-container px-3 py-1 rounded-full">
              Fitur prototipe — Menggunakan simulasi data real-time Stitch
            </span>
          </div>
        </div>

        {/* Live Shopper Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveLocations.map((loc, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle shadow-sm space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-surface-light-blue px-2.5 py-1 rounded-full">
                    {loc.city} • {loc.timeJst}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-text bg-success-bg px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    {loc.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-title-md text-lg text-on-surface font-bold">
                    {loc.store}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Target buruan: <strong className="text-on-surface">{loc.items}</strong>
                  </p>
                </div>

                <div className="p-3 bg-surface-soft-blue rounded-xl flex items-center gap-3 border border-border-subtle/50">
                  <img
                    src={loc.avatar}
                    alt={loc.shopper}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <span className="text-xs font-bold text-on-surface block">{loc.shopper}</span>
                    <span className="text-[11px] text-text-secondary">On-Duty Concierge</span>
                  </div>
                </div>
              </div>

              <a
                href={generateGeneralConsultationUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-primary-container text-white rounded-xl font-label-md text-sm hover:bg-primary-dark transition-colors shadow-xs text-center font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Titip di Toko Ini via WA
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
