import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowRight,
  Sparkles,
  Package,
  Shield,
  Layers,
  Facebook,
  Youtube,
  Instagram,
  QrCode
} from 'lucide-react';
import AzraqLogo, { AzraqBrandSymbol } from './AzraqLogo';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

/**
 * AZRAQ Shop — Section E: Spacious Multi-Panel Futuristic Glass Footer
 * 
 * Recreates the exact multi-panel composition of the reference design:
 * - Panel 1 (Left): "LET'S BUILD SOMETHING EXTRAORDINARY" adapted to "ELEVATE YOUR EVERYDAY WITH AZRAQ"
 *   with an icy-blue glowing action button: "GET IN TOUCH →".
 * - Panel 2 (Center): "CONTACT" with email, phone, location, domain, and circular glass social icons.
 * - Panel 3 (Right): "LET'S CONNECT" with QR code scan badge and crystal geometric art.
 * - Bottom Bar: "© 2026 Azraq Shop. All rights reserved." • ✦ • "CURATED EXCELLENCE. AUTHENTIC LIVING."
 * - Maintains 100% of all existing contact data, order tracking, admin portal, and customer care links.
 */
export default function Footer() {
  const { collections, navigateTo, setIsTrackingOpen, setIsAdminOpen, t } = useShop();
  const { openAuthModal } = useAuth();

  return (
    <footer id="footer-section" className="w-full pt-2 pb-8 select-none">
      
      {/* Outer Glassmorphic Container (32px radius) */}
      <div className="bg-[#F8FBFF]/80 backdrop-blur-2xl border border-[rgba(130,170,205,0.25)] border-t-white/95 rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_20px_48px_-12px_rgba(112,200,237,0.15),0_4px_16px_-2px_rgba(25,59,91,0.04)] text-[#193B5B]">

        {/* 3-Panel Horizontal Arrangement (Identical layout to reference bottom section) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pb-8 border-b border-[rgba(130,170,205,0.18)]">

          {/* PANEL 1: INVITATION & PRIMARY ACTION (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-[24px] bg-white/70 border border-[rgba(130,170,205,0.25)] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold">
                + {t("CURATED STOREFRONT", "বাছাইকৃত স্টোরফ্রন্ট")}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#193B5B] tracking-tight leading-tight uppercase">
                {t("ELEVATE YOUR EVERYDAY WITH AZRAQ", "দৈনন্দিন জীবনে আনুন প্রিমিয়াম ছোঁয়া")}
              </h3>
              <p className="text-xs text-[#718398] leading-relaxed">
                {t(
                  "Have a question about our genuine catalog, bulk corporate orders, or need shopping assistance? We're always open to assist you.",
                  "আসল গ্যাজেটস ও লাইফস্টাইল পণ্য সম্পর্কে যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে নির্দ্বিধায় যোগাযোগ করুন।"
                )}
              </p>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/8801851172032"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] hover:to-[#2563EB] text-white text-xs font-bold transition-all shadow-[0_8px_24px_rgba(112,200,237,0.45)] hover:shadow-[0_12px_32px_rgba(112,200,237,0.6)] cursor-pointer"
              >
                <span>{t("GET IN TOUCH", "যোগাযোগ করুন")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PANEL 2: DIRECT CONTACT INFORMATION (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-[24px] bg-white/70 border border-[rgba(130,170,205,0.25)] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-3">
                + {t("CONTACT", "যোগাযোগ")}
              </span>

              <div id="footer-contact" className="space-y-3 text-xs text-[#193B5B]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-2xs flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <a href="mailto:support@azraqtrips.com" className="font-semibold hover:text-[#0877C9] transition-colors truncate">
                    support@azraqtrips.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-2xs flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <a href="tel:+8801851172032" className="font-semibold hover:text-[#0877C9] transition-colors">
                    +880 1851-172032
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-2xs flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-[#718398]">Dhaka, Bangladesh</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-[#0877C9] border border-[rgba(130,170,205,0.3)] shadow-2xs flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-[#718398]">azraqshop.com</span>
                </div>
              </div>
            </div>

            {/* Social Icons Strip in Glass Circles (Reference Style) */}
            <div className="pt-5 mt-4 border-t border-[rgba(130,170,205,0.18)] flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#DDEEFF] border border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-[#0877C9] shadow-xs flex items-center justify-center transition-all"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#DDEEFF] border border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-rose-600 shadow-xs flex items-center justify-center transition-all"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#DDEEFF] border border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-pink-600 shadow-xs flex items-center justify-center transition-all"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/8801851172032"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#DDEEFF] border border-[rgba(130,170,205,0.3)] text-[#718398] hover:text-emerald-600 shadow-xs flex items-center justify-center transition-all"
                title="WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PANEL 3: CONNECT & QR CODE (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-[24px] bg-white/70 border border-[rgba(130,170,205,0.25)] p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
                + {t("LET'S CONNECT", "সহজ অর্ডার")}
              </span>
              <p className="text-xs text-[#718398]">
                {t("Scan or click to chat with dedicated support.", "দ্রুত সহায়তা ও অর্ডারের জন্য স্ক্যান করুন।")}
              </p>
            </div>

            {/* QR Card with Azraq Brand Seal */}
            <div className="my-4 flex items-center justify-between gap-4 p-3 rounded-[20px] bg-white/80 border border-[rgba(130,170,205,0.25)] shadow-inner">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#193B5B]">AZRAQ Quick Chat</span>
                <span className="text-[10px] text-[#718398] mt-0.5">+880 1851-172032</span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t("Online Now", "অনলাইন")}
                </span>
              </div>

              {/* QR Code Container */}
              <div className="w-16 h-16 rounded-xl bg-white border border-[rgba(130,170,205,0.3)] p-1.5 flex items-center justify-center relative shadow-xs">
                <QrCode className="w-full h-full text-[#193B5B]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-5 h-5 rounded-full bg-white border border-[#70C8ED] flex items-center justify-center shadow-xs">
                    <AzraqBrandSymbol size="xs" className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Customer Care Shortcuts */}
            <div className="pt-2 border-t border-[rgba(130,170,205,0.18)] flex items-center justify-between text-xs font-semibold">
              <button
                onClick={() => setIsTrackingOpen(true)}
                className="hover:text-[#0877C9] transition-colors cursor-pointer"
              >
                {t("Track Order", "ট্র্যাক অর্ডার")}
              </button>
              <span className="text-[#82AACD]/40">•</span>
              <button
                onClick={() => navigateTo('collections')}
                className="hover:text-[#0877C9] transition-colors cursor-pointer"
              >
                {t("All Collections", "কালেকশন")}
              </button>
              <span className="text-[#82AACD]/40">•</span>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-[#0877C9] transition-colors cursor-pointer"
              >
                {t("Admin", "অ্যাডমিন")}
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM SUB-BAR (Identical to reference bottom bar) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#718398]">
          <div>
            © 2026 Azraq Shop. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-[#70C8ED]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <div className="font-mono text-[10px] tracking-wider uppercase text-[#193B5B] font-bold">
            CURATED EXCELLENCE. AUTHENTIC LIVING.
          </div>
        </div>

      </div>

    </footer>
  );
}
