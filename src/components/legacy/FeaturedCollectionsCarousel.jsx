import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export default function FeaturedCollectionsCarousel() {
  const { collections, navigateTo, t } = useShop();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const featuredCols = collections.filter(c => c.featured);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.28)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
              + {t("CURATED HIGHLIGHTS", "সেরা হাইলাইটস")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#193B5B] tracking-tight">
              {t("Featured Collections", "বাছাইকৃত কালেকশন")}
            </h2>
            <p className="text-xs text-[#718398] mt-1">
              {t("Top-performing collections curated directly from verified suppliers.", "যাচাইকৃত প্রস্তুতকারকদের শীর্ষ কালেকশন।")}
            </p>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full glass-card border border-[rgba(130,170,205,0.3)] flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'text-[#193B5B] hover:bg-white hover:border-[#70C8ED] shadow-xs cursor-pointer' 
                  : 'text-[#718398]/30 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous Collection"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full bg-[#193B5B] text-white flex items-center justify-center transition-all shadow-md ${
                canScrollRight 
                  ? 'hover:bg-[#062B4F] cursor-pointer' 
                  : 'bg-[#193B5B]/30 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next Collection"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {featuredCols.map(col => {
            const displayImage = col.cover_image || col.image_url || col.fallback_image;

            return (
              <div
                key={col.id}
                onClick={() => navigateTo('collection-detail', col.slug)}
                className="flex-none w-[260px] sm:w-[280px] snap-start group cursor-pointer"
              >
                <div className="rounded-[22px] bg-white/90 backdrop-blur-xl border border-[rgba(130,170,205,0.25)] border-t-white p-3.5 shadow-[0_8px_24px_rgba(112,200,237,0.1),0_2px_6px_rgba(25,59,91,0.03)] hover:shadow-[0_16px_36px_rgba(112,200,237,0.25)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[360px] relative overflow-hidden">
                  
                  {/* Verified Count Badge */}
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-full bg-[#193B5B]/90 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase shadow-xs">
                    {col.imported_product_count ?? col.product_count ?? 0} {t("Verified Items", "পণ্য")}
                  </span>

                  {/* Contained Image Area */}
                  <div className="card-image-wrapper relative w-full h-[220px] rounded-xl bg-gradient-to-b from-[#F1F7FC] to-white flex items-center justify-center p-3 overflow-hidden border border-[rgba(130,170,205,0.18)]">
                    <img
                      src={displayImage}
                      alt={col.name}
                      onError={(e) => {
                        if (col.fallback_image && e.target.src !== col.fallback_image) {
                          e.target.src = col.fallback_image;
                        }
                      }}
                      className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between gap-2 flex-1">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-xs sm:text-sm text-[#193B5B] truncate group-hover:text-[#0877C9] transition-colors">
                        {col.name}
                      </h3>
                      <p className="text-[11px] text-[#718398] line-clamp-1 mt-0.5">
                        {t(col.description_en, col.description_bn)}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(112,200,237,0.4)] group-hover:scale-110 transition-transform flex-shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
