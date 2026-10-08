import React, { useState } from 'react';
import { Product } from '../../types/product';
import { formatIdr, formatJpy } from '../../utils/currency';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
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
              {product.stockLabel}
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlist(!isWishlist);
            }}
            aria-label="Tambah ke Wishlist"
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
            <span className="truncate pr-1">{product.originalNameJp || product.categoryLabel}</span>
            {product.rating && (
              <span className="flex items-center gap-0.5 text-warning font-semibold shrink-0">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                {product.rating}
              </span>
            )}
          </div>
          <h3 className="font-title-md text-xs sm:text-base text-on-surface font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="font-body-sm text-[11px] sm:text-sm text-text-secondary line-clamp-1 sm:line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price & Action Bottom Banner */}
        <div className="pt-2 sm:pt-3 bg-surface-soft-blue -mx-2.5 -mb-2.5 sm:-mx-5 sm:-mb-5 p-2 sm:p-4 rounded-b-xl sm:rounded-b-2xl flex items-center justify-between border-t border-border-subtle/50 gap-1.5">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-xs text-text-secondary block truncate">
              {formatJpy(product.priceJpy)} (JP)
            </span>
            <span className="font-price-lg text-xs sm:text-lg text-primary font-bold tabular-nums block truncate">
              {formatIdr(product.priceIdr)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            aria-label="Titip Sekarang"
            className={`p-1.5 sm:p-2.5 rounded-lg transition-all flex items-center justify-center shadow-xs shrink-0 cursor-pointer ${
              isAdded
                ? 'bg-success text-white'
                : 'bg-primary-container text-white hover:bg-primary-dark active:scale-95'
            }`}
            title="Tambah ke Titipan"
          >
            <span className="material-symbols-outlined text-[17px] sm:text-[20px]">
              {isAdded ? 'check' : 'add_shopping_cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
