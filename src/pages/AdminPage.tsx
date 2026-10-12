import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { DUMMY_PRODUCTS } from '../constants/dummyProducts';
import { Product } from '../types/product';
import { formatIdr, formatJpy } from '../utils/currency';
import { useExchangeRate } from '../context/ExchangeRateContext';
import { useAuth } from '../context/AuthContext';
import { fetchOrdersFromSupabase, updateOrderStatusInSupabase, deleteOrderFromSupabase, createOrderInSupabase } from '../services/supabase';
import { compressImage } from '../utils/imageCompressor';

// Types for Real Admin Orders
export interface AdminOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress?: string;
  items: string;
  totalIdr: number;
  status: 'pending' | 'packed' | 'shipping' | 'completed' | 'purchased' | 'arrived_id';
  resiNumber?: string;
  courier?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  notes?: string;
  packedDate?: string;
  shippingDate?: string;
  completedDate?: string;
}

// Types for Admin Flight Kloter
export interface AdminFlight {
  id: string;
  flightCode: string;
  airline: 'ANA' | 'JAL' | 'Garuda';
  airlineName: string;
  route: string;
  depDate: string;
  depTime: string;
  arrTime: string;
  remainingQuotaKg: number;
  status: 'open' | 'boarding' | 'closed';
}

const INITIAL_ADMIN_FLIGHTS: AdminFlight[] = [
  {
    id: 'fl-1',
    flightCode: 'NH855',
    airline: 'ANA',
    airlineName: 'All Nippon Airways',
    route: 'Tokyo Haneda (HND) ➔ Soekarno Hatta (CGK)',
    depDate: '12 Okt 2026',
    depTime: '10:20 JST',
    arrTime: '16:20 WIB',
    remainingQuotaKg: 18,
    status: 'open',
  },
  {
    id: 'fl-2',
    flightCode: 'JL725',
    airline: 'JAL',
    airlineName: 'Japan Airlines',
    route: 'Tokyo Narita (NRT) ➔ Soekarno Hatta (CGK)',
    depDate: '14 Okt 2026',
    depTime: '10:50 JST',
    arrTime: '16:55 WIB',
    remainingQuotaKg: 32,
    status: 'open',
  },
  {
    id: 'fl-3',
    flightCode: 'GA875',
    airline: 'Garuda',
    airlineName: 'Garuda Indonesia',
    route: 'Tokyo Haneda (HND) ➔ Soekarno Hatta (CGK)',
    depDate: '17 Okt 2026',
    depTime: '11:45 JST',
    arrTime: '17:35 WIB',
    remainingQuotaKg: 45,
    status: 'boarding',
  },
  {
    id: 'fl-4',
    flightCode: 'NH835',
    airline: 'ANA',
    airlineName: 'All Nippon Airways',
    route: 'Tokyo Narita (NRT) ➔ Soekarno Hatta (CGK)',
    depDate: '21 Okt 2026',
    depTime: '17:45 JST',
    arrTime: '23:55 WIB',
    remainingQuotaKg: 50,
    status: 'open',
  },
];

