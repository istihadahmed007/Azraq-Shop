import React from 'react';
import { ArrowRight, ChevronRight, Grid } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Shop by Category Section
 * Soft-neumorphic cards featuring authentic catalog category photography.
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
      
      {/* Neumorphic Category Container */}
      <div className="bg-[#F7FAFD] border border-[#D5E2EE]/90 rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,75,100,0.07)]">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E1EDF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EDF4F9] text-[#0877C9] border border-[#D5E2EE] flex items-center justify-center shadow-2xs">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#293B52] tracking-tight">
                {t('Shop by Category', 'ক্যাটাগরি অনুযায়ী কিনুন')}
              </h2>
              <p className="text-xs text-[#6B7D93]">
                {t('Explore curated collections across gadgets, lifestyle, and fashion', 'গ্যাজেট ও লাইফস্টাইলের সেরা ক্যাটাগরি')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('collections')}
            className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] shadow-2xs transition-all"
          >
            <span>{t('View All Collections', 'সব কালেকশন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Neumorphic Category Grid: 8 columns on desktop, 4 on tablet, 2 on mobile */}
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
                className="group flex flex-col items-center p-3 rounded-[20px] border border-[#D5E2EE]/80 hover:border-[#0877C9] bg-[#EDF4F9] hover:bg-white transition-all duration-200 focus:outline-none text-center shadow-2xs hover:shadow-md hover:-translate-y-1"
              >
                {/* Image Well */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[16px] bg-white border border-[#E1EDF7] shadow-inner p-1.5 flex items-center justify-center overflow-hidden mb-2 group-hover:scale-106 transition-transform duration-200">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="rounded-[12px]"
                  />
                </div>

                {/* Category Label */}
                <span className="text-xs font-bold text-[#293B52] group-hover:text-[#0877C9] transition-colors truncate max-w-full leading-tight">
                  {shortTitle}
                </span>

                {/* Item Count */}
                <span className="text-[10px] text-[#6B7D93] mt-0.5">
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