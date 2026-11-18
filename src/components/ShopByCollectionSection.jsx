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
    <section id="shop-by-collection" className="w-full max-w-full overflow-hidden py-2 select-none">

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] glass-button text-xs sm:text-sm font-bold text-[#101C35] hover:text-[#0877C9] self-start sm:self-end group shadow-2xs"
        >
          <span>{t("View All Collections", "সকল কালেকশন")}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 3-Column Responsive Collection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5">
        {spotlightCollections.map(col => {
          const displayImage = col.cover_image || col.image_url || col.fallback_image;
          const count = col.imported_product_count ?? col.product_count ?? 0;

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-[8px] glass-card p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden relative border border-white/95 bg-white/90 transition-all hover:border-[#0877C9]/40 hover:-translate-y-0.5"
            >
              {/* Top Meta Badges Overlay */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-[4px] bg-white/90 backdrop-blur-md text-[#101C35] border border-white/90 text-[10px] font-mono font-bold tracking-tight shadow-xs">
                  {count} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#0877C9] text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#50DDF0] fill-[#50DDF0]" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              {/* Collection Photograph Container: Large, prominent, properly fitted */}
              <div className="relative w-full aspect-[16/10] bg-[#F8FBFF] rounded-[6px] border border-white/90 p-2.5 flex items-center justify-center overflow-hidden transition-colors group-hover:bg-white shadow-2xs">
                <img
                  src={displayImage}
                  alt={col.name}
                  onError={(e) => {
                    const fallback = col.fallback_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                    if (e.target.src !== fallback) {
                      e.target.src = fallback;
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-2xs transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Information Section */}
              <div className="pt-3 flex items-center justify-between gap-3 flex-1">
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

                {/* Arrow Action Button (Sharp 4px) */}
                <div className="w-7.5 h-7.5 rounded-[4px] glass-button group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
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
