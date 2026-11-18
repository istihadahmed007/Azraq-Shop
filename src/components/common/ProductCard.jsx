import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

/**
 * AZRAQ Shop — Shopee-Inspired Retail Product Card
 * 
 * Clean, modern, professional retail product card:
 * 1. 100% full-width 1:1 square container with clean white background.
 * 2. Proper object-contain scaling to preserve full product without distortion.
 * 3. Authentic Shopee-style discount tag at top-right corner.
 * 4. Minimalist wishlist button at top-left.
 * 5. Clean 2-line clamped title in readable charcoal.
 * 6. Prominent BDT price (৳) with strikethrough compare price.
 * 7. Authentic stock indicator & compact quick-add button.
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
      className={`group relative flex flex-col justify-between h-full rounded-[4px] bg-white border border-gray-200 hover:border-[#0877C9] hover:shadow-md transition-all duration-150 select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* 1. TOP IMAGE WELL: 1:1 Square Container, Full Available Width */}
      <div className="relative w-full aspect-square bg-[#FFFFFF] flex items-center justify-center overflow-hidden border-b border-gray-100">
        
        {/* Authentic Shopee-style Discount Ribbon at Upper-Right Corner */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-0 right-0 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-bl-[4px] bg-[#EE4D2D] text-white text-[10px] sm:text-[11px] font-bold tracking-tight block shadow-2xs">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Minimalist Wishlist Button at Upper-Left Over Image */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-1.5 left-1.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-colors bg-white/90 hover:bg-white border border-gray-200/80 shadow-2xs focus:outline-none ${
            isFav ? 'text-[#EE4D2D]' : 'text-gray-400 hover:text-[#EE4D2D]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#EE4D2D] stroke-[#EE4D2D]' : ''}`} />
        </button>

        {/* Product Photograph: Contained, Clear, Sharp, No Unwanted Padding */}
        <img
          src={displayImage}
          alt={product.name || 'Product'}
          onError={() => setImageError(true)}
          className="w-full h-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-104"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 py-1.5 bg-black/40 text-white text-center text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-1 backdrop-blur-2xs">
          <Eye className="w-3.5 h-3.5" />
          <span>{t("Quick View", "বিস্তারিত")}</span>
        </div>
      </div>

      {/* 2. PRODUCT INFORMATION SECTION */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-2' : 'p-2.5 sm:p-3'}`}>
        <div>
          {/* Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 block truncate capitalize mb-0.5">
              {categoryLabel}
            </span>
          )}

          {/* Product Title: 2-line clamp */}
          <h3
            className={`font-normal text-[#212121] line-clamp-2 min-h-[2.3rem] sm:min-h-[2.5rem] group-hover:text-[#0877C9] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-[13px] sm:text-[13.5px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. PRICE & ACTIONS ROW */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-end justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {/* Price display: BDT ৳ in primary color */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-bold text-[#0877C9] ${compact ? 'text-[14px]' : 'text-[15px] sm:text-[16px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 line-through font-normal">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* In-stock status */}
            <span
              className={`text-[10px] font-medium block truncate mt-0.5 ${
                isAvailable ? 'text-emerald-700' : 'text-gray-400'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Compact Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-[3px] flex items-center justify-center transition-all flex-shrink-0 focus:outline-none ${
              compact ? 'w-7 h-7' : 'w-7.5 h-7.5 sm:w-8 sm:h-8'
            } ${
              isAvailable
                ? 'bg-[#0877C9] hover:bg-[#0665AC] text-white shadow-2xs active:scale-95'
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
