import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import NavigationDock from './components/NavigationDock';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedCollectionsCarousel from './components/FeaturedCollectionsCarousel';
import ShopByCollectionSection from './components/ShopByCollectionSection';
import BestPicksSection from './components/BestPicksSection';
import TrendingDiscoveriesSection from './components/TrendingDiscoveriesSection';
import ProductGrid from './components/ProductGrid';
import ProductDemonstrationSection from './components/ProductDemonstrationSection';
import BrandValuePanel from './components/BrandValuePanel';
import StatsRibbon from './components/StatsRibbon';
import EditorialCtaSection from './components/EditorialCtaSection';
import CollectionsPage from './components/CollectionsPage';
import CollectionDetailPage from './components/CollectionDetailPage';
import Footer from './components/Footer';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import AdminPanel from './components/AdminPanel';
import BrandAssetsModal from './components/BrandAssetsModal';
import Toast from './components/Toast';

function StorefrontContent() {
  const { currentView } = useShop();

  return (
    <div className="min-h-screen bg-azraq-cloud text-azraq-navy selection:bg-azraq-lime selection:text-azraq-navy relative font-sans">
      
      {/* Floating Side Dock (Positioned cleanly without overlapping content) */}
      <NavigationDock />

      {/* 1. Website Navigation Header */}
      <Header />

      {/* Main View Router with Safe Dock Clearance (lg:pl-20 xl:pl-24 prevents any dock overlap) */}
      <main className="lg:pl-20 xl:pl-24 transition-all duration-300">
        {currentView === 'home' && (
          <>
            {/* 1. Brand Showcase / Hero Presentation */}
            <HeroSection />

            {/* 2. Featured Collections Section */}
            <FeaturedCollectionsCarousel />

            {/* 3. Browse Categories Section (Shop by Collection) */}
            <ShopByCollectionSection />

            {/* 4. Popular Products Section (Best Customer Picks & Ratings) */}
            <BestPicksSection />

            {/* Trending Curated Goods */}
            <TrendingDiscoveriesSection />

            {/* 5. All Products Catalog (Full Filterable EasyDrop Inventory) */}
            <ProductGrid />

            {/* Supporting Brand Demonstrations & Value Panels */}
            <ProductDemonstrationSection />
            <BrandValuePanel />
            <StatsRibbon />
            <EditorialCtaSection />
          </>
        )}

        {currentView === 'collections' && <CollectionsPage />}

        {currentView === 'collection-detail' && <CollectionDetailPage />}
      </main>

      {/* 6. Website Footer */}
      <Footer />

      {/* Interactive Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AdminPanel />
      <BrandAssetsModal />
      <Toast />

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
