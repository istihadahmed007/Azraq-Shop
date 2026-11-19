import React from 'react';
import { ChevronRight, Layers, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — The AZRAQ Edit (Signature Collections Section)
 * Curated signature collections from authentic database records.
 */
export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  // Show top 6 collections in this homepage spotlight
  const spotlightCollections = collections.slice(0, 6);

  return (
    <section id="shop-by-collection" className="w-full select-none">
      
      <div className="bg-white border border-[#E5E3DA] rounded-[16px] p-5 sm:p-7 shadow-[0_4px_20px_rgba(23,35,51,0.04)]">
        
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-[#245BDB]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#172333] tracking-tight">
                  {t('The AZRAQ Edit', 'আজরাক সিগনেচার কালেকশন')}
                </h2>
                <span className="hidden sm:inline px-2 py-0.5 rounded-[4px] bg-[#D7ED78] text-[#172333] text-[10px] font-bold uppercase tracking-wider">
                  Curated
                </span>
              </div>
              <p className="text-xs text-[#667085]">
                {t('Explore full themed departments across our complete product range', 'আসল পণ্য ও বিভাগের বিশেষ কালেকশন')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('collections')}
            className="text-xs font-bold text-[#245BDB] hover:text-[#1C4BB8] flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#245BDB] transition-all"
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
                className="group cursor-pointer rounded-[12px] border border-[#E5E3DA] hover:border-[#245BDB] bg-[#FAF9F5] hover:bg-white p-3 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Collection Image */}
                <div className="relative w-full aspect-square bg-white rounded-[8px] border border-[#E5E3DA] p-2 flex items-center justify-center overflow-hidden mb-2.5">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="rounded-[6px] group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#172333] truncate group-hover:text-[#245BDB] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#667085] mt-0.5 font-medium">
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
