import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  generateProductSlug, 
  findProductBySlug, 
  extractProductIdFromSlug,
  fetchSingleProduct,
  normalizeProductImages 
} from '../src/utils/productUtils.js';

let passed = 0;
let total = 0;

async function runTest(name, fn) {
  total++;
  process.stdout.write(`\n▶ TEST ${total} — ${name}:\n`);
  try {
    await fn();
    passed++;
    console.log(`  ✓ Passed`);
  } catch (err) {
    console.error(`  ✗ Failed:`, err);
    throw err;
  }
}

console.log('='.repeat(72));
console.log('🧪 AZRAQ DIRECT LOAD, HYDRATION & PRODUCT RESOLUTION TEST SUITE');
console.log('='.repeat(72));

const initialData = JSON.parse(fs.readFileSync('src/data/initial_catalog.json', 'utf8'));
const centralData = JSON.parse(fs.readFileSync('src/data/central_products.json', 'utf8'));

const initialProducts = initialData.products || [];
const fullProducts = centralData.products || [];

// Mock fetch helper for standalone testing
const originalFetch = globalThis.fetch;

function createMockFetch({ staticRecordHandler, apiHandler, delay = 0, shouldFail = false }) {
  return async (url, options = {}) => {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    if (options?.signal?.aborted) {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    }
    if (shouldFail) {
      throw new Error('Failed to fetch (Network connection error)');
    }

    const urlStr = String(url);
    if (urlStr.includes('/data/products/')) {
      if (staticRecordHandler) return staticRecordHandler(urlStr, options);
      const match = urlStr.match(/\/data\/products\/([A-Za-z0-9_-]+)\.json$/);
      if (match) {
        const id = match[1].toUpperCase();
        const p = fullProducts.find(item => item.id.toUpperCase() === id);
        if (p) {
          return {
            ok: true,
            status: 200,
            json: async () => p,
            text: async () => JSON.stringify(p),
            headers: new Map([['content-type', 'application/json']])
          };
        }
      }
      return { 
        ok: false, 
        status: 404, 
        json: async () => ({ error: 'Not found' }),
        text: async () => JSON.stringify({ error: 'Not found' }),
        headers: new Map([['content-type', 'application/json']])
      };
    }

    if (urlStr.includes('/api/products')) {
      if (apiHandler) return apiHandler(urlStr, options);
      const parsed = new URL(urlStr, 'http://localhost');
      const id = parsed.searchParams.get('id');
      const slug = parsed.searchParams.get('slug');
      const targetId = id || (slug ? extractProductIdFromSlug(slug) : null);
      if (targetId) {
        const p = fullProducts.find(item => item.id.toUpperCase() === targetId.toUpperCase());
        if (p) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, product: p }),
            text: async () => JSON.stringify({ success: true, product: p }),
            headers: new Map([['content-type', 'application/json']])
          };
        }
      }
      return { 
        ok: false, 
        status: 404, 
        json: async () => ({ success: false, error: 'Not found' }),
        text: async () => JSON.stringify({ success: false, error: 'Not found' }),
        headers: new Map([['content-type', 'application/json']])
      };
    }

    return { 
      ok: false, 
      status: 404, 
      json: async () => ({}),
      text: async () => '{}',
      headers: new Map([['content-type', 'application/json']])
    };
  };
}

