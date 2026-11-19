import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Full-Cover Image Product Card
 * Exactly matches the user's reference:
 * - Picture covers the whole image area (object-fit: cover, 0 padding, rounded-[18px] to rounded-[20px]).
 * - Clear, tidy 2-line clamped title in deep indigo/navy (#193B5B).
 * - Real BDT price formatted cleanly (e.g. ৳2,800 or 2800 TK).
 * - Prominent, solid "Buy Now" button in rich azure/indigo (matching reference).
 * - Floating circular glass wishlist button on the image.
 * - Subtle AZRAQ-colored card elevation on hover.
 */
export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  isFav: isFavProp,
  showCategory = false,
  priority = false,
  compact = false,
  indexLabel = null,
  className = ''
}) {
  const navigate = useNavigate();
  const { favorites, addToCart, toggleFavorite, setIsCartOpen, t } = useShop();

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

  const handleBuyNow = (e) => {
    e?.stopPropagation?.();
    if (!isAvailable) return;
    if (onAddToCart) {
      onAddToCart(product, product.variants?.[0] || 'Standard', 1);
    } else if (addToCart) {
      addToCart(product, product.variants?.[0] || 'Standard', 1);
    }
    if (setIsCartOpen) {
      setIsCartOpen(true);
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
      className={`group relative flex flex-col justify-between h-full bg-white/85 hover:bg-white backdrop-blur-xl border border-[rgba(130,170,205,0.22)] hover:border-[#4F46E5]/40 rounded-[22px] shadow-[0_4px_16px_-2px_rgba(25,59,91,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(79,70,229,0.18),0_4px_12px_rgba(36,91,219,0.08)] hover:-translate-y-1 transition-all duration-250 select-none cursor-pointer overflow-hidden p-2.5 sm:p-3 ${className}`}
    >
      {/* 1. PICTURE COVERS THE WHOLE CARD IMAGE AREA (Edge-to-edge inside rounded frame) */}
      <div className="relative w-full aspect-square rounded-[18px] sm:rounded-[20px] overflow-hidden mb-2.5 bg-slate-100 shadow-2xs">

        {/* Index Badge or Discount Pill */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
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
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all bg-white/85 backdrop-blur-md hover:bg-white border border-white/60 shadow-xs focus:outline-none ${
            isFav ? 'text-[#E53935]' : 'text-[#718398] hover:text-[#193B5B]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দে রাখুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
        </button>

        {/* Product Photograph: COVERS WHOLE AREA (fit="cover", 0 padding) */}
        <div className="w-full h-full">
          <ProductImage
            src={product.main_image}
            alt={product.name || 'Product'}
            fit="cover"
            aspectRatio="square"
            priority={priority}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            containerClassName="w-full h-full rounded-[18px] sm:rounded-[20px]"
          />
        </div>
      </div>

      {/* 2. PRODUCT METADATA & TIDY LINE-CLAMPED TITLE */}
      <div className="flex flex-col justify-between flex-grow px-0.5">
        <div>
          {/* Category Pill Tag (if requested) */}
          {showCategory && categoryLabel && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#EEF2FF] border border-[#6366F1]/20 text-[9px] font-mono uppercase tracking-[0.1em] text-[#4F46E5] font-semibold truncate max-w-full">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Product Title: Authentic name with tidy 2-line clamping */}
          <h3
            className={`font-bold text-[#193B5B] group-hover:text-[#4F46E5] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.5rem] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-xs sm:text-[13px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. REAL BDT PRICE & PROMINENT BUY NOW BUTTON (Matching Reference) */}
        <div className="mt-2.5 pt-2 border-t border-[rgba(130,170,205,0.18)] flex flex-col gap-2">
          {/* Price & Stock status */}
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-black text-[#193B5B] ${compact ? 'text-[13px]' : 'text-xs sm:text-[15px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] text-[#718398] line-through font-mono">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-semibold ${isAvailable ? 'text-emerald-600' : 'text-[#718398]'}`}>
              {isAvailable ? t("In Stock", "স্টকে আছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Solid "Buy Now" button matching reference */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!isAvailable}
            className={`w-full py-1.5 sm:py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs font-bold shadow-xs active:scale-98 ${
              isAvailable
                ? 'bg-gradient-to-r from-[#245BDB] to-[#4F46E5] hover:from-[#1C4BB8] hover:to-[#3730A3] text-white shadow-[0_4px_12px_rgba(36,91,219,0.28)] cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title={t("Buy Now", "এখনই কিনুন")}
            aria-label={`Buy ${product.name} now`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t("Buy Now", "এখনই কিনুন")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
