import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://diewgwhfrupgusbskmbh.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZXdnd2hmcnVwZ3VzYnNrbWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NTk0MDksImV4cCI6MjEwNzIzNTQwOX0.nq_06Sxwm-zdM0c4DuhMm1Hu3pr9h8KSg_sUpY5wZqs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  password?: string;
}

export interface DbOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  batch_name: string;
  origin: string;
  destination: string;
  courier: string;
  resi_number?: string;
  order_status: string;
  progress_percent: number;
  est_arrival?: string;
  items: string;
  total_amount?: number;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  created_at?: string;
}

// Autentikasi via database Supabase
export async function authenticateWithSupabase(
  identifier: string,
  pass: string
): Promise<{ user: DbUser | null; error?: string }> {
  try {
    const cleanId = identifier.trim().toLowerCase();
    
    // Cari akun berdasarkan email atau nomor telepon
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .or(`email.ilike.${cleanId},phone.ilike.${cleanId}`)
      .limit(1);

    if (error) {
      console.warn('Supabase auth query error:', error.message);
      return { user: null, error: error.message };
    }

    if (!data || data.length === 0) {
      return { user: null, error: 'Akun tidak ditemukan di database Supabase.' };
    }

    const matched = data[0] as DbUser;
    if (matched.password && matched.password !== pass) {
      return { user: null, error: 'Kata sandi tidak sesuai.' };
    }

    return { user: matched };
  } catch (err: any) {
    console.warn('Supabase fetch failed:', err);
    return { user: null, error: err?.message || 'Koneksi ke Supabase gagal' };
  }
}

// Pendaftaran akun baru ke Supabase
export async function registerToSupabase(
  name: string,
  email: string,
  phone: string,
  password: string,
  role: 'customer' | 'admin' = 'customer'
): Promise<{ success: boolean; error?: string }> {
  try {
    const id = `user-${Date.now()}`;
    const { error } = await supabase.from('app_users').insert([
      {
        id,
        name,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal mendaftar ke Supabase' };
  }
}

// Ambil semua pesanan dari Supabase
export async function fetchOrdersFromSupabase(): Promise<DbOrder[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch orders error:', error);
      return [];
    }
    return (data as DbOrder[]) || [];
  } catch (err) {
    console.warn('Fetch orders exception:', err);
    return [];
  }
}

// Tambah pesanan baru langsung ke Supabase Cloud
export async function createOrderInSupabase(payload: Partial<DbOrder>): Promise<DbOrder | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('createOrderInSupabase error:', error.message);
      return null;
    }
    return data as DbOrder;
  } catch (err) {
    console.warn('createOrderInSupabase exception:', err);
    return null;
  }
}

// Update status pesanan langsung di Supabase (untuk live demo Admin)
export async function updateOrderStatusInSupabase(
  orderNumber: string,
  newStatus: string,
  progressPercent: number,
  resiNumber?: string
): Promise<boolean> {
  try {
    const updatePayload: any = {
      order_status: newStatus,
      progress_percent: progressPercent,
    };
    if (resiNumber !== undefined) {
      updatePayload.resi_number = resiNumber;
    }

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('order_number', orderNumber);

    if (error) {
      console.warn('Update order status error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Update order status exception:', err);
    return false;
  }
}

// Hapus pesanan secara permanen dari Supabase Cloud
export async function deleteOrderFromSupabase(orderNumber: string, orderId?: string): Promise<boolean> {
  try {
    if (orderNumber) {
      await supabase.from('orders').delete().eq('order_number', orderNumber);
    }
    if (orderId) {
      await supabase.from('orders').delete().eq('id', orderId);
    }
    return true;
  } catch (err) {
    console.warn('deleteOrderFromSupabase error:', err);
    return false;
  }
}

// Hapus pesanan contoh lokal/sample dari Supabase agar hanya pesanan real yang tampil
export async function cleanupSampleOrders(): Promise<void> {
  try {
    await supabase
      .from('orders')
      .delete()
      .in('order_number', ['MPJ-893110', 'MPJ-OSK-049', 'MPJ-48-901', 'MPJ-071820']);
  } catch (err) {
    console.warn('cleanupSampleOrders error:', err);
  }
}

// Otomatis jalankan pembersihan saat inisialisasi
cleanupSampleOrders();
