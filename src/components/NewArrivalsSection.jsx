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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newArrivals.map(product => {
          const isFav = favorites.includes(product.id);
          return (
            <div
              key={product.id}
              className="rounded-3xl bg-white border border-azraq-purple/20 p-5 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[400px]"
            >
              {/* Wishlist Button */}
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

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                <span className="px-2.5 py-0.5 rounded-full bg-azraq-lime/20 text-azraq-navy text-[10px] font-black uppercase">
                  NEW
                </span>
                <span className="px-2 py-0.5 rounded-md bg-azraq-cloud text-gray-500 text-[9px] font-mono">
                  {product.primary_collection_name}
                </span>
              </div>

              {/* Product Image */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative w-full h-48 rounded-2xl bg-gradient-to-b from-azraq-cloud to-white flex items-center justify-center p-3 cursor-pointer overflow-hidden mt-6"
              >
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-108"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-azraq-navy/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-white text-azraq-navy text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {t("Quick View", "বিস্তারিত")}
                  </span>
                </div>
              </div>

              {/* Details & Pricing */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-azraq-navy text-sm line-clamp-1 cursor-pointer hover:text-azraq-violet transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-azraq-navy/50 line-clamp-1 mt-0.5">
                    {product.primary_collection_name}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3">
                  <div>
                    <span className="text-base font-black text-azraq-navy">
                      ৳{product.price.toLocaleString()}
                    </span>
                  </div>

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

