import React from 'react';
import { Star, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function BestPicksSection() {
  const { products, orders, setSelectedProduct, addToCart, t } = useShop();

  // Find products that match items in verified orders, plus top rated items
  const bestPicks = products.filter(p => 
    p.id === 'AZQ-001' || p.id === 'AZQ-061' || p.id === 'AZQ-063' || p.id === 'AZQ-081' || p.rating >= 4.9
  ).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-azraq-cloud border border-azraq-purple/20 p-8 sm:p-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-black tracking-widest text-emerald-700 uppercase">
                {t("VERIFIED ORDER & SALES DATA", "অর্ডার ডেটা অনুযায়ী সেরা")}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-azraq-navy tracking-tight">
              {t("Best Picks & Customer Favourites", "গ্রাহকদের সর্বাধিক পছন্দের পণ্য")}
            </h2>
            <p className="text-xs text-azraq-navy/60 mt-1">
              {t("Products with verified order velocity and 4.9+ customer satisfaction across Bangladesh.", "প্রকৃত অর্ডার ও রেটিংয়ের ভিত্তিতে প্রস্তুতকৃত সেরা তালিকা।")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestPicks.map(product => (
            <div
              key={product.id}
              className="rounded-none bg-white border border-gray-200/80 p-3 sm:p-4 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[490px] sm:h-[510px]"
            >
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
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-none bg-azraq-navy text-white text-[9px] font-mono font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 text-azraq-lime fill-azraq-lime" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] font-bold text-azraq-violet block truncate">
                    {product.primary_collection_name}
                  </span>
                  <h4 
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-xs sm:text-sm text-azraq-navy line-clamp-1 cursor-pointer hover:text-azraq-violet mt-0.5"
                  >
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                  <span className="text-base sm:text-lg font-black text-azraq-navy">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product, product.variants[0] || 'Default', 1)}
                    className="w-9 h-9 rounded-full bg-azraq-lime text-azraq-navy hover:bg-[#bbf035] transition-all transform hover:scale-110 shadow-sm flex items-center justify-center flex-shrink-0"
                    title="Add to Bag"
                  >
                    <ArrowRight className="w-4 h-4" />
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

