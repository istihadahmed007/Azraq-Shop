import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Sparkles, Truck, Star, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroSection() {
  const { products, collections, navigateTo, setSelectedProduct, t } = useShop();

  // Dynamic products from multiple collections for the 3D composition (High Resolution Studio Assets)
  const heroPrimary = products.find(p => p.id === 'AZQ-0001') || products[0]; // Baseus Fast Charging Set
  const heroSecondary = products.find(p => p.id === 'AZQ-0075') || products[20]; // Premium Shoulder Bag
  const heroTertiary = products.find(p => p.id === 'AZQ-0054') || products[40]; // Smartwatch

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24 bg-hero-gradient">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-azraq-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-azraq-azure/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Bold Editorial Typography & CTA */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 z-10 text-center lg:text-left">
            
            {/* Supertag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-azraq-purple/30 text-azraq-violet text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-azraq-violet fill-azraq-violet" />
              <span>{t("CURATED MULTI-COLLECTION STORE", "কিউরেটেড মাল্টি-কালেকশন স্টোর")}</span>
            </div>

            {/* Giant Editorial Headline (Requested Exact Match) */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight text-azraq-navy leading-[1.04]">
              {t("DISCOVER MORE.", "আবিষ্কার করুন আরও।")} <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-azraq-violet to-azraq-purple">
                {t("LIVE BETTER.", "বাঁচুন অনন্যভাবে।")}
              </span>
            </h1>

            {/* Editorial Subtitle (Requested Exact Match) */}
            <p className="text-base sm:text-lg text-azraq-navy/70 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {t(
                "Explore a world of thoughtfully selected products, useful discoveries and everyday essentials. 18 authentic collections, direct supplier inventory and express nationwide delivery across Bangladesh.",
                "চিন্তাশীলভাবে নির্বাচিত পণ্য, কার্যকর আবিষ্কার ও প্রতিদিনের প্রয়োজনীয় সামগ্রীর অনন্য সমাহার। ১৮টি অনুমোদিত কালেকশন ও দেশব্যাপী হোম ডেলিভারি।"
              )}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigateTo('collections')}
                className="group flex items-center gap-3 pl-6 pr-2 py-2.5 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy text-sm sm:text-base font-extrabold tracking-tight shadow-glow-lime transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>{t("EXPLORE COLLECTIONS", "কালেকশন দেখুন")}</span>
                <span className="w-9 h-9 rounded-full bg-azraq-navy text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('shop-by-collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-full text-sm font-bold text-azraq-navy/80 hover:text-azraq-violet transition-colors flex items-center gap-2"
              >
                <span>{t("Shop by Collection", "কালেকশন অনুযায়ী")}</span>
                <span className="text-xs text-azraq-violet">↓</span>
              </button>
            </div>

            {/* Mini Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-azraq-navy/60">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-azraq-violet" />
                <span>{collections.length} {t("Verified Collections", "অনুমোদিত কালেকশন")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{products.length} {t("Curated Unique Products", "যাচাইকৃত পণ্য")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-azraq-azure" />
                <span>{t("Dhaka ৳70 • Outside ৳130", "সারা বাংলাদেশে ডেলিভারি")}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Floating 3D-Style Product Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[420px] lg:min-h-[500px]">
            
            {/* Central Violet Aura Circle */}
            <div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full bg-gradient-to-tr from-azraq-purple/40 to-azraq-lavender/60 border border-azraq-purple/30 shadow-inner" />

            {/* Floating Dots Matrix */}
            <div className="absolute top-4 right-8 w-24 h-24 grid grid-cols-4 gap-2 opacity-30 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-azraq-violet" />
              ))}
            </div>

            {/* Main Center Floating Card (Primary Hero Item) */}
            <div 
              onClick={() => setSelectedProduct(heroPrimary)}
              className="relative z-20 group cursor-pointer transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 animate-float"
            >
              <div className="w-80 sm:w-96 rounded-none bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-azraq-purple/20 shadow-float">
                <div className="relative w-full h-64 sm:h-76 rounded-none bg-gradient-to-b from-azraq-cloud to-white flex items-center justify-center overflow-hidden p-2">
                  <img
                    src={heroPrimary.main_image}
                    alt={heroPrimary.name}
                    className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-none bg-azraq-navy text-white text-[10px] font-bold tracking-wider uppercase">
                    {heroPrimary.primary_collection_name}
                  </span>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="max-w-[210px]">
                    <h3 className="font-extrabold text-azraq-navy text-sm sm:text-base truncate group-hover:text-azraq-violet transition-colors">
                      {heroPrimary.name}
                    </h3>
                    <p className="text-xs text-azraq-navy/50">{heroPrimary.primary_collection_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-black text-azraq-navy">
                      ৳{heroPrimary.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Floating Card (Offset Bag / Accessory) */}
            <div 
              onClick={() => setSelectedProduct(heroSecondary)}
              className="absolute -top-6 sm:top-0 -right-2 sm:right-2 z-10 cursor-pointer transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500 animate-float-delayed"
            >
              <div className="w-52 sm:w-60 rounded-none bg-white/95 backdrop-blur-md p-3 border border-azraq-purple/25 shadow-xl">
                <div className="relative w-full h-36 sm:h-44 rounded-none bg-azraq-cloud flex items-center justify-center overflow-hidden p-1.5">
                  <img
                    src={heroSecondary.main_image}
                    alt={heroSecondary.name}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-azraq-lime" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-azraq-navy truncate max-w-[120px]">
                    {heroSecondary.name}
                  </p>
                  <span className="text-xs font-black text-azraq-violet">
                    ৳{heroSecondary.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Glass Pill: Multi-Collection Ingestion */}
            <div className="absolute -bottom-4 left-4 sm:left-12 z-30 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-azraq-navy/90 text-white backdrop-blur-md border border-azraq-purple/30 shadow-2xl animate-float">
              <span className="w-2.5 h-2.5 rounded-full bg-azraq-lime animate-ping" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-azraq-lime tracking-wider">
                  {t("EASYDROP /NEW-STORE INGESTION", "ইজিড্রপ ইনজেশন")}
                </p>
                <p className="text-xs font-bold text-white">
                  18 {t("Collections", "ক্যাটাগরি")} • {products.length} {t("Products", "পণ্য")}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
