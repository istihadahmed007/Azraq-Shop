import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Shop by Collection Section (Shopee Retail Layout)
 * Clean retail cards featuring genuine EasyDrop collections.
 */
export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  // Show top 6 collections in this homepage spotlight
  const spotlightCollections = collections.slice(0, 6);

  return (
    <section id="shop-by-collection" className="w-full select-none">
      
      <div className="bg-white border border-gray-200 rounded-[4px] p-4 sm:p-5 shadow-xs">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0877C9]" />
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-[#212121]">
              {t('Catalog Collections', 'কালেকশন ক্যাটালগ')}
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

        {/* 3 or 6 Column Clean Collection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {spotlightCollections.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;
            const count = col.imported_product_count ?? col.product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group cursor-pointer rounded-[3px] border border-gray-200 hover:border-[#0877C9] hover:shadow-xs p-2.5 flex flex-col justify-between transition-all bg-white"
              >
                {/* Collection Image */}
                <div className="relative w-full aspect-square bg-gray-50 rounded-[2px] p-2 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={displayImage}
                    alt={col.name}
                    onError={(e) => {
                      const fallback = col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                      if (e.target.src !== fallback) {
                        e.target.src = fallback;
                      }
                    }}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#212121] truncate group-hover:text-[#0877C9] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {count} {t('Products', 'পণ্য')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}