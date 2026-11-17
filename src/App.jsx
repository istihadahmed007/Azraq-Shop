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
    <div className="min-h-screen bg-gradient-to-br from-[#E8F2FC] via-[#F1F7FE] to-[#E8F2FC] text-[#101C35] selection:bg-[#2563EB]/20 selection:text-[#101C35] font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Outer App Frame (Reference Screenshot Composition) */}
      <div className="max-w-[1720px] mx-auto p-3 sm:p-5 lg:p-6 flex items-start gap-5 lg:gap-6 relative">
        
        {/* 1. Left Floating Sidebar Navigation */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* 2. Main Content Stream */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6">
          
          {/* Top Utility & Search Header */}
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          />

          {/* Primary View Container */}
          <main className="transition-all duration-300 flex flex-col gap-4">
            {currentView === 'home' && (
              <>
                {/* 3. Hero Section (Left Hero + Right Stacked Promo Cards) */}
                <HeroSection />

                {/* 4. Horizontal Category Strip (Shop by Category + Category Pills) */}
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
