import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Transparent Glassy Promotional Highlights
 * 
 * Features:
 * - Frosted glass feature panels using authentic catalog inventory.
 * - Panel 1: Atmospheric Living & Home Diffusers (AZQ-0010)
 * - Panel 2: GaN Fast Charging & Power Tech (AZQ-0008)
 * - Strictly preserves 100% full image containment.
 */
export default function PromotionalBannersSection() {
  const navigate = useNavigate();
  const { products, setActiveCategory, t } = useShop();

  const aromaProduct = products.find(p => p.id === 'AZQ-0010');
  const chargerProduct = products.find(p => p.id === 'AZQ-0008');

  return (
    <section className="w-full select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* Banner 1: Curated Living & Atmosphere */}
        <div className="rounded-[28px] bg-[#F8FBFF]/75 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] hover:border-[#70C8ED]/60 hover:bg-white/95 transition-all duration-200">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
              + {t("CURATED LIVING", "হোম ও লিভিং")}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight leading-snug">
              {t("Thoughtful Goods for Everyday Spaces", "দৈনন্দিন জীবনের প্রয়োজনীয় হোম অ্যাপ্লায়েন্স")}
            </h3>
            <p className="text-xs text-[#718398] leading-relaxed">
              {t(
                "Aroma diffusers, kitchen tools, and home organizers — verified for build durability.",
                "যাচাইকৃত কিচেন ও হোম অ্যাপ্লায়েন্সেসের আসল কালেকশন।"
              )}
            </p>
            
            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('Home & Lifestyle');
                  const el = document.getElementById('all-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98 shadow-[0_4px_16px_rgba(112,200,237,0.4)] cursor-pointer"
              >
                <span>{t("Explore Living", "কালেকশন দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {aromaProduct && (
                <span className="text-xs font-mono font-extrabold text-[#193B5B]">
                  ৳{(aromaProduct.price || 1500).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="card-image-wrapper w-36 h-36 sm:w-44 sm:h-44 bg-white/80 backdrop-blur-md border border-[rgba(130,170,205,0.22)] rounded-[22px] p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            <ProductImage
              src={aromaProduct?.main_image || "https://easydrop.asia/products/image-1793781951949-366943491.jpeg"}
              alt="Desktop Fireplace Flame Diffuser"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Banner 2: High-Density GaN Power Technology */}
        <div className="rounded-[28px] bg-[#F8FBFF]/75 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] hover:border-[#70C8ED]/60 hover:bg-white/95 transition-all duration-200">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
              + {t("AUTHENTIC HARDWARE", "আসল গ্যাজেটস")}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight leading-snug">
              {t("Certified Performance & Smart Power Gear", "সার্টিফাইড গ্যাজেটস ও আইটি সরঞ্জাম")}
            </h3>
            <p className="text-xs text-[#718398] leading-relaxed">
              {t(
                "Direct import GaN chargers, audio gear, and peripherals with transparent retail specs.",
                "সরাসরি আমদানিকৃত গ্যাজেট ও চার্জিং সলিউশনের সেরা কালেকশন।"
              )}
            </p>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('Gadgets & IT Accessories');
                  const el = document.getElementById('all-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98 shadow-[0_4px_16px_rgba(112,200,237,0.4)] cursor-pointer"
              >
                <span>{t("Discover Tech", "গ্যাজেটস দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {chargerProduct && (
                <span className="text-xs font-mono font-extrabold text-[#193B5B]">
                  ৳{(chargerProduct.price || 1200).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="card-image-wrapper w-36 h-36 sm:w-44 sm:h-44 bg-white/80 backdrop-blur-md border border-[rgba(130,170,205,0.22)] rounded-[22px] p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            <ProductImage
              src={chargerProduct?.main_image || (products[1]?.main_image)}
              alt="High Power GaN Charger"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
