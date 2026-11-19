import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Image-First Product Card (Reference-Matched to Screenshot 2)
 * 
 * Features:
 * - Prominent near-square image area with smooth rounded corners (rounded-[18px] to rounded-[20px]).
 * - Clean framing with object-fit: contain so full authentic packaging and product are 100% visible and uncropped.
 * - Below image: authentic product title with tidy 2-line clamping.
 * - Real BDT price (৳{price.toLocaleString()}) and compare-at strikethrough if discounted.
 * - Subtle AZRAQ-colored hover states (azure & violet glow: hover:border-[#6366F1]/40).
 * - Clear clickable affordance navigating to /product/${slug}.
 * - Floating circular glass wishlist button and quick add-to-bag button.
 */
export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  isFav: isFavProp,
  showCategory = true,
  priority = false,
  compact = false,
  indexLabel = null,
  className = ''
}) {
  const navigate = useNavigate();
  const { favorites, addToCart, toggleFavorite, t } = useShop();

  if (!product) return null;

  const isFav = isFavorite || isFavProp || (favorites && favorites.includes(product.id));
  const isAvailable = product.stock !== 0 && product.status !== 'out_of_stock';

  // Authentic discount calculation
  const originalPrice = product.original_price || product.compare_at_price;
  const discountPercent = originalPrice && originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : null;

  // Format product name cleanly
  const displayName = product.name || '';
  const shortName = displayName.includes('—') ? displayName.split('—')[1].trim() : displayName;
  const categoryLabel = product.category || product.collection || '';

  const handleNavigateToProduct = () => {
    try {
      const slug = generateProductSlug(product);
      navigate(`/product/${slug}`);
    } catch {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    if (!isAvailable) return;
    if (onAddToCart) {
      onAddToCart(product, product.variants?.[0] || 'Standard', 1);
    } else if (addToCart) {
      addToCart(product, product.variants?.[0] || 'Standard', 1);
    }
  };

  const handleToggleFav = (e) => {
    e?.stopPropagation?.();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    } else if (toggleFavorite) {
      toggleFavorite(product.id);
    }
  };

  return (
    <div
      onClick={handleNavigateToProduct}
      className={`group relative flex flex-col justify-between h-full bg-white/80 hover:bg-white backdrop-blur-xl border border-[rgba(130,170,205,0.25)] hover:border-[#6366F1]/40 rounded-[22px] shadow-[0_4px_16px_-2px_rgba(25,59,91,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(99,102,241,0.18),0_4px_12px_rgba(36,91,219,0.08)] hover:-translate-y-1 transition-all duration-250 select-none cursor-pointer overflow-hidden p-2.5 sm:p-3 ${className}`}
    >
      {/* 1. LARGE PROMINENT NEAR-SQUARE IMAGE AREA (Matching Screenshot 2) */}
      <div className="relative w-full aspect-square rounded-[18px] sm:rounded-[20px] bg-[#F8FAFF] border border-slate-200/60 p-2 sm:p-2.5 flex items-center justify-center overflow-hidden mb-2 sm:mb-2.5">

        {/* Index Badge or Discount Pill */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 pointer-events-none">
          {indexLabel && (
            <span className="px-2 py-0.5 rounded-full bg-[#193B5B]/85 backdrop-blur-xs text-[#70C8ED] text-[10px] font-mono font-bold tracking-wider shadow-xs">
              {indexLabel}
            </span>
          )}
          {discountPercent && discountPercent > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#245BDB] to-[#6366F1] text-white text-[10px] font-mono font-bold tracking-tight shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all bg-white/85 backdrop-blur-md hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs focus:outline-none ${
            isFav ? 'text-[#E53935] border-[#E53935]/40' : 'text-[#718398] hover:text-[#193B5B]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দে রাখুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
        </button>

        {/* Product Photograph: 100% full contain visibility, centered */}
        <div className="card-image-wrapper w-full h-full flex items-center justify-center">
          <ProductImage
            src={product.main_image}
            alt={product.name || 'Product'}
            fit="contain"
            aspectRatio="square"
            priority={priority}
            className="transition-transform duration-300 group-hover:scale-[1.04]"
            zoomOnHover={false}
          />
        </div>
      </div>

      {/* 2. PRODUCT METADATA & TIDY LINE-CLAMPED TITLE */}
      <div className="flex flex-col justify-between flex-grow px-0.5">
        <div>
          {/* Category Pill Tag (Optional) */}
          {showCategory && categoryLabel && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#EEF2FF] border border-[#6366F1]/20 text-[9px] font-mono uppercase tracking-[0.1em] text-[#4F46E5] font-semibold truncate max-w-full">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Product Title: Authentic name with tidy 2-line clamping */}
          <h3
            className={`font-bold text-[#193B5B] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.5rem] group-hover:text-[#245BDB] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-xs sm:text-[13px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. REAL BDT PRICE & QUICK ADD INTERACTION */}
        <div className="mt-2.5 pt-2 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-black text-[#193B5B] ${compact ? 'text-[13px]' : 'text-xs sm:text-[14px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] text-[#718398] line-through font-mono">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-semibold block mt-0.5 truncate ${isAvailable ? 'text-emerald-600' : 'text-[#718398]'}`}>
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Quick Add Button with AZRAQ Azure-to-Violet Gradient */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all shrink-0 focus:outline-none ${
              isAvailable
                ? 'bg-gradient-to-r from-[#245BDB] to-[#6366F1] hover:from-[#1C4BB8] hover:to-[#4F46E5] text-white shadow-[0_4px_12px_rgba(36,91,219,0.35)] active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title={t("Add to Bag", "ব্যাগে যোগ করুন")}
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
