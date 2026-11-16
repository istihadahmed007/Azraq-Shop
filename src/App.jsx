import React, { Suspense, lazy } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import NavigationDock from './components/NavigationDock';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BrowseByCategoriesSection from './components/BrowseByCategoriesSection';
import TrendingRightNowSection from './components/TrendingRightNowSection';
import PromotionalBannersSection from './components/PromotionalBannersSection';
import FeaturedCollectionsSection from './components/FeaturedCollectionsSection';
import ShopByCollectionSection from './components/ShopByCollectionSection';
import ProductGrid from './components/ProductGrid';
import ProductDemonstrationSection from './components/ProductDemonstrationSection';
import BrandValuePanel from './components/BrandValuePanel';
import StatsRibbon from './components/StatsRibbon';
import EditorialCtaSection from './components/EditorialCtaSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

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
    <div className="min-h-screen bg-[#F8FCFF] text-[#062B4F] selection:bg-[#69C5F5]/30 selection:text-[#062B4F] relative font-sans">
      
      {/* Discreet Quick Dock */}
      <NavigationDock />

      {/* 1. Website Navigation Header (Reference Match: Wordmark, Search, Actions, Categories Bar) */}
      <Header />

      {/* Main View Container */}
      <main className="transition-all duration-300">
        {currentView === 'home' && (
          <>
            {/* 2. Hero Presentation (Reference Match: Left Frosted Category Sidebar + Right Lifestyle Hero Banner) */}
            <HeroSection />

            {/* 3. Browse By Categories (Reference Match: 8 Circular Category Glass Bubbles) */}
            <BrowseByCategoriesSection />

            {/* 4. Trending Right Now (Reference Match: 6 Horizontal Product Cards with Star Ratings & BDT Prices) */}
            <TrendingRightNowSection />

            {/* 5. Split Promotional Banners (Reference Match: Summer Sale in Sky Blue + Fresh Finds in Ivory) */}
            <PromotionalBannersSection />

            {/* 6. Featured Collections (Reference Match: 4-Card Editorial Grid) */}
            <FeaturedCollectionsSection />

            {/* 7. Complete Categories Explorer (All 18 EasyDrop Collections) */}
            <ShopByCollectionSection />

            {/* 8. Full Products Catalog (1,206+ EasyDrop items with Authentic Retail Prices) */}
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

      {/* Website Footer (Reference Match: Top 4-Feature Assurance Strip + Dark Navy Glassy Footer) */}
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
