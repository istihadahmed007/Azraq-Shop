import React, { useRef } from 'react';
import { ArrowRight, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Horizontal Shop by Category Rail
 * Exactly matches the reference design layout:
 * - Small introductory "Shop by Category" card on the far left with a blue circular arrow button.
 * - Displays authentic collections from `collections.json` with genuine cover photography.
 * - Category names displayed underneath their images.
 * - Consistent card sizing, smooth horizontal scrolling, and "Others / View All" action at the end.
 * - Preserves navigation to individual collection pages (/collection/:slug) and all collections (/collections).
 */
export default function BrowseByCategoriesSection() {
  const { collections, navigateTo, t } = useShop();
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Helper to get friendly concise display names
  const getCategoryShortName = (name) => {
    if (!name) return '';
    const clean = name.replace(/\(.*?\)/g, '').trim();
    if (clean === 'Gadgets & IT Accessories') return t('Gadgets', 'গ্যাজেটস');
    if (clean === 'Kitchen Appliances') return t('Kitchen', 'কিচেন');
    if (clean === 'Jewelries & Accessories') return t('Jewelry', 'জুয়েলারি');
    if (clean === 'Home & Lifestyle') return t('Lifestyle', 'লাইফস্টাইল');
    if (clean === 'Health & Beauty') return t('Beauty', 'বিউটি');
    if (clean === 'Sunglass Collection') return t('Sunglasses', 'সানগ্লাস');
    if (clean === 'Men Clothing') return t('Men Fashion', 'মেনস ফ্যাশন');
    if (clean === 'Sports & Kids') return t('Sports', 'স্পোর্টস');
    return clean;
  };

  return (
    <section id="shop-by-category" className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-white/70 backdrop-blur-2xl rounded-[24px] sm:rounded-[28px] shadow-[0_12px_36px_-8px_rgba(112,200,237,0.1),0_2px_8px_-1px_rgba(25,59,91,0.03)] p-3 sm:p-4 transition-all relative">

      <div className="flex items-center gap-3 w-full">

        {/* 1. INTRODUCTORY CARD: Shop by Category */}
        <div
          onClick={() => navigateTo('collections')}
          className="w-[110px] sm:w-[125px] h-[130px] sm:h-[140px] shrink-0 p-3 sm:p-4 rounded-[20px] bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.25)] hover:border-[#70C8ED] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between items-start cursor-pointer group"
          title={t("View All Collections", "সকল কালেকশন দেখুন")}
        >
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#193B5B] leading-tight block group-hover:text-[#0877C9] transition-colors">
              {t("Shop by", "ক্যাটাগরি")}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#193B5B] leading-tight block group-hover:text-[#0877C9] transition-colors">
              {t("Category", "অনুযায়ী")}
            </span>
          </div>

          <span className="w-8 h-8 rounded-full bg-[#0877C9] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(8,119,201,0.35)] group-hover:scale-105 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>

        {/* 2. HORIZONTAL SCROLLABLE CATEGORY CARDS RAIL */}
        <div className="relative flex-1 min-w-0">

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
          >
            {collections.map((col) => {
              const displayName = getCategoryShortName(col.name);
              const coverImg = col.cover_image || col.image_url;

              return (
                <div
                  key={col.id}
                  onClick={() => navigateTo('collection-detail', col.slug)}
                  className="w-[100px] sm:w-[112px] h-[130px] sm:h-[140px] shrink-0 p-2.5 sm:p-3 rounded-[20px] bg-white/80 hover:bg-white border border-[rgba(130,170,205,0.22)] hover:border-[#70C8ED] shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col items-center justify-between text-center cursor-pointer group"
                  title={`${col.name} (${col.imported_product_count ?? col.product_count ?? 0} products)`}
                >
                  {/* Category Image */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] bg-[#F4F8FC] p-1.5 flex items-center justify-center overflow-hidden border border-[rgba(130,170,205,0.15)] group-hover:border-[#70C8ED]/40 transition-colors">
                    <ProductImage
                      src={coverImg}
                      alt={col.name}
                      fit="contain"
                      aspectRatio="square"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Category Name Underneath */}
                  <span className="text-[11px] sm:text-xs font-bold text-[#193B5B] group-hover:text-[#0877C9] transition-colors line-clamp-1 w-full px-0.5">
                    {displayName}
                  </span>
                </div>
              );
            })}

            {/* "Others / View All" Card at the end */}
            <div
              onClick={() => navigateTo('collections')}
              className="w-[95px] sm:w-[105px] h-[130px] sm:h-[140px] shrink-0 p-2.5 sm:p-3 rounded-[20px] bg-white/70 hover:bg-white border border-dashed border-[rgba(130,170,205,0.35)] hover:border-[#0877C9] shadow-2xs hover:shadow-sm transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer group"
              title={t("View All 18 Collections", "সকল ১৮টি কালেকশন দেখুন")}
            >
              <div className="w-12 h-12 rounded-full bg-[#DDEEFF]/60 group-hover:bg-[#0877C9] text-[#0877C9] group-hover:text-white flex items-center justify-center transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#193B5B] group-hover:text-[#0877C9] transition-colors">
                {t("Others", "অন্যান্য")}
              </span>
            </div>

          </div>

          {/* Subtle Left & Right Scroll Arrows for desktop navigation */}
          <button
            onClick={() => scroll('left')}
            className="hidden xl:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-7 h-7 rounded-full bg-white/95 border border-[rgba(130,170,205,0.3)] shadow-xs items-center justify-center text-[#193B5B] hover:text-[#0877C9] hover:scale-105 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100 hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-7 h-7 rounded-full bg-white/95 border border-[rgba(130,170,205,0.3)] shadow-xs items-center justify-center text-[#193B5B] hover:text-[#0877C9] hover:scale-105 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100 hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </section>
  );
}
