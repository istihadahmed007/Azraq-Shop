import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';

/**
 * Architectural floating horizontal shelf component with realistic studio shadow.
 */
const FloatingShelf = ({ className = '', width = 'w-44 lg:w-48' }) => (
  <div className={`relative flex flex-col items-center ${width} ${className} pointer-events-none`}>
    {/* Shelf Top Surface */}
    <div className="w-full h-[6px] rounded-t-[1px] bg-gradient-to-r from-stone-100 via-white to-stone-100 border-t border-x border-white/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" />
    {/* Shelf Front Bevel Edge */}
    <div className="w-full h-[4px] bg-[#E8E4DC] border-b border-[#D6D0C4]" />
    {/* Soft Studio Shadow Cast Below Shelf */}
    <div className="w-[96%] h-3 bg-gradient-to-b from-stone-900/12 via-stone-900/4 to-transparent blur-[3px] -mt-[1px]" />
  </div>
);

/**
 * Format product name to display cleanly without supplier noise while keeping authentic name.
 */
function cleanTitle(name) {
  if (!name) return '';
  return name
    .replace(/\s*\([^)]*(?:advance|random color|master\s*copy)[^)]*\)/gi, '')
    .replace(/\s*–\s*Lig.*$/i, '')
    .replace(/Suppor$/i, 'Smart Projector')
    .replace(/\|\s*Full Sleeve.*$/i, '')
    .replace(/Strong Wind Anti Slip Stand/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function HeroSection() {
  const navigate = useNavigate();
  const { products = [], t, formatPrice } = useShop();

  const handleExploreCollection = (collectionSlug = '') => {
    if (collectionSlug) {
      navigate(`/collection/${collectionSlug}`);
    } else {
      navigate('/collections');
    }
  };

  const handleOpenProduct = (product) => {
    if (!product) return;
    const slug = product.slug || product.id;
    navigate(`/product/${slug}`, { state: { product } });
  };

  // Curate pristine studio-isolated showroom products dynamically from catalogue
  const showroom = useMemo(() => {
    const list = Array.isArray(products) && products.length > 0 ? products : [];
    const usedIds = new Set();

    function resolveSlot(preferredIds, categoryFallback, textRegex) {
      for (const id of preferredIds) {
        const found = list.find(p => p.id === id);
        if (found && !usedIds.has(found.id)) {
          usedIds.add(found.id);
          return found;
        }
      }

      const dynamicMatch = list.find(p =>
        !usedIds.has(p.id) &&
        (p.stock === undefined || p.stock > 0 || p.in_stock !== false) &&
        (categoryFallback ? p.category === categoryFallback : true) &&
        (textRegex ? textRegex.test(p.name) : true)
      );
      if (dynamicMatch) {
        usedIds.add(dynamicMatch.id);
        return dynamicMatch;
      }

      const catMatch = list.find(p =>
        !usedIds.has(p.id) &&
        (categoryFallback ? p.category === categoryFallback : true)
      );
      if (catMatch) {
        usedIds.add(catMatch.id);
        return catMatch;
      }

      const anyUnused = list.find(p => !usedIds.has(p.id));
      if (anyUnused) {
        usedIds.add(anyUnused.id);
        return anyUnused;
      }

      return list[0] || null;
    }

    return {
      // 1. CENTER FLAGSHIP HERO: HY300 Mini Projector 4K UHD
      centerHero: resolveSlot(
        ['AZQ-0148', 'AZQ-0001'],
        'Gadgets & IT Accessories',
        /projector|mini|4k/i
      ),

      // 2. CENTER LEFT COMPANION: Baseus Overhead Wireless Headphones
      centerAudio: resolveSlot(
        ['AZQ-0378', 'AZQ-0035', 'AZQ-0009'],
        'Gadgets & IT Accessories',
        /headphone|audio|overhead|wireless/i
      ),

      // 3. CENTER RIGHT COMPANION: Awei Magnetic Wireless Fast Power Bank
      centerPower: resolveSlot(
        ['AZQ-1126', 'AZQ-0144', 'AZQ-0006', 'AZQ-0008'],
        'Gadgets & IT Accessories',
        /power bank|magnetic|charger|adapter/i
      ),

      // 4. LEFT TOP SHELF: CeraVe Resurfacing Retinol Luxury Skincare Serum
      leftTopShelf: resolveSlot(
        ['AZQ-0247', 'AZQ-0225', 'AZQ-0031'],
        'Health & Beauty',
        /cerave|retinol|serum|niacinamide/i
      ),

      // 5. LEFT BOTTOM SHELF: Dot & Key Vitamin C + E Sunscreen
      leftBottomShelf: resolveSlot(
        ['AZQ-0210', 'AZQ-0212', 'AZQ-0213', 'AZQ-0031'],
        'Health & Beauty',
        /sunscreen|spf|vitamin/i
      ),

      // 6. RIGHT TOP SHELF: TQIU Multi Cooker Ivory Designer Appliance
      rightTopShelf: resolveSlot(
        ['AZQ-0127', 'AZQ-0018', 'AZQ-0012'],
        'Kitchen Appliances',
        /tqiu|multi cooker|cooker/i
      ),

      // 7. RIGHT BOTTOM SHELF: YN Electric Panci Non-stick Mini Rice Cooker
      rightBottomShelf: resolveSlot(
        ['AZQ-0314', 'AZQ-0048', 'AZQ-0026'],
        'Kitchen Appliances',
        /rice cooker|cooker|juicing/i
      ),

      // 8. BOTTOM PLATFORM LEFT: Men's Oxford Shirt & Accessories Combo
      bottomApparel: resolveSlot(
        ['AZQ-0891', 'AZQ-0028', 'AZQ-0005'],
        'Men Clothing',
        /shirt|combo|panjabi|clothing/i
      ),

      // 9. BOTTOM PLATFORM RIGHT: AMC Tech Minimalist Desktop Fan
      bottomLifestyle: resolveSlot(
        ['AZQ-0189', 'AZQ-0284', 'AZQ-0010', 'AZQ-0027'],
        'Home & Lifestyle',
        /fan|hourglass|desktop|light/i
      )
    };
  }, [products]);

  return (
    <section
      aria-label="AZRAQ Architectural Showroom"
      className="w-full relative rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-[#FAF9F7] shadow-xs overflow-hidden select-none transition-all"
    >
      {/* Studio Cyclorama Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 30%, #FFFFFF 0%, #FAF8F5 50%, #ECE8DF 100%)'
        }}
      />

      {/* Subtle Studio Overhead Light Beam */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. EDITORIAL BRANDING & HEADER (Compact & Proportionate)                 */}
      {/* ========================================================================= */}
      <div className="relative z-20 px-5 sm:px-8 lg:px-10 pt-4 sm:pt-5 pb-1">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 border-b border-stone-200/70 pb-3">
          
          {/* Headline & Description */}
          <div className="max-w-2xl space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700 text-[10px] font-semibold tracking-wide shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#185ADB]" />
              <span className="uppercase tracking-wider text-stone-500">
                {t("AZRAQ Showroom", "আজরাক শোরুম")}
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-[#185ADB] font-bold">
                {t("Curated Everyday Edit", "আসল পণ্যতালিকা")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[28px] font-extrabold text-stone-900 tracking-tight leading-tight">
              {t("Discover Better.", "ডিসকভার বেটার।")}
              <span className="text-[#185ADB] ml-2 inline-block">
                {t("Live Better.", "লিভ বেটার।")}
              </span>
            </h1>

            <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed max-w-md">
              {t(
                "An architectural edit of genuine electronics, lifestyle accessories, kitchenware, and personal care — verified for quality with nationwide cash on delivery across Bangladesh.",
                "আসল গ্যাজেটস, ইলেকট্রনিক্স, হোম অ্যাপ্লায়েন্স ও লাইফস্টাইল পণ্য। সরাসরি হোম ডেলিভারি ও শতভাগ ভেরিফাইড কোয়ালিটি।"
              )}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => handleExploreCollection()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>{t("Explore Collection", "কালেকশন দেখুন")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/80 border border-stone-200/80 text-stone-700 text-xs">
              <div className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#185ADB]" />
                <span className="text-[11px]">{t("Genuine Warranty", "আসল পণ্য")}</span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1 font-medium">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px]">{t("Nationwide COD", "ক্যাশ অন")}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Category Anchors */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 shrink-0 mr-1">
            {t("Showroom Edit:", "ক্যাটাগরি:")}
          </span>
          {[
            { label: 'Health & Beauty (330)', slug: 'health-beauty' },
            { label: 'Gadgets & IT (281)', slug: 'gadgets-it-accessories' },
            { label: 'Home & Lifestyle (130)', slug: 'home-lifestyle' },
            { label: 'Jewellery & Accessories (95)', slug: 'jewelries-accessories' },
            { label: 'Kitchen Appliances (81)', slug: 'kitchen-appliances' },
            { label: 'Sports & Kids (57)', slug: 'sports-kids' }
          ].map(cat => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleExploreCollection(cat.slug)}
              className="px-2 py-0.5 rounded-md bg-white/70 hover:bg-white hover:border-[#185ADB]/40 border border-stone-200/70 text-stone-600 hover:text-[#185ADB] text-[10px] font-medium transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP & TABLET SHOWROOM STAGE (100% Fits in Viewport)               */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative z-10 px-6 lg:px-10 pt-2 pb-4">
        
        {/* Stage Container */}
        <div className="relative w-full max-w-[1040px] mx-auto flex flex-col justify-end">
          
          {/* Main 3-Zone Arrangement */}
          <div className="grid grid-cols-12 gap-5 lg:gap-7 items-end mb-1">

            {/* --------------------------------------------------------------- */}
            {/* LEFT ZONE: Exactly 2 Clean Horizontal Floating Shelves          */}
            {/* --------------------------------------------------------------- */}
            <div className="col-span-3 flex flex-col justify-end gap-3.5 lg:gap-4 pb-0.5">
              
              {/* Shelf 1 (Top): CeraVe Retinol Serum */}
              <div 
                onClick={() => handleOpenProduct(showroom.leftTopShelf)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 lg:w-22 lg:h-22 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                  <ProductImage
                    src={showroom.leftTopShelf?.main_image}
                    alt={showroom.leftTopShelf?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-16 lg:w-18 h-1 bg-stone-900/10 blur-[2px] rounded-full -mt-1" />
                <FloatingShelf className="mt-0.5" />
                <div className="mt-0.5 text-center max-w-[145px]">
                  <span className="text-[10px] font-semibold text-stone-800 line-clamp-1 block group-hover:text-[#185ADB] transition-colors" title={showroom.leftTopShelf?.name}>
                    {cleanTitle(showroom.leftTopShelf?.name)}
                  </span>
                  <span className="text-[10px] font-bold text-[#185ADB] block">
                    ৳{(showroom.leftTopShelf?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Shelf 2 (Lower): Dot & Key Vitamin C + E Sunscreen */}
              <div 
                onClick={() => handleOpenProduct(showroom.leftBottomShelf)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 lg:w-22 lg:h-22 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                  <ProductImage
                    src={showroom.leftBottomShelf?.main_image}
                    alt={showroom.leftBottomShelf?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-16 lg:w-18 h-1 bg-stone-900/10 blur-[2px] rounded-full -mt-1" />
                <FloatingShelf className="mt-0.5" />
                <div className="mt-0.5 text-center max-w-[145px]">
                  <span className="text-[10px] font-semibold text-stone-800 line-clamp-1 block group-hover:text-[#185ADB] transition-colors" title={showroom.leftBottomShelf?.name}>
                    {cleanTitle(showroom.leftBottomShelf?.name)}
                  </span>
                  <span className="text-[10px] font-bold text-[#185ADB] block">
                    ৳{(showroom.leftBottomShelf?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

            {/* --------------------------------------------------------------- */}
            {/* CENTER ZONE: Prominent Stepped Architectural Pedestal           */}
            {/* --------------------------------------------------------------- */}
            <div className="col-span-6 flex flex-col items-center justify-end">

              {/* One Large Central Hero Product: HY300 Mini Projector */}
              <div 
                onClick={() => handleOpenProduct(showroom.centerHero)}
                className="group relative z-20 flex flex-col items-center cursor-pointer -mb-0.5"
              >
                <div className="w-28 h-28 lg:w-34 lg:h-34 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1">
                  <ProductImage
                    src={showroom.centerHero?.main_image}
                    alt={showroom.centerHero?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-24 lg:w-28 h-1.5 bg-stone-900/12 blur-[2px] rounded-full -mt-1" />
              </div>

              {/* Architectural Pedestal Structure */}
              <div className="relative w-full flex flex-col items-center">
                
                {/* Pedestal Top Surface */}
                <div className="w-44 sm:w-48 lg:w-52 h-4 rounded-t-[2px] bg-gradient-to-r from-stone-100 via-white to-stone-100 border-t border-white border-x border-stone-300/80 shadow-[0_2px_4px_rgba(0,0,0,0.04)]" />

                {/* Vertical Central Column Stem */}
                <div className="w-26 sm:w-30 lg:w-32 h-16 lg:h-18 bg-gradient-to-b from-stone-50 to-stone-100/90 border-x border-stone-300/80 shadow-inner flex flex-col items-center justify-center px-1">
                  <div className="text-center max-w-[124px]">
                    <span className="text-[10px] sm:text-[11px] font-bold text-stone-900 line-clamp-1 block" title={showroom.centerHero?.name}>
                      {cleanTitle(showroom.centerHero?.name)}
                    </span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#185ADB] block">
                      ৳{(showroom.centerHero?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Left Stepped Plinth Block: Overhead Wireless Headphones */}
                <div 
                  onClick={() => handleOpenProduct(showroom.centerAudio)}
                  className="group absolute -left-1 sm:left-1 lg:left-3 bottom-0 flex flex-col items-center z-20 cursor-pointer"
                >
                  <div className="w-16 h-16 lg:w-18 lg:h-18 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                    <ProductImage
                      src={showroom.centerAudio?.main_image}
                      alt={showroom.centerAudio?.name}
                      fit="contain"
                      aspectRatio="square"
                      priority={true}
                      containerClassName="bg-transparent"
                    />
                  </div>
                  <div className="w-12 h-1 bg-stone-900/10 blur-[1px] rounded-full -mt-1" />
                  {/* Step Plinth Surface */}
                  <div className="w-20 sm:w-22 lg:w-24 h-9 lg:h-10 bg-white border-t border-x border-stone-300/80 shadow-2xs rounded-t-xs flex flex-col items-center justify-center px-1">
                    <span className="text-[8px] font-semibold text-stone-800 line-clamp-1 block text-center" title={showroom.centerAudio?.name}>
                      {cleanTitle(showroom.centerAudio?.name)}
                    </span>
                    <span className="text-[8px] font-bold text-[#185ADB]">
                      ৳{(showroom.centerAudio?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right Stepped Plinth Block: Magnetic Power Bank */}
                <div 
                  onClick={() => handleOpenProduct(showroom.centerPower)}
                  className="group absolute -right-1 sm:right-1 lg:right-3 bottom-0 flex flex-col items-center z-20 cursor-pointer"
                >
                  <div className="w-16 h-16 lg:w-18 lg:h-18 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                    <ProductImage
                      src={showroom.centerPower?.main_image}
                      alt={showroom.centerPower?.name}
                      fit="contain"
                      aspectRatio="square"
                      priority={true}
                      containerClassName="bg-transparent"
                    />
                  </div>
                  <div className="w-12 h-1 bg-stone-900/10 blur-[1px] rounded-full -mt-1" />
                  {/* Step Plinth Surface */}
                  <div className="w-20 sm:w-22 lg:w-24 h-9 lg:h-10 bg-white border-t border-x border-stone-300/80 shadow-2xs rounded-t-xs flex flex-col items-center justify-center px-1">
                    <span className="text-[8px] font-semibold text-stone-800 line-clamp-1 block text-center" title={showroom.centerPower?.name}>
                      {cleanTitle(showroom.centerPower?.name)}
                    </span>
                    <span className="text-[8px] font-bold text-[#185ADB]">
                      ৳{(showroom.centerPower?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* --------------------------------------------------------------- */}
            {/* RIGHT ZONE: Exactly 2 Clean Horizontal Floating Shelves         */}
            {/* --------------------------------------------------------------- */}
            <div className="col-span-3 flex flex-col justify-end gap-3.5 lg:gap-4 pb-0.5">
              
              {/* Shelf 1 (Upper): TQIU Ivory Multi Cooker */}
              <div 
                onClick={() => handleOpenProduct(showroom.rightTopShelf)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 lg:w-22 lg:h-22 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                  <ProductImage
                    src={showroom.rightTopShelf?.main_image}
                    alt={showroom.rightTopShelf?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-16 lg:w-18 h-1 bg-stone-900/10 blur-[2px] rounded-full -mt-1" />
                <FloatingShelf className="mt-0.5" />
                <div className="mt-0.5 text-center max-w-[145px]">
                  <span className="text-[10px] font-semibold text-stone-800 line-clamp-1 block group-hover:text-[#185ADB] transition-colors" title={showroom.rightTopShelf?.name}>
                    {cleanTitle(showroom.rightTopShelf?.name)}
                  </span>
                  <span className="text-[10px] font-bold text-[#185ADB] block">
                    ৳{(showroom.rightTopShelf?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Shelf 2 (Lower): Mini Electric Rice Cooker */}
              <div 
                onClick={() => handleOpenProduct(showroom.rightBottomShelf)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 lg:w-22 lg:h-22 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
                  <ProductImage
                    src={showroom.rightBottomShelf?.main_image}
                    alt={showroom.rightBottomShelf?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-16 lg:w-18 h-1 bg-stone-900/10 blur-[2px] rounded-full -mt-1" />
                <FloatingShelf className="mt-0.5" />
                <div className="mt-0.5 text-center max-w-[145px]">
                  <span className="text-[10px] font-semibold text-stone-800 line-clamp-1 block group-hover:text-[#185ADB] transition-colors" title={showroom.rightBottomShelf?.name}>
                    {cleanTitle(showroom.rightBottomShelf?.name)}
                  </span>
                  <span className="text-[10px] font-bold text-[#185ADB] block">
                    ৳{(showroom.rightBottomShelf?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* ----------------------------------------------------------------- */}
          {/* BOTTOM ZONE: Wide Architectural Stepped Platform                  */}
          {/* ----------------------------------------------------------------- */}
          <div className="relative w-full z-20 mt-0.5">
            
            {/* Grounded Products Resting Directly On Platform Slab */}
            <div className="relative w-full flex items-end justify-between px-10 sm:px-14 -mb-1 pointer-events-none">
              
              {/* Left Display Item: Men's Oxford Shirt Combo & Accessories */}
              <div 
                onClick={() => handleOpenProduct(showroom.bottomApparel)}
                className="group flex flex-col items-center cursor-pointer pointer-events-auto transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                  <ProductImage
                    src={showroom.bottomApparel?.main_image}
                    alt={showroom.bottomApparel?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-12 h-1 bg-stone-900/10 blur-[1px] rounded-full -mt-0.5" />
              </div>

              {/* Right Display Item: Minimalist Desktop Fan */}
              <div 
                onClick={() => handleOpenProduct(showroom.bottomLifestyle)}
                className="group flex flex-col items-center cursor-pointer pointer-events-auto transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                  <ProductImage
                    src={showroom.bottomLifestyle?.main_image}
                    alt={showroom.bottomLifestyle?.name}
                    fit="contain"
                    aspectRatio="square"
                    priority={true}
                    containerClassName="bg-transparent"
                    className="drop-shadow-xs group-hover:drop-shadow-md transition-all duration-300"
                  />
                </div>
                <div className="w-12 h-1 bg-stone-900/10 blur-[1px] rounded-full -mt-0.5" />
              </div>

            </div>

            {/* Platform Top Stepped Plane */}
            <div className="w-full h-2 rounded-t-xs bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 border-t border-white border-x border-stone-300 shadow-2xs" />

            {/* Platform Architectural Fascia with Integrated Exhibit Labels */}
            <div className="w-full h-8 bg-gradient-to-b from-[#EBE7DF] to-[#DDD7CA] border-x border-b border-stone-300 shadow-[0_6px_14px_-3px_rgba(0,0,0,0.08)] flex items-center justify-between px-6 sm:px-10">
              
              {/* Left Product Title & Price */}
              <div 
                onClick={() => handleOpenProduct(showroom.bottomApparel)}
                className="cursor-pointer max-w-[150px] leading-tight"
              >
                <span className="text-[9px] font-semibold text-stone-800 line-clamp-1 block hover:text-[#185ADB] transition-colors" title={showroom.bottomApparel?.name}>
                  {cleanTitle(showroom.bottomApparel?.name)}
                </span>
                <span className="text-[9px] font-bold text-[#185ADB]">
                  ৳{(showroom.bottomApparel?.price || 0).toLocaleString()}
                </span>
              </div>

              {/* Center Architecture Branding */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-bold tracking-widest uppercase text-stone-600">
                  AZRAQ ARCHITECTURAL SHOWROOM
                </span>
              </div>

              {/* Right Product Title & Price */}
              <div 
                onClick={() => handleOpenProduct(showroom.bottomLifestyle)}
                className="cursor-pointer max-w-[150px] text-right leading-tight"
              >
                <span className="text-[9px] font-semibold text-stone-800 line-clamp-1 block hover:text-[#185ADB] transition-colors" title={showroom.bottomLifestyle?.name}>
                  {cleanTitle(showroom.bottomLifestyle?.name)}
                </span>
                <span className="text-[9px] font-bold text-[#185ADB]">
                  ৳{(showroom.bottomLifestyle?.price || 0).toLocaleString()}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE SEPARATE COMPACT COMPOSITION (390px Viewport)                   */}
      {/* ========================================================================= */}
      <div className="block md:hidden relative z-10 px-4 pt-1 pb-4 space-y-2.5">
        
        {/* 1. Flagship Centerpiece Pod */}
        <div className="relative rounded-2xl bg-white border border-stone-200/90 p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {t("Centerpiece Exhibit", "প্রধান প্রদর্শনী")}
            </span>
            <span className="text-[9px] font-bold text-[#185ADB] bg-blue-50 px-2 py-0.5 rounded-full">
              Gadgets & IT
            </span>
          </div>

          <div 
            onClick={() => handleOpenProduct(showroom.centerHero)}
            className="flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <ProductImage
                src={showroom.centerHero?.main_image}
                alt={showroom.centerHero?.name}
                fit="contain"
                aspectRatio="square"
                priority={true}
              />
            </div>
            <span className="text-[11px] font-bold text-stone-900 mt-1 line-clamp-1">
              {cleanTitle(showroom.centerHero?.name)}
            </span>
            <span className="text-[11px] font-extrabold text-[#185ADB]">
              ৳{(showroom.centerHero?.price || 0).toLocaleString()}
            </span>
          </div>

          {/* Stepped Companions for Headphones & Power Bank */}
          <div className="mt-2 pt-2 border-t border-stone-100 grid grid-cols-2 gap-2">
            <div
              onClick={() => handleOpenProduct(showroom.centerAudio)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 cursor-pointer"
            >
              <div className="w-8 h-8 shrink-0">
                <ProductImage
                  src={showroom.centerAudio?.main_image}
                  alt={showroom.centerAudio?.name}
                  fit="contain"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-medium text-stone-800 truncate block">
                  {cleanTitle(showroom.centerAudio?.name)}
                </span>
                <span className="text-[10px] font-bold text-[#185ADB]">
                  ৳{(showroom.centerAudio?.price || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div
              onClick={() => handleOpenProduct(showroom.centerPower)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 cursor-pointer"
            >
              <div className="w-8 h-8 shrink-0">
                <ProductImage
                  src={showroom.centerPower?.main_image}
                  alt={showroom.centerPower?.name}
                  fit="contain"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-medium text-stone-800 truncate block">
                  {cleanTitle(showroom.centerPower?.name)}
                </span>
                <span className="text-[10px] font-bold text-[#185ADB]">
                  ৳{(showroom.centerPower?.price || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Beauty & Skincare Shelves */}
        <div className="relative rounded-2xl bg-white border border-stone-200/90 p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {t("Beauty & Skincare Shelves", "বিউটি ও স্কিনকেয়ার")}
            </span>
            <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
              Health & Beauty
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div 
              onClick={() => handleOpenProduct(showroom.leftTopShelf)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-18 h-18 flex items-center justify-center">
                <ProductImage
                  src={showroom.leftTopShelf?.main_image}
                  alt={showroom.leftTopShelf?.name}
                  fit="contain"
                  aspectRatio="square"
                />
              </div>
              <FloatingShelf className="mt-0.5" />
              <span className="text-[9px] font-semibold text-stone-800 line-clamp-1 mt-1 text-center">
                {cleanTitle(showroom.leftTopShelf?.name)}
              </span>
              <span className="text-[10px] font-bold text-[#185ADB]">
                ৳{(showroom.leftTopShelf?.price || 0).toLocaleString()}
              </span>
            </div>

            <div 
              onClick={() => handleOpenProduct(showroom.leftBottomShelf)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-18 h-18 flex items-center justify-center">
                <ProductImage
                  src={showroom.leftBottomShelf?.main_image}
                  alt={showroom.leftBottomShelf?.name}
                  fit="contain"
                  aspectRatio="square"
                />
              </div>
              <FloatingShelf className="mt-0.5" />
              <span className="text-[9px] font-semibold text-stone-800 line-clamp-1 mt-1 text-center">
                {cleanTitle(showroom.leftBottomShelf?.name)}
              </span>
              <span className="text-[10px] font-bold text-[#185ADB]">
                ৳{(showroom.leftBottomShelf?.price || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Kitchen & Home Shelves */}
        <div className="relative rounded-2xl bg-white border border-stone-200/90 p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {t("Kitchen & Home Shelves", "কিচেন ও হোম")}
            </span>
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Home & Kitchen
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div 
              onClick={() => handleOpenProduct(showroom.rightTopShelf)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-18 h-18 flex items-center justify-center">
                <ProductImage
                  src={showroom.rightTopShelf?.main_image}
                  alt={showroom.rightTopShelf?.name}
                  fit="contain"
                  aspectRatio="square"
                />
              </div>
              <FloatingShelf className="mt-0.5" />
              <span className="text-[9px] font-semibold text-stone-800 line-clamp-1 mt-1 text-center">
                {cleanTitle(showroom.rightTopShelf?.name)}
              </span>
              <span className="text-[10px] font-bold text-[#185ADB]">
                ৳{(showroom.rightTopShelf?.price || 0).toLocaleString()}
              </span>
            </div>

            <div 
              onClick={() => handleOpenProduct(showroom.rightBottomShelf)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-18 h-18 flex items-center justify-center">
                <ProductImage
                  src={showroom.rightBottomShelf?.main_image}
                  alt={showroom.rightBottomShelf?.name}
                  fit="contain"
                  aspectRatio="square"
                />
              </div>
              <FloatingShelf className="mt-0.5" />
              <span className="text-[9px] font-semibold text-stone-800 line-clamp-1 mt-1 text-center">
                {cleanTitle(showroom.rightBottomShelf?.name)}
              </span>
              <span className="text-[10px] font-bold text-[#185ADB]">
                ৳{(showroom.rightBottomShelf?.price || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Grounded Apparel & Lifestyle Display Bar */}
        <div className="relative rounded-xl bg-white border border-stone-200/90 p-2.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <ProductImage
                src={showroom.bottomApparel?.main_image}
                alt={showroom.bottomApparel?.name}
                fit="contain"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] font-bold uppercase text-stone-500 tracking-wider block">
                Apparel & Lifestyle
              </span>
              <span className="text-[11px] font-bold text-stone-900 truncate block">
                {cleanTitle(showroom.bottomApparel?.name)}
              </span>
              <span className="text-[11px] font-extrabold text-[#185ADB]">
                ৳{(showroom.bottomApparel?.price || 0).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleOpenProduct(showroom.bottomApparel)}
            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#185ADB] hover:text-white text-stone-700 text-xs font-semibold transition-colors shrink-0"
          >
            {t("View", "দেখুন")}
          </button>
        </div>

      </div>

    </section>
  );
}
