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
        <div className="rounded-2xl bg-white/75 backdrop-blur-2xl border border-white/90 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_12px_36px_0_rgba(31,38,135,0.06)] hover:border-blue-400/50 hover:bg-white transition-all duration-200">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.16em] block font-bold">
              {t("CURATED LIVING", "হোম ও লিভিং")}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {t("Thoughtful Goods for Everyday Spaces", "দৈনন্দিন জীবনের প্রয়োজনীয় হোম অ্যাপ্লায়েন্স")}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#245BDB] to-[#1E40AF] hover:from-[#1E40AF] text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>{t("Explore Living", "কালেকশন দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {aromaProduct && (
                <span className="text-xs font-mono font-extrabold text-slate-900">
                  ৳{(aromaProduct.price || 1500).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            <ProductImage
              src={aromaProduct?.main_image || "https://easydrop.asia/products/image-1793781951949-366943491.jpeg"}
              alt="Desktop Fireplace Flame Diffuser"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Banner 2: High-Density GaN Power Technology */}
        <div className="rounded-2xl bg-white/75 backdrop-blur-2xl border border-white/90 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_12px_36px_0_rgba(31,38,135,0.06)] hover:border-blue-400/50 hover:bg-white transition-all duration-200">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-[0.16em] block font-bold">
              {t("AUTHENTIC HARDWARE", "আসল গ্যাজেটস")}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {t("Certified Performance & Smart Power Gear", "সার্টিফাইড গ্যাজেটস ও আইটি সরঞ্জাম")}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#245BDB] to-[#1E40AF] hover:from-[#1E40AF] text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>{t("Discover Tech", "গ্যাজেটস দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {chargerProduct && (
                <span className="text-xs font-mono font-extrabold text-slate-900">
                  ৳{(chargerProduct.price || 980).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-3 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            <ProductImage
              src={chargerProduct?.main_image || "https://easydrop.asia/products/image-1793786236273-738221653.jpeg"}
              alt="Awei PD91 30W GaN Charger"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
