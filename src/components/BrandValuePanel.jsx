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

export default function BrandValuePanel() {
  const { t } = useShop();

  const benefits = [
    {
      icon: ShieldCheck,
      title: t('Secure Payment', 'নিরাপদ পেমেন্ট'),
      desc: t('100% Secure & Trusted', '১০০% বিশ্বস্ত ও নিরাপদ'),
    },
    {
      icon: Headphones,
      title: t('24/7 Support', '২৪/৭ কাস্টমার সাপোর্ট'),
      desc: t("We're here to help", 'সার্বক্ষণিক সহায়তা'),
    },
    {
      icon: RotateCcw,
      title: t('Easy Return', 'সহজ রিটার্ন সুবিধা'),
      desc: t('Hassle-Free Return', 'ঝামেলাহীন রিটার্ন পলিসি'),
    },
    {
      icon: Award,
      title: t('Best Quality', 'সেরা কোয়ালিটি'),
      desc: t('Verified Supplier QC', 'যাচাইকৃত আসল পণ্য'),
    },
  ];

  return (
    <section className="w-full py-6 select-none">
      {/* Long Rounded Translucent Trust Bar (Reference Screenshot Exact Match) */}
      <div className="rounded-[28px] bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_rgba(6,43,79,0.06)] px-6 py-4.5 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* 4 Benefits with Vertical Dividers */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8 flex-1">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 ${
                  idx !== 0 ? 'lg:border-l lg:border-[#D9F0FF]/80 lg:pl-6' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EDF5FD] to-[#D9EDFD] flex items-center justify-center shrink-0 shadow-xs text-[#0877C9]">
                  <Icon className="w-5 h-5 text-[#0877C9]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#101C35] truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-medium text-[#71849B] truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Icons on Far Right (Reference Match) */}
        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:border-[#D9F0FF]/80 lg:pl-6 w-full lg:w-auto justify-center lg:justify-end">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-white shadow-xs hover:bg-[#0877C9] text-[#0877C9] hover:text-white flex items-center justify-center transition-all hover:scale-110"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-white shadow-xs hover:bg-[#2563EB] text-[#2563EB] hover:text-white flex items-center justify-center transition-all hover:scale-110"
            title="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-white shadow-xs hover:bg-[#F27A3F] text-[#F27A3F] hover:text-white flex items-center justify-center transition-all hover:scale-110"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
