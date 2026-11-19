import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Section C: Featured Cards & Best Sellers
 * 
 * Replicates the reference's premium image-card presentation:
 * - "+ FEATURED CURATIONS" header with refined typography and navigation indicator.
 * - Frosted crystal glass cards with index badges ("01", "02", "03", etc.).
 * - Strictly 100% full image containment, centered with zero cropping.
 * - Strictly FIVE product cards per row on desktop screens (lg:grid-cols-5).
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
    <section id="popular-products" className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl rounded-[28px] shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] p-5 sm:p-7">
      
      {/* Section Header (Reference Style: "+ FEATURED...") */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[rgba(130,170,205,0.18)]">
        <div>
          <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
            + {t("FEATURED CURATIONS & BEST SELLERS", "বাছাইকৃত সেরা কালেকশন")}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight mt-0.5">
            {t('Trending Right Now', 'জনপ্রিয় ও বেস্ট সেলার')}
          </h2>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('all-products');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-[#193B5B] hover:text-[#0877C9] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs transition-all cursor-pointer"
        >
          <span>{t('View All Products', 'সব পণ্য দেখুন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#718398]" />
        </button>
      </div>

      {/* Strictly FIVE Product Cards Per Row Grid on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 items-stretch">
        {featuredList.map((product, idx) => {
          const indexNumber = String(idx + 1).padStart(2, '0');
          return (
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
                indexLabel={indexNumber}
              />
            </div>
          );
        })}
      </div>

    </section>
  );
}
