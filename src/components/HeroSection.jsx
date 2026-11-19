import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, RotateCcw, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Art-Directed Editorial Hero Showcase
 * 
 * Inspired by contemporary Japanese and independent European lifestyle retail:
 * - Architectural layout with crisp hairline framing (#E5E3DA).
 * - Restrained editorial typography: "Everyday objects, thoughtfully chosen."
 * - Large, prominent authentic catalog photography with edge-to-edge breathing room.
 * - Asymmetric merchandising featuring 3 curated catalog pieces.
 * - Integrated, seamless customer guarantee strip without floating card noise.
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

  // Curated authentic catalog products for the editorial showcase
  // 1. Standout flagship product (Awei Overhead Earphone or Baseus Box)
  const flagshipProduct = products.find(p => p.id === 'AZQ-0009') || products[0];
  // 2. Companion pieces from distinct categories (Console, Diffuser)
  const companionOne = products.find(p => p.id === 'AZQ-0043') || products[1];
  const companionTwo = products.find(p => p.id === 'AZQ-0010') || products[2];

  const isFlagshipFav = flagshipProduct ? favorites.includes(flagshipProduct.id) : false;

  const handleOpenProduct = (p) => {
    if (!p) return;
    navigate(`/product/${generateProductSlug(p)}`);
  };

  return (
    <section className="w-full select-none flex flex-col gap-0 border border-[#E5E3DA] bg-white rounded-[6px] shadow-[0_1px_3px_rgba(23,35,51,0.03)] overflow-hidden">

      {/* 1. EDITORIAL TOP TICKER / CAMPAIGN RUNNER */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-2.5 border-b border-[#E5E3DA] bg-[#FAF9F5] text-[11px] text-[#667085]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold text-[#172333] uppercase tracking-[0.16em]">
            AZRAQ / STOREFRONT 2026
          </span>
          <span className="hidden sm:inline text-[#E5E3DA]">|</span>
          <span className="hidden sm:inline font-medium text-[#172333]">
            {t("Verified Catalog of 1,200+ Everyday Lifestyle Goods", "১২০০+ আসল পণ্যের ভেরিফাইড রিটেইল ক্যাটালগ")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#245BDB]" />
          <span className="font-semibold text-[#172333] text-[10px] tracking-wider uppercase">
            {t("Authentic Inventory", "আসল পণ্য")}
          </span>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL SHOWCASE COMPOSITION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E3DA]">

        {/* LEFT / LEAD SECTION: Headline, Identity & Merchandising Statement (col-span-5) */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-4 sm:space-y-6">
            <span className="inline-block text-[11px] font-mono uppercase tracking-[0.18em] text-[#667085] font-semibold">
              {t("CURATED RETAIL • DHAKA, BD", "বাছাইকৃত রিটেইল • ঢাকা")}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#172333] tracking-tight leading-[1.12]">
              {t("Everyday objects,", "দৈনন্দিন পণ্য,")}<br />
              <span className="text-[#245BDB]">{t("thoughtfully chosen.", "যাচাইকৃত মান।")}</span>
            </h1>

            <p className="text-xs sm:text-[13px] text-[#556170] leading-relaxed max-w-md">
              {t(
                "A distinctive collection of genuine electronics, home appliances, kitchen tools, and lifestyle accessories — transparently priced in BDT and fulfilled directly across Bangladesh.",
                "আসল গ্যাজেটস, হোম অ্যাপ্লায়েন্স ও দৈনন্দিন লাইফস্টাইল পণ্য। স্বচ্ছ মূল্য, দ্রুততম ক্যাশ অন ডেলিভারি ও সহজ রিটার্ন।"
              )}
            </p>

            {/* Direct Merchandising Highlights */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-[#FAF9F5] border border-[#E5E3DA] rounded-[3px] text-[#172333] font-medium">
                {t("৳80 Inside Dhaka", "ঢাকা ৮০৳")}
              </span>
              <span className="px-2.5 py-1 bg-[#FAF9F5] border border-[#E5E3DA] rounded-[3px] text-[#172333] font-medium">
                {t("৳150 Nationwide", "সারাদেশে ১৫০৳")}
              </span>
              <span className="px-2.5 py-1 bg-[#FAF9F5] border border-[#E5E3DA] rounded-[3px] text-[#245BDB] font-semibold">
                {t("Free Delivery > ৳3,000", "৩০০০৳+ অর্ডারে ফ্রি ডেলিভারি")}
              </span>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('all-products') || document.getElementById('popular-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-[#172333] hover:bg-[#245BDB] text-white text-xs sm:text-[13px] font-semibold rounded-[4px] transition-colors flex items-center justify-center gap-2 active:scale-98 shadow-xs"
            >
              <span>{t("Browse Catalogue", "সকল পণ্য দেখুন")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('browse-categories') || document.getElementById('shop-by-collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-[#FAF9F5] hover:bg-white text-[#172333] hover:text-[#245BDB] border border-[#E5E3DA] hover:border-[#172333] text-xs sm:text-[13px] font-semibold rounded-[4px] transition-colors flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>{t("Explore Departments", "ক্যাটাগরি দেখুন")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CENTER / PRIMARY PHOTOGRAPHIC SPOTLIGHT (col-span-4) */}
        {flagshipProduct && (
          <div 
            onClick={() => handleOpenProduct(flagshipProduct)}
            className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between group cursor-pointer hover:bg-[#FAF9F5]/60 transition-colors bg-white relative"
          >
            {/* Header / Meta */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E5E3DA]">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#667085] font-semibold truncate max-w-[200px]">
                {flagshipProduct.category}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(flagshipProduct.id);
                }}
                className="w-7 h-7 rounded-[3px] border border-[#E5E3DA] bg-white hover:border-[#172333] flex items-center justify-center transition-colors text-[#667085]"
                aria-label="Save to wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isFlagshipFav ? 'fill-[#E53935] text-[#E53935]' : ''}`} />
              </button>
            </div>

            {/* Generous Authentic Product Photograph Viewer */}
            <div className="w-full aspect-square my-2 p-4 flex items-center justify-center bg-[#FAF9F5] border border-[#E5E3DA] rounded-[4px] overflow-hidden">
              <ProductImage
                src={flagshipProduct.main_image}
                alt={flagshipProduct.name}
                fit="contain"
                aspectRatio="square"
                priority={true}
                className="group-hover:scale-104 transition-transform duration-300"
              />
            </div>

            {/* Product Meta & Pricing */}
            <div className="pt-3">
              <span className="text-[10px] font-mono text-[#8C99A8] block uppercase">
                SKU: {flagshipProduct.sku || flagshipProduct.id}
              </span>
              <h2 className="text-sm font-bold text-[#172333] group-hover:text-[#245BDB] transition-colors line-clamp-2 leading-snug mt-1 min-h-[2.5rem]">
                {flagshipProduct.name}
              </h2>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#E5E3DA]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8C99A8] block">BDT</span>
                  <span className="text-lg font-bold text-[#172333]">
                    ৳{(flagshipProduct.price || 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#245BDB] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{t("View Details", "বিস্তারিত")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT / SECONDARY COMPANION STACK (col-span-3) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 divide-y sm:divide-y-0 lg:divide-y divide-[#E5E3DA] bg-[#FAF9F5]/40">
          {[companionOne, companionTwo].filter(Boolean).map((prod) => (
            <div
              key={prod.id}
              onClick={() => handleOpenProduct(prod)}
              className="p-5 flex flex-col justify-between group cursor-pointer hover:bg-white transition-colors"
            >
              <div className="w-full aspect-[4/3] bg-white border border-[#E5E3DA] rounded-[3px] p-2 flex items-center justify-center overflow-hidden mb-2.5">
                <ProductImage
                  src={prod.main_image}
                  alt={prod.name}
                  fit="contain"
                  aspectRatio="square"
                  className="group-hover:scale-104 transition-transform duration-300"
                />
              </div>

              <div>
                <span className="text-[9px] font-mono text-[#8C99A8] uppercase tracking-wider block truncate">
                  {prod.category}
                </span>
                <h3 className="text-xs font-semibold text-[#172333] line-clamp-1 group-hover:text-[#245BDB] transition-colors mt-0.5">
                  {prod.name}
                </h3>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#E5E3DA]">
                  <span className="text-xs font-bold text-[#172333]">
                    ৳{(prod.price || 0).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod, prod.variants?.[0] || 'Standard', 1);
                    }}
                    className="p-1.5 rounded-[3px] bg-[#172333] hover:bg-[#245BDB] text-white transition-colors"
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

      {/* 3. INTEGRATED CUSTOMER GUARANTEE STRIP */}
      <div className="border-t border-[#E5E3DA] bg-[#FAF9F5] px-5 sm:px-8 py-3.5 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs divide-y sm:divide-y-0 divide-[#E5E3DA]">

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-[3px] bg-white text-[#172333] border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-[#245BDB]" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('Nationwide Delivery', 'সারাদেশে ডেলিভারি')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('৳80 Dhaka / ৳150 Outside', 'ঢাকা ৮০৳ / বাইরে ১৫০৳')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-[3px] bg-white text-emerald-700 border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('Pay upon parcel inspection', 'পণ্য দেখে মূল্য পরিশোধ')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-[3px] bg-white text-[#172333] border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-[#245BDB]" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('Secure Payments', 'নিরাপদ ডিজিটাল পেমেন্ট')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('bKash, Nagad & Cards', 'বিকাশ, নগদ ও কার্ড')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-[3px] bg-white text-[#172333] border border-[#E5E3DA] flex items-center justify-center shrink-0">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#172333] leading-tight truncate">{t('7-Day Replacement', '৭ দিনের রিপ্লেসমেন্ট')}</p>
            <p className="text-[11px] text-[#667085] truncate mt-0.5">{t('Straightforward exchange', 'সহজ রিটার্ন পলিসি')}</p>
          </div>
        </div>

      </div>

    </section>
  );
}
