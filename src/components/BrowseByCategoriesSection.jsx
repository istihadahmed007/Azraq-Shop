import React from 'react';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function BrowseByCategoriesSection() {
  const { collections, navigateTo, t } = useShop();

  // Curated 8 core categories from actual 18 collections
  const categoryShortcuts = [
    { title: "Gadgets", titleBn: "গ্যাজেটস", slug: "gadgets-it-accessories", img: "https://easydrop.asia/products/image-1794224164356-135288231.jpeg" },
    { title: "Headphones", titleBn: "হেডফোন", slug: "gadgets-it-accessories", img: "https://easydrop.asia/products/image-1793785736570-415262366.jpeg" },
    { title: "Chargers", titleBn: "চার্জার", slug: "gadgets-it-accessories", img: "https://easydrop.asia/products/image-1793786561200-295964908.jpeg" },
    { title: "Home Care", titleBn: "হোম কেয়ার", slug: "home-lifestyle", img: "https://easydrop.asia/products/image-1792995442375-678891328.jpg" },
    { title: "Kitchen", titleBn: "কিচেন", slug: "kitchen-appliances", img: "https://easydrop.asia/products/image-1792301863055-905113410.jpeg" },
    { title: "Sunglasses", titleBn: "সানগ্লাস", slug: "sunglass-collection", img: "https://easydrop.asia/products/image-1790407746205-951996500.jpeg" },
    { title: "Fashion", titleBn: "ফ্যাশন", slug: "men-clothing", img: "https://easydrop.asia/products/image-1793788431024-871806518.jpeg" },
    { title: "Sports", titleBn: "স্পোর্টস", slug: "sports-kids", img: "https://easydrop.asia/products/image-1793796430036-687433107.jpeg" },
  ];

  return (
    <section id="browse-categories" className="w-full py-3 select-none">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        
        {/* Left 'Shop by Category' Pill Card (Reference Match) */}
        <div 
          onClick={() => navigateTo('collections')}
          className="shrink-0 rounded-[22px] bg-gradient-to-br from-white/95 to-[#E8F2FC]/90 backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.05)] px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-[0_8px_24px_rgba(8,119,201,0.12)] hover:-translate-y-0.5 transition-all group"
        >
          <span className="text-xs font-black text-[#101C35] whitespace-nowrap">
            {t('Shop by', 'ক্যাটাগরি')} <br />
            {t('Category', 'অনুযায়ী')}
          </span>
          <div className="w-6 h-6 rounded-full bg-[#0877C9] group-hover:bg-[#2563EB] text-white flex items-center justify-center transition-colors">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Category Cards Row (Reference Match) */}
        {categoryShortcuts.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo('collection-detail', cat.slug)}
            className="shrink-0 min-w-[85px] sm:min-w-[95px] rounded-[22px] bg-white/80 hover:bg-white backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.04)] hover:shadow-[0_8px_24px_rgba(8,119,201,0.12)] p-2.5 flex flex-col items-center gap-2 hover:-translate-y-0.5 transition-all duration-200 group focus:outline-none"
          >
            {/* Inner Image Container */}
            <div className="w-12 h-12 rounded-xl bg-[#F4F9FE] flex items-center justify-center p-1 overflow-hidden">
              <img
                src={cat.img}
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain filter drop-shadow-xs group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Category Label */}
            <span className="text-[11px] font-bold text-[#101C35] group-hover:text-[#0877C9] transition-colors truncate max-w-[80px]">
              {t(cat.title, cat.titleBn)}
            </span>
          </button>
        ))}

        {/* Right 'Others / View All' Pill (Reference Match) */}
        <button
          onClick={() => navigateTo('collections')}
          className="shrink-0 min-w-[85px] sm:min-w-[95px] rounded-[22px] bg-white/80 hover:bg-white backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(6,43,79,0.04)] hover:shadow-[0_8px_24px_rgba(8,119,201,0.12)] p-2.5 flex flex-col items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 group focus:outline-none"
          title="All Collections"
        >
          <div className="w-12 h-12 rounded-xl bg-[#EDF5FD] flex items-center justify-center text-[#0877C9] group-hover:bg-[#0877C9] group-hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-[#101C35] group-hover:text-[#0877C9] transition-colors">
            {t('Others', 'অন্যান্য')}
          </span>
        </button>

      </div>
    </section>
  );
}
