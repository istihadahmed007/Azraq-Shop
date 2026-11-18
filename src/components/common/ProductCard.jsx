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
      className={`group relative flex flex-col justify-between h-full rounded-[6px] glass-product select-none transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border border-white/95 bg-white/90 overflow-hidden ${className}`}
    >
      {/* 1. TOP SECTION: Square 1:1 Full-Width Large Image Area (Shopee Proportions) */}
      <div className="relative w-full aspect-square bg-[#F8FBFF] flex items-center justify-center overflow-hidden border-b border-white/90">
        
        {/* Discount Badge at Upper-Right Corner of Photograph */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-0 right-0 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-bl-[6px] bg-gradient-to-r from-[#0877C9] to-[#2563EB] text-white text-[10px] sm:text-[11px] font-black tracking-tight shadow-xs block">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Wishlist Button: Neatly Positioned at Upper-Left Over Image */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2 left-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-[4px] flex items-center justify-center transition-all backdrop-blur-md border border-white shadow-xs active:scale-90 focus:outline-none ${
            isFav
              ? 'text-[#0877C9] bg-white'
              : 'text-[#71849B] bg-white/85 hover:bg-white hover:text-[#0877C9]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isFav ? 'fill-[#0877C9] stroke-[#0877C9] scale-110' : ''}`} />
        </button>

        {/* Dedicated Product Image: Occupies Full Available Space, Object-Contain Without Distortion */}
        <img
          src={displayImage}
          alt={product.name || 'Product'}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 cursor-pointer filter drop-shadow-2xs"
          onClick={handleSelect}
        />

        {/* Quick View Pill Overlay on Hover */}
        <div className="absolute inset-0 bg-[#101C35]/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={handleSelect}
            className="px-3 py-1.5 rounded-[4px] bg-white text-[#101C35] text-xs font-bold shadow-md hover:text-[#0877C9] transition-all transform hover:scale-105 flex items-center gap-1.5 focus:outline-none border border-white"
          >
            <Eye className="w-3.5 h-3.5 text-[#0877C9]" />
            <span>{t("Quick View", "বিস্তারিত")}</span>
          </button>
        </div>
      </div>

      {/* 2. CARD INFORMATION LAYOUT: Positioned Directly Below Photograph */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-2 sm:p-2.5' : 'p-2.5 sm:p-3'}`}>
        <div>
          {/* Category Label */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#71849B] block truncate capitalize mb-0.5">
              {categoryLabel}
            </span>
          )}

          {/* Product Name: Clamped strictly to 2 lines */}
          <h3
            onClick={handleSelect}
            className={`font-semibold text-[#101C35] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.6rem] cursor-pointer hover:text-[#0877C9] transition-colors leading-snug ${
              compact ? 'text-[12px] sm:text-[13px]' : 'text-[13px] sm:text-[14px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. BOTTOM SECTION: Selling Price, Original Price, Stock Status & Compact Add to Cart */}
        <div className="flex items-end justify-between gap-1.5 mt-2 pt-2 border-t border-slate-100/90">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-black text-[#101C35] ${compact ? 'text-[15px]' : 'text-[16px] sm:text-[17px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-[#71849B] line-through font-medium">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span
              className={`text-[10px] sm:text-[11px] font-semibold block truncate mt-0.5 ${
                isAvailable ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক শেষ")}
            </span>
          </div>

          {/* Compact Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-[4px] flex items-center justify-center transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877C9] ${
              compact ? 'w-7.5 h-7.5' : 'w-8 h-8 sm:w-8.5 sm:h-8.5'
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