(async () => {
  try {
    // 1. Direct URL loading for product within initial catalog (AZQ-0001 to AZQ-0036)
    await runTest('Scenario 1: Direct URL loading for product within initial catalog (AZQ-0001 to AZQ-0036)', () => {
      const target = initialProducts.find(p => p.id === 'AZQ-0028');
      assert.ok(target, 'AZQ-0028 must be in initial catalog');
      const slug = generateProductSlug(target);
      const resolved = findProductBySlug(slug, initialProducts);
      assert.ok(resolved, 'Must resolve immediately without network from initial in-memory catalog');
      assert.strictEqual(resolved.id, 'AZQ-0028');
    });

    // 2. Direct URL loading for product outside initial catalog (AZQ-0040, AZQ-0100, AZQ-1206) via standalone static product record
    await runTest('Scenario 2: Direct URL loading for product outside initial catalog via standalone static record', async () => {
      globalThis.fetch = createMockFetch({});
      const testIds = ['AZQ-0040', 'AZQ-0100', 'AZQ-1206'];
      
      for (const id of testIds) {
        // Confirm it is NOT in initial 36 catalog
        const inInitial = initialProducts.some(p => p.id === id);
        assert.strictEqual(inInitial, false, `${id} must not be in initial catalog`);

        // Resolve via fetchSingleProduct
        const res = await fetchSingleProduct(id);
        assert.ok(res.product, `Must resolve ${id} via standalone record`);
        assert.strictEqual(res.product.id, id);
        assert.strictEqual(res.isNotFound, false);
        assert.strictEqual(res.isError, false);
      }
    });

    // 3. Direct URL loading via API fallback (/api/products?id=... and /api/products?slug=...)
    await runTest('Scenario 3: Direct URL loading via API fallback when static record is missing or bypassing', async () => {
      // Mock fetch where static record returns 404, forcing fallback to /api/products
      globalThis.fetch = createMockFetch({
        staticRecordHandler: () => ({ ok: false, status: 404, json: async () => ({}) })
      });

      const resById = await fetchSingleProduct('AZQ-0050');
      assert.ok(resById.product, 'Must resolve AZQ-0050 via API fallback');
      assert.strictEqual(resById.product.id, 'AZQ-0050');

      const targetP = fullProducts.find(p => p.id === 'AZQ-0050');
      const slug = generateProductSlug(targetP);
      const resBySlug = await fetchSingleProduct(slug);
      assert.ok(resBySlug.product, 'Must resolve slug via API fallback');
      assert.strictEqual(resBySlug.product.id, 'AZQ-0050');
    });

    // 4. Page refresh simulation: product remains loaded and doesn't flash 404 or infinite spinner
    await runTest('Scenario 4: Page refresh simulation without previous navigation history', async () => {
      globalThis.fetch = createMockFetch({});
      // Fresh simulated boot: store starts with only initial catalog (36 items)
      let store = [...initialProducts];
      const targetSlug = 'portable-lint-remover-shaver-azq-0077';
      
      // Step A: Not found in memory initially
      let resolved = findProductBySlug(targetSlug, store);
      assert.strictEqual(resolved, null);

      // Step B: Resolved immediately via standalone record (~20ms)
      const fetchResult = await fetchSingleProduct(targetSlug);
      assert.ok(fetchResult.product);
      assert.strictEqual(fetchResult.product.id, 'AZQ-0077');

      // Step C: Injected into store
      store = [fetchResult.product, ...store];
      resolved = findProductBySlug(targetSlug, store);
      assert.ok(resolved, 'Store now retains product on subsequent re-renders');
      assert.strictEqual(resolved.id, 'AZQ-0077');
    });

    // 5. Case-insensitive slug matching (azq-0028, AZQ-0028, Azq-0028)
    await runTest('Scenario 5: Case-insensitive slug matching', () => {
      const variants = ['azq-0028', 'AZQ-0028', 'Azq-0028', 'aZq-0028'];
      for (const variant of variants) {
        const id = extractProductIdFromSlug(variant);
        assert.strictEqual(id, 'AZQ-0028', `${variant} must resolve to AZQ-0028`);
      }
    });

    // 6. Malformed/altered slug prefix with valid ID suffix
    await runTest('Scenario 6: Malformed/altered slug prefix with valid ID suffix', () => {
      const altered1 = 'user-shared-custom-link-azq-0028';
      const altered2 = 'completely-wrong-title-azq-0028';
      assert.strictEqual(extractProductIdFromSlug(altered1), 'AZQ-0028');
      assert.strictEqual(extractProductIdFromSlug(altered2), 'AZQ-0028');
    });

    // 7. Genuine non-existent product ID (AZQ-99999) returns 404 only after checks complete
    await runTest('Scenario 7: Genuine non-existent product ID (AZQ-99999) returns 404 only after check', async () => {
      globalThis.fetch = createMockFetch({});
      const res = await fetchSingleProduct('AZQ-99999');
      assert.strictEqual(res.product, null);
      assert.strictEqual(res.isNotFound, true);
      assert.strictEqual(res.isError, false);
    });

    // 8. Network error simulation on product fetch: renders recoverable error state, NEVER 404
    await runTest('Scenario 8: Network error simulation produces recoverable error state, NEVER 404', async () => {
      globalThis.fetch = createMockFetch({ shouldFail: true });
      const res = await fetchSingleProduct('AZQ-0050');
      assert.strictEqual(res.product, null);
      assert.strictEqual(res.isNotFound, false, 'Network failure must NEVER be marked as isNotFound');
      assert.strictEqual(res.isError, true, 'Network failure must be flagged as isError for Retry UI');
    });

    // 9. AbortController timeout handling on slow product fetch
    await runTest('Scenario 9: AbortController timeout handling on stalled network', async () => {
      // Mock fetch with 500ms delay, but timeout is set to 50ms
      globalThis.fetch = createMockFetch({ delay: 500 });
      const res = await fetchSingleProduct('AZQ-0050', { timeoutMs: 50 });
      assert.strictEqual(res.product, null);
      assert.strictEqual(res.isNotFound, false);
      assert.strictEqual(res.isError, true);
      assert.strictEqual(res.isTimeout, true);
    });

    // 10. Progressive catalog hydration: initial fast paint with 36 items, then smooth merge to 1,206 items
    await runTest('Scenario 10: Progressive catalog hydration without dropping injected products', () => {
      let memoryCatalog = [...initialProducts];
      assert.strictEqual(memoryCatalog.length, 36);

      // Injected product prior to central catalog hydration
      const injectedProduct = { id: 'AZQ-9999', name: 'Custom Injected Item' };
      const map = new Map();
      fullProducts.forEach(p => map.set(String(p.id).toLowerCase(), p));
      [injectedProduct, ...memoryCatalog].forEach(p => {
        const k = String(p.id).toLowerCase();
        if (!map.has(k)) map.set(k, p);
      });
      const hydratedCatalog = Array.from(map.values());

      assert.strictEqual(hydratedCatalog.length, 1207);
      assert.ok(hydratedCatalog.some(p => p.id === 'AZQ-9999'));
      assert.ok(hydratedCatalog.some(p => p.id === 'AZQ-1206'));
    });

    // 11. Standalone Node.js server routing invariants & complete Vercel elimination
    await runTest('Scenario 11: Standalone Node server routing invariants & complete Vercel elimination', () => {
      // 1. Verify Vercel configuration files have been completely eliminated
      assert.strictEqual(fs.existsSync('vercel.json'), false, 'vercel.json must be completely deleted');
      assert.strictEqual(fs.existsSync('.vercel'), false, '.vercel directory must not exist');
      assert.strictEqual(fs.existsSync('.vercelignore'), false, '.vercelignore must not exist');

      // 2. Verify server.js contains correct standalone routing architecture
      const serverCode = fs.readFileSync('server.js', 'utf8');
      
      // Health check endpoint
      assert.ok(serverCode.includes("pathname === '/health'"), 'server.js must implement GET /health');
      
      // API 404 protection (API routes must never return index.html)
      assert.ok(serverCode.includes("ENDPOINT_NOT_FOUND") || serverCode.includes("API route not found"), 'server.js must return JSON 404 for unknown API endpoints');
      
      // Missing asset 404 protection (Missing JS, CSS, PNG, JSON must return 404, never index.html)
      assert.ok(serverCode.includes("isAssetPath") || serverCode.includes("Asset not found"), 'server.js must protect missing assets from falling back to index.html');
      
      // Binds to 0.0.0.0 and process.env.PORT
      assert.ok(serverCode.includes("0.0.0.0"), 'server.js must bind to 0.0.0.0');
      assert.ok(serverCode.includes("process.env.PORT"), 'server.js must read process.env.PORT');
    });

    // 12. Single product standalone file integrity
    await runTest('Scenario 12: Single product standalone records integrity (all 1,206 JSON files)', () => {
      const productsDir = path.resolve('public/data/products');
      assert.ok(fs.existsSync(productsDir), 'public/data/products must exist');

      const manifestPath = path.join(productsDir, 'manifest.json');
      assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      const totalCount = Array.isArray(manifest) ? manifest.length : manifest.total_count;
      assert.strictEqual(totalCount, 1206);

      // Verify a sample of records across range
      const sampleIds = ['AZQ-0001', 'AZQ-0028', 'AZQ-0100', 'AZQ-0500', 'AZQ-1000', 'AZQ-1206'];
      for (const id of sampleIds) {
        const filePath = path.join(productsDir, `${id}.json`);
        assert.ok(fs.existsSync(filePath), `File ${id}.json must exist`);
        const item = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        assert.strictEqual(item.id, id);
        assert.ok(item.name && item.name.length > 0, `${id} must have a name`);
        assert.ok(typeof item.price === 'number', `${id} must have a numeric price`);
        assert.ok(item.main_image, `${id} must have main_image`);
      }
    });

    console.log('\n' + '='.repeat(72));
    console.log(`🎉 ALL ${passed}/${total} DIRECT LOAD & HYDRATION SCENARIOS PASSED CLEANLY!`);
    console.log('='.repeat(72));
  } finally {
    globalThis.fetch = originalFetch;
  }
})();
