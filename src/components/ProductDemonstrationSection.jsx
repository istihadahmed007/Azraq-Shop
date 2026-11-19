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
    <section className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/85 backdrop-blur-2xl border border-[rgba(130,170,205,0.3)] border-t-white/95 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-[0_16px_40px_-10px_rgba(112,200,237,0.18),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#70C8ED]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Interactive Demonstration Screen */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-2xl bg-gradient-to-tr from-[#0E2742] to-[#193B5B] border border-[rgba(112,200,237,0.35)] overflow-hidden shadow-2xl flex items-center justify-center group">
              
              {!isPlaying ? (
                <>
                  <div className="card-image-wrapper w-full h-full p-6 flex items-center justify-center">
                    <img
                      src={demoProduct.main_image}
                      alt={demoProduct.name}
                      className="w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-[#0E2742]/40 backdrop-blur-[2px] flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white flex items-center justify-center shadow-[0_0_30px_rgba(112,200,237,0.6)] transition-all transform hover:scale-110 active:scale-95 group/btn"
                    >
                      <Play className="w-8 h-8 fill-current ml-1 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-[#193B5B]/85 px-4 py-2 rounded-xl backdrop-blur-md border border-white/15 shadow-sm">
                    <span>{t("Verified Supplier Product Showcase (HD)", "অনুমোদিত সোর্স ডেমোনেস্ট্রেশন (HD)")}</span>
                    <span className="text-[#70C8ED] font-mono font-bold">01:45</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full p-6 flex flex-col justify-between text-center bg-[#0E2742]/95 backdrop-blur-lg">
                  <div className="flex justify-between items-center text-xs text-white/70">
                    <span>{t("Live Demonstration Showcase", "লাইভ ডেমোনেস্ট্রেশন")}</span>
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="text-white hover:text-[#70C8ED] text-xs font-bold px-2 py-1 rounded-md bg-white/10"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-3 max-w-md mx-auto my-auto">
                    <div className="w-12 h-12 rounded-full bg-[#70C8ED]/20 text-[#70C8ED] flex items-center justify-center mx-auto animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-white">{demoProduct.name}</h4>
                    <p className="text-xs text-white/75">
                      Fast multi-port charging negotiation, high-speed temperature regulation, and retractable coil longevity.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#70C8ED] font-mono font-bold">
                    ✓ 100% Quality Inspected for AZRAQ Doorstep Delivery
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Specs & Direct Purchase */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
                + {t("PRODUCT DEMONSTRATION", "পণ্য ডেমোনেস্ট্রেশন")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#193B5B] tracking-tight leading-snug">
                {demoProduct.name}
              </h3>
              <p className="text-xs text-[#718398] leading-relaxed">
                Watch our hands-on evaluation of authentic electronics. Featuring true PD smart negotiation, fireproof shell, and dual-output capabilities.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-[#193B5B]">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-[rgba(130,170,205,0.22)]">
                <CheckCircle2 className="w-4 h-4 text-[#0877C9] flex-shrink-0" />
                <span className="font-medium">Fast Power Delivery with Intelligent Smart Chip</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-[rgba(130,170,205,0.22)]">
                <CheckCircle2 className="w-4 h-4 text-[#0877C9] flex-shrink-0" />
                <span className="font-medium">Compact Multi-Interface Compatibility (Lightning, Type-C, Micro USB)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-[rgba(130,170,205,0.22)]">
                <CheckCircle2 className="w-4 h-4 text-[#0877C9] flex-shrink-0" />
                <span className="font-medium">100% Genuine Inspected Stock with Fast Replacement Guarantee</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[rgba(130,170,205,0.22)]">
              <div>
                <span className="text-2xl font-black text-[#193B5B]">৳{demoProduct.price.toLocaleString()}</span>
                <span className="block text-[10px] font-mono font-bold text-[#718398]">{t("Retail Price in BDT", "খুচরা মূল্য")}</span>
              </div>
              <button
                onClick={() => addToCart(demoProduct, demoProduct.variants?.[0] || 'Default', 1)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white font-bold text-xs shadow-[0_4px_16px_rgba(112,200,237,0.4)] transition-all flex items-center gap-2 cursor-pointer"
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
