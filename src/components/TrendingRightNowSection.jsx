import React from 'react';
import { Star, ShoppingCart, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function TrendingRightNowSection() {
  const { products, setSelectedProduct, addToCart, favorites, toggleFavorite, navigateTo, t } = useShop();

  // Pick 6 authentic trending products from the database matching the reference items
  // (Speaker, Smartwatch, Backpack, Earbuds, Bottle/Mug, Sunglasses)
  const trendingItems = [
    products.find(p => p.name.toLowerCase().includes('speaker')) || products[4],
    products.find(p => p.name.toLowerCase().includes('watch')) || products[1],
    products.find(p => p.name.toLowerCase().includes('bag') && p.primary_collection_id === 5) || products[3],
    products.find(p => p.name.toLowerCase().includes('wireless') || p.name.toLowerCase().includes('earbud')) || products[8],
    products.find(p => p.name.toLowerCase().includes('bottle') || p.name.toLowerCase().includes('mug')) || products[6],
    products.find(p => p.name.toLowerCase().includes('sunglass')) || products[5],
  ].filter(Boolean);

  return (
    <section id="trending-now" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
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
        {trendingItems.map((product, idx) => {
          const isFav = favorites.includes(product.id);
          const shortName = product.name.split('—')[1] || product.name.split('(')[0] || product.name;

          return (
            <div
              key={product.id || idx}
              className="bg-white/95 backdrop-blur-md rounded-xl border border-[#D9F0FF] p-3 shadow-sm hover:shadow-[0_10px_30px_rgba(8,119,201,0.12)] hover:border-[#69C5F5]/60 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[340px] sm:h-[360px]"
            >
              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isFav ? 'bg-[#0877C9] text-white shadow-sm' : 'bg-white/80 text-[#062B4F]/40 hover:text-[#0877C9]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
              </button>

              {/* Product Photograph Container */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative w-full h-44 sm:h-48 rounded-lg bg-gradient-to-b from-[#F8FCFF] to-white flex items-center justify-center p-2 cursor-pointer overflow-hidden"
              >
                <img
                  src={product.main_image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (!e.target.dataset.failed) {
                      e.target.dataset.failed = 'true';
                      e.target.src = 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-108"
                />
              </div>

              {/* Info & Bottom Action (Reference Match) */}
              <div className="pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-xs sm:text-sm text-[#062B4F] line-clamp-1 cursor-pointer hover:text-[#0877C9] transition-colors"
                    title={product.name}
                  >
                    {shortName}
                  </h3>
                  
                  {/* Retail Price strictly in BDT */}
                  <div className="mt-1">
                    <span className="text-sm sm:text-base font-black text-[#062B4F]">
                      ৳{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Rating & Add-to-Cart Action (Reference Match: Star + Cart Button) */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating || '4.8'}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.variants[0] || 'Default', 1)}
                    className="w-8 h-8 rounded-lg border border-[#D9F0FF] hover:border-[#0877C9] hover:bg-[#0877C9] hover:text-white text-[#062B4F] flex items-center justify-center transition-all shadow-sm"
                    title="Add to cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

