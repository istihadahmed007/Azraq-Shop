import React, { useState } from 'react';
import { ArrowRight, Quote, CheckCircle2, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export default function EditorialSection() {
  const { showToast, t } = useShop();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      showToast('Please enter your mobile or email', 'error');
      return;
    }
    setIsJoined(true);
    showToast('Welcome to the AZRAQ Circle! ৳200 promo voucher sent: AZRAQNEW', 'success');
  };

  return (
    <section className="w-full py-4 select-none">
      <div className="rounded-[28px] bg-[#F8FBFF]/85 backdrop-blur-2xl border border-[rgba(130,170,205,0.3)] border-t-white/95 p-6 sm:p-10 lg:p-12 text-[#193B5B] relative overflow-hidden shadow-[0_16px_40px_-10px_rgba(112,200,237,0.18),0_4px_16px_-2px_rgba(25,59,91,0.04)]">
        
        {/* Atmospheric ambient lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#70C8ED]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Portrait & Editorial Quote */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            
            <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden flex-shrink-0 border border-[rgba(130,170,205,0.35)] shadow-xl bg-gradient-to-tr from-[#0E2742] to-[#193B5B]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="AZRAQ Editorial Tastemaker"
                className="w-full h-full object-cover mix-blend-luminosity filter contrast-125 hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#193B5B] via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white bg-[#193B5B]/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                  Dhaka Atelier
                </span>
              </div>
            </div>

            {/* Testimonial & Quote */}
            <div className="space-y-3 text-center sm:text-left">
              <div className="inline-block text-[#0877C9]">
                <Quote className="w-8 h-8 fill-[#0877C9]/20" />
              </div>

              <p className="text-lg sm:text-xl font-serif italic text-[#193B5B] leading-relaxed">
                "{t(
                  "AZRAQ delivers more than just everyday goods — it delivers elevated everyday living.",
                  "আজরাক কেবল সাধারণ পণ্যই পৌঁছে দেয় না — এটি দৈনন্দিন জীবনকে করে তোলে অনন্য ও অভিজাত।"
                )}"
              </p>

              <div>
                <h5 className="font-bold text-sm text-[#193B5B]">
                  Nuzhat Tasnim
                </h5>
                <p className="text-xs text-[#718398]">
                  Creative Director, Dhaka Studio
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: VIP Club Opt-in */}
          <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl border border-[rgba(130,170,205,0.25)] rounded-2xl p-6 shadow-sm">
            <span className="text-[10px] font-mono text-[#0877C9] uppercase tracking-[0.18em] block font-bold mb-1">
              + {t("JOIN THE CIRCLE", "আজরাক সার্কেলে যুক্ত হোন")}
            </span>
            <h4 className="text-base sm:text-lg font-black text-[#193B5B] tracking-tight">
              {t("Exclusive Drops & Special Vouchers", "স্পেশাল অফার ও ভাউচার")}
            </h4>
            <p className="text-xs text-[#718398] mt-1 mb-4 leading-relaxed">
              {t("Sign up for preview access to new collections and verified seasonal clearance events.", "নতুন পণ্য ও বিশেষ ছাড়ের নোটিফিকেশন পেতে যুক্ত হোন।")}
            </p>

            {!isJoined ? (
              <form onSubmit={handleJoin} className="space-y-2.5">
                <input
                  type="text"
                  placeholder="Enter phone (017...) or email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full bg-white/90 border border-[rgba(130,170,205,0.3)] text-xs text-[#193B5B] placeholder-[#718398] focus:outline-none focus:border-[#70C8ED] shadow-inner font-medium"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white font-bold text-xs shadow-[0_4px_16px_rgba(112,200,237,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t("Join & Claim ৳200 Voucher", "যুক্ত হয়ে ২০০৳ ভাউচার নিন")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t("Voucher Sent: AZRAQNEW", "ভাউচার কোড: AZRAQNEW")}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  {t("৳200 discount code activated for your next order.", "আপনার পরবর্তী অর্ডারে ২০০ টাকা ছাড় উপভোগ করুন।")}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
