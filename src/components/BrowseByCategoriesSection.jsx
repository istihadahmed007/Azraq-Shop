import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Transparent Glassy Department Discovery Mosaic
 * 
 * Features:
 * - Frosted glass containers with blur and ambient edge lighting.
 * - 2 Primary featured departments (Gadgets & IT, Kitchen Appliances) with expanded visual presence.
 * - 6 Secondary focused department tiles with authentic catalog cover photography.
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
    <section id="browse-categories" className="w-full select-none border border-white/90 bg-white/75 backdrop-blur-2xl rounded-2xl shadow-[0_12px_36px_0_rgba(31,38,135,0.06)] p-5 sm:p-7">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-white/80">
        <div>
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.16em] block font-bold">
            {t("DEPARTMENTS & ARCHIVES", "বিভাগ ও ক্যাটালগ")}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {t('Shop by Department', 'বিভাগ অনুযায়ী কেনাকাটা')}
          </h2>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white border border-white/90 shadow-2xs transition-all cursor-pointer"
        >
          <span>{t('View All 18 Collections', 'সকল ১৮টি কালেকশন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Art-Directed Editorial Department Mosaic */}
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
                className="group cursor-pointer p-4 sm:p-5 rounded-2xl border border-white/90 hover:border-blue-400/50 bg-white/70 hover:bg-white backdrop-blur-md shadow-sm hover:shadow-lg transition-all flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                    {count} {t("Products", "পণ্য")}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 group-hover:text-blue-600 mt-3 transition-colors">
                    <span>{t("Explore Department", "কালেকশন দেখুন")}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/80 backdrop-blur-md border border-white/90 rounded-xl p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                  <ProductImage
                    src={col.cover_image || col.image_url}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-105 transition-transform duration-300"
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
                className="group flex flex-col justify-between p-3.5 rounded-2xl border border-white/90 hover:border-blue-400/50 bg-white/70 hover:bg-white backdrop-blur-md shadow-2xs hover:shadow-md text-left transition-all focus:outline-none cursor-pointer"
              >
                <div className="w-full aspect-square bg-white/80 backdrop-blur-md border border-white/90 rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2.5 shadow-inner">
                  <ProductImage
                    src={col.cover_image || col.image_url}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {shortName}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
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
