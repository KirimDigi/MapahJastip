import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatIdr } from '../../utils/currency';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPriceIdr, totalItems } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-surface-soft-blue">
            <div className="flex items-center gap-2.5">
              <svg className="w-6 h-6 text-primary fill-current" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A.996.996 0 0020.01 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              <h2 className="font-title-md text-title-md text-on-surface font-bold">
                Keranjang Titipan ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-surface-light-blue flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[40px]">remove_shopping_cart</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    Keranjangmu Masih Kosong
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-secondary max-w-xs mx-auto">
                    Yuk pilih barang idaman dari Jepang di Katalog Titip kami!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/katalog');
                  }}
                  className="px-6 py-2.5 bg-primary-container text-white rounded-lg font-label-md text-label-md hover:bg-primary-dark transition-colors shadow-sm"
                >
                  Jelajahi Katalog Titip
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 bg-surface rounded-xl border border-border-subtle flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-surface-container-low shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[11px] font-semibold text-primary uppercase block">
                      {item.product.categoryLabel}
                    </span>
                    <h4 className="font-title-md text-sm text-on-surface truncate font-semibold">
                      {item.product.name}
                    </h4>
                    <div className="font-price-md text-primary font-bold text-sm">
                      {formatIdr(item.product.priceIdr)}
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-text-secondary hover:text-error transition-colors"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                    <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2 py-1 rounded-lg border border-border-subtle">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-text-secondary hover:text-primary font-bold"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-semibold text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-text-secondary hover:text-primary font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border-subtle bg-surface-container-low space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-body-sm text-text-secondary">
                  <span>Subtotal Barang:</span>
                  <span className="font-semibold text-on-surface">{formatIdr(totalPriceIdr)}</span>
                </div>
                <div className="flex justify-between text-body-sm text-text-secondary">
                  <span>Fee Concierge &amp; Handling:</span>
                  <span className="text-success-text font-semibold">Transparan saat checkout</span>
                </div>
                <div className="pt-2 border-t border-border-subtle flex justify-between items-baseline">
                  <span className="font-title-md text-on-surface font-bold">Total Perkiraan:</span>
                  <span className="font-headline-sm text-primary font-bold">{formatIdr(totalPriceIdr)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3.5 bg-primary-container hover:bg-primary-dark text-white font-label-md text-label-md rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Lanjut ke Formulir Checkout</span>
                <span className="material-symbols-outlined text-[19px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
