import React, { Suspense, lazy } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import {
  NavigationDock,
  Header,
  HeroSection,
  BrowseByCategoriesSection,
  TrendingRightNowSection,
  PromotionalBannersSection,
  FeaturedCollectionsSection,
  ShopByCollectionSection,
  ProductGrid,
  ProductDemonstrationSection,
  BrandValuePanel,
  StatsRibbon,
  EditorialCtaSection,
  Footer,
  CartDrawer,
  Toast
} from './components';

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

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#2B3A4A] selection:bg-[#F27A3F]/20 selection:text-[#2B3A4A] relative font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Discreet Quick Dock */}
      <NavigationDock />

      {/* 1. Website Navigation Header */}
      <Header />

      {/* Main View Container */}
      <main className="transition-all duration-300">
        {currentView === 'home' && (
          <>
            {/* 2. Hero Presentation */}
            <HeroSection />

            {/* 3. Browse By Categories */}
            <BrowseByCategoriesSection />

            {/* 4. Trending Right Now */}
            <TrendingRightNowSection />

            {/* 5. Split Promotional Banners */}
            <PromotionalBannersSection />

            {/* 6. Featured Collections */}
            <FeaturedCollectionsSection />

            {/* 7. Complete Categories Explorer */}
            <ShopByCollectionSection />

            {/* 8. Full Products Catalog */}
            <ProductGrid />

            {/* Supporting Brand Value & Trust Strips */}
            <ProductDemonstrationSection />
            <BrandValuePanel />
            <StatsRibbon />
            <EditorialCtaSection />
          </>
        )}

        <Suspense fallback={null}>
          {currentView === 'collections' && <CollectionsPage />}
          {currentView === 'collection-detail' && <CollectionDetailPage />}
        </Suspense>
      </main>

      {/* Website Footer */}
      <Footer />

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
