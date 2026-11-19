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
      <div className="w-10 h-10 rounded-full border-3 border-[#70C8ED]/30 border-t-[#0877C9] animate-spin" />
    </div>
  );
}

function NotFoundPage() {
  const { t } = useShop();
  return (
    <div className="py-20 text-center select-none flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-[20px] bg-white/80 border border-[rgba(130,170,205,0.3)] flex items-center justify-center mb-4 text-[#0877C9] shadow-xs">
        <Package className="w-8 h-8 opacity-70" />
      </div>
      <h2 className="text-2xl font-bold text-[#193B5B] mb-2 tracking-tight">
        {t("Page Not Found (404)", "পৃষ্ঠাটি পাওয়া যায়নি (৪০৪)")}
      </h2>
      <p className="text-xs text-[#718398] max-w-sm mb-6 leading-relaxed">
        {t("The page or product you requested could not be found or has been relocated.", "আপনার অনুরোধকৃত পেজটি পাওয়া যায়নি।")}
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#70C8ED] to-[#3B82F6] hover:from-[#5CBDE5] text-white text-xs font-bold shadow-[0_4px_16px_rgba(112,200,237,0.4)] transition-all flex items-center gap-2 cursor-pointer"
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
    <div className="min-h-screen bg-[#F1F7FC] text-[#193B5B] selection:bg-[#70C8ED]/30 selection:text-[#193B5B] font-sans relative overflow-x-hidden">
      <RouteSynchronizer />

      {/* Main Container (Spacious ~1380px with delicate architectural glass rhythm) */}
      <div className="max-w-[1380px] w-full mx-auto px-3 sm:px-5 lg:px-6 py-3 sm:py-5 flex flex-col gap-5 sm:gap-6 relative">

        {/* Top Header (Floating Crystal Glass Header) */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Primary Route-Based View Container */}
        <main className="transition-all duration-150 flex flex-col gap-5 sm:gap-6 w-full min-w-0 max-w-full">
          <RouteErrorBoundary>
            <Routes>
              {/* 1. Home Page Route */}
              <Route
                path="/"
                element={
                  <>
                    {/* Section A: Main Futuristic Hero Showcase */}
                    <HeroSection />

                    {/* Section B: Horizontal Statistics & Trust Glass Panel */}
                    <StatsRibbon />

                    {/* Section C: Featured Curations (Reference Style: 3 Large Cinematic Cards with < > Carousel) */}
                    <TrendingRightNowSection />

                    {/* Section D: Supporting Content 3-Column Glass Arrangement */}
                    <StoreArchitectureSection />

                    {/* Department Discovery Mosaic (All 18 Collections) */}
                    <BrowseByCategoriesSection />

                    {/* Daily Discover Product Catalog Grid (1,200+ Products) */}
                    <ProductGrid />

                    {/* Browsing History (Active only when history exists) */}
                    <RecentlyViewedSection />

                    {/* Customer Assurance Guarantees */}
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
