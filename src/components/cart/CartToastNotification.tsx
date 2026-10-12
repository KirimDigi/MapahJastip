import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatIdr } from '../../utils/currency';

export const CartToastNotification: React.FC = () => {
  const { lastAddedItem, clearNotification, setIsCartOpen } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    if (!lastAddedItem) return;
    const timer = setTimeout(() => {
      clearNotification();
    }, 3800);
    return () => clearTimeout(timer);
  }, [lastAddedItem, clearNotification]);

  if (!lastAddedItem) return null;

  return (
    <div className="fixed top-20 sm:top-24 right-3 sm:right-6 z-[95] max-w-sm sm:max-w-md w-[calc(100vw-24px)] animate-slide-down">
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center gap-3 ring-1 ring-black/5">
        {/* Product image with green check indicator */}
        <div className="relative shrink-0">
          <img
            src={lastAddedItem.product.imageUrl}
            alt={lastAddedItem.product.name}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-border-subtle bg-surface-soft-blue"
          />
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {t('cart.addedToast')}
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-on-surface truncate">
            {lastAddedItem.product.name}
          </h4>
          <span className="text-[11px] sm:text-xs font-bold text-primary block">
            {formatIdr(lastAddedItem.product.priceIdr)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              clearNotification();
              setIsCartOpen(true);
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {t('cart.viewCart')}
          </button>
          <button
            onClick={clearNotification}
            className="p-1 rounded-md text-text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
