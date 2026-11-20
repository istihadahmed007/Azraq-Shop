import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import AzraqDeliveryTruck from './common/AzraqDeliveryTruck';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Editorial Main Hero Section
 * 
 * Three-part horizontal desktop composition:
 * 1. LEFT:
 *    - Quiet category badge
 *    - High-contrast headline: "Discover Better. Live Better."
 *    - Authentic store description
 *    - Solid AZRAQ Blue action button
 * 2. CENTER:
 *    - Grounded product stage with 3 authentic products from catalog:
 *      • Left: Earbuds (AZQ-0101 Awei T61 TWS Earbuds)
 *      • Center: Flagship Device (AZQ-0484 Baseus 20000mAh Power Bank)
 *      • Right: Fast Charger (AZQ-0374 Anker 20W Cube Fast Charger)
 * 3. RIGHT:
 *    - Top Card: Top Brands Offer with headphones photograph
 *    - Bottom Card: Nationwide Delivery with Azraq Delivery Truck
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
    <section className="w-full select-none border border-slate-200/90 bg-white rounded-2xl shadow-xs p-5 sm:p-7 lg:p-8 transition-all relative overflow-hidden">

      {/* Three-Column Horizontal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">

        {/* 1. LEFT COLUMN: Headline, Description & CTA */}
        <div className="lg:col-span-4 flex flex-col justify-center items-start space-y-4 lg:pr-2">

          {/* Clean Quality Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200/70 text-slate-800 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#185ADB]" />
            <span>{t("Verified Everyday Essentials", "যাচাইকৃত আসল পণ্যতালিকা")}</span>
          </div>

          {/* Confident, Solid Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            {t("Discover Better.", "ডিসকভার বেটার।")}
            <span className="text-[#185ADB] block mt-0.5">
              {t("Live Better.", "লিভ বেটার।")}
            </span>
          </h1>

          {/* Short AZRAQ Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
            {t(
              "Curated electronics, lifestyle accessories, and home goods — verified for quality with nationwide cash on delivery across Bangladesh.",
              "আসল গ্যাজেটস, ইলেকট্রনিক্স ও লাইফস্টাইল পণ্য। সরাসরি হোম ডেলিভারি ও শতভাগ ভেরিফাইড কোয়ালিটি।"
            )}
          </p>

          {/* Solid Cerulean CTA Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleShopNow}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#185ADB] focus-visible:ring-offset-2"
            >
              <span>{t("Shop Catalog", "পণ্য দেখুন")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 2. CENTER COLUMN: Clean Photographic Pedestal Composition */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-end min-h-[280px] sm:min-h-[320px] lg:min-h-[360px] p-2">

          {/* Photographic Arrangement on Stage */}
          <div className="relative w-full max-w-[420px] flex items-end justify-center pb-8 sm:pb-10">

            {/* PRODUCT 1: Left - Earbuds */}
            {earbudsProduct && (
              <div
                onClick={() => handleOpenProduct(earbudsProduct)}
                className="absolute left-1 bottom-6 sm:bottom-8 z-20 w-28 sm:w-34 aspect-square cursor-pointer group transition-transform hover:scale-105 duration-200"
                title={`${earbudsProduct.name} - ৳${(earbudsProduct.price || 0).toLocaleString()}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <ProductImage
                    src={earbudsProduct.main_image}
                    alt={earbudsProduct.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    className="drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* PRODUCT 2: Center - Flagship Device standing tall */}
            {centerProduct && (
              <div
                onClick={() => handleOpenProduct(centerProduct)}
                className="relative z-10 w-38 sm:w-46 aspect-square cursor-pointer group transition-transform hover:scale-105 duration-200 mb-2"
                title={`${centerProduct.name} - ৳${(centerProduct.price || 0).toLocaleString()}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <ProductImage
                    src={centerProduct.main_image}
                    alt={centerProduct.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    className="drop-shadow-lg group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* PRODUCT 3: Right - Fast Charger */}
            {chargerProduct && (
              <div
                onClick={() => handleOpenProduct(chargerProduct)}
                className="absolute right-1 bottom-5 sm:bottom-7 z-20 w-28 sm:w-34 aspect-square cursor-pointer group transition-transform hover:scale-105 duration-200"
                title={`${chargerProduct.name} - ৳${(chargerProduct.price || 0).toLocaleString()}`}
              >
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <ProductImage
                    src={chargerProduct.main_image}
                    alt={chargerProduct.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    className="drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {/* Clean Neutral Pedestal Stage */}
            <div className="absolute -bottom-1 w-[90%] sm:w-[94%] h-16 sm:h-20 pointer-events-none z-0">
              <div className="w-full h-10 sm:h-12 rounded-[50%/40%] bg-slate-100 border border-slate-200 shadow-sm" />
              <div className="w-full h-6 sm:h-8 -mt-5 sm:-mt-6 rounded-b-2xl bg-slate-200/80 border-x border-b border-slate-300/70" />
            </div>

          </div>

        </div>

        {/* 3. RIGHT COLUMN: Two Vertically Stacked Clean Cards */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3.5 sm:gap-4">

          {/* Card A: Up to 50% OFF On Top Brands */}
          <div
            onClick={() => handleOpenProduct(headphonesProduct)}
            className="flex-1 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-xs transition-colors group cursor-pointer"
          >
            <div className="flex flex-col justify-between h-full pr-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  {t("Curated Value", "বিশেষ অফার")}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight block mt-0.5">
                  50% OFF
                </span>
                <span className="text-xs font-medium text-slate-600 block mt-1">
                  {t("On Top Brands", "সেরা ব্র্যান্ডে")}
                </span>
              </div>

              <div className="pt-3">
                <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#185ADB] group-hover:bg-[#185ADB] group-hover:text-white transition-colors shadow-xs">
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
                  className="group-hover:scale-105 transition-transform duration-200 drop-shadow-sm"
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
            className="flex-1 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl p-4 sm:p-5 flex items-center justify-between shadow-xs transition-colors group cursor-pointer"
          >
            <div className="flex flex-col justify-between h-full pr-2">
              <div>
                <span className="text-sm font-bold text-slate-900 leading-snug block">
                  {t("Fast & Reliable", "দ্রুত ও নিশ্চিত")}
                </span>
                <span className="text-sm font-bold text-slate-900 leading-snug block">
                  {t("Delivery", "হোম ডেলিভারি")}
                </span>
                <span className="text-xs font-medium text-slate-600 block mt-1">
                  {t("Across 64 Districts", "৬৪ জেলায়")}
                </span>
              </div>

              <div className="pt-3">
                <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#185ADB] group-hover:bg-[#185ADB] group-hover:text-white transition-colors shadow-xs">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* 3D Delivery Truck Graphic */}
            <div className="w-24 h-18 sm:w-28 sm:h-20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform duration-200">
              <AzraqDeliveryTruck className="w-full h-full" />
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
