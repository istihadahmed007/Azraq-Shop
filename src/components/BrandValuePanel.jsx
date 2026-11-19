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
 * AZRAQ Shop — Retail Customer Assurance & Verified Service Guarantees
 */
export default function BrandValuePanel() {
  const { t } = useShop();

  const benefits = [
    {
      icon: Truck,
      title: t('Nationwide Delivery', 'সারাদেশে ডেলিভারি'),
      desc: t('Dhaka ৳80 • Outside ৳150', 'ঢাকা ৮০৳ • বাইরে ১৫০৳'),
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
      title: t('Dedicated Hotline', 'সার্বক্ষণিক সহায়তা'),
      desc: t('+880 1851-172032 & WhatsApp', 'সরাসরি সহায়তা ও দ্রুত অর্ডার ট্র্যাকিং'),
    },
  ];

  return (
    <section className="w-full select-none">
      
      <div className="bg-white border border-[#E5E3DA] rounded-[16px] px-5 sm:px-7 py-5 flex flex-col lg:flex-row items-center justify-between gap-5 shadow-[0_4px_20px_rgba(23,35,51,0.04)]">
        
        {/* 4 Benefits with Clean Dividers */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 flex-1">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 ${
                  idx !== 0 ? 'md:border-l md:border-[#E5E3DA] md:pl-5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-[8px] bg-[#FAF9F5] text-[#245BDB] border border-[#E5E3DA] flex items-center justify-center shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-bold text-[#172333] truncate leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#667085] truncate mt-0.5 font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social Icons on Far Right */}
        <div className="flex items-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:border-[#E5E3DA] lg:pl-5 w-full lg:w-auto justify-center lg:justify-end">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] text-[#667085] hover:text-[#245BDB] flex items-center justify-center transition-all shadow-xs"
            title="Facebook"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] text-[#667085] hover:text-[#245BDB] flex items-center justify-center transition-all shadow-xs"
            title="YouTube"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-[8px] bg-[#FAF9F5] hover:bg-white border border-[#E5E3DA] text-[#667085] hover:text-[#245BDB] flex items-center justify-center transition-all shadow-xs"
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
