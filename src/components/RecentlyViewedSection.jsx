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
      <div className="bg-white border border-[#E5E3DA] rounded-[16px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(23,35,51,0.04)]">
        
        {/* Section Heading */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shadow-xs">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172333] tracking-tight">
                {t('Recently Viewed', 'সম্প্রতি দেখা পণ্য')}
              </h2>
              <p className="text-xs text-[#667085]">
                {t('Products you recently browsed in AZRAQ Shop', 'আপনার সম্প্রতি ব্রাউজ করা পণ্যের তালিকা')}
              </p>
            </div>
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
            className="text-xs font-semibold text-[#667085] hover:text-[#CF1322] transition-colors"
          >
            {t('Clear History', 'মুছে ফেলুন')}
          </button>
        </div>

        {/* 5-Column Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4.5 items-stretch">
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
