import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Featured & Best Sellers Section
 * Strictly displays FIVE product cards per row on desktop screens.
 */
export default function TrendingRightNowSection() {
  const {
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    addToCart,
    t
  } = useShop();

  // Curated 10 featured products for two complete 5-card rows on desktop
  const featuredList = products.slice(0, 10);

  return (
    <section id="popular-products" className="w-full select-none">
      
      <div className="bg-white border border-[#E5E3DA] rounded-[16px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(23,35,51,0.04)]">
        
        {/* Section Heading & Link */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shadow-xs">
              <Flame className="w-4 h-4 fill-[#245BDB] text-[#245BDB]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172333] tracking-tight">
                {t('Featured & Best Sellers', 'জনপ্রিয় ও বেস্ট সেলার')}
              </h2>
              <p className="text-xs text-[#667085]">
                {t('Top-selling customer favorites with verified reviews and nationwide delivery', 'গ্রাহকদের পছন্দের সেরা ১০টি গ্যাজেট ও লাইফস্টাইল পণ্য')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('all-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#245BDB] hover:text-[#1C4BB8] flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#245BDB] transition-all"
          >
            <span>{t('View All', 'সব দেখুন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Strictly FIVE Product Cards Per Row Grid on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">
          {featuredList.map((product, idx) => (
            <div key={product.id} className="h-full">
              <ProductCard
                product={product}
                isFav={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onSelectProduct={setSelectedProduct}
                onAddToCart={addToCart}
                compact={false}
                showCategory={true}
                priority={idx < 5}
              />
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
