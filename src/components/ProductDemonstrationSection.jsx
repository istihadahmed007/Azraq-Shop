import React, { useState } from 'react';
import { Play, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function ProductDemonstrationSection() {
  const { products, setSelectedProduct, addToCart, t } = useShop();
  const [isPlaying, setIsPlaying] = useState(false);

  // Focus on flagship gadget demo: e.g. Baseus Charging set or Massage Gun
  const demoProduct = products.find(p => p.id === 'AZQ-001') || products[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-azraq-navy text-white p-8 sm:p-12 lg:p-16 border border-azraq-purple/30 relative overflow-hidden shadow-2xl">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-azraq-violet/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Interactive Demonstration Screen */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-3xl bg-gradient-to-tr from-[#162644] to-[#0A1220] border-2 border-azraq-purple/30 overflow-hidden shadow-2xl flex items-center justify-center group">
              
              {!isPlaying ? (
                <>
                  <img
                    src={demoProduct.main_image}
                    alt={demoProduct.name}
                    className="w-full h-full object-contain p-8 filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform hover:scale-110 active:scale-95 group/btn"
                    >
                      <Play className="w-8 h-8 fill-azraq-navy ml-1 transition-transform group-hover/btn:scale-110" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md">
                    <span>Authorized Supplier Demonstration (HD)</span>
                    <span className="text-azraq-lime font-mono">01:45</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full p-6 flex flex-col justify-between text-center bg-black/90">
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>Live Demonstration Video Feed</span>
                    <button 
                      onClick={() => setIsPlaying(false)}
                      className="text-white hover:text-azraq-lime text-xs font-bold"
                    >
                      Close Demo ✕
                    </button>
                  </div>
                  <div className="space-y-3 max-w-md mx-auto my-auto">
                    <div className="w-12 h-12 rounded-full bg-azraq-lime/20 text-azraq-lime flex items-center justify-center mx-auto animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{demoProduct.name}</h4>
                    <p className="text-xs text-white/70">
                      Testing multi-port 20W PD high-speed distribution, temperature regulation and retractable coil durability.
                    </p>
                  </div>
                  <div className="text-[11px] text-azraq-lime font-mono">
                    ✓ 100% Quality Verified by EasyDrop QC Hub
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Specs & Direct Purchase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-azraq-lime uppercase">
                {t("PRODUCT DEMONSTRATION", "পণ্য ডেমোনেস্ট্রেশন")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {demoProduct.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Watch our hands-on evaluation of the Baseus Limited Edition Set. Featuring true 20W PD smart negotiation, fireproof PC shell, and dual-output capabilities.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-azraq-lime flex-shrink-0" />
                <span>20W Fast Power Delivery with Intelligent Chip</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-azraq-lime flex-shrink-0" />
                <span>Compact Retractable Cable (Lightning, Type-C, Micro)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-azraq-lime flex-shrink-0" />
                <span>Official EasyDrop Partner Stock with Warranty</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <div>
                <span className="text-2xl font-black text-white">৳{demoProduct.price.toLocaleString()}</span>
              </div>
              <button
                onClick={() => addToCart(demoProduct, 'Default', 1)}
                className="px-6 py-2.5 rounded-full bg-azraq-lime text-azraq-navy font-bold text-xs sm:text-sm hover:bg-[#bbf035] shadow-glow-lime transition-all"
              >
                {t("Add Demo Unit to Bag", "অর্ডার করুন")}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

