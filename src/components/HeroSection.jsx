import React from 'react';
import { ArrowRight, Truck, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Professional Retail E-Commerce Hero Banner
 * 
 * Shopee-inspired retail layout:
 * - 2/3 Main Promotional Banner on left showcasing authentic catalog products.
 * - 1/3 Stacked Promotional Banners on right with direct category shortcuts.
 * - 4-Column Service Guarantee Strip below the banners.
 */
export default function HeroSection() {
  const { products, collections, navigateTo, t } = useShop();

  // Authentic catalog products for promotional display
  const heroProduct = products.find(p => p.id === 'AZQ-0001') || products[0];
  const sideProduct1 = products.find(p => p.id === 'AZQ-0009' || p.id === 'AZQ-0035') || products[1];
  const sideProduct2 = products.find(p => p.id === 'AZQ-0043' || p.id === 'AZQ-0049') || products[2];

  return (
    <section className="w-full select-none flex flex-col gap-3">
      
      {/* 1. TOP BANNER GRID (2/3 Main Banner + 1/3 Stacked Banners) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch w-full">

        {/* Left: 2/3 Main Promotional Banner (lg:col-span-8) */}
        <div className="lg:col-span-8 rounded-[4px] bg-[#FFFFFF] border border-gray-200 p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[300px] sm:min-h-[340px] shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative z-10 w-full flex-1">
            
            {/* Banner Text Content */}
            <div className="md:col-span-7 flex flex-col items-start gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0877C9] bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-100">
                {t('AZRAQ Official Store', 'আজরাক অফিসিয়াল স্টোর')}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#212121] tracking-tight leading-tight">
                {t('Curated Everyday Goods & Gadgets', 'কিউরেটেড এভরিডে গুডস ও গ্যাজেটস')}
              </h1>

              <p className="text-xs sm:text-sm text-[#757575] max-w-md leading-relaxed">
                {t(
                  'Authentic products with verified specifications, transparent BDT pricing, and fast nationwide delivery.',
                  'আসল পণ্যের নিশ্চয়তা, বিডিটি (৳) মূল্য এবং সারা দেশে ক্যাশ অন ডেলিভারি।'
                )}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('all-products') || document.getElementById('popular-products');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-[3px] bg-[#0877C9] hover:bg-[#0665AC] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs transition-colors"
                >
                  <span>{t('Shop Now', 'এখনই কিনুন')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('collections')}
                  className="px-4 py-2.5 rounded-[3px] border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm font-semibold text-[#212121] transition-colors"
                >
                  {t('All 18 Collections', '১৮টি কালেকশন')}
                </button>
              </div>
            </div>

            {/* Banner Product Photography */}
            <div className="md:col-span-5 relative flex items-center justify-center min-h-[200px]">
              <div className="w-full max-w-[240px] h-[200px] sm:h-[230px] flex items-center justify-center bg-gray-50/50 rounded-[4px] p-2 border border-gray-100">
                <img
                  src={heroProduct?.main_image || "https://easydrop.asia/products/image-1794224164356-135288231.jpeg"}
                  alt={heroProduct?.name || "Featured Product"}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right: 1/3 Two Stacked Category Promo Cards (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">

          {/* Top Right Promo Card */}
          <div
            onClick={() => navigateTo('collections')}
            className="flex-1 rounded-[4px] bg-[#FFFFFF] border border-gray-200 p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#0877C9] transition-all group shadow-xs"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0877C9] block mb-1">
                {t('Smart Tech', 'স্মার্ট গ্যাজেটস')}
              </span>
              <h3 className="text-sm font-bold text-[#212121] leading-snug group-hover:text-[#0877C9] transition-colors">
                {sideProduct1?.name ? sideProduct1.name.slice(0, 32) : t('Gadgets & Audio', 'গ্যাজেটস ও অডিও')}
              </h3>
              <p className="text-xs text-[#0877C9] font-bold mt-1">
                ৳{(sideProduct1?.price || 650).toLocaleString()} BDT
              </p>
            </div>
            <div className="w-20 h-20 shrink-0 rounded-[3px] bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
              <img
                src={sideProduct1?.main_image || "https://easydrop.asia/products/image-1794224164356-135288231.jpeg"}
                alt=""
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Bottom Right Promo Card */}
          <div
            onClick={() => navigateTo('collections')}
            className="flex-1 rounded-[4px] bg-[#FFFFFF] border border-gray-200 p-4 flex items-center justify-between gap-3 cursor-pointer hover:border-[#0877C9] transition-all group shadow-xs"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#EE4D2D] block mb-1">
                {t('Lifestyle Picks', 'লাইফস্টাইল')}
              </span>
              <h3 className="text-sm font-bold text-[#212121] leading-snug group-hover:text-[#0877C9] transition-colors">
                {sideProduct2?.name ? sideProduct2.name.slice(0, 32) : t('Home & Living', 'হোম ও লিভিং')}
              </h3>
              <p className="text-xs text-[#0877C9] font-bold mt-1">
                ৳{(sideProduct2?.price || 1200).toLocaleString()} BDT
              </p>
            </div>
            <div className="w-20 h-20 shrink-0 rounded-[3px] bg-gray-50 border border-gray-100 p-1 flex items-center justify-center">
              <img
                src={sideProduct2?.main_image || "https://easydrop.asia/products/image-1794224164356-135288231.jpeg"}
                alt=""
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

        </div>

      </div>

      {/* 2. SHOPEE-STYLE 4-COLUMN SERVICE GUARANTEE STRIP */}
      <div className="rounded-[4px] bg-white border border-gray-200 px-4 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs shadow-2xs">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-blue-50 text-[#0877C9] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#212121]">{t('Nationwide Delivery', 'সারাদেশে ডেলিভারি')}</p>
            <p className="text-[11px] text-[#757575]">{t('৳70 Dhaka / ৳130 Outside', 'ঢাকা ৭০৳ / বাইরে ১৩০৳')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#212121]">{t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}</p>
            <p className="text-[11px] text-[#757575]">{t('Pay upon receiving goods', 'পণ্য বুঝে নিয়ে মূল্য দিন')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-blue-50 text-[#0877C9] flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#212121]">{t('Secure Payments', 'নিরাপদ পেমেন্ট')}</p>
            <p className="text-[11px] text-[#757575]">{t('bKash, Nagad, Cards via Paymently', 'বিকাশ, নগদ ও কার্ড পেমেন্টলি')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[3px] bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#212121]">{t('7-Day Returns', '৭ দিনের রিটার্ন')}</p>
            <p className="text-[11px] text-[#757575]">{t('Verified policy on defects', 'সহজ রিটার্ন পলিসি')}</p>
          </div>
        </div>

      </div>

    </section>
  );
}