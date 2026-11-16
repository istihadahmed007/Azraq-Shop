import React, { useState } from 'react';
import { ArrowRight, Quote, CheckCircle2, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="rounded-3xl bg-azraq-navy border border-azraq-purple/20 p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
        
        {/* Atmospheric ambient violet lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-azraq-violet/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-azraq-azure/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Column: Portrait & Editorial Quote (Reference Recreated) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            
            {/* Visual Portrait with Violet Mood Lighting */}
            <div className="relative w-44 h-56 sm:w-52 sm:h-64 rounded-3xl overflow-hidden flex-shrink-0 border-2 border-azraq-purple/30 shadow-2xl bg-gradient-to-tr from-[#1E1B4B] to-[#4338CA]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="AZRAQ Editorial Tastemaker"
                className="w-full h-full object-cover mix-blend-luminosity filter contrast-125 hover:mix-blend-normal transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-azraq-navy via-azraq-violet/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-azraq-lime bg-azraq-navy/80 px-2.5 py-1 rounded-full">
                  Dhaka Atelier
                </span>
              </div>
            </div>

            {/* Testimonial & Quote */}
            <div className="space-y-4 text-center sm:text-left">
              {/* Lime Quote Mark */}
              <div className="inline-block text-azraq-lime">
                <Quote className="w-10 h-10 fill-azraq-lime/20" />
              </div>

              {/* Quote Body */}
              <p className="text-xl sm:text-2xl font-serif italic text-white/95 leading-relaxed">
                "{t(
                  "AZRAQ delivers more than just everyday goods — it delivers elevated everyday living.",
                  "আজরাক কেবল সাধারণ পণ্যই পৌঁছে দেয় না — এটি দৈনন্দিন জীবনকে করে তোলে অনন্য ও অভিজাত।"
                )}"
              </p>

              {/* Author */}
              <div className="pt-2">
                <p className="font-extrabold text-sm text-white">
                  — Nabila Rahman
                </p>
                <p className="text-xs text-azraq-purple font-medium">
                  {t("Fashion & Lifestyle Editor, Dhaka", "ফ্যাশন ও লাইফস্টাইল কিউরেটর, ঢাকা")}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: CTA Box with Neon-Lime Accent Border & Action Button */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-azraq-charcoal/80 border border-azraq-purple/40 p-6 sm:p-8 space-y-6 relative hover:border-azraq-lime/50 transition-colors shadow-xl">
              
              <div className="space-y-2">
                <span className="text-xs font-black tracking-widest text-azraq-lime uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("AZRAQ CIRCLE MEMBERSHIP", "আজরাক সার্কেল মেম্বারশিপ")}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {t("READY TO ELEVATE YOUR STYLE?", "আপনার প্রতিদিনকে সাজাতে প্রস্তুত?")}
                </h3>

                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {t(
                    "Join thousands who trust AZRAQ for curated everyday goods, quality craft, and reliable door-to-door delivery. Get ৳200 voucher code on signup.",
                    "আজরাক সার্কেলে যুক্ত হোন। প্রথম অর্ডারে উপভোগ করুন ২০০ টাকা বিশেষ ডিসকাউন্ট।"
                  )}
                </p>
              </div>

              {/* Form / CTA */}
              {!isJoined ? (
                <form onSubmit={handleJoin} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("Mobile Number or Email (e.g. 017...)", "মোবাইল নম্বর বা ইমেইল লিখুন...")}
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="w-full bg-azraq-navy border border-azraq-purple/40 rounded-full px-4 py-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-azraq-lime"
                    />
                  </div>

                  {/* Neon Lime Action Button (Reference Exact Match) */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-between pl-6 pr-2 py-2 rounded-full bg-azraq-lime hover:bg-[#bbf035] text-azraq-navy text-xs sm:text-sm font-extrabold tracking-tight shadow-glow-lime transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>{t("JOIN AZRAQ FAMILY", "আজরাক পরিবারে যোগ দিন")}</span>
                    <span className="w-8 h-8 rounded-full bg-azraq-navy text-white flex items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-azraq-lime/10 border border-azraq-lime/40 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-azraq-lime mx-auto" />
                  <p className="text-sm font-bold text-azraq-lime">
                    {t("Welcome to AZRAQ Circle!", "আজরাক সার্কেলে স্বাগতম!")}
                  </p>
                  <p className="text-xs text-white/80">
                    {t("Use voucher code at checkout:", "চেকআউটে ভাউচার কোডটি ব্যবহার করুন:")}{' '}
                    <span className="font-mono font-black text-azraq-lime underline">AZRAQNEW</span>
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-[11px] text-white/50 pt-2 border-t border-white/10">
                <span>✓ {t("Zero spam", "জিরো স্প্যাম")}</span>
                <span>✓ {t("Members-only drops", "এক্সক্লুসিভ কালেকশন")}</span>
                <span>✓ {t("Priority BD delivery", "প্রায়োরিটি ডেলিভারি")}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

