import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Section C: Featured Curations (Cinematic 3-Card Glass Showcase)
 * 
 * Replicates the reference design's Section C:
 * - "+ FEATURED CURATIONS" header with refined typography and glass carousel controls (< >).
 * - Exactly THREE large, spacious, cinematic cards side-by-side (lg:grid-cols-3).
 * - Distinct index badge pills ("01", "02", "03").
 * - Strictly 100% full image containment, centered with zero cropping.
 * - Structured information: title, specs/description, authentic tags, retail price in BDT.
 * - Interactive pagination (< >) to cycle through curated selections without visual crowding.
 */
export default function TrendingRightNowSection() {
  const navigate = useNavigate();
  const {
    products,
    favorites,
    toggleFavorite,
    addToCart,
    formatPrice,
    t
  } = useShop();

  const [pageIndex, setPageIndex] = useState(0);

  // Exclude hero spotlight item AZQ-0009 so curations feel intentional and distinct
  const curatedProducts = products.filter(p => p.id !== 'AZQ-0009');
  const pageSize = 3;
  const totalPages = Math.min(6, Math.ceil(curatedProducts.length / pageSize));
  
  const currentSlice = curatedProducts.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const handlePrev = () => {
    setPageIndex(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setPageIndex(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleOpenProduct = (product) => {
    if (!product) return;
    navigate(`/product/${generateProductSlug(product)}`);
  };

  const handleDirectBuy = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0] || 'Default');
  };

  return (
    <section id="featured-curations" className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl rounded-[32px] shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] p-6 sm:p-8 transition-all">
      
      {/* Section Header (Reference Style: "+ FEATURED..." with < > controls) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[rgba(130,170,205,0.18)]">
        <div>
          <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.2em] block font-bold">
            + {t("FEATURED CURATIONS", "বাছাইকৃত সেরা কালেকশন")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#193B5B] tracking-tight mt-1">
            {t("Signature Everyday Selections", "সিগনেচার লাইফস্টাইল পণ্য")}
          </h2>
        </div>

        {/* Carousel Navigation Controls (< >) */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold text-[#718398] px-2">
            <span className="text-[#193B5B]">0{pageIndex + 1}</span>
            <span className="mx-1 text-[#82AACD]/50">/</span>
            <span>0{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous curations"
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] hover:text-[#0877C9] flex items-center justify-center shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next curations"
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] text-[#193B5B] hover:text-[#0877C9] flex items-center justify-center shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* EXACTLY THREE LARGE CINEMATIC CARDS SIDE-BY-SIDE (lg:grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {currentSlice.map((product, idx) => {
          const cardIndex = String(pageIndex * pageSize + idx + 1).padStart(2, '0');
          const isFav = favorites.includes(product.id);
          const originalPrice = product.original_price || (product.price ? Math.round(product.price * 1.25) : 0);

          return (
            <article
              key={product.id}
              onClick={() => handleOpenProduct(product)}
              className="group rounded-[26px] bg-white/70 hover:bg-white/90 border border-[rgba(130,170,205,0.22)] hover:border-[#70C8ED]/60 p-4 sm:p-5 flex flex-col justify-between shadow-[0_8px_24px_-6px_rgba(25,59,91,0.04)] hover:shadow-[0_20px_48px_-10px_rgba(112,200,237,0.22)] transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Top Container: Image & Badges */}
              <div className="space-y-4">
                
                {/* Large Contained Image Frame */}
                <div className="relative w-full h-56 sm:h-64 rounded-[20px] bg-gradient-to-b from-[#EDF5FA] to-[#E3EFF8] border border-[rgba(130,170,205,0.25)] p-4 flex items-center justify-center overflow-hidden">
                  
                  {/* Reference Style Index Badge: "01", "02", "03" */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#193B5B]/85 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-xs">
                      {cardIndex}
                    </span>
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isFav
                        ? 'bg-[#CF1322] border-[#CF1322] text-white shadow-xs'
                        : 'bg-white/80 border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-[#CF1322] hover:bg-white shadow-2xs'
                    }`}
                    aria-label="Save to wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* 100% Contained Product Image */}
                  <div className="w-full h-full flex items-center justify-center">
                    <ProductImage
                      src={product.main_image}
                      alt={product.name}
                      fit="contain"
                      aspectRatio="square"
                      priority={idx === 0}
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Stock Indicator Pill */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(130,170,205,0.25)] text-[9px] font-mono font-bold text-[#193B5B] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      <span>{t("Verified Sourcing", "ভেরিফাইড পণ্য")}</span>
                    </span>
                  </div>
                </div>

                {/* Information Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#718398] font-medium">
                    <span className="text-[#0877C9] font-bold uppercase tracking-wider font-mono text-[10px]">
                      {product.primary_collection_name || product.category || t("Everyday Curations", "কিউরেটেড পণ্য")}
                    </span>
                    <span className="font-mono text-[#718398]">
                      {product.sku || product.id}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#193B5B] tracking-tight leading-snug line-clamp-1 group-hover:text-[#0877C9] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#718398] line-clamp-2 leading-relaxed">
                    {product.description || t("Genuine product with full manufacturer warranty and verified quality inspection.", "আসল গ্যাজেট ও লাইফস্টাইল পণ্য। সরাসরি হোম ডেলিভারি ও সহজ রিটার্ন।")}
                  </p>

                  {/* Reference-Style Supporting Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2.5 py-1 rounded-full bg-[#EDF4F9] border border-[rgba(130,170,205,0.2)] text-[10px] font-semibold text-[#193B5B]">
                      {t("Direct Dispatch", "সরাসরি ডেলিভারি")}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#EDF4F9] border border-[rgba(130,170,205,0.2)] text-[10px] font-semibold text-[#193B5B]">
                      {t("Cash on Delivery", "ক্যাশ অন ডেলিভারি")}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Price & Action Row */}
              <div className="pt-5 mt-4 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-[#718398] font-medium leading-none mb-1">
                    {t("Retail Price", "মূল্য")}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black text-[#193B5B] tracking-tight">
                      {formatPrice ? formatPrice(product.price) : `৳${product.price?.toLocaleString?.() || product.price}`}
                    </span>
                    {originalPrice > product.price && (
                      <span className="text-xs text-[#718398]/70 line-through">
                        {formatPrice ? formatPrice(originalPrice) : `৳${originalPrice?.toLocaleString?.()}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleDirectBuy(e, product)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(112,200,237,0.4)] hover:shadow-[0_6px_20px_rgba(112,200,237,0.6)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t("Add to Cart", "ব্যাগে নিন")}</span>
                  </button>
                </div>
              </div>

            </article>
          );
        })}
      </div>

      {/* Bottom Full Catalog Action Bar */}
      <div className="mt-8 pt-4 border-t border-[rgba(130,170,205,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#718398]">
          <span className="font-bold text-[#193B5B]">1,200+</span> {t("products available in 18 curated departments.", "টি আসল পণ্য ১৮টি ডিপার্টমেন্টে পাওয়া যাচ্ছে।")}
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('browse-categories') || document.getElementById('all-products');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-[#193B5B] hover:text-[#0877C9] flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs transition-all cursor-pointer"
        >
          <span>{t("Explore Full Catalog & Departments", "সকল কালেকশন ও পণ্য দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0877C9]" />
        </button>
      </div>

    </section>
  );
}
