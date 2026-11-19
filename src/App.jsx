import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import {
  Header,
  HeroSection,
  BrowseByCategoriesSection,
  TrendingRightNowSection,
  ShopByCollectionSection,
  ProductGrid,
  PromotionalBannersSection,
  RecentlyViewedSection,
  BrandValuePanel,
  Footer,
  CartDrawer,
  Toast
} from './components';
import Sidebar from './components/Sidebar';
import { Package, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';

// Route Error Boundary protecting against chunk load failures on new deployments
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[RouteErrorBoundary Caught]:', error, errorInfo);
    const isChunkError = 
      error?.name === 'ChunkLoadError' ||
      /Failed to fetch dynamically imported module/i.test(error?.message || '') ||
      /Loading chunk [\d]+ failed/i.test(error?.message || '');

    if (isChunkError && typeof window !== 'undefined') {
      const reloaded = window.sessionStorage.getItem('chunk_reload');
      if (!reloaded) {
        window.sessionStorage.setItem('chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('chunk_reload');
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('chunk_reload');
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-20 text-center select-none flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-full bg-[#FFF1F0] border border-[#FFA39E] flex items-center justify-center mb-4 text-[#CF1322]">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#293B52] mb-2">
            Something went wrong
          </h2>
          <p className="text-xs text-[#6B7D93] max-w-sm mb-6">
            A temporary component loading error occurred. Please refresh the page or return to the storefront.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-full bg-[#0877C9] text-white font-bold text-xs shadow-md hover:bg-[#0665AC] transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-6 py-2.5 rounded-full bg-[#EDF4F9] border border-[#D5E2EE] text-[#293B52] font-semibold text-xs hover:bg-[#E4EEF5] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy-loaded routes & secondary overlays to optimize initial bundle size & TTI
const CollectionsPage = lazy(() => import('./components/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./components/CollectionDetailPage'));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const BrandAssetsModal = lazy(() => import('./components/BrandAssetsModal'));
const VisualSearchModal = lazy(() => import('./components/VisualSearchModal'));

function LoadingFallback() {
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-3 border-[#245BDB]/20 border-t-[#245BDB] animate-spin" />
    </div>
  );
}

function NotFoundPage() {
  const { t } = useShop();
  return (
    <div className="py-20 text-center select-none flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-[12px] bg-white border border-[#E5E3DA] flex items-center justify-center mb-4 text-[#245BDB] shadow-sm">
        <Package className="w-8 h-8 opacity-70" />
      </div>
      <h2 className="text-2xl font-bold text-[#172333] mb-2 tracking-tight">
        {t("Page Not Found (404)", "পৃষ্ঠাটি পাওয়া যায়নি (৪০৪)")}
      </h2>
      <p className="text-xs text-[#667085] max-w-sm mb-6 leading-relaxed">
        {t("The page or product you requested could not be found or has been relocated.", "আপনার অনুরোধকৃত পেজটি পাওয়া যায়নি।")}
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-[8px] bg-[#245BDB] text-white text-xs font-bold shadow-sm hover:bg-[#1C4BB8] transition-all flex items-center gap-2 cursor-pointer"
      >
        <span>{t("Back to Home", "হোমপেজে ফিরে যান")}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// Synchronizes React Router URL changes with context state for active tab highlights
function RouteSynchronizer() {
  const location = useLocation();
  const { setCurrentView, setActiveCollectionSlug } = useShop();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '') {
      setCurrentView('home');
    } else if (path === '/collections') {
      setCurrentView('collections');
    } else if (path.startsWith('/collection/')) {
      setCurrentView('collection-detail');
      const slug = path.replace('/collection/', '').split('/')[0];
      if (slug) setActiveCollectionSlug(slug);
    } else if (path.startsWith('/product/')) {
      setCurrentView('product');
    }
  }, [location, setCurrentView, setActiveCollectionSlug]);

  return null;
}

function StorefrontContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clear startup boot watchdog once React storefront has successfully mounted into the DOM
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.__AZRAQ_CLEAR_BOOT_TIMER__ === 'function') {
      window.__AZRAQ_CLEAR_BOOT_TIMER__();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F4EF] text-[#172333] selection:bg-[#245BDB]/15 selection:text-[#245BDB] font-sans relative overflow-x-hidden">
      <RouteSynchronizer />

      {/* Main Desktop Container (Maximum content width ~1360px with generous spacing) */}
      <div className="max-w-[1360px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-5 flex flex-col gap-7 sm:gap-8 relative">

        {/* Top Header (Clean Modern Editorial Header) */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Primary Route-Based View Container */}
        <main className="transition-all duration-200 flex flex-col gap-7 sm:gap-8 w-full min-w-0 max-w-full">
          <RouteErrorBoundary>
            <Routes>
              {/* 1. Home Page Route */}
              <Route
                path="/"
                element={
                  <>
                    {/* 1. Asymmetric Editorial Bento Hero Product Showcase */}
                    <HeroSection />

                    {/* 2. Shop by Department (Photographic Category Grid with authentic catalog photos) */}
                    <BrowseByCategoriesSection />

                    {/* 3. Featured & Best Sellers (Strictly 5 product cards per row) */}
                    <TrendingRightNowSection />

                    {/* 4. The AZRAQ Edit / Signature EasyDrop Collections Explorer */}
                    <ShopByCollectionSection />

                    {/* 5. Promotional Editorial Campaign Banner */}
                    <PromotionalBannersSection />

                    {/* 6. Daily Discover Product Catalog Grid (Strictly 5 product cards per row) */}
                    <ProductGrid />

                    {/* 7. Recently Viewed Products (Active only when history exists) */}
                    <RecentlyViewedSection />

                    {/* 8. Customer Assurance & Verified Retail Guarantees */}
                    <BrandValuePanel />
                  </>
                }
              />

              {/* 2. All Collections Browser Route */}
              <Route
                path="/collections"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CollectionsPage />
                  </Suspense>
                }
              />

              {/* 3. Individual Collection Detail Route */}
              <Route
                path="/collection/:slug"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <CollectionDetailPage />
                  </Suspense>
                }
              />

              {/* 4. Dedicated Individual Product Page Route */}
              <Route
                path="/product/:slug"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ProductDetailPage />
                  </Suspense>
                }
              />

              {/* 5. 404 Catch-All Route */}
              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
          </RouteErrorBoundary>
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
    <RouteErrorBoundary>
      <BrowserRouter>
        <ShopProvider>
          <StorefrontContent />
        </ShopProvider>
      </BrowserRouter>
    </RouteErrorBoundary>
  );
}
