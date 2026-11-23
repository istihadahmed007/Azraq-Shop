import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductImage from './common/ProductImage';
import { generateProductSlug } from '../utils/productUtils';

function isAvailableProduct(product) {
  return Boolean(
    product &&
    product.id &&
    product.main_image &&
    Number(product.price) > 0 &&
    product.in_stock !== false &&
    product.stock_out !== true &&
    product.stock !== 0 &&
    product.status !== 'out_of_stock'
  );
}

function ProductTile({ product, featured = false, placement = '', onSelect, t }) {
  if (!product) return null;

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      aria-label={'View ' + product.name}
      title={product.name}
      className={[
        'group relative flex h-full min-h-0 w-full flex-col items-center justify-between border border-[#DFE8F4] bg-white p-3 text-left transition-colors duration-200 hover:border-[#185ADB]/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#185ADB]',
        featured ? 'sm:p-5' : 'sm:p-3.5',
        placement
      ].join(' ')}
    >
      <div className="flex min-h-0 w-full flex-1 items-center justify-center py-1">
        <div className={featured ? 'w-full max-w-[270px]' : 'w-full max-w-[130px]'}>
          <ProductImage
            src={product.main_image}
            alt={product.name}
            fit="contain"
            aspectRatio="square"
            priority={featured}
            containerClassName="!rounded-none !border-0 !bg-transparent !backdrop-blur-none"
            className="!rounded-none object-contain"
          />
        </div>
      </div>

      <div className="w-full border-t border-slate-100 pt-2.5">
        {featured && (
          <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#185ADB] sm:text-[10px]">
            {t('Featured product', 'বিশেষ পণ্য')}
          </span>
        )}
        <span
          className={[
            'block w-full font-semibold leading-snug text-slate-800 group-hover:text-[#185ADB]',
            featured ? 'line-clamp-2 text-xs sm:text-sm' : 'line-clamp-1 text-[10px] sm:text-[11px]'
          ].join(' ')}
        >
          {product.name}
        </span>
        <span className={featured ? 'mt-1.5 block text-sm font-extrabold tabular-nums text-[#185ADB] sm:text-base' : 'mt-1 block text-xs font-bold tabular-nums text-[#185ADB]'}>
          ৳{Number(product.price || 0).toLocaleString('en-US')}
        </span>
      </div>
    </button>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();
  const { products = [], t } = useShop();

  // Curate five distinct, in-stock products from the real catalogue.
  // Preferred IDs are selected first; category/name fallbacks keep the hero
  // populated during fast boot and before full catalogue hydration completes.
  const heroProducts = useMemo(() => {
    const available = Array.isArray(products) ? products.filter(isAvailableProduct) : [];
    const usedIds = new Set();

    const pick = (preferredIds, category, namePattern) => {
      let selected = preferredIds
        .map(id => available.find(product => String(product.id) === id))
        .find(product => product && !usedIds.has(String(product.id)));

      if (!selected) {
        selected = available.find(product =>
          !usedIds.has(String(product.id)) &&
          (!category || product.category === category) &&
          (!namePattern || namePattern.test(product.name || ''))
        );
      }

      if (!selected) {
        selected = available.find(product =>
          !usedIds.has(String(product.id)) &&
          (!category || product.category === category)
        );
      }

      if (!selected) {
        selected = available.find(product => !usedIds.has(String(product.id)));
      }

      if (selected) usedIds.add(String(selected.id));
      return selected || null;
    };

    return {
      featured: pick(
        ['AZQ-0378', 'AZQ-0035', 'AZQ-0009'],
        'Gadgets & IT Accessories',
        /headphone|earphone|audio/i
      ),
      beauty: pick(
        ['AZQ-0247', 'AZQ-0225', 'AZQ-0210', 'AZQ-0031'],
        'Health & Beauty',
        /serum|sunscreen|retinol|hair gel|beauty/i
      ),
      accessory: pick(
        ['AZQ-1126', 'AZQ-0001', 'AZQ-0006', 'AZQ-0008'],
        'Gadgets & IT Accessories',
        /power bank|charger|adapter|charging/i
      ),
      kitchen: pick(
        ['AZQ-0127', 'AZQ-0018', 'AZQ-0314'],
        'Kitchen Appliances',
        /cooker|chopper|kitchen/i
      ),
      lifestyle: pick(
        ['AZQ-0012'],
        'Home & Lifestyle',
        /mug|home|lifestyle/i
      )
    };
  }, [products]);

  const openProduct = (product) => {
    if (!product) return;
    navigate('/product/' + generateProductSlug(product), { state: { product } });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/collections');
    }
  };

  return (
    <section
      aria-label="AZRAQ premium ecommerce hero"
      className="relative w-full overflow-hidden border border-[#DFE8F4] bg-white"
    >
      <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[0.94fr_1.06fr]">
        {/* Brand message */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
          <div className="mb-7">
            <div className="text-sm font-black tracking-[0.24em] text-[#185ADB] sm:text-base">
              AZRAQ
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-400">
              {t('Everyday essentials, thoughtfully selected', 'প্রতিদিনের প্রয়োজন, যত্নে নির্বাচিত')}
            </div>
          </div>

          <h1 className="max-w-[610px] text-[2.45rem] font-extrabold leading-[1.08] tracking-[-0.045em] text-[#12233F] sm:text-5xl xl:text-[3.65rem]">
            {t('Everything You Need, All in One Place.', 'আপনার প্রয়োজনীয় সবকিছু, একই জায়গায়।')}
          </h1>

          <p className="mt-5 max-w-[500px] text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8">
            {t(
              'Discover quality gadgets, beauty essentials, home products and everyday lifestyle accessories.',
              'মানসম্মত গ্যাজেট, বিউটি এসেনশিয়াল, হোম প্রোডাক্ট এবং প্রতিদিনের লাইফস্টাইল অ্যাক্সেসরিজ খুঁজে নিন।'
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-9">
            <button
              type="button"
              onClick={() => scrollToSection('popular-products')}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#185ADB] bg-[#185ADB] px-6 py-3 text-sm font-bold text-white transition-colors hover:border-[#1044A3] hover:bg-[#1044A3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#185ADB]"
            >
              {t('Shop Now', 'এখনই কিনুন')}
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('shop-by-category')}
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#19304F] transition-colors hover:border-[#185ADB] hover:text-[#185ADB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#185ADB]"
            >
              {t('Explore Categories', 'ক্যাটাগরি দেখুন')}
            </button>
          </div>
        </div>

        {/* Real catalogue product collage: one featured product and four companions */}
        <div className="relative overflow-hidden bg-[#F1F6FD] px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-[#DCE7F5] lg:block"
          />
          <div className="relative mx-auto grid min-h-[570px] w-full max-w-[720px] grid-cols-2 grid-rows-3 gap-3 sm:min-h-[450px] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)_minmax(0,1fr)] sm:grid-rows-2 sm:gap-3.5">
            <ProductTile
              product={heroProducts.featured}
              featured
              t={t}
              onSelect={openProduct}
              placement="col-span-2 row-start-1 sm:col-span-1 sm:col-start-2 sm:row-span-2 sm:row-start-1"
            />
            <ProductTile
              product={heroProducts.beauty}
              t={t}
              onSelect={openProduct}
              placement="col-start-1 row-start-2 sm:col-start-1 sm:row-start-1"
            />
            <ProductTile
              product={heroProducts.accessory}
              t={t}
              onSelect={openProduct}
              placement="col-start-2 row-start-2 sm:col-start-1 sm:row-start-2"
            />
            <ProductTile
              product={heroProducts.kitchen}
              t={t}
              onSelect={openProduct}
              placement="col-start-1 row-start-3 sm:col-start-3 sm:row-start-1"
            />
            <ProductTile
              product={heroProducts.lifestyle}
              t={t}
              onSelect={openProduct}
              placement="col-start-2 row-start-3 sm:col-start-3 sm:row-start-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
