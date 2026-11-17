/**
 * AZRAQ Shop — Centralized Component Exports
 * Provides structured access to all storefront, catalog, checkout, order, and admin components.
 */

// ==========================================
// 1. Layout & Shell
// ==========================================
export { default as Header } from './Header.jsx';
export { default as Footer } from './Footer.jsx';
export { default as Sidebar } from './Sidebar.jsx';
export { default as NavigationDock } from './NavigationDock.jsx';

// ==========================================
// 2. Storefront Home Sections
// ==========================================
export { default as HeroSection } from './HeroSection.jsx';
export { default as BrowseByCategoriesSection } from './BrowseByCategoriesSection.jsx';
export { default as TrendingRightNowSection } from './TrendingRightNowSection.jsx';
export { default as PromotionalBannersSection } from './PromotionalBannersSection.jsx';
export { default as FeaturedCollectionsSection } from './FeaturedCollectionsSection.jsx';
export { default as ShopByCollectionSection } from './ShopByCollectionSection.jsx';
export { default as ProductDemonstrationSection } from './ProductDemonstrationSection.jsx';
export { default as BrandValuePanel } from './BrandValuePanel.jsx';
export { default as StatsRibbon } from './StatsRibbon.jsx';
export { default as EditorialCtaSection } from './EditorialCtaSection.jsx';

// ==========================================
// 3. Catalog & Search
// ==========================================
export { default as ProductCard } from './common/ProductCard.jsx';
export { default as ProductGrid } from './ProductGrid.jsx';
export { default as ProductDetailModal } from './ProductDetailModal.jsx';
export { default as CollectionsPage } from './CollectionsPage.jsx';
export { default as CollectionDetailPage } from './CollectionDetailPage.jsx';
export { default as VisualSearchModal } from './VisualSearchModal.jsx';

// ==========================================
// 4. Cart & Checkout
// ==========================================
export { default as CartDrawer } from './CartDrawer.jsx';
export { default as CheckoutModal } from './CheckoutModal.jsx';

// ==========================================
// 5. Orders & Logistics
// ==========================================
export { default as OrderTrackingModal } from './OrderTrackingModal.jsx';

// ==========================================
// 6. Administrative Operations
// ==========================================
export { default as AdminPanel } from './AdminPanel.jsx';

// ==========================================
// 7. Shared UI & Branding
// ==========================================
export { default as AzraqLogo, AzraqBrandSymbol } from './AzraqLogo.jsx';
export { default as BrandAssetsModal } from './BrandAssetsModal.jsx';
export { default as Toast } from './Toast.jsx';
export { default as NeumorphicStorefront } from './NeumorphicStorefront.jsx';
