import React from 'react';
import {
  ShieldCheck,
  Headphones,
  RotateCcw,
  Award
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Bottom Customer Assurance Ribbon
 * 
 * 4 Customer Assurance Guarantees:
 * 1. Secure Payment (100% Secure & Trusted)
 * 2. 24/7 Support (WhatsApp Helpline)
 * 3. Easy Return (7-Day Replacement)
 * 4. Best Quality (Verified Authentic Products)
 */
export default function BrandValuePanel() {
  const { t } = useShop();

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: t('Secure Payment', 'নিরাপদ পেমেন্ট'),
      subtitle: t('100% Secure & Trusted', 'শতভাগ নিরাপদ ও নির্ভরযোগ্য'),
    },
    {
      icon: Headphones,
      title: t('24/7 Support', 'সার্বক্ষণিক সহায়তা'),
      subtitle: t("We're here to help", 'সরাসরি দ্রুত হেল্পলাইন'),
    },
    {
      icon: RotateCcw,
      title: t('Easy Return', 'সহজ রিটার্ন'),
      subtitle: t('7-Day Replacement', '৭ দিনের রিপ্লেসমেন্ট সুবিধা'),
    },
    {
      icon: Award,
      title: t('Best Quality', 'সেরা কোয়ালিটি'),
      subtitle: t('Verified Authentic', 'ভেরিফাইড আসল পণ্য'),
    },
  ];

  return (
    <section
      id="brand-value-ribbon"
      className="w-full select-none border border-slate-200/90 bg-white rounded-2xl shadow-xs px-5 sm:px-8 py-4 sm:py-5 flex flex-col xl:flex-row items-center justify-between gap-4 transition-all"
    >
      {/* 4 Trust Badges with Clean Dividers */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1 items-center">
        {trustBadges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 ${
                idx !== 0 ? 'md:border-l md:border-slate-100 md:pl-5 lg:pl-6' : ''
              }`}
            >
              {/* Blue Icon inside soft container */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 text-[#185ADB] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#185ADB]" />
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
