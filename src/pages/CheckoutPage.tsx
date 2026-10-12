import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentMethod, PaymentStatus, Order } from '../types/order';
import { ShippingMethod } from '../types/calculator';
import { formatIdr } from '../utils/currency';
import {
  DESTINATION_ZONES,
  AIR_EXPRESS_RATE_PER_100G,
  AIR_REGULAR_RATE_PER_100G,
  CARGO_EXPRESS_RATE_PER_100G,
} from '../constants/rates';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../services/supabase';

export const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, totalPriceIdr, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states — Otomatis terisi sesuai akun customer yang sedang login
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [cityZoneId, setCityZoneId] = useState('jabodetabek');
  const [postalCode, setPostalCode] = useState('12310');
  const [address, setAddress] = useState('Jl. Metro Pondok Indah Blok TB No. 12, Kebayoran Lama');
  const [shippingType, setShippingType] = useState<ShippingMethod>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bca');
  const [notes, setNotes] = useState('');

  // Sinkronisasi otomatis data akun login ke form
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  // Order created state — disimpan di sessionStorage agar tidak hilang saat halaman direload
  const [createdOrder, setCreatedOrder] = useState<Order | null>(() => {
    try {
      const saved = sessionStorage.getItem('mapah_last_checkout_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  const totalWeightG = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.product.weightG || 350) * item.quantity, 0);
  }, [items]);

  const effectiveWeightG = Math.max(100, totalWeightG);
  const shippingCosts = useMemo(() => {
    return {
      express: Math.round((effectiveWeightG / 100) * AIR_EXPRESS_RATE_PER_100G),
      cargo: Math.round((effectiveWeightG / 100) * CARGO_EXPRESS_RATE_PER_100G),
      regular: Math.round((effectiveWeightG / 100) * AIR_REGULAR_RATE_PER_100G),
    };
  }, [effectiveWeightG]);

  const shippingOptionsList: { id: ShippingMethod; title: string; subtitle: string; badge: string; cost: number }[] = [
    {
      id: 'express',
      title: '✈️ EMS Japan Post Express',
      subtitle: 'Direct Tokyo ➔ Indonesia (3-5 hari kerja)',
      badge: 'Rp 25.000 / 100g',
      cost: shippingCosts.express,
    },
    {
      id: 'cargo',
      title: '🚢 Air Cargo Terjadwal',
      subtitle: 'Kargo Udara All-in Cukai (7-10 hari kerja)',
      badge: 'Rp 24.000 / 100g',
      cost: shippingCosts.cargo,
    },
    {
      id: 'regular',
      title: '📦 Reguler Pos Udara Jepang',
      subtitle: 'Air Parcel Tokyo (7-10 hari kerja)',
      badge: 'Rp 16.500 / 100g',
      cost: shippingCosts.regular,
    },
  ];

  const currentShippingInfo = shippingOptionsList.find((s) => s.id === shippingType) || shippingOptionsList[0];

  const selectedZone = DESTINATION_ZONES.find((z) => z.id === cityZoneId) || DESTINATION_ZONES[0];
  const shippingFee = (shippingCosts as any)[shippingType] || shippingCosts.express;
  const domesticKgUnits = Math.max(1, Math.ceil(Math.max(0, totalWeightG - 300) / 1000));
  const domesticFee = domesticKgUnits * selectedZone.ratePerKg;
  const jastipFee = Math.round(totalPriceIdr * 0.1); // ~10%

  // Kalkulasi Pajak & Bea Cukai Indonesia sesuai komoditas barang
  const customsTaxAmount = useMemo(() => {
    // Bebas bea masuk impor personal sampai batas wajar (de minimis)
    if (totalPriceIdr <= 3000000) return 0;
    let totalTax = 0;
    items.forEach((it) => {
      const cat = (it.product.category || '').toLowerCase();
      let taxPct = 17.5; // standar PPN + Bea Masuk impor umum
      if (cat.includes('sepatu') || cat.includes('footwear') || cat.includes('sneaker')) {
        taxPct = 35;
      } else if (cat.includes('tas') || cat.includes('bag') || cat.includes('pakaian') || cat.includes('fashion') || cat.includes('baju')) {
        taxPct = 25;
      }
      totalTax += Math.round((it.product.priceIdr * it.quantity) * (taxPct / 100));
    });
    return totalTax;
  }, [items, totalPriceIdr]);

  const grandTotal = totalPriceIdr + jastipFee + shippingFee + domesticFee + customsTaxAmount;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderNumber = `MPJ-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: {
        fullName,
        email: '-',
        phone,
        city: selectedZone.name,
        postalCode,
        address,
      },
      items,
      shippingMethod: currentShippingInfo.title,
      subtotalIdr: totalPriceIdr,
      jastipFeeIdr: jastipFee,
      shippingCostIdr: shippingFee + domesticFee,
      customsTaxIdr: customsTaxAmount,
      totalAmountIdr: grandTotal,
      paymentMethod,
      paymentStatus: 'pending',
      notes,
    };

    const customerName = fullName.trim() || user?.name || 'Pelanggan MapahJastip';
    const customerPhone = phone.trim().replace(/\D/g, '') || (user?.phone ? user.phone.replace(/\D/g, '') : '');
    const customerEmail = user?.email || null;

    setCreatedOrder(newOrder);
    setPaymentStatus('pending');
    try {
      sessionStorage.setItem('mapah_last_checkout_order', JSON.stringify(newOrder));
    } catch {
      // ignore
    }
    clearCart();

    // Simpan pesanan asli pelanggan ke sistem penyimpanan lokal (mapah_admin_orders)
    try {
      const adminFormattedOrder = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        date: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        customerName,
        customerPhone,
        customerEmail,
        customerCity: selectedZone.name,
        customerAddress: address,
        items: items.map((it) => `${it.product.name} (${it.quantity}x)`).join(', '),
        totalIdr: grandTotal,
        status: 'pending',
        courier: currentShippingInfo.title.replace(/[^\w\s]/gi, '').trim(),
        resiNumber: '',
        paymentMethod,
        paymentStatus: 'pending',
        notes,
      };

      const existing = localStorage.getItem('mapah_admin_orders');
      const orderList = existing ? JSON.parse(existing) : [];
      // Hilangkan dummy order lama jika ada
      const cleanList = orderList.filter((o: any) => !['ord-101', 'ord-102', 'ord-103', 'ord-104', 'ord-105'].includes(o.id));
      localStorage.setItem('mapah_admin_orders', JSON.stringify([adminFormattedOrder, ...cleanList]));

      // Simpan langsung ke database Supabase Cloud
      supabase.from('orders').insert([
        {
          order_number: newOrder.orderNumber,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          customer_address: address,
          batch_name: currentShippingInfo.title,
          origin: 'Tokyo, Jepang 🇯🇵',
          destination: selectedZone.name,
          courier: currentShippingInfo.title.replace(/[^\w\s]/gi, '').trim(),
          resi_number: '',
          order_status: '1. Menunggu Belanja di Tokyo',
          progress_percent: 25,
          est_arrival: shippingType === 'handcarry' || shippingType === 'express' ? '3-5 Hari Kerja' : '7-10 Hari Kerja',
          items: items.map((it) => `${it.product.name} (${it.quantity}x)`).join(', '),
          total_amount: grandTotal,
          payment_method: paymentMethod,
          payment_status: 'pending',
          notes: notes || '',
        },
      ]).then(({ error }) => {
        if (error) console.warn('Supabase insert order warning:', error.message);
      });
    } catch (err) {
      console.error('Failed to save real order to localStorage/Supabase:', err);
    }
  };

  // Simulated Payment Confirmation (Architecture boundary: In production this will be triggered by Moota webhook on backend)
  const handleSimulatePayment = (status: PaymentStatus) => {
    setPaymentStatus(status);
    if (createdOrder) {
      setCreatedOrder({
        ...createdOrder,
        paymentStatus: status,
      });

      // Update status pembayaran pesanan di admin
      try {
        const existing = localStorage.getItem('mapah_admin_orders');
        if (existing) {
          const orderList = JSON.parse(existing);
          const updated = orderList.map((o: any) =>
            o.orderNumber === createdOrder.orderNumber
              ? {
                  ...o,
                  paymentStatus: status,
                  status: status === 'paid' ? 'purchased' : o.status,
                }
              : o
          );
          localStorage.setItem('mapah_admin_orders', JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Failed to update order status in localStorage:', err);
      }
    }
  };

  // If order was created, show order invoice & dummy payment status
  if (createdOrder) {
    return (
      <div className="w-full bg-surface pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-12 py-10 space-y-8">
          <div className="text-center space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                paymentStatus === 'paid'
                  ? 'bg-success-bg text-success-text'
                  : paymentStatus === 'pending'
                  ? 'bg-warning-bg text-warning-text'
                  : 'bg-error-bg text-error-text'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  paymentStatus === 'paid'
                    ? 'bg-success'
                    : paymentStatus === 'pending'
                    ? 'bg-warning animate-pulse'
                    : 'bg-error'
                }`}
              />
              Status Pembayaran: {paymentStatus.toUpperCase()}
            </span>
            <h1 className="font-headline-lg text-3xl text-on-surface font-bold">
              Invoice Pesanan #{createdOrder.orderNumber}
            </h1>
            <p className="text-sm text-text-secondary">
              Terima kasih, pesanan titipanmu telah berhasil dicatat ke sistem MapahJastip.
            </p>
          </div>

          {/* Payment Card / Instruction */}
          <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-border-subtle shadow-md space-y-6">
            <div className="p-4 bg-surface-soft-blue rounded-2xl border border-border-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-text-secondary block">Metode Pembayaran:</span>
                <span className="font-bold text-base text-primary uppercase">
                  {createdOrder.paymentMethod === 'bca'
                    ? 'BCA Virtual Account'
                    : createdOrder.paymentMethod === 'mandiri'
                    ? 'Mandiri Virtual Account'
                    : createdOrder.paymentMethod === 'qris'
                    ? 'QRIS Instan (Gopay/OVO/ShopeePay)'
                    : 'Jenius Pay'}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-text-secondary block">Total Tagihan:</span>
                <span className="font-headline-sm text-xl text-primary font-bold tabular-nums">
                  {formatIdr(createdOrder.totalAmountIdr)}
                </span>
              </div>
            </div>

            {/* Simulated Payment Account */}
            {paymentStatus === 'pending' && (
              <div className="space-y-4 border-t border-border-subtle pt-4">
                <div className="p-4 bg-surface-container-low rounded-xl text-center space-y-2">
                  <span className="text-xs text-text-secondary">Nomor Rekening Virtual Transfer:</span>
                  <div className="font-price-lg text-xl font-bold tracking-wider text-on-surface select-all">
                    8801 2345 6789 0012
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    a/n PT MAPAH BELANJA JEPANG (Otomatis terverifikasi)
                  </p>
                </div>

                {/* Simulated Payment Action Buttons */}
                <div className="space-y-2 text-center pt-2">
                  <span className="text-xs text-text-secondary block">
                    Simulasi Pengujian Pembayaran (Prototype Mode):
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleSimulatePayment('paid')}
                      className="px-4 py-2 bg-success text-white rounded-lg text-xs font-bold hover:bg-success-text shadow-xs"
                    >
                      Simulasikan: Bayar Berhasil (Paid)
                    </button>
                    <button
                      onClick={() => handleSimulatePayment('failed')}
                      className="px-4 py-2 bg-error text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-xs"
                    >
                      Simulasikan: Gagal (Failed)
                    </button>
                    <button
                      onClick={() => handleSimulatePayment('expired')}
                      className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-xs font-bold"
                    >
                      Simulasikan: Kedaluwarsa (Expired)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'paid' && (
              <div className="p-4 bg-success-bg rounded-2xl border border-success/30 text-center space-y-2">
                <span className="material-symbols-outlined text-success text-[36px]">
                  check_circle
                </span>
                <h3 className="font-title-md text-base text-success-text font-bold">
                  Pembayaran Terverifikasi!
                </h3>
                <p className="text-xs text-text-secondary max-w-md mx-auto">
                  Shopper kami di Tokyo telah menerima notifikasi pesanan dan segera membelikan barang di jadwal penerbangan terdekat.
                </p>
              </div>
            )}

            {/* Ordered Items Summary */}
            <div className="space-y-3 pt-4 border-t border-border-subtle">
              <span className="font-title-md text-sm font-bold text-on-surface block">
                Rincian Barang yang Dititip:
              </span>
              {createdOrder.items.map((it) => (
                <div key={it.product.id} className="flex justify-between items-center text-xs">
                  <span className="text-on-surface">
                    {it.quantity}x {it.product.name}
                  </span>
                  <span className="font-bold text-on-surface">
                    {formatIdr(it.product.priceIdr * it.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border-subtle pt-2 space-y-1 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Fee Jastip Concierge:</span>
                  <span>{formatIdr(createdOrder.jastipFeeIdr)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkir Udara &amp; Kurir Domestik:</span>
                  <span>{formatIdr(createdOrder.shippingCostIdr)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                to={`/status-pesanan?order=${createdOrder.orderNumber}`}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                <span>Lacak di Status Pesanan</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem('mapah_last_checkout_order');
                  navigate('/');
                }}
                className="px-4 py-2.5 text-xs text-text-secondary hover:text-primary font-semibold cursor-pointer"
              >
                Selesai &amp; Beranda
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="w-full bg-surface py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-surface-light-blue flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[36px]">remove_shopping_cart</span>
        </div>
        <h2 className="font-title-md text-xl text-on-surface font-bold">
          Keranjang Belanja Masih Kosong
        </h2>
        <p className="text-text-secondary text-sm max-w-sm mx-auto">
          Silakan pilih barang yang ingin dititipkan dari Katalog Titip kami terlebih dahulu.
        </p>
        <button
          onClick={() => navigate('/katalog')}
          className="px-6 py-3 bg-primary-container text-white rounded-xl font-label-md text-sm hover:bg-primary-dark shadow-sm font-bold"
        >
          Lihat Katalog Titip
        </button>
      </div>
    );
  }

  // Normal Checkout Form
  return (
    <div className="w-full bg-surface pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        <div>
          <h1 className="font-headline-lg text-3xl lg:text-headline-lg text-on-surface font-bold">
            {t('checkoutPage.title')}
          </h1>
          <p className="text-text-secondary text-sm">
            Lengkapi data pengiriman dan konfirmasi pemesanan jasa titip belanja Jepang.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer & Address Details (Col 1-7) */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-border-subtle shadow-sm space-y-6">
            {/* Section 1: Customer Info */}
            <div className="space-y-4">
              <h2 className="font-title-md text-base text-on-surface font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-container text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                {t('checkoutPage.step1')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface block" htmlFor="c-name">
                    Nama Lengkap
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary border border-border-subtle/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface block" htmlFor="c-phone">
                    Nomor WhatsApp (Aktif)
                  </label>
                  <input
                    id="c-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary border border-border-subtle/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Address */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <h2 className="font-title-md text-base text-on-surface font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary-container text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                {t('checkoutPage.step2')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface block" htmlFor="c-zone">
                    Wilayah Tujuan Pengiriman Domestik
                  </label>
                  <select
                    id="c-zone"
                    value={cityZoneId}
                    onChange={(e) => setCityZoneId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary border border-border-subtle/50 cursor-pointer font-medium"
                  >
                    {DESTINATION_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} ({formatIdr(zone.ratePerKg)} / kg)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface block" htmlFor="c-postal">
                    Kode Pos
                  </label>
                  <input
                    id="c-postal"
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary border border-border-subtle/50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface block" htmlFor="c-address">
                  Alamat Lengkap (Jalan, RT/RW, No. Rumah)
                </label>
                <textarea
                  id="c-address"
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low rounded-xl text-sm focus:ring-2 focus:ring-primary border border-border-subtle/50"
                />
              </div>
            </div>

            {/* Section 3: Shipping & Payment Method */}
            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-base text-on-surface font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  {t('checkoutPage.step3')}
                </h2>
                <span className="text-xs text-text-secondary bg-surface-container-low px-2.5 py-1 rounded-full font-medium">
                  Total Berat Paket: <strong className="text-primary">{totalWeightG} gram</strong>
                </span>
              </div>

              {/* Pilihan Metode Pengiriman Resmi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {shippingOptionsList.map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setShippingType(opt.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      shippingType === opt.id
                        ? 'bg-surface-light-blue border-primary shadow-xs ring-1 ring-primary'
                        : 'bg-surface-container-low border-transparent hover:border-border-subtle'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-on-surface block text-sm">{opt.title}</span>
                      <span className="text-text-secondary text-[11px] block">{opt.subtitle}</span>
                      <span className="text-[10px] text-primary font-bold bg-surface-container-highest px-1.5 py-0.5 rounded inline-block">
                        {opt.badge}
                      </span>
                    </div>
                    <span className="font-bold text-primary whitespace-nowrap ml-2 text-sm">{formatIdr(opt.cost)}</span>
                  </label>
                ))}
              </div>

              {/* Payment selector */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-on-surface block mb-2">
                  Pilih Saluran Pembayaran:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['bca', 'mandiri', 'qris', 'jenius'] as PaymentMethod[]).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPaymentMethod(pm)}
                      className={`p-3 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer ${
                        paymentMethod === pm
                          ? 'bg-primary-container text-white border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface border-border-subtle hover:bg-surface-soft-blue'
                      }`}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-on-surface block" htmlFor="c-order-notes">
                Catatan Pesanan / Request Khusus (Opsional)
              </label>
              <input
                id="c-order-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Harap simpan receipt kasir di dalam plastik terpisah"
                className="w-full px-4 py-2 bg-surface-container-low rounded-xl text-xs border border-border-subtle/50"
              />
            </div>
          </div>

          {/* Cart Summary & Total (Col 8-12) */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-border-subtle shadow-lg space-y-6 sticky top-28">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h2 className="font-title-md text-base text-on-surface font-bold">
                  Ringkasan Titipan ({items.length} Item)
                </h2>
                <span className="text-xs text-text-secondary">Est. Berat: {totalWeightG}g</span>
              </div>
              <span className="inline-flex items-center gap-1 font-label-sm text-xs text-success-text bg-success-bg px-2.5 py-1 rounded-full font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span> All-in Safe
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-container-low shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-on-surface truncate block">
                      {item.product.name}
                    </span>
                    <span className="text-text-secondary">
                      {item.quantity} x {formatIdr(item.product.priceIdr)} ({item.product.weightG || 350}g)
                    </span>
                  </div>
                  <span className="font-bold text-on-surface shrink-0">
                    {formatIdr(item.product.priceIdr * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border-subtle pt-4 text-xs text-text-secondary font-medium">
              <div className="flex justify-between items-center gap-3">
                <span className="min-w-0">Subtotal Barang:</span>
                <span className="text-on-surface font-semibold whitespace-nowrap shrink-0">{formatIdr(totalPriceIdr)}</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="min-w-0">Fee Jastip Concierge (~10%):</span>
                <span className="text-on-surface font-semibold whitespace-nowrap shrink-0">{formatIdr(jastipFee)}</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="min-w-0">
                  {currentShippingInfo.title} ({totalWeightG}g):
                </span>
                <span className="text-on-surface font-semibold whitespace-nowrap shrink-0">{formatIdr(shippingFee)}</span>
              </div>
              <div className="flex justify-between items-start gap-3">
                <span className="flex-1 min-w-0">Kurir Domestik ({domesticKgUnits} kg • {selectedZone.name}):</span>
                <span className="text-on-surface font-semibold whitespace-nowrap shrink-0 text-right">{formatIdr(domesticFee)}</span>
              </div>
              <div className="flex justify-between items-center gap-3 py-1.5 px-2 bg-surface-container-low rounded-lg border border-border-subtle/50">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-on-surface">Pajak &amp; Bea Cukai ID:</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    customsTaxAmount === 0
                      ? 'bg-success-bg text-success-text'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {customsTaxAmount === 0 ? 'Bebas Bea Masuk' : 'Tarif PMK Bea Cukai'}
                  </span>
                </span>
                <span className="text-on-surface font-bold whitespace-nowrap shrink-0 text-right">
                  {customsTaxAmount === 0 ? 'Rp\u00A00' : formatIdr(customsTaxAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="min-w-0">Handling &amp; Bubble Wrap Tebal:</span>
                <span className="text-success-text font-semibold whitespace-nowrap shrink-0">GRATIS</span>
              </div>
              <div className="flex justify-between items-center gap-3">
                <span className="min-w-0">Asuransi Kargo Penuh:</span>
                <span className="text-success-text font-semibold whitespace-nowrap shrink-0">TERMASUK</span>
              </div>
              <div className="border-t border-border-subtle pt-3 flex justify-between items-baseline gap-3">
                <span className="font-bold text-sm text-on-surface">Total Pembayaran:</span>
                <span className="font-headline-lg text-2xl text-primary font-bold tabular-nums whitespace-nowrap shrink-0 text-right">
                  {formatIdr(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-primary-container hover:bg-primary-dark text-white font-label-md rounded-xl shadow-md transition-all font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Konfirmasi &amp; Dapatkan Kode Bayar</span>
              <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
            </button>

            <p className="text-[11px] text-text-secondary text-center leading-relaxed">
              *Setelah tombol diklik, nomor Virtual Account transfer otomatis digenerate.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
