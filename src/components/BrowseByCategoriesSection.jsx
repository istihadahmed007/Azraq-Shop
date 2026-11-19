import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Shop by Department (Futuristic Glass Mosaic)
 * 
 * Features:
 * - Frosted glass containers with blur and translucent borders.
 * - 2 Primary featured departments with expanded visual presence.
 * - 6 Secondary focused department tiles with authentic catalog cover photography.
 * - Strictly preserves 100% full image containment.
 */
export default function BrowseByCategoriesSection() {
  const { collections, navigateTo, t } = useShop();

  // Primary featured departments (IDs 2 and 6)
  const primaryDepartments = [
    collections.find(c => c.id === 2) || collections[0], // Gadgets & IT Accessories
    collections.find(c => c.id === 6) || collections[4], // Kitchen Appliances
  ].filter(Boolean);

  // Secondary departments (IDs 3, 4, 11, 5, 15, 10)
  const secondaryIds = [3, 4, 11, 5, 15, 10];
  const secondaryDepartments = secondaryIds
    .map(id => collections.find(c => c.id === id))
    .filter(Boolean);

  return (
    <section id="browse-categories" className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl rounded-[28px] shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] p-5 sm:p-7">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[rgba(130,170,205,0.18)]">
        <div>
          <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
            + {t("DEPARTMENTS & ARCHIVES", "বিভাগ ও ক্যাটালগ")}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight mt-0.5">
            {t('Shop by Department', 'বিভাগ অনুযায়ী কেনাকাটা')}
          </h2>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#193B5B] hover:text-[#0877C9] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs transition-all cursor-pointer"
        >
          <span>{t('View All 18 Collections', 'সকল ১৮টি কালেকশন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#718398]" />
        </button>
      </div>

      {/* Art-Directed Department Mosaic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">

        {/* 1. TWO PRIMARY FEATURED DEPARTMENTS (lg:col-span-5) */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
          {primaryDepartments.map((col, idx) => {
            const count = col.imported_product_count ?? col.product_count ?? 0;
            const subtitle = idx === 0 
              ? t("Audio, powerbanks, adapters & smart peripherals", "অডিও, চার্জার, অ্যাডাপ্টার ও স্মার্ট অ্যাক্সেসরিজ")
              : t("Precision kitchenware, grinders & appliances", "আধুনিক কিচেন অ্যাপ্লায়েন্স ও রান্নার সরঞ্জাম");

            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group cursor-pointer p-4 sm:p-5 rounded-[22px] border border-[rgba(130,170,205,0.25)] border-t-white/90 hover:border-[#70C8ED]/60 bg-white/75 hover:bg-white/95 backdrop-blur-md shadow-xs hover:shadow-[0_16px_36px_rgba(112,200,237,0.22)] transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-[#0877C9] uppercase tracking-wider block">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#193B5B] group-hover:text-[#0877C9] transition-colors mt-0.5">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#718398] mt-1 line-clamp-1">
                    {subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#193B5B] group-hover:text-[#0877C9] mt-3 transition-colors">
                    <span>{t("Explore Department", "কালেকশন দেখুন")}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div className="card-image-wrapper w-20 h-20 sm:w-24 sm:h-24 bg-white/80 backdrop-blur-md border border-[rgba(130,170,205,0.25)] rounded-[18px] p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                  <ProductImage
                    src={col.cover_image || col.image_url}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-[1.05] transition-transform duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. SIX SECONDARY FOCUSED DEPARTMENTS (lg:col-span-7: 3x2 grid) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
          {secondaryDepartments.map(col => {
            const count = col.imported_product_count ?? col.product_count ?? 0;
            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group cursor-pointer p-3 sm:p-3.5 rounded-[20px] border border-[rgba(130,170,205,0.25)] border-t-white/90 hover:border-[#70C8ED]/60 bg-white/70 hover:bg-white/95 backdrop-blur-md shadow-xs hover:shadow-[0_12px_28px_rgba(112,200,237,0.2)] transition-all flex flex-col justify-between"
              >
                <div className="card-image-wrapper w-full aspect-square bg-white/80 backdrop-blur-md border border-[rgba(130,170,205,0.2)] rounded-[16px] p-2 flex items-center justify-center overflow-hidden mb-2.5 shadow-inner">
                  <ProductImage
                    src={col.cover_image || col.image_url}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-[1.05] transition-transform duration-300"
                  />
                </div>

                <div>
                  <span className="text-[9px] font-mono text-[#718398] block">
                    {count} {t("Items", "পণ্য")}
                  </span>
                  <h4 className="text-xs font-bold text-[#193B5B] group-hover:text-[#0877C9] transition-colors truncate mt-0.5">
                    {col.name}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
