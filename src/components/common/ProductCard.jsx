import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductImage from './ProductImage';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Modern Editorial Product Card (The Everyday Edit)
 * 
 * 1. Pure White (#FFFFFF) elevated card with neutral grey border (#E5E3DA) and 12px corners.
 * 2. 1:1 square-edged photograph container preserving genuine product aspect ratio.
 * 3. Minimal floating wishlist button at upper-right.
 * 4. Authentic discount badge (only when compare price > selling price).
 * 5. Category metadata tag & 2-line clamped title in Deep Ink (#172333).
 * 6. Prominent retail price in AZRAQ Blue (#245BDB) with genuine compare strikethrough.
 * 7. In-stock verification & Quick Add to bag interaction.
 */
export default function ProductCard({
  product,
  isFav = false,
  onToggleFavorite,
  onSelectProduct,
  onAddToCart,
  showCategory = true,
  compact = false,
  priority = false,
  className = ''
}) {
  const { t } = useShop();
  const navigate = useNavigate();

  if (!product) return null;

  const isAvailable = product.in_stock !== false;
  const productSlug = generateProductSlug(product);

  // Real original price & discount calculation (only when authentic compare price > selling price)
  const originalPrice = product.compare_price ||
    (product.supplier_retail_price && product.supplier_retail_price > product.price ? product.supplier_retail_price : null);
  const discountPercent = originalPrice && originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : (product.discount_percent || null);

  const shortName = product.name?.split('—')?.[1]?.trim() || product.name?.split('(')?.[0]?.trim() || product.name || '';
  const categoryLabel = product.category || product.primary_collection_name || '';

  const handleNavigateToProduct = (e) => {
    e?.stopPropagation?.();
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      navigate(`/product/${productSlug}`);
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
      onClick={handleNavigateToProduct}
      className={`group relative flex flex-col justify-between h-full rounded-[12px] bg-white border border-[#E5E3DA] shadow-[0_2px_12px_rgba(23,35,51,0.04)] hover:shadow-[0_8px_24px_rgba(23,35,51,0.08)] hover:border-[#245BDB]/50 hover:-translate-y-0.5 transition-all duration-200 select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* 1. TOP IMAGE WELL: 1:1 Square Container, Full Available Width, Edge-to-Edge */}
      <div className="relative w-full aspect-square bg-[#FAF9F5] flex items-center justify-center overflow-hidden border-b border-[#E5E3DA]">

        {/* Authentic Discount Badge at Upper-Left */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-[4px] bg-[#D7ED78] text-[#172333] text-[10px] sm:text-[11px] font-extrabold tracking-tight shadow-xs">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Floating Wishlist Button at Upper-Right */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2.5 right-2.5 z-10 w-7.5 h-7.5 rounded-[6px] flex items-center justify-center transition-all bg-white/95 hover:bg-white border border-[#E5E3DA] shadow-xs focus:outline-none ${
            isFav ? 'text-[#E53935]' : 'text-[#667085] hover:text-[#E53935]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
        </button>

        {/* Product Photograph: High Priority, Preserves True Aspect Ratio */}
        <ProductImage
          src={product.main_image}
          alt={product.name || 'Product'}
          fit="contain"
          aspectRatio="square"
          priority={priority}
          className="p-2 transition-transform duration-300 group-hover:scale-104"
          zoomOnHover={true}
        />

        {/* View Details hover banner */}
        <div className="absolute inset-x-0 bottom-0 py-1.5 bg-[#172333]/80 text-white text-center text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-1 backdrop-blur-xs">
          <span>{t("View Details", "বিস্তারিত দেখুন")}</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      {/* 2. PRODUCT INFORMATION SECTION */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-2.5' : 'p-3 sm:p-3.5'}`}>
        <div>
          {/* Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] sm:text-[11px] font-bold text-[#667085] block truncate uppercase tracking-wider mb-1">
              {categoryLabel}
            </span>
          )}

          {/* Product Title: 2-line clamp */}
          <h3
            className={`font-semibold text-[#172333] line-clamp-2 min-h-[2.3rem] sm:min-h-[2.5rem] group-hover:text-[#245BDB] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-[13px] sm:text-[13.5px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. PRICE & ACTIONS ROW */}
        <div className="mt-2.5 pt-2.5 border-t border-[#E5E3DA] flex items-end justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {/* Price display: BDT ৳ in primary brand blue */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-extrabold text-[#245BDB] ${compact ? 'text-[14px]' : 'text-[15px] sm:text-[16px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] sm:text-[11px] text-[#8C99A8] line-through font-normal">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* In-stock status */}
            <span
              className={`text-[10px] font-medium block truncate mt-0.5 ${
                isAvailable ? 'text-emerald-700' : 'text-[#8C99A8]'
              }`}
            >
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Quick Add to Bag Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`rounded-[6px] flex items-center justify-center transition-all flex-shrink-0 focus:outline-none ${
              compact ? 'w-7.5 h-7.5' : 'w-8 h-8 sm:w-8.5 sm:h-8.5'
            } ${
              isAvailable
                ? 'bg-[#172333] hover:bg-[#245BDB] text-white shadow-xs active:scale-95'
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
