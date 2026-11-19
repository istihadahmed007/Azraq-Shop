import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductImage from './ProductImage';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Editorial Retail Merchandise Card
 * 
 * Clean, restrained retail product card:
 * 1. Crisp architectural hairline border (#E5E3DA) with 4px corners.
 * 2. High-priority 1:1 square photographic container with generous breathing room.
 * 3. Minimal floating wishlist button at upper-right.
 * 4. Authentic discount badge (rendered only when legitimate compare_price > price).
 * 5. Consistent 2-line title alignment so prices always align across columns.
 * 6. Authoritative BDT ৳ price formatting with original compare strikethrough.
 * 7. Tactile quick-add to bag interaction.
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
      className={`group relative flex flex-col justify-between h-full bg-white border border-[#E5E3DA] rounded-[4px] shadow-[0_1px_2px_rgba(23,35,51,0.02)] hover:border-[#172333] hover:shadow-[0_4px_16px_rgba(23,35,51,0.06)] hover:-translate-y-0.5 transition-all duration-150 select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* 1. PHOTOGRAPH CONTAINER (1:1 Ratio, edge-to-edge with padding) */}
      <div className="relative w-full aspect-square bg-[#FAF9F5] border-b border-[#E5E3DA] flex items-center justify-center overflow-hidden">

        {/* Authentic Discount Badge at Upper-Left */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[#172333] text-white text-[10px] font-mono font-bold tracking-tight">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Floating Wishlist Button at Upper-Right */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-[3px] flex items-center justify-center transition-colors bg-white/95 hover:bg-white border border-[#E5E3DA] hover:border-[#172333] focus:outline-none ${
            isFav ? 'text-[#E53935] border-[#E53935]' : 'text-[#8C99A8] hover:text-[#172333]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দে রাখুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
        </button>

        {/* Product Photograph: Preserves Genuine Proportions with Contain */}
        <ProductImage
          src={product.main_image}
          alt={product.name || 'Product'}
          fit="contain"
          aspectRatio="square"
          priority={priority}
          className="p-3 transition-transform duration-300 group-hover:scale-104"
          zoomOnHover={true}
        />
      </div>

      {/* 2. PRODUCT METADATA & PRICING */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-2.5' : 'p-3 sm:p-3.5'}`}>
        <div>
          {/* Department / Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8C99A8] block truncate mb-1">
              {categoryLabel}
            </span>
          )}

          {/* Product Title: Strictly 2 lines with consistent min-height */}
          <h3
            className={`font-semibold text-[#172333] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.5rem] group-hover:text-[#245BDB] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-[13px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. PRICE & QUICK ADD INTERACTION */}
        <div className="mt-3 pt-2.5 border-t border-[#E5E3DA] flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-bold text-[#172333] ${compact ? 'text-[13px]' : 'text-[14px] sm:text-[15px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] text-[#8C99A8] line-through font-mono">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-medium block mt-0.5 truncate ${isAvailable ? 'text-emerald-700' : 'text-[#8C99A8]'}`}>
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Quick Add to Bag Action */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-7.5 h-7.5 rounded-[3px] flex items-center justify-center transition-colors shrink-0 focus:outline-none ${
              isAvailable
                ? 'bg-[#172333] hover:bg-[#245BDB] text-white active:scale-95'
                : 'bg-[#FAF9F5] text-[#8C99A8] border border-[#E5E3DA] cursor-not-allowed'
            }`}
            title={isAvailable ? t("Add to Bag", "ব্যাগে যোগ করুন") : t("Out of Stock", "স্টক নেই")}
            aria-label={isAvailable ? `Add ${product.name} to bag` : `${product.name} is out of stock`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
