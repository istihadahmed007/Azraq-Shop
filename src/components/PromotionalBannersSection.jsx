import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Promotional Editorial Banner (The Modern Everyday Edit)
 * 
 * Restrained, brand-focused campaign banner without fake countdowns or fabricated discounts.
 * Highlights authentic catalog lifestyle goods, verified quality, and fast nationwide delivery.
 */
export default function PromotionalBannersSection() {
  const { navigateTo, t } = useShop();

  return (
    <section className="w-full select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Banner 1: Everyday Lifestyle Goods */}
        <div className="rounded-[16px] overflow-hidden relative p-6 sm:p-8 flex flex-col justify-between min-h-[240px] bg-white border border-[#E5E3DA] shadow-[0_4px_20px_rgba(23,35,51,0.04)] group hover:border-[#245BDB] transition-all">
          <div className="relative z-10 max-w-[280px] sm:max-w-[320px] space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DA] text-[10px] font-bold uppercase tracking-wider text-[#172333]">
              <Sparkles className="w-3 h-3 text-[#245BDB]" />
              <span>{t("CURATED LIVING", "আধুনিক জীবনযাপন")}</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#172333] tracking-tight leading-snug">
              {t("Thoughtful Goods for Everyday Spaces", "দৈনন্দিন জীবনের প্রয়োজনীয় সেরা পণ্য")}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {t("Explore verified kitchenware, organizers, and home accessories.", "যাচাইকৃত কিচেন ও হোম অ্যাপ্লায়েন্সেসের বিশ্বস্ত সংগ্রহ।")}
            </p>
            
            <div className="pt-3">
              <button
                onClick={() => {
                  const el = document.getElementById('browse-categories') || document.getElementById('all-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-[8px] bg-[#172333] hover:bg-[#245BDB] text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
              >
                <span>{t("Explore Living", "কালেকশন দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="absolute right-4 sm:right-6 bottom-4 top-4 w-40 sm:w-52 flex items-center justify-center pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80"
              alt="Curated Living"
              className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

        {/* Banner 2: Authentic Technology & Smart Gadgets */}
        <div className="rounded-[16px] overflow-hidden relative p-6 sm:p-8 flex flex-col justify-between min-h-[240px] bg-white border border-[#E5E3DA] shadow-[0_4px_20px_rgba(23,35,51,0.04)] group hover:border-[#245BDB] transition-all">
          <div className="relative z-10 max-w-[280px] sm:max-w-[320px] space-y-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#FAF9F5] border border-[#E5E3DA] text-[10px] font-bold uppercase tracking-wider text-[#172333]">
              <Sparkles className="w-3 h-3 text-[#245BDB]" />
              <span>{t("AUTHENTIC TECH", "আসল প্রযুক্তি")}</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#172333] tracking-tight leading-snug">
              {t("Certified Performance & Smart Gear", "সার্টিফাইড গ্যাজেটস ও আইটি সরঞ্জাম")}
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              {t("Direct import accessories with transparent retail specifications.", "সরাসরি আমদানিকৃত গ্যাজেট ও অ্যাক্সেসরিজের সেরা কালেকশন।")}
            </p>

            <div className="pt-3">
              <button
                onClick={() => {
                  const el = document.getElementById('all-products') || document.getElementById('popular-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-[8px] bg-[#245BDB] hover:bg-[#1C4BB8] text-white text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
              >
                <span>{t("Discover Tech", "গ্যাজেটস দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="absolute right-4 sm:right-6 bottom-4 top-4 w-40 sm:w-52 flex items-center justify-center pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80"
              alt="Authentic Gear"
              className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
