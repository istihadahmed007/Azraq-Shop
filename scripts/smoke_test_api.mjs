/**
 * AZRAQ Deployment API Smoke Test
 * Tests production or staging API routes for security, authorization, and health.
 *
 * Usage:
 *   node scripts/smoke_test_api.mjs
 *   TARGET_URL=https://azraq.azraqtrips.com node scripts/smoke_test_api.mjs
 */

const TARGET_URL = process.env.TARGET_URL || 'https://azraq.azraqtrips.com';

console.log('='.repeat(64));
console.log(`🚀 AZRAQ DEPLOYMENT API SMOKE TEST`);
console.log(`Target: ${TARGET_URL}`);
console.log('='.repeat(64));

let passed = 0;
let total = 0;

async function assertRoute(name, testFn) {
  total++;
  try {
    await testFn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

async function runSmokeTests() {
  // 1. Public Gateway Health Status
  await assertRoute('GET /api/payments/status returns 200 with gateway info', async () => {
    const res = await fetch(`${TARGET_URL}/api/payments/status`);
    if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
    const data = await res.json();
    if (!data.success || !data.gateway) throw new Error('Expected success: true and gateway metadata');
    if (data.gateway.currency !== 'BDT') throw new Error(`Unexpected currency: ${data.gateway.currency}`);
  });

  // 2. Orders Protection (Unauthenticated Request MUST be rejected)
  await assertRoute('GET /api/orders rejects unauthenticated request with 401', async () => {
    const res = await fetch(`${TARGET_URL}/api/orders`);
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected status 401/403, got ${res.status}. Unauthenticated PII export must be blocked!`);
    }
  });

  // 3. Transactions Protection (Unauthenticated Request MUST be rejected)
  await assertRoute('GET /api/payments/transactions rejects unauthenticated request with 401', async () => {
    const res = await fetch(`${TARGET_URL}/api/payments/transactions`);
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected status 401/403, got ${res.status}. Unauthenticated financial audit must be blocked!`);
    }
  });

  // 4. Order Tracking Endpoint Parameter Validation
  await assertRoute('POST /api/orders/track rejects empty request with 400', async () => {
    const res = await fetch(`${TARGET_URL}/api/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.status !== 400) throw new Error(`Expected status 400 for empty track request, got ${res.status}`);
  });

  // 5. Payments Create Validation
  await assertRoute('POST /api/payments/create rejects empty customer payload with 400', async () => {
    const res = await fetch(`${TARGET_URL}/api/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.status !== 400) throw new Error(`Expected status 400 for missing customer, got ${res.status}`);
  });

  // 6. Refund Endpoint Protection
  await assertRoute('POST /api/payments/refund rejects unauthenticated request with 401', async () => {
    const res = await fetch(`${TARGET_URL}/api/payments/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: 'AZQ-TEST-001' })
    });
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected status 401/403 for unauthenticated refund, got ${res.status}`);
    }
  });

  // 7. Standalone Server Health Check
  await assertRoute('GET /health returns 200 with status ok and safe uptime', async () => {
    const res = await fetch(`${TARGET_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Expected status: 'ok', got ${data.status}`);
    if (typeof data.uptime_seconds !== 'number') throw new Error('Expected numeric uptime_seconds');
  });

  // 8. Standalone Single Product Lookup API
  await assertRoute('GET /api/products?id=AZQ-0028 returns 200 with valid product record', async () => {
    const res = await fetch(`${TARGET_URL}/api/products?id=AZQ-0028`);
    if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
    const data = await res.json();
    if (!data.success || !data.product) throw new Error('Expected success: true and product data');
    if (data.product.id !== 'AZQ-0028') throw new Error(`Expected AZQ-0028, got ${data.product.id}`);
  });

  // 9. API Route 404 Protection (Must return JSON 404, NEVER HTML index.html)
  await assertRoute('GET /api/unknown-route returns JSON 404 and NEVER HTML index', async () => {
    const res = await fetch(`${TARGET_URL}/api/unknown-route-test-404`);
    if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Expected application/json, got ${contentType}. API must NEVER return HTML!`);
    }
  });

  // 10. Missing Asset 404 Protection (Missing JS/CSS/image returns 404, NEVER HTML)
  await assertRoute('GET /assets/missing-asset.js returns 404 and NEVER index.html', async () => {
    const res = await fetch(`${TARGET_URL}/assets/missing-asset-test.js`);
    if (res.status !== 404) throw new Error(`Expected status 404 for missing asset, got ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error(`Missing JS asset must return 404 text, NOT HTML! Got: ${contentType}`);
    }
  });

  // 11. Direct Product Route returns React SPA Application
  await assertRoute('GET /product/shaver-azq-0077 returns 200 HTML for direct page loads & refreshes', async () => {
    const res = await fetch(`${TARGET_URL}/product/shaver-azq-0077`);
    if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      throw new Error(`Expected text/html for SPA route, got ${contentType}`);
    }
    const html = await res.text();
    if (!html.includes('<div id="root">') && !html.includes('id="root"')) {
      throw new Error('Expected root div element in React index.html');
    }
  });

  console.log('='.repeat(64));
  console.log(`📊 SMOKE TESTS COMPLETED: ${passed}/${total} PASSED`);
  console.log('='.repeat(64));
}

runSmokeTests().catch(err => {
  console.error('[Smoke Test Runner Fatal Error]:', err);
  process.exit(1);
});
