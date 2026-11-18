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
      <div className="min-h-screen bg-[#E4EEF5] text-[#293B52] selection:bg-[#0877C9]/20 selection:text-[#0877C9] font-sans relative overflow-x-hidden">

          {/* Main Desktop Container (Maximum content width ~1360px with generous spacing) */}
          <div className="max-w-[1360px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-5 flex flex-col gap-7 sm:gap-8 relative">

            {/* Top Header (Minimal Premium Soft Neumorphic Header) */}
            <Header
              onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            />

              {/* Primary View Container */}
              <main className="transition-all duration-200 flex flex-col gap-7 sm:gap-8 w-full min-w-0 max-w-full">
                {currentView === 'home' && (
                  <>
                    {/* 1. Asymmetric Bento Hero Product Showcase */}
                    <HeroSection />

                    {/* 2. Shop by Category (Neumorphic Category Grid with authentic photos) */}
                    <BrowseByCategoriesSection />

                    {/* 3. Featured Products / Best Sellers (Strictly 5 product cards per row) */}
                    <TrendingRightNowSection />

                    {/* 4. Complete EasyDrop Collections Explorer */}
                    <ShopByCollectionSection />

                    {/* 5. Daily Discover Product Catalog Grid (Strictly 5 product cards per row) */}
                    <ProductGrid />

                    {/* 6. Customer Assurance & Retail Guarantees */}
                    <BrandValuePanel />
                  </>
                )}

                <Suspense fallback={null}>
                  {currentView === 'collections' && <CollectionsPage />}
                  {currentView === 'collection-detail' && <CollectionDetailPage />}
                </Suspense>
              </main>

              {/* Professional E-Commerce Footer */}
              <Footer />

          </div>

          {/* Navigation Sidebar Drawer */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

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
