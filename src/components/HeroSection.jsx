import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, ChevronRight, Laptop, Shirt, Heart, 
  Home, Dumbbell, Compass, Car, BookOpen, Gift, Flame, 
  ShieldCheck, Package, ShoppingBag, Eye
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroSection() {
  const { products, collections, navigateTo, setSelectedProduct, t } = useShop();

  const [activeSlide, setActiveSlide] = useState(0);

  // Category sidebar items matching the reference screenshot
  const categorySidebarItems = [
    { label: "Women's Fashion", bn: "মহিলাদের ফ্যাশন", icon: Shirt, slug: "jewelries-accessories" },
    { label: "Men's Fashion", bn: "পুরুষদের ফ্যাশন", icon: Shirt, slug: "men-clothing" },
    { label: "Beauty & Personal Care", bn: "সৌন্দর্য ও যত্ন", icon: Heart, slug: "health-beauty" },
    { label: "Electronics & IT", bn: "ইলেকট্রনিক্স ও গ্যাজেট", icon: Laptop, slug: "gadgets-it-accessories" },
    { label: "Home & Living", bn: "হোম ও লিভিং", icon: Home, slug: "home-lifestyle" },
    { label: "Sports & Outdoors", bn: "খেলাধুলা ও আউটডোর", icon: Dumbbell, slug: "sports-kids" },
    { label: "Baby & Toys", bn: "শিশু ও খেলনা", icon: Compass, slug: "baby-mom" },
    { label: "Kitchen & Dining", bn: "কিচেন ও ডাইনিং", icon: Home, slug: "kitchen-appliances" },
    { label: "Books & Stationery", bn: "বই ও স্টেশনারি", icon: BookOpen, slug: "print-on-demand" },
    { label: "Winter & Outerwear", bn: "উইন্টার কালেকশন", icon: Shirt, slug: "winter-collection" },
  ];

  const heroSlides = [
    {
      tag: t("NEW COLLECTION", "নতুন কালেকশন"),
      title: t("Upgrade Your Lifestyle Today", "আপনার লাইফস্টাইল উন্নত করুন আজই"),
      desc: t(
        "Find the latest trends, top brands and exclusive deals all in one place with verified delivery.",
        "সেরা ব্র্যান্ড, আধুনিক ট্রেন্ড ও আকর্ষণীয় ডিল পান এক ঠিকানায় নির্ভরযোগ্য হোম ডেলিভারিসহ।"
      ),
      cta: t("Shop Now", "এখনই কিনুন"),
      target: "shop-by-collection",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      featuredProduct: products.find(p => p.id === 'AZQ-0001') || products[0]
    },
    {
      tag: t("EXCLUSIVE EDITIONS", "প্রিমিয়াম গ্যাজেট"),
      title: t("Futuristic Tech Designed For Everyday Life", "আধুনিক প্রযুক্তির প্রতিদিনের অনুষঙ্গ"),
      desc: t(
        "Explore smart wearables, rapid charging systems, and premium audio verified for Bangladesh.",
        "স্মার্ট পরিধেয়, ফাস্ট চার্জিং ও উন্নত অডিও ডিভাইসের সমৃদ্ধ সমাহার।"
      ),
      cta: t("Explore Devices", "ডিভাইস দেখুন"),
      target: "all-products",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      featuredProduct: products.find(p => p.id === 'AZQ-0054') || products[1]
    }
  ];

  const currentSlide = heroSlides[activeSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: Frosted-Glass Category Sidebar (Reference Match) */}
        {/* ======================================================== */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col bg-white/90 backdrop-blur-xl rounded-2xl border border-[#D9F0FF] shadow-[0_8px_30px_0_rgba(6,43,79,0.06)] overflow-hidden">
          
          {/* Sidebar Top Header Pill */}
          <div className="bg-[#062B4F] text-white px-5 py-3.5 flex items-center justify-between">
            <span className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#50DDF0] inline-block shadow-glow-cyan" />
              {t("Shop by Categories", "ক্যাটাগরি সমূহ")}
            </span>
            <span className="text-[10px] text-[#69C5F5] font-mono">18 Total</span>
          </div>

          {/* Categories List with Glass Hover Effects */}
          <div className="flex-1 py-1.5 divide-y divide-[#F0F7FF]/80">
            {categorySidebarItems.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigateTo('collection-detail', cat.slug)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-[#062B4F]/85 hover:text-[#0877C9] hover:bg-[#F0F7FF]/90 transition-all group text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#EBF5FF] text-[#0877C9] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0877C9] group-hover:text-white transition-colors">
                      <IconComp className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate group-hover:translate-x-0.5 transition-transform">
                      {t(cat.label, cat.bn)}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#062B4F]/30 group-hover:text-[#0877C9] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Bottom Special Promo Links */}
          <div className="p-3 bg-gradient-to-b from-[#F8FCFF] to-[#EBF6FF] border-t border-[#D9F0FF] space-y-1.5">
            <button
              onClick={() => {
                const el = document.getElementById('popular-products');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#D9F0FF] text-xs font-bold text-[#062B4F] flex items-center justify-between shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{t("Top Offers & Deals", "হট অফার ও ডিল")}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#50DDF0]/20 text-[#0877C9]">
                HOT
              </span>
            </button>

            <button
              onClick={() => navigateTo('collections')}
              className="w-full px-3 py-2 rounded-xl bg-white/80 hover:bg-white border border-[#D9F0FF] text-xs font-bold text-[#062B4F] flex items-center gap-2 shadow-sm transition-all group"
            >
              <Gift className="w-4 h-4 text-[#0877C9]" />
              <span>{t("All 18 Collections", "১৮টি কালেকশন ব্রাউজ")}</span>
            </button>
          </div>

        </aside>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Grand Hero Banner (Reference Screenshot Match) */}
        {/* ======================================================== */}
        <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-[0_15px_40px_0_rgba(6,43,79,0.18)] bg-gradient-to-r from-[#062B4F] via-[#085B9E] to-[#0877C9] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-[460px] lg:min-h-[500px]">
          
          {/* Subtle Glass Arch Shape Behind the Model (Reference Feature) */}
          <div className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 w-64 sm:w-84 lg:w-96 h-80 sm:h-96 lg:h-[440px] rounded-t-full border border-[#69C5F5]/30 bg-gradient-to-b from-[#69C5F5]/15 to-transparent backdrop-blur-[2px] pointer-events-none" />
          
          {/* Ambient Light Reflections */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#50DDF0]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-[#0877C9]/40 rounded-full blur-3xl pointer-events-none" />

          {/* Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 flex-1">
            
            {/* Left Side: Typography & CTA */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6 text-center md:text-left">
              
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#50DDF0] text-[11px] font-black uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-[#50DDF0]" />
                <span>{currentSlide.tag}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight leading-[1.08] text-white drop-shadow-sm">
                {currentSlide.title}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto md:mx-0 font-normal leading-relaxed">
                {currentSlide.desc}
              </p>

              {/* CTA Button (White button with dark text & arrow - Reference Match) */}
              <div className="pt-2 flex items-center justify-center md:justify-start gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById(currentSlide.target);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigateTo('collections');
                  }}
                  className="px-7 py-3 rounded-full bg-white hover:bg-[#F0F7FF] text-[#062B4F] text-xs sm:text-sm font-extrabold tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group"
                >
                  <span>{currentSlide.cta}</span>
                  <ArrowRight className="w-4 h-4 text-[#0877C9] transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigateTo('collections')}
                  className="text-xs font-bold text-white/90 hover:text-[#50DDF0] transition-colors underline-offset-4 hover:underline hidden sm:inline"
                >
                  {t("Browse 18 Collections →", "১৮টি কালেকশন দেখুন →")}
                </button>
              </div>

            </div>

            {/* Right Side: Commercial Lifestyle Presentation with 3D Pedestal & Glass Float */}
            <div className="md:col-span-5 relative flex items-center justify-center">
              
              {/* Circular Pedestal Platform */}
              <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center">
                
                {/* 3D Round Pedestal Base */}
                <div className="absolute -bottom-4 w-52 sm:w-60 h-10 rounded-full bg-black/35 blur-md" />
                <div className="absolute -bottom-2 w-48 sm:w-56 h-8 rounded-full bg-gradient-to-r from-white/20 via-white/40 to-white/20 border border-white/30 backdrop-blur-md" />

                {/* Primary Lifestyle Model / Composition */}
                <div className="relative z-10 w-56 h-72 sm:w-64 sm:h-84 overflow-hidden rounded-2xl border border-white/25 shadow-2xl bg-gradient-to-b from-white/10 to-transparent backdrop-blur-[2px]">
                  <img
                    src={currentSlide.image}
                    alt="Lifestyle Model"
                    className="w-full h-full object-cover object-top filter brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#062B4F]/60 via-transparent to-transparent" />
                </div>

                {/* Floating Glass Showcase Card for Flagship Product */}
                {currentSlide.featuredProduct && (
                  <div 
                    onClick={() => setSelectedProduct(currentSlide.featuredProduct)}
                    className="absolute -bottom-3 -left-4 sm:-left-6 z-20 cursor-pointer p-2.5 rounded-xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl text-[#062B4F] max-w-[180px] hover:scale-105 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg bg-[#F0F7FF] p-1 flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#D9F0FF]">
                        <img
                          src={currentSlide.featuredProduct.main_image}
                          alt={currentSlide.featuredProduct.name}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-[#0877C9] uppercase block truncate">
                          Featured
                        </span>
                        <p className="text-[11px] font-black truncate text-[#062B4F]">
                          {currentSlide.featuredProduct.name}
                        </p>
                        <span className="text-xs font-black text-[#0877C9]">
                          ৳{currentSlide.featuredProduct.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>

          {/* Slider Pagination Dots (Reference Match) */}
          <div className="flex items-center justify-center gap-2 pt-4 relative z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`transition-all ${
                  activeSlide === i 
                    ? 'w-7 h-2 rounded-full bg-[#50DDF0] shadow-glow-cyan' 
                    : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
