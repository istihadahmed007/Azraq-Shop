import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
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
  StatsRibbon,
  StoreArchitectureSection,
  Footer,
  CartDrawer,
  Toast
} from './components';
import Sidebar from './components/Sidebar';
import ScrollRestorationManager from './components/common/ScrollRestorationManager';
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
              className="px-6 py-2.5 rounded-lg bg-[#185ADB] text-white font-semibold text-xs shadow-xs hover:bg-[#1044A3] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-6 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
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
const LoginPage = lazy(() => import('./components/LoginPage'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const BrandAssetsModal = lazy(() => import('./components/BrandAssetsModal'));
const VisualSearchModal = lazy(() => import('./components/VisualSearchModal'));

function LoadingFallback() {
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#185ADB] animate-spin" />
    </div>
  );
}

function NotFoundPage() {
  const { t } = useShop();
  return (
    <div className="py-20 text-center select-none flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-[#185ADB] shadow-xs">
        <Package className="w-7 h-7 text-slate-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
        {t("Page Not Found (404)", "পৃষ্ঠাটি পাওয়া যায়নি (৪০৪)")}
      </h2>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
        {t("The page or product you requested could not be found or has been relocated.", "আপনার অনুরোধকৃত পেজটি পাওয়া যায়নি।")}
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-lg bg-[#185ADB] hover:bg-[#1044A3] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
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
    <div className="min-h-screen bg-transparent text-slate-900 selection:bg-[#185ADB]/20 selection:text-slate-900 font-sans relative overflow-x-hidden">
      <ScrollRestorationManager />
      <RouteSynchronizer />

      {/* Main Container (Spacious ~1600px desktop layout matching reference proportions) */}
      <div className="max-w-[1620px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-4 flex flex-col gap-4 sm:gap-5 relative">

        {/* Top Header (Premium Two-Row Translucent Glass Header) */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Primary Route-Based View Container */}
        <main className="transition-all duration-150 flex flex-col gap-4 sm:gap-5 w-full min-w-0 max-w-full">
          <RouteErrorBoundary>
            <Routes>
              {/* 1. Home Page Route: Exact Reference First-Screen Composition */}
              <Route
                path="/"
                element={
                  <>
                    {/* Section B: Main Hero Section (Three-part composition with 3D pedestal & stacked cards) */}
                    <HeroSection />

                    {/* Section C: Horizontal Shop by Category Rail */}
                    <BrowseByCategoriesSection />

                    {/* Section D: Popular Products Section (6 cards + delivery promo & full catalog) */}
                    <ProductGrid />

                    {/* Section: Featured Collection Carousel (Screenshot-2: Gadgets & IT Accessories) */}
                    <TrendingRightNowSection />

                    {/* Browsing History (Active only when history exists) */}
                    <RecentlyViewedSection />

                    {/* Section E: Bottom Trust Ribbon (Compact horizontal glass strip) */}
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

              {/* 5. Customer Login & Registration Routes */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LoginPage />
                  </Suspense>
                }
              />
              <Route
                path="/register"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <LoginPage />
                  </Suspense>
                }
              />

              {/* 6. Operations & Admin Portal Dedicated Route */}
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminPage />
                  </Suspense>
                }
              />

              {/* 7. 404 Catch-All Route */}
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
        <AuthModal />
        <BrandAssetsModal />
        <VisualSearchModal />
      </Suspense>

    </div>
  );
}

export default function App() {
  const basename = typeof window !== 'undefined' && window.location.pathname.startsWith('/Azraq-Shop') ? '/Azraq-Shop' : '';

  return (
    <RouteErrorBoundary>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <ShopProvider>
            <StorefrontContent />
          </ShopProvider>
        </AuthProvider>
      </BrowserRouter>
    </RouteErrorBoundary>
  );
}
