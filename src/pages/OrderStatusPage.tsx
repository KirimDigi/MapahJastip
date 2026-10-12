import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { fetchOrdersFromSupabase } from '../services/supabase';

// Model Pesanan untuk Pelacakan
interface TrackingOrderModel {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerCity: string;
  items: string;
  status: 'pending' | 'packed' | 'shipping' | 'completed';
  courier?: string;
  resiNumber?: string;
  date?: string;
  packedDate?: string;
  shippingDate?: string;
  completedDate?: string;
}

export const OrderStatusPage: React.FC = () => {
  const { user, isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  // Ambil parameter pencarian dari query URL (?order=... atau ?resi=...)
  const queryParams = new URLSearchParams(location.search);
  const initialParam = queryParams.get('resi') || queryParams.get('order') || '';

  const [searchInput, setSearchInput] = useState(initialParam);
  const [activeQuery, setActiveQuery] = useState(initialParam);
  const [isCopied, setIsCopied] = useState(false);
  const [rawOrdersList, setRawOrdersList] = useState<TrackingOrderModel[]>([]);

  // Muat pesanan aktif dari LocalStorage dan Supabase secara Realtime
  useEffect(() => {
    const loadRealOrders = () => {
      let combined: TrackingOrderModel[] = [];

      try {
        const saved = localStorage.getItem('mapah_admin_orders');
        if (saved) {
          const list = JSON.parse(saved);
          const valid: TrackingOrderModel[] = list
            .filter((o: any) => !['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820'].includes(o.orderNumber))
            .map((o: any) => ({
              id: o.id || o.orderNumber,
              orderNumber: o.orderNumber,
              customerName: o.customerName || 'Pelanggan MapahJastip',
              customerPhone: o.customerPhone || '',
              customerCity: o.customerCity || 'DKI Jakarta & Bodetabek',
              items: o.items || 'Titipan Belanja Jepang',
              status: ['completed', 'shipping', 'packed', 'pending'].includes(o.status)
                ? o.status
                : ['purchased', 'arrived_id'].includes(o.status)
                ? 'packed'
                : 'pending',
              courier: o.courier || 'Japan Post EMS',
              resiNumber: o.resiNumber || '',
              date: o.date || 'Waktu Checkout',
              packedDate: o.packedDate || '',
              shippingDate: o.shippingDate || '',
              completedDate: o.completedDate || '',
            }));

          if (valid.length > 0) {
            combined = [...valid];
          }
        }
      } catch {
        // ignore
      }

      setRawOrdersList(combined);
    };

    loadRealOrders();

    // Supabase background fetch
    fetchOrdersFromSupabase().then((dbOrders) => {
      if (dbOrders && dbOrders.length > 0) {
        const converted: TrackingOrderModel[] = dbOrders
          .filter((d) => !['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820'].includes(d.order_number))
          .map((d) => ({
          id: d.id,
          orderNumber: d.order_number,
          customerName: d.customer_name,
          customerPhone: d.customer_phone || '',
          customerCity: d.destination,
          items: d.items,
          status: d.order_status?.toLowerCase().includes('selesai')
            ? 'completed'
            : d.order_status?.toLowerCase().includes('kirim')
            ? 'shipping'
            : d.order_status?.toLowerCase().includes('kemas')
            ? 'packed'
            : 'pending',
          resiNumber: d.resi_number || '',
          courier: d.courier || 'Japan Post EMS',
          date: d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID') : '11 Okt 2026',
        }));
        setRawOrdersList((prev) => {
          const map = new Map(prev.map((o) => [o.orderNumber, o]));
          converted.forEach((c) => map.set(c.orderNumber, c));
          return Array.from(map.values());
        });
      }
    });

    // Sinkronisasi otomatis antar-tab saat Admin mengubah status
    const handleStorageChange = () => loadRealOrders();
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadRealOrders, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Filter pesanan sesuai akun pengguna yang sedang login
  const myOrders = useMemo(() => {
    if (!isLoggedIn || !user) return [];
    if (isAdmin) return rawOrdersList;

    const cleanUserPhone = user.phone ? user.phone.replace(/\D/g, '') : '';
    const cleanUserName = user.name ? user.name.trim().toLowerCase() : '';

    return rawOrdersList.filter((o) => {
      // 1. Cocokkan nomor telepon (jika keduanya ada minimal 6 digit)
      const cleanOrderPhone = o.customerPhone ? o.customerPhone.replace(/\D/g, '') : '';
      if (cleanUserPhone.length >= 6 && cleanOrderPhone.length >= 6) {
        if (cleanUserPhone.includes(cleanOrderPhone) || cleanOrderPhone.includes(cleanUserPhone)) {
          return true;
        }
      }
      // 2. Cocokkan nama pelanggan (case insensitive)
      if (cleanUserName && o.customerName) {
        const orderName = o.customerName.trim().toLowerCase();
        if (orderName.includes(cleanUserName) || cleanUserName.includes(orderName)) {
          return true;
        }
      }
      return false;
    });
  }, [rawOrdersList, isLoggedIn, user, isAdmin]);

  // Efek inisialisasi query: Jika user login dan tidak ada query URL, otomatis tampilkan pesanan miliknya
  useEffect(() => {
    if (initialParam) {
      setSearchInput(initialParam);
      setActiveQuery(initialParam);
    } else if (isLoggedIn && myOrders.length > 0 && !activeQuery) {
      setSearchInput(myOrders[0].orderNumber);
      setActiveQuery(myOrders[0].orderNumber);
    }
  }, [initialParam, isLoggedIn, myOrders, activeQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    setActiveQuery(clean);
  };

  const cleanQuery = (activeQuery || '').trim().toUpperCase();

  // Cari pesanan yang cocok dari query (berdasarkan Nomor Pesanan ATAU Nomor Resi)
  const matchedOrder = useMemo(() => {
    if (!cleanQuery) return null;
    return rawOrdersList.find((o) => {
      const code = (o.orderNumber || '').toUpperCase();
      const resi = (o.resiNumber || '').toUpperCase();
      return code === cleanQuery || (resi && resi === cleanQuery);
    });
  }, [cleanQuery, rawOrdersList]);

  // Tentukan pesanan aktif yang ditampilkan
  const currentOrder: TrackingOrderModel | null = useMemo(() => {
    // 1. Jika ada pencarian spesifik yang cocok di database/admin
    if (matchedOrder) return matchedOrder;

    // 2. Jika user memasukkan resi/kode custom tapi tidak terdaftar di DB
    if (cleanQuery) {
      return {
        id: 'custom-resi',
        orderNumber: cleanQuery.startsWith('MPJ') ? cleanQuery : 'MPJ-CUSTOM',
        customerName: 'Pemesan MapahJastip',
        customerCity: 'Indonesia',
        items: 'Paket Kargo Jepang',
        status: 'shipping',
        courier: cleanQuery.endsWith('JP') ? 'Japan Post EMS' : 'Kargo Internasional',
        resiNumber: cleanQuery,
        date: 'Waktu Pengiriman',
        shippingDate: 'Dalam Proses Kargo',
      };
    }

    // 3. Jika pengguna SUDAH LOGIN dan memiliki pesanan sendiri: tampilkan pesanan pertama miliknya
    if (isLoggedIn && myOrders.length > 0) {
      return myOrders[0];
    }

    // 4. JIKA BELUM LOGIN DAN TIDAK MENCARI: JANGAN TAMPILKAN PESANAN SIAPAPUN (null)
    return null;
  }, [matchedOrder, cleanQuery, isLoggedIn, myOrders]);

  const activeResi = currentOrder?.resiNumber || (cleanQuery.endsWith('JP') ? cleanQuery : '');

  const handleCopyResi = () => {
    if (!activeResi) return;
    navigator.clipboard.writeText(activeResi);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // URL link resmi direct tracking
  const japanPostDirectUrl = activeResi
    ? `https://trackings.post.japanpost.jp/services/srv/search/direct?locale=en&reqCodeNo1=${encodeURIComponent(
        activeResi
      )}`
    : 'https://trackings.post.japanpost.jp/services/srv/search/input?locale=en';
  const track17Url = activeResi ? `https://t.17track.net/en#nums=${encodeURIComponent(activeResi)}` : 'https://t.17track.net';
  const posIndonesiaUrl = 'https://posindonesia.co.id/id/tracking';

  const waInquiryUrl = currentOrder
    ? generateWhatsAppUrl(
        `Halo Admin MapahJastip,\nSaya ingin menanyakan update pesanan saya:\nNo. Pesanan: *${currentOrder.orderNumber}*\nResi: *${activeResi || 'Belum Ada'}*\nNama: *${currentOrder.customerName}*\nBarang: *${currentOrder.items}*.\nMohon bantuannya ya kak. Terima kasih!`
      )
    : generateWhatsAppUrl('Halo Admin MapahJastip, saya ingin menanyakan status pesanan jastip saya.');

  return (
    <div className="w-full bg-surface pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 shadow-xs">
            <span className="material-symbols-outlined text-[17px] animate-pulse">local_shipping</span>
            <span>PELACAKAN REAL-TIME • TOKYO / JEPANG ➔ INDONESIA</span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-on-surface font-extrabold tracking-tight">
            Lacak Resi Kargo &amp; Status Titipan
          </h1>
          <p className="font-body-md text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pantau tahapan belanja personal shopper dan nomor resi kargo resmi Japan Post EMS langsung sesuai akun Anda.
          </p>
        </div>

        {/* Input Bar Card */}
        <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-3xl border border-border-subtle shadow-md space-y-4">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-xs">
              <label htmlFor="orderSearchInput" className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-primary">barcode_scanner</span>
                <span>Masukkan Nomor Pesanan / Nomor Resi Japan Post:</span>
              </label>
              <span className="text-[11px] text-text-secondary">
                Contoh: #MPJ-071820 atau EJ892014820JP
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">
                  numbers
                </span>
                <input
                  id="orderSearchInput"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ketik No. Pesanan (#MPJ-...) atau Resi (EJ...JP)"
                  className="w-full pl-11 pr-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-mono text-sm sm:text-base font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary border border-border-subtle"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Lacak Pesanan</span>
              </button>
            </div>
          </form>

          {/* Quick Select Chips — HANYA TAMPIL JIKA USER SUDAH LOGIN & MEMILIKI PESANAN MILIKNYA SENDIRI */}
          {isLoggedIn && myOrders.length > 0 && (
            <div className="pt-2 border-t border-border-subtle/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-text-secondary font-medium">
                {isAdmin ? 'Daftar Pesanan (Admin):' : 'Pesanan Saya:'}
              </span>
              {myOrders.slice(0, 5).map((ord) => {
                const statusLabel =
                  ord.status === 'completed'
                    ? '✅ Selesai'
                    : ord.status === 'shipping'
                    ? '🚚 Dikirim'
                    : ord.status === 'packed'
                    ? '📦 Dikemas'
                    : '⏳ Menunggu';
                return (
                  <button
                    key={ord.orderNumber}
                    type="button"
                    onClick={() => {
                      setSearchInput(ord.orderNumber);
                      setActiveQuery(ord.orderNumber);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      currentOrder?.orderNumber === ord.orderNumber
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-surface-container-low text-on-surface border-border-subtle hover:bg-surface-light-blue'
                    }`}
                  >
                    <span className="font-mono">#{ord.orderNumber}</span>
                    <span className="font-normal opacity-90">({ord.customerName.split(' ')[0]})</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        currentOrder?.orderNumber === ord.orderNumber
                          ? 'bg-white/20 text-white'
                          : 'bg-surface-container-high text-text-secondary'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* KONTEN UTAMA: JIKA ADA PESANAN YANG DIPILIH / DILACAK */}
        {currentOrder ? (
          <div className="bg-surface-container-lowest rounded-3xl border border-border-subtle shadow-md overflow-hidden space-y-6">
            
            {/* Notifikasi jika dilacak secara publik tanpa login */}
            {!isLoggedIn && (
              <div className="bg-blue-50 dark:bg-blue-950/40 px-6 py-2.5 border-b border-blue-100 dark:border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-blue-700 dark:text-blue-300 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>Menampilkan hasil pelacakan publik untuk <strong>#{currentOrder.orderNumber}</strong></span>
                </span>
                <Link to="/masuk" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Masuk ke akun untuk menyimpan pesanan ➔
                </Link>
              </div>
            )}

            {/* Header Status Bar (Sama Persis dengan Kategori Admin) */}
            <div className="p-6 sm:p-7 border-b border-border-subtle/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/50">
              <div className="space-y-1">
                <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">
                  Nomor Pesanan Titipan
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-mono text-primary">
                  #{currentOrder.orderNumber}
                </h2>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>
                    Pemesan:{' '}
                    <strong className="text-on-surface">
                      {!isLoggedIn && currentOrder.customerName.length > 5
                        ? `${currentOrder.customerName.slice(0, 3)}***`
                        : currentOrder.customerName}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>Tujuan: <strong className="text-on-surface">{currentOrder.customerCity}</strong></span>
                </div>
              </div>

              {/* Badge Status Manual (4 Tahap Sinkron Admin) */}
              <div className="self-start sm:self-auto">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold shadow-2xs ${
                    currentOrder.status === 'completed'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : currentOrder.status === 'shipping'
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                      : currentOrder.status === 'packed'
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      currentOrder.status === 'completed'
                        ? 'bg-emerald-500'
                        : currentOrder.status === 'shipping'
                        ? 'bg-purple-500 animate-ping'
                        : currentOrder.status === 'packed'
                        ? 'bg-blue-500'
                        : 'bg-amber-500 animate-pulse'
                    }`}
                  />
                  <span>
                    {currentOrder.status === 'completed'
                      ? '✅ 4. Pesanan Telah Selesai Diterima'
                      : currentOrder.status === 'shipping'
                      ? `🚚 3. Sedang Dikirim (${currentOrder.courier || 'Japan Post EMS'})`
                      : currentOrder.status === 'packed'
                      ? '📦 2. Sudah Dikemas (Tokyo Hub)'
                      : '⏳ 1. Menunggu Belanja di Tokyo'}
                  </span>
                </span>
              </div>
            </div>

            {/* Rincian Barang Titipan */}
            <div className="px-6 sm:px-7">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-border-subtle text-xs space-y-1">
                <span className="text-text-secondary font-semibold">Barang Titipan Belanja:</span>
                <p className="text-on-surface font-bold text-sm leading-relaxed">{currentOrder.items}</p>
              </div>
            </div>

            {/* TIMELINE 4 TAHAPAN MANUAL (100% SAMA & SINKRON DENGAN ADMIN) */}
            <div className="px-6 sm:px-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm sm:text-base text-on-surface">
                  Progres Pelacakan Pesanan
                </h3>
                <span className="text-[11px] text-text-secondary font-medium">
                  Dikonfirmasi Langsung oleh Admin &amp; Shopper
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-subtle">
                
                {/* TAHAP 1: PESANAN DIKONFIRMASI */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    <span className="material-symbols-outlined text-[15px]">check</span>
                  </div>
                  <div className="flex-1 bg-surface-container-low p-4 rounded-2xl border border-border-subtle/80 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <strong className="text-xs sm:text-sm text-on-surface font-bold">
                        1. Pesanan Dikonfirmasi &amp; Masuk Antrean Belanja
                      </strong>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {currentOrder.date || 'Waktu Checkout'}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Pesanan telah diverifikasi oleh sistem. Personal shopper MapahJastip menjadwalkan kunjungan belanja ke toko resmi di Tokyo / Osaka.
                    </p>
                    <span className="text-[10px] text-text-secondary font-medium block pt-1">
                      📍 Lokasi: Sistem MapahJastip • Tokyo Hub
                    </span>
                  </div>
                </div>

                {/* TAHAP 2: SUDAH DIBELI & DIKEMAS */}
                {(() => {
                  const isDone = ['packed', 'shipping', 'completed'].includes(currentOrder.status);
                  const isCurrent = currentOrder.status === 'pending';
                  return (
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-surface-container-high text-text-secondary border border-border-subtle'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isDone ? 'check' : isCurrent ? 'hourglass_top' : 'inventory_2'}
                        </span>
                      </div>
                      <div className="flex-1 bg-surface-container-low p-4 rounded-2xl border border-border-subtle/80 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <strong className="text-xs sm:text-sm text-on-surface font-bold">
                            2. Pembelian di Toko Tokyo &amp; Pengemasan Bubble Wrap
                          </strong>
                          <span
                            className={`text-[11px] font-mono font-bold ${
                              isDone
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : isCurrent
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-text-secondary'
                            }`}
                          >
                            {currentOrder.packedDate || (isDone ? 'Selesai Dikemas' : isCurrent ? 'Sedang Dibelikan' : 'Menunggu')}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {isDone
                            ? 'Barang asli telah selesai dibeli di toko resmi Jepang dan dibungkus bubble wrap lapis 3 standar kargo aman.'
                            : 'Shopper sedang hunting & membeli barang titipan Anda langsung di gerai resmi Jepang.'}
                        </p>
                        <span className="text-[10px] text-text-secondary font-medium block pt-1">
                          📍 Lokasi: Official Store Tokyo ➔ Tokyo Hub (Shibuya)
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* TAHAP 3: PENGIRIMAN KARGO (JAPAN POST EMS / KURIR) */}
                {(() => {
                  const isDone = ['shipping', 'completed'].includes(currentOrder.status);
                  const isPacked = currentOrder.status === 'packed';
                  return (
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isPacked
                            ? 'bg-purple-600 text-white animate-pulse'
                            : 'bg-surface-container-high text-text-secondary border border-border-subtle'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isDone ? 'check' : 'local_shipping'}
                        </span>
                      </div>
                      <div className="flex-1 bg-surface-container-low p-4 rounded-2xl border border-border-subtle/80 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <strong className="text-xs sm:text-sm text-on-surface font-bold">
                            3. Pengiriman Kargo Udara ({currentOrder.courier || 'Japan Post EMS'})
                          </strong>
                          <span
                            className={`text-[11px] font-mono font-bold ${
                              isDone
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : isPacked
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-text-secondary'
                            }`}
                          >
                            {currentOrder.shippingDate || (isDone ? 'Dalam Perjalanan' : isPacked ? 'Siap Diberangkatkan' : 'Menunggu')}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {isDone
                            ? `Paket kargo telah diserahkan dan dipindai barcode internasional oleh ${currentOrder.courier || 'Japan Post EMS'}. Menuju Indonesia.`
                            : isPacked
                            ? 'Paket telah selesai dibeli & dikemas rapi bubble wrap. Menunggu proses serah terima dan nomor resi kargo resmi.'
                            : 'Paket menunggu serah terima ke loket kargo internasional bandara.'}
                        </p>

                        {/* Notifikasi jika resi belum diinput admin */}
                        {!activeResi && isPacked && (
                          <div className="p-3 rounded-xl bg-surface-container-lowest border border-dashed border-border-subtle flex items-center gap-2 mt-2 text-xs text-text-secondary">
                            <span className="material-symbols-outlined text-[17px] text-blue-500">schedule</span>
                            <span>Nomor resi resmi ({currentOrder.courier || 'Japan Post EMS'}) akan aktif otomatis di sini segera setelah Admin menginput nomor resi kargo.</span>
                          </div>
                        )}

                        {/* Display Nomor Resi Kargo Resmi */}
                        {activeResi && (
                          <div className="p-3 rounded-xl bg-surface-container-lowest border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-text-secondary font-medium">Nomor Resi Resmi:</span>
                              <span className="font-mono font-extrabold text-sm text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg">
                                {activeResi}
                              </span>
                              <button
                                type="button"
                                onClick={handleCopyResi}
                                className="p-1 rounded text-text-secondary hover:text-primary transition-colors cursor-pointer"
                                title="Salin Resi"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  {isCopied ? 'check' : 'content_copy'}
                                </span>
                              </button>
                            </div>

                            {/* Tombol Langsung Cek di Web Kargo Resmi */}
                            <div className="flex items-center gap-2">
                              <a
                                href={japanPostDirectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                              >
                                <span>Cek Web Resmi Japan Post</span>
                                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                              </a>
                              <a
                                href={track17Url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary/10 text-primary text-[11px] font-bold border border-border-subtle transition-all cursor-pointer"
                              >
                                <span>17TRACK</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* TAHAP 4: SELESAI */}
                {(() => {
                  const isDone = currentOrder.status === 'completed';
                  return (
                    <div className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-surface-container-high text-text-secondary border border-border-subtle'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isDone ? 'done_all' : 'check_circle'}
                        </span>
                      </div>
                      <div className="flex-1 bg-surface-container-low p-4 rounded-2xl border border-border-subtle/80 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <strong className="text-xs sm:text-sm text-on-surface font-bold">
                            4. Pesanan Telah Selesai Diterima
                          </strong>
                          <span
                            className={`text-[11px] font-mono font-bold ${
                              isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-secondary'
                            }`}
                          >
                            {currentOrder.completedDate || (isDone ? 'Selesai' : 'Estimasi Pengantaran')}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {isDone
                            ? 'Paket titipan telah berhasil diterima oleh pemesan dalam kondisi baik dan aman. Transaksi selesai.'
                            : 'Kurir Pos Indonesia / kurir domestik akan mengantarkan pesanan sampai ke depan pintu Anda.'}
                        </p>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Quick Action Portals Bar */}
            <div className="p-6 sm:p-7 pt-2 border-t border-border-subtle/80 space-y-3">
              <h4 className="font-bold text-xs sm:text-sm text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">public</span>
                <span>Pilihan Portal Pelacakan Kargo Resmi:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={japanPostDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-red-500/30 hover:border-red-600 bg-red-500/5 hover:bg-red-500/10 transition-all flex flex-col justify-between space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-red-600 dark:text-red-400">JAPAN POST EMS</span>
                    <span className="material-symbols-outlined text-[15px] text-red-600">arrow_forward</span>
                  </div>
                  <p className="text-xs font-bold text-on-surface">Web Resmi Japan Post</p>
                  <span className="text-[10px] text-text-secondary">Tracking data Tokyo Hub</span>
                </a>

                <a
                  href={track17Url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-border-subtle hover:border-primary bg-surface-container-low hover:bg-primary/5 transition-all flex flex-col justify-between space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-primary">17TRACK GLOBAL</span>
                    <span className="material-symbols-outlined text-[15px] text-primary">arrow_forward</span>
                  </div>
                  <p className="text-xs font-bold text-on-surface">Universal Tracker</p>
                  <span className="text-[10px] text-text-secondary">Multi-ekspedisi kargo</span>
                </a>

                <a
                  href={posIndonesiaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-border-subtle hover:border-orange-500 bg-surface-container-low hover:bg-orange-500/5 transition-all flex flex-col justify-between space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-orange-600 dark:text-orange-400">POS INDONESIA</span>
                    <span className="material-symbols-outlined text-[15px] text-orange-600">arrow_forward</span>
                  </div>
                  <p className="text-xs font-bold text-on-surface">Pos Indonesia EMS</p>
                  <span className="text-[10px] text-text-secondary">Cek saat tiba di Indonesia</span>
                </a>
              </div>
            </div>

            {/* Bottom WhatsApp Support */}
            <div className="p-6 bg-surface-container-low border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <h5 className="font-bold text-xs sm:text-sm text-on-surface">
                  Butuh Bantuan Update Posisi Paket?
                </h5>
                <p className="text-xs text-text-secondary">
                  Admin siap membantu cek posisi kargo Anda langsung ke shopper kami di Tokyo.
                </p>
              </div>
              <a
                href={waInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer active:scale-98"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Hubungi Admin via WhatsApp</span>
              </a>
            </div>

          </div>
        ) : !isLoggedIn ? (
          /* TAMPILAN JIKA PENGUNJUNG BELUM LOGIN (AMAN, PRIVASI TERJAGA & TIDAK MEMUNCULKAN NAMA ORANG LAIN) */
          <div className="bg-surface-container-lowest rounded-3xl border border-border-subtle shadow-md p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[36px]">lock</span>
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-black text-on-surface">
                Masuk untuk Melihat Status Pesanan Anda
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Demi menjaga privasi dan keamanan data belanja Anda, riwayat dan progres belanja personal shopper hanya dimuat otomatis setelah Anda masuk ke akun terdaftar Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/masuk"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Masuk / Daftar Akun</span>
              </Link>
            </div>

            <div className="pt-6 border-t border-border-subtle/60 max-w-md mx-auto text-xs text-text-secondary leading-relaxed">
              <p>
                💡 <strong>Belum punya akun atau pesan via WhatsApp?</strong> Anda dapat mengetikkan <strong>Nomor Pesanan</strong> (contoh: <code className="font-mono text-primary font-bold">#MPJ-071820</code>) atau <strong>Nomor Resi Kargo</strong> pada kolom pencarian di atas untuk melacak secara langsung tanpa login.
              </p>
            </div>
          </div>
        ) : (
          /* TAMPILAN JIKA SUDAH LOGIN TAPI BELUM MEMILIKI PESANAN DI AKUNNYA */
          <div className="bg-surface-container-lowest rounded-3xl border border-border-subtle shadow-md p-8 sm:p-12 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">inventory_2</span>
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                Halo, {user?.name}!
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Belum ada riwayat pesanan titipan aktif yang tercatat pada akun ini. Jika Anda memegang invoice / nomor pesanan dari admin, ketikkan di kolom pencarian di atas.
              </p>
            </div>
            <div className="pt-3">
              <Link
                to="/produk"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-primary-dark transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>Mulai Titip Belanja Sekarang</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
