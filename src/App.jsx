import React, { Suspense, lazy } from 'react';
import { ShopProvider } from './context/ShopContext';
import NeumorphicStorefront from './components/NeumorphicStorefront';
import {
  CartDrawer,
  Toast
} from './components';

// Lazy-loaded secondary overlays & administrative drawers
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const OrderTrackingModal = lazy(() => import('./components/OrderTrackingModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const BrandAssetsModal = lazy(() => import('./components/BrandAssetsModal'));
const VisualSearchModal = lazy(() => import('./components/VisualSearchModal'));

function StorefrontContent() {
  return (
    <div className="min-h-screen bg-[#D8E4EE] text-[#2B3A4A] relative font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Primary View: Pixel-Accurate Neumorphic "White" Storefront */}
      <NeumorphicStorefront />

      {/* Integrated Cart Drawer & Notifications */}
      <CartDrawer />
      <Toast />

      {/* Administrative, Tracking & Checkout Overlays */}
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
