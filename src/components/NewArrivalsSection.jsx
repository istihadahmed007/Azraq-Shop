import React from 'react';
import { Sparkles, ArrowRight, Eye, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function NewArrivalsSection() {
  const { products, setSelectedProduct, addToCart, favorites, toggleFavorite, navigateTo, t } = useShop();

  // Sort by verified import / ID order descending
  const newArrivals = [...products].reverse().slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-azraq-violet" />
            <span className="text-xs font-black tracking-widest text-azraq-violet uppercase">
              {t("AUTHENTIC INGESTION TIMELINE", "সাম্প্রতিক আমদানি")}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-azraq-navy tracking-tight">
            {t("New Arrivals & Fresh Discoveries", "নতুন কালেকশন ও আবিষ্কার")}
          </h2>
          <p className="text-xs sm:text-sm text-azraq-navy/60 mt-1">
            {t("Verified newly indexed supplier inventory. Filtered by authentic import logs.", "সম্প্রতি সংযুক্ত যাচাইকৃত পণ্যের তালিকা।")}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-azraq-violet hover:underline flex items-center gap-1"
        >
          <span>{t("Browse all 257 products", "সকল ২৫৭টি পণ্য দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {newArrivals.map(product => {
          const isFav = favorites.includes(product.id);
          return (
            <div
              key={product.id}
              className="rounded-none bg-white border border-azraq-purple/20 p-2 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[370px] sm:h-[490px] md:h-[510px]"
            >
              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                  isFav ? 'bg-azraq-violet text-white shadow-md' : 'bg-white/80 text-azraq-navy/40 hover:text-azraq-violet'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-white' : ''}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex flex-col gap-1">
                <span className="px-2 sm:px-2.5 py-0.5 rounded-none bg-azraq-lime/20 text-azraq-navy text-[9px] sm:text-[10px] font-black uppercase">
                  NEW
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-none bg-azraq-cloud text-gray-500 text-[8px] sm:text-[9px] font-mono">
                  {product.primary_collection_name}
                </span>
              </div>

              {/* Product Image - 75-80% visual area, completely square corners */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative w-full h-[250px] sm:h-[370px] md:h-[390px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-1.5 sm:p-3 cursor-pointer overflow-hidden"
              >
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-azraq-navy/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white text-azraq-navy text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-azraq-lime transition-colors">
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {t("Quick View", "বিস্তারিত")}
                  </span>
                </div>
              </div>

              {/* Details & Pricing */}
              <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-azraq-navy text-xs sm:text-sm line-clamp-1 cursor-pointer hover:text-azraq-violet transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-azraq-navy/50 line-clamp-1 mt-0.5">
                    {product.primary_collection_name}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                  <span className="text-xs sm:text-base md:text-lg font-black text-azraq-navy truncate">
                    ৳{product.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => addToCart(product, product.variants[0] || 'Default', 1)}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy flex items-center justify-center shadow-glow-lime transition-all transform hover:scale-110 flex-shrink-0"
                    title="Add to bag"
                  >
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-azraq-navy" />
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

