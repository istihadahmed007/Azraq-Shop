import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, RotateCcw, Heart, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — The Modern Everyday Edit Hero Showcase
 * 
 * Asymmetric editorial composition:
 * - Left column:
 *   - Campaign label: THE EVERYDAY EDIT (Soft Lime #D7ED78)
 *   - Headline: "Better choices. Everyday living."
 *   - Editorial statement & verified delivery rates
 *   - Primary CTA ("Explore Collection") & Secondary CTA ("Shop Now")
 * - Right column:
 *   - Flagship authentic product photograph (AZQ-0001) in pure white square-edged showcase
 *   - Balanced secondary editorial product cards (AZQ-0002, AZQ-0003)
 * - Service guarantee strip: Inside Dhaka ৳80, Outside Dhaka ৳150, COD, Paymently, 7-day returns
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const {
    products,
    favorites,
    toggleFavorite,
    addToCart,
    navigateTo,
    t
  } = useShop();

  // Authentic catalog products for the editorial showcase
  const featuredProduct = products.find(p => p.id === 'AZQ-0001') || products[0];
  const secondaryProducts = products.filter(p => p.id !== (featuredProduct?.id)).slice(0, 2);

  const isHeroFav = featuredProduct ? favorites.includes(featuredProduct.id) : false;

  const handleOpenProduct = (p) => {
    if (!p) return;
    navigate(`/product/${generateProductSlug(p)}`);
  };

  return (
    <section className="w-full select-none flex flex-col gap-6">

      {/* 1. ASYMMETRIC EDITORIAL HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">

        {/* LEFT SECTION: lg:col-span-6 — Editorial Campaign Statement */}
        <div className="lg:col-span-6 rounded-[16px] bg-white border border-[#E5E3DA] p-6 sm:p-8 lg:p-10 shadow-[0_4px_20px_rgba(23,35,51,0.04)] flex flex-col justify-between relative overflow-hidden">
          
          <div className="flex flex-col gap-5 relative z-10">
            {/* Campaign Pill Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#D7ED78] text-[#172333] text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#172333]" />
                <span>THE EVERYDAY EDIT</span>
              </span>
              <span className="text-xs text-[#667085] font-medium hidden sm:inline">
                • {t("Issue 2026", "সংস্করণ ২০২৬")}
              </span>
            </div>

            {/* Editorial Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172333] tracking-tight leading-[1.15]">
                {t("Better choices.", "সেরা পছন্দ।")}<br />
                <span className="text-[#245BDB]">{t("Everyday living.", "সহজ জীবন।")}</span>
              </h1>
              <p className="text-sm sm:text-base text-[#667085] leading-relaxed mt-3 max-w-lg">
                {t(
                  "Curated lifestyle essentials, authentic electronics, everyday kitchenware and accessories — verified for genuine quality and delivered fast across Bangladesh.",
                  "বাছাইকৃত গ্যাজেটস, লাইফস্টাইল ও গৃহস্থালি পণ্য। আসল পণ্যের নিশ্চয়তা ও দ্রুততম হোম ডেলিভারি।"
                )}
              </p>
            </div>

            {/* Delivery Highlights Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#172333]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t("Dhaka ৳80", "ঢাকা ৮০৳")}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{t("Outside Dhaka ৳150", "ঢাকার বাইরে ১৫০৳")}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#FAF9F5] border border-[#E5E3DA] font-semibold text-[#667085]">
                <span>{t("1,200+ Products", "১২০০+ পণ্য")}</span>
              </div>
            </div>
          </div>

          {/* Action Row: Dual CTAs */}
          <div className="flex items-center gap-3.5 pt-8 mt-4 border-t border-[#E5E3DA] relative z-10 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('shop-by-collection') || document.getElementById('browse-categories');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-[8px] bg-[#245BDB] hover:bg-[#1C4BB8] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <span>{t("Explore Collection", "কালেকশন দেখুন")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('all-products') || document.getElementById('popular-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-[8px] bg-[#172333] hover:bg-[#245BDB] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <span>{t("Shop Now", "এখনই কেনাকাটা")}</span>
            </button>
          </div>

        </div>

        {/* RIGHT SECTION: lg:col-span-6 — Photographic Showcase Grid */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4">

          {/* Primary Featured Product Panel (sm:col-span-7) */}
          <div 
            onClick={() => handleOpenProduct(featuredProduct)}
            className="sm:col-span-7 rounded-[16px] bg-white border border-[#E5E3DA] p-5 shadow-[0_4px_20px_rgba(23,35,51,0.04)] flex flex-col justify-between group cursor-pointer hover:border-[#245BDB] transition-all"
          >
            {/* Top Tag & Wishlist */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider truncate">
                {featuredProduct?.category || t("Spotlight", "স্পটলাইট")}
              </span>
              {featuredProduct && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(featuredProduct.id);
                  }}
                  className={`w-8 h-8 rounded-[6px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] flex items-center justify-center transition-colors ${
                    isHeroFav ? 'text-[#E53935]' : 'text-[#667085] hover:text-[#E53935]'
                  }`}
                  aria-label="Wishlist featured product"
                >
                  <Heart className={`w-3.5 h-3.5 ${isHeroFav ? 'fill-[#E53935] stroke-[#E53935]' : ''}`} />
                </button>
              )}
            </div>

            {/* Edge-to-Edge Authentic Photograph Container */}
            <div className="w-full aspect-square rounded-[10px] bg-[#FAF9F5] border border-[#E5E3DA] overflow-hidden p-3 flex items-center justify-center mb-4">
              <ProductImage
                src={featuredProduct?.main_image}
                alt={featuredProduct?.name || "Featured Product"}
                fit="contain"
                aspectRatio="square"
                priority={true}
                className="group-hover:scale-104 transition-transform duration-300"
              />
            </div>

            {/* Product Meta */}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#172333] group-hover:text-[#245BDB] transition-colors line-clamp-2 leading-snug min-h-[2.4rem]">
                {featuredProduct?.name}
              </h2>
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E5E3DA]">
                <div>
                  <span className="text-[10px] text-[#667085] block uppercase font-semibold">{t("Price", "মূল্য")}</span>
                  <span className="text-lg font-extrabold text-[#245BDB]">
                    ৳{(featuredProduct?.price || 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#172333] group-hover:text-[#245BDB] flex items-center gap-1 transition-colors">
                  <span>{t("View Details", "বিস্তারিত")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Stacked Product Panels (sm:col-span-5) */}
          <div className="sm:col-span-5 flex flex-col gap-4">
            {secondaryProducts.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => handleOpenProduct(p)}
                className="flex-1 rounded-[16px] bg-white border border-[#E5E3DA] p-4 shadow-[0_4px_20px_rgba(23,35,51,0.04)] flex flex-col justify-between group cursor-pointer hover:border-[#245BDB] transition-all"
              >
                <div className="w-full aspect-[4/3] rounded-[8px] bg-[#FAF9F5] border border-[#E5E3DA] overflow-hidden p-2 flex items-center justify-center mb-2.5">
                  <ProductImage
                    src={p.main_image}
                    alt={p.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={idx === 0}
                    className="group-hover:scale-104 transition-transform duration-300"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block truncate font-medium">
                    {p.category}
                  </span>
                  <h3 className="text-xs font-bold text-[#172333] line-clamp-1 group-hover:text-[#245BDB] transition-colors mt-0.5">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-[#E5E3DA]">
                    <span className="text-xs font-extrabold text-[#245BDB]">
                      ৳{(p.price || 0).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p, p.variants?.[0] || 'Standard', 1);
                      }}
                      className="p-1.5 rounded-[6px] bg-[#172333] hover:bg-[#245BDB] text-white transition-colors"
                      title={t("Add to Bag", "ব্যাগে যোগ করুন")}
                    >
                      <ShoppingBag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 2. RESTRAINED 4-COLUMN TRUST & SERVICE STRIP */}
      <div className="rounded-[14px] bg-white border border-[#E5E3DA] px-5 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs shadow-[0_2px_10px_rgba(23,35,51,0.03)]">

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('Nationwide Delivery', 'সারাদেশে ডেলিভারি')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('৳80 Dhaka / ৳150 Outside', 'ঢাকা ৮০৳ / বাইরে ১৫০৳')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] text-emerald-600 border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('Pay upon receiving parcel', 'পণ্য দেখে মূল্য পরিশোধ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('Secure Payments', 'নিরাপদ পেমেন্ট')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('bKash, Nagad, Cards via Paymently', 'বিকাশ, নগদ ও কার্ড পেমেন্টলি')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] text-[#172333] border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('7-Day Returns', '৭ দিনের রিটার্ন')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('Verified replacement policy', 'সহজ রিটার্ন পলিসি')}</p>
          </div>
        </div>

      </div>

    </section>
  );
}
