import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';

const FALLBACK_IMAGE = 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';

/**
 * Pixel-Accurate Soft Monochrome Neumorphic ("Soft UI") Desktop Storefront
 * Powered by real AZRAQ product catalog & unified ShopContext state.
 *
 * Theme Palette:
 * - Canvas Background: #D8E4EE
 * - Surface Base: #EEF3F8
 * - Elevated / Active: #F7FAFD
 * - Primary Slate: #2B3A4A
 * - Secondary Steel: #7D8FA3
 * - Active Accent: #F27A3F
 */
export default function NeumorphicStorefront() {
  // Call useShop unconditionally at top of component
  const {
    products,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    addToCart,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    setIsCartOpen,
    setIsAdminOpen,
    totalCartItems,
    cart,
    t
  } = useShop();

  // Local card quantities for row 2 stepper controls
  const [quantities, setQuantities] = useState({});

  const cartCount = totalCartItems || (cart ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0);

  // Build category tabs from real catalog (matching ProductGrid ordering & deduplication)
  const categoryTabs = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return ['All Products'];
    }

    const rawCategories = Array.from(
      new Set(
        products
          .map((p) => p.category || p.primary_collection_name)
          .filter(Boolean)
      )
    );

    const priority = [
      'Gadgets & IT Accessories',
      'Sports & Kids',
      'Men Clothing',
      'Kitchen Appliances',
      'Health & Beauty',
      'Home & Lifestyle',
      'Jewelries & Accessories',
      'Gifts'
    ];

    const sorted = [
      ...priority.filter((p) => rawCategories.includes(p)),
      ...rawCategories.filter((r) => !priority.includes(r))
    ];

    return ['All Products', ...sorted];
  }, [products]);

  // Filter catalog by both activeCategory and searchQuery across name, category, collection, SKU, and ID
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let result = [...products];

    // Category filter
    if (activeCategory && activeCategory !== 'All' && activeCategory !== 'All Products') {
      result = result.filter(
        (p) =>
          p.category === activeCategory ||
          p.primary_collection_name === activeCategory ||
          (Array.isArray(p.collection_names) && p.collection_names.includes(activeCategory))
      );
    }

    // Search query filter
    const q = (searchQuery || '').trim().toLowerCase();
    if (q) {
      result = result.filter((p) => {
        const name = (p.name || p.title || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const col = (p.primary_collection_name || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        const id = (p.id || '').toLowerCase();
        return (
          name.includes(q) ||
          cat.includes(q) ||
          col.includes(q) ||
          sku.includes(q) ||
          id.includes(q)
        );
      });
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  // Partition filtered products into layout slots
  const heroProduct = filteredProducts[0] || null;
  const gridProducts = filteredProducts.slice(1, 7);
  const row1Products = gridProducts.slice(0, 3);
  const row2Products = gridProducts.slice(3, 6);

  const getQuantity = (productId) => quantities[productId] || 1;

  const updateQuantity = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(99, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleProductClick = (product) => {
    if (product && setSelectedProduct) {
      setSelectedProduct(product);
    }
  };

  const handleAddToCart = (e, product, qty = 1, openCart = false) => {
    e.stopPropagation();
    if (!product || !addToCart) return;
    const variant = product.variants?.[0] || 'Standard';
    addToCart(product, variant, qty);
    if (openCart && setIsCartOpen) {
      setIsCartOpen(true);
    }
  };

  const handleToggleWishlist = (e, productId) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(productId);
    }
  };

  const isFavorite = (productId) => {
    return Array.isArray(favorites) && favorites.includes(productId);
  };

  return (
    <div className="min-h-screen bg-[#D8E4EE] p-3 sm:p-6 md:p-8 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Main Single App Container */}
      <main className="w-full max-w-[1140px] bg-[#EEF3F8] rounded-[36px] p-5 sm:p-7 md:p-8 shadow-[18px_18px_36px_#CBD7E4,-18px_-18px_36px_#FFFFFF] relative select-none">
        
        {/* HEADER NAVIGATION */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-5 pb-6">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <span
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-3xl font-extrabold tracking-tight text-[#2B3A4A] italic cursor-pointer hover:text-[#0877C9] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B3A4A] rounded-lg"
              title="AZRAQ Home"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActiveCategory('All');
                  setSearchQuery('');
                }
              }}
            >
              AZRAQ
            </span>
          </div>

          {/* Centered Search Bar & Category Navigation */}
          <div className="flex-1 max-w-lg w-full flex flex-col items-center gap-3">
            {/* Recessed Search Bar */}
            <div className="w-full bg-[#EEF3F8] shadow-[inset_5px_5px_10px_#CBD7E4,inset_-5px_-5px_10px_#FFFFFF] rounded-full px-5 py-2 flex items-center justify-between gap-2.5 transition-all focus-within:ring-2 focus-within:ring-[#0877C9]/40">
              <input
                type="text"
                placeholder={t("Search by product name, category, SKU...", "পণ্য, ক্যাটাগরি বা কোড দিয়ে খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t("Search products", "পণ্য অনুসন্ধান")}
                className="w-full bg-transparent outline-none text-[#2B3A4A] placeholder-[#7D8FA3] font-medium text-xs md:text-sm"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t("Clear search", "সার্চ মুছুন")}
                  className="text-[#7D8FA3] hover:text-[#2B3A4A] p-0.5 focus:outline-none"
                  title="Clear"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg className="w-4 h-4 text-[#7D8FA3]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              )}
            </div>

            {/* Category Tabs */}
            <nav
              className="w-full flex items-center justify-start sm:justify-center gap-3 sm:gap-5 overflow-x-auto pb-1 text-xs md:text-sm font-semibold no-scrollbar"
              aria-label={t("Categories", "ক্যাটাগরি")}
            >
              {categoryTabs.map((tab) => {
                const isAll = tab === 'All Products';
                const isActive = isAll
                  ? !activeCategory || activeCategory === 'All' || activeCategory === 'All Products'
                  : activeCategory === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(isAll ? 'All' : tab)}
                    className={`relative pb-1 whitespace-nowrap transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2B3A4A] rounded-sm ${
                      isActive
                        ? "text-[#2B3A4A] font-bold after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-[2px] after:bg-[#2B3A4A] after:rounded-full"
                        : 'text-[#7D8FA3] hover:text-[#2B3A4A]'
                    }`}
                  >
                    {isAll ? t('All Products', 'সব পণ্য') : tab}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tactile Profile & Cart Buttons */}
          <div className="flex items-center gap-4">
            {/* Admin / Profile Button */}
            <button
              type="button"
              onClick={() => setIsAdminOpen && setIsAdminOpen(true)}
              className="w-11 h-11 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] hover:text-[#0877C9] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877C9]"
              title={t("Admin Panel", "অ্যাডমিন প্যানেল")}
              aria-label={t("Admin panel", "অ্যাডমিন প্যানেল")}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
            </button>

            {/* Shopping Cart with Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen && setIsCartOpen(true)}
              className="w-11 h-11 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] relative hover:text-[#F27A3F] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A3F]"
              title={t("Shopping Bag", "শপিং ব্যাগ")}
              aria-label={t(`Shopping bag with ${cartCount} items`, `শপিং ব্যাগে ${cartCount}টি পণ্য`)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#F27A3F] text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </button>
          </div>
        </header>

        {/* EMPTY STATE (When no products match search or category) */}
        {filteredProducts.length === 0 ? (
          <div className="w-full py-16 px-6 text-center flex flex-col items-center justify-center bg-[#EEF3F8] rounded-[32px] shadow-[inset_6px_6px_14px_#CBD7E4,inset_-6px_-6px_14px_#FFFFFF] my-4">
            <div className="w-16 h-16 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] flex items-center justify-center text-[#7D8FA3] mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#2B3A4A] tracking-tight">
              {t("No products found", "কোনো পণ্য পাওয়া যায়নি")}
            </h3>
            <p className="text-xs md:text-sm text-[#7D8FA3] mt-1.5 max-w-md">
              {searchQuery
                ? t(
                    `No products match "${searchQuery}" in ${activeCategory === 'All' ? 'the catalog' : activeCategory}.`,
                    `"${searchQuery}" এর সাথে মিলে এমন কোনো পণ্য পাওয়া যায়নি।`
                  )
                : t(
                    `No products currently available in ${activeCategory}.`,
                    `এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।`
                  )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-full bg-[#EEF3F8] shadow-[5px_5px_12px_#CBD7E4,-5px_-5px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] text-xs font-bold text-[#2B3A4A] hover:text-[#F27A3F] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877C9]"
                >
                  {t("Clear Search", "সার্চ মুছুন")}
                </button>
              )}
              {activeCategory && activeCategory !== 'All' && activeCategory !== 'All Products' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('All')}
                  className="px-5 py-2.5 rounded-full bg-[#EEF3F8] shadow-[5px_5px_12px_#CBD7E4,-5px_-5px_12px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] text-xs font-bold text-[#2B3A4A] hover:text-[#F27A3F] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0877C9]"
                >
                  {t("Show All Products", "সব পণ্য দেখুন")}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* SPLIT 2-COLUMN DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-2">

            {/* LEFT: HERO SPOTLIGHT CARD (SPAN 6) */}
            {heroProduct && (
              <section
                onClick={() => handleProductClick(heroProduct)}
                className="lg:col-span-6 flex flex-col justify-between bg-[#EEF3F8] rounded-[32px] p-5 shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] cursor-pointer group transition-all"
              >
                {/* High-Key Photo Frame */}
                <div className="w-full relative rounded-[28px] overflow-hidden aspect-[4/3] bg-[#E9F0F6] flex items-center justify-center p-3">
                  <img
                    src={heroProduct.main_image || FALLBACK_IMAGE}
                    alt={heroProduct.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />

                  {/* Floating Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleWishlist(e, heroProduct.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-[#F7FAFD] shadow-[4px_4px_10px_rgba(203,215,228,0.7),-4px_-4px_10px_#FFFFFF] flex items-center justify-center active:scale-90 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A3F]"
                    title={isFavorite(heroProduct.id) ? t("Remove from Wishlist", "পছন্দের তালিকা থেকে সরান") : t("Add to Wishlist", "পছন্দের তালিকায় যোগ করুন")}
                    aria-label={isFavorite(heroProduct.id) ? `Remove ${heroProduct.name} from wishlist` : `Add ${heroProduct.name} to wishlist`}
                  >
                    <svg
                      className={`w-5 h-5 transition-all ${
                        isFavorite(heroProduct.id)
                          ? 'text-[#F27A3F] fill-[#F27A3F] drop-shadow-[0_4px_10px_rgba(242,122,63,0.45)]'
                          : 'text-[#CBD7E4] fill-none stroke-current'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth={isFavorite(heroProduct.id) ? 0 : 2}
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Bottom Metadata & Buy Now CTA */}
                <div className="mt-5 flex items-end justify-between gap-4 px-1">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2B3A4A] line-clamp-1 group-hover:text-[#0877C9] transition-colors">
                      {heroProduct.name}
                    </h2>
                    <p className="text-xs font-medium text-[#7D8FA3] mt-0.5 truncate">
                      {heroProduct.category || heroProduct.primary_collection_name || 'AZRAQ Authentic'}
                    </p>
                    <p className="text-xl sm:text-2xl font-extrabold text-[#2B3A4A] mt-2">
                      ৳{(heroProduct.price || 0).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, heroProduct, 1, true)}
                    className="px-6 py-2.5 rounded-full bg-[#EEF3F8] shadow-[6px_6px_14px_#CBD7E4,-6px_-6px_14px_#FFFFFF] active:shadow-[inset_4px_4px_8px_#CBD7E4,inset_-4px_-4px_8px_#FFFFFF] font-bold text-sm text-[#2B3A4A] flex items-center gap-2 hover:text-[#F27A3F] transition-all flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27A3F]"
                    aria-label={`Buy ${heroProduct.name} now`}
                  >
                    <span>{t("Buy Now", "এখনই কিনুন")}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </section>
            )}

            {/* RIGHT: 6-CARD GRID (SPAN 6) */}
            <section className="lg:col-span-6 flex flex-col justify-between gap-5">

              {/* ROW 1: 3 CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {row1Products.map((product) => {
                  const fav = isFavorite(product.id);
                  return (
                    <article
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group cursor-pointer"
                    >
                      <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6] flex items-center justify-center p-2">
                        <img
                          src={product.main_image || FALLBACK_IMAGE}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90 transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F27A3F]"
                          aria-label={fav ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${
                              fav ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth={fav ? 0 : 2}
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2.5 px-1 pb-1">
                        <h3 className="text-xs font-semibold text-[#2B3A4A] leading-tight line-clamp-1 group-hover:text-[#0877C9] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs font-bold text-[#2B3A4A] mt-0.5">
                          ৳{(product.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* SECTION DIVIDER: FEATURED HEADING & QUICK JUMP */}
              <div className="flex items-center justify-between pt-1">
                <h3 className="text-base font-bold text-[#2B3A4A] tracking-tight">
                  {activeCategory === 'All' || !activeCategory
                    ? t('Featured Catalog', 'নির্বাচিত পণ্যসমূহ')
                    : `${activeCategory} (${filteredProducts.length})`}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                  className="w-7 h-7 rounded-full bg-[#EEF3F8] shadow-[5px_5px_10px_#CBD7E4,-5px_-5px_10px_#FFFFFF] active:shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] flex items-center justify-center text-[#2B3A4A] hover:text-[#F27A3F] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0877C9]"
                  title={t("Reset filters to all products", "সব পণ্য দেখুন")}
                  aria-label={t("Show all products", "সব পণ্য দেখুন")}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* ROW 2: 3 CARDS WITH STEPPERS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {row2Products.map((product) => {
                  const fav = isFavorite(product.id);
                  const qty = getQuantity(product.id);
                  return (
                    <article
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="bg-[#EEF3F8] rounded-[24px] p-2.5 shadow-[8px_8px_18px_#CBD7E4,-8px_-8px_18px_#FFFFFF] hover:shadow-[10px_10px_22px_#CBD7E4,-10px_-10px_22px_#FFFFFF] transition-all flex flex-col justify-between relative group cursor-pointer"
                    >
                      <div className="w-full aspect-square rounded-[18px] overflow-hidden relative bg-[#E9F0F6] flex items-center justify-center p-2">
                        <img
                          src={product.main_image || FALLBACK_IMAGE}
                          alt={product.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => handleToggleWishlist(e, product.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-[#F7FAFD] shadow-[3px_3px_6px_#CBD7E4,-3px_-3px_6px_#FFFFFF] flex items-center justify-center active:scale-90 transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F27A3F]"
                          aria-label={fav ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${
                              fav ? 'text-[#F27A3F] fill-[#F27A3F]' : 'text-[#CBD7E4] fill-none stroke-current'
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeWidth={fav ? 0 : 2}
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2.5 px-1 pb-1">
                        <h3 className="text-xs font-semibold text-[#2B3A4A] leading-tight line-clamp-1 group-hover:text-[#0877C9] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between gap-1 mt-1.5">
                          <span className="text-xs font-bold text-[#2B3A4A]">
                            ৳{(product.price || 0).toLocaleString()}
                          </span>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center bg-[#EEF3F8] shadow-[inset_3px_3px_6px_#CBD7E4,inset_-3px_-3px_6px_#FFFFFF] px-1.5 py-0.5 rounded-full text-xs font-semibold text-[#2B3A4A]"
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              aria-label={`Decrease quantity of ${product.name}`}
                              className="w-4 h-4 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold focus:outline-none"
                            >
                              -
                            </button>
                            <span className="px-1 min-w-[14px] text-center text-[11px] font-mono">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              aria-label={`Increase quantity of ${product.name}`}
                              className="w-4 h-4 flex items-center justify-center hover:text-[#F27A3F] active:scale-90 font-bold focus:outline-none"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleAddToCart(e, product, qty, false)}
                              aria-label={`Add ${qty} ${product.name} to bag`}
                              title={t("Add to bag", "ব্যাগে যোগ করুন")}
                              className="ml-1 w-4 h-4 rounded-full bg-[#0877C9] text-white flex items-center justify-center hover:bg-[#F27A3F] transition-colors active:scale-90"
                            >
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

            </section>
          </div>
        )}

      </main>
    </div>
  );
}
