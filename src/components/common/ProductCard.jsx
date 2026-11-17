import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

/**
 * AZRAQ Shop — Premium Transparent Glassmorphism Product Card
 *
 * Implements:
 * 1. Strict 1:1 square aspect-ratio pale glass image container with object-fit: contain.
 * 2. Top-right frosted wishlist button.
 * 3. Real calculated discount badge (when retail price > current price).
 * 4. Scannable 2-line clamped product typography.
 * 5. Consistently baseline-aligned price in BDT & add-to-cart button.
 * 6. 2px elevation, border glow highlight, and gentle scale transition.
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
  
  // Real original price & discount calculation
  const originalPrice = product.compare_price || 
    (product.supplier_retail_price && product.supplier_retail_price > product.price ? product.supplier_retail_price : null);
  const discountPercent = originalPrice && originalPrice > product.price 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100) 
    : (product.discount_percent || null);

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
      className={`group relative flex flex-col justify-between h-full rounded-[22px] glass-card ${
        compact ? 'p-3' : 'p-3.5 sm:p-4'
      } ${className}`}
    >
      {/* 1. TOP OVERLAYS (Badges & Wishlist) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 pointer-events-none flex flex-col gap-1 items-start">
        {similarityBadge !== null && similarityBadge !== undefined ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#101C35]/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider shadow-xs border border-white/20">
            <Sparkles className="w-2.5 h-2.5 text-[#50DDF0]" />
            <span>{similarityBadge}% {t("Match", "মিল")}</span>
          </span>
        ) : discountPercent && discountPercent > 0 ? (
          <span className="px-2 py-0.5 rounded-full bg-[#0877C9] text-white text-[9px] sm:text-[10px] font-black tracking-tight shadow-xs border border-white/30">
            -{discountPercent}%
          </span>
        ) : showSku && product.id ? (
          <span className="px-1.5 py-0.5 rounded-md bg-white/80 backdrop-blur-md text-[#71849B] text-[8px] sm:text-[9px] font-mono font-semibold tracking-tight shadow-xs border border-white/80">
            #{product.id}
          </span>
        ) : null}
      </div>

      {/* Top-Right Wishlist Icon Button */}
      <button
        type="button"
        onClick={handleToggleFav}
        className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/85 hover:bg-white backdrop-blur-md border border-white/90 shadow-sm active:scale-90 focus:outline-none ${
          isFav
            ? 'text-[#0877C9] bg-white'
            : 'text-[#71849B] hover:text-[#0877C9]'
        }`}
        title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
        aria-label={`Wishlist ${product.name}`}
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${isFav ? 'fill-[#0877C9] stroke-[#0877C9]' : ''}`} />
      </button>

      {/* 2. UNIFORM SQUARE IMAGE WELL (Aspect ratio 1:1, object-fit: contain, pale surface) */}
      <div
        onClick={handleSelect}
        className="relative w-full aspect-square rounded-[18px] bg-[#F8FBFF]/85 border border-white/80 p-3 sm:p-3.5 flex items-center justify-center cursor-pointer overflow-hidden transition-colors group-hover:bg-white/90"
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
        <div className="absolute inset-0 bg-[#101C35]/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleSelect}
            className="px-3 py-1.5 rounded-full bg-white/95 text-[#101C35] text-xs font-bold shadow-md hover:text-[#0877C9] transition-all transform hover:scale-105 flex items-center gap-1.5 focus:outline-none border border-white"
          >
            <Eye className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{t("Quick View", "বিস্তারিত")}</span>
          </button>
        </div>
      </div>

      {/* 3. PRODUCT INFORMATION REGION (flex-grow: 1, 2-line clamp, consistent baseline) */}
      <div className="mt-3 flex flex-col justify-between flex-grow">
        <div>
          {/* Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#71849B] block truncate tracking-wider uppercase mb-1">
              {categoryLabel}
            </span>
          )}

          {/* Product Title (Strict 2-line clamp prevents layout breaking) */}
          <h3
            onClick={handleSelect}
            className={`font-semibold text-[#101C35] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem] cursor-pointer hover:text-[#0877C9] transition-colors leading-snug ${
              compact ? 'text-[13px] sm:text-[14px]' : 'text-[13px] sm:text-[14px]'
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

        {/* 4. PRICE & SHOPPING ACTION (Consistently aligned at bottom) */}
        <div className="flex items-end justify-between gap-1.5 sm:gap-2 mt-3 pt-2 border-t border-white/60">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-black text-[#101C35] ${compact ? 'text-[15px] sm:text-[16px]' : 'text-[16px] sm:text-[18px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[11px] sm:text-[12px] text-[#71849B] line-through font-medium">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span
              className={`text-[9px] sm:text-[10px] font-semibold block truncate mt-0.5 ${
                isAvailable ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক শেষ")}
            </span>
          </div>

          {/* Add to Bag Primary Action Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-full flex items-center justify-center transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877C9] ${
              compact ? 'w-8 h-8 sm:w-8.5 sm:h-8.5' : 'w-8.5 h-8.5 sm:w-9.5 sm:h-9.5'
            } ${
              isAvailable
                ? 'bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#076bb5] hover:to-[#1d4ed8] text-white shadow-[0_3px_12px_rgba(8,119,201,0.3)] hover:shadow-[0_4px_16px_rgba(8,119,201,0.45)] hover:scale-105 active:scale-95'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
            title={isAvailable ? t("Add to Cart", "ব্যাগে যোগ করুন") : t("Out of Stock", "স্টক নেই")}
            aria-label={isAvailable ? `Add ${product.name} to bag` : `${product.name} is out of stock`}
          >
            <ShoppingBag className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </button>
        </div>
      </div>
    </div>
  );
}
