import React, { useRef } from 'react';
import { ArrowRight, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Horizontal Shop by Category Rail
 * - Clean "Shop by Category" lead card.
 * - Displays authentic collections from `collections.json` with genuine cover photography.
 * - Clear category names underneath images.
 * - Smooth horizontal scrolling and clean navigation controls.
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
    <section id="shop-by-category" className="w-full select-none border border-slate-200/90 bg-white rounded-2xl shadow-xs p-3.5 sm:p-4.5 transition-all relative">

      <div className="flex items-center gap-3 w-full">

        {/* 1. INTRODUCTORY CARD: Shop by Category */}
        <div
          onClick={() => navigateTo('collections')}
          className="w-[110px] sm:w-[125px] h-[130px] sm:h-[138px] shrink-0 p-3 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col justify-between items-start cursor-pointer group"
          title={t("View All Collections", "সকল কালেকশন দেখুন")}
        >
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block group-hover:text-[#185ADB] transition-colors">
              {t("Shop by", "ক্যাটাগরি")}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block group-hover:text-[#185ADB] transition-colors">
              {t("Category", "অনুযায়ী")}
            </span>
          </div>

          <span className="w-8 h-8 rounded-lg bg-[#185ADB] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1044A3] transition-colors">
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
                  className="w-[100px] sm:w-[112px] h-[130px] sm:h-[138px] shrink-0 p-2.5 sm:p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 shadow-xs transition-colors flex flex-col items-center justify-between text-center cursor-pointer group"
                  title={`${col.name} (${col.imported_product_count ?? col.product_count ?? 0} products)`}
                >
                  {/* Category Image */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-50 p-1.5 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-slate-200 transition-colors">
                    <ProductImage
                      src={coverImg}
                      alt={col.name}
                      fit="contain"
                      aspectRatio="square"
                      className="group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Category Name Underneath */}
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#185ADB] transition-colors line-clamp-1 w-full px-0.5">
                    {displayName}
                  </span>
                </div>
              );
            })}

            {/* "Others / View All" Card at the end */}
            <div
              onClick={() => navigateTo('collections')}
              className="w-[95px] sm:w-[105px] h-[130px] sm:h-[138px] shrink-0 p-2.5 sm:p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 hover:border-[#185ADB] transition-colors flex flex-col items-center justify-center gap-2 text-center cursor-pointer group"
              title={t("View All 18 Collections", "সকল ১৮টি কালেকশন দেখুন")}
            >
              <div className="w-10 h-10 rounded-full bg-slate-200/70 group-hover:bg-[#185ADB] text-slate-600 group-hover:text-white flex items-center justify-center transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 group-hover:text-[#185ADB] transition-colors">
                {t("View All", "সব দেখুন")}
              </span>
            </div>

          </div>

          {/* Left & Right Scroll Arrows */}
          <button
            onClick={() => scroll('left')}
            className="hidden xl:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-700 hover:text-[#185ADB] hover:border-slate-300 transition-colors cursor-pointer z-10 opacity-0 group-hover:opacity-100 hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-2 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs items-center justify-center text-slate-700 hover:text-[#185ADB] hover:border-slate-300 transition-colors cursor-pointer z-10 opacity-0 group-hover:opacity-100 hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </section>
  );
}
