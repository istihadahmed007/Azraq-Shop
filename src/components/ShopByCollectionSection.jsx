import React from 'react';
import { ArrowRight, Sparkles, Layers, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  return (
    <section id="shop-by-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-azraq-purple/15">
      
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
            {t("Browse Categories", "ক্যাটাগরি অনুযায়ী কেনাকাটা")}
          </h2>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-2 max-w-xl">
            {t(
              "Explore all 18 authentic EasyDrop imported main collections. Every category thoughtfully organized with verified supplier photography and real-time inventory.",
              "ইজিড্রপ থেকে আমদানিকৃত সকল ১৮টি কালেকশন ঘুরে দেখুন। প্রতিটি ক্যাটাগরিতে রয়েছে আসল পণ্যের ফটোগ্রাফি ও নির্ভরযোগ্য স্টক।"
            )}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-azraq-purple/30 text-azraq-navy hover:text-azraq-violet font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all group self-start md:self-end"
        >
          <span>{t("View All 18 Collections", "সকল ১৮টি কালেকশন")}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 2-Column Responsive Collection Grid (Adapting on smaller screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {collections.map(col => {
          const displayImage = col.cover_image || col.image_url || col.fallback_image;

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-none bg-white border border-azraq-purple/20 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden relative h-[430px] sm:h-[460px]"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-azraq-lavender/50 rounded-full blur-2xl group-hover:bg-azraq-purple/25 transition-all pointer-events-none" />

              {/* Top Meta Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-none bg-azraq-navy/90 text-white text-[10px] font-mono font-bold tracking-tight shadow-sm backdrop-blur-sm">
                  {col.imported_product_count ?? col.product_count ?? 0} {t("Products", "পণ্য")}
                </span>
                {col.featured && (
                  <span className="px-2.5 py-1 rounded-none bg-azraq-lime text-azraq-navy text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-azraq-navy fill-azraq-navy" />
                    {col.badge || 'Featured'}
                  </span>
                )}
              </div>

              {/* Large Edge-to-Edge Collection Photograph Container */}
              <div className="relative w-full h-[290px] sm:h-[320px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-4 overflow-hidden border-b border-gray-100">
                <img
                  src={displayImage}
                  alt={col.name}
                  onError={(e) => {
                    if (col.fallback_image && e.target.src !== col.fallback_image) {
                      e.target.src = col.fallback_image;
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
              </div>

              {/* Clean Information Section */}
              <div className="p-4 sm:p-5 bg-white flex items-center justify-between gap-4 flex-1 z-10">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-azraq-violet">
                      {t("Collection", "কালেকশন")} • EasyDrop #{col.id}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-azraq-navy truncate group-hover:text-azraq-violet transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-azraq-navy/60 line-clamp-1 mt-1 font-normal">
                    {t(col.description_en, col.description_bn)}
                  </p>
                </div>

                {/* Electric Lime Action Button with Square/Subtle Styling */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-azraq-lime group-hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform group-hover:scale-110 flex-shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-azraq-navy transition-transform group-hover:translate-x-1" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
