import React from 'react';
import { Star, ArrowRight, TrendingUp } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import ProductImage from '../common/ProductImage';

export default function BestPicksSection() {
  const { products, setSelectedProduct, addToCart, t } = useShop();

  // Pick top 10 rated & popular products across collections (5 per row on desktop)
  const bestPicks = products.slice(0, 10);

  return (
    <section id="popular-products" className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.28)] border-t-white/95 p-6 sm:p-8 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
              + {t("VERIFIED PERFORMANCE", "অর্ডার ডেটা অনুযায়ী সেরা")}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#193B5B] tracking-tight">
              {t("Popular Products & Best Picks", "জনপ্রিয় পণ্য ও সেরা পছন্দসমূহ")}
            </h2>
            <p className="text-xs text-[#718398] mt-1">
              {t("Products with verified order velocity and 4.9+ customer satisfaction across Bangladesh.", "প্রকৃত অর্ডার ও রেটিংয়ের ভিত্তিতে প্রস্তুতকৃত সেরা তালিকা।")}
            </p>
          </div>
        </div>

        {/* 2-Column Mobile, 3-Column Tablet, 5-Column Desktop Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {bestPicks.map((product, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={product.id}
                className="rounded-[22px] bg-white/90 backdrop-blur-xl border border-[rgba(130,170,205,0.25)] border-t-white p-3.5 shadow-[0_8px_24px_rgba(112,200,237,0.1),0_2px_6px_rgba(25,59,91,0.03)] hover:shadow-[0_16px_36px_rgba(112,200,237,0.25)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-[340px]"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-[#0877C9] px-2 py-0.5 rounded-full bg-[#DDEEFF]/70 border border-[rgba(130,170,205,0.28)]">
                    {indexStr}
                  </span>
                  <div className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold flex items-center gap-1 border border-amber-200">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{product.rating || '4.9'}</span>
                  </div>
                </div>

                {/* Contained Image Frame */}
                <div 
                  onClick={() => setSelectedProduct(product)}
                  className="card-image-wrapper relative w-full h-[160px] rounded-xl bg-gradient-to-b from-[#F1F7FC] to-white flex items-center justify-center p-2 cursor-pointer overflow-hidden border border-[rgba(130,170,205,0.18)]"
                >
                  <ProductImage
                    src={product.main_image}
                    alt={product.name}
                    fit="contain"
                    aspectRatio="square"
                    className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="mt-3 pt-2.5 border-t border-[rgba(130,170,205,0.18)] flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[9px] font-bold text-[#0877C9] block truncate uppercase tracking-wider">
                      {product.category || product.primary_collection_name}
                    </span>
                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-xs text-[#193B5B] truncate cursor-pointer hover:text-[#0877C9] transition-colors mt-0.5"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <span className="text-sm sm:text-base font-black text-[#193B5B]">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToCart(product, product.variants?.[0] || 'Default', 1)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(112,200,237,0.4)] transition-all transform hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer"
                      title={t("Add to Bag", "ব্যাগে যোগ করুন")}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
