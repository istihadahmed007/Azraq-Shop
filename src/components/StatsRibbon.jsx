import React from 'react';
import { Package, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Horizontal Statistics & Trust Panel
 * - 4 clean statistic columns separated by subtle vertical hairlines.
 * - Large, crisp tabular numbers and quiet secondary labels.
 * - Right-hand side brand guarantee quote.
 */
export default function StatsRibbon() {
  const { t } = useShop();

  const stats = [
    {
      icon: Package,
      value: "1,200+",
      label: t("Curated Products", "কিউরেটেড পণ্য"),
      sub: t("Verified Catalog", "ভেরিফাইড পণ্যতালিকা")
    },
    {
      icon: Truck,
      value: "64",
      label: t("Districts Covered", "জেলায় হোম ডেলিভারি"),
      sub: t("Nationwide Reach", "সারা বাংলাদেশে")
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: t("Authentic Guarantee", "আসল পণ্যের নিশ্চয়তা"),
      sub: t("Direct Import Quality", "ডাইরেক্ট ইমপোর্ট")
    },
    {
      icon: Headphones,
      value: "24/7",
      label: t("Support Hotline", "সার্বক্ষণিক সহায়তা"),
      sub: t("WhatsApp Assistance", "হোয়াটসঅ্যাপ সাপোর্ট")
    }
  ];

  return (
    <section className="w-full select-none">
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6 transition-all">
        
        {/* 4 Compact Stat Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1 w-full divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                  idx > 0 ? 'sm:pl-6' : ''
                } ${idx >= 2 ? 'pt-3 sm:pt-0' : ''}`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#185ADB] flex items-center justify-center mb-2.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Guarantee Quote */}
        <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-8 flex flex-col justify-center">
          <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
            "{t(
              "Authentic quality is not just what it looks and feels like. Authentic quality is how it works.",
              "আসল মান কেবল দেখতে বা ছুঁতে কেমন তা নয়, আসল মান হলো এটি ব্যবহারে কতটা নির্ভরতা দেয়।"
            )}"
          </p>
          <span className="text-[11px] font-mono text-slate-500 font-semibold mt-1.5 block">
            — {t("Azraq Direct Promise", "আজরাক ডিরেক্ট নিশ্চয়তা")}
          </span>
        </div>

      </div>
    </section>
  );
}
