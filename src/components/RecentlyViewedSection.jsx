import React, { useState, useEffect } from 'react';
import { History, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Recently Viewed Section
 * 
 * Displays products recently inspected by the customer, tracked via localStorage ('azraq_recently_viewed').
 * Strictly returns null (hidden) when no recent browsing history is recorded.
 */
export default function RecentlyViewedSection() {
  const {
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    addToCart,
    t
  } = useShop();

  const [recentlyViewedIds, setRecentlyViewedIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('azraq_recently_viewed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewedIds(parsed);
        }
      }
    } catch (e) {
      // Safe fallback
    }
  }, []);

  // Filter products matching recently viewed IDs in chronological order
  const recentProducts = recentlyViewedIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 5); // Strictly top 5 on desktop

  // Strictly hidden if customer has not viewed any products
  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section id="recently-viewed" className="w-full select-none">
      <div className="bg-white border border-[#E5E3DA] rounded-[6px] p-5 sm:p-7 shadow-[0_1px_3px_rgba(23,35,51,0.03)]">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
          <div>
            <span className="text-[10px] font-mono text-[#667085] uppercase tracking-[0.16em] block font-semibold">
              {t("BROWSING HISTORY", "ব্রাউজিং হিস্ট্রি")}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight mt-0.5">
              {t('Recently Viewed', 'সম্প্রতি দেখা পণ্য')}
            </h2>
          </div>

          <button
            onClick={() => {
              try {
                localStorage.removeItem('azraq_recently_viewed');
                setRecentlyViewedIds([]);
              } catch (e) {
                // Ignore
              }
            }}
            className="text-xs font-semibold text-[#667085] hover:text-[#172333] transition-colors"
          >
            {t('Clear History', 'মুছে ফেলুন')}
          </button>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-3.5 items-stretch">
          {recentProducts.map((product) => (
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
