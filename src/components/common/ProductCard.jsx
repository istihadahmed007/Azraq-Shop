import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage';
import { useShop } from '../../context/ShopContext';
import { generateProductSlug } from '../../utils/productUtils';

/**
 * AZRAQ Shop — Futuristic Icy-Blue Glassmorphic Product Card
 * 
 * Design Features (Inspired by reference):
 * - Translucent crystal glass surface with backdrop-blur-md & delicate 1px border.
 * - Requirement 5 strictly enforced: 100% full image containment, zero cropping or distortion.
 * - Index pill support ("01", "02", etc.) matching the reference aesthetic.
 * - Deep navy typography (#193B5B), muted secondary details (#718398).
 * - Primary action: Glowing icy-blue gradient pill button.
 */
export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  showCategory = true,
  priority = false,
  compact = false,
  indexLabel = null,
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
      className={`group relative flex flex-col justify-between h-full bg-white/75 backdrop-blur-md border border-[rgba(130,170,205,0.25)] border-t-white/95 rounded-[22px] shadow-[0_8px_24px_-4px_rgba(112,200,237,0.1),0_2px_8px_-1px_rgba(25,59,91,0.03)] hover:border-[#70C8ED]/60 hover:bg-white/95 hover:shadow-[0_20px_44px_-6px_rgba(112,200,237,0.25),0_6px_16px_0_rgba(25,59,91,0.06)] hover:-translate-y-1 transition-all duration-250 select-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* 1. PHOTOGRAPH CONTAINER (Strictly Full Image Fit, 1:1 Aspect Ratio) */}
      <div className="relative w-full aspect-square bg-[#F8FBFF]/80 border-b border-[rgba(130,170,205,0.2)] p-3 flex items-center justify-center overflow-hidden">

        {/* Index Badge (e.g., 01, 02) or Discount Pill */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
          {indexLabel && (
            <span className="px-2 py-0.5 rounded-full bg-[#193B5B]/85 backdrop-blur-xs text-[#70C8ED] text-[10px] font-mono font-bold tracking-wider shadow-xs">
              {indexLabel}
            </span>
          )}
          {discountPercent && discountPercent > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white text-[10px] font-mono font-bold tracking-tight shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Floating Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleFav}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/80 backdrop-blur-md hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs focus:outline-none ${
            isFav ? 'text-[#E53935] border-[#E53935]/40' : 'text-[#718398] hover:text-[#193B5B]'
          }`}
          title={isFav ? t("Remove from Wishlist", "পছন্দ থেকে সরান") : t("Save to Wishlist", "পছন্দে রাখুন")}
          aria-label={`Wishlist ${product.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
        </button>

        {/* Product Photograph: Preserves 100% full view inside image frame */}
        <div className="card-image-wrapper w-full h-full">
          <ProductImage
            src={product.main_image}
            alt={product.name || 'Product'}
            fit="contain"
            aspectRatio="square"
            priority={priority}
            className="p-1 transition-transform duration-300 group-hover:scale-[1.03]"
            zoomOnHover={false}
          />
        </div>
      </div>

      {/* 2. PRODUCT METADATA & PRICING */}
      <div className={`flex flex-col justify-between flex-grow ${compact ? 'p-3' : 'p-3.5'}`}>
        <div>
          {/* Department / Category Pill Tag */}
          {showCategory && categoryLabel && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#DDEEFF]/60 border border-[rgba(130,170,205,0.25)] text-[9px] font-mono uppercase tracking-[0.12em] text-[#193B5B] font-semibold truncate max-w-full">
                {categoryLabel}
              </span>
            </div>
          )}

          {/* Product Title: Deep navy, strictly 2 lines */}
          <h3
            className={`font-bold text-[#193B5B] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.5rem] group-hover:text-[#0877C9] transition-colors leading-snug ${
              compact ? 'text-[12px]' : 'text-[13px]'
            }`}
            title={product.name}
          >
            {shortName}
          </h3>
        </div>

        {/* 3. PRICE & QUICK ADD INTERACTION */}
        <div className="mt-3 pt-2.5 border-t border-[rgba(130,170,205,0.2)] flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className={`font-extrabold text-[#193B5B] ${compact ? 'text-[13px]' : 'text-[14px] sm:text-[15px]'}`}>
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

          {/* Quick Add to Bag Action (Icy-Blue Gradient Pill Button) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isAvailable}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 focus:outline-none ${
              isAvailable
                ? 'bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white shadow-[0_4px_14px_rgba(112,200,237,0.4)] active:scale-95 cursor-pointer'
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
