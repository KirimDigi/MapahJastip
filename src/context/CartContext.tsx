import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product } from '../types/product';
import { CartItem, CartContextType } from '../types/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'mapah_jastip_cart_guest';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const prevUserRef = useRef<typeof user>(user);

  const getStorageKey = (email?: string) => {
    return email ? `mapah_jastip_cart_${email}` : GUEST_STORAGE_KEY;
  };

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (user?.email) {
        const userStored = localStorage.getItem(`mapah_jastip_cart_${user.email}`);
        if (userStored) return JSON.parse(userStored);
        return [];
      } else {
        const guestStored = localStorage.getItem(GUEST_STORAGE_KEY);
        if (guestStored) return JSON.parse(guestStored);
        // Hapus cache cart lama agar tidak tertinggal setelah logout akun
        localStorage.removeItem('mapah_jastip_cart_v1');
        return [];
      }
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  const clearNotification = () => {
    setLastAddedItem(null);
  };

  // Sinkronisasi keranjang saat login / logout
  useEffect(() => {
    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    // 1. Pengguna logout: kosongkan keranjang aktif & bersihkan guest storage
    if (prevUser && !user) {
      setItems([]);
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
        localStorage.removeItem('mapah_jastip_cart_v1');
      } catch (e) {
        console.warn('Failed to clear guest cart', e);
      }
      return;
    }

    // 2. Pengguna baru login: muat keranjang milik akun tersebut
    if (!prevUser && user) {
      const userKey = getStorageKey(user.email);
      try {
        const userStored = localStorage.getItem(userKey);
        if (userStored) {
          setItems(JSON.parse(userStored));
        } else {
          // Jika tamu belum punya simpanan keranjang, reset ke kosong
          setItems([]);
        }
      } catch {
        setItems([]);
      }
      return;
    }

    // 3. Ganti akun
    if (user && prevUser && user.email !== prevUser.email) {
      const userKey = getStorageKey(user.email);
      try {
        const userStored = localStorage.getItem(userKey);
        setItems(userStored ? JSON.parse(userStored) : []);
      } catch {
        setItems([]);
      }
    }
  }, [user]);

  // Simpan keranjang ke key yang sesuai setiap ada perubahan item
  useEffect(() => {
    try {
      const key = getStorageKey(user?.email);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items, user]);

  const addToCart = (product: Product, quantity = 1, variant?: string, notes?: string) => {
    const newItem: CartItem = { product, quantity, selectedVariant: variant, notes };
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === variant
      );
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prevItems, newItem];
      }
    });
    // Trigger added notification toast
    setLastAddedItem(newItem);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPriceIdr = items.reduce(
    (sum, item) => sum + item.product.priceIdr * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPriceIdr,
        isCartOpen,
        setIsCartOpen,
        lastAddedItem,
        clearNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
