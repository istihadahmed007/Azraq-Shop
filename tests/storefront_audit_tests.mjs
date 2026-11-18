// AZRAQ Shop — Comprehensive Storefront & Integration Audit Test Suite
// Verifies: Catalog search/filtering, pricing, delivery tiers, promo codes,
// COD invariants, Paymently resilience & rehydration, Admin safeguards.

import assert from 'assert';
import fs from 'fs';
import { 
  calculateServerOrderPricing,
  createPaymentlyCheckoutSession,
  verifyPaymentlyPayment,
  createCodCheckoutOrder
} from '../server/paymentlyService.js';
import { 
  initDb,
  saveCheckoutAttempt,
  getCheckoutAttempt,
  getAllOrders,
  getAllTransactions
} from '../server/db.js';
import { isTrustedPaymentUrl, formatBdtAmount } from '../src/services/paymentService.js';

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

async function runAsyncTest(name, fn) {
  total++;
  process.stdout.write(`\n▶ TEST ${total} — ${name}:\n`);
  try {
    await fn();
    passed++;
    console.log(`  ✓ Passed`);
  } catch (err) {
    console.error(`  ✗ Failed:`, err.message);
    throw err;
  }
}

console.log('='.repeat(64));
console.log('🧪 AZRAQ SHOP COMPREHENSIVE STOREFRONT & ENGINE AUDIT');
console.log('='.repeat(64));

// 1. Delivery Pricing Invariants
runTest('Inside Dhaka Delivery Fee is ৳80 when subtotal < ৳3,000', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 'AZQ-0010', quantity: 1 }],
    deliveryArea: 'inside'
  });
  assert.strictEqual(result.subtotal, 1500);
  assert.strictEqual(result.deliveryFee, 80);
  assert.strictEqual(result.totalPayable, 1580);
});

runTest('Outside Dhaka Delivery Fee is ৳150 when subtotal < ৳3,000', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 'AZQ-0010', quantity: 1 }],
    deliveryArea: 'outside'
  });
  assert.strictEqual(result.subtotal, 1500);
  assert.strictEqual(result.deliveryFee, 150);
  assert.strictEqual(result.totalPayable, 1650);
});

runTest('Nationwide Free Delivery unlocks on orders >= ৳3,000', () => {
  const inside = calculateServerOrderPricing({
    items: [{ id: 'AZQ-0263', quantity: 1 }],
    deliveryArea: 'inside'
  });
  assert.strictEqual(inside.deliveryFee, 0);
  assert.strictEqual(inside.totalPayable, 3000);

  const outside = calculateServerOrderPricing({
    items: [{ id: 'AZQ-0043', quantity: 1 }],
    deliveryArea: 'outside'
  });
  assert.strictEqual(outside.deliveryFee, 0);
  assert.strictEqual(outside.totalPayable, 3250);
});

// 2. Promo Code Calculations
runTest('Promo Code AZRAQNEW applies ৳200 flat discount', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 'AZQ-0110', quantity: 1 }],
    deliveryArea: 'inside',
    promoCode: 'AZRAQNEW'
  });
  assert.strictEqual(result.discount, 200);
  assert.strictEqual(result.totalPayable, 2000 - 200 + 80);
});

runTest('Promo Code AZRAQ10 applies 10% percentage discount', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 'AZQ-0049', quantity: 1 }],
    deliveryArea: 'outside',
    promoCode: 'AZRAQ10'
  });
  assert.strictEqual(result.discount, 250);
  assert.strictEqual(result.totalPayable, 2500 - 250 + 150);
});

