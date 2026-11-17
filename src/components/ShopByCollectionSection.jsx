import React from 'react';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Shop by Collection Section
 * Reusable frosted glass cards with genuine EasyDrop imported collections.
 */
export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  // Show top 6 collections in this homepage spotlight
  const spotlightCollections = collections.slice(0, 6);

  return (
    <section id="shop-by-collection" className="w-full py-2 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0877C9] shadow-[0_0_8px_rgba(8,119,201,0.5)]" />
            <span className="text-[11px] font-black tracking-widest text-[#0877C9] uppercase">
              {t("AUTHENTIC CATALOGUE TAXONOMY", "অনুমোদিত কালেকশন ক্যাটালগ")}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-black text-[#101C35] tracking-tight">
            {t("Browse All Collections", "কালেকশন অনুযায়ী কেনাকাটা")}
          </h2>
          <p className="text-xs sm:text-sm text-[#71849B] mt-1 max-w-xl">
            {t(
              "Explore authentic curated collections with verified photography and live inventory.",
              "আসল পণ্যের ফটোগ্রাফি ও নির্ভরযোগ্য স্টক সহ সকল ক্যাটাগরি ঘুরে দেখুন।"
            )}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button text-xs sm:text-sm font-bold text-[#101C35] hover:text-[#0877C9] self-start sm:self-end group"
        >
          <span>{t("View All Collections", "সকল কালেকশন")}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 3-Column Responsive Collection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {spotlightCollections.map(col => {
          const displayImage = col.cover_image || col.image_url || col.fallback_image;
          const count = col.imported_product_count ?? col.product_count ?? 0;

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-[24px] glass-card p-4 flex flex-col justify-between overflow-hidden relative"
            >
              {/* Top Meta Badges Overlay */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md text-[#101C35] border border-white/80 text-[10px] font-mono font-bold tracking-tight shadow-xs">
                  {count} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2.5 py-1 rounded-full bg-[#0877C9] text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#50DDF0] fill-[#50DDF0]" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              {/* Collection Photograph Container */}
              <div className="relative w-full aspect-[16/10] bg-[#F8FBFF]/85 rounded-[18px] border border-white/80 p-4 flex items-center justify-center overflow-hidden transition-colors group-hover:bg-white">
                <img
                  src={displayImage}
                  alt={col.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (col.fallback_image && e.target.src !== col.fallback_image) {
                      e.target.src = col.fallback_image;
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-2xs transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Information Section */}
              <div className="pt-3.5 flex items-center justify-between gap-3 flex-1">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0877C9] block mb-0.5">
                    {t("Collection", "কালেকশন")} #{col.id}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#101C35] truncate group-hover:text-[#0877C9] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-[#71849B] line-clamp-1 mt-0.5 font-medium">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>

                {/* Arrow Action Button */}
                <div className="w-8 h-8 rounded-full glass-button group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
