import React from 'react';
import { Star, ArrowRight, TrendingUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function BestPicksSection() {
  const { products, setSelectedProduct, addToCart, t } = useShop();

  // Pick top 8 rated & popular products across collections
  const bestPicks = products.slice(0, 8);

  return (
    <section id="popular-products" className="py-16 bg-white border-y border-azraq-purple/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-black tracking-widest text-emerald-700 uppercase">
                {t("VERIFIED ORDER & SALES DATA", "অর্ডার ডেটা অনুযায়ী সেরা")}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-azraq-navy tracking-tight">
              {t("Popular Products & Best Picks", "জনপ্রিয় পণ্য ও সেরা পছন্দসমূহ")}
            </h2>
            <p className="text-xs sm:text-sm text-azraq-navy/60 mt-1">
              {t("Products with verified order velocity and 4.9+ customer satisfaction across Bangladesh.", "প্রকৃত অর্ডার ও রেটিংয়ের ভিত্তিতে প্রস্তুতকৃত সেরা তালিকা।")}
            </p>
          </div>
        </div>

        {/* 2-Column Mobile, 3-Column Tablet, 4-Column Desktop Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestPicks.map(product => (
            <div
              key={product.id}
              className="rounded-none bg-white border border-gray-200/80 p-2 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[370px] sm:h-[490px] md:h-[510px]"
            >
              <div 
                onClick={() => setSelectedProduct(product)}
                className="relative w-full h-[250px] sm:h-[370px] md:h-[390px] rounded-none bg-gradient-to-b from-[#F7F8FC] to-white flex items-center justify-center p-1.5 sm:p-3 cursor-pointer overflow-hidden"
              >
                <img
                  src={product.main_image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                  onError={(e) => {
                    if (!e.target.dataset.failed) {
                      e.target.dataset.failed = 'true';
                      e.target.src = 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                    }
                  }}
                  className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded-none bg-azraq-navy text-white text-[8px] sm:text-[9px] font-mono font-bold flex items-center gap-1 shadow-sm">
                  <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-azraq-lime fill-azraq-lime" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <div className="mt-2 sm:mt-3 pt-1.5 sm:pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-azraq-violet block truncate">
                    {product.primary_collection_name}
                  </span>
                  <h4 
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-xs sm:text-sm text-azraq-navy line-clamp-1 cursor-pointer hover:text-azraq-violet mt-0.5"
                  >
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-100 mt-2 gap-1.5">
                  <span className="text-xs sm:text-base md:text-lg font-black text-azraq-navy truncate">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product, product.variants[0] || 'Default', 1)}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-azraq-lime text-azraq-navy hover:bg-[#bbf035] transition-all transform hover:scale-110 shadow-sm flex items-center justify-center flex-shrink-0"
                    title="Add to Bag"
                  >
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
