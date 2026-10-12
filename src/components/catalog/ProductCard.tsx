import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/product';
import { formatIdr, formatJpy } from '../../utils/currency';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleCheckoutDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className="product-card group bg-surface-container-lowest rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-border-subtle/70">
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-surface-soft-blue">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-1.5 items-start max-w-[70%]">
          <span className="bg-surface-container-lowest/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs text-primary font-bold shadow-xs truncate max-w-full">
            {product.storeBadge}
          </span>
          {product.storeLocation && (
            <span className="px-1.5 py-0.5 rounded bg-surface-container-lowest/80 text-on-surface text-[8.5px] sm:text-[11px] backdrop-blur-md truncate max-w-full hidden xs:inline-block sm:inline-block">
              {product.storeLocation}
            </span>
          )}
        </div>

        {/* Stock Badge Top Right */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-1.5">
          {product.stockLabel && (
            <span
              className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold shadow-xs ${
                product.stockStatus === 'limited'
                  ? 'bg-warning-bg text-warning-text'
                  : 'bg-success-bg text-success-text'
              }`}
            >
              {product.stockStatus === 'limited' ? t('card.stockLimited') : t('card.stockReady')}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlist(!isWishlist);
            }}
            aria-label={t('card.wishlist')}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-surface-container-lowest/85 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-error transition-colors shadow-xs cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[15px] sm:text-[18px]"
              style={{
                fontVariationSettings: isWishlist ? "'FILL' 1" : "'FILL' 0",
                color: isWishlist ? '#E05252' : undefined,
              }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-text-secondary text-[10px] sm:text-xs">
            <span className="truncate pr-1">
              {language === 'ja'
                ? t(`cat.${product.category}`, product.categoryLabel)
                : (product.originalNameJp || t(`cat.${product.category}`, product.categoryLabel))}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {product.weightG && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-surface-container-high text-primary font-bold text-[9.5px] sm:text-[11px] shadow-2xs">
                  <span className="material-symbols-outlined text-[11px] sm:text-[13px]">scale</span>
                  {product.weightG}g
                </span>
              )}
              {product.rating && (
                <span className="flex items-center gap-0.5 text-warning font-semibold">
                  <span className="material-symbols-outlined text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  {product.rating}
                </span>
              )}
            </div>
          </div>
          <h3 className="font-title-md text-xs sm:text-base text-on-surface font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {language === 'ja' && product.originalNameJp ? product.originalNameJp : product.name}
          </h3>
          <p className="font-body-sm text-[11px] sm:text-sm text-text-secondary line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Action Bottom Banner */}
        <div className="pt-2 sm:pt-3 bg-surface-soft-blue -mx-2.5 -mb-2.5 sm:-mx-5 sm:-mb-5 p-2 sm:p-3 rounded-b-xl sm:rounded-b-2xl border-t border-border-subtle/50 space-y-2">
          <div className="flex items-center justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-[9px] sm:text-xs text-text-secondary truncate">
                <span>{formatJpy(product.priceJpy)} (JP)</span>
                {product.weightG && (
                  <span className="text-text-secondary/70 font-medium">• ~{product.weightG}g</span>
                )}
              </div>
              <span className="font-price-lg text-xs sm:text-base lg:text-lg text-primary font-bold tabular-nums block truncate">
                {formatIdr(product.priceIdr)}
              </span>
            </div>
          </div>

          {/* Dual Action Buttons: + Keranjang dan ⚡ Checkout */}
          <div className="grid grid-cols-5 gap-1.5 pt-0.5">
            <button
              onClick={handleAddToCart}
              aria-label={isAdded ? t('card.added') : t('card.addToCart')}
              className={`col-span-2 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 text-[11px] font-bold shadow-xs cursor-pointer ${
                isAdded
                  ? 'bg-success text-white'
                  : 'bg-surface-container-high hover:bg-primary/10 text-primary border border-border-subtle hover:border-primary/40 active:scale-95'
              }`}
              title={isAdded ? (language === 'ja' ? '追加済' : 'Sudah Masuk') : (language === 'ja' ? 'カートに追加' : 'Tambah ke Keranjang')}
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[17px]">
                {isAdded ? 'check' : 'add_shopping_cart'}
              </span>
              <span className="hidden sm:inline text-[11px]">{isAdded ? 'Masuk' : '+ Keranjang'}</span>
            </button>

            <button
              onClick={handleCheckoutDirect}
              className="col-span-3 py-1.5 px-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
              title={language === 'ja' ? '今すぐ購入' : 'Checkout Langsung'}
            >
              <span className="material-symbols-outlined text-[14px] sm:text-[16px]">bolt</span>
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
