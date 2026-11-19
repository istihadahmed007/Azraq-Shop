import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function FeaturedCollectionsSection() {
  const { navigateTo, t } = useShop();

  // 4 Curated Editorial Collections (Matching Reference Screenshot Exactly)
  const collectionsData = [
    {
      title: "Elegant Outfits",
      titleBn: "মার্জিত পোশাক",
      subtitle: "Step into style",
      subtitleBn: "অনন্য ফ্যাশন স্টাইল",
      slug: "men-clothing",
      image: "https://easydrop.asia/products/image-1769340493602-947227315.jpeg",
      bgGradient: "from-[#F8FBFF] to-[#DDEEFF]/40",
      border: "border-[rgba(130,170,205,0.25)]"
    },
    {
      title: "Skincare Essentials",
      titleBn: "স্কিনকেয়ার সম্ভার",
      subtitle: "Glow every day",
      subtitleBn: "প্রতিদিনের উজ্জ্বলতা",
      slug: "health-beauty",
      image: "https://easydrop.asia/products/image-1788611817845-304262427.jpeg",
      bgGradient: "from-[#F8FBFF] to-[#DDEEFF]/40",
      border: "border-[rgba(130,170,205,0.25)]"
    },
    {
      title: "Gaming & Gadgets",
      titleBn: "গেমিং ও গ্যাজেটস",
      subtitle: "Level up your tech",
      subtitleBn: "উন্নত প্রযুক্তি অভিজ্ঞতা",
      slug: "gadgets-it-accessories",
      image: "https://easydrop.asia/products/image-1794224164356-135288231.jpeg",
      bgGradient: "from-[#F8FBFF] to-[#DDEEFF]/40",
      border: "border-[rgba(130,170,205,0.25)]"
    },
    {
      title: "Modern Living",
      titleBn: "মডার্ন লিভিং",
      subtitle: "Make your space beautiful",
      subtitleBn: "ঘরকে সাজান নান্দনিকভাবে",
      slug: "home-lifestyle",
      image: "https://easydrop.asia/products/image-1792995442375-678891328.jpg",
      bgGradient: "from-[#F8FBFF] to-[#DDEEFF]/40",
      border: "border-[rgba(130,170,205,0.25)]"
    }
  ];

  return (
    <section id="featured-collections" className="w-full py-2 select-none">
      
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
            + {t("FEATURED SHOWCASE", "বাছাইকৃত কালেকশন")}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#193B5B] tracking-tight">
            {t("Featured Collections", "বাছাইকৃত স্পেশাল কালেকশন")}
          </h2>
          <p className="text-xs text-[#718398] mt-0.5">
            {t("Carefully curated collections with guaranteed authentic stock.", "আপনার জন্য বিশেষভাবে নির্বাচিত অনন্য সংগ্রহ।")}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#0877C9] hover:text-[#193B5B] flex items-center gap-1.5 transition-colors group flex-shrink-0 px-3 py-1.5 rounded-full bg-white/70 border border-[rgba(130,170,205,0.3)] shadow-2xs"
        >
          <span>{t("View All", "সবগুলো দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {collectionsData.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigateTo('collection-detail', item.slug)}
            className={`rounded-2xl p-5 bg-gradient-to-br ${item.bgGradient} backdrop-blur-xl border ${item.border} shadow-[0_8px_24px_rgba(112,200,237,0.12),0_2px_8px_rgba(25,59,91,0.04)] hover:shadow-[0_16px_40px_rgba(112,200,237,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden h-[280px] sm:h-[300px]`}
          >
            {/* Subtle Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />

            {/* Typography */}
            <div className="relative z-10">
              <h3 className="text-base sm:text-lg font-black text-[#193B5B] group-hover:text-[#0877C9] transition-colors leading-snug">
                {t(item.title, item.titleBn)}
              </h3>
              <p className="text-xs text-[#718398] mt-1 font-medium">
                {t(item.subtitle, item.subtitleBn)}
              </p>
            </div>

            {/* Product / Lifestyle Image Container */}
            <div className="card-image-wrapper relative w-full h-36 flex items-center justify-center my-auto overflow-hidden p-2">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Action Link Arrow */}
            <div className="relative z-10 pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#0877C9] group-hover:text-[#193B5B] transition-colors border-t border-[rgba(130,170,205,0.18)]">
              <span>{t("Explore Collection", "কালেকশন দেখুন")}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}

