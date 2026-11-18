import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Shop by Collection Section
 * Soft-neumorphic cards featuring genuine EasyDrop collections.
 */
export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  // Show top 6 collections in this homepage spotlight
  const spotlightCollections = collections.slice(0, 6);

  return (
    <section id="shop-by-collection" className="w-full select-none">
      
      <div className="bg-[#F7FAFD] border border-[#D5E2EE]/90 rounded-[26px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(50,75,100,0.07)]">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E1EDF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EDF4F9] text-[#0877C9] border border-[#D5E2EE] flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4 text-[#0877C9]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#293B52] tracking-tight">
                {t('Catalog Collections', 'কালেকশন ক্যাটালগ')}
              </h2>
              <p className="text-xs text-[#6B7D93]">
                {t('Explore full themed departments across our complete product range', 'আসল পণ্য ও বিভাগের বিশেষ কালেকশন')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('collections')}
            className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] shadow-2xs transition-all"
          >
            <span>{t('View All 18 Collections', 'সকল ১৮টি কালেকশন')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6-Column Clean Collection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
          {spotlightCollections.map(col => {
            const displayImage = col.cover_image || col.image_url;
            const count = col.imported_product_count ?? col.product_count ?? 0;

            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group cursor-pointer rounded-[20px] border border-[#D5E2EE]/80 hover:border-[#0877C9] bg-[#EDF4F9] hover:bg-white p-3 flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-1"
              >
                {/* Collection Image */}
                <div className="relative w-full aspect-square bg-white rounded-[16px] border border-[#E1EDF7] p-2 flex items-center justify-center overflow-hidden mb-2.5">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="rounded-[12px] group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#293B52] truncate group-hover:text-[#0877C9] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#6B7D93] mt-0.5">
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