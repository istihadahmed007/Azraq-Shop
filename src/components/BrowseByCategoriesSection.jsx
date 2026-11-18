import React from 'react';
import { ArrowRight, ChevronRight, Grid } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Shop by Category Section (Shopee Retail Layout)
 * Displays authentic collections in a clean retail grid with genuine catalog photography.
 */
export default function BrowseByCategoriesSection() {
  const { collections, navigateTo, t } = useShop();

  // Curated target collections list matching authentic catalog
  const targetCategoryIds = [2, 3, 4, 5, 6, 10, 11, 15, 17, 9];

  // Dynamically resolve items from context collections
  const activeCategories = targetCategoryIds
    .map(id => collections.find(c => c.id === id))
    .filter(Boolean);

  const displayCategories = activeCategories.length >= 6
    ? activeCategories
    : collections.slice(0, 10);

  return (
    <section id="browse-categories" className="w-full select-none">
      
      {/* Retail Category Box */}
      <div className="bg-white border border-gray-200 rounded-[4px] p-4 sm:p-5 shadow-xs">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-[#0877C9]" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#212121]">
              {t('Categories', 'ক্যাটাগরি')}
            </h2>
          </div>

          <button
            onClick={() => navigateTo('collections')}
            className="text-xs font-semibold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1 transition-colors"
          >
            <span>{t('View All 18 Collections', 'সকল ১৮টি কালেকশন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Category Grid (2 rows or horizontal scroll on mobile, 5-8 cols on desktop) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {displayCategories.slice(0, 8).map((col) => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
            const shortTitle = col.name
              .replace(' & IT Accessories', '')
              .replace(' Collection', '')
              .replace(' Clothing', '')
              .replace(' Appliances', '');

            const count = col.imported_product_count ?? col.product_count ?? 0;

            return (
              <button
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group flex flex-col items-center p-2 rounded-[3px] border border-gray-100 hover:border-[#0877C9] hover:shadow-xs transition-all focus:outline-none bg-white text-center"
              >
                {/* Clean Image Well */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[2px] bg-gray-50 flex items-center justify-center p-1.5 overflow-hidden mb-1.5 group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={displayImage}
                    alt={col.name}
                    onError={(e) => {
                      const fallback = col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                      if (e.target.src !== fallback) {
                        e.target.src = fallback;
                      }
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Category Label */}
                <span className="text-[11px] sm:text-xs font-medium text-[#212121] group-hover:text-[#0877C9] transition-colors truncate max-w-full leading-tight">
                  {shortTitle}
                </span>

                {/* Item Count */}
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {count} {t('Items', 'টি')}
                </span>
              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}