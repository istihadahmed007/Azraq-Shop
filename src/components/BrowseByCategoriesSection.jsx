import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function BrowseByCategoriesSection() {
  const { collections, navigateTo, t } = useShop();

  // 8 Canonical Categories matching the reference screenshot exactly
  const categoryBubbles = [
    {
      title: "Fashion",
      titleBn: "ফ্যাশন",
      slug: "jewelries-accessories",
      image: "https://easydrop.asia/products/image-1776684600066-87607674.jpeg", // Handbag
      count: "95 items"
    },
    {
      title: "Beauty",
      titleBn: "বিউটি",
      slug: "health-beauty",
      image: "https://easydrop.asia/products/image-1788611817845-304262427.jpeg", // Grooming/Skincare
      count: "330 items"
    },
    {
      title: "Electronics",
      titleBn: "ইলেকট্রনিক্স",
      slug: "gadgets-it-accessories",
      image: "https://easydrop.asia/products/image-1794224164356-135288231.jpeg", // Headphone/Gadget
      count: "281 items"
    },
    {
      title: "Home & Living",
      titleBn: "হোম ও লিভিং",
      slug: "home-lifestyle",
      image: "https://easydrop.asia/products/image-1792995442375-678891328.jpg", // Mug/Living
      count: "130 items"
    },
    {
      title: "Sports",
      titleBn: "স্পোর্টস",
      slug: "sports-kids",
      image: "https://easydrop.asia/products/image-1793796430036-687433107.jpeg", // Astrox Racket/Sport
      count: "57 items"
    },
    {
      title: "Toys & Games",
      titleBn: "খেলনা ও গেমস",
      slug: "baby-mom",
      image: "https://easydrop.asia/products/image-1756630135117-821756522.webp", // Kids/Baby
      count: "49 items"
    },
    {
      title: "Automotive",
      titleBn: "অটোমোটিভ",
      slug: "consumer-electronics",
      image: "https://easydrop.asia/products/image-1769686171775-563922529.jpeg", // Fascial Gun/Gear
      count: "15 items"
    },
    {
      title: "Books",
      titleBn: "বই ও প্রিন্ট",
      slug: "print-on-demand",
      image: "https://easydrop.asia/products/image-1742272455068-479948467.jpg", // Printed Books/Apparel
      count: "18 items"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header (Reference Screenshot Exact Match) */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#062B4F] tracking-tight">
          {t("Browse By Categories", "ক্যাটাগরি অনুযায়ী ব্রাউজ করুন")}
        </h2>
        <p className="text-xs sm:text-sm text-[#062B4F]/60 mt-1">
          {t("Explore handpicked collections for every part of your life.", "আপনার দৈনন্দিন জীবনের প্রতিটি বিষয়ের জন্য নির্বাচিত কালেকশন।")}
        </p>
      </div>

      {/* Circular Category Thumbnails Row (Reference Screenshot Exact Match) */}
      <div className="flex items-center justify-between gap-3 sm:gap-6 overflow-x-auto pb-4 no-scrollbar">
        {categoryBubbles.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo('collection-detail', cat.slug)}
            className="flex flex-col items-center flex-shrink-0 group focus:outline-none"
          >
            {/* Circular Glassy Bubble with Subtle Azure Ring */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#F0F7FF] to-[#E6F3FF] border border-[#69C5F5]/35 p-3 flex items-center justify-center shadow-sm group-hover:shadow-[0_8px_25px_rgba(8,119,201,0.2)] group-hover:border-[#0877C9] group-hover:scale-108 transition-all duration-300 relative overflow-hidden">
              {/* Subtle Light Reflection Arc */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 rounded-t-full pointer-events-none" />
              
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Category Name */}
            <span className="text-xs sm:text-sm font-bold text-[#062B4F] mt-2.5 group-hover:text-[#0877C9] transition-colors">
              {t(cat.title, cat.titleBn)}
            </span>
          </button>
        ))}

        {/* View All Chevron Arrow Pill (Reference Match) */}
        <button
          onClick={() => navigateTo('collections')}
          className="w-11 h-11 rounded-full bg-white border border-[#D9F0FF] hover:border-[#69C5F5] hover:bg-[#F0F7FF] text-[#062B4F] flex items-center justify-center flex-shrink-0 shadow-sm transition-all group ml-1"
          title="All Collections"
        >
          <ChevronRight className="w-5 h-5 text-[#0877C9] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </section>
  );
}
