import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-6 h-1 rounded-full bg-azraq-violet" />
            <span className="text-xs font-black tracking-widest text-azraq-violet uppercase">
              {t("CURATED HIGHLIGHTS", "সেরা হাইলাইটস")}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-azraq-navy tracking-tight">
            {t("Featured Collections", "বাছাইকৃত কালেকশন")}
          </h2>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-1">
            {t("Top-performing collections curated directly from verified EasyDrop suppliers.", "যাচাইকৃত ইজিড্রপ প্রস্তুতকারকদের শীর্ষ কালেকশন।")}
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-full border border-azraq-purple/20 bg-white flex items-center justify-center transition-all ${
              canScrollLeft ? 'text-azraq-navy hover:bg-azraq-lavender shadow-sm' : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Previous Collection"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-full bg-azraq-navy text-white flex items-center justify-center transition-all shadow-md ${
              canScrollRight ? 'hover:bg-azraq-charcoal' : 'bg-azraq-navy/40 cursor-not-allowed'
            }`}
            aria-label="Next Collection"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        style={{ scrollbarWidth: 'none' }}
      >
        {featuredCols.map(col => {
          const displayImage = col.cover_image || col.image_url || col.fallback_image;

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="flex-none w-[280px] sm:w-[320px] snap-start group cursor-pointer"
            >
              <div className="rounded-none bg-white border border-azraq-purple/20 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between h-[420px] sm:h-[440px] relative overflow-hidden">
                <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-none bg-azraq-navy/90 text-white text-[10px] font-mono font-bold uppercase">
                  {col.imported_product_count ?? col.product_count ?? 0} {t("Verified Items", "পণ্য")}
                </span>

                <div className="relative w-full h-[290px] sm:h-[310px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-4 overflow-hidden border-b border-gray-100">
                  <img
                    src={displayImage}
                    alt={col.name}
                    onError={(e) => {
                      if (col.fallback_image && e.target.src !== col.fallback_image) {
                        e.target.src = col.fallback_image;
                      }
                    }}
                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                </div>

                <div className="p-4 sm:p-5 bg-white flex items-center justify-between gap-3 flex-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-azraq-navy truncate group-hover:text-azraq-violet transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-azraq-navy/60 line-clamp-1 mt-0.5">
                      {t(col.description_en, col.description_bn)}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-azraq-lime text-azraq-navy flex items-center justify-center shadow-glow-lime group-hover:scale-110 transition-transform flex-shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
