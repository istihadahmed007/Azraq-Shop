import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Curated Signature Collections
 * 
 * Showcases 4 distinctive lifestyle collections:
 * 1. Smart Peripherals & Audio
 * 2. Modern Kitchen Essentials
 * 3. Everyday Living & Atmosphere
 * 4. Contemporary Men's Wardrobe
 */
export default function ShopByCollectionSection() {
  const { collections, navigateTo, t } = useShop();

  const curatedCollectionIds = [2, 6, 4, 11];
  const spotlightCollections = curatedCollectionIds
    .map(id => collections.find(c => c.id === id))
    .filter(Boolean);

  const collectionEditorialData = {
    2: {
      subtitle: t("Audio, powerbanks & fast charging gear", "উচ্চগতির চার্জার, পাওয়ার ব্যাংক ও অডিও"),
      badge: "FEATURED"
    },
    6: {
      subtitle: t("Precision cooking tools & electric appliances", "আধুনিক কিচেন অ্যাপ্লায়েন্স ও রান্নার সরঞ্জাম"),
      badge: "KITCHEN"
    },
    4: {
      subtitle: t("Home organization, lighting & living accessories", "হোম ডেকর, লাইটিং ও দৈনন্দিন অর্গানাইজার"),
      badge: "LIFESTYLE"
    },
    11: {
      subtitle: t("Contemporary co-ord sets, shirts & casuals", "প্রিমিয়াম প্রিন্টেড কো-অর্ড ও ফ্যাশন কালেকশন"),
      badge: "WARDROBE"
    }
  };

  return (
    <section id="shop-by-collection" className="w-full select-none border border-slate-200/90 bg-white rounded-2xl shadow-xs p-5 sm:p-7">

      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t('Curated Collections', 'বাছাইকৃত কালেকশনসমূহ')}
          </h2>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-semibold text-slate-700 hover:text-[#185ADB] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
        >
          <span>{t('View All Collections', 'সব কালেকশন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* 4-Card Distinctive Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {spotlightCollections.map(col => {
          const displayImage = col.cover_image || col.image_url;
          const count = col.imported_product_count ?? col.product_count ?? 0;
          const meta = collectionEditorialData[col.id] || { subtitle: col.name, badge: "COLLECTION" };

          return (
            <div
              key={col.id}
              onClick={() => navigateTo('collection-detail', col.slug)}
              className="group cursor-pointer rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 p-4 flex flex-col justify-between shadow-xs transition-colors"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative w-full aspect-square bg-white rounded-lg border border-slate-200/70 p-3 flex items-center justify-center overflow-hidden mb-3">
                  <div className="card-image-wrapper w-full h-full">
                    <ProductImage
                      src={displayImage}
                      alt={col.name}
                      fit="contain"
                      aspectRatio="square"
                      className="group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/90 text-white text-[9px] font-mono uppercase tracking-wide font-medium shadow-xs">
                    {meta.badge}
                  </span>
                </div>

                {/* Details */}
                <span className="text-[11px] font-mono text-slate-500 block font-medium tabular-nums">
                  {count} {t('Catalog Items', 'টি পণ্য')}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#185ADB] transition-colors mt-0.5 truncate">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {meta.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#185ADB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t('Explore Collection', 'কালেকশন দেখুন')}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  AZRAQ Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
