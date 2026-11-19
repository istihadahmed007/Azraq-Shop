import React from 'react';
import { Box, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

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
    <section id="standards" className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/85 backdrop-blur-2xl border border-[rgba(130,170,205,0.3)] border-t-white/95 p-6 sm:p-10 text-[#193B5B] shadow-[0_16px_40px_-10px_rgba(112,200,237,0.18),0_4px_16px_-2px_rgba(25,59,91,0.04)] relative overflow-hidden">
        {/* Subtle decorative glow in corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#70C8ED]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Tag */}
        <div className="mb-6">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#0877C9] uppercase">
            + {t("BUILT FOR THE FUTURE • THE AZRAQ STANDARD", "ভবিষ্যতের জন্য নির্মিত • আজরাক মানদণ্ড")}
          </span>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-[rgba(130,170,205,0.22)] shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DDEEFF] to-white border border-[rgba(130,170,205,0.3)] flex items-center justify-center text-[#0877C9] shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-black tracking-wider text-[#193B5B]">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#718398] leading-relaxed">
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
