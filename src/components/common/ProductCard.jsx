import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

/**
 * AZRAQ Shop — Premium Transparent Glassmorphism Product Card
 *
 * Implements:
 * 1. Dedicated 1:1 square aspect-ratio ice-blue glass well with object-fit: contain.
 * 2. Floating wishlist icon button at top-right.
 * 3. Optional real discount badge only (no internal SKU labels).
 * 4. Middle: Category label + 2-line clamped title with fixed min-height.
 * 5. Bottom: Prominent BDT price (17-19px), optional original price, stock status, and add-to-cart.
 * 6. Tier 3 .glass-product styling with 22px rounded corners and 2px hover elevation.
 */
export default function ProductCard({
  product,
  isFav = false,
  onToggleFavorite,
  onSelectProduct,
  onAddToCart,
  showCategory = true,
  compact = false,
  className = ''
}) {
  const { t } = useShop();
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const fallbackImage = 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
  const displayImage = imageError || !product.main_image ? fallbackImage : product.main_image;
  const isAvailable = product.in_stock !== false;
  
  // Real original price & discount calculation (only when authentic retail price > selling price)
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
      className={`group relative flex flex-col justify-between h-full rounded-[4px] glass-product select-none transition-all duration-300 ${
        compact ? 'p-3' : 'p-3.5 sm:p-4'
      } ${className}`}
    >
      {/* 1. TOP SECTION: Square 1:1 Large Image Well (Sharp corners, minimal inner padding) */}
      <div className="relative w-full aspect-square rounded-[2px] bg-[#F0F6FD]/90 border border-white/95 p-1.5 sm:p-2 flex items-center justify-center overflow-hidden transition-colors group-hover:bg-white/95">
        
        {/* Real Discount Badge (Only shown when authentically discounted, sharp corners) */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0877C9] text-white text-[10px] font-black tracking-tight shadow-xs border border-white/40">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Floating Top-Right Wishlist Button (Sharp square glass styling) */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2 right-2 z-10 w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-[3px] flex items-center justify-center transition-all bg-white/90 hover:bg-white backdrop-blur-md border border-white shadow-xs active:scale-90 focus:outline-none ${
            isFav
              ? 'text-[#0877C9] bg-white'
              : 'text-[#71849B] hover:text-[#0877C9]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isFav ? 'fill-[#0877C9] stroke-[#0877C9] scale-110' : ''}`} />
        </button>

        {/* Dedicated Product Image Container: fills available area, object-fit contain without distortion */}
        <img
          src={displayImage}
          alt={product.name || 'Product'}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          onClick={handleSelect}
        />

        {/* Hover Quick View Pill Overlay (Sharp square corners) */}
        <div className="absolute inset-0 bg-[#101C35]/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleSelect}
            className="px-3 py-1.5 rounded-[3px] bg-white text-[#101C35] text-xs font-bold shadow-md hover:text-[#0877C9] transition-all transform hover:scale-105 flex items-center gap-1.5 focus:outline-none border border-white"
          >
            <Eye className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{t("Quick View", "বিস্তারিত")}</span>
          </button>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: Category & 2-Line Clamped Title */}
      <div className="mt-3 flex flex-col justify-between flex-grow">
        <div>
          {/* Category Label (Restrained case, never loud all-caps) */}
          {showCategory && categoryLabel && (
            <span className="text-[11px] font-semibold text-[#71849B] block truncate tracking-wide capitalize mb-1">
              {categoryLabel}
            </span>
          )}

          {/* Product Title: Strict 2-line clamp with stable line height */}
          <h3
            onClick={handleSelect}
            className={`font-semibold text-[#101C35] line-clamp-2 min-h-[2.6rem] cursor-pointer hover:text-[#0877C9] transition-colors leading-snug ${
              compact ? 'text-[13px] sm:text-[14px]' : 'text-[14px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. BOTTOM SECTION: Selling Price, Original Price, Stock Status & Sharp Cart Button */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-3 border-t border-white/70">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-black text-[#101C35] ${compact ? 'text-[16px]' : 'text-[17px] sm:text-[18px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[11px] sm:text-[12px] text-[#71849B] line-through font-medium">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span
              className={`text-[11px] font-semibold block truncate mt-0.5 ${
                isAvailable ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক শেষ")}
            </span>
          </div>

          {/* Add to Bag Action Button (Sharp 4px square corners) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-[4px] flex items-center justify-center transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877C9] ${
              compact ? 'w-8.5 h-8.5' : 'w-9.5 h-9.5'
            } ${
              isAvailable
                ? 'bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#076bb5] hover:to-[#1d4ed8] text-white shadow-xs hover:shadow-md hover:scale-105 active:scale-95'
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
