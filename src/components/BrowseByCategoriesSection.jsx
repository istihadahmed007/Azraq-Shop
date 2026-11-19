import React from 'react';
import { ArrowRight, ChevronRight, Grid } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Shop by Department Section (Browse by Category)
 * Clean editorial container displaying authentic photographic department tiles.
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
      
      <div className="bg-white border border-[#E5E3DA] rounded-[16px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(23,35,51,0.04)]">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shadow-xs">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#172333] tracking-tight">
                {t('Shop by Department', 'ক্যাটাগরি অনুযায়ী কিনুন')}
              </h2>
              <p className="text-xs text-[#667085]">
                {t('Explore curated collections across gadgets, lifestyle, and fashion', 'গ্যাজেট ও লাইফস্টাইলের সেরা ক্যাটাগরি')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('collections')}
            className="text-xs font-bold text-[#245BDB] hover:text-[#1C4BB8] flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#245BDB] transition-all"
          >
            <span>{t('View All Collections', 'সব কালেকশন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Editorial Department Grid: 8 columns on desktop, 4 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {displayCategories.slice(0, 8).map((col) => {
            const displayImage = col.cover_image || col.image_url;
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
                className="group flex flex-col items-center p-3 rounded-[12px] border border-[#E5E3DA] hover:border-[#245BDB] bg-[#FAF9F5] hover:bg-white transition-all duration-200 focus:outline-none text-center shadow-xs hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Image Well */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[8px] bg-white border border-[#E5E3DA] p-1.5 flex items-center justify-center overflow-hidden mb-2 group-hover:scale-105 transition-transform duration-200">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="rounded-[6px]"
                  />
                </div>

                {/* Category Label */}
                <span className="text-xs font-bold text-[#172333] group-hover:text-[#245BDB] transition-colors truncate max-w-full leading-tight">
                  {shortTitle}
                </span>

                {/* Item Count */}
                <span className="text-[10px] text-[#667085] mt-0.5 font-medium">
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
