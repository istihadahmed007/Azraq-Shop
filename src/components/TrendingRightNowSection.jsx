import React from 'react';
import { ChevronRight, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Featured & Best Sellers Section (Shopee Retail Layout)
 * Displays top authentic catalog products in a clean, consistent 5-6 column retail grid.
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

  // Curated 5 featured products from the catalog
  const featuredList = products.slice(0, 5);

  return (
    <section id="popular-products" className="w-full select-none">
      
      <div className="bg-white border border-gray-200 rounded-[4px] p-4 sm:p-5 shadow-xs">
        
        {/* Section Heading & Link */}
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#EE4D2D]" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#212121]">
              {t('Featured & Best Sellers', 'জনপ্রিয় ও বেস্ট সেলার')}
            </h2>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('all-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1 transition-colors"
          >
            <span>{t('View All', 'সব দেখুন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Retail Grid: 5 columns on desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 items-stretch">
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