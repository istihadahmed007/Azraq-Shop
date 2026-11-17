import React, { useState, Suspense, lazy } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import {
  Header,
  HeroSection,
  BrowseByCategoriesSection,
  TrendingRightNowSection,
  ShopByCollectionSection,
  ProductGrid,
  BrandValuePanel,
  Footer,
  CartDrawer,
  Toast
} from './components';
import Sidebar from './components/Sidebar';

// Lazy-loaded routes & secondary overlays to optimize initial bundle size & TTI
const CollectionsPage = lazy(() => import('./components/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./components/CollectionDetailPage'));
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const BrandAssetsModal = lazy(() => import('./components/BrandAssetsModal'));
const VisualSearchModal = lazy(() => import('./components/VisualSearchModal'));

function StorefrontContent() {
  const { currentView } = useShop();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#E8F2FC] text-[#101C35] selection:bg-[#0877C9]/20 selection:text-[#101C35] font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      
      {/* Ambient Blue Background Lighting (Contained within viewport bounds to prevent scroll expansion) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-[#69C5F5]/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-20 w-[520px] h-[520px] bg-[#D9EDFF]/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[440px] h-[440px] bg-[#69C5F5]/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Desktop Container (Max content width ~1440px, centered, 28-32px page gutters on desktop, 20-24px gap) */}
      <div className="max-w-[1440px] w-full mx-auto px-3.5 sm:px-7 lg:px-8 py-4 sm:py-6 flex items-start gap-0 lg:gap-6 relative overflow-x-hidden">
        
        {/* 1. Left Floating Sidebar Navigation (240px desktop) */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* 2. Main Content Stream (Flexible remaining width, strict overflow containment) */}
        <div className="flex-1 min-w-0 max-w-full w-full flex flex-col gap-6 overflow-x-hidden">
          
          {/* Top Floating Glass Header */}
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          />

          {/* Primary View Container (min-w-0 max-w-full prevents overflow on mobile) */}
          <main className="transition-all duration-300 flex flex-col gap-7 w-full min-w-0 max-w-full overflow-x-hidden">
            {currentView === 'home' && (
              <>
                {/* 3. Hero Section (Left Hero + Right Stacked Promo Cards) */}
                <HeroSection />

                {/* 4. Horizontal Category Strip (Shop by Category + Category Cards) */}
                <BrowseByCategoriesSection />

                {/* 5. Popular Products (6 Product Cards + Right Featured Collection Card) */}
                <TrendingRightNowSection />

                {/* 6. Complete EasyDrop Collections Explorer */}
                <ShopByCollectionSection />

                {/* 7. Full 1,206+ Products Catalog with Filters */}
                <ProductGrid />

                {/* 8. Bottom Horizontal Trust & Benefits Bar */}
                <BrandValuePanel />
              </>
            )}

            <Suspense fallback={null}>
              {currentView === 'collections' && <CollectionsPage />}
              {currentView === 'collection-detail' && <CollectionDetailPage />}
            </Suspense>
          </main>

          {/* Complete Website Footer */}
          <Footer />

        </div>

      </div>

      {/* Interactive Modals & Overlays */}
      <CartDrawer />
      <Toast />

      <Suspense fallback={null}>
        <ProductDetailModal />
        <CheckoutModal />
        <OrderTrackingModal />
        <AdminPanel />
        <BrandAssetsModal />
        <VisualSearchModal />
      </Suspense>

    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}
