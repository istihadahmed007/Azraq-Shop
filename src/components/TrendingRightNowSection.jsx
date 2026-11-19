import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Featured & Best Sellers Section
 * 
 * Strictly displays FIVE product cards per row on desktop screens (lg:grid-cols-5).
 * Showcases authentic top-selling products across categories without repeating hero items.
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

  // Exclude hero spotlight item AZQ-0009 so homepage feels professionally merchandised
  const heroExcluded = products.filter(p => p.id !== 'AZQ-0009');
  // 10 distinct products for two complete 5-card rows on desktop
  const featuredList = heroExcluded.slice(0, 10);

  return (
    <section id="popular-products" className="w-full select-none border border-[#E5E3DA] bg-white rounded-[6px] shadow-[0_1px_3px_rgba(23,35,51,0.03)] p-5 sm:p-7">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
        <div>
          <span className="text-[10px] font-mono text-[#667085] uppercase tracking-[0.16em] block font-semibold">
            {t("CURATED ARCHIVE", "বাছাইকৃত সংগ্রহ")}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight mt-0.5">
            {t('Featured & Best Sellers', 'জনপ্রিয় ও বেস্ট সেলার')}
          </h2>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('all-products');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-semibold text-[#172333] hover:text-[#245BDB] flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#172333] transition-colors"
        >
          <span>{t('View All Products', 'সব পণ্য দেখুন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
        </button>
      </div>

      {/* Strictly FIVE Product Cards Per Row Grid on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 items-stretch">
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

    </section>
  );
}
