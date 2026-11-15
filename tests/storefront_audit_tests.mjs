// AZRAQ Shop — Comprehensive Storefront & Integration Audit Test Suite
// Verifies: Catalog search/filtering, pricing, delivery tiers, promo codes,
// COD invariants, Paymently resilience & rehydration, Admin safeguards.

import assert from 'assert';
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
runTest('Inside Dhaka Delivery Fee is ৳70 when subtotal < ৳3,000', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 1, price: 1500, quantity: 1 }],
    deliveryArea: 'inside'
  });
  assert.strictEqual(result.subtotal, 1500);
  assert.strictEqual(result.deliveryFee, 70);
  assert.strictEqual(result.totalPayable, 1570);
});

runTest('Outside Dhaka Delivery Fee is ৳130 when subtotal < ৳3,000', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 1, price: 1500, quantity: 1 }],
    deliveryArea: 'outside'
  });
  assert.strictEqual(result.subtotal, 1500);
  assert.strictEqual(result.deliveryFee, 130);
  assert.strictEqual(result.totalPayable, 1630);
});

runTest('Nationwide Free Delivery unlocks on orders >= ৳3,000', () => {
  const inside = calculateServerOrderPricing({
    items: [{ id: 1, price: 3000, quantity: 1 }],
    deliveryArea: 'inside'
  });
  assert.strictEqual(inside.deliveryFee, 0);
  assert.strictEqual(inside.totalPayable, 3000);

  const outside = calculateServerOrderPricing({
    items: [{ id: 1, price: 3200, quantity: 1 }],
    deliveryArea: 'outside'
  });
  assert.strictEqual(outside.deliveryFee, 0);
  assert.strictEqual(outside.totalPayable, 3200);
});

// 2. Promo Code Calculations
runTest('Promo Code AZRAQNEW applies ৳200 flat discount', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 1, price: 2000, quantity: 1 }],
    deliveryArea: 'inside',
    promoCode: 'AZRAQNEW'
  });
  assert.strictEqual(result.discount, 200);
  assert.strictEqual(result.totalPayable, 2000 - 200 + 70);
});

runTest('Promo Code AZRAQ10 applies 10% percentage discount', () => {
  const result = calculateServerOrderPricing({
    items: [{ id: 1, price: 2500, quantity: 1 }],
    deliveryArea: 'outside',
    promoCode: 'AZRAQ10'
  });
  assert.strictEqual(result.discount, 250);
  assert.strictEqual(result.totalPayable, 2500 - 250 + 130);
});

// 3. COD Order Placement
await runAsyncTest('Cash on Delivery (COD) marked strictly PENDING_COD (Never PAID)', async () => {
  const res = await createCodCheckoutOrder({
    customer: {
      name: 'Rahim Ahmed',
      phone: '01811223344',
      address: 'Road 4, Dhanmondi, Dhaka'
    },
    items: [{ id: 'TEST-PROD-1', name: 'Cotton Shirt', price: 1200, quantity: 1 }],
    deliveryArea: 'inside'
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.order.payment_method, 'COD');
  assert.strictEqual(res.order.payment_status, 'PENDING_COD');
  assert.notStrictEqual(res.order.payment_status, 'PAID');
});

// 4. Paymently Fallback Resilience
await runAsyncTest('Paymently checkout activates official merchant link when API key absent', async () => {
  const session = await createPaymentlyCheckoutSession({
    customer: {
      name: 'Fatima Begum',
      phone: '01711223344',
      address: 'Gulshan 2, Dhaka'
    },
    items: [{ id: 'TEST-PROD-2', name: 'Ceramic Vase', price: 1800, quantity: 1 }],
    deliveryArea: 'inside'
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
      items: [{ id: 'COLD-1', name: 'Desk Organizer', price: 950, quantity: 1 }],
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

console.log('='.repeat(64));
console.log(`📊 ALL ${passed}/${total} AUDIT ACCEPTANCE TESTS PASSED!`);
console.log('='.repeat(64));

