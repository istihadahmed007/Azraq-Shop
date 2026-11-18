import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

/**
 * AZRAQ Shop — Premium Soft-Neumorphic Product Card
 * 
 * 1. Large 100% full-width 1:1 square image container (edge-to-edge photography).
 * 2. High-priority product photography filling the container without awkward whitespace.
 * 3. Soft-neumorphic card surface (#F7FAFD, 20px radius, soft shadow).
 * 4. Minimal circular wishlist floating button at top-left.
 * 5. Authentic discount ribbon at top-right (only when authentic compare price > selling price).
 * 6. Clean 2-line clamped title in readable navy slate (#293B52).
 * 7. Prominent BDT price (৳) with strikethrough compare price.
 * 8. Authentic stock indicator & circular quick-add button.
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

  // Real original price & discount calculation (only when authentic compare price > selling price)
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
      onClick={handleSelect}
      className={`group relative flex flex-col justify-between h-full rounded-[20px] bg-[#F7FAFD] border border-[#D5E2EE]/85 shadow-[0_8px_24px_rgba(50,75,100,0.07)] hover:shadow-[0_16px_36px_rgba(50,75,100,0.13)] hover:-translate-y-1 transition-all duration-200 select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* 1. TOP IMAGE WELL: 1:1 Square Container, Full Available Width, Edge-to-Edge */}
      <div className="relative w-full aspect-square bg-white flex items-center justify-center overflow-hidden border-b border-[#E1EDF7]/80">

        {/* Authentic Discount Ribbon at Upper-Right Corner */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-[#EE8056] text-white text-[10px] sm:text-[11px] font-bold tracking-tight shadow-sm">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Floating Circular Wishlist Button at Upper-Left Over Image */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2.5 left-2.5 z-10 w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all bg-white/90 hover:bg-white border border-[#D5E2EE]/70 shadow-sm focus:outline-none ${
            isFav ? 'text-[#EE8056]' : 'text-[#7D8FA3] hover:text-[#EE8056]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#EE8056] stroke-[#EE8056]' : ''}`} />
        </button>

        {/* Product Photograph: Edge-to-Edge Cover Presentation, Preserving Full Visual Impact */}
        <img
          src={displayImage}
          alt={product.name || 'Product'}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-104"
          loading="lazy"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 py-1.5 bg-[#293B52]/50 text-white text-center text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-1 backdrop-blur-xs">
          <Eye className="w-3.5 h-3.5" />
          <span>{t("Quick View", "বিস্তারিত")}</span>
        </div>
      </div>

      {/* 2. PRODUCT INFORMATION SECTION */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-2.5' : 'p-3 sm:p-3.5'}`}>
        <div>
          {/* Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#6B7D93] block truncate uppercase tracking-wider mb-1">
              {categoryLabel}
            </span>
          )}

          {/* Product Title: 2-line clamp */}
          <h3
            className={`font-semibold text-[#293B52] line-clamp-2 min-h-[2.3rem] sm:min-h-[2.5rem] group-hover:text-[#0877C9] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-[13px] sm:text-[13.5px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. PRICE & ACTIONS ROW */}
        <div className="mt-2.5 pt-2.5 border-t border-[#E1EDF7] flex items-end justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {/* Price display: BDT ৳ in primary brand blue */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-bold text-[#0877C9] ${compact ? 'text-[14px]' : 'text-[15px] sm:text-[16px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-[#8CA0B6] line-through font-normal">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* In-stock status */}
            <span
              className={`text-[10px] font-medium block truncate mt-0.5 ${
                isAvailable ? 'text-emerald-600' : 'text-[#8CA0B6]'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Circular Floating Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-full flex items-center justify-center transition-all flex-shrink-0 focus:outline-none ${
              compact ? 'w-7.5 h-7.5' : 'w-8 h-8 sm:w-8.5 sm:h-8.5'
            } ${
              isAvailable
                ? 'bg-[#0877C9] hover:bg-[#0665AC] text-white shadow-sm hover:shadow-md active:scale-95'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            title={isAvailable ? t("Add to Cart", "ব্যাগে যোগ করুন") : t("Out of Stock", "স্টক নেই")}
            aria-label={isAvailable ? `Add ${product.name} to bag` : `${product.name} is out of stock`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
