import assert from 'assert';
import fs from 'fs';
import { 
  generateProductSlug, 
  findProductBySlug, 
  normalizeProductImages 
} from '../src/utils/productUtils.js';

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  process.stdout.write(`\n▶ TEST ${total} — ${name}:\n`);
  try {
    fn();
    passed++;
    console.log(`  ✓ Passed`);
  } catch (err) {
    console.error(`  ✗ Failed:`, err.message);
    throw err;
  }
}

console.log('='.repeat(64));
console.log('🧪 AZRAQ PRODUCT PAGE, ROUTING & IMAGE ARCHITECTURE AUDIT');
console.log('='.repeat(64));

const catalogData = JSON.parse(fs.readFileSync('src/data/central_products.json', 'utf8'));
const products = catalogData.products || [];

// 1. Stable, Deterministic Slug Generation
runTest('generateProductSlug produces unique, deterministic slugs ending with product ID', () => {
  const p1 = { id: 'AZQ-0028', name: 'Premium Printed Co-Ord Set' };
  const slug1 = generateProductSlug(p1);
  assert.strictEqual(slug1, 'premium-printed-co-ord-set-azq-0028');

  // Same product must always produce identical slug
  assert.strictEqual(generateProductSlug(p1), slug1);

  const p2 = { id: 'AZQ-0001', name: 'Baseus Limited Edition Fast Charging Gift Box Set – 20W Power Bank' };
  const slug2 = generateProductSlug(p2);
  assert.ok(slug2.endsWith('-azq-0001'));
  assert.ok(!slug2.includes('–'), 'Dash characters must be normalized');
});

runTest('generateProductSlug handles Bengali / non-ASCII names safely without breaking URLs', () => {
  const pBn = { id: 'AZQ-0029', name: '🌸 Premium Printed Co-Ord Set 🌸', category: 'Men Clothing' };
  const slugBn = generateProductSlug(pBn);
  assert.ok(slugBn.endsWith('-azq-0029'));
  assert.ok(!slugBn.includes('🌸'), 'Emojis must be stripped from slugs');
  assert.strictEqual(slugBn, 'premium-printed-co-ord-set-azq-0029');
});

// 2. URL-to-Product Resolution
runTest('findProductBySlug resolves product by full slug', () => {
  const target = products.find(p => p.id === 'AZQ-0028');
  assert.ok(target, 'AZQ-0028 must exist in catalog');
  
  const slug = generateProductSlug(target);
  const resolved = findProductBySlug(slug, products);
  assert.ok(resolved, 'Must resolve product by slug');
  assert.strictEqual(resolved.id, 'AZQ-0028');
  assert.strictEqual(resolved.name, target.name);
});

runTest('findProductBySlug resolves product by direct ID and case-insensitively', () => {
  const resolvedUpper = findProductBySlug('AZQ-0028', products);
  assert.ok(resolvedUpper);
  assert.strictEqual(resolvedUpper.id, 'AZQ-0028');

  const resolvedLower = findProductBySlug('azq-0028', products);
  assert.ok(resolvedLower);
  assert.strictEqual(resolvedLower.id, 'AZQ-0028');
});

runTest('findProductBySlug resolves product even if slug title is altered, via trailing ID', () => {
  const resolved = findProductBySlug('some-custom-shared-link-azq-0028', products);
  assert.ok(resolved);
  assert.strictEqual(resolved.id, 'AZQ-0028');
});

runTest('findProductBySlug returns null safely for nonexistent slugs', () => {
  const resolved = findProductBySlug('nonexistent-product-azq-99999', products);
  assert.strictEqual(resolved, null);

  const resolvedEmpty = findProductBySlug('', products);
  assert.strictEqual(resolvedEmpty, null);
});

// 3. Image Normalization & Zero Unrelated Image Leakage
runTest('normalizeProductImages places verified main_image first and eliminates duplicates', () => {
  const sample = {
    id: 'AZQ-TEST',
    main_image: 'https://easydrop.asia/products/main.jpg',
    images: [
      'https://easydrop.asia/products/main.jpg',
      'https://easydrop.asia/products/gallery1.jpg',
      'https://easydrop.asia/products/gallery2.jpg',
      'https://easydrop.asia/products/gallery1.jpg', // duplicate
      '', // empty
      null // null
    ]
  };

  const normalized = normalizeProductImages(sample);
  assert.strictEqual(normalized.length, 3);
  assert.strictEqual(normalized[0], 'https://easydrop.asia/products/main.jpg');
  assert.strictEqual(normalized[1], 'https://easydrop.asia/products/gallery1.jpg');
  assert.strictEqual(normalized[2], 'https://easydrop.asia/products/gallery2.jpg');
});

runTest('normalizeProductImages does not inject unrelated generic fallbacks for missing images', () => {
  const missingImgProd = { id: 'AZQ-NO-IMG', name: 'Product Without Photos' };
  const normalized = normalizeProductImages(missingImgProd);
  assert.deepStrictEqual(normalized, []);
});

runTest('ProductCard and ProductDetailPage do NOT hardcode generic unrelated fallback image', () => {
  const cardCode = fs.readFileSync('src/components/common/ProductCard.jsx', 'utf8');
  assert.ok(
    !cardCode.includes('image-1794224164356-135288231.jpeg'),
    'ProductCard must not hardcode unrelated charger image as fallback'
  );

  const detailCode = fs.readFileSync('src/components/ProductDetailPage.jsx', 'utf8');
  assert.ok(
    !detailCode.includes('image-1794224164356-135288231.jpeg'),
    'ProductDetailPage must not hardcode unrelated charger image as fallback'
  );
});

// 4. Five Cards Per Row Invariants
runTest('ProductDetailPage related products grid enforces strictly 5 cards per row on desktop', () => {
  const detailCode = fs.readFileSync('src/components/ProductDetailPage.jsx', 'utf8');
  assert.ok(
    detailCode.includes('lg:grid-cols-5'),
    'Related products grid must use lg:grid-cols-5'
  );
  assert.ok(
    !detailCode.includes('lg:grid-cols-4 xl:grid-cols-6') && !detailCode.includes('2xl:grid-cols-6'),
    'Related products grid must not exceed 5 columns'
  );
});

console.log('\n' + '='.repeat(64));
console.log(`📊 ALL ${passed}/${total} PRODUCT PAGE & ROUTING TESTS PASSED!`);
console.log('='.repeat(64) + '\n');