export const AdminPage: React.FC = () => {
  const { rate, setCustomRate } = useExchangeRate();
  const { isAdmin } = useAuth();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mapah_admin_auth') === 'true';
  });

  useEffect(() => {
    if (isAdmin) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mapah_admin_auth', 'true');
    }
  }, [isAdmin]);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Mobile Sidebar Toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active Tab: 'orders' | 'products' | 'flights' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'flights' | 'settings'>('orders');

  // Real Orders State (Loaded strictly from real checkout orders, no fake dummy data)
  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mapah_admin_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filter out dummy & sample demo orders
        const cleanOrders = parsed.filter(
          (o: any) =>
            !['ord-101', 'ord-102', 'ord-103', 'ord-104', 'ord-105'].includes(o.id) &&
            !['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820'].includes(o.orderNumber)
        );
        localStorage.setItem('mapah_admin_orders', JSON.stringify(cleanOrders));
        return cleanOrders;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState('');
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    customerCity: '',
    items: '',
    totalIdr: '',
    status: 'pending' as AdminOrder['status'],
    courier: 'Paxel Instant',
  });

  // Manual Tracking & Shipping Modals State
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<AdminOrder | null>(null);
  const [shippingModalOrder, setShippingModalOrder] = useState<AdminOrder | null>(null);
  const [shippingCourierInput, setShippingCourierInput] = useState('Paxel Instant');
  const [shippingResiInput, setShippingResiInput] = useState('');
  const [shippingNotesInput, setShippingNotesInput] = useState('');

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mapah_admin_products');
      return saved ? JSON.parse(saved) : DUMMY_PRODUCTS;
    } catch {
      return DUMMY_PRODUCTS;
    }
  });
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    originalNameJp: '',
    category: 'skincare',
    categoryLabel: 'Skincare & Beauty',
    storeBadge: 'Tokyo Official Store',
    priceJpy: 1500,
    priceIdr: 175000,
    weightG: 350,
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    description: '',
    stockStatus: 'available' as Product['stockStatus'],
  });
  const [productImageMode, setProductImageMode] = useState<'upload' | 'url'>('upload');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [compressedImageSize, setCompressedImageSize] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flights State
  const [flights, setFlights] = useState<AdminFlight[]>(() => {
    try {
      const saved = localStorage.getItem('mapah_admin_flights');
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_FLIGHTS;
    } catch {
      return INITIAL_ADMIN_FLIGHTS;
    }
  });
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const [newFlight, setNewFlight] = useState({
    flightCode: 'NH855',
    airline: 'ANA' as AdminFlight['airline'],
    airlineName: 'All Nippon Airways',
    route: 'Tokyo Haneda (HND) ➔ Soekarno Hatta (CGK)',
    depDate: '',
    depTime: '10:20 JST',
    arrTime: '16:20 WIB',
    remainingQuotaKg: 25,
    status: 'open' as AdminFlight['status'],
  });

  // Settings State
  const [customRateInput, setCustomRateInput] = useState<string>(rate.toString());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Live Clocks
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tokyoTimeString = currentTime.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Tokyo',
    hour: '2-digit',
    minute: '2-digit',
  });
  const jktTimeString = currentTime.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('mapah_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mapah_admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mapah_admin_flights', JSON.stringify(flights));
  }, [flights]);

  // Sync Real Orders from Supabase Cloud Database
  useEffect(() => {
    fetchOrdersFromSupabase().then((dbOrders) => {
      if (dbOrders && dbOrders.length > 0) {
        setOrders((prev) => {
          const map = new Map(prev.map((o) => [o.orderNumber, o]));
          dbOrders
            .filter((dbo) => !['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820'].includes(dbo.order_number))
            .forEach((dbo) => {
              const existing = map.get(dbo.order_number);
              if (existing) {
                map.set(dbo.order_number, {
                  ...existing,
                  customerName: dbo.customer_name || existing.customerName,
                  customerPhone: dbo.customer_phone || existing.customerPhone,
                  courier: dbo.courier || existing.courier,
                  resiNumber: dbo.resi_number !== undefined ? dbo.resi_number : existing.resiNumber,
                  totalIdr: dbo.total_amount ? Number(dbo.total_amount) : existing.totalIdr,
                  customerAddress: dbo.customer_address || existing.customerAddress,
                  paymentMethod: dbo.payment_method || existing.paymentMethod,
                  paymentStatus: dbo.payment_status || existing.paymentStatus,
                });
              } else {
                map.set(dbo.order_number, {
                  id: dbo.id,
                  orderNumber: dbo.order_number,
                  date: dbo.created_at ? new Date(dbo.created_at).toLocaleDateString('id-ID') : '11 Okt 2026',
                  customerName: dbo.customer_name,
                  customerPhone: dbo.customer_phone || '-',
                  customerCity: dbo.destination,
                  customerAddress: dbo.customer_address,
                  items: dbo.items,
                  totalIdr: dbo.total_amount ? Number(dbo.total_amount) : 450000,
                  status: dbo.order_status.toLowerCase().includes('selesai')
                    ? 'completed'
                    : dbo.order_status.toLowerCase().includes('kirim')
                    ? 'shipping'
                    : dbo.order_status.toLowerCase().includes('kemas')
                    ? 'packed'
                    : 'pending',
                  resiNumber: dbo.resi_number,
                  courier: dbo.courier,
                  paymentMethod: dbo.payment_method || 'bca',
                  paymentStatus: dbo.payment_status || 'pending',
                  notes: dbo.notes,
                });
              }
            });
          return Array.from(map.values());
        });
      }
    });
  }, []);

  // Refresh & Sync Orders Handler
  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    try {
      const dbOrders = await fetchOrdersFromSupabase();
      const saved = localStorage.getItem('mapah_admin_orders');
      const localList = saved ? JSON.parse(saved) : [];
      const cleanLocal = localList.filter(
        (o: any) =>
          !['ord-101', 'ord-102', 'ord-103', 'ord-104', 'ord-105'].includes(o.id) &&
          !['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820'].includes(o.orderNumber)
      );

      const map = new Map<string, AdminOrder>(cleanLocal.map((o: AdminOrder) => [o.orderNumber, o]));
      (dbOrders || [])
        .filter((dbo) => !['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820'].includes(dbo.order_number))
        .forEach((dbo) => {
          const existing = map.get(dbo.order_number);
          if (existing) {
            map.set(dbo.order_number, {
              ...existing,
              customerName: dbo.customer_name || existing.customerName,
              customerPhone: dbo.customer_phone || existing.customerPhone,
              courier: dbo.courier || existing.courier,
              resiNumber: dbo.resi_number !== undefined ? dbo.resi_number : existing.resiNumber,
              totalIdr: dbo.total_amount ? Number(dbo.total_amount) : existing.totalIdr,
              customerAddress: dbo.customer_address || existing.customerAddress,
              paymentMethod: dbo.payment_method || existing.paymentMethod,
              paymentStatus: dbo.payment_status || existing.paymentStatus,
            });
          } else {
            map.set(dbo.order_number, {
              id: dbo.id,
              orderNumber: dbo.order_number,
              date: dbo.created_at ? new Date(dbo.created_at).toLocaleDateString('id-ID') : '11 Okt 2026',
              customerName: dbo.customer_name,
              customerPhone: dbo.customer_phone || '-',
              customerCity: dbo.destination,
              customerAddress: dbo.customer_address,
              items: dbo.items,
              totalIdr: dbo.total_amount ? Number(dbo.total_amount) : 450000,
              status: dbo.order_status.toLowerCase().includes('selesai')
                ? 'completed'
                : dbo.order_status.toLowerCase().includes('kirim')
                ? 'shipping'
                : dbo.order_status.toLowerCase().includes('kemas')
                ? 'packed'
                : 'pending',
              resiNumber: dbo.resi_number,
              courier: dbo.courier,
              paymentMethod: dbo.payment_method || 'bca',
              paymentStatus: dbo.payment_status || 'pending',
              notes: dbo.notes,
            });
          }
        });

      const merged = Array.from(map.values());
      localStorage.setItem('mapah_admin_orders', JSON.stringify(merged));
      setOrders(merged);
      setRefreshToast('Data pesanan berhasil disinkronkan & diperbarui!');
      setTimeout(() => setRefreshToast(''), 3000);
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Auth Handlers
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === 'admin88' || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mapah_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('PIN salah! Gunakan PIN: admin88 atau klik tombol Login Cepat.');
    }
  };

  const handleQuickLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('mapah_admin_auth', 'true');
    setPinError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mapah_admin_auth');
    setPinInput('');
  };

  // Formatted Timestamp Helper
  const getFormattedNow = () => {
    return new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Orders Handlers & Manual Tracking Confirmations
  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const statusText =
            newStatus === 'completed'
              ? '4. Pesanan Selesai Diterima'
              : newStatus === 'shipping'
              ? `3. Sedang Dikirim (${o.courier || 'Kurir Domestik'})`
              : newStatus === 'packed'
              ? '2. Sudah Dikemas di Tokyo Hub'
              : '1. Menunggu Belanja di Tokyo';
          const percent = newStatus === 'completed' ? 100 : newStatus === 'shipping' ? 75 : newStatus === 'packed' ? 50 : 25;
          updateOrderStatusInSupabase(o.orderNumber, statusText, percent, o.resiNumber);
          return { ...o, status: newStatus };
        }
        return o;
      })
    );
    if (selectedTrackingOrder && selectedTrackingOrder.id === orderId) {
      setSelectedTrackingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // 1. Manual Confirmation: Sudah Dikemas
  const handleConfirmPacked = (orderId: string) => {
    const now = getFormattedNow();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          updateOrderStatusInSupabase(o.orderNumber, '2. Sudah Dikemas di Tokyo Hub', 50, o.resiNumber);
          return {
            ...o,
            status: 'packed',
            packedDate: now,
          };
        }
        return o;
      })
    );
    if (selectedTrackingOrder && selectedTrackingOrder.id === orderId) {
      setSelectedTrackingOrder((prev) =>
        prev ? { ...prev, status: 'packed', packedDate: now } : null
      );
    }
  };

  // 2. Open Shipping & Resi Modal
  const handleOpenShippingModal = (order: AdminOrder) => {
    setShippingModalOrder(order);
    setShippingCourierInput(order.courier || 'Paxel Instant');
    setShippingResiInput(order.resiNumber || '');
    setShippingNotesInput('');
  };

  // 2. Submit Shipping Confirmation & Save Resi
  const handleConfirmShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingModalOrder) return;
    const now = getFormattedNow();
    const orderId = shippingModalOrder.id;
    const courier = shippingCourierInput || 'Paxel Instant';
    const resi =
      shippingResiInput.trim() ||
      `PXL-${Date.now().toString().slice(-6)}`;

    updateOrderStatusInSupabase(shippingModalOrder.orderNumber, `3. Sedang Dikirim (${courier})`, 75, resi);

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'shipping',
              courier,
              resiNumber: resi,
              shippingDate: now,
            }
          : o
      )
    );

    if (selectedTrackingOrder && selectedTrackingOrder.id === orderId) {
      setSelectedTrackingOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'shipping',
              courier,
              resiNumber: resi,
              shippingDate: now,
            }
          : null
      );
    }

    setShippingModalOrder(null);
  };

  // 3. Manual Confirmation: Selesai
  const handleConfirmCompleted = (orderId: string) => {
    const now = getFormattedNow();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          updateOrderStatusInSupabase(o.orderNumber, '4. Pesanan Selesai Diterima', 100, o.resiNumber);
          return {
            ...o,
            status: 'completed',
            completedDate: now,
          };
        }
        return o;
      })
    );
    if (selectedTrackingOrder && selectedTrackingOrder.id === orderId) {
      setSelectedTrackingOrder((prev) =>
        prev ? { ...prev, status: 'completed', completedDate: now } : null
      );
    }
  };


  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Yakin ingin menghapus data pesanan ini secara permanen?')) {
      const target = orders.find((o) => o.id === orderId);
      const targetOrderNumber = target?.orderNumber;

      // 1. Hapus dari state
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedTrackingOrder && selectedTrackingOrder.id === orderId) {
        setSelectedTrackingOrder(null);
      }

      // 2. Hapus dari localStorage
      try {
        const saved = localStorage.getItem('mapah_admin_orders');
        if (saved) {
          const localList = JSON.parse(saved);
          const filtered = localList.filter((o: any) => o.id !== orderId && o.orderNumber !== targetOrderNumber);
          localStorage.setItem('mapah_admin_orders', JSON.stringify(filtered));
        }
      } catch (err) {
        console.warn('LocalStorage remove order error:', err);
      }

      // 3. Hapus permanen dari Supabase Cloud Database
      if (targetOrderNumber || orderId) {
        try {
          await deleteOrderFromSupabase(targetOrderNumber || '', orderId);
        } catch (err) {
          console.warn('Supabase delete order error:', err);
        }
      }
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customerName || !newOrder.items) return;

    const orderNum = `MPJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const created: AdminOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      orderNumber: orderNum,
      date: getFormattedNow(),
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone.replace(/\D/g, ''),
      customerCity: newOrder.customerCity || 'Jakarta',
      items: newOrder.items,
      totalIdr: Number(newOrder.totalIdr) || 500000,
      status: newOrder.status,
      courier: newOrder.courier,
      resiNumber: '',
    };

    setOrders([created, ...orders]);
    setIsAddOrderOpen(false);

    // Simpan otomatis ke Supabase Cloud
    createOrderInSupabase({
      order_number: orderNum,
      customer_name: newOrder.customerName,
      customer_phone: newOrder.customerPhone.replace(/\D/g, ''),
      customer_email: '',
      customer_address: '',
      batch_name: newOrder.courier,
      origin: 'Tokyo, Jepang 🇯🇵',
      destination: newOrder.customerCity || 'Jakarta',
      courier: newOrder.courier,
      resi_number: '',
      order_status:
        newOrder.status === 'completed'
          ? '4. Pesanan Selesai Diterima'
          : newOrder.status === 'shipping'
          ? `3. Sedang Dikirim (${newOrder.courier})`
          : newOrder.status === 'packed'
          ? '2. Sudah Dikemas di Tokyo Hub'
          : '1. Menunggu Belanja di Tokyo',
      progress_percent:
        newOrder.status === 'completed' ? 100 : newOrder.status === 'shipping' ? 75 : newOrder.status === 'packed' ? 50 : 25,
      est_arrival: '3-5 Hari Kerja',
      items: newOrder.items,
      total_amount: Number(newOrder.totalIdr) || 500000,
      payment_method: 'manual',
      payment_status: 'paid',
      notes: 'Pesanan manual via Admin Portal',
    });

    setNewOrder({
      customerName: '',
      customerPhone: '',
      customerCity: '',
      items: '',
      totalIdr: '',
      status: 'pending',
      courier: 'Paxel Instant',
    });
  };

  const getWhatsAppMessageUrl = (order: AdminOrder) => {
    let statusText = '';
    if (order.status === 'packed' || order.status === 'purchased' || order.status === 'arrived_id') {
      statusText = `*SUDAH SELESAI DIBELI & DIKEMAS* di Tokyo Hub dengan bubble wrap lapis 3 & lolos inspeksi fisik. Menunggu jadwal penerbangan handcarry Tokyo ➔ Jakarta.`;
    } else if (order.status === 'shipping') {
      statusText = `*SEDANG DIKIRIMKAN* via kurir *${order.courier || 'Kurir Domestik'}*!\nNomor Resi: *${order.resiNumber || 'Dalam Proses'}*\nPaket sedang menuju alamat tujuan Anda.`;
    } else if (order.status === 'completed') {
      statusText = `telah *SELESAI DITERIMA*. Terima kasih banyak telah mempercayakan titip belanja Jepang kepada MapahJastip! Arigatou gozaimasu.`;
    } else {
      statusText = `telah kami terima di sistem dan sedang diverifikasi oleh Personal Shopper kami di Tokyo.`;
    }

    const text = encodeURIComponent(
      `Halo Kak ${order.customerName}! 🌸\n\nUpdate dari *MapahJastip* untuk pesanan titipan Anda (*${order.orderNumber}*):\n\nStatus: ${statusText}\n\nBarang: ${order.items}\nTotal: ${formatIdr(order.totalIdr)}\n\nLacak status live pesanan Anda di:\nhttps://mapahjastip.com/#/status-pesanan?order=${order.orderNumber}\n\nTerima kasih!`
    );
    const cleanPhone = order.customerPhone.startsWith('0')
      ? '62' + order.customerPhone.slice(1)
      : order.customerPhone;
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  // Products Handlers
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Hapus produk ini dari katalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleUpdateProductStock = (productId: string, stock: Product['stockStatus']) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockStatus: stock } : p))
    );
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError('');
    setIsCompressingImage(true);

    try {
      const result = await compressImage(file, 800, 0.82);
      setNewProduct((prev) => ({ ...prev, imageUrl: result.dataUrl }));
      setCompressedImageSize(result.sizeKb);
    } catch (err: any) {
      setImageUploadError(err?.message || 'Gagal memproses gambar');
    } finally {
      setIsCompressingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;

    const created: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name,
      originalNameJp: newProduct.originalNameJp || newProduct.name,
      category: newProduct.category,
      categoryLabel: newProduct.categoryLabel,
      storeBadge: newProduct.storeBadge,
      storeLocation: 'Tokyo Official Store',
      weightG: Number(newProduct.weightG) || 350,
      priceJpy: Number(newProduct.priceJpy),
      priceIdr: Number(newProduct.priceIdr),
      imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      description: newProduct.description || 'Titipan produk original langsung dari toko resmi Jepang.',
      stockStatus: newProduct.stockStatus,
      stockLabel: newProduct.stockStatus === 'available' ? 'Ready Tokyo' : 'Slot Terbatas',
      rating: 5.0,
      reviewCount: 1,
    };

    setProducts([created, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      originalNameJp: '',
      category: 'skincare',
      categoryLabel: 'Skincare & Beauty',
      storeBadge: 'Tokyo Official Store',
      priceJpy: 1500,
      priceIdr: 175000,
      weightG: 350,
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      description: '',
      stockStatus: 'available',
    });
    setCompressedImageSize(null);
    setImageUploadError('');
  };

  // Flights Handlers
  const handleUpdateFlightStatus = (flightId: string, status: AdminFlight['status']) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, status } : f))
    );
  };

  const handleUpdateFlightQuota = (flightId: string, quota: number) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, remainingQuotaKg: quota } : f))
    );
  };

  const handleDeleteFlight = (flightId: string) => {
    if (window.confirm('Hapus jadwal kloter penerbangan ini?')) {
      setFlights((prev) => prev.filter((f) => f.id !== flightId));
    }
  };

  const handleCreateFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlight.flightCode || !newFlight.depDate) return;

    const created: AdminFlight = {
      id: `fl-${Date.now()}`,
      flightCode: newFlight.flightCode,
      airline: newFlight.airline,
      airlineName:
        newFlight.airline === 'ANA'
          ? 'All Nippon Airways'
          : newFlight.airline === 'JAL'
          ? 'Japan Airlines'
          : 'Garuda Indonesia',
      route: newFlight.route,
      depDate: newFlight.depDate,
      depTime: newFlight.depTime,
      arrTime: newFlight.arrTime,
      remainingQuotaKg: Number(newFlight.remainingQuotaKg),
      status: newFlight.status,
    };

    setFlights([...flights, created]);
    setIsAddFlightOpen(false);
  };

  // Settings Handlers
  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customRateInput);
    if (!isNaN(parsed) && parsed > 0) {
      setCustomRate(parsed);
      setSaveSuccessMsg(`Kurs Yen berhasil disimpan: 1 JPY = Rp ${parsed.toLocaleString('id-ID')}`);
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  // Computed Real Overview Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalIdr, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length;
  const totalRemainingQuotaKg = flights.reduce((sum, f) => sum + (f.status === 'open' ? f.remainingQuotaKg : 0), 0);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategory === 'all' || p.category === productCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.originalNameJp && p.originalNameJp.toLowerCase().includes(productSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // 1. LOCK SCREEN / LOGIN MODAL IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-[#0A3B72] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 mb-2">
              <Logo className="h-9 w-auto" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/30 text-sky-300 text-xs font-bold border border-sky-400/30">
              Admin Control Center
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Portal Manajemen MapahJastip</h1>
            <p className="text-xs text-slate-300">
              Kelola pesanan asli pelanggan, jadwal kloter penerbangan, produk katalog, dan kurs Yen.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                Masukkan PIN / Sandi Admin:
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ketik PIN (contoh: admin88 atau 1234)"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center font-mono tracking-wider"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-300 mt-1.5 text-center font-semibold">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-white font-bold text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Masuk Dashboard Admin
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs">atau coba instan</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-sky-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
            <span>Login Cepat 1-Klik (Mode Admin)</span>
          </button>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali ke Website Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN DASHBOARD WITH LEFT SIDEBAR LAYOUT
  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* MOBILE BACKDROP FOR SIDEBAR */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* LEFT SIDEBAR (MENU DI SEBELAH KIRI) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } lg:static lg:h-screen lg:shrink-0`}
      >
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Logo & Close button on mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <Logo className="h-8 w-auto" />
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest text-primary uppercase">
                  Admin Control Panel
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Nav Menu Items (Left Side) */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
              Menu Utama
            </span>

            {/* Tab 1: Pesanan */}
            <button
              onClick={() => {
                setActiveTab('orders');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                <span>Manajemen Pesanan</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'orders'
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary dark:bg-primary/20'
                }`}
              >
                {orders.length}
              </span>
            </button>

            {/* Tab 2: Katalog */}
            <button
              onClick={() => {
                setActiveTab('products');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                <span>Katalog Produk</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'products'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {products.length}
              </span>
            </button>

            {/* Tab 3: Jadwal Kloter */}
            <button
              onClick={() => {
                setActiveTab('flights');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'flights'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">flight</span>
                <span>Jadwal Kloter</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'flights'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {flights.length}
              </span>
            </button>

            {/* Tab 4: Pengaturan */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>Pengaturan Kurs &amp; Fee</span>
              </div>
            </button>
          </div>

          {/* Quick Shortcuts to Storefront */}
          <div className="pt-2 space-y-1 border-t border-slate-100 dark:border-slate-800">
            <span className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
              Akses Cepat Website
            </span>

            <Link
              to="/katalog"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">shopping_bag</span>
              <span>Buka Katalog Toko</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">open_in_new</span>
              <span>Lihat Halaman Utama</span>
            </Link>
          </div>
        </div>

        {/* Bottom Sidebar: Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                AD
              </div>
              <div className="min-w-0">
                <strong className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                  Admin MapahJastip
                </strong>
                <span className="block text-[10px] text-slate-400 truncate">Tokyo Hub • Personal Shopper</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
              title="Keluar dari Admin"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Buka Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>

            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'orders' && 'Manajemen Pesanan Pelanggan'}
                {activeTab === 'products' && 'Katalog Produk Jastip'}
                {activeTab === 'flights' && 'Jadwal Kloter Handcarry'}
                {activeTab === 'settings' && 'Pengaturan Kurs Yen & Biaya'}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {activeTab === 'orders' && 'Data pesanan asli dari pelanggan yang melakukan checkout di website.'}
                {activeTab === 'products' && 'Kelola daftar barang belanjaan, harga yen/rupiah, dan status stok.'}
                {activeTab === 'flights' && 'Kelola slot kapasitas bagasi penerbangan Tokyo ➔ Jakarta.'}
                {activeTab === 'settings' && 'Sesuaikan kurs Yen Jepang dan parameter operasional jastip.'}
              </p>
            </div>
          </div>

          {/* Right Info: Live Clocks & Kurs (Bersih & Elegan) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-500 border border-slate-200 dark:border-slate-700">
              <span>Tokyo: <strong className="font-mono text-slate-800 dark:text-slate-200">{tokyoTimeString}</strong> JST</span>
              <span className="text-slate-300">|</span>
              <span>JKT: <strong className="font-mono text-primary">{jktTimeString}</strong> WIB</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <span className="material-symbols-outlined text-[15px]">currency_yen</span>
              <span className="font-mono">1 JPY = Rp {rate.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          {/* KPI Cards (Real Data) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 font-semibold block truncate">Total Pesanan Asli</span>
                <strong className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
                  {orders.length} Pesanan
                </strong>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">payments</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 font-semibold block truncate">Total Nilai Pesanan</span>
                <strong className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 block truncate">
                  {formatIdr(totalRevenue)}
                </strong>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">pending_actions</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 font-semibold block truncate">Titipan Aktif</span>
                <strong className="text-lg sm:text-xl font-black text-slate-900 dark:text-white block">
                  {activeOrdersCount} Diproses
                </strong>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 font-semibold block truncate">Sisa Kuota Bagasi</span>
                <strong className="text-lg sm:text-xl font-black text-purple-600 dark:text-purple-400 block">
                  {totalRemainingQuotaKg} Kg Open
                </strong>
              </div>
            </div>
          </div>

          {/* TAB 1: MANAJEMEN PESANAN (REAL CUSTOMER ORDERS ONLY) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Cari No. Pesanan, nama, atau barang..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-56"
                  />

                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Konfirmasi</option>
                    <option value="purchased">Dibelikan di Tokyo</option>
                    <option value="arrived_id">Tiba di Indonesia</option>
                    <option value="shipping">Dalam Pengiriman Kurir</option>
                    <option value="completed">Selesai</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleRefreshOrders}
                    disabled={isRefreshing}
                    title="Perbarui & sinkronkan data pesanan"
                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-60 shadow-2xs"
                  >
                    <span className={`material-symbols-outlined text-[17px] text-primary ${isRefreshing ? 'animate-spin' : ''}`}>
                      sync
                    </span>
                    <span className="hidden md:inline">{isRefreshing ? 'Memuat...' : 'Refresh'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/katalog"
                    target="_blank"
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Test Checkout Pelanggan</span>
                  </Link>

                  <button
                    onClick={() => setIsAddOrderOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>Tambah Pesanan Manual</span>
                  </button>
                </div>
              </div>

              {/* Orders Table or Empty State */}
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[36px]">inventory_2</span>
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Belum Ada Pesanan Masuk
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sistem siap menerima pesanan asli! Begitu ada pelanggan yang melakukan checkout di katalog website, data pesanan asli mereka akan langsung muncul di tabel ini secara otomatis.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to="/katalog"
                      target="_blank"
                      className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      <span>Buka Toko &amp; Buat Pesanan Tes</span>
                    </Link>
                    <button
                      onClick={() => setIsAddOrderOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>Catat Pesanan Manual (Dari WA)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                          <th className="py-3 px-4">No. Pesanan &amp; Tanggal</th>
                          <th className="py-3 px-4">Pelanggan &amp; Kota</th>
                          <th className="py-3 px-4">Barang Titipan Pelanggan</th>
                          <th className="py-3 px-4">Total Bayar</th>
                          <th className="py-3 px-4 min-w-[210px]">Konfirmasi Tracking Manual</th>
                          <th className="py-3 px-4">Kurir &amp; No. Resi</th>
                          <th className="py-3 px-4 text-center">Aksi &amp; Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              Tidak ada pesanan yang sesuai dengan filter pencarian.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-bold text-primary block">{ord.orderNumber}</span>
                                <span className="text-[11px] text-slate-400 block">{ord.date}</span>
                                {ord.paymentMethod && (
                                  <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 uppercase font-mono">
                                    {ord.paymentMethod} • {ord.paymentStatus || 'pending'}
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <strong className="block text-slate-900 dark:text-white font-semibold">{ord.customerName}</strong>
                                <span className="text-[11px] text-slate-400 block">{ord.customerCity}</span>
                                <span className="text-[10px] text-slate-500 font-mono">WA: {ord.customerPhone}</span>
                              </td>

                              <td className="py-3.5 px-4 max-w-xs">
                                <p className="line-clamp-2 text-slate-700 dark:text-slate-300 font-medium">{ord.items}</p>
                                {ord.customerAddress && (
                                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 block">
                                    Alamat: {ord.customerAddress}
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <strong className="font-mono font-bold text-slate-900 dark:text-white block">
                                  {formatIdr(ord.totalIdr)}
                                </strong>
                              </td>

                              {/* KONFIRMASI TRACKING MANUAL: PENDING -> PACKED -> SHIPPING -> COMPLETED */}
                              <td className="py-3.5 px-4 min-w-[210px]">
                                {ord.status === 'pending' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-800">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                      ⏳ 1. Menunggu Belanja
                                    </span>
                                    <button
                                      onClick={() => handleConfirmPacked(ord.id)}
                                      className="w-full mt-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
                                      title="Admin konfirmasi barang selesai dibeli di toko Tokyo dan dikemas bubble wrap"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">inventory</span>
                                      <span>Konfirmasi Sudah Dikemas</span>
                                    </button>
                                  </div>
                                )}

                                {(ord.status === 'packed' || ord.status === 'purchased' || ord.status === 'arrived_id') && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-[11px] border border-blue-200 dark:border-blue-800">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                      📦 2. Sudah Dikemas (Tokyo Hub)
                                    </span>
                                    {ord.packedDate && (
                                      <span className="block text-[10px] text-slate-400 mt-0.5">Dikemas: {ord.packedDate}</span>
                                    )}
                                    <button
                                      onClick={() => handleOpenShippingModal(ord)}
                                      className="w-full mt-2 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
                                      title="Admin konfirmasi pengiriman paket dan input nomor resi kurir"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                                      <span>Konfirmasi Dikirim &amp; Resi</span>
                                    </button>
                                  </div>
                                )}

                                {ord.status === 'shipping' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-bold text-[11px] border border-purple-200 dark:border-purple-800">
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                      🚚 3. Sedang Dikirim ({ord.courier || 'Kurir'})
                                    </span>
                                    {ord.shippingDate && (
                                      <span className="block text-[10px] text-slate-400 mt-0.5">Dikirim: {ord.shippingDate}</span>
                                    )}
                                    <button
                                      onClick={() => handleConfirmCompleted(ord.id)}
                                      className="w-full mt-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
                                      title="Admin konfirmasi pesanan telah sampai dan diterima dengan selamat oleh pelanggan"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                                      <span>Konfirmasi Selesai</span>
                                    </button>
                                  </div>
                                )}

                                {ord.status === 'completed' && (
                                  <div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
                                      <span className="material-symbols-outlined text-[14px]">done_all</span>
                                      ✅ 4. Pesanan Selesai
                                    </span>
                                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                                      Selesai: {ord.completedDate || ord.date}
                                    </span>
                                  </div>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                                  {ord.courier || 'Paxel Instant'}
                                </span>
                                {ord.resiNumber ? (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                      {ord.resiNumber}
                                    </span>
                                    <button
                                      onClick={() => handleOpenShippingModal(ord)}
                                      className="p-1 rounded text-slate-400 hover:text-primary cursor-pointer"
                                      title="Ubah Kurir / Resi"
                                    >
                                      <span className="material-symbols-outlined text-[14px]">edit</span>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleOpenShippingModal(ord)}
                                    className="mt-1 text-[11px] text-primary hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">add</span>
                                    <span>Input Resi</span>
                                  </button>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedTrackingOrder(ord)}
                                    className="px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Buka Daftar &amp; Detail Tracking Manual"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    <span className="hidden sm:inline">Tracking</span>
                                  </button>

                                  <a
                                    href={getWhatsAppMessageUrl(ord)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 transition-colors"
                                    title="Kirim Update Otomatis via WhatsApp Pelanggan"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">chat</span>
                                  </a>

                                  <button
                                    onClick={() => handleDeleteOrder(ord.id)}
                                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                                    title="Hapus Pesanan"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANAJEMEN PRODUK KATALOG */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Cari nama produk katalog..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
                  />

                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="skincare">Skincare &amp; Beauty</option>
                    <option value="makanan">Makanan &amp; Minuman</option>
                    <option value="fashion">Fashion &amp; Brand</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="karakter">Jepang Character</option>
                    <option value="kesehatan">Vitamin &amp; Kesehatan</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_box</span>
                  <span>Tambah Produk Baru</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                        {prod.categoryLabel || prod.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-400 truncate">
                            {prod.storeBadge}
                          </span>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">
                            <span className="material-symbols-outlined text-[12px]">scale</span>
                            {prod.weightG || 250}g
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">{formatJpy(prod.priceJpy)} (JP)</span>
                            <strong className="text-xs font-bold text-primary font-mono block">
                              {formatIdr(prod.priceIdr)}
                            </strong>
                          </div>

                          <select
                            value={prod.stockStatus || 'available'}
                            onChange={(e) =>
                              handleUpdateProductStock(
                                prod.id,
                                e.target.value as Product['stockStatus']
                              )
                            }
                            className="px-2 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            <option value="available">Ready Tokyo</option>
                            <option value="limited">Slot Terbatas</option>
                            <option value="preorder">Pre-Order</option>
                            <option value="request_size">Request Khusus</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">ID: {prod.id.slice(0, 10)}</span>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">delete</span>
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: JADWAL KLOTER PENERBANGAN */}
          {activeTab === 'flights' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Jadwal Kloter Handcarry Bagasi</h3>
                  <p className="text-xs text-slate-500">Kelola kuota bagasi legal, jadwal terbang maskapai ANA, JAL, dan Garuda.</p>
                </div>

                <button
                  onClick={() => setIsAddFlightOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Tambah Kloter Baru</span>
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-3 px-4">Kode &amp; Maskapai</th>
                        <th className="py-3 px-4">Rute Penerbangan</th>
                        <th className="py-3 px-4">Tanggal Keberangkatan</th>
                        <th className="py-3 px-4">Jam Terbang</th>
                        <th className="py-3 px-4">Sisa Kuota Bagasi (Kg)</th>
                        <th className="py-3 px-4">Status Kloter</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {flights.map((fl) => (
                        <tr key={fl.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <strong className="font-mono font-bold text-primary text-sm block">{fl.flightCode}</strong>
                            <span className="text-[11px] text-slate-500 block">{fl.airlineName}</span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            {fl.route}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                            {fl.depDate}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-500">
                            {fl.depTime} ➔ {fl.arrTime}
                          </td>

                          <td className="py-3.5 px-4">
                            <input
                              type="number"
                              value={fl.remainingQuotaKg}
                              onChange={(e) => handleUpdateFlightQuota(fl.id, Number(e.target.value))}
                              className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-xs"
                            />
                            <span className="text-slate-400 ml-1">kg</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={fl.status}
                              onChange={(e) => handleUpdateFlightStatus(fl.id, e.target.value as AdminFlight['status'])}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${
                                fl.status === 'open'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                  : fl.status === 'boarding'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              <option value="open">🟢 Buka (Open)</option>
                              <option value="boarding">🟡 Boarding / Segera Terbang</option>
                              <option value="closed">🔴 Kloter Tutup</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleDeleteFlight(fl.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                              title="Hapus Kloter"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PENGATURAN KURS & BIAYA JASTIP */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Pengaturan Kurs Yen (JPY ➔ IDR)</h3>
                  <p className="text-xs text-slate-500">
                    Ubah nilai konversi kurs Yen Jepang yang berlaku di kalkulator estimasi dan katalog produk.
                  </p>
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveRate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kurs 1 Yen (JPY) ke Rupiah (IDR):
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        step="0.01"
                        value={customRateInput}
                        onChange={(e) => setCustomRateInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Contoh: 108.50 atau 110.00</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    Simpan Kurs Yen Baru
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Kontak &amp; CS Shopper WhatsApp</h3>
                  <p className="text-xs text-slate-500">
                    Nomor WhatsApp yang dituju pelanggan saat klik konsultasi atau tanya produk.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor WhatsApp Personal Shopper:
                    </label>
                    <input
                      type="text"
                      defaultValue="0812-8090-5425"
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-mono text-xs"
                    />
                    <span className="text-[10.5px] text-slate-400 block mt-0.5">Terkoneksi langsung dengan sistem auto-chat WhatsApp.</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Bersihkan riwayat pesanan yang tersimpan?')) {
                          localStorage.removeItem('mapah_admin_orders');
                          setOrders([]);
                          alert('Daftar pesanan berhasil dibersihkan.');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      Bersihkan Data Pesanan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: TAMBAH PESANAN MANUAL */}
      {isAddOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Tambah Pesanan Baru</h3>
              <button
                onClick={() => setIsAddOrderOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pelanggan:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp:</label>
                  <input
                    type="text"
                    required
                    placeholder="08123456789"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kota Tujuan:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Surabaya"
                    value={newOrder.customerCity}
                    onChange={(e) => setNewOrder({ ...newOrder, customerCity: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Barang Titipan:</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Tokyo Banana 8pcs (2x), Shiseido Fino Mask (1x)"
                  value={newOrder.items}
                  onChange={(e) => setNewOrder({ ...newOrder, items: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Harga (IDR):</label>
                  <input
                    type="number"
                    required
                    placeholder="500000"
                    value={newOrder.totalIdr}
                    onChange={(e) => setNewOrder({ ...newOrder, totalIdr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Awal:</label>
                  <select
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as AdminOrder['status'] })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                  >
                    <option value="pending">Menunggu Konfirmasi</option>
                    <option value="purchased">Dibelikan di Tokyo</option>
                    <option value="arrived_id">Tiba di Indonesia</option>
                    <option value="shipping">Dalam Pengiriman Kurir</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOrderOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Pesanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH PRODUK BARU */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Tambah Produk Katalog Baru</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Produk:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rohto Hada Labo Gokujyun Premium Lotion"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const labelMap: Record<string, string> = {
                        skincare: 'Skincare & Beauty',
                        makanan: 'Makanan & Minuman',
                        fashion: 'Fashion & Brand',
                        elektronik: 'Elektronik',
                        karakter: 'Jepang Character',
                        kesehatan: 'Vitamin & Kesehatan',
                      };
                      setNewProduct({
                        ...newProduct,
                        category: cat,
                        categoryLabel: labelMap[cat] || 'Katalog Pilihan',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <option value="skincare">Skincare &amp; Beauty</option>
                    <option value="makanan">Makanan &amp; Minuman</option>
                    <option value="fashion">Fashion &amp; Brand</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="karakter">Jepang Character</option>
                    <option value="kesehatan">Vitamin &amp; Kesehatan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Toko Asal / Badge:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Don Quijote Shibuya"
                    value={newProduct.storeBadge}
                    onChange={(e) => setNewProduct({ ...newProduct, storeBadge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Yen (JPY):</label>
                  <input
                    type="number"
                    required
                    value={newProduct.priceJpy}
                    onChange={(e) => setNewProduct({ ...newProduct, priceJpy: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Rupiah (IDR):</label>
                  <input
                    type="number"
                    required
                    value={newProduct.priceIdr}
                    onChange={(e) => setNewProduct({ ...newProduct, priceIdr: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ⚖️ Estimasi Berat (Gram):
                  </label>
                  <input
                    type="number"
                    required
                    min="10"
                    placeholder="Contoh: 450"
                    value={newProduct.weightG}
                    onChange={(e) => setNewProduct({ ...newProduct, weightG: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-primary"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Untuk hitung ongkir otomatis
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Ketersediaan:
                  </label>
                  <select
                    value={newProduct.stockStatus}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stockStatus: e.target.value as Product['stockStatus'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <option value="available">Ready Tokyo</option>
                    <option value="limited">Slot Terbatas</option>
                    <option value="preorder">Pre-Order</option>
                    <option value="request_size">Request Khusus</option>
                  </select>
                </div>
              </div>

              {/* Input Gambar: Upload File vs Link URL */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Gambar Produk:
                  </label>
                  {/* Selector Mode: Upload vs Link URL */}
                  <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setProductImageMode('upload')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        productImageMode === 'upload'
                          ? 'bg-white dark:bg-slate-700 text-primary shadow-xs'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                      <span>Upload Foto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductImageMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        productImageMode === 'url'
                          ? 'bg-white dark:bg-slate-700 text-primary shadow-xs'
                          : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">link</span>
                      <span>Pakai Link URL</span>
                    </button>
                  </div>
                </div>

                {productImageMode === 'upload' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    {newProduct.imageUrl ? (
                      <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                        <img
                          src={newProduct.imageUrl}
                          alt="Preview Foto"
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              Terkonversi Ringan
                            </span>
                            {compressedImageSize && (
                              <span className="text-[10px] text-slate-500 font-mono font-bold">
                                ~{compressedImageSize} KB (Hemat Database)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            Gambar siap ditampilkan di katalog tanpa boros penyimpanan
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">change_circle</span>
                              Ganti Foto
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewProduct((prev) => ({ ...prev, imageUrl: '' }));
                                setCompressedImageSize(null);
                              }}
                              className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40 hover:bg-primary/5"
                      >
                        {isCompressingImage ? (
                          <div className="py-2 flex flex-col items-center justify-center gap-1.5">
                            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-primary">Sedang mengompresi gambar otomatis...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                              <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
                            </div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                              Klik untuk pilih foto dari HP / Laptop
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Format JPG, PNG, atau WebP • Otomatis dikompres ringan (&lt;80 KB)
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {imageUploadError && (
                      <p className="text-[11px] text-rose-500 font-medium">{imageUploadError}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://... (contoh: link gambar toko resmi Jepang)"
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                    {newProduct.imageUrl && (
                      <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center gap-2.5">
                        <img
                          src={newProduct.imageUrl}
                          alt="Preview Link"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80';
                          }}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                            ✓ Preview Link Berhasil Dimuat
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            Database hanya menyimpan teks URL (sangat hemat)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH KLOTER PENERBANGAN */}
      {isAddFlightOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Tambah Kloter Penerbangan</h3>
              <button
                onClick={() => setIsAddFlightOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateFlight} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Maskapai:</label>
                  <select
                    value={newFlight.airline}
                    onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value as AdminFlight['airline'] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <option value="ANA">All Nippon Airways (ANA)</option>
                    <option value="JAL">Japan Airlines (JAL)</option>
                    <option value="Garuda">Garuda Indonesia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kode Flight:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: NH855"
                    value={newFlight.flightCode}
                    onChange={(e) => setNewFlight({ ...newFlight, flightCode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rute Penerbangan:</label>
                <input
                  type="text"
                  required
                  placeholder="Tokyo Haneda (HND) ➔ Soekarno Hatta (CGK)"
                  value={newFlight.route}
                  onChange={(e) => setNewFlight({ ...newFlight, route: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Keberangkatan:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 18 Okt 2026"
                    value={newFlight.depDate}
                    onChange={(e) => setNewFlight({ ...newFlight, depDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kuota Bagasi (kg):</label>
                  <input
                    type="number"
                    required
                    value={newFlight.remainingQuotaKg}
                    onChange={(e) => setNewFlight({ ...newFlight, remainingQuotaKg: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddFlightOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Kloter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DAFTAR & DETAIL TRACKING MANUAL */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-base text-primary">
                    {selectedTrackingOrder.orderNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedTrackingOrder.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : selectedTrackingOrder.status === 'shipping'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : selectedTrackingOrder.status === 'packed' ||
                          selectedTrackingOrder.status === 'purchased' ||
                          selectedTrackingOrder.status === 'arrived_id'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {selectedTrackingOrder.status === 'completed'
                      ? 'Selesai'
                      : selectedTrackingOrder.status === 'shipping'
                      ? 'Dalam Pengiriman'
                      : selectedTrackingOrder.status === 'packed' ||
                        selectedTrackingOrder.status === 'purchased' ||
                        selectedTrackingOrder.status === 'arrived_id'
                      ? 'Sudah Dikemas'
                      : 'Menunggu Belanja'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Timeline Tracking Manual Pesanan
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/#/status-pesanan?order=${selectedTrackingOrder.orderNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                  title="Lihat Halaman Tracking Pelanggan di Tab Baru"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  <span>Tampilan Customer</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
                <button
                  onClick={() => setSelectedTrackingOrder(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Tutup Modal"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Customer & Order Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Pelanggan:</span>
                <strong className="text-slate-900 dark:text-white font-bold block text-sm">
                  {selectedTrackingOrder.customerName}
                </strong>
                <span className="text-slate-500 font-mono">WA: {selectedTrackingOrder.customerPhone}</span>
                <span className="text-slate-500 block">Kota: {selectedTrackingOrder.customerCity}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Barang Titipan &amp; Total:</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                  {selectedTrackingOrder.items}
                </p>
                <strong className="text-primary font-mono font-bold text-sm block mt-1">
                  {formatIdr(selectedTrackingOrder.totalIdr)}
                </strong>
              </div>
            </div>

            {/* 4-Stage Manual Stepper Timeline */}
            <div className="space-y-4 pt-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Alur Tahapan Tracking (Konfirmasi Manual Admin)
              </h4>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {/* TAHAP 1: PESANAN DITERIMA */}
                <div className="relative flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 z-10 shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-slate-900 dark:text-white">
                        1. Pesanan Dikonfirmasi &amp; Masuk Antrean Belanja
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono">{selectedTrackingOrder.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pesanan diverifikasi di sistem MapahJastip. Kurs Yen Jepang dikunci dan pesanan masuk manifes Tokyo Hub.
                    </p>
                  </div>
                </div>

                {/* TAHAP 2: SUDAH DIKEMAS */}
                {(() => {
                  const isDone = [
                    'packed',
                    'shipping',
                    'completed',
                    'purchased',
                    'arrived_id',
                  ].includes(selectedTrackingOrder.status);
                  return (
                    <div className="relative flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isDone ? 'check' : 'inventory'}
                        </span>
                      </div>
                      <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-slate-900 dark:text-white">
                            2. Pembelian di Toko Tokyo &amp; Pengemasan Bubble Wrap
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {selectedTrackingOrder.packedDate || (isDone ? 'Dikonfirmasi' : 'Dalam Proses')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Barang dibeli langsung oleh shopper resmi di Tokyo, lolos inspeksi fisik, dan dikemas bubble wrap lapis 3 standar kargo.
                        </p>
                        {!isDone && (
                          <div className="mt-2.5">
                            <button
                              onClick={() => handleConfirmPacked(selectedTrackingOrder.id)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">inventory</span>
                              <span>Klik Konfirmasi Sudah Dikemas Sekarang</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* TAHAP 3: SEDANG DIKIRIM */}
                {(() => {
                  const isDone = ['shipping', 'completed'].includes(selectedTrackingOrder.status);
                  const isPacked = [
                    'packed',
                    'purchased',
                    'arrived_id',
                  ].includes(selectedTrackingOrder.status);
                  return (
                    <div className="relative flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isPacked
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isDone ? 'check' : 'local_shipping'}
                        </span>
                      </div>
                      <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-slate-900 dark:text-white">
                            3. Pengiriman Kargo Udara ({selectedTrackingOrder.courier || 'Japan Post EMS'})
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {selectedTrackingOrder.shippingDate || (isDone ? 'Dalam Perjalanan' : 'Menunggu')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Kurir: <strong className="text-slate-700 dark:text-slate-300">{selectedTrackingOrder.courier || 'Paxel Instant'}</strong>
                          {selectedTrackingOrder.resiNumber && (
                            <> • No. Resi: <span className="font-mono text-primary font-bold">{selectedTrackingOrder.resiNumber}</span></>
                          )}
                        </p>
                        {isPacked && (
                          <div className="mt-2.5">
                            <button
                              onClick={() => {
                                handleOpenShippingModal(selectedTrackingOrder);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                              <span>Klik Konfirmasi Dikirim &amp; Input Resi</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* TAHAP 4: SELESAI */}
                {(() => {
                  const isDone = selectedTrackingOrder.status === 'completed';
                  const isShipping = selectedTrackingOrder.status === 'shipping';
                  return (
                    <div className="relative flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isDone ? 'done_all' : 'check_circle'}
                        </span>
                      </div>
                      <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-slate-900 dark:text-white">
                            4. Pesanan Telah Selesai Diterima
                          </strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {selectedTrackingOrder.completedDate || (isDone ? 'Tuntas' : 'Estimasi')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Pesanan telah diterima oleh pembeli dalam kondisi baik dan aman.
                        </p>
                        {isShipping && (
                          <div className="mt-2.5">
                            <button
                              onClick={() => handleConfirmCompleted(selectedTrackingOrder.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">check_circle</span>
                              <span>Klik Konfirmasi Pesanan Selesai</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Quick Actions Footer in Modal */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Ubah Status Bebas:</span>
                <select
                  value={selectedTrackingOrder.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(
                      selectedTrackingOrder.id,
                      e.target.value as AdminOrder['status']
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  <option value="pending">⏳ Menunggu Belanja</option>
                  <option value="packed">📦 Sudah Dikemas</option>
                  <option value="shipping">🚚 Sedang Dikirim</option>
                  <option value="completed">✅ Selesai Diterima</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/status-pesanan?order=${selectedTrackingOrder.orderNumber}`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">open_in_new</span>
                  <span>Tampilan Pelanggan</span>
                </Link>

                <a
                  href={getWhatsAppMessageUrl(selectedTrackingOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>Kirim Notifikasi WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI PENGIRIMAN & INPUT RESI */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-primary font-mono font-bold block">
                  {shippingModalOrder.orderNumber}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Konfirmasi Pengiriman &amp; Resi
                </h3>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="text-slate-500 block">
                Penerima: <strong className="text-slate-800 dark:text-slate-200">{shippingModalOrder.customerName}</strong> ({shippingModalOrder.customerCity})
              </span>
              {shippingModalOrder.customerAddress && (
                <span className="text-slate-400 block text-[11px]">
                  Alamat: {shippingModalOrder.customerAddress}
                </span>
              )}
            </div>

            <form onSubmit={handleConfirmShippingSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Kurir Pengiriman:
                </label>
                <select
                  value={shippingCourierInput}
                  onChange={(e) => setShippingCourierInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  <optgroup label="✈️ Pengiriman Langsung dari Jepang (Direct Shipping)">
                    <option value="EMS Japan Post">EMS Japan Post (Pos Kilat Internasional Tokyo ➔ ID)</option>
                    <option value="Yamato Transport Japan">Yamato Transport Japan (Kuroneko Yamato Tokyo)</option>
                    <option value="DHL Express International">DHL Express International (Tokyo ➔ JKT Gateway)</option>
                    <option value="Air Parcel Japan Post">Air Parcel Japan Post (Standard International)</option>
                  </optgroup>
                  <optgroup label="🛍️ Pengiriman Handcarry (Domestik Indonesia)">
                    <option value="Paxel Instant">Paxel Instant (Recommended Express / Makanan)</option>
                    <option value="Paxel SameDay">Paxel SameDay</option>
                    <option value="JNE YES">JNE YES (Yakin Esok Sampai)</option>
                    <option value="SiCepat BEST">SiCepat BEST</option>
                    <option value="J&T Express">J&amp;T Express</option>
                    <option value="Handcarry Kurir Khusus Jakarta">Handcarry Kurir Khusus Jakarta</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nomor Resi Pelacakan:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const lower = shippingCourierInput.toLowerCase();
                      let sampleResi = '';
                      if (lower.includes('ems') || lower.includes('japan post')) {
                        // Format nomor resi EMS internasional Jepang: 2 huruf + 9 digit + JP
                        const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
                        sampleResi = `EJ${randomDigits}JP`;
                      } else if (lower.includes('yamato') || lower.includes('kuroneko')) {
                        // Format resi Yamato Transport Tokyo: 12 digit (XXXX-XXXX-XXXX)
                        const d1 = Math.floor(1000 + Math.random() * 9000);
                        const d2 = Math.floor(1000 + Math.random() * 9000);
                        const d3 = Math.floor(1000 + Math.random() * 9000);
                        sampleResi = `${d1}-${d2}-${d3}`;
                      } else if (lower.includes('dhl')) {
                        // Format DHL Express: 10 digit angka
                        sampleResi = `DHL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                      } else if (lower.includes('jne')) {
                        sampleResi = `JNE-${Math.floor(100000000 + Math.random() * 900000000)}`;
                      } else if (lower.includes('sicepat')) {
                        sampleResi = `SCP-${Math.floor(100000000 + Math.random() * 900000000)}`;
                      } else {
                        sampleResi = `PXL-${Math.floor(100000000 + Math.random() * 900000000)}`;
                      }
                      setShippingResiInput(sampleResi);
                    }}
                    className="text-[10px] text-primary hover:underline font-bold cursor-pointer"
                  >
                    + Buat Resi Otomatis
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: EJ891238910JP / PXL-982348234"
                  value={shippingResiInput}
                  onChange={(e) => setShippingResiInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Pengiriman (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dilengkapi ice gel & bubble wrap lapis 3"
                  value={shippingNotesInput}
                  onChange={(e) => setShippingNotesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShippingModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  <span>Simpan &amp; Konfirmasi Kirim</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Refresh Toast Feedback */}
      {refreshToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{refreshToast}</span>
        </div>
      )}
    </div>
  );
};
