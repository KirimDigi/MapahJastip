import React from 'react';
import { useCostCalculator } from '../../hooks/useCostCalculator';
import { formatIdr, formatJpy } from '../../utils/currency';
import { generateQuoteWhatsAppUrl } from '../../utils/whatsapp';

export const QuickEstimator: React.FC = () => {
  const {
    priceJpy,
    setPriceJpy,
    selectedCategoryId,
    selectedCategory,
    handleSelectCategory,
    weightG,
    shippingMethod,
    setShippingMethod,
    calculation,
  } = useCostCalculator({
    initialPriceJpy: 5000,
    initialCategoryId: 'skincare',
    initialWeightG: 300,
    initialShippingMethod: 'handcarry',
  });

  const categories = [
    { id: 'skincare', name: 'Skincare / Kosmetik', fee: '12%', weight: 300 },
    { id: 'fashion', name: 'Fashion & Sepatu', fee: '10%', weight: 850 },
    { id: 'anime', name: 'Figure & Pop Culture', fee: '15%', weight: 500 },
    { id: 'snack', name: 'Makanan & Snack', fee: '10%', weight: 400 },
    { id: 'gadget', name: 'Elektronik & Gadget', fee: '8%', weight: 600 },
    { id: 'mercari', name: 'Mercari / Secondhand', fee: '15%', weight: 400 },
  ];

  const waUrl = generateQuoteWhatsAppUrl(
    'Titip Belanja Jepang (Quick Estimator)',
    calculation.priceJpy,
    selectedCategory.name,
    calculation.totalCost,
    shippingMethod === 'handcarry' ? 'Handcarry Koper Shopper (3-5 hari)' : 'Air Cargo All-in Terjadwal (7-10 hari)'
  );

  return (
    <section className="w-full py-16 bg-surface-container-low" id="quick-calculator">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Left (Col 1-7) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-border-subtle/80 space-y-6">
            <div className="space-y-1">
              <span className="font-label-md text-label-md text-primary font-semibold uppercase tracking-wider">
                Quick Cost Estimator
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Hitung Estimasi Biaya Titip Real-Time
              </h2>
              <p className="font-body-sm text-body-sm text-text-secondary leading-relaxed">
                Gunakan kalkulator ini untuk mengetahui perkiraan biaya total sampai ke tangan Anda dengan kurs acuan live <strong className="text-primary font-semibold">Rp {calculation.exchangeRate.toFixed(2)}/JPY</strong>.
              </p>
            </div>

            <div className="space-y-5">
              {/* Yen Price Input */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold" htmlFor="home-price-jpy">
                  Harga Barang di Jepang (JPY ¥)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-headline-sm text-headline-sm">
                    ¥
                  </span>
                  <input
                    id="home-price-jpy"
                    type="number"
                    min="100"
                    step="100"
                    value={priceJpy || ''}
                    onChange={(e) => setPriceJpy(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-surface-soft-blue text-on-surface rounded-xl font-headline-sm text-headline-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-border-subtle/60"
                    placeholder="5000"
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-label-sm font-label-sm text-text-secondary">
                  <span>Contoh: ¥3,500 (Skincare) | ¥8,000 (Sepatu)</span>
                  <span className="text-primary font-medium">Kurs: 1 JPY = Rp 107.00</span>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold">
                  Kategori Barang
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.map((cat) => {
                    const isActive = selectedCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`px-3.5 py-2.5 rounded-xl text-left font-label-md text-label-md flex flex-col gap-0.5 transition-all border ${
                          isActive
                            ? 'bg-surface-light-blue text-primary border-primary font-bold shadow-xs'
                            : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-soft-blue'
                        }`}
                      >
                        <span className="font-semibold text-sm leading-tight">{cat.name}</span>
                        <span className="text-[11px] text-text-secondary">
                          Fee ~{cat.fee} (Est. {cat.weight}g)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Speed Choice */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2 font-semibold">
                  Metode Pengiriman Udara
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setShippingMethod('handcarry')}
                    className={`cursor-pointer p-3.5 rounded-xl flex items-center justify-between border transition-all ${
                      shippingMethod === 'handcarry'
                        ? 'bg-surface-light-blue border-primary shadow-xs'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-soft-blue'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_speed"
                        checked={shippingMethod === 'handcarry'}
                        onChange={() => setShippingMethod('handcarry')}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-title-md text-label-md text-on-surface font-semibold">
                          Handcarry Koper Shopper
                        </div>
                        <div className="font-body-sm text-[12px] text-text-secondary">
                          Estimasi 3-5 hari (Bawa di Koper)
                        </div>
                      </div>
                    </div>
                    <span className="font-label-md text-label-sm text-primary font-bold">
                      Rp 28.000 / 100g
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('cargo')}
                    className={`cursor-pointer p-3.5 rounded-xl flex items-center justify-between border transition-all ${
                      shippingMethod === 'cargo'
                        ? 'bg-surface-light-blue border-primary shadow-xs'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-soft-blue'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping_speed"
                        checked={shippingMethod === 'cargo'}
                        onChange={() => setShippingMethod('cargo')}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-title-md text-label-md text-on-surface font-semibold">
                          Air Cargo All-in Terjadwal
                        </div>
                        <div className="font-body-sm text-[12px] text-text-secondary">
                          Estimasi 7-10 hari (All-in Cukai)
                        </div>
                      </div>
                    </div>
                    <span className="font-label-md text-label-sm text-on-surface font-bold">
                      Rp 24.000 / 100g
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Result Right (Col 8-12) */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-lg border border-border-subtle space-y-6">
            <div className="flex items-center justify-between pb-3 bg-surface-soft-blue p-3.5 rounded-xl border border-border-subtle/50">
              <span className="font-title-md text-title-md text-on-surface font-bold">
                Rincian Estimasi Biaya
              </span>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-success-text bg-success-bg px-2.5 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-[14px]">shield</span> All-in Safe
              </span>
            </div>

            {/* Breakdown Rows */}
            <div className="space-y-3 font-body-md text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Harga Barang JPY</span>
                <span className="font-semibold text-on-surface">{formatJpy(calculation.priceJpy)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Konversi Rupiah (x Rp {calculation.exchangeRate.toFixed(2)})</span>
                <span className="font-semibold text-on-surface">{formatIdr(calculation.priceIdr)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span className="flex items-center gap-1">
                  Fee Jastip Concierge{' '}
                  <span className="text-xs bg-surface-container-highest px-1.5 py-0.5 rounded text-primary font-bold">
                    ({calculation.feePct}%)
                  </span>
                </span>
                <span className="font-semibold text-on-surface">{formatIdr(calculation.feeAmount)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span className="flex items-center gap-1">
                  Estimasi Ongkir Jepang ➔ JKT{' '}
                  <span className="text-xs text-text-secondary">({weightG}g)</span>
                </span>
                <span className="font-semibold text-on-surface">{formatIdr(calculation.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Handling &amp; Bubble Wrap Tebal</span>
                <span className="text-success-text font-semibold">GRATIS</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Asuransi Kargo Penuh</span>
                <span className="text-success-text font-semibold">TERMASUK</span>
              </div>
            </div>

            {/* Total Box */}
            <div className="p-4 bg-surface-container-low rounded-xl space-y-1 border border-border-subtle/60">
              <div className="flex justify-between items-baseline">
                <span className="font-title-md text-label-md text-text-secondary font-semibold">
                  Total Estimasi Bersih
                </span>
                <span className="font-headline-lg text-headline-lg text-primary font-bold tabular-nums">
                  {formatIdr(calculation.totalCost)}
                </span>
              </div>
              <p className="text-[12px] text-text-secondary">
                *Belum termasuk ongkir lokal dari gudang Jakarta ke alamat rumah Anda via JNE/SiCepat.
              </p>
            </div>

            {/* Send to WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-success text-white font-label-md text-label-md rounded-xl hover:bg-success-text shadow-[0_4px_16px_rgba(24,168,116,0.3)] transition-all font-bold"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>Kirim Estimasi ke WhatsApp Shopper</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-label-sm font-label-sm text-text-secondary">
              <span className="material-symbols-outlined text-success text-[16px]">verified</span>
              <span>Konsultasi tanya stok di toko fisik Tokyo tanpa dipungut biaya</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
