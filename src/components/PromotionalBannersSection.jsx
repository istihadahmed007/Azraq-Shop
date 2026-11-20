import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Editorial Promotional Highlights
 * 
 * Features:
 * - Feature panels highlighting authentic catalog inventory.
 * - Panel 1: Curated Living & Home Diffusers (AZQ-0010)
 * - Panel 2: GaN Fast Charging & Power Tech (AZQ-0008)
 * - Strictly preserves image containment and real BDT pricing.
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
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold text-[#185ADB] uppercase tracking-wide block">
              {t("Curated Living", "হোম ও লিভিং")}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {t("Thoughtful Goods for Everyday Spaces", "দৈনন্দিন জীবনের প্রয়োজনীয় হোম অ্যাপ্লায়েন্স")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t(
                "Aroma diffusers, kitchen tools, and home organizers — verified for durability and everyday utility.",
                "যাচাইকৃত কিচেন ও হোম অ্যাপ্লায়েন্সেসের আসল কালেকশন।"
              )}
            </p>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('Home & Lifestyle');
                  const el = document.getElementById('all-products') || document.getElementById('popular-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                <span>{t("Explore Living", "কালেকশন দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {aromaProduct && (
                <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                  ৳{(aromaProduct.price || 1500).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="card-image-wrapper w-36 h-36 sm:w-44 sm:h-44 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-center shrink-0 overflow-hidden">
            <ProductImage
              src={aromaProduct?.main_image || "https://easydrop.asia/products/image-1793781951949-366943491.jpeg"}
              alt="Desktop Fireplace Flame Diffuser"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Banner 2: High-Density GaN Power Technology */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold text-[#185ADB] uppercase tracking-wide block">
              {t("Authentic Hardware", "আসল গ্যাজেটস")}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {t("Certified Performance & Smart Power Gear", "সার্টিফাইড গ্যাজেটস ও আইটি সরঞ্জাম")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {t(
                "Direct import GaN chargers, audio gear, and peripherals with transparent retail specifications.",
                "সরাসরি আমদানিকৃত গ্যাজেট ও চার্জিং সলিউশনের সেরা কালেকশন।"
              )}
            </p>

            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('Gadgets & IT Accessories');
                  const el = document.getElementById('all-products') || document.getElementById('popular-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
              >
                <span>{t("Explore Hardware", "গ্যাজেটস দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {chargerProduct && (
                <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                  ৳{(chargerProduct.price || 1200).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="card-image-wrapper w-36 h-36 sm:w-44 sm:h-44 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-center shrink-0 overflow-hidden">
            <ProductImage
              src={chargerProduct?.main_image || "https://easydrop.asia/products/image-1794224164356-135288231.jpeg"}
              alt="Fast Charger"
              fit="contain"
              aspectRatio="square"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
