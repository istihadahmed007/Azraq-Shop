import React from 'react';
import { ArrowRight, Sparkles, Layers, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  return (
    <section id="shop-by-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#D9F0FF]">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#50DDF0] shadow-[0_0_8px_#50DDF0]" />
            <span className="text-xs font-black tracking-widest text-[#0877C9] uppercase">
              {t("AUTHENTIC CATALOGUE TAXONOMY", "অনুমোদিত কালেকশন ক্যাটালগ")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#062B4F] tracking-tight">
            {t("Browse All Collections", "ক্যাটাগরি অনুযায়ী কেনাকাটা")}
          </h2>
          <p className="text-xs sm:text-sm text-[#062B4F]/65 mt-2 max-w-xl">
            {t(
              "Explore all 18 authentic EasyDrop imported main collections. Every category thoughtfully organized with verified supplier photography and real-time inventory.",
              "ইজিড্রপ থেকে আমদানিকৃত সকল ১৮টি কালেকশন ঘুরে দেখুন। প্রতিটি ক্যাটাগরিতে রয়েছে আসল পণ্যের ফটোগ্রাফি ও নির্ভরযোগ্য স্টক।"
            )}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#D9F0FF] text-[#062B4F] hover:text-[#0877C9] hover:border-[#69C5F5] font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all group self-start md:self-end"
        >
          <span>{t("View All 18 Collections", "সকল ১৮টি কালেকশন")}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 2-Column Responsive Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {collections.map(col => {
          const displayImage = col.cover_image || col.image_url || col.fallback_image;

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-2xl bg-white/85 backdrop-blur-md border border-[#D9F0FF]/80 shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] hover:bg-white hover:border-[#2563EB]/40 hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative h-[390px] sm:h-[420px]"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D9F0FF]/50 rounded-full blur-2xl group-hover:bg-[#2563EB]/15 transition-all pointer-events-none" />

              {/* Top Meta Badges Overlay */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#101C35]/90 backdrop-blur-sm text-white text-[10px] font-mono font-bold tracking-tight shadow-sm border border-white/20">
                  {col.imported_product_count ?? col.product_count ?? 0} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2.5 py-1 rounded-md bg-[#2563EB] text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 border border-white/20">
                    <Sparkles className="w-3 h-3 text-[#50DDF0] fill-[#50DDF0]" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              {/* Large Collection Photograph Container */}
              <div className="relative w-full h-[250px] sm:h-[280px] bg-gradient-to-b from-[#F5F7FA]/90 to-white/70 flex items-center justify-center p-4 sm:p-6 overflow-hidden border-b border-[#D9F0FF]/40">
                <img
                  src={displayImage}
                  alt={col.name}
                  onError={(e) => {
                    if (col.fallback_image && e.target.src !== col.fallback_image) {
                      e.target.src = col.fallback_image;
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Clean Information Section */}
              <div className="p-4 sm:p-5 bg-white flex items-center justify-between gap-4 flex-1 z-10">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0877C9]">
                      {t("Collection", "কালেকশন")} • EasyDrop #{col.id}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-[#062B4F] truncate group-hover:text-[#0877C9] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#062B4F]/60 line-clamp-1 mt-1 font-normal">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>

                {/* Arrow Action Button */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#062B4F] group-hover:bg-[#0877C9] text-white flex items-center justify-center shadow-md transition-all transform group-hover:scale-110 flex-shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform group-hover:translate-x-1" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
