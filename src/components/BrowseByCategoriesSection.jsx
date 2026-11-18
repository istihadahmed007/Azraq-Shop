import React from 'react';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Dynamic Glassmorphism Category Cards Strip
 * Displays authentic collections loaded dynamically from the catalog.
 */
export default function BrowseByCategoriesSection() {
  const { collections, navigateTo, t } = useShop();

  // Curated target collections list matching requirements:
  // Gadgets & IT Accessories, Health & Beauty, Home & Lifestyle, Jewelries & Accessories,
  // Kitchen Appliances, Gifts, Men's Fashion, Sports & Kids, Baby & Mom, Sunglass Collection.
  const targetCategoryIds = [2, 3, 4, 5, 6, 10, 11, 15, 17, 9];

  // Dynamically resolve items from context collections
  const activeCategories = targetCategoryIds
    .map(id => collections.find(c => c.id === id))
    .filter(Boolean);

  // Fallback to top collections if list is short
  const displayCategories = activeCategories.length >= 6
    ? activeCategories
    : collections.slice(0, 10);

  return (
    <section id="browse-categories" className="w-full py-1 select-none">
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 no-scrollbar">

        {/* Left 'Shop by Category' Card (Sharp 6px radius) */}
        <div
          onClick={() => navigateTo('collections')}
          className="shrink-0 rounded-[6px] glass-card px-3.5 py-3 flex items-center gap-2.5 cursor-pointer group border border-white/95 bg-white/90"
        >
          <span className="text-xs font-black text-[#101C35] leading-tight whitespace-nowrap">
            {t('Shop by', 'ক্যাটাগরি')} <br />
            {t('Category', 'অনুযায়ী')}
          </span>
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-r from-[#0877C9] to-[#2563EB] group-hover:from-[#076bb5] group-hover:to-[#1d4ed8] text-white flex items-center justify-center transition-colors shadow-2xs">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Dynamic Category Cards Row: Larger, properly fitted photographs */}
        {displayCategories.map((col) => {
          const displayImage = col.cover_image || col.image_url || col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
          const shortTitle = col.name
            .replace(' & IT Accessories', '')
            .replace(' Collection', '')
            .replace(' Clothing', '')
            .replace(' Appliances', '');

          return (
            <button
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="shrink-0 min-w-[96px] sm:min-w-[108px] rounded-[6px] glass-card p-2 sm:p-2.5 flex flex-col items-center gap-1.5 group focus:outline-none border border-white/95 bg-white/90 hover:border-[#0877C9]/40 transition-all"
            >
              {/* Inner Image Container: Substantially larger and clean */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[4px] bg-[#F8FBFF] border border-white/90 flex items-center justify-center p-1.5 overflow-hidden transition-colors group-hover:bg-white shadow-2xs">
                <img
                  src={displayImage}
                  alt={col.name}
                  onError={(e) => {
                    const fallback = col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                    if (e.target.src !== fallback) {
                      e.target.src = fallback;
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-108 transition-transform duration-300"
                />
              </div>

              {/* Category Label */}
              <span className="text-[11px] sm:text-[12px] font-bold text-[#101C35] group-hover:text-[#0877C9] transition-colors truncate max-w-[96px] text-center">
                {shortTitle}
              </span>
            </button>
          );
        })}

        {/* Right 'View All / Others' Card */}
        <button
          onClick={() => navigateTo('collections')}
          className="shrink-0 min-w-[90px] sm:min-w-[100px] rounded-[6px] glass-card p-2 sm:p-2.5 flex flex-col items-center justify-center gap-1.5 group focus:outline-none border border-white/95 bg-white/90 hover:border-[#0877C9]/40 transition-all"
          title={t("All Collections", "সকল কালেকশন")}
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[4px] bg-[#D9EDFF]/80 flex items-center justify-center text-[#0877C9] group-hover:bg-[#0877C9] group-hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[11px] sm:text-[12px] font-bold text-[#101C35] group-hover:text-[#0877C9] transition-colors">
            {t('Others', 'অন্যান্য')}
          </span>
        </button>

      </div>
    </section>
  );
}
