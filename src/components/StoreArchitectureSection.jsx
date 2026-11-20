import React from 'react';
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Clock,
  Headphones,
  Package,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Retail Infrastructure & Customer Reassurance
 * 
 * 3-Column Grounded Arrangement:
 * - Column 1: Core Catalog Categories & Direct Supply Quality
 * - Column 2: Service Standards & Retail Infrastructure (Pillars Grid)
 * - Column 3: The AZRAQ Promise (Verified standards)
 */
export default function StoreArchitectureSection() {
  const { t } = useShop();

  const specialties = [
    { label: t("Gadgets & Smart Audio", "গ্যাজেটস ও অডিও"), desc: t("Direct manufacturer import", "অনুমোদিত প্রস্তুতকারক থেকে সংগৃহীত") },
    { label: t("Kitchen & Home Appliances", "কিচেন ও হোম অ্যাপ্লায়েন্স"), desc: t("Tested for daily durability", "দীর্ঘস্থায়িত্ব নিশ্চিত করা") },
    { label: t("Contemporary Men's Wardrobe", "মেনস ফ্যাশন ও পোশাক"), desc: t("Curated fabrics and fits", "উন্নত মানের ফেব্রিক ও কাটিং") },
    { label: t("Everyday Living & Atmosphere", "হোম ও লিভিং"), desc: t("Organizers, diffusers & lighting", "দৈনন্দিন কাজের প্রয়োজনীয় সামগ্রী") },
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
    { icon: Headphones, title: t("Support", "সার্বক্ষণিক সহায়তা"), sub: "WhatsApp" },
  ];

  return (
    <section className="w-full select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        {/* COLUMN 1: STORE SPECIALTIES (col-span-4) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {t("Catalog Coverage", "ক্যাটালগ কভারেজ")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t("Directly sourced everyday goods across primary lifestyle categories.", "দৈনন্দিন জীবনের প্রয়োজনীয় পণ্যের আসল সম্ভার।")}
            </p>
          </div>

          <div className="space-y-3.5 my-6">
            {specialties.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#185ADB] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t("Verified Inventory Status", "ভেরিফাইড ইনভেন্টরি")}</span>
            <span className="font-mono font-semibold text-slate-900">AZRAQ 2026</span>
          </div>
        </div>

        {/* COLUMN 2: SERVICE PILLARS (col-span-4) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {t("Retail Infrastructure", "রিটেইল অবকাঠামো")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t("Operational standards ensuring fast doorstep fulfillment.", "সরাসরি মানসম্মত ডেলিভারি ব্যবস্থা।")}
            </p>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 p-2.5 flex flex-col items-center justify-center text-center transition-colors group cursor-default"
                >
                  <div className="w-7 h-7 rounded-lg bg-white text-[#185ADB] shadow-xs flex items-center justify-center mb-1.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 leading-tight truncate w-full">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 truncate w-full mt-0.5">
                    {item.sub}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t("Integrated Logistics", "লজিস্টিক পার্টনার")}</span>
            <span className="font-mono font-semibold text-slate-900">Direct BD</span>
          </div>
        </div>

        {/* COLUMN 3: THE AZRAQ PROMISE (col-span-4) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {t("The AZRAQ Standard", "আজরাক মানদণ্ড")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t("Four pillars backing every customer purchase.", "প্রতিটি অর্ডারে আমাদের চার স্তম্ভের অঙ্গীকার।")}
            </p>
          </div>

          <div className="space-y-3 my-6">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#185ADB] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t("100% Authentic Products", "১০০% আসল পণ্য")}</div>
                <div className="text-[11px] text-slate-500">{t("Inspected prior to dispatch", "পাঠানোর আগে যাচাইকৃত")}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#185ADB] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t("Nationwide Delivery", "সারাদেশে ডেলিভারি")}</div>
                <div className="text-[11px] text-slate-500">{t("Covering all 64 districts in Bangladesh", "৬৪ জেলায় ক্যাশ অন ডেলিভারি")}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#185ADB] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t("7-Day Easy Replacement", "৭ দিনের রিপ্লেসমেন্ট")}</div>
                <div className="text-[11px] text-slate-500">{t("Hassle-free defective item swap", "ত্রুটিযুক্ত পণ্যে সহজ বদল")}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Headphones className="w-5 h-5 text-[#185ADB] shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-900">{t("Direct WhatsApp Support", "সরাসরি হোয়াটসঅ্যাপ সাপোর্ট")}</div>
                <div className="text-[11px] text-slate-500">+880 1851-172032</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t("Customer Satisfaction Guarantee", "ক্রেতা সন্তুষ্টি নিশ্চয়তা")}</span>
            <span className="font-mono font-semibold text-[#185ADB]">100%</span>
          </div>
        </div>

      </div>
    </section>
  );
}
