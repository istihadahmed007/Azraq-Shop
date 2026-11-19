import React from 'react';
import {
  ShieldCheck,
  Headphones,
  RotateCcw,
  Award,
  Facebook,
  Youtube,
  Instagram
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Exact Reference Bottom Trust Ribbon
 * 
 * Restyles BrandValuePanel into one compact horizontal glass strip:
 * - 4 Customer Assurance Guarantees with blue icons & vertical separators:
 *   1. Secure Payment (100% Secure & Trusted)
 *   2. 24/7 Support (We're here to help)
 *   3. Easy Return (Hassle-Free Return)
 *   4. Best Quality (Premium Products)
 * - Follow Us section on the far right with circular social buttons.
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
      subtitle: t('Hassle-Free Return', '৭ দিনের রিপ্লেসমেন্ট সুবিধা'),
    },
    {
      icon: Award,
      title: t('Best Quality', 'সেরা কোয়ালিটি'),
      subtitle: t('Premium Products', 'ভেরিফাইড আসল পণ্য'),
    },
  ];

  return (
    <section
      id="brand-value-ribbon"
      className="w-full select-none border border-[rgba(130,170,205,0.25)] border-t-white/95 bg-white/75 backdrop-blur-2xl rounded-[24px] shadow-[0_12px_36px_-8px_rgba(112,200,237,0.1),0_2px_8px_-1px_rgba(25,59,91,0.03)] px-5 sm:px-8 py-3.5 sm:py-4 flex flex-col xl:flex-row items-center justify-between gap-4 transition-all"
    >
      {/* 4 Trust Badges with Subtle Vertical Dividers */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 flex-1 items-center">
        {trustBadges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 ${
                idx !== 0 ? 'md:border-l md:border-[rgba(130,170,205,0.22)] md:pl-5 lg:pl-6' : ''
              }`}
            >
              {/* Blue Icon inside soft circle */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#DDEEFF]/60 border border-[#70C8ED]/30 text-[#0877C9] shadow-2xs flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0877C9]" />
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <h4 className="text-xs sm:text-[13px] font-bold text-[#193B5B] truncate leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#718398] truncate mt-0.5 font-medium">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Follow Us Social Icons on the Far Right */}
      <div className="flex items-center gap-2.5 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:border-[rgba(130,170,205,0.22)] xl:pl-6 w-full xl:w-auto justify-center xl:justify-end">
        <span className="text-xs font-bold text-[#193B5B] mr-1">
          {t("Follow Us:", "ফলো করুন:")}
        </span>

        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#1877F2] border border-[rgba(130,170,205,0.3)] text-[#1877F2] hover:text-white shadow-2xs flex items-center justify-center transition-all hover:scale-105"
          title="Facebook"
          aria-label="Facebook"
        >
          <Facebook className="w-3.5 h-3.5" />
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#FF0000] border border-[rgba(130,170,205,0.3)] text-[#FF0000] hover:text-white shadow-2xs flex items-center justify-center transition-all hover:scale-105"
          title="YouTube"
          aria-label="YouTube"
        >
          <Youtube className="w-3.5 h-3.5" />
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#E4405F] border border-[rgba(130,170,205,0.3)] text-[#E4405F] hover:text-white shadow-2xs flex items-center justify-center transition-all hover:scale-105"
          title="Instagram"
          aria-label="Instagram"
        >
          <Instagram className="w-3.5 h-3.5" />
        </a>

        {/* TikTok */}
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#000000] border border-[rgba(130,170,205,0.3)] text-[#193B5B] hover:text-white shadow-2xs flex items-center justify-center transition-all hover:scale-105"
          title="TikTok"
          aria-label="TikTok"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.1 15.68a6.34 6.34 0 0 0 10.82 4.48c1.77-1.78 2.34-4.24 2.34-6.85V8.14a8.16 8.16 0 0 0 4.78 1.52v-3.4a4.85 4.85 0 0 1-1.45.43z"/>
          </svg>
        </a>
      </div>
    </section>
  );
}
