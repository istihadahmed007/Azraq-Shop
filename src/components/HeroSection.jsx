import React from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroSection() {
  const { products, collections, navigateTo, setIsTrackingOpen, t } = useShop();

  // Pick authentic AZRAQ products for showcase
  const heroProduct = products.find(p => p.id === 'AZQ-0001') || products[0];
  const audioProduct = products.find(p => p.id === 'AZQ-0009' || p.id === 'AZQ-0035') || products[5];

  return (
    <section className="w-full pt-1 pb-4 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ========================================================
            1. MAIN CENTRAL HERO CARD (col-span-8 or col-span-9)
           ======================================================== */}
        <div className="lg:col-span-8 xl:col-span-8 rounded-[32px] bg-gradient-to-br from-white/95 via-white/85 to-[#E8F3FD]/80 backdrop-blur-2xl border border-white/90 shadow-[0_8px_32px_rgba(6,43,79,0.06)] p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Lighting & Rings (Matching Reference Screenshot) */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#69C5F5]/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#D9F0FF]/60 rounded-full blur-2xl pointer-events-none" />

          {/* Left Hero Content & Right Product Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 flex-1">
            
            {/* Left Texts & CTAs */}
            <div className="md:col-span-7 flex flex-col items-start gap-4">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">
                  {t('Curated Everyday Goods', 'কিউরেটেড এভরিডে গুডস')}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-[#101C35] tracking-tight leading-[1.12]">
                {t('Upgrade Your', 'উন্নত করুন আপনার')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0877C9] via-[#2563EB] to-[#50DDF0]">
                  {t('Tech Lifestyle', 'দৈনন্দিন লাইফস্টাইল')}
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-sm font-medium text-[#71849B] max-w-md leading-relaxed">
                {t(
                  'Premium Mobile Accessories & Everyday Curated Essentials for a Smarter You.',
                  'স্মার্ট জীবনযাপনের জন্য প্রিমিয়াম মোবাইল এক্সেসরিজ ও বাছাইকৃত পণ্যের সমাহার।'
                )}
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('all-products') || document.getElementById('popular-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0877C9] to-[#2563EB] hover:from-[#0966ab] hover:to-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 group"
                >
                  <span>{t('Shop Now', 'এখনই কিনুন')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigateTo('collections')}
                  className="px-5 py-3 rounded-full bg-white/90 hover:bg-white text-[#101C35] hover:text-[#0877C9] border border-white/80 text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all"
                >
                  {t('Explore Collections', 'সকল কালেকশন')}
                </button>
              </div>

            </div>

            {/* Right Product 3D Hero Arrangement (Exact Reference Match) */}
            <div className="md:col-span-5 relative flex items-center justify-center min-h-[220px] sm:min-h-[260px]">
              
              {/* Glowing Pedestal Circle */}
              <div className="absolute inset-0 m-auto w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#69C5F5]/30 to-[#D9F0FF]/60 border border-white/80 shadow-[0_12px_40px_rgba(8,119,201,0.18)]" />
              
              {/* Glowing Ambient Light Ring */}
              <div className="absolute inset-0 m-auto w-40 h-40 sm:w-52 sm:h-52 rounded-full border border-[#50DDF0]/40 animate-pulse pointer-events-none" />

              {/* Main Product Feature Image */}
              <img
                src={heroProduct?.main_image || "https://easydrop.asia/products/image-1794224164356-135288231.jpeg"}
                alt={heroProduct?.name || "Curated Everyday Tech"}
                className="relative z-10 w-44 sm:w-56 h-auto object-contain filter drop-shadow-[0_16px_30px_rgba(6,43,79,0.2)] hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-2 -left-2 z-20 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-white shadow-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0877C9]" />
                <span className="text-[10px] font-bold text-[#101C35]">100% Authentic QC</span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            2. RIGHT STACKED PROMOTIONAL PANELS (col-span-4)
           ======================================================== */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-5 justify-between">
          
          {/* Top Card: New & Exclusive Finds (Reference Match) */}
          <div 
            onClick={() => {
              const el = document.getElementById('popular-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 rounded-[28px] bg-gradient-to-br from-white/95 via-white/85 to-[#E8F2FC]/70 backdrop-blur-xl border border-white/80 shadow-[0_6px_24px_rgba(6,43,79,0.06)] p-5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-[0_12px_32px_rgba(8,119,201,0.12)] hover:-translate-y-0.5 transition-all group relative overflow-hidden"
          >
            <div className="flex flex-col items-start gap-1 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0877C9]">
                {t('Up to', 'সর্বোচ্চ')}
              </span>
              <h3 className="text-2xl font-black text-[#101C35] tracking-tight">
                50% OFF
              </h3>
              <p className="text-xs font-semibold text-[#71849B]">
                {t('On Top Brands', 'সেরা ব্র্যান্ডের ওপর')}
              </p>
              
              <div className="mt-3 w-8 h-8 rounded-full bg-white shadow-xs group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-[#101C35] group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Product Photo on Right */}
            <div className="w-28 sm:w-32 h-28 sm:h-32 relative flex items-center justify-center shrink-0">
              <img
                src={audioProduct?.main_image || "https://easydrop.asia/products/image-1793785736570-415262366.jpeg"}
                alt="Headphones"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(6,43,79,0.15)] group-hover:scale-108 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bottom Card: Fast & Reliable Delivery Across Bangladesh (Reference Match) */}
          <div 
            onClick={() => setIsTrackingOpen(true)}
            className="flex-1 rounded-[28px] bg-gradient-to-br from-white/95 via-white/85 to-[#E8F2FC]/70 backdrop-blur-xl border border-white/80 shadow-[0_6px_24px_rgba(6,43,79,0.06)] p-5 flex items-center justify-between gap-4 cursor-pointer hover:shadow-[0_12px_32px_rgba(8,119,201,0.12)] hover:-translate-y-0.5 transition-all group relative overflow-hidden"
          >
            <div className="flex flex-col items-start gap-1 z-10">
              <h3 className="text-base sm:text-lg font-black text-[#101C35] tracking-tight leading-snug">
                {t('Fast & Reliable', 'দ্রুত ও নির্ভরযোগ্য')} <br />
                {t('Delivery', 'হোম ডেলিভারি')}
              </h3>
              <p className="text-xs font-semibold text-[#71849B] mt-0.5">
                {t('Across Bangladesh', 'সারা বাংলাদেশে')}
              </p>
              
              <div className="mt-3 w-8 h-8 rounded-full bg-white shadow-xs group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-[#101C35] group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Delivery Parcel / Box Graphic */}
            <div className="w-24 sm:w-28 h-24 sm:h-28 relative flex items-center justify-center shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0877C9] to-[#2563EB] shadow-[0_10px_25px_rgba(37,99,235,0.35)] flex items-center justify-center text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex flex-col items-center">
                  <span className="text-base font-black italic tracking-wider">AZQ</span>
                  <span className="text-[9px] font-bold text-sky-200">EXPRESS</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
