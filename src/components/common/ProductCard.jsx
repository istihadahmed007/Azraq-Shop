import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Clean Product Card
 * - Edge-to-edge square product imagery with clean rounded framing.
 * - Clear, tidy 2-line clamped title in deep slate ink (#0F172A).
 * - Real BDT price with tabular figures (e.g. ৳2,800).
 * - Solid, high-contrast "Buy Now" action in authentic AZRAQ blue (#185ADB).
 * - Clean circular wishlist button.
 * - Restrained, neutral card elevation on hover (no glowing purple shadows).
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
      className={`group relative flex flex-col justify-between h-full bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl shadow-xs hover:shadow-md transition-shadow duration-200 select-none cursor-pointer overflow-hidden p-3 ${className}`}
    >
      {/* 1. Full-cover product photograph with nested radius */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-50 border border-slate-100">

        {/* Index or Discount Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          {indexLabel && (
            <span className="px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-mono font-medium tracking-wider shadow-xs">
              {indexLabel}
            </span>
          )}
          {discountPercent && discountPercent > 0 ? (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono font-bold tracking-tight shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-white/95 hover:bg-white border border-slate-200/80 shadow-xs focus-visible:ring-2 focus-visible:ring-[#185ADB] ${
            isFav ? 'text-rose-600' : 'text-slate-400 hover:text-slate-800'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দে রাখুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 stroke-rose-600' : ''}`} />
        </button>

        {/* Product Photograph: Edge-to-edge cover */}
        <div className="w-full h-full">
          <ProductImage
            src={product.main_image}
            alt={product.name || 'Product'}
            fit="cover"
            aspectRatio="square"
            priority={priority}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            containerClassName="w-full h-full rounded-xl"
          />
        </div>
      </div>

      {/* 2. Product Metadata & Tidy Line-Clamped Title */}
      <div className="flex flex-col justify-between flex-grow px-0.5">
        <div>
          {/* Category Pill Tag (if requested) */}
          {showCategory && categoryLabel && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-600 truncate max-w-full">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Product Title: Authentic name with tidy 2-line clamping */}
          <h3
            className={`font-semibold text-slate-900 group-hover:text-[#185ADB] line-clamp-2 min-h-[2.4rem] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-xs sm:text-[13px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. Real BDT Price & Prominent Solid Buy Now Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2.5">
          {/* Price & Stock status */}
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-bold text-slate-900 tabular-nums ${compact ? 'text-[13px]' : 'text-sm sm:text-base'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through font-mono tabular-nums">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-[11px] font-medium ${isAvailable ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isAvailable ? t("In Stock", "স্টকে আছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Solid "Buy Now" button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!isAvailable}
            className={`w-full py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs font-semibold shadow-xs active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#185ADB] focus-visible:ring-offset-1 ${
              isAvailable
                ? 'bg-[#185ADB] hover:bg-[#1044A3] text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
