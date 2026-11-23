import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Layers,
  Smartphone,
  Sparkle,
  Home as HomeIcon,
  Activity,
  Maximize2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

/**
 * Showroom Architectural Chair Graphic
 * Accurately mirrors the Scandinavian lounge chair with throw blanket
 * seen on the right platform of the reference showroom composition.
 */
function ShowroomChair({ className = '' }) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 160 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Chair Legs */}
        <line x1="48" y1="120" x2="34" y2="162" stroke="#2D2B2A" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="116" x2="62" y2="162" stroke="#2D2B2A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="108" y1="116" x2="114" y2="162" stroke="#2D2B2A" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="124" y1="120" x2="136" y2="162" stroke="#2D2B2A" strokeWidth="3" strokeLinecap="round" />
        <line x1="39" y1="146" x2="65" y2="144" stroke="#3D3B3A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="109" y1="144" x2="132" y2="146" stroke="#3D3B3A" strokeWidth="1.5" strokeLinecap="round" />

        {/* Chair Shell (Upholstered Curved Tub Seat) */}
        <path
          d="M 38 102 C 34 88, 38 60, 56 46 C 70 34, 102 34, 120 46 C 138 58, 142 88, 136 104 C 132 114, 118 122, 98 124 C 74 126, 44 120, 38 102 Z"
          fill="#D6D0C7"
          stroke="#C2BCB2"
          strokeWidth="1.5"
        />
        {/* Inner Cushion Contour */}
        <path
          d="M 46 96 C 44 82, 50 62, 64 52 C 76 44, 100 44, 114 52 C 126 60, 132 80, 128 96 C 122 110, 108 116, 94 116 C 76 116, 50 110, 46 96 Z"
          fill="#ECE7DE"
        />

        {/* Draped Throw Blanket */}
        <path
          d="M 68 56 C 74 62, 70 78, 66 94 C 62 108, 54 124, 52 142 C 51 150, 48 158, 44 160 C 40 162, 36 156, 38 144 C 40 130, 48 112, 52 98 C 55 86, 60 70, 68 56 Z"
          fill="#F5F3EF"
          stroke="#DDD9D0"
          strokeWidth="1"
        />
        {/* Blanket Fringes & Creases */}
        <path
          d="M 72 82 C 68 96, 60 118, 58 138 C 56 150, 58 158, 56 161"
          stroke="#D0CCC3"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 78 92 C 74 104, 68 122, 66 142"
          stroke="#D0CCC3"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Showroom Single Product Spot / Pod
 * Encapsulates authentic ProductImage, hover elevation, real price pill, and direct route navigation.
 */
