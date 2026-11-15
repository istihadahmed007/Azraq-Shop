import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import NavigationDock from './components/NavigationDock';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ShopByCollectionSection from './components/ShopByCollectionSection';
import FeaturedCollectionsCarousel from './components/FeaturedCollectionsCarousel';
import NewArrivalsSection from './components/NewArrivalsSection';
import BestPicksSection from './components/BestPicksSection';
import TrendingDiscoveriesSection from './components/TrendingDiscoveriesSection';
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
      
      {/* Floating Side Dock */}
      <NavigationDock />

      {/* Minimal Navigation Header */}
      <Header />

      {/* Main View Router */}
      <main className="lg:pl-8">
        {currentView === 'home' && (
          <>
            {/* Section 1: Hero */}
            <HeroSection />

            {/* Section 2: Shop by Collection (The Primary Section) */}
            <ShopByCollectionSection />

            {/* Section 3: Featured Collections Carousel */}
            <FeaturedCollectionsCarousel />

            {/* Section 4: New Arrivals */}
            <NewArrivalsSection />

            {/* Section 5: Best Picks */}
            <BestPicksSection />

            {/* Section 6: Trending Discoveries */}
            <TrendingDiscoveriesSection />

            {/* Section 7: Product Demonstrations */}
            <ProductDemonstrationSection />

            {/* Section 8: Brand Value Panel */}
            <BrandValuePanel />

            {/* Section 9: Stats Ribbon (Nexora Reference Match) */}
            <StatsRibbon />

            {/* Section 10: Editorial CTA */}
            <EditorialCtaSection />
          </>
        )}

        {currentView === 'collections' && <CollectionsPage />}

        {currentView === 'collection-detail' && <CollectionDetailPage />}
      </main>

      {/* Minimalist Dark Footer */}
      <Footer />

      {/* Modals & Drawers */}
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
