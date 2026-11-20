import React, { useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

/**
 * AZRAQ Shop — Featured Collection Carousel (Gadgets & IT Accessories)
 * - Section Title: "Gadgets & IT Accessories" with clean typography.
 * - "View More" link on the right.
 * - Circular navigation buttons for smooth horizontal scrolling.
 * - Renders authentic catalog products from "Gadgets & IT Accessories".
 */
export default function TrendingRightNowSection() {
  const navigate = useNavigate();
  const { products, t } = useShop();
  const scrollContainerRef = useRef(null);

  // Curate products for the "Gadgets & IT Accessories" collection
  const collectionProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const priorityIds = ['AZQ-0001', 'AZQ-0006', 'AZQ-0007', 'AZQ-0008'];
    const priorityProducts = [];
    const usedIds = new Set();

    for (const id of priorityIds) {
      const match = products.find(p => p.id === id);
      if (match) {
        priorityProducts.push(match);
        usedIds.add(match.id);
      }
    }

    const otherGadgets = products.filter(
      p => p.category === 'Gadgets & IT Accessories' && !usedIds.has(p.id) && p.main_image
    );

    return [...priorityProducts, ...otherGadgets];
  }, [products]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewMore = () => {
    navigate('/collection/gadgets-it-accessories');
  };

  return (
    <section className="w-full select-none flex flex-col gap-3.5 relative group">

      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {t("Gadgets & IT Accessories", "গ্যাজেটস ও আইটি এক্সেসরিজ")}
        </h2>

        <button
          onClick={handleViewMore}
          className="text-xs sm:text-sm font-semibold text-[#185ADB] hover:text-[#1044A3] flex items-center gap-1 transition-colors cursor-pointer group/link hover:underline"
        >
          <span>{t("View More", "আরও দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Horizontal Carousel Container with Left/Right Arrows */}
      <div className="relative w-full">

        {/* Circular Left Arrow Button (<) */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:text-[#185ADB] flex items-center justify-center transition-colors cursor-pointer"
          title="Scroll Left"
          aria-label="Previous products"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
        >
          {collectionProducts.map((p, idx) => (
            <div
              key={p.id || idx}
              className="w-[220px] sm:w-[240px] lg:w-[260px] shrink-0"
            >
              <ProductCard
                product={p}
                showCategory={false}
                priority={idx < 4}
              />
            </div>
          ))}
        </div>

        {/* Circular Right Arrow Button (>) */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 hover:text-[#185ADB] flex items-center justify-center transition-colors cursor-pointer"
          title="Scroll Right"
          aria-label="Next products"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

    </section>
  );
}
