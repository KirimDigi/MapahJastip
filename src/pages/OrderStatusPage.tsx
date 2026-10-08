import React, { useState } from 'react';
import { generateWhatsAppUrl } from '../utils/whatsapp';

interface TrackingStep {
  title: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
  desc: string;
  location?: string;
}

interface OrderTrackingData {
  orderNumber: string;
  batchName: string;
  origin: string;
  destination: string;
  flightCode: string;
  flightRoute: string;
  carrier: string;
  radarUrl: string;
  flightStatus: string;
  flightProgressPercent: number;
  estArrival: string;
  items: string;
  customerName: string;
  customerCity: string;
  steps: TrackingStep[];
}

const SAMPLE_ORDERS: Record<string, OrderTrackingData> = {
  'MPJ-OSK-049': {
    orderNumber: 'MPJ-OSK-049',
    batchName: 'Batch #49 Kansai (Osaka & Kyoto)',
    origin: 'Osaka (KIX)',
    destination: 'Jakarta (CGK)',
    flightCode: 'GA889',
    flightRoute: 'Kansai Intl (KIX) ➔ Soekarno Hatta (CGK)',
    carrier: 'Garuda Indonesia Cargo Direct',
    radarUrl: 'https://www.flightradar24.com/data/flights/ga889',
    flightStatus: 'In Flight (Sedang Mengudara)',
    flightProgressPercent: 68,
    estArrival: 'Hari ini, 16:25 WIB',
    items: 'Glico Dotonbori Limited, Matcha Uji Kyoto, Onitsuka Tiger Osaka Special, Skincare Hada Labo',
    customerName: 'Rizky Pratama',
    customerCity: 'Surabaya (Transit CGK)',
    steps: [
      {
        title: 'Pesanan Dikonfirmasi & Kurs JPY Dikunci',
        date: '28 Mar 2025, 10:15 WIB',
        status: 'completed',
        location: 'Sistem MapahJastip',
        desc: 'Pembayaran DP 50% berhasil diverifikasi. Kurs yen dikunci tanpa biaya selisih kurs tambahan.',
      },
      {
        title: 'Pembelian di Toko Fisik Osaka & Struk Kasir Terbit',
        date: '29 Mar 2025, 14:30 JST',
        location: 'Shinsaibashi & Dotonbori, Osaka',
        status: 'completed',
        desc: 'Personal shopper telah menyelesaikan pembelian langsung di official store Osaka. Salinan struk kasir asli telah diunggah ke manifes.',
      },
      {
        title: 'Quality Check & Armor Box di Kansai Hub (Rinku Town)',
        date: '30 Mar 2025, 18:00 JST',
        location: 'Kansai Air Cargo Logistics Hub',
        status: 'completed',
        desc: 'Barang melewati inspeksi fisik, dibungkus bubble wrap lapis 3, diberi corner guard pelindung sudut, dan disegel tamper-evident.',
      },
      {
        title: 'Air Cargo In Flight: Kansai (KIX) ➔ Soekarno Hatta (CGK)',
        date: '31 Mar 2025, 11:00 JST (Takeoff)',
        location: 'Kansai Intl Airport (KIX) - Runway 06R',
        status: 'current',
        desc: 'Kargo telah masuk manifes penerbangan GA889. Pesawat sedang mengudara menuju Jakarta dengan perkiraan mendarat pukul 16:25 WIB.',
      },
      {
        title: 'Customs Clearance & Jalur Hijau Bea Cukai CGK',
        date: '1 Apr 2025 (Estimasi)',
        location: 'Terminal Kargo Lini 1 Soekarno-Hatta (CGK)',
        status: 'pending',
        desc: 'Administrasi kargo impor resmi terdaftar dan pemeriksaan dokumen kepabeanan kepatuhan regulasi.',
      },
      {
        title: 'Diserahkan ke Kurir Domestik (Paxel / JNE YES)',
        date: '2 Apr 2025 (Estimasi)',
        location: 'Distribution Hub Cengkareng ➔ Alamat Anda',
        status: 'pending',
        desc: 'Paket diserahkan ke jasa kurir lokal untuk diantarkan langsung ke alamat pembeli lengkap dengan nomor resi domestik.',
      },
    ],
  },
  'MPJ-48-901': {
    orderNumber: 'MPJ-48-901',
    batchName: 'Batch #48 Tokyo Spring',
    origin: 'Tokyo (HND)',
    destination: 'Jakarta (CGK)',
    flightCode: 'NH855',
    flightRoute: 'Tokyo Haneda (HND) ➔ Soekarno Hatta (CGK)',
    carrier: 'All Nippon Airways (ANA Cargo)',
    radarUrl: 'https://www.flightradar24.com/data/flights/nh855',
    flightStatus: 'Landed at CGK (Tiba di Jakarta)',
    flightProgressPercent: 100,
    estArrival: 'Telah Mendarat',
    items: 'Onitsuka Tiger Mexico 66 SD + Rohto Melano CC',
    customerName: 'Dinda Pratiwi',
    customerCity: 'Jakarta Selatan',
    steps: [
      {
        title: 'Pesanan Dikonfirmasi & DP Diterima',
        date: '24 Mar 2025, 14:10 WIB',
        status: 'completed',
        location: 'MapahJastip HQ',
        desc: 'DP 50% telah diverifikasi. Kurs acuan live dikunci.',
      },
      {
        title: 'Pembelian di Toko Tokyo & Struk Kasir Terbit',
        date: '25 Mar 2025, 11:30 JST',
        location: 'Bic Camera & Shibuya Parco',
        status: 'completed',
        desc: 'Shopper Dimas telah membeli produk di Bic Camera Akihabara. Foto struk resmi tersedia.',
      },
      {
        title: 'Quality Check & Bubble Wrapping di Hub Tokyo',
        date: '26 Mar 2025, 17:00 JST',
        location: 'Tokyo Shibuya Logistics Desk',
        status: 'completed',
        desc: 'Barang dibungkus 3 lapis bubble wrap dengan corner box protector.',
      },
      {
        title: 'In Flight: Tokyo Haneda (HND) ➔ Soekarno Hatta (CGK)',
        date: '27 Mar 2025, 10:15 JST',
        location: 'Tokyo Haneda (HND)',
        status: 'completed',
        desc: 'Penerbangan All Nippon Airways NH855 telah mendarat dengan selamat di Soekarno Hatta pukul 16:30 WIB.',
      },
      {
        title: 'Customs Clearance & Hub Distribusi Cengkareng',
        date: '28 Mar 2025, 09:00 WIB',
        location: 'Terminal Kargo Soekarno Hatta',
        status: 'current',
        desc: 'Proses administrasi kepabeanan jalur hijau resmi kargo berizin sedang berlangsung.',
      },
      {
        title: 'Pengiriman Kurir Domestik (Paxel / JNE YES)',
        date: '29 Mar 2025 (Estimasi)',
        location: 'Kurir Ekspedisi Lokal',
        status: 'pending',
        desc: 'Paket diantar langsung ke alamat tujuan di kota Anda.',
      },
    ],
  },
};

