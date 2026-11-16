/**
 * AZRAQ Deployment API Smoke Test
 * Tests production or staging API routes for security, authorization, and health.
 *
 * Usage:
 *   node scripts/smoke_test_api.mjs
 *   TARGET_URL=https://shop.azraqtrips.com node scripts/smoke_test_api.mjs
 */

const TARGET_URL = process.env.TARGET_URL || 'https://shop.azraqtrips.com';

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

  console.log('='.repeat(64));
  console.log(`📊 SMOKE TESTS COMPLETED: ${passed}/${total} PASSED`);
  console.log('='.repeat(64));
}

runSmokeTests().catch(err => {
  console.error('[Smoke Test Runner Fatal Error]:', err);
  process.exit(1);
});