function ShowroomProductSpot({
  product,
  altTag,
  containerClassName = '',
  imageClassName = '',
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showBadge = true,
  badgeText = '',
  badgePosition = 'bottom', // 'bottom' | 'top'
  isHero = false,
  onProductClick,
  t
}) {
  if (!product) return null;

  const priceFormatted = typeof product.price === 'number'
    ? `৳${product.price.toLocaleString()}`
    : `৳${product.price || 0}`;

  return (
    <div
      onClick={() => onProductClick?.(product)}
      className={`group relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${containerClassName}`}
      title={`${product.name} — ${priceFormatted}`}
    >
      {/* Dynamic Hover Ambient Halo */}
      <div className="absolute inset-0 -m-2 rounded-2xl bg-amber-500/0 group-hover:bg-[#185ADB]/5 transition-colors duration-300 pointer-events-none" />

      {/* Product Photograph Container */}
      <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]">
        <ProductImage
          src={product.main_image}
          alt={altTag || product.name}
          fit="contain"
          aspectRatio="square"
          priority={true}
          containerClassName="bg-transparent"
          className={`drop-shadow-sm group-hover:drop-shadow-xl transition-all duration-300 ${imageClassName}`}
        />
      </div>

      {/* Floating Price & Metadata Capsule (Editorial Glass Pill) */}
      {showBadge && (
        <div
          className={`absolute ${
            badgePosition === 'top' ? '-top-3' : '-bottom-3 sm:-bottom-4'
          } z-30 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none transform translate-y-1 group-hover:translate-y-0`}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-semibold backdrop-blur-md shadow-md border border-white/20 whitespace-nowrap">
            <span className="max-w-[120px] truncate text-slate-200 text-[10px]">
              {badgeText || product.name}
            </span>
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span className="text-amber-300 font-bold">{priceFormatted}</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * AZRAQ Architectural Showroom Hero Section
 * 
 * Recreates the premium ivory-white showroom architecture from the reference:
 * - Studio cyc background with soft ambient studio lighting
 * - Ceiling-suspended fine wire system
 * - Multi-tier floating white shelves
 * - Stepped central T-plinth for flagship gadgets
 * - Floating cuboid shelf & suspended overhead headphones
 * - Wide stepped base platform with grounded sports, clothing and accent lounge chair
 * - 100% genuine catalog products dynamically resolved with zero layout shifts
 */
export default function HeroSection() {
  const navigate = useNavigate();
  const { products, t } = useShop();
  const [mobileTab, setMobileTab] = useState('all'); // 'all' | 'gadgets' | 'beauty' | 'home' | 'sports'

  // Route to canonical product page with slug
  const handleOpenProduct = (product) => {
    if (!product) return;
    try {
      const slug = generateProductSlug(product);
      navigate(`/product/${slug}`);
    } catch {
      navigate(`/product/${product.id}`);
    }
  };

  const handleExploreCollection = (collectionSlug = '') => {
    if (collectionSlug) {
      navigate(`/collection/${collectionSlug}`);
      return;
    }
    const el = document.getElementById('popular-products') || document.getElementById('all-products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/collections');
    }
  };

  // Dynamically resolve unique products for each architectural showroom slot
  const showroom = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return {};
    }

    const byId = new Map(products.map(p => [String(p.id).toUpperCase(), p]));
    const usedIds = new Set();

    function resolveSlot(preferredIds, categoryFallback, textRegex) {
      // 1. Try preferred IDs first (fast-boot & hydration stability)
      for (const rawId of preferredIds) {
        const id = String(rawId).toUpperCase();
        if (!usedIds.has(id) && byId.has(id)) {
          const matched = byId.get(id);
          usedIds.add(matched.id);
          return matched;
        }
      }

      // 2. Dynamic match by category and text regex
      const dynamicMatch = products.find(p =>
        !usedIds.has(p.id) &&
        (p.stock === undefined || p.stock > 0 || p.in_stock !== false) &&
        (categoryFallback ? p.category === categoryFallback : true) &&
        (textRegex ? textRegex.test(p.name) : true)
      );
      if (dynamicMatch) {
        usedIds.add(dynamicMatch.id);
        return dynamicMatch;
      }

      // 3. Dynamic match by category only
      const catMatch = products.find(p =>
        !usedIds.has(p.id) &&
        (categoryFallback ? p.category === categoryFallback : true)
      );
      if (catMatch) {
        usedIds.add(catMatch.id);
        return catMatch;
      }

      // 4. Safe fallback to any unused genuine product
      const anyUnused = products.find(p => !usedIds.has(p.id));
      if (anyUnused) {
        usedIds.add(anyUnused.id);
        return anyUnused;
      }

      return products[0];
    }

    return {
      // CENTER ZONE: Gadgets, Audio, Wearables & Charging
      centerFeatured: resolveSlot(
        ['AZQ-0001', 'AZQ-0484', 'AZQ-0237'],
        'Gadgets & IT Accessories'
      ),
      centerHeadphones: resolveSlot(
        ['AZQ-0378', 'AZQ-0009', 'AZQ-0364', 'AZQ-0035'],
        'Gadgets & IT Accessories',
        /headphone|overhead|major|bass 35|earphone/i
      ),
      centerSmartwatch: resolveSlot(
        ['AZQ-0099', 'AZQ-0054', 'AZQ-0110', 'AZQ-0147'],
        'Gadgets & IT Accessories',
        /watch|smartwatch/i
      ),
      centerCharger: resolveSlot(
        ['AZQ-0006', 'AZQ-0374', 'AZQ-0008', 'AZQ-0007'],
        'Gadgets & IT Accessories',
        /charger|gan|adapter|box fast/i
      ),

      // LEFT ZONE: Beauty, Skincare, Fragrance & Jewellery
      leftTopBag: resolveSlot(
        ['AZQ-0077', 'AZQ-0075', 'AZQ-0076', 'AZQ-1200'],
        'Jewelries & Accessories',
        /bag|shoulder|tote|scarf/i
      ),
      leftUpperMidSerum: resolveSlot(
        ['AZQ-0811', 'AZQ-0732', 'AZQ-0225', 'AZQ-1193'],
        'Health & Beauty',
        /serum|skincare|cream|lotion|oil|hat/i
      ),
      leftMidJewelry: resolveSlot(
        ['AZQ-1128', 'AZQ-1192', 'AZQ-1136', 'AZQ-0078'],
        'Jewelries & Accessories',
        /jewelry|stand|mirror|casket|bracelet|metal/i
      ),
      leftLowerFragrance: resolveSlot(
        ['AZQ-0716', 'AZQ-0074', 'AZQ-0031', 'AZQ-0114'],
        'Health & Beauty',
        /talc|perfum|fragrance|gel|beauty|curler/i
      ),

      // RIGHT ZONE: Kitchen Appliances, Home & Lifestyle
      rightTopMug: resolveSlot(
        ['AZQ-0012', 'AZQ-1063'],
        'Home & Lifestyle',
        /mug|cup|stirring|bottle|flask/i
      ),
      rightTopLamp: resolveSlot(
        ['AZQ-0037', 'AZQ-0036', 'AZQ-0010'],
        'Home & Lifestyle',
        /lamp|solar|light|holder|fire/i
      ),
      rightTopCardHolder: resolveSlot(
        ['AZQ-1136', 'AZQ-0027', 'AZQ-0025'],
        'Jewelries & Accessories',
        /card|holder|leather|wallet|sealing/i
      ),
      rightBoxBlender: resolveSlot(
        ['AZQ-0071', 'AZQ-0026', 'AZQ-0081', 'AZQ-0095'],
        'Kitchen Appliances',
        /juicer|blender|chopper|grinder|kettle/i
      ),
      rightPlatformMulticooker: resolveSlot(
        ['AZQ-0018', 'AZQ-0011'],
        'Kitchen Appliances',
        /cooker|multicooker|pan|pot/i
      ),

      // BOTTOM PLATFORM: Sports, Apparel & Active
      bottomSportsRacket: resolveSlot(
        ['AZQ-0002', 'AZQ-0014', 'AZQ-0015', 'AZQ-0003'],
        'Sports & Kids',
        /badminton|racket|yonex|titan/i
      ),
      bottomFitness: resolveSlot(
        ['AZQ-0080', 'AZQ-0004'],
        'Sports & Kids',
        /gripper|fitness|gym|jump/i
      ),
      bottomClothing: resolveSlot(
        ['AZQ-0028', 'AZQ-0005', 'AZQ-0029', 'AZQ-0030'],
        'Men Clothing',
        /set|co-ord|punjabi|combo/i
      )
    };
  }, [products]);

  return (
    <section 
      aria-label="AZRAQ Architectural Showroom"
      className="w-full relative rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-[#FAF9F6] shadow-xs overflow-hidden select-none transition-all"
    >
      {/* Studio Radial Cyclorama Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 85% 65% at 50% 32%, #FFFFFF 0%, #FAF8F5 50%, #F1EEE8 100%)'
        }}
      />

      {/* Subtle Studio Lighting Beam & Floor Reflection */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-stone-200/30 to-transparent pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. EDITORIAL HEADER & BRAND IDENTITY                                     */}
      {/* ========================================================================= */}
      <div className="relative z-20 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-200/70 pb-5 sm:pb-6">
          
          {/* Headline & Tagline */}
          <div className="max-w-2xl space-y-2.5">
            {/* Showroom Curation Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-stone-200 text-stone-800 text-[11px] font-semibold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#185ADB] animate-pulse" />
              <span className="uppercase tracking-wider text-[10px] text-stone-600">
                {t("AZRAQ Curated Showroom", "আজরাক কিউরেটেড শোরুম")}
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-[#185ADB] font-bold">
                {t("1,200+ Verified Products", "১,২০০+ আসল পণ্য")}
              </span>
            </div>

            {/* Official Tagline Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-stone-900 tracking-tight leading-[1.12]">
              {t("Discover Better.", "ডিসকভার বেটার।")}
              <span className="text-[#185ADB] ml-2 inline-block">
                {t("Live Better.", "লিভ বেটার।")}
              </span>
            </h1>

            {/* Short Editorial Descriptor */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              {t(
                "An architectural edit of genuine electronics, lifestyle accessories, kitchenware, and personal care — verified for quality with nationwide cash on delivery across Bangladesh.",
                "আসল গ্যাজেটস, ইলেকট্রনিক্স, হোম অ্যাপ্লায়েন্স ও লাইফস্টাইল পণ্য। সরাসরি হোম ডেলিভারি ও শতভাগ ভেরিফাইড কোয়ালিটি।"
              )}
            </p>
          </div>

          {/* Action CTAs & Collection Jump Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleExploreCollection()}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <span>{t("Explore Collection", "কালেকশন দেখুন")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Catalog stats trust pill */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/70 border border-stone-200/80 text-stone-700 text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#185ADB]" />
                <span>{t("Authentic Warranty", "আসল পণ্যের নিশ্চয়তা")}</span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>{t("64 Districts COD", "৬৪ জেলায় ক্যাশ অন")}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Collection Category Anchors */}
        <div className="flex items-center gap-2 pt-3 sm:pt-4 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 shrink-0 mr-1">
            {t("Showroom Edit:", "শোরুম ক্যাটাগরি:")}
          </span>
          {[
            { label: 'Health & Beauty (330)', slug: 'health-beauty' },
            { label: 'Gadgets & IT (281)', slug: 'gadgets-it-accessories' },
            { label: 'Home & Lifestyle (130)', slug: 'home-lifestyle' },
            { label: 'Jewellery & Accessories (95)', slug: 'jewelries-accessories' },
            { label: 'Kitchen Appliances (81)', slug: 'kitchen-appliances' },
            { label: 'Men Clothing (63)', slug: 'men-clothing' },
            { label: 'Sports & Kids (57)', slug: 'sports-kids' }
          ].map(cat => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleExploreCollection(cat.slug)}
              className="px-3 py-1 rounded-lg bg-white/80 hover:bg-white hover:border-[#185ADB]/40 border border-stone-200/80 text-stone-700 hover:text-[#185ADB] text-[11px] font-medium transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP & TABLET ARCHITECTURAL SHOWROOM STAGE (Hidden on mobile)       */}
      {/* ========================================================================= */}
      <div className="hidden md:block relative z-10 px-4 sm:px-6 lg:px-10 pt-4 pb-12 sm:pb-14">
        
        {/* Main Stage Architectural Frame */}
        <div className="relative w-full max-w-[1380px] mx-auto min-h-[580px] lg:min-h-[640px] flex flex-col justify-end">

          {/* ------------------------------------------------------------------- */}
          {/* SUSPENSION SYSTEM: Fine Vertical Ceiling Cable Lines                */}
          {/* ------------------------------------------------------------------- */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Left Tower Suspension Cables */}
            <div className="absolute left-[13%] top-0 h-[380px] w-[1px] bg-gradient-to-b from-stone-400/30 via-stone-400/60 to-stone-400/80" />
            <div className="absolute left-[24%] top-0 h-[280px] w-[1px] bg-gradient-to-b from-stone-400/30 via-stone-400/60 to-stone-400/80" />

            {/* Center Headphones Suspension Cable */}
            <div className="absolute left-[54%] top-0 h-[230px] w-[1px] bg-gradient-to-b from-stone-400/30 via-stone-400/60 to-stone-400/80" />

            {/* Right Shelf Suspension Cables */}
            <div className="absolute left-[69%] top-0 h-[255px] w-[1px] bg-gradient-to-b from-stone-400/30 via-stone-400/60 to-stone-400/80" />
            <div className="absolute left-[86%] top-0 h-[255px] w-[1px] bg-gradient-to-b from-stone-400/30 via-stone-400/60 to-stone-400/80" />
            <div className="absolute left-[66%] top-0 h-[340px] w-[1px] bg-gradient-to-b from-stone-400/30 via-stone-400/60 to-stone-400/80" />
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* 3-ZONE SHOWROOM EXHIBITION COMPOSITION                              */}
          {/* ------------------------------------------------------------------- */}
          <div className="relative z-10 grid grid-cols-12 gap-2 lg:gap-4 items-end mb-8">

            {/* =============================================================== */}
            {/* ZONE A: LEFT MULTI-TIER FLOATING SHELVES (Beauty & Jewellery)   */}
            {/* =============================================================== */}
            <div className="col-span-4 relative h-[480px] lg:h-[530px] flex flex-col justify-between pb-2">
              
              {/* TIER 4 (Top Floating Shelf): Luxury Bag / Scarf & Lifestyle */}
              <div className="relative w-[85%] ml-auto">
                {/* Real Product: Bag / Handbag / Scarf */}
                <div className="flex items-end justify-between px-2 pb-1.5">
                  <div className="w-24 lg:w-28 h-24 lg:h-28 -mb-1">
                    <ShowroomProductSpot
                      product={showroom.leftTopBag}
                      badgeText={showroom.leftTopBag?.name?.slice(0, 24)}
                      imageClassName="max-h-24 lg:max-h-28"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                  {/* Folded stacks / Lifestyle accessory */}
                  <div className="w-18 lg:w-20 h-16 lg:h-18 pb-0.5">
                    <ShowroomProductSpot
                      product={showroom.bottomClothing}
                      badgeText={showroom.bottomClothing?.name?.slice(0, 20)}
                      imageClassName="max-h-16 lg:max-h-18"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>
                {/* Horizontal Floating Shelf Slab */}
                <div className="w-full h-3 rounded-xs bg-white border-t border-white border-x border-b border-stone-300/80 shadow-[0_6px_14px_-2px_rgba(0,0,0,0.06)]" />
              </div>

              {/* TIER 3 (Upper-Mid Floating Shelf): Skincare Serum & Headwear */}
              <div className="relative w-[92%] ml-auto">
                <div className="flex items-end justify-around px-3 pb-1.5">
                  <div className="w-20 lg:w-24 h-20 lg:h-24">
                    <ShowroomProductSpot
                      product={showroom.leftUpperMidSerum}
                      badgeText={showroom.leftUpperMidSerum?.name?.slice(0, 24)}
                      imageClassName="max-h-20 lg:max-h-24"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                  <div className="w-16 lg:w-20 h-16 lg:h-20">
                    <ShowroomProductSpot
                      product={showroom.leftLowerFragrance}
                      badgeText={showroom.leftLowerFragrance?.name?.slice(0, 20)}
                      imageClassName="max-h-16 lg:max-h-20"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>
                {/* Horizontal Floating Shelf Slab */}
                <div className="w-full h-3 rounded-xs bg-white border-t border-white border-x border-b border-stone-300/80 shadow-[0_6px_14px_-2px_rgba(0,0,0,0.06)]" />
              </div>

              {/* TIER 2 (Mid Floating Shelf): Jewellery Stand & Organizers */}
              <div className="relative w-[90%] ml-auto">
                <div className="flex items-end justify-between px-4 pb-1.5">
                  <div className="w-22 lg:w-26 h-22 lg:h-26">
                    <ShowroomProductSpot
                      product={showroom.leftMidJewelry}
                      badgeText={showroom.leftMidJewelry?.name?.slice(0, 24)}
                      imageClassName="max-h-22 lg:max-h-26"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                  <div className="w-16 lg:w-20 h-16 lg:h-20">
                    <ShowroomProductSpot
                      product={showroom.bottomFitness}
                      badgeText={showroom.bottomFitness?.name?.slice(0, 20)}
                      imageClassName="max-h-16 lg:max-h-20"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>
                {/* Horizontal Floating Shelf Slab */}
                <div className="w-full h-3 rounded-xs bg-white border-t border-white border-x border-b border-stone-300/80 shadow-[0_6px_14px_-2px_rgba(0,0,0,0.06)]" />
              </div>

              {/* TIER 1 (Lower Floating Shelf): Fragrance & Beauty Care */}
              <div className="relative w-[96%] ml-auto">
                <div className="flex items-end justify-around px-2 pb-1.5">
                  <div className="w-20 lg:w-24 h-20 lg:h-24">
                    <ShowroomProductSpot
                      product={showroom.leftLowerFragrance}
                      badgeText={showroom.leftLowerFragrance?.name?.slice(0, 22)}
                      imageClassName="max-h-20 lg:max-h-24"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                  <div className="w-16 lg:w-20 h-16 lg:h-20">
                    <ShowroomProductSpot
                      product={showroom.rightTopPouch}
                      badgeText={showroom.rightTopPouch?.name?.slice(0, 20)}
                      imageClassName="max-h-16 lg:max-h-20"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>
                {/* Horizontal Floating Shelf Slab */}
                <div className="w-full h-3 rounded-xs bg-white border-t border-white border-x border-b border-stone-300/80 shadow-[0_6px_14px_-2px_rgba(0,0,0,0.06)]" />
              </div>

            </div>

            {/* =============================================================== */}
            {/* ZONE B: CENTER T-PEDESTAL STAGE (Flagship Electronics & Audio) */}
            {/* =============================================================== */}
            <div className="col-span-4 relative h-[480px] lg:h-[530px] flex flex-col items-center justify-end">

              {/* Suspended Headphones Floating Mid-Air beside the Plinth */}
              <div className="absolute right-0 lg:right-2 top-24 lg:top-28 z-20 w-24 lg:w-28 h-24 lg:h-28">
                <ShowroomProductSpot
                  product={showroom.centerHeadphones}
                  badgeText={showroom.centerHeadphones?.name?.slice(0, 24)}
                  imageClassName="max-h-24 lg:max-h-28"
                  onProductClick={handleOpenProduct}
                  t={t}
                />
              </div>

              {/* THE LARGE CENTRAL FEATURED PRODUCT (Standing tall on the main plinth) */}
              <div className="relative z-20 w-44 lg:w-52 h-44 lg:h-52 mb-1">
                <ShowroomProductSpot
                  product={showroom.centerFeatured}
                  isHero={true}
                  badgeText={showroom.centerFeatured?.name?.slice(0, 30)}
                  imageClassName="max-h-44 lg:max-h-52"
                  onProductClick={handleOpenProduct}
                  t={t}
                />
              </div>

              {/* Architectural Stepped T-Plinth Structure */}
              <div className="relative w-full flex flex-col items-center">
                {/* Plinth Top Ledge Surface */}
                <div className="w-48 lg:w-56 h-12 rounded-t-sm bg-white border-t border-x border-stone-300/80 shadow-sm flex items-center justify-center">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-stone-600">
                    AZRAQ FLAGSHIP
                  </span>
                </div>

                {/* Vertical Central Column Stem with Stepped Pedestals */}
                <div className="relative w-28 lg:w-32 h-48 lg:h-56 bg-stone-100/90 border-x border-stone-300/80 shadow-inner flex flex-col items-center justify-between p-2">
                  
                  {/* Smart Watch mounted on the front face */}
                  <div className="relative z-10 w-20 lg:w-22 h-20 lg:h-22 -mt-4">
                    <ShowroomProductSpot
                      product={showroom.centerSmartwatch}
                      badgeText={showroom.centerSmartwatch?.name?.slice(0, 20)}
                      imageClassName="max-h-20 lg:max-h-22"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>

                  {/* Fast Charger resting on lower plinth step */}
                  <div className="relative z-10 w-18 lg:w-20 h-18 lg:h-20">
                    <ShowroomProductSpot
                      product={showroom.centerCharger}
                      badgeText={showroom.centerCharger?.name?.slice(0, 20)}
                      imageClassName="max-h-18 lg:max-h-20"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>

                </div>

                {/* Sub-Pedestal Right Step Block */}
                <div className="absolute right-4 lg:right-6 bottom-0 w-24 lg:w-28 h-28 lg:h-32 bg-white border-t border-x border-stone-300/80 shadow-xs flex flex-col items-center justify-start p-1">
                  <div className="w-16 lg:w-20 h-16 lg:h-20">
                    <ShowroomProductSpot
                      product={showroom.centerCharger}
                      badgeText={showroom.centerCharger?.name?.slice(0, 18)}
                      imageClassName="max-h-16 lg:max-h-20"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* =============================================================== */}
            {/* ZONE C: RIGHT FLOATING SHELVES & ACCENTS (Kitchen & Home)       */}
            {/* =============================================================== */}
            <div className="col-span-4 relative h-[480px] lg:h-[530px] flex flex-col justify-between pb-2">

              {/* UPPER HORIZONTAL FLOATING SHELF: Stirring Mug, Lamp, Leather Card Holder */}
              <div className="relative w-[95%]">
                <div className="flex items-end justify-between px-3 pb-1.5">
                  {/* Modern Desk Lamp / Light */}
                  <div className="w-20 lg:w-24 h-22 lg:h-26">
                    <ShowroomProductSpot
                      product={showroom.rightTopLamp}
                      badgeText={showroom.rightTopLamp?.name?.slice(0, 22)}
                      imageClassName="max-h-22 lg:max-h-26"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                  {/* Automatic Stirring Mug */}
                  <div className="w-20 lg:w-24 h-20 lg:h-24">
                    <ShowroomProductSpot
                      product={showroom.rightTopMug}
                      badgeText={showroom.rightTopMug?.name?.slice(0, 22)}
                      imageClassName="max-h-20 lg:max-h-24"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                  {/* Leather Card Holder / Accessory */}
                  <div className="w-16 lg:w-20 h-16 lg:h-20">
                    <ShowroomProductSpot
                      product={showroom.rightTopCardHolder}
                      badgeText={showroom.rightTopCardHolder?.name?.slice(0, 20)}
                      imageClassName="max-h-16 lg:max-h-20"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>
                {/* Floating Shelf Slab */}
                <div className="w-full h-3 rounded-xs bg-white border-t border-white border-x border-b border-stone-300/80 shadow-[0_6px_14px_-2px_rgba(0,0,0,0.06)]" />
              </div>

              {/* MID-LOWER SUSPENDED CUBOID BOX SHELF: Mini Juicer Blender / Kitchen Gear */}
              <div className="relative w-36 lg:w-44 ml-4">
                <div className="flex items-center justify-center p-2">
                  <div className="w-24 lg:w-28 h-24 lg:h-28">
                    <ShowroomProductSpot
                      product={showroom.rightBoxBlender}
                      badgeText={showroom.rightBoxBlender?.name?.slice(0, 24)}
                      imageClassName="max-h-24 lg:max-h-28"
                      onProductClick={handleOpenProduct}
                      t={t}
                    />
                  </div>
                </div>
                {/* 3D Box Shelf Frame */}
                <div className="w-full h-12 -mt-8 rounded-sm bg-white/90 border border-stone-300/80 shadow-xs pointer-events-none" />
              </div>

              {/* LOWER RIGHT STAGE AREA: FUMA Multicooker & Scandinavian Lounge Chair */}
              <div className="relative w-full flex items-end justify-between px-2">
                {/* Kitchen Appliance: Multicooker / Electric Cooker */}
                <div className="w-28 lg:w-34 h-28 lg:h-34">
                  <ShowroomProductSpot
                    product={showroom.rightPlatformMulticooker}
                    badgeText={showroom.rightPlatformMulticooker?.name?.slice(0, 26)}
                    imageClassName="max-h-28 lg:max-h-34"
                    onProductClick={handleOpenProduct}
                    t={t}
                  />
                </div>

                {/* Scandinavian Lounge Chair Graphic (Exact Composition Match) */}
                <div className="w-28 lg:w-36 h-32 lg:h-40">
                  <ShowroomChair className="w-full h-full" />
                </div>
              </div>

            </div>

          </div>

          {/* =================================================================== */}
          {/* THE WIDE STEPPED DISPLAY PLATFORM (Full-Width Base Plinth)         */}
          {/* =================================================================== */}
          <div className="relative w-full z-20">
            
            {/* Selected Sports & Clothing Products Arranged on the Plinth */}
            <div className="absolute -top-14 lg:-top-16 inset-x-0 px-6 sm:px-12 flex items-end justify-between pointer-events-auto">
              
              {/* Bottom Left: Genuine Badminton Racket (Yonex Astrox 100 ZZ) */}
              <div className="w-28 lg:w-36 h-28 lg:h-36 -ml-2">
                <ShowroomProductSpot
                  product={showroom.bottomSportsRacket}
                  badgeText={showroom.bottomSportsRacket?.name?.slice(0, 24)}
                  imageClassName="max-h-28 lg:max-h-36 transform -rotate-12"
                  onProductClick={handleOpenProduct}
                  t={t}
                />
              </div>

              {/* Bottom Center: Hand Gripper / Active Gadget */}
              <div className="w-20 lg:w-24 h-20 lg:h-24">
                <ShowroomProductSpot
                  product={showroom.bottomFitness}
                  badgeText={showroom.bottomFitness?.name?.slice(0, 20)}
                  imageClassName="max-h-20 lg:max-h-24"
                  onProductClick={handleOpenProduct}
                  t={t}
                />
              </div>

              {/* Bottom Right: Co-Ord Apparel / Clothing Set */}
              <div className="w-28 lg:w-34 h-28 lg:h-34 -mr-2">
                <ShowroomProductSpot
                  product={showroom.bottomClothing}
                  badgeText={showroom.bottomClothing?.name?.slice(0, 24)}
                  imageClassName="max-h-28 lg:max-h-34"
                  onProductClick={handleOpenProduct}
                  t={t}
                />
              </div>

            </div>

            {/* Platform Top Plane Surface */}
            <div className="w-full h-4 sm:h-5 rounded-t-sm bg-white border-t-2 border-white/90 border-x border-stone-300 shadow-xs" />

            {/* Platform Front Architectural Fascia (With 3D Studio Depth) */}
            <div className="w-full h-8 sm:h-10 bg-gradient-to-b from-[#EAE6DE] via-[#E4DFD6] to-[#D8D2C6] border-x border-b border-stone-300 shadow-[0_20px_35px_-8px_rgba(0,0,0,0.12)] flex items-center justify-between px-6 sm:px-10">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500">
                AZRAQ ARCHITECTURAL SHOWROOM
              </span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#185ADB]" />
                <span className="text-[10px] font-semibold text-stone-600">
                  {t("Verified Bangladesh E-Commerce", "যাচাইকৃত আসল পণ্য")}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE ARCHITECTURAL SHOWROOM (Rearranged shelves, not shrunken)       */}
      {/* ========================================================================= */}
      <div className="block md:hidden relative z-10 px-4 pt-2 pb-8">
        
        {/* Mobile Showroom Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 pt-1">
          {[
            { id: 'all', label: t('Showroom All', 'সকল শোরুম') },
            { id: 'gadgets', label: t('Gadgets & Tech', 'গ্যাজেট ও অডিও') },
            { id: 'beauty', label: t('Beauty & Jewellery', 'বিউটি ও জুয়েলারি') },
            { id: 'home', label: t('Home & Kitchen', 'হোম ও কিচেন') },
            { id: 'sports', label: t('Sports & Active', 'স্পোর্টস ও পোশাক') }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMobileTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                mobileTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white/80 text-stone-600 border border-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Architectural Display Modules for Mobile */}
        <div className="space-y-4">

          {/* 1. CENTERPIECE EXHIBIT: Featured Gadget on Pedestal */}
          {(mobileTab === 'all' || mobileTab === 'gadgets') && (
            <div className="relative rounded-xl bg-white border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#185ADB]" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    {t("Centerpiece Exhibit", "প্রধান প্রদর্শনী")}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#185ADB] bg-blue-50 px-2 py-0.5 rounded-full">
                  Gadgets & IT
                </span>
              </div>

              {/* Main Featured Product & Companion Audio */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div 
                  onClick={() => handleOpenProduct(showroom.centerFeatured)}
                  className="flex flex-col items-center text-center p-2 bg-stone-50/70 rounded-lg cursor-pointer hover:bg-stone-100/80 transition-colors"
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-2">
                    <ProductImage
                      src={showroom.centerFeatured?.main_image}
                      alt={showroom.centerFeatured?.name}
                      fit="contain"
                      aspectRatio="square"
                      priority={true}
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-900 line-clamp-1">
                    {showroom.centerFeatured?.name}
                  </span>
                  <span className="text-xs font-extrabold text-[#185ADB] mt-0.5">
                    ৳{(showroom.centerFeatured?.price || 0).toLocaleString()}
                  </span>
                </div>

                <div 
                  onClick={() => handleOpenProduct(showroom.centerHeadphones)}
                  className="flex flex-col items-center text-center p-2 bg-stone-50/70 rounded-lg cursor-pointer hover:bg-stone-100/80 transition-colors"
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-2">
                    <ProductImage
                      src={showroom.centerHeadphones?.main_image}
                      alt={showroom.centerHeadphones?.name}
                      fit="contain"
                      aspectRatio="square"
                      priority={true}
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-900 line-clamp-1">
                    {showroom.centerHeadphones?.name}
                  </span>
                  <span className="text-xs font-extrabold text-[#185ADB] mt-0.5">
                    ৳{(showroom.centerHeadphones?.price || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Mini shelf with smartwatch & charger */}
              <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                <div 
                  onClick={() => handleOpenProduct(showroom.centerSmartwatch)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-stone-50 cursor-pointer"
                >
                  <div className="w-10 h-10 shrink-0">
                    <ProductImage
                      src={showroom.centerSmartwatch?.main_image}
                      alt={showroom.centerSmartwatch?.name}
                      fit="contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-stone-900 block truncate">
                      {showroom.centerSmartwatch?.name}
                    </span>
                    <span className="text-[11px] font-bold text-[#185ADB]">
                      ৳{(showroom.centerSmartwatch?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div 
                  onClick={() => handleOpenProduct(showroom.centerCharger)}
                  className="flex items-center gap-2 p-1.5 rounded-md hover:bg-stone-50 cursor-pointer"
                >
                  <div className="w-10 h-10 shrink-0">
                    <ProductImage
                      src={showroom.centerCharger?.main_image}
                      alt={showroom.centerCharger?.name}
                      fit="contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-stone-900 block truncate">
                      {showroom.centerCharger?.name}
                    </span>
                    <span className="text-[11px] font-bold text-[#185ADB]">
                      ৳{(showroom.centerCharger?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. BEAUTY & JEWELLERY FLOATING SHELVES */}
          {(mobileTab === 'all' || mobileTab === 'beauty') && (
            <div className="relative rounded-xl bg-white border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    {t("Beauty & Jewellery Edit", "বিউটি ও জুয়েলারি")}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                  Health & Beauty
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  showroom.leftTopBag,
                  showroom.leftUpperMidSerum,
                  showroom.leftMidJewelry,
                  showroom.leftLowerFragrance
                ].filter(Boolean).map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenProduct(item)}
                    className="flex flex-col items-center text-center p-2 bg-stone-50/70 rounded-lg cursor-pointer hover:bg-stone-100/80 transition-colors"
                  >
                    <div className="w-20 h-20 flex items-center justify-center mb-1.5">
                      <ProductImage
                        src={item.main_image}
                        alt={item.name}
                        fit="contain"
                        aspectRatio="square"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 line-clamp-1 w-full">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-[#185ADB] mt-0.5">
                      ৳{(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. HOME & KITCHEN GALLERY */}
          {(mobileTab === 'all' || mobileTab === 'home') && (
            <div className="relative rounded-xl bg-white border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <HomeIcon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    {t("Home & Kitchen Pavilion", "হোম ও কিচেন প্যাভিলিয়ন")}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Home & Lifestyle
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  showroom.rightTopMug,
                  showroom.rightBoxBlender,
                  showroom.rightPlatformMulticooker,
                  showroom.rightTopLamp
                ].filter(Boolean).map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenProduct(item)}
                    className="flex flex-col items-center text-center p-2 bg-stone-50/70 rounded-lg cursor-pointer hover:bg-stone-100/80 transition-colors"
                  >
                    <div className="w-20 h-20 flex items-center justify-center mb-1.5">
                      <ProductImage
                        src={item.main_image}
                        alt={item.name}
                        fit="contain"
                        aspectRatio="square"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-stone-800 line-clamp-1 w-full">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-[#185ADB] mt-0.5">
                      ৳{(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SPORTS & APPAREL DISPLAY */}
          {(mobileTab === 'all' || mobileTab === 'sports') && (
            <div className="relative rounded-xl bg-white border border-stone-200 p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    {t("Sports & Apparel Plinth", "স্পোর্টস ও অ্যাপারেল")}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Sports & Kids
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  showroom.bottomSportsRacket,
                  showroom.bottomFitness,
                  showroom.bottomClothing
                ].filter(Boolean).map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenProduct(item)}
                    className="flex flex-col items-center text-center p-1.5 bg-stone-50/70 rounded-lg cursor-pointer hover:bg-stone-100/80 transition-colors"
                  >
                    <div className="w-16 h-16 flex items-center justify-center mb-1">
                      <ProductImage
                        src={item.main_image}
                        alt={item.name}
                        fit="contain"
                        aspectRatio="square"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-stone-800 line-clamp-1 w-full">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-bold text-[#185ADB] mt-0.5">
                      ৳{(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
