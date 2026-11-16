import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from './common/ProductCard';

export default function TrendingRightNowSection() {
  const { products, setSelectedProduct, addToCart, favorites, toggleFavorite, navigateTo, t } = useShop();

  // Pick 6 authentic trending products from the database matching the reference items
  // (Speaker, Smartwatch, Backpack, Earbuds, Bottle/Mug, Sunglasses)
  const fallback = products[0] || {};
  const trendingItems = [
    products.find(p => p.name?.toLowerCase().includes('speaker')) || products[4] || fallback,
    products.find(p => p.name?.toLowerCase().includes('watch')) || products[1] || fallback,
    products.find(p => p.name?.toLowerCase().includes('bag') && p.primary_collection_id === 5) || products[3] || fallback,
    products.find(p => p.name?.toLowerCase().includes('wireless') || p.name?.toLowerCase().includes('earbud')) || products[8] || fallback,
    products.find(p => p.name?.toLowerCase().includes('bottle') || p.name?.toLowerCase().includes('mug')) || products[6] || fallback,
    products.find(p => p.name?.toLowerCase().includes('sunglass')) || products[5] || fallback,
  ].filter(p => p && p.id);

  return (
    <section id="popular-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <span id="trending-now" className="absolute -top-10 left-0 pointer-events-none" />
      
      {/* Section Header (Reference Screenshot Exact Match) */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#062B4F] tracking-tight flex items-center gap-1.5">
              <span>{t("Trending Right Now", "এখন সবচেয়ে ট্রেন্ডিং")}</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 inline-block" />
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#062B4F]/60">
            {t("Top picks that everyone is loving this week.", "চলতি সপ্তাহের সর্বাধিক জনপ্রিয় পণ্যসমূহ।")}
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('all-products');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-xs font-bold text-[#0877C9] hover:text-[#062B4F] flex items-center gap-1 transition-colors group flex-shrink-0"
        >
          <span>{t("View All", "সবগুলো দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 6-Card Horizontal Grid (Reference Match: 2 cols on mobile, 3 on tablet, 6 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {trendingItems.map((product, idx) => (
          <ProductCard
            key={product.id || idx}
            product={product}
            isFav={favorites.includes(product.id)}
            onToggleFavorite={toggleFavorite}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(p, v, q) => addToCart(p, v, q)}
            showRating={true}
            showSku={false}
            showCategory={false}
            compact={true}
          />
        ))}
      </div>

    </section>
  );
}

