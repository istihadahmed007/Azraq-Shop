import React from 'react';
import { Box, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function DarkFeatureBar() {
  const { t } = useShop();

  const features = [
    {
      icon: Box,
      title: t("INNOVATIVE DESIGN", "উদ্ভাবনী ডিজাইন"),
      desc: t(
        "Crafted with ergonomic precision and minimalist elegance for modern everyday life.",
        "আধুনিক জীবনের চাহিদামাফিক নিখুঁত গঠন ও নান্দনিক মিনিমালিস্ট ফিনিশিং।"
      )
    },
    {
      icon: Sparkles,
      title: t("PREMIUM MATERIALS", "প্রিমিয়াম ম্যাটেরিয়াল"),
      desc: t(
        "Sustainable high-grade vegan leather, durable alloy hardware and waterproof lining.",
        "টেকসই পরিবেশবান্ধব ভিগান লেদার ও ক্ষয়রোধী প্রিমিয়াম হার্ডওয়্যার।"
      )
    },
    {
      icon: Truck,
      title: t("SEAMLESS DISPATCH", "দ্রুততম ডেলিভারি"),
      desc: t(
        "Express door-to-door courier across all 64 districts in Bangladesh with live tracking.",
        "ঢাকা এবং সারা বাংলাদেশের ৬৪ জেলায় বিশ্বস্ত কুরিয়ার মারফত দ্রুত হোম ডেলিভারি।"
      )
    },
    {
      icon: ShieldCheck,
      title: t("VERIFIED BY DEFAULT", "শতভাগ যাচাইকৃত"),
      desc: t(
        "Each curated piece undergoes multi-point physical inspection before doorstep delivery.",
        "প্রতিটি পার্সেল হস্তান্তরের পূর্বে কঠোর মান নিয়ন্ত্রণে নিশ্চিত করা হয়।"
      )
    }
  ];

  return (
    <section id="standards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-16 relative z-20">
      <div className="rounded-3xl bg-azraq-navy p-8 sm:p-10 lg:p-12 text-white border border-azraq-purple/20 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative purple glow in corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-azraq-violet/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Tag */}
        <div className="mb-8">
          <span className="text-xs font-black tracking-[0.25em] text-azraq-purple uppercase">
            {t("BUILT FOR THE FUTURE • THE AZRAQ STANDARD", "ভবিষ্যতের জন্য নির্মিত • আজরাক মানদণ্ড")}
          </span>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-3 group">
                {/* Lime Outline Icon */}
                <div className="w-10 h-10 rounded-xl bg-azraq-charcoal/80 border border-azraq-lime/30 flex items-center justify-center text-azraq-lime group-hover:scale-110 group-hover:border-azraq-lime transition-all">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Feature Title */}
                <h3 className="text-sm font-extrabold tracking-wide uppercase text-white group-hover:text-azraq-lime transition-colors">
                  {item.title}
                </h3>

                {/* Feature Description */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

