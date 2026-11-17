import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

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

  // Take 6 curated popular products from the catalog
  const popularList = products.slice(0, 6);

  return (
    <section id="popular-products" className="w-full py-4 select-none">
      
      {/* Section Header (Reference Screenshot Exact Match: - Popular Products ... View All ->) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-1 rounded-full bg-[#0877C9]" />
          <h2 className="text-lg sm:text-xl font-black text-[#101C35] tracking-tight">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 items-stretch">
        
        {/* 6 Product Cards (col-span-1 each, taking 6 columns on xl) */}
        {popularList.map((product) => (
          <div key={product.id} className="xl:col-span-1">
            <ProductCard
              product={product}
              isFav={favorites.includes(product.id)}
              onToggleFavorite={toggleFavorite}
              onSelectProduct={setSelectedProduct}
              onAddToCart={addToCart}
              compact={true}
              showRating={false}
              showSku={false}
              showCategory={false}
            />
          </div>
        ))}

        {/* 1 Right-Side Featured Collection Card (Matching Reference: 'Stay Connected Always') */}
        <div 
          onClick={() => navigateTo('collections')}
          className="xl:col-span-1 rounded-[24px] bg-gradient-to-br from-[#E2F0FD] via-[#D3E9FD] to-[#C0E0FB] border border-white/80 shadow-[0_6px_20px_rgba(6,43,79,0.06)] p-4 flex flex-col justify-between cursor-pointer hover:shadow-[0_12px_28px_rgba(8,119,201,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle Ambient Light */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/40 rounded-full blur-xl pointer-events-none" />

          <div>
            <h3 className="text-sm sm:text-base font-black text-[#101C35] tracking-tight leading-snug">
              {t('Stay Connected Always', 'সবসময় থাকুন কানেক্টেড')}
            </h3>
            <p className="text-[11px] font-medium text-[#485B73] mt-1.5 leading-relaxed line-clamp-3">
              {t(
                'Explore the best everyday mobile & lifestyle accessories at AZRAQ.',
                'সেরা গ্যাজেটস ও কিউরেটেড এভরিডে পণ্য কালেকশন।'
              )}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] text-white text-[11px] font-bold shadow-[0_3px_10px_rgba(37,99,235,0.25)] hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t('Explore More', 'আরও দেখুন')}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Product Photo Showcase */}
            <div className="w-full aspect-[4/3] rounded-xl bg-white/60 p-2 flex items-center justify-center overflow-hidden">
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
