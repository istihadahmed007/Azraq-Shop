import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * AZRAQ Shop — Curated Signature Collections (The AZRAQ Edit)
 * 
 * Showcases 4 distinctive lifestyle collections in futuristic glass cards:
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
    <section id="shop-by-collection" className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl rounded-[28px] shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] p-5 sm:p-7">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[rgba(130,170,205,0.18)]">
        <div>
          <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
            + {t("SIGNATURE SERIES", "সিগনেচার সিরিজ")}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#193B5B] tracking-tight mt-0.5">
            {t('The AZRAQ Edit', 'আজরাক স্পেশাল এডিট')}
          </h2>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#193B5B] hover:text-[#0877C9] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/75 hover:bg-white border border-[rgba(130,170,205,0.3)] shadow-xs transition-all cursor-pointer"
        >
          <span>{t('View All Collections', 'সব কালেকশন')}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#718398]" />
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
              className="group cursor-pointer rounded-[22px] border border-[rgba(130,170,205,0.25)] border-t-white/90 hover:border-[#70C8ED]/60 bg-white/75 hover:bg-white/95 backdrop-blur-md p-4 flex flex-col justify-between shadow-xs hover:shadow-[0_16px_36px_rgba(112,200,237,0.22)] transition-all duration-200"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative w-full aspect-square bg-[#F8FBFF]/80 backdrop-blur-md rounded-[18px] border border-[rgba(130,170,205,0.2)] p-3 flex items-center justify-center overflow-hidden mb-3 shadow-inner">
                  <div className="card-image-wrapper w-full h-full">
                    <ProductImage
                      src={displayImage}
                      alt={col.name}
                      fit="contain"
                      aspectRatio="square"
                      className="group-hover:scale-[1.05] transition-transform duration-300"
                    />
                  </div>
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#193B5B]/85 backdrop-blur-xs text-[#70C8ED] text-[9px] font-mono uppercase tracking-wider font-bold shadow-xs">
                    {meta.badge}
                  </span>
                </div>

                {/* Details */}
                <span className="text-[10px] font-mono text-[#718398] block font-semibold">
                  {count} {t('Catalog Items', 'টি পণ্য')}
                </span>
                <h3 className="text-sm font-extrabold text-[#193B5B] group-hover:text-[#0877C9] transition-colors mt-0.5 truncate">
                  {col.name}
                </h3>
                <p className="text-[11px] text-[#718398] mt-1 line-clamp-2 leading-relaxed">
                  {meta.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between">
                <span className="text-xs font-bold text-[#0877C9] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t('Explore Collection', 'কালেকশন দেখুন')}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-[10px] font-mono text-[#718398]">
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
