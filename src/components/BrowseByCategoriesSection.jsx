import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Art-Directed Department Discovery
 * 
 * Replaces 8 identical rounded bubbles with an intentional architectural mosaic:
 * - 2 Primary featured departments (Gadgets & IT, Kitchen Appliances) with expanded visual presence.
 * - 6 Secondary focused department tiles with authentic catalog cover photography.
 * - Restrained typography and deliberate visual hierarchy.
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
    <section id="browse-categories" className="w-full select-none border border-[#E5E3DA] bg-white rounded-[6px] shadow-[0_1px_3px_rgba(23,35,51,0.03)] p-5 sm:p-7">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
        <div>
          <span className="text-[10px] font-mono text-[#667085] uppercase tracking-[0.16em] block font-semibold">
            {t("DEPARTMENTS & ARCHIVES", "বিভাগ ও ক্যাটালগ")}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight mt-0.5">
            {t('Shop by Department', 'বিভাগ অনুযায়ী কেনাকাটা')}
          </h2>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-semibold text-[#172333] hover:text-[#245BDB] flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#172333] transition-colors"
        >
          <span>{t('View All 18 Collections', 'সকল ১৮টি কালেকশন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
        </button>
      </div>

      {/* Art-Directed Editorial Department Mosaic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">

        {/* 1. TWO PRIMARY FEATURED DEPARTMENTS (lg:col-span-6: 2 wide columns) */}
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
                className="group cursor-pointer p-4 sm:p-5 rounded-[4px] border border-[#E5E3DA] hover:border-[#172333] bg-[#FAF9F5] hover:bg-white transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-semibold text-[#8C99A8] uppercase tracking-wider block">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#172333] group-hover:text-[#245BDB] transition-colors mt-0.5">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#667085] mt-1 line-clamp-1">
                    {subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#172333] group-hover:text-[#245BDB] mt-3 transition-colors">
                    <span>{t("Explore Department", "কালেকশন দেখুন")}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-[#E5E3DA] rounded-[3px] p-2 flex items-center justify-center shrink-0 overflow-hidden">
                  <ProductImage
                    src={col.cover_image || col.image_url}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-104 transition-transform duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. SIX SECONDARY FOCUSED DEPARTMENTS (lg:col-span-7: 3x2 grid) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
          {secondaryDepartments.map((col) => {
            const count = col.imported_product_count ?? col.product_count ?? 0;
            const shortName = col.name
              .replace(' & IT Accessories', '')
              .replace(' Collection', '')
              .replace(' Appliances', '');

            return (
              <button
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="group flex flex-col justify-between p-3 sm:p-3.5 rounded-[4px] border border-[#E5E3DA] hover:border-[#172333] bg-[#FAF9F5] hover:bg-white text-left transition-all focus:outline-none"
              >
                <div className="w-full aspect-square bg-white border border-[#E5E3DA] rounded-[3px] p-2 flex items-center justify-center overflow-hidden mb-2.5">
                  <ProductImage
                    src={col.cover_image || col.image_url}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-104 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#172333] group-hover:text-[#245BDB] transition-colors truncate">
                    {shortName}
                  </h4>
                  <span className="text-[10px] font-mono text-[#8C99A8] block mt-0.5">
                    {count} {t("Items", "টি")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}
