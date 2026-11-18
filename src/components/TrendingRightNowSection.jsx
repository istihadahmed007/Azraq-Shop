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
      
      <div className="bg-[#F7FAFD] border border-[#D5E2EE]/90 rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,75,100,0.07)]">
        
        {/* Section Heading & Link */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E1EDF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EDF4F9] text-[#EE8056] border border-[#D5E2EE] flex items-center justify-center shadow-2xs">
              <Flame className="w-4 h-4 fill-[#EE8056] text-[#EE8056]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#293B52] tracking-tight">
                {t('Featured & Best Sellers', 'জনপ্রিয় ও বেস্ট সেলার')}
              </h2>
              <p className="text-xs text-[#6B7D93]">
                {t('Top-selling customer favorites with verified reviews and nationwide delivery', 'গ্রাহকদের পছন্দের সেরা ১০টি গ্যাজেট ও লাইফস্টাইল পণ্য')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('all-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] shadow-2xs transition-all"
          >
            <span>{t('View All', 'সব দেখুন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Strictly FIVE Product Cards Per Row Grid on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">
          {featuredList.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard
                product={product}
                isFav={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onSelectProduct={setSelectedProduct}
                onAddToCart={addToCart}
                compact={false}
                showCategory={true}
              />
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}