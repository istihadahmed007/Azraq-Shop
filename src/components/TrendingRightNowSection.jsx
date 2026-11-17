import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Trending / Popular Products Section
 * Features 6 popular cards and 1 right-side featured collection banner with equal height.
 */
export default function TrendingRightNowSection() {
  const {
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    addToCart,
    navigateTo,
    t
  } = useShop();

  // Curated 6 popular products from the catalog
  const popularList = products.slice(0, 6);

  return (
    <section id="popular-products" className="w-full max-w-full overflow-hidden py-1 select-none">

      {/* Section Heading & Link */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0877C9] shadow-[0_0_8px_rgba(8,119,201,0.5)]" />
          <h2 className="text-xl sm:text-2xl font-black text-[#101C35] tracking-tight">
            {t('Popular Products', 'জনপ্রিয় পণ্যসমূহ')}
          </h2>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('all-products') || document.getElementById('shop-by-collection');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs sm:text-sm font-bold text-[#0877C9] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors group"
        >
          <span>{t('View All', 'সব দেখুন')}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Main Grid: 6 Products on Left + 1 Editorial Feature Card on Right */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 sm:gap-4 items-stretch">

        {/* 6 Product Cards */}
        {popularList.map((product) => (
          <div key={product.id} className="col-span-1 h-full">
            <ProductCard
              product={product}
              isFav={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              onSelectProduct={setSelectedProduct}
              onAddToCart={addToCart}
              compact={true}
              showCategory={true}
            />
          </div>
        ))}

        {/* 1 Right-Side Featured Collection Glass Card */}
        <div
          onClick={() => navigateTo('collections')}
          className="col-span-2 sm:col-span-3 lg:col-span-1 xl:col-span-1 rounded-[22px] glass-card p-4 flex flex-col justify-between cursor-pointer group relative overflow-hidden h-full"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#69C5F5]/20 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0877C9]/10 text-[#0877C9] text-[9px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-2.5 h-2.5 text-[#0877C9]" />
              <span>{t('Featured', 'বাছাই')}</span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-[#101C35] tracking-tight leading-snug">
              {t('Stay Connected Always', 'সবসময় থাকুন কানেক্টেড')}
            </h3>

            <p className="text-[11px] font-medium text-[#71849B] mt-1.5 leading-relaxed line-clamp-3">
              {t(
                'Explore the best everyday mobile accessories & curated essentials at AZRAQ.',
                'সেরা গ্যাজেটস ও কিউরেটেড এভরিডে পণ্য কালেকশন।'
              )}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-full glass-button-primary text-[11px] font-bold flex items-center justify-center gap-1.5"
            >
              <span>{t('Explore More', 'আরও দেখুন')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Product Photo Showcase */}
            <div className="w-full aspect-[4/3] rounded-[16px] bg-[#F8FBFF]/85 border border-white/80 p-2 flex items-center justify-center overflow-hidden">
              <img
                src="https://easydrop.asia/products/image-1794224164356-135288231.jpeg"
                alt="Feature"
                className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
