import React from 'react';
import { ArrowRight, Sparkles, Layers, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  return (
    <section id="shop-by-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-azraq-lime" />
            <span className="text-xs font-black tracking-widest text-azraq-violet uppercase">
              {t("AUTHENTIC CATALOGUE TAXONOMY", "অনুমোদিত কালেকশন ক্যাটালগ")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-azraq-navy tracking-tight">
            {t("SHOP BY COLLECTION", "কালেকশন অনুযায়ী কেনাকাটা")}
          </h2>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-2 max-w-xl">
            {t(
              "Explore all 18 authentic EasyDrop imported main collections. Every category thoughtfully categorized with verified product inventory.",
              "ইজিড্রপ থেকে আমদানিকৃত সকল ১৮টি কালেকশন ঘুরে দেখুন। প্রতিটি ক্যাটাগরিতে রয়েছে যাচাইকৃত সেরা পণ্য।"
            )}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-azraq-purple/30 text-azraq-navy hover:text-azraq-violet font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all group"
        >
          <span>{t("View All 18 Collections", "সকল ১৮টি কালেকশন")}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Editorial Composition Grid (Varied Card Proportions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
        {collections.map((col, idx) => {
          // Editorial sizing logic: first 2 are wide (col-span-6), next 3 are medium (col-span-4), etc.
          let colSpan = "lg:col-span-4";
          if (idx === 0 || idx === 1) {
            colSpan = "lg:col-span-6";
          } else if (idx === 5 || idx === 6) {
            colSpan = "lg:col-span-6";
          } else if (idx === 11) {
            colSpan = "lg:col-span-8";
          } else if (idx === 12) {
            colSpan = "lg:col-span-4";
          }

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className={`${colSpan} group cursor-pointer rounded-3xl bg-white border border-azraq-purple/20 p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-[340px]`}
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-azraq-lavender/60 rounded-full blur-2xl group-hover:bg-azraq-purple/30 transition-all pointer-events-none" />

              {/* Top Tag Row */}
              <div className="flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-azraq-cloud border border-azraq-purple/20 text-azraq-navy text-[10px] font-mono font-bold">
                  {col.imported_product_count} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-azraq-lavender text-azraq-violet text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              {/* Center Collection Art / Isolated Icon Area */}
              <div className="relative w-full h-36 flex items-center justify-center my-auto overflow-hidden">
                {col.image_url ? (
                  <img
                    src={col.image_url}
                    alt={col.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-azraq-cloud flex items-center justify-center text-azraq-violet">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
              </div>

              {/* Bottom Details Row */}
              <div className="z-10 pt-4 border-t border-gray-100 flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-base sm:text-lg text-azraq-navy truncate group-hover:text-azraq-violet transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-azraq-navy/60 line-clamp-1 mt-0.5 font-normal">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>

                {/* Neon Lime Action Button (Nexora Inspired) */}
                <div className="w-9 h-9 rounded-full bg-azraq-lime group-hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform group-hover:scale-110 flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-azraq-navy transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

