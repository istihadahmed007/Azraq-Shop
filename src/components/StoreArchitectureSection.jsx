import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Clock,
  Headphones,
  Package,
  Layers,
  CheckCircle2,
  Gem
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { AzraqBrandSymbol } from './AzraqLogo';

/**
 * AZRAQ Shop — Section D: Supporting Content 3-Column Glass Arrangement
 * 
 * Accurately reproduces the reference's 3-column layout:
 * - Column 1: Department Specialties & Catalog Popularity with Cyan Progress Bars
 * - Column 2: Service Standards & Retail Pillars (3x3 Frosted Glass Tile Grid)
 * - Column 3: The Azraq Promise (Circular diagram with central 3D crystal prism and 4 orbit nodes)
 */
export default function StoreArchitectureSection() {
  const { t } = useShop();

  const specialties = [
    { label: t("Gadgets & Smart Audio", "গ্যাজেটস ও অডিও"), pct: 95 },
    { label: t("Kitchen & Home Appliances", "কিচেন ও হোম অ্যাপ্লায়েন্স"), pct: 90 },
    { label: t("Contemporary Men's Wardrobe", "মেনস ফ্যাশন ও পোশাক"), pct: 88 },
    { label: t("Everyday Living & Atmosphere", "হোম ও লিভিং"), pct: 85 },
    { label: t("Sports, Fitness & Kids", "স্পোর্টস ও ফিটনেস"), pct: 82 },
    { label: t("Direct Import Quality Standards", "ডাইরেক্ট ইমপোর্ট কোয়ালিটি"), pct: 98 },
  ];

  const pillars = [
    { icon: Package, title: t("Direct Import", "ডাইরেক্ট ইমপোর্ট"), sub: "EasyDrop" },
    { icon: Zap, title: t("GaN Charging", "ফাস্ট চার্জিং"), sub: "Certified" },
    { icon: Headphones, title: t("Hi-Fi Sound", "প্রিমিয়াম সাউন্ড"), sub: "Tested" },
    { icon: Truck, title: t("Nationwide COD", "ক্যাশ অন ডেলিভারি"), sub: "64 Districts" },
    { icon: RotateCcw, title: t("7-Day Exchange", "সহজ রিপ্লেসমেন্ট"), sub: "Guaranteed" },
    { icon: CreditCard, title: t("Digital Pay", "বিকাশ ও নগদ"), sub: "Paymently" },
    { icon: Clock, title: t("Fast Dispatch", "দ্রুততম ডেলিভারি"), sub: "Same Day" },
    { icon: ShieldCheck, title: t("100% Genuine", "১০০% আসল পণ্য"), sub: "Inspected" },
    { icon: Headphones, title: t("24/7 Hotline", "সার্বক্ষণিক সহায়তা"), sub: "WhatsApp" },
  ];

  return (
    <section className="w-full select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        {/* COLUMN 1: STORE SPECIALTIES & PROGRESS BARS (col-span-4) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
              + {t("STORE SPECIALTIES", "স্টোর স্পেশালিটি")}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#193B5B] tracking-tight mt-0.5">
              {t("Catalog Coverage & Demand", "ক্যাটালগ কভারেজ ও চাহিদা")}
            </h3>
          </div>

          <div className="space-y-4 my-6">
            {specialties.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#193B5B]">
                  <span className="truncate pr-2">{item.label}</span>
                  <span className="text-[11px] font-mono text-[#0877C9] shrink-0">{item.pct}%</span>
                </div>
                {/* Clean Cyan Progress Bar */}
                <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden border border-[rgba(130,170,205,0.2)]">
                  <div
                    className="h-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(112,200,237,0.5)]"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between text-[11px] text-[#718398]">
            <span>{t("Verified Inventory Status", "ভেরিফাইড ইনভেন্টরি")}</span>
            <span className="font-mono font-bold text-[#193B5B]">AZRAQ 2026</span>
          </div>
        </div>

        {/* COLUMN 2: SERVICE PILLARS (3x3 Frosted Glass Grid) (col-span-4) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
              + {t("SERVICE STANDARDS", "সার্ভিস স্ট্যান্ডার্ড")}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#193B5B] tracking-tight mt-0.5">
              {t("Retail Infrastructure", "রিটেইল অবকাঠামো")}
            </h3>
          </div>

          {/* 3x3 Grid Matching Reference Tech Stack */}
          <div className="grid grid-cols-3 gap-2.5 my-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-[16px] bg-white/70 hover:bg-white border border-[rgba(130,170,205,0.25)] hover:border-[#70C8ED]/60 p-2.5 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-[0_8px_20px_rgba(112,200,237,0.2)] transition-all group cursor-default"
                >
                  <div className="w-7 h-7 rounded-full bg-[#DDEEFF]/60 group-hover:bg-[#70C8ED]/30 text-[#0877C9] flex items-center justify-center mb-1.5 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#193B5B] leading-tight truncate w-full">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono text-[#718398] truncate w-full mt-0.5">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between text-[11px] text-[#718398]">
            <span>{t("Integrated Logistics", "লজিস্টিক পার্টনার")}</span>
            <span className="font-mono font-bold text-[#193B5B]">Direct BD</span>
          </div>
        </div>

        {/* COLUMN 3: THE AZRAQ PROMISE (Circular Orbit Diagram with 3D Crystal Prism) (col-span-4) */}
        <div className="lg:col-span-4 rounded-[28px] border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-[#F8FBFF]/75 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_16px_40px_-10px_rgba(112,200,237,0.12),0_4px_16px_-2px_rgba(25,59,91,0.04)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
              + {t("VERIFIED PROMISE", "গুণগত নিশ্চয়তা")}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-[#193B5B] tracking-tight mt-0.5">
              {t("The AZRAQ Standard", "আজরাক মানদণ্ড")}
            </h3>
          </div>

          {/* Circular Orbit Diagram with Central 3D Crystal Prism */}
          <div className="relative my-6 flex items-center justify-center py-4">
            {/* Outer dotted orbit ring */}
            <div className="w-56 h-56 rounded-full border border-dashed border-[#70C8ED]/40 flex items-center justify-center relative">
              
              {/* Inner ambient glow */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#70C8ED]/20 via-[#DDEEFF]/40 to-transparent blur-md absolute" />

              {/* Central Crystal Diamond / Prism */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white via-[#DDEEFF] to-[#70C8ED]/40 border border-white shadow-[0_8px_24px_rgba(112,200,237,0.4)] flex flex-col items-center justify-center z-10 p-2 transform rotate-45">
                <div className="transform -rotate-45 flex flex-col items-center justify-center">
                  <Gem className="w-6 h-6 text-[#0877C9]" />
                  <span className="text-[8px] font-mono font-black text-[#193B5B] mt-1 tracking-wider uppercase">
                    GENUINE
                  </span>
                </div>
              </div>

              {/* Orbit Node Top: 100% Authentic */}
              <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-white/90 border border-[rgba(130,170,205,0.3)] shadow-xs text-[10px] font-bold text-[#193B5B]">
                {t("100% Authentic", "১০০% আসল")}
              </div>

              {/* Orbit Node Right: Quality Checked */}
              <div className="absolute -right-3 px-3 py-1 rounded-full bg-white/90 border border-[rgba(130,170,205,0.3)] shadow-xs text-[10px] font-bold text-[#193B5B]">
                {t("Quality Checked", "যাচাইকৃত")}
              </div>

              {/* Orbit Node Bottom: Rapid Dispatch */}
              <div className="absolute -bottom-3.5 px-3 py-1 rounded-full bg-white/90 border border-[rgba(130,170,205,0.3)] shadow-xs text-[10px] font-bold text-[#193B5B]">
                {t("Rapid Dispatch", "দ্রুত ডেলিভারি")}
              </div>

              {/* Orbit Node Left: Transparent BDT */}
              <div className="absolute -left-3 px-3 py-1 rounded-full bg-white/90 border border-[rgba(130,170,205,0.3)] shadow-xs text-[10px] font-bold text-[#193B5B]">
                {t("Transparent BDT", "স্বচ্ছ মূল্য")}
              </div>

            </div>
          </div>

          <div className="pt-2 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between text-[11px] text-[#718398]">
            <span>{t("Customer Satisfaction Guarantee", "ক্রেতা সন্তুষ্টি নিশ্চয়তা")}</span>
            <span className="font-mono font-bold text-[#0877C9]">100%</span>
          </div>
        </div>

      </div>
    </section>
  );
}
