import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCostCalculator } from '../hooks/useCostCalculator';
import { useExchangeRate } from '../context/ExchangeRateContext';
import { JAPAN_MERCHANTS, DESTINATION_ZONES } from '../constants/rates';
import { formatIdr, formatJpy } from '../utils/currency';
import { generateQuoteWhatsAppUrl } from '../utils/whatsapp';

export const CalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialBatch = searchParams.get('batch');
  const { rate, isLive, isLoading, lastUpdated, source, refetch, setCustomRate } = useExchangeRate();
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [customRateInput, setCustomRateInput] = useState(rate.toString());

  const {
    itemName,
    setItemName,
    storeName,
    setStoreName,
    priceJpy,
    setPriceJpy,
    selectedCategoryId,
    handleSelectCategory,
    selectedCategory,
    weightG,
    setWeightG,
    packaging,
    setPackaging,
    shippingMethod,
    setShippingMethod,
    destinationId,
    setDestinationId,
    selectedDestination,
    calculation,
  } = useCostCalculator({
    initialPriceJpy: 14300,
    initialCategoryId: 'fashion',
    initialWeightG: 1200,
    initialShippingMethod: 'handcarry',
    initialPackaging: 'standard',
  });

  const waUrl = generateQuoteWhatsAppUrl(
    itemName || 'Titipan Jepang',
    calculation.priceJpy,
    selectedCategory.name,
    calculation.totalCost + calculation.domesticShippingCost,
    `${shippingMethod === 'handcarry' ? 'Air Cargo Handcarry' : 'Air Cargo Express'} + Kirim ke ${selectedDestination?.name}`
  );

  return (
    <div className="w-full bg-surface pb-16">
      {/* Decorative Wave Header */}
      <div className="relative w-full bg-surface-container-low overflow-hidden py-10 px-6 lg:px-12 border-b border-border-subtle">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <svg className="w-full h-full text-surface-variant" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path
              d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,218.7C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-light-blue rounded-full border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary tracking-wide uppercase font-semibold">
                Real-Time Japanese Yen Calculator
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-display text-on-surface tracking-tight">
              Kalkulator Estimasi Biaya Jastip Jepang
            </h1>
            <p className="font-body-lg text-body-lg text-text-secondary leading-relaxed">
              Hitung total biaya belanja transparan tanpa biaya siluman. Lengkap dengan kurs real-time, fee jastip resmi, dan biaya kirim aman langsung ke alamat kotamu di Indonesia.
            </p>
            {initialBatch && (
              <div className="pt-2">
                <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold">
                  Mengkalkulasi untuk Slot Batch #{initialBatch}
                </span>
              </div>
            )}
          </div>

          {/* Live Rate Card */}
          <div className="shrink-0 bg-surface-container-lowest p-6 rounded-2xl shadow-md border border-border-subtle flex flex-col gap-3 min-w-[290px]">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-text-secondary flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[18px] text-tertiary-container">sync_alt</span>
                Kurs Transaksi
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-xs font-bold ${
                    isLive ? 'bg-success-bg text-success-text' : 'bg-surface-container-high text-text-secondary'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isLive ? 'bg-success animate-pulse' : 'bg-gray-400'}`} />
                  {isLive ? 'Live Forex' : 'Acuan'}
                </span>
                <button
                  onClick={() => {
                    refetch();
                    setIsEditingRate(false);
                  }}
                  disabled={isLoading}
                  title="Tarik kurs real-time terbaru"
                  aria-label="Perbarui kurs"
                  className="p-1 rounded-lg hover:bg-surface-light-blue text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[16px] block ${isLoading ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                </button>
                <button
                  onClick={() => {
                    setCustomRateInput(rate.toString());
                    setIsEditingRate(!isEditingRate);
                  }}
                  title="Sesuaikan kurs manual (misal kurs Google/Bank)"
                  aria-label="Edit kurs manual"
                  className="p-1 rounded-lg hover:bg-surface-light-blue text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] block">
                    edit
                  </span>
                </button>
              </div>
            </div>

            {isEditingRate ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = parseFloat(customRateInput);
                  if (val && !isNaN(val) && val > 0) {
                    setCustomRate(val);
                    setIsEditingRate(false);
                  }
                }}
                className="space-y-2 pt-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-secondary">Rp</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={customRateInput}
                    onChange={(e) => setCustomRateInput(e.target.value)}
                    placeholder="111.85"
                    className="w-full px-2.5 py-1.5 bg-surface-container-low border border-primary rounded-lg text-sm font-bold text-primary focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-container"
                  >
                    Set
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Contoh: 111.85 (Google)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomRate(111.85);
                      setIsEditingRate(false);
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Pakai 111.85
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-primary font-bold tabular-nums">
                  1 JPY = Rp {rate.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-text-secondary font-label-sm text-xs pt-2 bg-surface-container-low px-3 py-2 rounded-xl">
              <span>{source || 'Auto Sync'}</span>
              <span className="text-on-surface font-semibold text-[11px]">{lastUpdated || 'Real-time'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Grid */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Wizard (Col 1-7) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-md border border-border-subtle space-y-8">
            {/* Step 1: Detail Produk */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-md text-sm font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Informasi Produk &amp; Harga Toko
                  </h2>
                </div>
                <span className="font-label-sm text-xs text-text-secondary">Wajib Diisi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="calc-name">
                    Nama Produk
                  </label>
                  <input
                    id="calc-name"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Contoh: Rohto Melano CC, Figure Jujutsu"
                    className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="calc-store">
                    Toko Asal / Merchant
                  </label>
                  <select
                    id="calc-store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle/50 transition-all cursor-pointer"
                  >
                    {JAPAN_MERCHANTS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="calc-price">
                    Harga Asli (Yen - ¥ JPY)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-text-secondary font-headline-sm">¥</span>
                    <input
                      id="calc-price"
                      type="number"
                      min="100"
                      step="100"
                      value={priceJpy || ''}
                      onChange={(e) => setPriceJpy(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-price-lg text-price-lg focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle/50 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="calc-category">
                    Kategori Barang
                  </label>
                  <select
                    id="calc-category"
                    value={selectedCategoryId}
                    onChange={(e) => handleSelectCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle/50 transition-all cursor-pointer"
                  >
                    <option value="fashion">Fashion, Pakaian &amp; Sepatu (Fee 10%)</option>
                    <option value="skincare">Skincare, Kosmetik &amp; Suplemen (Fee 12%)</option>
                    <option value="anime">Hobby, Figure &amp; Collectibles (Fee 15%)</option>
                    <option value="snack">General Goods, Camilan &amp; Matcha (Fee 10%)</option>
                    <option value="gadget">Elektronik &amp; Gadget Ringan (Fee 8%)</option>
                    <option value="mercari">Mercari / Secondhand (Fee 15%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Berat & Kemasan */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-md text-sm font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Perkiraan Berat &amp; Packaging Protektif
                  </h2>
                </div>
                <span className="font-title-md text-title-md text-primary font-bold">
                  {(weightG / 1000).toFixed(1)} kg ({weightG}g)
                </span>
              </div>

              <div className="space-y-2 bg-surface-container-low p-4 rounded-xl border border-border-subtle/50">
                <div className="flex justify-between items-center text-label-sm font-label-sm text-text-secondary text-xs">
                  <span>0.2 kg (Ringan / Kosmetik)</span>
                  <span>10.0 kg (Kargo Besar)</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={weightG}
                  onChange={(e) => setWeightG(Number(e.target.value))}
                  className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="font-body-sm text-xs text-text-secondary">
                  Berat ditimbang riil saat shopper menerima barang di Tokyo Hub. Pembulatan per 0.5 kg ke atas.
                </p>
              </div>

              {/* Packaging Options */}
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface font-semibold block">
                  Proteksi Packaging Ekstra
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPackaging('standard')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${
                      packaging === 'standard'
                        ? 'bg-surface-light-blue border-primary shadow-xs'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-soft-blue'
                    }`}
                  >
                    <input
                      type="radio"
                      name="packaging_type"
                      checked={packaging === 'standard'}
                      onChange={() => setPackaging('standard')}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="font-title-md text-sm text-on-surface font-bold block">
                        Standard Concierge Pack
                      </span>
                      <span className="font-body-sm text-xs text-text-secondary block">
                        Bubble wrap 3 lapis + polymailer aman (Gratis)
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setPackaging('reinforced')}
                    className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${
                      packaging === 'reinforced'
                        ? 'bg-surface-light-blue border-primary shadow-xs'
                        : 'bg-surface-container-low border-transparent hover:bg-surface-soft-blue'
                    }`}
                  >
                    <input
                      type="radio"
                      name="packaging_type"
                      checked={packaging === 'reinforced'}
                      onChange={() => setPackaging('reinforced')}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="font-title-md text-sm text-on-surface font-bold block">
                        Armor Box &amp; Corner Guard
                      </span>
                      <span className="font-body-sm text-xs text-text-secondary block">
                        Box double wall anti-penyok + proteksi figure (+Rp 35.000)
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Jalur Pengiriman & Destinasi */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-md text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Metode Kirim &amp; Alamat Domestik
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="calc-shipping">
                    Jalur Logistik Tokyo ⇄ JKT
                  </label>
                  <select
                    id="calc-shipping"
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value as any)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle/50 transition-all cursor-pointer"
                  >
                    <option value="handcarry">Handcarry Koper Shopper (Rp 28.000/100g • 3-5 Hari)</option>
                    <option value="cargo">Air Cargo All-in Terjadwal (Rp 24.000/100g • 7-10 Hari)</option>
                    <option value="express">Air Express Prioritas Direct (Rp 35.000/100g • 3-5 Hari)</option>
                    <option value="regular">Air Regular Konsolidasi (Rp 22.000/100g • 10-14 Hari)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="calc-destination">
                    Wilayah Kota Tujuan di Indonesia
                  </label>
                  <select
                    id="calc-destination"
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container border border-border-subtle/50 transition-all cursor-pointer"
                  >
                    {DESTINATION_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} ({formatIdr(zone.ratePerKg)} / kg)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Receipt Breakdown Right (Col 8-12) */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-xl border border-border-subtle space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 bg-surface-soft-blue p-4 rounded-xl border border-border-subtle/60">
              <div>
                <span className="font-title-md text-title-md text-on-surface font-bold block">
                  Digital Invoice Receipt
                </span>
                <span className="text-xs text-text-secondary">Tokyo Concierge Guarantee</span>
              </div>
              <span className="inline-flex items-center gap-1 font-label-sm text-xs text-success-text bg-success-bg px-2.5 py-1 rounded-full font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span> All-in Safe
              </span>
            </div>

            {/* Product summary header */}
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface truncate max-w-[200px]">
                {itemName || 'Custom Request'}
              </span>
              <span className="text-text-secondary">{storeName}</span>
            </div>

            {/* Breakdown Itemized Rows */}
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
                <span>Ongkir Tokyo ➔ Jakarta ({weightG}g)</span>
                <span className="font-semibold text-on-surface">{formatIdr(calculation.shippingCost)}</span>
              </div>
              {calculation.packagingCost > 0 && (
                <div className="flex justify-between text-text-secondary">
                  <span>Armor Box &amp; Corner Guard</span>
                  <span className="font-semibold text-on-surface">
                    {formatIdr(calculation.packagingCost)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Ongkir Domestik ({selectedDestination?.name})</span>
                <span className="font-semibold text-on-surface">
                  {formatIdr(calculation.domesticShippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Handling &amp; Bubble Wrap Standar</span>
                <span className="text-success-text font-semibold">GRATIS</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Asuransi Kargo Penuh</span>
                <span className="text-success-text font-semibold">TERMASUK</span>
              </div>
            </div>

            {/* Total Box */}
            <div className="p-4 bg-surface-container-low rounded-xl space-y-1 border border-border-subtle">
              <div className="flex justify-between items-baseline">
                <span className="font-title-md text-label-md text-text-secondary font-bold">
                  Total Estimasi Bersih
                </span>
                <span className="font-headline-lg text-2xl lg:text-3xl text-primary font-bold tabular-nums">
                  {formatIdr(calculation.totalCost + calculation.domesticShippingCost)}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                *Sudah termasuk biaya logistik internasional, pajak/cukai kargo resmi, dan kurir ke kotamu.
              </p>
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-success text-white font-label-md text-label-md rounded-xl hover:bg-success-text shadow-[0_4px_16px_rgba(24,168,116,0.3)] transition-all font-bold"
            >
              <span className="material-symbols-outlined text-[22px]">chat</span>
              <span>Kirim Rincian ke WhatsApp Shopper</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-label-sm font-label-sm text-text-secondary text-xs">
              <span className="material-symbols-outlined text-success text-[16px]">verified</span>
              <span>Harga dikunci saat DP ditransfer tanpa biaya susulan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
