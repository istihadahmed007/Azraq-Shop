import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductDemonstrationSection() {
  const { products, setSelectedProduct, addToCart, t } = useShop();
  const [isPlaying, setIsPlaying] = useState(false);

  // Focus on flagship gadget demo: e.g. Baseus Charging set or first available product
  const demoProduct = products.find(p => p.id === 'AZQ-0001') || products[0];

  if (!demoProduct) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="rounded-2xl bg-gradient-to-br from-[#062B4F] via-[#0A335C] to-[#062B4F] text-white p-8 sm:p-12 lg:p-16 border border-[#69C5F5]/30 relative overflow-hidden shadow-2xl">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#50DDF0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Interactive Demonstration Screen */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-xl bg-gradient-to-tr from-[#031526] to-[#0A1E36] border border-[#69C5F5]/30 overflow-hidden shadow-2xl flex items-center justify-center group">
              
              {!isPlaying ? (
                <>
                  <img
                    src={demoProduct.main_image}
                    alt={demoProduct.name}
                    className="w-full h-full object-contain p-4 sm:p-6 filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#062B4F]/40 backdrop-blur-[2px] flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0877C9] hover:bg-[#50DDF0] text-white hover:text-[#062B4F] flex items-center justify-center shadow-[0_0_25px_rgba(8,119,201,0.5)] transition-all transform hover:scale-110 active:scale-95 group/btn"
                    >
                      <Play className="w-8 h-8 fill-current ml-1 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 bg-[#062B4F]/70 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">
                    <span>{t("Authorized Supplier Demonstration (HD)", "অনুমোদিত সোর্স ডেমোনেস্ট্রেশন (HD)")}</span>
                    <span className="text-[#50DDF0] font-mono">01:45</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full p-6 flex flex-col justify-between text-center bg-[#062B4F]/95 backdrop-blur-lg">
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>{t("Live Demonstration Video Feed", "লাইভ ডেমোনেস্ট্রেশন ফিড")}</span>
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="text-white hover:text-[#50DDF0] text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-3 max-w-md mx-auto my-auto">
                    <div className="w-12 h-12 rounded-full bg-[#50DDF0]/20 text-[#50DDF0] flex items-center justify-center mx-auto animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white">{demoProduct.name}</h4>
                    <p className="text-xs text-white/70">
                      Testing fast multi-port charging negotiation, high-speed temperature regulation, and retractable coil longevity.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#50DDF0] font-mono">
                    ✓ 100% Quality Verified by EasyDrop QC Hub
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Specs & Direct Purchase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#50DDF0] uppercase">
                {t("PRODUCT DEMONSTRATION", "পণ্য ডেমোনেস্ট্রেশন")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {demoProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Watch our hands-on evaluation of the Baseus Limited Edition Set. Featuring true 20W PD smart negotiation, fireproof PC shell, and dual-output capabilities.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-white/85">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#50DDF0] flex-shrink-0" />
                <span>20W Fast Power Delivery with Intelligent Smart Chip</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#50DDF0] flex-shrink-0" />
                <span>Compact Retractable Cable (Lightning, Type-C, Micro USB)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#50DDF0] flex-shrink-0" />
                <span>Official EasyDrop Partner Stock with Warranty</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <div>
                <span className="text-2xl font-black text-white">৳{demoProduct.price.toLocaleString()}</span>
                <span className="block text-[10px] text-[#69C5F5]">{t("Retail Price in BDT", "খুচরা মূল্য")}</span>
              </div>
              <button
                onClick={() => addToCart(demoProduct, demoProduct.variants?.[0] || 'Default', 1)}
                className="px-6 py-2.5 rounded-full bg-[#0877C9] hover:bg-[#50DDF0] text-white hover:text-[#062B4F] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t("Add to Bag", "ব্যাগে যোগ করুন")}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
