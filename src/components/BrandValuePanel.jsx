import React from 'react';
import { 
  Truck,
  ShieldCheck, 
  RotateCcw, 
  Headphones, 
  Facebook, 
  Youtube, 
  Instagram 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

/**
 * AZRAQ Shop — Long Rounded Transparent Benefits & Trust Bar
 */
export default function BrandValuePanel() {
  const { t } = useShop();

  const benefits = [
    {
      icon: Truck,
      title: t('Free Delivery', 'ফ্রি ডেলিভারি'),
      desc: t('On orders over ৳3,000', '৩,০০০৳ বা তদূর্ধ্ব অর্ডারে'),
    },
    {
      icon: ShieldCheck,
      title: t('Secure Payment', 'নিরাপদ পেমেন্ট'),
      desc: t('Paymently, bKash & COD', 'অনলাইন গেটওয়ে ও ক্যাশ অন ডেলিভারি'),
    },
    {
      icon: RotateCcw,
      title: t('Easy Returns', 'সহজ রিটার্ন'),
      desc: t('7-day verified policy', '৭ দিনের সহজ রিটার্ন পলিসি'),
    },
    {
      icon: Headphones,
      title: t('Customer Support', 'কাস্টমার সাপোর্ট'),
      desc: t('Dedicated assistance', 'সার্বক্ষণিক সহায়তা ও ট্র্যাকিং'),
    },
  ];

  return (
    <section className="w-full py-2 select-none">
      {/* Long Rounded Transparent Benefits Bar */}
      <div className="rounded-[28px] glass-panel px-6 py-4.5 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
        
        {/* 4 Benefits with Vertical Subtle Dividers */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 flex-1">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 ${
                  idx !== 0 ? 'lg:border-l lg:border-white/80 lg:pl-5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-[#EDF5FD] to-[#D9EDFD] border border-white/80 flex items-center justify-center shrink-0 shadow-2xs text-[#0877C9]">
                  <Icon className="w-5 h-5 text-[#0877C9]" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#101C35] truncate leading-tight">
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

        {/* Social Icons on Far Right */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:border-white/80 lg:pl-5 w-full lg:w-auto justify-center lg:justify-end">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-8.5 h-8.5 rounded-full glass-button flex items-center justify-center text-[#0877C9] hover:bg-[#0877C9] hover:text-white transition-all"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-8.5 h-8.5 rounded-full glass-button flex items-center justify-center text-[#0877C9] hover:bg-[#2563EB] hover:text-white transition-all"
            title="YouTube"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-8.5 h-8.5 rounded-full glass-button flex items-center justify-center text-[#0877C9] hover:bg-[#0877C9] hover:text-white transition-all"
            title="Instagram"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
