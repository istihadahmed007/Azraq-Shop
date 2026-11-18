import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, RotateCcw, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * AZRAQ Shop — Editorial Asymmetric Bento Hero Showcase
 * 
 * Desktop composition:
 * - Left section (~42% width): One large, high-quality featured product photograph,
 *   product title, factual description, actual retail price in BDT, wishlist control, and prominent Shop Now button.
 * - Right section (~58% width): Bento collection of New Arrivals & Featured products with
 *   clean square product cards, consistent dimensions, and instant add-to-cart interactions.
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const {
    products,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    addToCart,
    navigateTo,
    t
  } = useShop();

  // Authentic catalog products for the editorial showcase
  const featuredProduct = products.find(p => p.id === 'AZQ-0001') || products[0];
  const bentoProducts = products.slice(1, 5);

  const isHeroFav = featuredProduct ? favorites.includes(featuredProduct.id) : false;

  const handleOpenProduct = (p) => {
    if (!p) return;
    navigate(`/product/${generateProductSlug(p)}`);
  };

  return (
    <section className="w-full select-none flex flex-col gap-6">
      
      {/* 1. ASYMMETRIC BENTO SHOWCASE GRID (42% Left + 58% Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">

        {/* LEFT SECTION: ~42% Width (lg:col-span-5) — Large Editorial Feature Panel */}
        <div className="lg:col-span-5 rounded-[28px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-6 sm:p-7 shadow-[0_10px_30px_rgba(50,75,100,0.08)] flex flex-col justify-between relative overflow-hidden group">
          
          {/* Top Metadata Row: Pill Badge + Wishlist Control */}
          <div className="flex items-center justify-between gap-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-xs font-bold text-[#0877C9] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0877C9]" />
              <span>{t('Editorial Spotlight', 'বাছাইকৃত স্পটলাইট')}</span>
            </span>

            {featuredProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(featuredProduct.id);
                }}
                className={`w-9 h-9 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] flex items-center justify-center transition-colors shadow-2xs ${
                  isHeroFav ? 'text-[#EE8056]' : 'text-[#6B7D93] hover:text-[#EE8056]'
                }`}
                title={isHeroFav ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
                aria-label="Wishlist featured product"
              >
                <Heart className={`w-4 h-4 ${isHeroFav ? 'fill-[#EE8056] stroke-[#EE8056]' : ''}`} />
              </button>
            )}
          </div>

          {/* Large Square Product Photograph: Edge-to-Edge Container */}
          <div 
            onClick={() => handleOpenProduct(featuredProduct)}
            className="w-full aspect-square rounded-[22px] overflow-hidden bg-white border border-[#E1EDF7] shadow-inner p-2 my-5 flex items-center justify-center cursor-pointer relative"
          >
            <ProductImage
              src={featuredProduct?.main_image}
              alt={featuredProduct?.name || "Featured Product"}
              fit="contain"
              aspectRatio="square"
              className="p-3 group-hover:scale-104 transition-transform duration-300"
            />
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col gap-3 relative z-10">
            <div>
              <span className="text-[11px] font-bold text-[#6B7D93] uppercase tracking-wider block mb-1">
                {featuredProduct?.category || t('Flagship Technology', 'ফ্ল্যাগশিপ প্রযুক্তি')}
              </span>
              <h1 
                onClick={() => handleOpenProduct(featuredProduct)}
                className="text-xl sm:text-2xl font-bold text-[#293B52] tracking-tight leading-snug hover:text-[#0877C9] cursor-pointer transition-colors"
              >
                {featuredProduct?.name || t('Premium Smart Device', 'প্রিমিয়াম স্মার্ট ডিভাইস')}
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7D93] leading-relaxed line-clamp-2 mt-1">
                {featuredProduct?.description?.slice(0, 110) || t('Authentic certified retail specification, verified durability, and fast nationwide delivery across Bangladesh.', 'আসল পণ্যের নিশ্চয়তা ও দ্রুততম হোম ডেলিভারি।')}
              </p>
            </div>

            {/* Price & Primary CTA Row */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#E1EDF7]">
              <div>
                <span className="text-[10px] text-[#8CA0B6] font-semibold uppercase block">
                  {t('Retail Price', 'খুচরা মূল্য')}
                </span>
                <span className="text-2xl font-extrabold text-[#0877C9] tracking-tight">
                  ৳{(featuredProduct?.price || 0).toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenProduct(featuredProduct)}
                className="px-6 py-3 rounded-full bg-[#0877C9] hover:bg-[#0665AC] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>{t('Shop Now', 'এখনই অর্ডার করুন')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION: ~58% Width (lg:col-span-7) — Bento Grid of New Arrivals & Featured Products */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
          
          {/* Header Row for Bento Showcase */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#293B52] tracking-tight">
                {t('New Arrivals & Trending Tech', 'নতুন আগমন ও ট্রেন্ডিং গ্যাজেটস')}
              </h2>
              <p className="text-xs text-[#6B7D93]">
                {t('Hand-picked authentic gadgets with verified specifications', 'যাচাইকৃত পণ্যের সেরা কালেকশন')}
              </p>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('all-products') || document.getElementById('popular-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#0877C9] hover:text-[#0665AC] flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full bg-[#F7FAFD] border border-[#D5E2EE] shadow-2xs"
            >
              <span>{t('View All', 'সব দেখুন')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2x2 Bento Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {bentoProducts.map((p) => {
              const isFav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenProduct(p)}
                  className="rounded-[22px] bg-[#F7FAFD] border border-[#D5E2EE]/90 p-3.5 sm:p-4 shadow-[0_6px_20px_rgba(50,75,100,0.06)] hover:shadow-[0_12px_28px_rgba(50,75,100,0.11)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  {/* Top Square Image Well */}
                  <div className="w-full aspect-square rounded-[18px] bg-white border border-[#E1EDF7] overflow-hidden relative flex items-center justify-center p-2 mb-3">
                    <ProductImage
                      src={p.main_image}
                      alt={p.name}
                      fit="cover"
                      aspectRatio="square"
                      className="rounded-[14px] group-hover:scale-104 transition-transform duration-300"
                    />

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                      }}
                      className={`absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-[#D5E2EE] flex items-center justify-center transition-colors shadow-2xs ${
                        isFav ? 'text-[#EE8056]' : 'text-[#6B7D93] hover:text-[#EE8056]'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#EE8056] stroke-[#EE8056]' : ''}`} />
                    </button>
                  </div>

                  {/* Information & Action Row */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-[#6B7D93] uppercase tracking-wider block truncate">
                        {p.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold text-[#293B52] line-clamp-2 leading-snug group-hover:text-[#0877C9] transition-colors min-h-[2.4rem]">
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E1EDF7]">
                      <span className="text-sm sm:text-base font-extrabold text-[#0877C9]">
                        ৳{(p.price || 0).toLocaleString()}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p, p.variants?.[0] || 'Standard', 1);
                        }}
                        className="w-8 h-8 rounded-full bg-[#0877C9] hover:bg-[#0665AC] text-white flex items-center justify-center shadow-xs transition-all active:scale-95"
                        title={t("Add to Cart", "ব্যাগে যোগ করুন")}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 2. NEUMORPHIC 4-COLUMN SERVICE GUARANTEE STRIP */}
      <div className="rounded-[24px] bg-[#F7FAFD] border border-[#D5E2EE]/90 px-5 sm:px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs shadow-[0_6px_20px_rgba(50,75,100,0.06)]">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDF4F9] text-[#0877C9] border border-[#D5E2EE] flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#293B52] leading-tight truncate">{t('Nationwide Delivery', 'সারাদেশে ডেলিভারি')}</p>
            <p className="text-[11px] text-[#6B7D93] truncate mt-0.5">{t('৳70 Dhaka / ৳130 Outside', 'ঢাকা ৭০৳ / বাইরে ১৩০৳')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDF4F9] text-emerald-600 border border-[#D5E2EE] flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#293B52] leading-tight truncate">{t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}</p>
            <p className="text-[11px] text-[#6B7D93] truncate mt-0.5">{t('Pay upon receiving goods', 'পণ্য বুঝে নিয়ে মূল্য দিন')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDF4F9] text-[#0877C9] border border-[#D5E2EE] flex items-center justify-center shrink-0 shadow-2xs">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#293B52] leading-tight truncate">{t('Secure Payments', 'নিরাপদ পেমেন্ট')}</p>
            <p className="text-[11px] text-[#6B7D93] truncate mt-0.5">{t('bKash, Nagad, Cards via Paymently', 'বিকাশ, নগদ ও কার্ড পেমেন্টলি')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EDF4F9] text-[#EE8056] border border-[#D5E2EE] flex items-center justify-center shrink-0 shadow-2xs">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#293B52] leading-tight truncate">{t('7-Day Returns', '৭ দিনের রিটার্ন')}</p>
            <p className="text-[11px] text-[#6B7D93] truncate mt-0.5">{t('Verified policy on defects', 'সহজ রিটার্ন পলিসি')}</p>
          </div>
        </div>

      </div>

    </section>
  );
}