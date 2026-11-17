import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import rawImages from '../data/whiteStoreImages.json';

const STORE_IMAGES = {
  hero: rawImages['hero_boot.jpg'] || '/images/white-store/hero_boot.jpg',
  mms: rawImages['mms.jpg'] || '/images/white-store/mms.jpg',
  banana: rawImages['banana.jpg'] || '/images/white-store/banana.jpg',
  lion: rawImages['lion.jpg'] || '/images/white-store/lion.jpg',
  can: rawImages['can.jpg'] || '/images/white-store/can.jpg',
  mask_angled: rawImages['mask_angled.jpg'] || '/images/white-store/mask_angled.jpg',
  mask_front: rawImages['mask_front.jpg'] || '/images/white-store/mask_front.jpg',
};

/**
 * Pixel-Accurate Soft Monochrome Neumorphic ("Soft UI") Desktop Storefront
 * - Canvas Background: #D8E4EE
 * - Surface Base: #EEF3F8
 * - Elevated / Active: #F7FAFD
 * - Primary Slate: #2B3A4A
 * - Secondary Steel: #7D8FA3
 * - Active Heart / Accent: #F27A3F
 */
export default function NeumorphicStorefront() {
  let shopContext = null;
  try {
    shopContext = useShop();
  } catch (e) {
    // Fallback if rendered outside ShopProvider
  }

  const [activeTab, setActiveTab] = useState('Brand New');
  const [searchQuery, setSearchQuery] = useState('');
  const [localCartCount, setLocalCartCount] = useState(1);
  const [favorites, setFavorites] = useState({
    hero: true,
    card1: true,
    card2: false,
    card3: false,
    card4: true,
    card5: true,
    card6: true,
  });

  const [quantities, setQuantities] = useState({
    can: 1,
    mask1: 1,
    mask2: 1,
  });

  const [notification, setNotification] = useState('');

  const cartItemsCount = shopContext?.cart 
    ? shopContext.cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : localCartCount;

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = !prev[id];
      showNotice(next ? 'Added to wishlist ❤️' : 'Removed from wishlist');
      return { ...prev, [id]: next };
    });
  };

  const updateQuantity = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(1, Math.min(99, prev[key] + delta)),
    }));
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2200);
  };

  const handleBuyNow = (name, price = 375) => {
    if (shopContext?.addToCart) {
      shopContext.addToCart({
        id: 'woodland-boot-white',
        title: 'Woodland Boot - White leather Edition',
        name: 'Woodland Boot - White leather Edition',
        price: price,
        sale_price: price,
        image: STORE_IMAGES.hero,
        quantity: 1,
      });
      if (shopContext.setIsCartOpen) {
        shopContext.setIsCartOpen(true);
      }
    } else {
      setLocalCartCount((c) => c + 1);
    }
    showNotice(`${name} added to cart!`);
  };

  const handleOpenCart = () => {
    if (shopContext?.setIsCartOpen) {
      shopContext.setIsCartOpen(true);
    } else {
      showNotice('Cart view opened');
    }
  };

  const handleOpenProfile = () => {
    if (shopContext?.setIsAdminOpen) {
      shopContext.setIsAdminOpen(true);
    } else {
      showNotice('Profile opened');
    }
  };

  return (
    <div className="min-h-screen bg-[#D8E4EE] p-3 sm:p-6 md:p-8 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Main Single App Container */}
      <main className="w-full max-w-[1140px] bg-[#EEF3F8] rounded-[36px] p-5 sm:p-7 md:p-8 shadow-[18px_18px_36px_#CBD7E4,-18px_-18px_36px_#FFFFFF] relative select-none">
        
        {/* HEADER NAVIGATION */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#2B3A4A] italic cursor-pointer">
              White
            </span>
          </div>

          {/* Centered Search Bar & Category Navigation */}
          <div className="flex-1 max-w-md w-full flex flex-col items-center gap-2.5">
            {/* Recessed Search Bar */}
            <div className="w-full bg-[#EEF3F8] shadow-[inset_5px_5px_10px_#CBD7E4,inset_-5px_-5px_10px_#FFFFFF] rounded-full px-5 py-2 flex items-center justify-between">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-[#2B3A4A] placeholder-[#7D8FA3] font-medium text-xs md:text-sm"
              />
              <svg className="w-4 h-4 text-[#7D8FA3] cursor-pointer hover:text-[#2B3A4A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>

            {/* Category Tabs */}
            <nav className="flex items-center justify-center gap-4 sm:gap-6 text-xs md:text-sm font-semibold">
              {['Brand New', 'Clothes', 'Leather', 'Accessories'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-1 transition-all ${
                    activeTab === tab
                      ? "text-[#2B3A4A] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-[2px] after:bg-[#2B3A4A] after:rounded-full"
                      : 'text-[#7D8FA3] hover:text-[#2B3A4A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tactile Profile & Cart Buttons */}
          <div className="flex items-center gap-4">
            {/* Smiley Icon */}
            <button 
              onClick={handleOpenProfile}
              className="w-11 h-11 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] hover:text-[#F27A3F] transition-all"
              title="Profile / Admin"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
            </button>

            {/* Shopping Cart with Coral Badge */}
            <button 
              onClick={handleOpenCart}
              className="w-11 h-11 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] relative hover:text-[#F27A3F] transition-all"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F27A3F] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {cartItemsCount > 9 ? '9+' : cartItemsCount || '+'}
              </span>
            </button>
          </div>
        </header>

        {/* SPLIT 2-COLUMN DASHBOARD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-2">

          {/* LEFT: HERO SPOTLIGHT CARD (SPAN 6) */}
          <section className="lg:col-span-6 flex flex-col justify-between bg-[#EEF3F8] rounded-[32px] p-5 shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF]">
            
            {/* High-Key Photo Frame */}
            <div className="w-full relative rounded-[28px] overflow-hidden aspect-[4/3] bg-[#E9F0F6]">
              <img 
                src={STORE_IMAGES.hero} 
                alt="Woodland Boot" 
                className="w-full h-full object-cover"
              />

              {/* Floating Coral Heart Button */}
              <button 
                onClick={() => toggleFavorite('hero')}
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-[#F7FAFD] shadow-[4px_4px_10px_rgba(203,215,228,0.7),-4px_-4px_10px_#FFFFFF] flex items-center justify-center active:scale-90 transition-transform"
                title="Wishlist"
              >
                <svg 
                  className={`w-5 h-5 transition-all ${
                    favorites.hero 
                      ? 'text-[#F27A3F] fill-[#F27A3F] drop-shadow-[0_4px_10px_rgba(242,122,63,0.45)]' 
                      : 'text-[#CBD7E4] fill-none stroke-current'
                  }`} 
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={favorites.hero ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            {/* Bottom Metadata & Buy Now CTA */}
            <div className="mt-5 flex items-end justify-between gap-4 px-1">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#2B3A4A]">Woodland Boot</h1>
                <p className="text-xs font-medium text-[#7D8FA3] mt-0.5">White leather Edition</p>
                <p className="text-2xl font-extrabold text-[#2B3A4A] mt-2">$375</p>
              </div>

              <button
                onClick={() => handleBuyNow('Woodland Boot', 375)}
                className="px-6 py-2.5 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] font-bold text-sm text-[#2B3A4A] flex items-center gap-2 hover:text-[#F27A3F] transition-all group"
              >
                <span>Buy Now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </section>

          {/* RIGHT: 6-CARD GRID (SPAN 6) */}
          <section className="lg:col-span-6 flex flex-col justify-between gap-5">

            {/* ROW 1: 3 CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Card 1: Peanut m&m's */}
              <article className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6]">
                  <img src={STORE_IMAGES.mms} alt="Peanut m&m's" className="w-full h-full object-cover" />
                  <button onClick={() => toggleFavorite('card1')} className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90">
                    <svg className={`w-3.5 h-3.5 ${favorites.card1 ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} viewBox="0 0 24 24">
                      <path strokeWidth={favorites.card1 ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className="mt-2.5 px-1 pb-1">
                  <h2 className="text-xs font-semibold text-[#2B3A4A] leading-tight">Peanut m&m's</h2>
                  <p className="text-[11px] text-[#7D8FA3] font-medium mt-0.5">White edition</p>
                </div>
              </article>

              {/* Card 2: Banana Art */}
              <article className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6]">
                  <img src={STORE_IMAGES.banana} alt="Banana Art" className="w-full h-full object-cover" />
                  <button onClick={() => toggleFavorite('card2')} className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90">
                    <svg className={`w-3.5 h-3.5 ${favorites.card2 ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className="mt-2.5 px-1 pb-1">
                  <h2 className="text-xs font-semibold text-[#2B3A4A] leading-tight">Banana Art</h2>
                  <p className="text-xs font-bold text-[#2B3A4A] mt-0.5">$80</p>
                </div>
              </article>

              {/* Card 3: Lion Art Print */}
              <article className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6]">
                  <img src={STORE_IMAGES.lion} alt="Lion Art Print" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2.5 px-1 pb-1">
                  <h2 className="text-xs font-semibold text-[#2B3A4A] leading-tight">Lion Art Print</h2>
                  <p className="text-xs font-bold text-[#2B3A4A] mt-0.5">$93.50</p>
                </div>
              </article>
            </div>

            {/* SECTION DIVIDER: FEATURED HEADING & ARROW */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-base font-bold text-[#2B3A4A] tracking-tight">Featured</h3>
              <button className="w-7 h-7 rounded-full bg-[#EEF3F8] shadow-[5px_5px_10px_#CBD7E4,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] hover:text-[#F27A3F] transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* ROW 2: 3 CARDS WITH STEPPERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Card 4: Can */}
              <article className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6]">
                  <img src={STORE_IMAGES.can} alt="Can" className="w-full h-full object-cover" />
                  <button onClick={() => toggleFavorite('card4')} className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90">
                    <svg className={`w-3.5 h-3.5 ${favorites.card4 ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} viewBox="0 0 24 24">
                      <path strokeWidth={favorites.card4 ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className="mt-2.5 px-1 pb-1">
                  <h2 className="text-xs font-semibold text-[#2B3A4A]">Can</h2>
                  <div className="flex items-center justify-between gap-1 mt-1.5">
                    <span className="text-[11px] font-medium text-[#7D8FA3]">Size</span>
                    <div className="flex items-center bg-[#EEF3F8] shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] px-2 py-0.5 rounded-full text-xs font-semibold text-[#2B3A4A]">
                      <button onClick={() => updateQuantity('can', -1)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold">-</button>
                      <span className="px-1 min-w-[12px] text-center text-[11px] font-mono">{quantities.can}</span>
                      <button onClick={() => updateQuantity('can', 1)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold">+</button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Card 5: Mask Angled */}
              <article className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6]">
                  <img src={STORE_IMAGES.mask_angled} alt="Mask" className="w-full h-full object-cover" />
                  <button onClick={() => toggleFavorite('card5')} className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90">
                    <svg className={`w-3.5 h-3.5 ${favorites.card5 ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} viewBox="0 0 24 24">
                      <path strokeWidth={favorites.card5 ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className="mt-2.5 px-1 pb-1">
                  <h2 className="text-xs font-semibold text-[#2B3A4A]">Mask</h2>
                  <div className="flex items-center justify-between gap-1 mt-1.5">
                    <span className="text-[11px] font-medium text-[#7D8FA3]">Size</span>
                    <div className="flex items-center bg-[#EEF3F8] shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] px-2 py-0.5 rounded-full text-xs font-semibold text-[#2B3A4A]">
                      <button onClick={() => updateQuantity('mask1', -1)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold">-</button>
                      <span className="px-1 min-w-[12px] text-center text-[11px] font-mono">{quantities.mask1}</span>
                      <button onClick={() => updateQuantity('mask1', 1)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold">+</button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Card 6: Mask Front */}
              <article className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6]">
                  <img src={STORE_IMAGES.mask_front} alt="Mask" className="w-full h-full object-cover" />
                  <button onClick={() => toggleFavorite('card6')} className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90">
                    <svg className={`w-3.5 h-3.5 ${favorites.card6 ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} viewBox="0 0 24 24">
                      <path strokeWidth={favorites.card6 ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
                <div className="mt-2.5 px-1 pb-1">
                  <h2 className="text-xs font-semibold text-[#2B3A4A]">Mask</h2>
                  <div className="flex items-center justify-between gap-1 mt-1.5">
                    <span className="text-[11px] font-medium text-[#7D8FA3]">Size</span>
                    <div className="flex items-center bg-[#EEF3F8] shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] px-2 py-0.5 rounded-full text-xs font-semibold text-[#2B3A4A]">
                      <button onClick={() => updateQuantity('mask2', -1)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold">-</button>
                      <span className="px-1 min-w-[12px] text-center text-[11px] font-mono">{quantities.mask2}</span>
                      <button onClick={() => updateQuantity('mask2', 1)} className="w-3.5 h-3.5 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold">+</button>
                    </div>
                  </div>
                </div>
              </article>

            </div>

          </section>
        </div>

        {/* FEEDBACK TOAST */}
        {notification && (
          <div className="fixed bottom-6 right-6 bg-[#EEF3F8] shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] px-5 py-3 rounded-2xl text-xs font-semibold text-[#2B3A4A] flex items-center gap-2.5 animate-fade-in z-50">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F27A3F]"></span>
            <span>{notification}</span>
          </div>
        )}

      </main>
    </div>
  );
}
