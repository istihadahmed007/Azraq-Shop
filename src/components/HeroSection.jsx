import React from 'react';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Premium Frosted Glassmorphism Hero Section
 */
export default function HeroSection() {
  const { products, collections, navigateTo, setIsTrackingOpen, t } = useShop();

  // Authentic AZRAQ products for showcase
  const heroProduct = products.find(p => p.id === 'AZQ-0001') || products[0];
  const audioProduct = products.find(p => p.id === 'AZQ-0009' || p.id === 'AZQ-0035') || products[5];

  return (
    <section className="w-full select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ========================================================
            1. MAIN CENTRAL FROSTED GLASS HERO BANNER (col-span-8)
           ======================================================== */}
        <div className="lg:col-span-8 rounded-[32px] glass-feature p-6 sm:p-8 lg:p-9 flex items-center relative overflow-hidden min-h-[360px] sm:min-h-[380px]">
          
          {/* Subtle Blue Ambient Lighting */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#69C5F5]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#D9EDFF]/50 rounded-full blur-2xl pointer-events-none" />

          {/* Left Hero Content & Right Product Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 w-full">
            
            {/* Left Texts & CTAs */}
            <div className="md:col-span-7 flex flex-col items-start gap-3.5">
              
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/90 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#0877C9]" />
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0877C9]">
                  {t('Curated Everyday Goods', 'কিউরেটেড এভরিডে গুডস')}
                </span>
              </div>

              {/* Main Headline (44-56px desktop) */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#101C35] tracking-tight leading-[1.12]">
                {t('Discover Better.', 'উন্নত জীবন।')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0877C9] via-[#2563EB] to-[#50DDF0]">
                  {t('Live Better.', 'সেরা পছন্দ।')}
                </span>
              </h1>

              {/* Short descriptive copy */}
              <p className="text-xs sm:text-[14px] font-medium text-[#71849B] max-w-md leading-relaxed">
                {t(
                  'Premium lifestyle accessories, smart gadgets, and curated everyday essentials designed for modern living in Bangladesh.',
                  'স্মার্ট জীবনযাপনের জন্য প্রিমিয়াম মোবাইল এক্সেসরিজ, গ্যাজেটস ও কিউরেটেড এভরিডে পণ্যের সমাহার।'
                )}
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 pt-1.5">
                <button
                  onClick={() => {
                    const el = document.getElementById('all-products') || document.getElementById('popular-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 sm:py-3 rounded-full glass-button-primary text-xs sm:text-sm font-bold flex items-center gap-2 group"
                >
                  <span>{t('Shop Now', 'এখনই কিনুন')}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigateTo('collections')}
                  className="px-5 py-2.5 sm:py-3 rounded-full glass-button text-xs sm:text-sm font-bold text-[#101C35] hover:text-[#0877C9]"
                >
                  {t('Explore Collections', 'সকল কালেকশন')}
                </button>
              </div>

            </div>

            {/* Right Product Arrangement with Translucent Depth */}
            <div className="md:col-span-5 relative flex items-center justify-center min-h-[220px] sm:min-h-[240px]">
              
              {/* Glowing Pedestal Circle */}
              <div className="absolute inset-0 m-auto w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#69C5F5]/25 to-[#D9EDFF]/50 border border-white/80 shadow-[0_12px_36px_rgba(8,119,201,0.15)]" />
              
              {/* Subtle Ambient Ring */}
              <div className="absolute inset-0 m-auto w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-[#50DDF0]/30 animate-pulse pointer-events-none" />

              {/* Main Product Feature Image */}
              <img
                src={heroProduct?.main_image || "https://easydrop.asia/products/image-1794224164356-135288231.jpeg"}
                alt={heroProduct?.name || "Curated Everyday Tech"}
                className="relative z-10 w-40 sm:w-48 h-auto max-h-[220px] object-contain filter drop-shadow-[0_14px_28px_rgba(16,55,100,0.18)] hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-1 -left-1 z-20 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-white shadow-2xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0877C9]" />
                <span className="text-[10px] font-bold text-[#101C35]">100% Authentic QC</span>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            2. RIGHT STACKED PROMOTIONAL PANELS (col-span-4)
           ======================================================== */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-5 justify-between">
          
          {/* Top Card: Curated Collections / Discount Panel */}
          <div 
            onClick={() => {
              const el = document.getElementById('popular-products');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 rounded-[28px] glass-card p-4.5 sm:p-5 flex items-center justify-between gap-3 cursor-pointer group relative overflow-hidden"
          >
            <div className="flex flex-col items-start gap-1 z-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0877C9]">
                {t('Curated Finds', 'বাছাইকৃত পণ্য')}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#101C35] tracking-tight">
                Up to 50% OFF
              </h3>
              <p className="text-xs font-semibold text-[#71849B]">
                {t('On Top Brands', 'সেরা ব্র্যান্ডের ওপর')}
              </p>
              
              <div className="mt-2.5 w-7.5 h-7.5 rounded-full bg-white shadow-2xs group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-[#101C35] group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Product Photo on Right */}
            <div className="w-24 sm:w-28 h-24 sm:h-28 relative flex items-center justify-center shrink-0 overflow-hidden rounded-[16px] bg-[#F8FBFF]/70 p-2 border border-white/80">
              <img
                src={audioProduct?.main_image || "https://easydrop.asia/products/image-1793785736570-415262366.jpeg"}
                alt="Headphones"
                className="w-full h-full object-contain filter drop-shadow-2xs group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Bottom Card: Fast & Reliable Delivery Across Bangladesh */}
          <div 
            onClick={() => setIsTrackingOpen(true)}
            className="flex-1 rounded-[28px] glass-card p-4.5 sm:p-5 flex items-center justify-between gap-3 cursor-pointer group relative overflow-hidden"
          >
            <div className="flex flex-col items-start gap-1 z-10">
              <h3 className="text-sm sm:text-base font-black text-[#101C35] tracking-tight leading-snug">
                {t('Fast & Reliable', 'দ্রুত ও নির্ভরযোগ্য')} <br />
                {t('Delivery', 'হোম ডেলিভারি')}
              </h3>
              <p className="text-xs font-semibold text-[#71849B] mt-0.5">
                {t('Across Bangladesh', 'সারা বাংলাদেশে')}
              </p>
              
              <div className="mt-2.5 w-7.5 h-7.5 rounded-full bg-white shadow-2xs group-hover:bg-[#0877C9] group-hover:text-white flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-[#101C35] group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* Delivery Parcel Box Graphic */}
            <div className="w-24 sm:w-28 h-24 sm:h-28 relative flex items-center justify-center shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-[20px] bg-gradient-to-tr from-[#0877C9] to-[#2563EB] shadow-[0_8px_20px_rgba(8,119,201,0.3)] flex items-center justify-center text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <div className="flex flex-col items-center">
                  <span className="text-sm sm:text-base font-black italic tracking-wider">AZQ</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-sky-200">EXPRESS</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
