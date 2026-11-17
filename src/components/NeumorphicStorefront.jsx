import React, { useState } from 'react';

/**
 * Soft Monochrome Neumorphic "White" E-Commerce Storefront
 * Palette:
 * - Canvas: #D8E4EE
 * - Surface Base: #EEF3F8
 * - Elevated Surface: #F7FAFD
 * - Primary Text: #2B3A4A
 * - Secondary Text: #7D8FA3
 * - Accent / Highlight: #F27A3F
 */
export default function NeumorphicStorefront() {
  const [activeTab, setActiveTab] = useState('Brand New');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(1);
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

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = !prev[id];
      showNotice(next ? 'Saved to wishlist ❤️' : 'Removed from wishlist');
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
    setTimeout(() => setNotification(''), 2400);
  };

  const handleBuyNow = (name) => {
    setCartCount((c) => c + 1);
    showNotice(`${name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-[#D8E4EE] p-4 md:p-10 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Main Container */}
      <div className="w-full max-w-[1240px] bg-[#EEF3F8] rounded-[36px] p-6 md:p-10 shadow-[18px_18px_36px_#CBD7E4,-18px_-18px_36px_#FFFFFF] relative overflow-hidden">
        
        {/* TOP NAVIGATION */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-[#2B3A4A] italic select-none">
              White
            </span>
          </div>

          {/* Centered Search & Categories */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-3">
            <div className="w-full bg-[#EEF3F8] shadow-[inset_5px_5px_10px_#CBD7E4,inset_-5px_-5px_10px_#FFFFFF] rounded-full px-5 py-2.5 flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-[#2B3A4A] placeholder-[#7D8FA3] text-sm font-medium"
              />
              <svg className="w-4 h-4 text-[#7D8FA3]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>

            <nav className="flex items-center gap-6 text-sm font-semibold pt-1">
              {['Brand New', 'Clothes', 'Leather', 'Accessories'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-1 transition-all ${
                    activeTab === tab
                      ? "text-[#2B3A4A] after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-[2.5px] after:bg-[#2B3A4A] after:rounded-full"
                      : 'text-[#7D8FA3] hover:text-[#2B3A4A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tactile Profile & Cart Icons */}
          <div className="flex items-center gap-4">
            <button 
              className="w-11 h-11 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] transition-all"
              title="Account"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
            </button>

            <button 
              className="w-11 h-11 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] relative transition-all"
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F27A3F] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </button>
          </div>
        </header>

        {/* HERO + PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">

          {/* LEFT: HERO PRODUCT SPOTLIGHT */}
          <section className="lg:col-span-6 flex flex-col justify-between bg-[#EEF3F8] rounded-[32px] p-6 shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF]">
            <div className="w-full relative rounded-[28px] overflow-hidden bg-gradient-to-b from-[#F4F8FA] to-[#E3EDF4] aspect-[4/3] flex items-center justify-center border border-white/40">
              <img 
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80" 
                alt="Woodland Boot White Edition" 
                className="w-full h-full object-cover mix-blend-multiply opacity-90 contrast-105"
              />
              <button 
                onClick={() => toggleFavorite('hero')}
                className="absolute top-5 right-5 w-11 h-11 rounded-2xl bg-[#F7FAFD] shadow-[4px_4px_10px_rgba(203,215,228,0.7),-4px_-4px_10px_#FFFFFF] flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg 
                  className={`w-6 h-6 transition-colors ${favorites.hero ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} 
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={favorites.hero ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#2B3A4A]">Woodland Boot</h1>
                <p className="text-sm font-medium text-[#7D8FA3] mt-0.5">White leather Edition</p>
                <p className="text-2xl font-extrabold text-[#2B3A4A] mt-2">$375</p>
              </div>

              <button
                onClick={() => handleBuyNow('Woodland Boot')}
                className="px-7 py-3 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] font-bold text-[#2B3A4A] flex items-center gap-2 hover:text-[#F27A3F] transition-all group"
              >
                <span>Buy Now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </section>

          {/* RIGHT: FEATURED PRODUCTS GRID */}
          <section className="lg:col-span-6 flex flex-col justify-between gap-6">

            {/* ROW 1: 3 CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { id: 'card1', title: "Peanut m&m's", subtitle: 'White edition', price: null, img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=350&q=80' },
                { id: 'card2', title: 'Banana Art', subtitle: null, price: '$80', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=350&q=80' },
                { id: 'card3', title: 'Lion Art Print', subtitle: null, price: '$93.50', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=350&q=80' },
              ].map((card) => (
                <div key={card.id} className="bg-[#EEF3F8] rounded-[24px] p-3 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                  <div className="w-full aspect-square rounded-[18px] bg-[#F2F6FA] overflow-hidden relative flex items-center justify-center">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-300" />
                    <button
                      onClick={() => toggleFavorite(card.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90"
                    >
                      <svg 
                        className={`w-4 h-4 ${favorites[card.id] ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path strokeWidth={favorites[card.id] ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 px-1 pb-1">
                    <h3 className="text-sm font-semibold text-[#2B3A4A] leading-tight">{card.title}</h3>
                    {card.subtitle && <p className="text-xs text-[#7D8FA3] font-medium mt-0.5">{card.subtitle}</p>}
                    {card.price && <p className="text-sm font-bold text-[#2B3A4A] mt-0.5">{card.price}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION HEADING */}
            <div className="flex items-center justify-between pt-2">
              <h2 className="text-lg font-bold text-[#2B3A4A] tracking-tight">Featured</h2>
              <button className="w-8 h-8 rounded-full bg-[#EEF3F8] shadow-[5px_5px_10px_#CBD7E4,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] hover:text-[#F27A3F] transition-all">
                →
              </button>
            </div>

            {/* ROW 2: 3 CARDS WITH STEPPERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { id: 'card4', key: 'can', title: 'Can', img: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=350&q=80' },
                { id: 'card5', key: 'mask1', title: 'Mask', img: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=350&q=80' },
                { id: 'card6', key: 'mask2', title: 'Mask', img: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?auto=format&fit=crop&w=350&q=80' },
              ].map((card) => (
                <div key={card.id} className="bg-[#EEF3F8] rounded-[24px] p-3 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group">
                  <div className="w-full aspect-square rounded-[18px] bg-[#F2F6FA] overflow-hidden relative flex items-center justify-center">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover mix-blend-luminosity opacity-85 group-hover:scale-105 transition-transform duration-300" />
                    <button
                      onClick={() => toggleFavorite(card.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90"
                    >
                      <svg 
                        className={`w-4 h-4 ${favorites[card.id] ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'}`} 
                        viewBox="0 0 24 24"
                      >
                        <path strokeWidth={favorites[card.id] ? 0 : 2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 px-1 pb-1">
                    <h3 className="text-sm font-semibold text-[#2B3A4A]">{card.title}</h3>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs font-medium text-[#7D8FA3]">Size</span>
                      <div className="flex items-center gap-1 bg-[#EEF3F8] shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] px-2 py-1 rounded-full text-xs font-semibold text-[#2B3A4A]">
                        <button 
                          onClick={() => updateQuantity(card.key, -1)}
                          className="w-4 h-4 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold"
                        >
                          -
                        </button>
                        <span className="px-1 min-w-[14px] text-center font-mono">
                          {quantities[card.key]}
                        </span>
                        <button 
                          onClick={() => updateQuantity(card.key, 1)}
                          className="w-4 h-4 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>
        </div>

        {/* FEEDBACK TOAST */}
        {notification && (
          <div className="fixed bottom-6 right-6 bg-[#EEF3F8] shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] px-5 py-3 rounded-2xl text-sm font-semibold text-[#2B3A4A] flex items-center gap-3 animate-fade-in z-50">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F27A3F]"></span>
            <span>{notification}</span>
          </div>
        )}

      </div>
    </div>
  );
}
