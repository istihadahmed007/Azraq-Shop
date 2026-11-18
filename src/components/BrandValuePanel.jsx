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
 * AZRAQ Shop — Retail Customer Assurance & Social Bar
 */
export default function BrandValuePanel() {
  const { t } = useShop();

  const benefits = [
    {
      icon: Truck,
      title: t('Free Delivery', 'ফ্রি ডেলিভারি'),
      desc: t('On orders over ৳3,000 nationwide', '৩,০০০৳ বা তদূর্ধ্ব অর্ডারে সারা দেশে'),
    },
    {
      icon: ShieldCheck,
      title: t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি'),
      desc: t('Pay upon receiving your parcel', 'পণ্য বুঝে নিয়ে নিশ্চিত মূল্য দিন'),
    },
    {
      icon: RotateCcw,
      title: t('7-Day Returns', '৭ দিনের রিটার্ন'),
      desc: t('Hassle-free replacement policy', 'সহজ ও নির্ভরযোগ্য রিটার্ন পলিসি'),
    },
    {
      icon: Headphones,
      title: t('Dedicated Support', 'সার্বক্ষণিক সহায়তা'),
      desc: t('+880 1851-172032 & WhatsApp', 'সরাসরি সহায়তা ও দ্রুত অর্ডার ট্র্যাকিং'),
    },
  ];

  return (
    <section className="w-full select-none">
      
      <div className="bg-[#F7FAFD] border border-[#D5E2EE]/90 rounded-[26px] px-5 sm:px-7 py-5 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-[0_10px_30px_rgba(50,75,100,0.07)]">
        
        {/* 4 Benefits with Clean Dividers */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 flex-1">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 ${
                  idx !== 0 ? 'md:border-l md:border-[#E1EDF7] md:pl-5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#EDF4F9] text-[#0877C9] border border-[#D5E2EE] flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#293B52] truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7D93] truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Icons on Far Right */}
        <div className="flex items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:border-[#E1EDF7] lg:pl-5 w-full lg:w-auto justify-center lg:justify-end">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] text-[#6B7D93] hover:text-[#0877C9] flex items-center justify-center transition-all shadow-2xs"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] text-[#6B7D93] hover:text-[#0877C9] flex items-center justify-center transition-all shadow-2xs"
            title="YouTube"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#EDF4F9] hover:bg-white border border-[#D5E2EE] text-[#6B7D93] hover:text-[#0877C9] flex items-center justify-center transition-all shadow-2xs"
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