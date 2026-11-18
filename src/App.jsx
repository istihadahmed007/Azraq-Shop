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
      <div className="min-h-screen bg-[#F5F5F5] text-[#212121] selection:bg-[#0877C9]/20 selection:text-[#0877C9] font-sans relative overflow-x-hidden">

          {/* Main Desktop Container (Standard retail 1240px max width like Shopee, centered) */}
          <div className="max-w-[1240px] w-full mx-auto px-3 sm:px-4 lg:px-5 py-2 sm:py-3 flex flex-col gap-4 relative">

            {/* Top Header (Shopee retail style) */}
            <Header
              onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            />

              {/* Primary View Container */}
              <main className="transition-all duration-200 flex flex-col gap-4 w-full min-w-0 max-w-full">
                {currentView === 'home' && (
                  <>
                    {/* 1. Promotional Banner (2/3 Main Banner + 1/3 Stacked Banners + Service Trust Bar) */}
                    <HeroSection />

                    {/* 2. Shop by Category (Clean white retail category grid) */}
                    <BrowseByCategoriesSection />

                    {/* 3. Featured Products / Best Sellers */}
                    <TrendingRightNowSection />

                    {/* 4. Complete EasyDrop Collections Explorer */}
                    <ShopByCollectionSection />

                    {/* 5. Daily Discover Product Catalog Grid */}
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
