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
      image: "https://easydrop.asia/products/image-1769340493602-947227315.jpeg", // High-res embroidery apparel
      bgGradient: "from-[#FDF7F2] to-[#F5ECE1]",
      border: "border-amber-200/50"
    },
    {
      title: "Skincare Essentials",
      titleBn: "স্কিনকেয়ার সম্ভার",
      subtitle: "Glow every day",
      subtitleBn: "প্রতিদিনের উজ্জ্বলতা",
      slug: "health-beauty",
      image: "https://easydrop.asia/products/image-1788611817845-304262427.jpeg", // High-res cosmetic/grooming bottles
      bgGradient: "from-[#F9F5F0] to-[#EFE7DD]",
      border: "border-orange-200/40"
    },
    {
      title: "Gaming & Gadgets",
      titleBn: "গেমিং ও গ্যাজেটস",
      subtitle: "Level up your tech",
      subtitleBn: "উন্নত প্রযুক্তি অভিজ্ঞতা",
      slug: "gadgets-it-accessories",
      image: "https://easydrop.asia/products/image-1794224164356-135288231.jpeg", // High-res gadget box set
      bgGradient: "from-[#D9F0FF] to-[#C9E7FC]",
      border: "border-[#69C5F5]/40"
    },
    {
      title: "Modern Living",
      titleBn: "মডার্ন লিভিং",
      subtitle: "Make your space beautiful",
      subtitleBn: "ঘরকে সাজান নান্দনিকভাবে",
      slug: "home-lifestyle",
      image: "https://easydrop.asia/products/image-1792995442375-678891328.jpg", // High-res lifestyle living
      bgGradient: "from-[#F0F7FF] to-[#E4F1FD]",
      border: "border-[#D9F0FF]"
    }
  ];

  return (
    <section id="featured-collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header (Reference Screenshot Exact Match) */}
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#062B4F] tracking-tight">
            {t("Featured Collections", "বাছাইকৃত স্পেশাল কালেকশন")}
          </h2>
          <p className="text-xs sm:text-sm text-[#062B4F]/60 mt-0.5">
            {t("Carefully curated collections just for you.", "আপনার জন্য বিশেষভাবে নির্বাচিত অনন্য সংগ্রহ।")}
          </p>
        </div>

        <button
          onClick={() => navigateTo('collections')}
          className="text-xs font-bold text-[#0877C9] hover:text-[#062B4F] flex items-center gap-1 transition-colors group flex-shrink-0"
        >
          <span>{t("View All", "সবগুলো দেখুন")}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4 Cards Grid (Reference Match) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {collectionsData.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigateTo('collection-detail', item.slug)}
            className={`rounded-2xl p-5 bg-gradient-to-br ${item.bgGradient} border ${item.border} shadow-[0_4px_20px_-4px_rgba(16,28,53,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden h-[280px] sm:h-[300px]`}
          >
            {/* Subtle Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

            {/* Typography */}
            <div className="relative z-10">
              <h3 className="text-lg font-black text-[#062B4F] group-hover:text-[#0877C9] transition-colors leading-snug">
                {t(item.title, item.titleBn)}
              </h3>
              <p className="text-xs text-[#062B4F]/60 mt-1 font-medium">
                {t(item.subtitle, item.subtitleBn)}
              </p>
            </div>

            {/* Product / Lifestyle Image Container */}
            <div className="relative w-full h-36 flex items-center justify-end my-auto overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-[80%] object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-108"
              />
            </div>

            {/* Action Link Arrow */}
            <div className="relative z-10 pt-2 flex items-center gap-1 text-[11px] font-bold text-[#0877C9] group-hover:text-[#062B4F] transition-colors">
              <span>{t("Explore Collection", "কালেকশন দেখুন")}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}

