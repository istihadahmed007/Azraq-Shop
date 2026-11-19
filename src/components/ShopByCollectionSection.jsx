import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Curated Signature Collections (The AZRAQ Edit)
 * 
 * Showcases 4 distinctive, meaningful lifestyle collections with varied visual character:
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
      badge: "FEATURED EDIT"
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
    <section id="shop-by-collection" className="w-full select-none border border-[#E5E3DA] bg-white rounded-[6px] shadow-[0_1px_3px_rgba(23,35,51,0.03)] p-5 sm:p-7">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#E5E3DA]">
        <div>
          <span className="text-[10px] font-mono text-[#667085] uppercase tracking-[0.16em] block font-semibold">
            {t("SIGNATURE SERIES", "সিগনেচার সিরিজ")}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-[#172333] tracking-tight mt-0.5">
            {t('The AZRAQ Edit', 'আজরাক স্পেশাল এডিট')}
          </h2>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-semibold text-[#172333] hover:text-[#245BDB] flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] hover:border-[#172333] transition-colors"
        >
          <span>{t('View All Collections', 'সব কালেকশন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#667085]" />
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
              className="group cursor-pointer rounded-[4px] border border-[#E5E3DA] hover:border-[#172333] bg-[#FAF9F5] hover:bg-white p-4 flex flex-col justify-between transition-all duration-150"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative w-full aspect-square bg-white rounded-[3px] border border-[#E5E3DA] p-3 flex items-center justify-center overflow-hidden mb-3">
                  <ProductImage
                    src={displayImage}
                    alt={col.name}
                    fit="contain"
                    aspectRatio="square"
                    className="group-hover:scale-104 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[2px] bg-[#172333] text-white text-[9px] font-mono uppercase tracking-wider font-semibold">
                    {meta.badge}
                  </span>
                </div>

                {/* Details */}
                <span className="text-[10px] font-mono text-[#8C99A8] block">
                  {count} {t('Catalog Items', 'টি পণ্য')}
                </span>
                <h3 className="text-sm font-bold text-[#172333] group-hover:text-[#245BDB] transition-colors mt-0.5 truncate">
                  {col.name}
                </h3>
                <p className="text-[11px] text-[#667085] mt-1 line-clamp-2 leading-relaxed">
                  {meta.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E5E3DA] flex items-center justify-between text-xs font-semibold text-[#172333] group-hover:text-[#245BDB] transition-colors">
                <span>{t("Shop Collection", "কালেকশন দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
