import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowRight,
  Facebook,
  Youtube,
  Instagram,
  QrCode
} from 'lucide-react';
import AzraqLogo, { AzraqBrandSymbol } from './AzraqLogo';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

/**
 * AZRAQ Shop — Clean Storefront Footer
 * 
 * 3-Panel Composition:
 * - Panel 1: Customer Invitation & WhatsApp Assistance Action.
 * - Panel 2: Direct Contact (email, phone, address, social links).
 * - Panel 3: Quick Connect, QR Code & Store Shortcuts (Track Order, Collections, Admin).
 * - Bottom Bar: Copyright and genuine store tagline.
 */
export default function Footer() {
  const { navigateTo, setIsTrackingOpen, setIsAdminOpen, t } = useShop();

  return (
    <footer id="footer-section" className="w-full pt-2 pb-8 select-none">
      
      {/* Outer Grounded Container */}
      <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-800 shadow-md">

        {/* 3-Panel Horizontal Arrangement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pb-8 border-b border-slate-800">

          {/* PANEL 1: INVITATION & PRIMARY ACTION (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#185ADB] uppercase tracking-wide block">
                {t("Curated Storefront", "বাছাইকৃত স্টোরফ্রন্ট")}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                {t("Elevate your everyday with AZRAQ", "দৈনন্দিন জীবনে আনুন প্রিমিয়াম ছোঁয়া")}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(
                  "Have a question about our verified catalog, bulk orders, or need shopping assistance? Our team is available on WhatsApp daily.",
                  "আসল গ্যাজেটস ও লাইফস্টাইল পণ্য সম্পর্কে যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।"
                )}
              </p>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/8801851172032"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <span>{t("Get in Touch", "যোগাযোগ করুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PANEL 2: DIRECT CONTACT INFORMATION (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-3">
                {t("Contact Details", "যোগাযোগ")}
              </span>

              <div id="footer-contact" className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/80 text-[#185ADB] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <a href="mailto:support@azraqtrips.com" className="font-medium hover:text-white transition-colors truncate">
                    support@azraqtrips.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/80 text-[#185ADB] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <a href="tel:+8801851172032" className="font-medium hover:text-white transition-colors">
                    +880 1851-172032
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/80 text-[#185ADB] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-400">Dhaka, Bangladesh</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/80 text-[#185ADB] flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-400">azraqshop.com</span>
                </div>
              </div>
            </div>

            {/* Social Icons Strip */}
            <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-colors"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-pink-400 flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/8801851172032"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PANEL 3: CONNECT & QR CODE (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                {t("Quick Chat", "সহজ অর্ডার")}
              </span>
              <p className="text-xs text-slate-400">
                {t("Scan or click to chat with dedicated support.", "দ্রুত সহায়তা ও অর্ডারের জন্য স্ক্যান করুন।")}
              </p>
            </div>

            {/* QR Card with Azraq Brand Seal */}
            <div className="my-4 flex items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-900 border border-slate-700/70">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">AZRAQ Quick Chat</span>
                <span className="text-[11px] text-slate-400 mt-0.5">+880 1851-172032</span>
                <span className="text-[10px] text-emerald-400 font-medium mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {t("Support Online", "অনলাইন")}
                </span>
              </div>

              {/* QR Code Container */}
              <div className="w-14 h-14 rounded-lg bg-white p-1 flex items-center justify-center relative shrink-0">
                <QrCode className="w-full h-full text-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-4 h-4 rounded-full bg-white border border-slate-300 flex items-center justify-center">
                    <AzraqBrandSymbol size="xs" className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Customer Care Shortcuts */}
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-medium text-slate-400">
              <button
                onClick={() => setIsTrackingOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t("Track Order", "ট্র্যাক অর্ডার")}
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => navigateTo('collections')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t("All Collections", "কালেকশন")}
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t("Admin", "অ্যাডমিন")}
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM SUB-BAR */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © 2026 AZRAQ. All rights reserved.
          </div>

          <div className="font-mono text-[11px] text-slate-400 font-medium">
            Curated Everyday Goods • Bangladesh
          </div>
        </div>

      </div>

    </footer>
  );
}
