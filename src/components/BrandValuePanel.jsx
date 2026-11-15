import React from 'react';
import { Sparkles, DollarSign, ShoppingCart, Headphones } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function BrandValuePanel() {
  const { t } = useShop();

  const values = [
    {
      icon: Sparkles,
      title: t("Thoughtful Product Selection", "বাছাইকৃত পণ্যের সমাহার"),
      desc: t(
        "Every single item is physically curated from verified suppliers for daily utility and modern aesthetics.",
        "প্রতিটি পণ্য অত্যন্ত সচেতনভাবে দৈনন্দিন উপযোগিতা ও মানের ভিত্তিতে নির্বাচিত।"
      )
    },
    {
      icon: DollarSign,
      title: t("Transparent Pricing", "স্বচ্ছ ও যৌক্তিক মূল্য"),
      desc: t(
        "Direct wholesale dropshipping margins with zero hidden fees. Flat delivery fees across all of Bangladesh.",
        "সরাসরি পাইকারি আমদানির মাধ্যমে ন্যায্য মূল্য এবং কোনো গোপন চার্জ ছাড়া কেনাকাটা।"
      )
    },
    {
      icon: ShoppingCart,
      title: t("Convenient Shopping", "সহজ ও নির্ভরযোগ্য কেনাকাটা"),
      desc: t(
        "Seamless Cash on Delivery, instant bKash checkout, and door-to-door delivery within 24-72 hours.",
        "ক্যাশ অন ডেলিভারি এবং দ্রুততম সময়ে গ্রাহকের দোরগোড়ায় পার্সেল পৌঁছানোর ব্যবস্থা।"
      )
    },
    {
      icon: Headphones,
      title: t("Customer Support", "সার্বক্ষণিক গ্রাহক সেবা"),
      desc: t(
        "Dedicated Dhaka-based concierge helpline, 7-day hassle-free replacement, and real-time tracking.",
        "যেকোনো তথ্যে সার্বক্ষণিক সহায়তা এবং সহজ রিটার্ন ও পরিবর্তন সুবিধা।"
      )
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="rounded-2xl bg-[#062B4F] p-8 sm:p-12 text-white border border-[#69C5F5]/30 shadow-xl relative overflow-hidden">
        
        {/* Subtle glass reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        <div className="mb-8 relative z-10">
          <span className="text-xs font-black tracking-[0.25em] text-[#50DDF0] uppercase">
            {t("THE AZRAQ STANDARD • 4 PILLARS", "আজরাকের মূল চার স্তম্ভ")}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {t("Built on Everyday Trust & Transparency", "বিশ্বাস ও স্বচ্ছতার প্রতিশ্রুতি")}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="space-y-3 group">
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-[#69C5F5]/30 flex items-center justify-center text-[#50DDF0] group-hover:scale-110 group-hover:bg-[#0877C9] group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-[#50DDF0] transition-colors">
                  {v.title}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed font-normal">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
