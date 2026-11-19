import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, RotateCcw, Heart, ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';
import { AzraqBrandSymbol } from './AzraqLogo';

/**
 * AZRAQ Shop — Futuristic Icy-Blue Glassmorphic Hero Showcase
 * 
 * Replicates the reference design's visual language:
 * - Large crystal glass container with 32px rounded corners and luminous icy-blue atmosphere.
 * - Glowing status pill: "AVAILABLE FOR DISPATCH • VERIFIED INVENTORY"
 * - Striking typography with futuristic styling, balanced negative space, and deep navy tones (#193B5B).
 * - Primary Action: Glowing icy-blue gradient pill button with arrow.
 * - Secondary Action: Translucent frosted glass pill button.
 * - Showcase Image Area: Flagship product in crystal glass frame with 100% contain image visibility,
 *   accompanied by a circular holographic crystal seal ("AUTHENTIC RETAIL • 100% VERIFIED").
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const {
    products,
    favorites,
    toggleFavorite,
    addToCart,
    t
  } = useShop();

  // Curated authentic catalog products for the showcase
  const flagshipProduct = products.find(p => p.id === 'AZQ-0009') || products[0];
  const companionOne = products.find(p => p.id === 'AZQ-0043') || products[1];
  const companionTwo = products.find(p => p.id === 'AZQ-0010') || products[2];

  const isFlagshipFav = flagshipProduct ? favorites.includes(flagshipProduct.id) : false;

  const handleOpenProduct = (p) => {
    if (!p) return;
    navigate(`/product/${generateProductSlug(p)}`);
  };

  return (
    <section className="w-full select-none flex flex-col gap-0 border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_48px_-12px_rgba(112,200,237,0.15),0_4px_16px_-2px_rgba(25,59,91,0.04)] overflow-hidden transition-all">

      {/* 1. TOP TICKER / STATUS PILL BAR */}
      <div className="px-6 sm:px-8 py-3 border-b border-[rgba(130,170,205,0.18)] bg-white/40 backdrop-blur-md flex items-center justify-between text-xs text-[#718398]">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[rgba(130,170,205,0.25)] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#70C8ED] shadow-[0_0_8px_#70C8ED] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#193B5B] font-bold">
              {t("AVAILABLE FOR DISPATCH", "সরাসরি ডেলিভারি উপযোগী")}
            </span>
          </div>
          <span className="hidden sm:inline text-[#82AACD]/40">|</span>
          <span className="hidden sm:inline font-medium text-[#718398]">
            {t("Direct Import • 1,200+ Verified Lifestyle Goods", "১২০০+ আসল পণ্যের ভেরিফাইড রিটেইল ক্যাটালগ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#193B5B] text-[10px] tracking-wider uppercase font-mono">
            {t("100% Genuine Catalog", "১০০% আসল পণ্য")}
          </span>
        </div>
      </div>

      {/* 2. MAIN HERO COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(130,170,205,0.2)]">

        {/* LEFT SECTION: Brand Identity & Merchandising (col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white/50 backdrop-blur-xl">
          <div className="space-y-4 sm:space-y-6">
            
            {/* Small pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.3)] shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#0877C9]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#193B5B] font-bold">
                {t("AZRAQ STOREFRONT • DHAKA, BD", "আজরাক স্টোরফ্রন্ট • ঢাকা")}
              </span>
            </div>

            {/* Futuristic Headline */}
            <div>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#193B5B] leading-[1.05] uppercase">
                <span className="bg-gradient-to-b from-[#193B5B] via-[#245BDB] to-[#193B5B] bg-clip-text text-transparent drop-shadow-xs">
                  AZRAQ
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-[#0877C9] mt-2 tracking-wide">
                {t("Everyday Objects & Curated Electronics", "দৈনন্দিন লাইফস্টাইল ও কিউরেটেড গ্যাজেটস")}
              </p>
            </div>

            <p className="text-xs sm:text-[13px] text-[#718398] leading-relaxed max-w-md">
              {t(
                "A distinctive collection of genuine electronics, home appliances, kitchen tools, and lifestyle accessories — transparently priced in BDT and fulfilled directly across Bangladesh.",
                "আসল গ্যাজেটস, হোম অ্যাপ্লায়েন্স ও দৈনন্দিন লাইফস্টাইল পণ্য। স্বচ্ছ মূল্য, দ্রুততম ক্যাশ অন ডেলিভারি ও সহজ রিটার্ন।"
              )}
            </p>

            {/* Direct Merchandising Highlights (Translucent Glass Pills) */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-3 py-1.5 bg-white/75 backdrop-blur-md border border-[rgba(130,170,205,0.25)] rounded-full text-[#193B5B] font-semibold shadow-xs">
                {t("৳80 Inside Dhaka", "ঢাকা ৮০৳")}
              </span>
              <span className="px-3 py-1.5 bg-white/75 backdrop-blur-md border border-[rgba(130,170,205,0.25)] rounded-full text-[#193B5B] font-semibold shadow-xs">
                {t("৳150 Nationwide", "সারাদেশে ১৫০৳")}
              </span>
              <span className="px-3 py-1.5 bg-[#DDEEFF]/80 backdrop-blur-md border border-[#70C8ED]/40 rounded-full text-[#193B5B] font-bold shadow-xs">
                {t("Free Delivery > ৳3,000", "৩০০০৳+ অর্ডারে ফ্রি ডেলিভারি")}
              </span>
            </div>
          </div>

          {/* Action Triggers (Reference style buttons) */}
          <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary: Glowing Icy-Blue Gradient Pill */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('all-products') || document.getElementById('popular-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white text-xs sm:text-[13px] font-bold rounded-full transition-all flex items-center justify-center gap-2 active:scale-98 shadow-[0_8px_24px_rgba(112,200,237,0.45)] hover:shadow-[0_12px_32px_rgba(112,200,237,0.6)] cursor-pointer"
            >
              <span>{t("Browse Catalogue", "সকল পণ্য দেখুন")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Secondary: Translucent Glass Pill */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('browse-categories') || document.getElementById('shop-by-collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-white/75 hover:bg-white text-[#193B5B] hover:text-[#0877C9] border border-[rgba(130,170,205,0.32)] hover:border-[#70C8ED] text-xs sm:text-[13px] font-bold rounded-full transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-xs cursor-pointer"
            >
              <span>{t("Explore Departments", "ক্যাটাগরি দেখুন")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CENTER SECTION: Primary Crystal Photographic Showcase (col-span-4) */}
        {flagshipProduct && (
          <div 
            onClick={() => handleOpenProduct(flagshipProduct)}
            className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between group cursor-pointer hover:bg-white/90 transition-all bg-white/45 backdrop-blur-xl relative"
          >
            {/* Header / Category Pill */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[rgba(130,170,205,0.2)]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#DDEEFF]/60 border border-[rgba(130,170,205,0.25)] text-[10px] font-mono uppercase tracking-[0.14em] text-[#193B5B] font-bold truncate max-w-[200px]">
                {flagshipProduct.category}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(flagshipProduct.id);
                }}
                className="w-8 h-8 rounded-full border border-[rgba(130,170,205,0.3)] bg-white/80 hover:bg-white flex items-center justify-center transition-colors text-[#718398] shadow-xs"
                aria-label="Save to wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isFlagshipFav ? 'fill-[#E53935] text-[#E53935]' : ''}`} />
              </button>
            </div>

            {/* Generous Crystal Product Photograph Viewer (Strictly Contain) */}
            <div className="relative w-full aspect-square my-2 p-4 flex items-center justify-center bg-white/75 backdrop-blur-md border border-[rgba(130,170,205,0.25)] rounded-[24px] overflow-hidden shadow-inner">
              <div className="card-image-wrapper w-full h-full">
                <ProductImage
                  src={flagshipProduct.main_image}
                  alt={flagshipProduct.name}
                  fit="contain"
                  aspectRatio="square"
                  priority={true}
                  className="group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              {/* Holographic Crystal Seal Badge (Reference style circular badge) */}
              <div className="absolute bottom-3 right-3 w-16 h-16 rounded-full crystal-badge-ring flex flex-col items-center justify-center pointer-events-none p-1 text-center bg-white/70 backdrop-blur-md">
                <AzraqBrandSymbol size="xs" className="w-4 h-4 opacity-90" />
                <span className="text-[7px] font-mono uppercase font-bold text-[#193B5B] leading-none mt-0.5">
                  VERIFIED
                </span>
              </div>
            </div>

            {/* Product Meta & Pricing */}
            <div className="pt-3">
              <span className="text-[10px] font-mono text-[#718398] block uppercase">
                SKU: {flagshipProduct.sku || flagshipProduct.id}
              </span>
              <h2 className="text-sm font-bold text-[#193B5B] group-hover:text-[#0877C9] transition-colors line-clamp-2 leading-snug mt-1 min-h-[2.5rem]">
                {flagshipProduct.name}
              </h2>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[rgba(130,170,205,0.2)]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#718398] block">BDT</span>
                  <span className="text-xl font-extrabold text-[#193B5B]">
                    ৳{(flagshipProduct.price || 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0877C9] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t("View Details", "বিস্তারিত")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SECTION: Secondary Companion Stack (col-span-3) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 divide-y sm:divide-y-0 lg:divide-y divide-[rgba(130,170,205,0.2)] bg-white/35 backdrop-blur-xl">
          {[companionOne, companionTwo].filter(Boolean).map((prod) => (
            <div
              key={prod.id}
              onClick={() => handleOpenProduct(prod)}
              className="p-5 flex flex-col justify-between group cursor-pointer hover:bg-white/90 transition-all"
            >
              <div className="card-image-wrapper w-full aspect-[4/3] bg-white/75 backdrop-blur-md border border-[rgba(130,170,205,0.25)] rounded-[18px] p-2.5 flex items-center justify-center overflow-hidden mb-2.5 shadow-xs">
                <ProductImage
                  src={prod.main_image}
                  alt={prod.name}
                  fit="contain"
                  aspectRatio="square"
                  className="group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              <div>
                <span className="text-[9px] font-mono text-[#0877C9] uppercase tracking-wider block truncate font-bold">
                  {prod.category}
                </span>
                <h3 className="text-xs font-bold text-[#193B5B] line-clamp-1 group-hover:text-[#0877C9] transition-colors mt-0.5">
                  {prod.name}
                </h3>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[rgba(130,170,205,0.2)]">
                  <span className="text-xs font-extrabold text-[#193B5B]">
                    ৳{(prod.price || 0).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, prod.variants?.[0] || 'Standard', 1);
                    }}
                    className="p-2 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white transition-all shadow-xs cursor-pointer"
                    title={t("Add to Bag", "ব্যাগে যোগ করুন")}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. INTEGRATED CUSTOMER GUARANTEE STRIP */}
      <div className="border-t border-[rgba(130,170,205,0.2)] bg-white/45 backdrop-blur-xl px-6 sm:px-8 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs divide-y sm:divide-y-0 divide-[rgba(130,170,205,0.18)]">

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-9 h-9 rounded-full bg-white/80 text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-xs flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#193B5B] leading-tight truncate">{t('Nationwide Delivery', 'সারাদেশে ডেলিভারি')}</p>
            <p className="text-[11px] text-[#718398] truncate mt-0.5">{t('৳80 Dhaka / ৳150 Outside', 'ঢাকা ৮০৳ / বাইরে ১৫০৳')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-9 h-9 rounded-full bg-white/80 text-emerald-600 border border-[rgba(130,170,205,0.3)] shadow-xs flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#193B5B] leading-tight truncate">{t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}</p>
            <p className="text-[11px] text-[#718398] truncate mt-0.5">{t('Pay upon parcel inspection', 'পণ্য দেখে মূল্য পরিশোধ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-9 h-9 rounded-full bg-white/80 text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-xs flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#193B5B] leading-tight truncate">{t('Secure Payments', 'নিরাপদ ডিজিটাল পেমেন্ট')}</p>
            <p className="text-[11px] text-[#718398] truncate mt-0.5">{t('bKash, Nagad & Cards', 'বিকাশ, নগদ ও কার্ড')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-9 h-9 rounded-full bg-white/80 text-[#193B5B] border border-[rgba(130,170,205,0.3)] shadow-xs flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#193B5B] leading-tight truncate">{t('7-Day Replacement', '৭ দিনের রিপ্লেসমেন্ট')}</p>
            <p className="text-[11px] text-[#718398] truncate mt-0.5">{t('Straightforward exchange', 'সহজ রিটার্ন পলিসি')}</p>
          </div>
        </div>

      </div>

    </section>
  );
}