// 3. COD Order Placement
await runAsyncTest('Cash on Delivery (COD) marked strictly PENDING_COD (Never PAID)', async () => {
  const res = await createCodCheckoutOrder({
    customer: {
      name: 'Rahim Ahmed',
      phone: '01811223344',
      address: 'Road 4, Dhanmondi, Dhaka'
    },
    items: [{ id: 'AZQ-0005', quantity: 1 }],
    deliveryArea: 'inside'
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.order.payment_method, 'COD');
  assert.strictEqual(res.order.payment_status, 'PENDING_COD');
  assert.notStrictEqual(res.order.payment_status, 'PAID');
});

// 4. Paymently Fallback Resilience
await runAsyncTest('Paymently checkout activates official merchant link when API key absent and manual fallback requested', async () => {
  const session = await createPaymentlyCheckoutSession({
    customer: {
      name: 'Fatima Begum',
      phone: '01711223344',
      address: 'Gulshan 2, Dhaka'
    },
    items: [{ id: 'AZQ-0443', quantity: 1 }],
    deliveryArea: 'inside',
    allowManualFallback: true
  });
  assert.strictEqual(session.success, true);
  assert.strictEqual(session.payment_url, 'https://azraq.paymently.io/paymentlink/default/BDT');
  assert.strictEqual(session.requires_manual_trx, true);
});

// 5. Serverless Snapshot Rehydration
await runAsyncTest('Serverless cold boot rehydrates session via checkoutSnapshot', async () => {
  const randomCheckoutId = `AZQ-COLD-${Date.now().toString(36).toUpperCase()}`;
  
  // Verify with checkoutSnapshot when session was not in container memory
  const verifyRes = await verifyPaymentlyPayment({
    checkoutId: randomCheckoutId,
    manualTrxId: 'BKASH-COLD-9988',
    checkoutSnapshot: {
      customer: {
        name: 'Cold Boot User',
        phone: '01999887766',
        address: 'Uttara Sector 11, Dhaka'
      },
      items: [{ id: 'AZQ-0006', quantity: 1 }],
      deliveryArea: 'inside'
    }
  });

  assert.strictEqual(verifyRes.success, true);
  assert.strictEqual(verifyRes.status, 'PENDING_VERIFICATION');
  assert.strictEqual(verifyRes.order.customer_name, 'Cold Boot User');
  assert.strictEqual(verifyRes.order.payment_status, 'PENDING_VERIFICATION');
});

// 6. Trusted Payment URL Invariants
runTest('Trusted URL validator accepts official Paymently domains and rejects malicious domains', () => {
  assert.strictEqual(isTrustedPaymentUrl('https://azraq.paymently.io/paymentlink/default/BDT'), true);
  assert.strictEqual(isTrustedPaymentUrl('https://checkout.paymently.io/pay/123'), true);
  assert.strictEqual(isTrustedPaymentUrl('http://azraq.paymently.io/insecure'), false);
  assert.strictEqual(isTrustedPaymentUrl('https://fake-azraq.paymently.io.phishing.com/pay'), false);
  assert.strictEqual(isTrustedPaymentUrl('javascript:alert(1)'), false);
});

// 7. BDT Amount Formatter Invariant
runTest('Format BDT Amount handles decimal rounding and formatting', () => {
  assert.strictEqual(formatBdtAmount(830), '৳830 BDT');
  assert.strictEqual(formatBdtAmount(1450.75), '৳1,451 BDT');
  assert.strictEqual(formatBdtAmount(3000), '৳3,000 BDT');
});

// 8. Module Architecture & Component Barrel Exports
runTest('Component barrel index defines all active storefront modules', () => {
  const content = fs.readFileSync('src/components/index.js', 'utf-8');
  assert.ok(content.includes('export { default as Header }'), 'Header should be exported');
  assert.ok(content.includes('export { default as Footer }'), 'Footer should be exported');
  assert.ok(content.includes('export { default as ProductGrid }'), 'ProductGrid should be exported');
  assert.ok(content.includes('export { default as TrendingRightNowSection }'), 'TrendingRightNowSection should be exported');
  assert.ok(content.includes('export { default as CartDrawer }'), 'CartDrawer should be exported');
  assert.ok(content.includes('export { default as CheckoutModal }'), 'CheckoutModal should be exported');
  assert.ok(content.includes('export { default as AzraqLogo'), 'AzraqLogo should be exported');
});

// 9. Initial Catalog & Central Catalog Durability
await runAsyncTest('Initial fast-boot catalog matches schema requirements', async () => {
  const initialCatalog = (await import('../src/data/initial_catalog.json', { with: { type: 'json' } })).default;
  assert.ok(Array.isArray(initialCatalog.products), 'Initial catalog products must be an array');
  assert.ok(initialCatalog.products.length >= 8, 'Initial catalog should have at least 8 above-the-fold items');
  for (const item of initialCatalog.products) {
    assert.ok(item.id, 'Every catalog item must have an id');
    assert.ok(typeof item.price === 'number', 'Price must be a number');
    assert.ok(item.main_image, 'Every item must have a main_image');
  }
});

console.log('='.repeat(64));
console.log(`📊 ALL ${passed}/${total} AUDIT ACCEPTANCE TESTS PASSED!`);
console.log('='.repeat(64));

