import React from 'react';
import { Box, Users, Star, Headphones } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function StatsRibbon() {
  const { t } = useShop();

  const stats = [
    {
      icon: Box,
      value: "1,200+",
      label: t("Curated Products", "কিউরেটেড পণ্য"),
      sub: t("18 Verified Collections", "১৮টি অনুমোদিত ক্যাটাগরি")
    },
    {
      icon: Users,
      value: "25,000+",
      label: t("Happy Customers", "সন্তুষ্ট ক্রেতা"),
      sub: t("Nationwide in BD", "সারা বাংলাদেশে")
    },
    {
      icon: Star,
      value: "98%",
      label: t("Satisfaction Rate", "সন্তোষজনক মান"),
      sub: t("Verified Reviews", "প্রমাণিত রিভিউ")
    },
    {
      icon: Headphones,
      value: "24/7",
      label: t("Expert Support", "সার্বক্ষণিক সহায়তা"),
      sub: t("Dedicated Care", "ডেডিকেটেড কেয়ার")
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="rounded-2xl bg-gradient-to-r from-[#062B4F] via-[#0A3D6E] to-[#062B4F] p-8 sm:p-10 text-white shadow-xl border border-[#69C5F5]/30 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#50DDF0]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-center relative z-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-[#69C5F5]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#0877C9] transition-all">
                  <Icon className="w-6 h-6 text-[#50DDF0] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white/90">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-white/60">
                    {stat.sub}
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
