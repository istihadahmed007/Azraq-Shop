import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

/**
 * AZRAQ Shop — Reusable Unified Product Card Component
 *
 * Provides pixel-perfect sizing, uniform aspect-ratio containers, vertical alignment,
 * robust error fallbacks, and a tasteful glass-morphism aesthetic (soft blur, subtle border,
 * delicate shadows) strictly preserving the AZRAQ Brand Color System.
 */
export default function ProductCard({
  product,
  isFav = false,
  onToggleFavorite,
  onSelectProduct,
  onAddToCart,
  showRating = false,
  showSku = true,
  showCategory = true,
  similarityBadge = null,
  compact = false,
  className = ''
}) {
  const { t } = useShop();
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const fallbackImage = 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
  const displayImage = imageError || !product.main_image ? fallbackImage : product.main_image;
  const isAvailable = product.in_stock !== false;
  const shortName = product.name?.split('—')?.[1]?.trim() || product.name?.split('(')?.[0]?.trim() || product.name || '';
  const categoryLabel = product.category || product.primary_collection_name || '';

  const handleSelect = (e) => {
    e?.stopPropagation?.();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    if (isAvailable && onAddToCart) {
      onAddToCart(product, product.variants?.[0] || 'Standard', 1);
    }
  };

  const handleToggleFav = (e) => {
    e?.stopPropagation?.();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/85 backdrop-blur-md border border-[#D9F0FF]/80 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] hover:bg-white hover:border-[#2563EB]/40 hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.14)] hover:-translate-y-0.5 transition-all duration-300 ${
        compact ? 'p-2.5 sm:p-3' : 'p-3 sm:p-4'
      } ${className}`}
    >
      {/* 1. TOP OVERLAYS (Floating Badges & Wishlist) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 pointer-events-none flex flex-col gap-1 items-start">
        {similarityBadge !== null && similarityBadge !== undefined ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#101C35]/90 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-sm border border-white/20">
            <Sparkles className="w-2.5 h-2.5 text-[#50DDF0]" />
            <span>{similarityBadge}% {t("Match", "মিল")}</span>
          </span>
        ) : showSku && product.id ? (
          <span className="px-1.5 py-0.5 rounded-md bg-[#101C35]/85 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-mono tracking-tight shadow-xs border border-white/10">
            #{product.id}
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleToggleFav}
        className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
          isFav
            ? 'bg-[#2563EB] text-white shadow-md hover:bg-[#183B70]'
            : 'bg-white/90 backdrop-blur-sm text-[#101C35]/40 hover:text-[#2563EB] hover:bg-white shadow-xs border border-white/60'
        }`}
        title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
        aria-label={`Wishlist ${product.name}`}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-white stroke-white' : ''}`} />
      </button>

      {/* 2. PRODUCT IMAGE WELL (Strict 1:1 Aspect Ratio Box) */}
      <div
        onClick={handleSelect}
        className="relative w-full aspect-square rounded-xl bg-gradient-to-b from-[#F5F7FA]/90 to-white/70 p-2.5 sm:p-3.5 flex items-center justify-center cursor-pointer overflow-hidden border border-white/80 group-hover:border-[#D9F0FF] transition-colors"
      >
        <img
          src={displayImage}
          alt={product.name || 'Product'}
          loading="lazy"
          decoding="async"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Quick View Pill Overlay */}
        <div className="absolute inset-0 bg-[#101C35]/15 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleSelect}
            className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[#101C35] text-xs font-bold shadow-lg hover:bg-[#2563EB] hover:text-white transition-all transform hover:scale-105 flex items-center gap-1.5 border border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t("Quick View", "বিস্তারিত")}</span>
          </button>
        </div>
      </div>

      {/* 3. DETAILS & TYPOGRAPHY SECTION */}
      <div className="mt-2.5 pt-2 border-t border-[#D9F0FF]/60 flex flex-col justify-between flex-1">
        <div>
          {/* Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#183B70] block truncate tracking-wide uppercase">
              {categoryLabel}
            </span>
          )}

          {/* Product Title (Strict line-clamp-2 with min-height ensures aligned baseline) */}
          <h3
            onClick={handleSelect}
            className={`font-bold text-[#101C35] line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] cursor-pointer hover:text-[#2563EB] transition-colors leading-snug ${
              compact ? 'text-xs sm:text-[13px]' : 'text-xs sm:text-sm'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>

          {/* Rating (if enabled) */}
          {showRating && (
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span>{product.rating || '4.8'}</span>
            </div>
          )}
        </div>

        {/* 4. PRICE & ACTION FOOTER */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-2 mt-auto border-t border-gray-100/70">
          <div className="min-w-0 flex-1">
            <div className={`font-black text-[#101C35] truncate ${compact ? 'text-xs sm:text-sm md:text-base' : 'text-sm sm:text-base md:text-lg'}`}>
              ৳{(product.price || 0).toLocaleString()}
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-bold block truncate ${
                isAvailable ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক শেষ")}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-full flex items-center justify-center shadow-sm transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
              compact ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
            } ${
              isAvailable
                ? 'bg-[#101C35] hover:bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(16,28,53,0.15)] transform hover:scale-108 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={isAvailable ? t("Add to Cart", "ব্যাগে যোগ করুন") : t("Out of Stock", "স্টক নেই")}
            aria-label={isAvailable ? `Add ${product.name} to bag` : `${product.name} is out of stock`}
          >
            <ShoppingBag className={compact ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
          </button>
        </div>
      </div>
    </div>
  );
}
