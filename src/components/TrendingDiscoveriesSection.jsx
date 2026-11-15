import React from 'react';
import { Sparkles, ArrowRight, Eye, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function TrendingDiscoveriesSection() {
  const { products, setSelectedProduct, addToCart, favorites, toggleFavorite, t } = useShop();

  // Curated Editor's Picks
  const trending = products.filter(p => p.featured).slice(4, 12);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-azraq-violet" />
            <span className="text-xs font-black tracking-widest text-azraq-violet uppercase">
              {t("MERCHANDISED SELECTION", "এডিটরস পিক")}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-azraq-navy tracking-tight">
            {t("Trending Discoveries & Editor's Picks", "জনপ্রিয় ট্রেন্ডিং আবিষ্কার")}
          </h2>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-1">
            {t("Specially curated by AZRAQ merchandising directors for practical elegance.", "ব্যবহারিক উপযোগিতা ও আধুনিক রুচির সমন্বয়ে বাছাইকৃত সামগ্রী।")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {trending.map(product => {
          const isFav = favorites.includes(product.id);
          return (
            <div
              key={product.id}
              className="rounded-none bg-white border border-azraq-purple/20 p-3 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[490px] sm:h-[510px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isFav ? 'bg-azraq-violet text-white shadow-md' : 'bg-white/80 text-azraq-navy/40 hover:text-azraq-violet'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
              </button>

              <span className="absolute top-4 left-4 z-10 px-2.5 py-0.5 rounded-none bg-azraq-lavender text-azraq-violet text-[10px] font-black uppercase">
                Trending
              </span>

              {/* Product Image - 75-80% visual area, completely square corners */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative w-full h-[370px] sm:h-[390px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-2 sm:p-3 cursor-pointer overflow-hidden"
              >
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] font-bold text-azraq-violet block truncate">
                    {product.primary_collection_name}
                  </span>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-azraq-navy text-sm line-clamp-1 cursor-pointer hover:text-azraq-violet transition-colors mt-0.5"
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <span className="text-base sm:text-lg font-black text-azraq-navy">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product, product.variants[0] || 'Default', 1)}
                    className="w-9 h-9 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform hover:scale-110 flex-shrink-0"
                    title="Add to bag"
                  >
                    <ArrowRight className="w-4 h-4 text-azraq-navy" />
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

