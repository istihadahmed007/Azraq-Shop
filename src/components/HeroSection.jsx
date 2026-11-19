import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import AzraqDeliveryTruck from './common/AzraqDeliveryTruck';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Exact Reference-Based Main Hero Section
 * 
 * Three-part horizontal desktop composition:
 * 1. LEFT:
 *    - Premium Shopping Badge ("👑 Premium Selection")
 *    - Large Headline: "Discover Better. Live Better."
 *    - AZRAQ product description
 *    - Strong Blue "Shop Now ->" Pill Button
 * 2. CENTER:
 *    - Large curved marble pedestal podium
 *    - 3 Complementary products from authentic catalogue:
 *      • Left: Earbuds (AZQ-0101 Awei T61 TWS Earbuds)
 *      • Center: Flagship Device (AZQ-0484 Baseus 20000mAh Power Bank / AZQ-0274 Smart Watch)
 *      • Right: Fast Charger (AZQ-0374 Anker 20W Cube Fast Charger)
 *      All with genuine main_image URLs, 100% full contain visibility, drop shadows
 * 3. RIGHT:
 *    - Top Glass Card: "Up to 50% OFF On Top Brands" with genuine AZRAQ headphones photograph (AZQ-0378)
 *    - Bottom Glass Card: "Fast & Reliable Delivery Across Bangladesh" with 3D AZRAQ Delivery Truck
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const { products, t } = useShop();

  // Curate 3 complementary products from authentic catalog
  const earbudsProduct = products.find(p => p.id === 'AZQ-0101') || products.find(p => p.id === 'AZQ-0040') || products[0];
  const centerProduct = products.find(p => p.id === 'AZQ-0484') || products.find(p => p.id === 'AZQ-0274') || products.find(p => p.id === 'AZQ-0001') || products[1];
  const chargerProduct = products.find(p => p.id === 'AZQ-0374') || products.find(p => p.id === 'AZQ-0008') || products.find(p => p.id === 'AZQ-0006') || products[2];

  // Curate promo headphone product
  const headphonesProduct = products.find(p => p.id === 'AZQ-0378') || products.find(p => p.id === 'AZQ-0364') || products.find(p => p.id === 'AZQ-0035') || products[3];

  const handleOpenProduct = (p) => {
    if (!p) return;
    try {
      const slug = generateProductSlug(p);
      navigate(`/product/${slug}`);
    } catch {
      navigate(`/product/${p.id}`);
    }
  };

  const handleShopNow = () => {
    const el = document.getElementById('popular-products') || document.getElementById('all-products');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-white/70 backdrop-blur-2xl rounded-[28px] sm:rounded-[32px] shadow-[0_16px_40px_-10px_rgba(112,200,237,0.14),0_2px_8px_-1px_rgba(25,59,91,0.03)] p-4 sm:p-6 lg:p-8 transition-all relative overflow-hidden">

      {/* Ambient background glow dots matching reference */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#70C8ED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#3B82F6]/08 rounded-full blur-3xl pointer-events-none" />

      {/* Three-Column Horizontal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch relative z-10">

        {/* 1. LEFT COLUMN: Headline, Description & CTA */}
        <div className="lg:col-span-4 flex flex-col justify-center items-start space-y-4 sm:space-y-5 lg:pr-2">

          {/* Premium Shopping Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DDEEFF]/80 border border-[#70C8ED]/30 text-[#0877C9] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0877C9]" />
            <span className="text-[11px] font-bold tracking-tight">
              {t("👑 Premium Accessories & Essentials", "👑 প্রিমিয়াম সিলেকশন")}
            </span>
          </div>

          {/* Huge Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-black text-[#193B5B] tracking-tight leading-[1.08]">
            {t("Discover Better.", "ডিসকভার বেটার।")}
            <br />
            <span className="bg-gradient-to-r from-[#0877C9] via-[#245BDB] to-[#3B82F6] bg-clip-text text-transparent">
              {t("Live Better.", "লিভ বেটার।")}
            </span>
          </h1>

          {/* Short AZRAQ Description */}
          <p className="text-xs sm:text-[13px] text-[#718398] leading-relaxed max-w-sm font-medium">
            {t(
              "Curated lifestyle essentials, authentic electronics, and premium daily gear for a smarter you — delivered nationwide across Bangladesh.",
              "আসল গ্যাজেটস, ইলেকট্রনিক্স ও প্রিমিয়াম লাইফস্টাইল পণ্য। সরাসরি হোম ডেলিভারি ও শতভাগ ভেরিফাইড কোয়ালিটি।"
            )}
          </p>

          {/* Strong Blue Shop Now Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleShopNow}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-[#0877C9] to-[#3B82F6] hover:from-[#0665AC] hover:to-[#2563EB] text-white text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(8,119,201,0.38)] hover:shadow-[0_12px_28px_rgba(8,119,201,0.5)] transition-all cursor-pointer active:scale-98"
            >
              <span>{t("Shop Now", "এখনই কিনুন")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 2. CENTER COLUMN: Large 3D Marble Pedestal Photographic Composition */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-end min-h-[290px] sm:min-h-[340px] lg:min-h-[380px] p-2">

          {/* Subtle floating particle glow in background */}
          <div className="absolute top-8 left-12 w-2.5 h-2.5 rounded-full bg-[#70C8ED]/40 blur-xs" />
          <div className="absolute top-16 right-16 w-3 h-3 rounded-full bg-[#0877C9]/30 blur-xs" />

          {/* Photographic Arrangement on 3D Pedestal */}
          <div className="relative w-full max-w-[440px] flex items-end justify-center pb-8 sm:pb-10">

            {/* PRODUCT 1: Left - Earbuds in open case */}
            {earbudsProduct && (
              <div
                onClick={() => handleOpenProduct(earbudsProduct)}
                className="absolute left-0 bottom-7 sm:bottom-9 z-20 w-28 sm:w-36 aspect-square cursor-pointer group transition-transform hover:scale-105 duration-250"
                title={`${earbudsProduct.name} - ৳${(earbudsProduct.price || 0).toLocaleString()}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <ProductImage
                    src={earbudsProduct.main_image}
                    alt={earbudsProduct.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    className="drop-shadow-[0_16px_20px_rgba(8,119,201,0.22)] group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* PRODUCT 2: Center - Flagship Device (Power Bank / Smart Watch) standing tall */}
            {centerProduct && (
              <div
                onClick={() => handleOpenProduct(centerProduct)}
                className="relative z-10 w-40 sm:w-48 aspect-square cursor-pointer group transition-transform hover:scale-105 duration-250 mb-2 sm:mb-3"
                title={`${centerProduct.name} - ৳${(centerProduct.price || 0).toLocaleString()}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <ProductImage
                    src={centerProduct.main_image}
                    alt={centerProduct.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    className="drop-shadow-[0_20px_26px_rgba(25,59,91,0.28)] group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* PRODUCT 3: Right - Charger & Cable */}
            {chargerProduct && (
              <div
                onClick={() => handleOpenProduct(chargerProduct)}
                className="absolute right-0 bottom-6 sm:bottom-8 z-20 w-28 sm:w-36 aspect-square cursor-pointer group transition-transform hover:scale-105 duration-250"
                title={`${chargerProduct.name} - ৳${(chargerProduct.price || 0).toLocaleString()}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <ProductImage
                    src={chargerProduct.main_image}
                    alt={chargerProduct.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    className="drop-shadow-[0_16px_20px_rgba(8,119,201,0.22)] group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* 3D Curved Marble / Glass Pedestal Stage */}
            <div className="absolute -bottom-1 w-[92%] sm:w-[96%] h-20 sm:h-24 pointer-events-none z-0">
              {/* Marble Pedestal Top Surface */}
              <div className="w-full h-12 sm:h-14 rounded-[50%/40%] bg-gradient-to-b from-white via-[#F4F9FD] to-[#E2EEF8] border border-white/95 shadow-[0_14px_32px_rgba(8,119,201,0.18),inset_0_2px_4px_rgba(255,255,255,0.95)] relative overflow-hidden">
                {/* Subtle marble veins / gloss streak */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.9)_0%,rgba(221,238,255,0.4)_70%,transparent_100%)]" />
              </div>
              {/* Marble Pedestal Cylinder Edge */}
              <div className="w-full h-8 sm:h-10 -mt-6 sm:-mt-7 rounded-b-[40px] bg-gradient-to-b from-[#E2EEF8] via-[#D5E5F4] to-[#C4D9ED] border-x border-b border-[rgba(130,170,205,0.35)] shadow-[0_16px_30px_rgba(8,119,201,0.16)]" />
            </div>

          </div>

        </div>

        {/* 3. RIGHT COLUMN: Two Vertically Stacked Glass Cards */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3.5 sm:gap-4">

          {/* Card A: Up to 50% OFF On Top Brands */}
          <div
            onClick={() => handleOpenProduct(headphonesProduct)}
            className="flex-1 bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-[rgba(130,170,205,0.25)] border-t-white/95 rounded-[22px] p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all duration-200 group cursor-pointer"
          >
            <div className="flex flex-col justify-between h-full pr-2">
              <div>
                <span className="text-[11px] font-bold text-[#718398] uppercase tracking-wider block">
                  {t("Up to", "সর্বোচ্চ")}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#193B5B] leading-tight block mt-0.5">
                  50% OFF
                </span>
                <span className="text-xs font-semibold text-[#718398] block mt-1">
                  {t("On Top Brands", "সেরা ব্র্যান্ডে")}
                </span>
              </div>

              <div className="pt-3">
                <span className="w-7 h-7 rounded-full bg-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#0877C9] group-hover:bg-[#0877C9] group-hover:text-white transition-colors shadow-2xs">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {headphonesProduct && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 p-1 flex items-center justify-center shrink-0">
                <ProductImage
                  src={headphonesProduct.main_image}
                  alt={headphonesProduct.name}
                  fit="contain"
                  aspectRatio="square"
                  className="group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>
            )}
          </div>

          {/* Card B: Fast & Reliable Delivery Across Bangladesh */}
          <div
            onClick={() => {
              const el = document.getElementById('brand-value-ribbon');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 bg-white/75 hover:bg-white/90 backdrop-blur-xl border border-[rgba(130,170,205,0.25)] border-t-white/95 rounded-[22px] p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-all duration-200 group cursor-pointer"
          >
            <div className="flex flex-col justify-between h-full pr-2">
              <div>
                <span className="text-sm sm:text-base font-black text-[#193B5B] leading-snug block">
                  {t("Fast & Reliable", "দ্রুত ও নিশ্চিত")}
                </span>
                <span className="text-sm sm:text-base font-black text-[#193B5B] leading-snug block">
                  {t("Delivery", "হোম ডেলিভারি")}
                </span>
                <span className="text-xs font-semibold text-[#718398] block mt-1">
                  {t("Across Bangladesh", "সারাদেশে")}
                </span>
              </div>

              <div className="pt-3">
                <span className="w-7 h-7 rounded-full bg-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#0877C9] group-hover:bg-[#0877C9] group-hover:text-white transition-colors shadow-2xs">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* 3D Delivery Truck Graphic */}
            <div className="w-24 h-18 sm:w-28 sm:h-20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform duration-300">
              <AzraqDeliveryTruck className="w-full h-full" />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
