import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Editorial Merchandising Highlights
 * 
 * High-contrast editorial feature panels using authentic catalog inventory:
 * - Panel 1: Atmospheric Living & Home Diffusers (AZQ-0010)
 * - Panel 2: GaN Fast Charging & Power Tech (AZQ-0008)
 * 100% authentic catalog photography and verified retail specifications.
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
        <div className="rounded-[4px] bg-white border border-[#E5E3DA] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_1px_3px_rgba(23,35,51,0.03)] hover:border-[#172333] transition-colors">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-mono text-[#8C99A8] uppercase tracking-[0.16em] block font-semibold">
              {t("CURATED LIVING", "হোম ও লিভিং")}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight leading-snug">
              {t("Thoughtful Goods for Everyday Spaces", "দৈনন্দিন জীবনের প্রয়োজনীয় হোম অ্যাপ্লায়েন্স")}
            </h3>
            <p className="text-xs text-[#556170] leading-relaxed">
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
                className="px-4 py-2 rounded-[3px] bg-[#172333] hover:bg-[#245BDB] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-98"
              >
                <span>{t("Explore Living", "কালেকশন দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {aromaProduct && (
                <span className="text-xs font-mono font-bold text-[#172333]">
                  ৳{(aromaProduct.price || 1500).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#FAF9F5] border border-[#E5E3DA] rounded-[3px] p-3 flex items-center justify-center shrink-0 overflow-hidden">
            <ProductImage
              src={aromaProduct?.main_image || "https://easydrop.asia/products/image-1793781951949-366943491.jpeg"}
              alt="Desktop Fireplace Flame Diffuser"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Banner 2: High-Density GaN Power Technology */}
        <div className="rounded-[4px] bg-white border border-[#E5E3DA] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_1px_3px_rgba(23,35,51,0.03)] hover:border-[#172333] transition-colors">
          <div className="flex-1 space-y-2">
            <span className="text-[10px] font-mono text-[#8C99A8] uppercase tracking-[0.16em] block font-semibold">
              {t("AUTHENTIC HARDWARE", "আসল গ্যাজেটস")}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight leading-snug">
              {t("Certified Performance & Smart Power Gear", "সার্টিফাইড গ্যাজেটস ও আইটি সরঞ্জাম")}
            </h3>
            <p className="text-xs text-[#556170] leading-relaxed">
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
                className="px-4 py-2 rounded-[3px] bg-[#245BDB] hover:bg-[#1C4BB8] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-98"
              >
                <span>{t("Discover Tech", "গ্যাজেটস দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {chargerProduct && (
                <span className="text-xs font-mono font-bold text-[#172333]">
                  ৳{(chargerProduct.price || 980).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#FAF9F5] border border-[#E5E3DA] rounded-[3px] p-3 flex items-center justify-center shrink-0 overflow-hidden">
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
