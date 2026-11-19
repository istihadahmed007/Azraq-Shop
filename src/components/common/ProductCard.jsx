import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import ProductImage from './ProductImage';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Transparent Glassy Merchandise Product Card
 * 
 * Features:
 * - Frosted glass surface with backdrop-blur-md & subtle specular highlights.
 * - Genuine 1:1 square photography container with contain sizing.
 * - Clean typography clamped to exactly 2 lines.
 * - Authentic BDT currency symbol strictly rendered as ৳ (U+09F3).
 * - Smooth hover lift and glowing blue quick-add action.
 */
export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  showCategory = true,
  priority = false,
  compact = false,
  className = ''
}) {
  const navigate = useNavigate();
  const { favorites, t } = useShop();

  if (!product) return null;

  const isFav = isFavorite || (favorites && favorites.includes(product.id));
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
    } catch (e) {
      navigate(`/product/${product.id}`);
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
      className={`group relative flex flex-col justify-between h-full bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl shadow-[0_4px_16px_rgba(31,38,135,0.04)] hover:border-blue-400/50 hover:bg-white hover:shadow-[0_12px_32px_rgba(36,91,219,0.12)] hover:-translate-y-1 transition-all duration-200 select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* 1. PHOTOGRAPH CONTAINER (1:1 Ratio, edge-to-edge with padding) */}
      <div className="relative w-full aspect-square bg-slate-50/70 border-b border-white/80 flex items-center justify-center overflow-hidden">

        {/* Authentic Discount Badge at Upper-Left */}
        {discountPercent && discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-mono font-bold tracking-tight shadow-xs">
              -{discountPercent}%
            </span>
          </div>
        ) : null}

        {/* Floating Wishlist Button at Upper-Right */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all bg-white/80 backdrop-blur-md hover:bg-white border border-white/90 shadow-2xs focus:outline-none ${
            isFav ? 'text-[#E53935] border-[#E53935]' : 'text-slate-400 hover:text-rose-500'
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
          className="p-3 transition-transform duration-300 group-hover:scale-105"
          zoomOnHover={true}
        />
      </div>

      {/* 2. PRODUCT METADATA & PRICING */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-2.5' : 'p-3.5'}`}>
        <div>
          {/* Department / Category Tag */}
          {showCategory && categoryLabel && (
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-blue-600 block truncate mb-1 font-bold">
              {categoryLabel}
            </span>
          )}

          {/* Product Title: Strictly 2 lines with consistent min-height */}
          <h3
            className={`font-bold text-slate-800 line-clamp-2 min-h-[2.4rem] sm:min-h-[2.5rem] group-hover:text-blue-600 transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-[13px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. PRICE & QUICK ADD INTERACTION */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-extrabold text-slate-900 ${compact ? 'text-[13px]' : 'text-[14px] sm:text-[15px]'}`}>
                ৳{(product.price || 0).toLocaleString()}
              </span>
              {originalPrice && originalPrice > product.price && (
                <span className="text-[10px] text-slate-400 line-through font-mono">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-semibold block mt-0.5 truncate ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isAvailable ? t("In Stock", "স্টকে রয়েছে") : t("Out of Stock", "স্টক নেই")}
            </span>
          </div>

          {/* Quick Add to Bag Action */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 focus:outline-none ${
              isAvailable
                ? 'bg-gradient-to-r from-[#245BDB] to-[#1E40AF] text-white hover:from-[#1E40AF] shadow-xs active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title={isAvailable ? t("Add to Bag", "ব্যাগে যোগ করুন") : t("Unavailable", "মজুদ নেই")}
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