export const OrderStatusPage: React.FC = () => {
  const [orderQuery, setOrderQuery] = useState('MPJ-OSK-049');
  const [searchedOrder, setSearchedOrder] = useState<OrderTrackingData | null>(
    SAMPLE_ORDERS['MPJ-OSK-049']
  );

  const handleSearch = (codeToSearch = orderQuery) => {
    const cleanCode = codeToSearch.trim().toUpperCase();
    if (SAMPLE_ORDERS[cleanCode]) {
      setSearchedOrder(SAMPLE_ORDERS[cleanCode]);
    } else {
      // Create dynamically tailored data for custom query
      setSearchedOrder({
        orderNumber: cleanCode || 'MPJ-CUSTOM',
        batchName: 'Kloter Khusus Kargo Osaka ➔ Jakarta',
        origin: 'Osaka (KIX)',
        destination: 'Jakarta (CGK)',
        flightCode: 'GA889',
        flightRoute: 'Kansai Intl (KIX) ➔ Soekarno Hatta (CGK)',
        carrier: 'Garuda Indonesia Cargo Direct',
        radarUrl: 'https://www.flightradar24.com/data/flights/ga889',
        flightStatus: 'In Flight (Sedang Mengudara)',
        flightProgressPercent: 60,
        estArrival: 'Hari ini, 16:25 WIB',
        items: 'Titipan Pribadi Pengguna',
        customerName: 'Pelanggan MapahJastip',
        customerCity: 'Indonesia',
        steps: SAMPLE_ORDERS['MPJ-OSK-049'].steps,
      });
    }
  };

  const handleQuickSelect = (code: string) => {
    setOrderQuery(code);
    handleSearch(code);
  };

  const whatsappInquiryUrl = generateWhatsAppUrl(
    `Halo Admin MapahJastip,\nSaya ingin menanyakan update posisi terbaru untuk pesanan resi: ${searchedOrder?.orderNumber || orderQuery}\nRute: ${searchedOrder?.flightRoute || 'Osaka (KIX) ke CGK'}\nTerima kasih!`
  );

  return (
    <div className="w-full bg-surface pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-10 space-y-8">
        {/* Header Header Info */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-light-blue text-primary font-label-md text-xs font-semibold border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-[17px] animate-pulse">radar</span>
            <span>Real-time Cargo Tracking • Osaka (KIX) &amp; Tokyo (HND/NRT) ➔ CGK</span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface font-extrabold tracking-tight">
            Status Pesanan &amp; Pelacakan Kargo
          </h1>
          <p className="font-body-md text-body-md text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Pantau pergerakan belanjaan Anda dari toko fisik di Osaka/Tokyo, gudang kargo bandara, status radar penerbangan di udara, hingga tiba di depan rumah.
          </p>
        </div>

        {/* Search Order Bar & Quick Sample Tabs */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-subtle shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <label className="block text-sm font-bold text-on-surface" htmlFor="orderInput">
              Masukkan Nomor Invoice / ID Resi Jastip:
            </label>
            <span className="text-xs text-text-secondary">Pencarian real-time tanpa batas kuota</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
                tag
              </span>
              <input
                id="orderInput"
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Contoh: MPJ-OSK-049 atau MPJ-48-901"
                className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle/70"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-label-md text-sm transition-all shadow-xs font-bold inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Lacak Paket</span>
            </button>
          </div>

          {/* Quick Select Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-text-secondary font-medium">Contoh Simulasi Kloter:</span>
            <button
              onClick={() => handleQuickSelect('MPJ-OSK-049')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                orderQuery === 'MPJ-OSK-049'
                  ? 'bg-surface-light-blue text-primary border-primary/40 shadow-xs'
                  : 'bg-surface-container-low text-text-secondary border-border-subtle hover:text-on-surface'
              }`}
            >
              <span>🎌 Kloter Osaka (KIX ➔ CGK)</span>
              <code className="text-[11px] opacity-80">MPJ-OSK-049</code>
            </button>
            <button
              onClick={() => handleQuickSelect('MPJ-48-901')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                orderQuery === 'MPJ-48-901'
                  ? 'bg-surface-light-blue text-primary border-primary/40 shadow-xs'
                  : 'bg-surface-container-low text-text-secondary border-border-subtle hover:text-on-surface'
              }`}
            >
              <span>🗼 Kloter Tokyo (HND ➔ CGK)</span>
              <code className="text-[11px] opacity-80">MPJ-48-901</code>
            </button>
          </div>
        </div>

        {/* Tracking Details Result */}
        {searchedOrder && (
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-border-subtle shadow-md space-y-8 animate-fadeIn">
            {/* Header: Flight & Cargo Info Banner */}
            <div className="p-5 bg-gradient-to-r from-surface-light-blue/70 via-surface-soft-blue to-surface-container-low rounded-2xl border border-border-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary text-white tracking-wide">
                      {searchedOrder.orderNumber}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary">
                      {searchedOrder.batchName}
                    </span>
                  </div>
                  <h3 className="font-title-md text-lg text-on-surface font-extrabold">
                    {searchedOrder.items}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Penerima: <strong className="text-on-surface">{searchedOrder.customerName}</strong> • Tujuan: <strong className="text-on-surface">{searchedOrder.customerCity}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {searchedOrder.flightStatus}
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Est. Tiba: <strong className="text-on-surface font-semibold">{searchedOrder.estArrival}</strong>
                  </span>
                </div>
              </div>

              {/* Real-time Flight Air Route Progress Bar & Radar Button */}
              <div className="pt-3 border-t border-border-subtle/70 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface">
                  <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                    <span>{searchedOrder.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface-container-lowest border border-border-subtle text-[11px] font-mono text-primary font-bold">
                      {searchedOrder.flightCode}
                    </span>
                    <span className="text-[11px] text-text-secondary font-medium">
                      ({searchedOrder.carrier})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <span>{searchedOrder.destination}</span>
                    <span className="material-symbols-outlined text-[18px]">flight_land</span>
                  </div>
                </div>

                {/* Progress Line Simulation */}
                <div className="relative w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500 relative"
                    style={{ width: `${searchedOrder.flightProgressPercent}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-xs ring-2 ring-emerald-500 animate-pulse" />
                  </div>
                </div>

                {/* Direct Flight Radar CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-xs">
                  <span className="text-text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">navigation</span>
                    Posisi Kargo: Sedang melintasi rute udara internasional Kansai (KIX) ➔ Laut Cina Selatan ➔ Jakarta (CGK)
                  </span>

                  <a
                    href={searchedOrder.radarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-light-blue text-primary border border-primary/30 font-semibold shadow-xs transition-all hover:scale-[1.02] shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px] text-amber-500">public</span>
                    <span>Buka Live Radar di FlightRadar24</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Stepper Timeline Checkpoints */}
            <div className="space-y-6 relative pl-6 sm:pl-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-subtle">
              {searchedOrder.steps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                  <div key={idx} className="relative space-y-1.5">
                    {/* Step Circle Indicator */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-success text-white ring-4 ring-success-bg'
                          : isCurrent
                          ? 'bg-primary text-white ring-4 ring-surface-light-blue animate-pulse'
                          : 'bg-surface-container-high text-text-secondary'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Step Title & Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-title-md text-sm font-bold ${
                            isCurrent ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-text-secondary'
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            Posisi Terkini
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-text-secondary font-medium">
                        {step.date}
                      </span>
                    </div>

                    {/* Location Badge */}
                    {step.location && (
                      <div className="flex items-center gap-1 text-[11px] text-text-secondary font-medium">
                        <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                        <span>{step.location}</span>
                      </div>
                    )}

                    <p className="text-xs text-text-secondary leading-relaxed pt-0.5">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Help Actions */}
            <div className="p-4 bg-surface-container-low rounded-2xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-primary text-[20px]">support_agent</span>
                <span>Butuh konfirmasi foto fisik barang atau bukti struk kasir?</span>
              </div>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[17px]">chat</span>
                <span>Tanya Status ke Admin WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
