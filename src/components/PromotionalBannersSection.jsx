import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function PromotionalBannersSection() {
  const { navigateTo, t } = useShop();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Summer / Seasonal Sale (Matching Reference Left Banner) */}
        <div className="rounded-2xl overflow-hidden relative p-8 sm:p-10 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] bg-gradient-to-r from-[#D9F0FF] via-[#EBF6FF] to-[#F4F9FD] border border-[#69C5F5]/30 shadow-[0_8px_30px_0_rgba(8,119,201,0.08)] group">
          {/* Subtle Glass Reflection Overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

          {/* Left Content */}
          <div className="relative z-10 max-w-[240px] sm:max-w-[280px] space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0877C9]">
              {t("SEASONAL SALE", "স্পেশাল সামার সেল")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#062B4F] tracking-tight leading-tight">
              {t("Up To 50% Off On Bestsellers", "বেস্টসেলারে আকর্ষণীয় ছাড়")}
            </h3>
            
            <div className="pt-3">
              <button
                onClick={() => {
                  const el = document.getElementById('popular-products') || document.getElementById('all-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-full bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
              >
                <span>{t("Shop Sale", "সেল কালেকশন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Product Composition Image (Matching Reference: Bag, Hat, Sunglasses) */}
          <div className="absolute right-3 sm:right-6 bottom-3 top-3 w-48 sm:w-64 flex items-center justify-center pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
              alt="Summer Sale Accessories"
              className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-108"
            />
          </div>
        </div>

        {/* Banner 2: New Arrivals (Matching Reference Right Banner) */}
        <div className="rounded-2xl overflow-hidden relative p-8 sm:p-10 flex flex-col justify-between min-h-[260px] sm:min-h-[290px] bg-gradient-to-r from-[#FAF5ED] via-[#F4EDE2] to-[#ECE3D6] border border-amber-200/40 shadow-[0_8px_30px_0_rgba(6,43,79,0.06)] group">
          {/* Subtle Glass Reflection Overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {/* Left Content */}
          <div className="relative z-10 max-w-[240px] sm:max-w-[280px] space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
              {t("NEW ARRIVALS", "নতুন আগমন")}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#062B4F] tracking-tight leading-tight">
              {t("Fresh Finds You'll Love", "নতুন পছন্দের দারুণ সংগ্রহ")}
            </h3>

            <div className="pt-3">
              <button
                onClick={() => {
                  const el = document.getElementById('all-products') || document.getElementById('shop-by-collection');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-full bg-[#062B4F] hover:bg-[#0877C9] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
              >
                <span>{t("Explore Now", "এক্সপ্লোর করুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Product Composition Image (Matching Reference: Footwear & Living Decor) */}
          <div className="absolute right-3 sm:right-6 bottom-3 top-3 w-48 sm:w-64 flex items-center justify-center pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
              alt="New Arrivals Lifestyle"
              className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-700 group-hover:scale-108"
            />
          </div>
        </div>

      </div>
    </section>
  );
}

