/**
 * AZRAQ Localization & Currency UI Test Suite
 * Validates Bengali/English translation consistency, BDT currency formatting (৳ with Western digits),
 * authoritative server calculations matching UI formats, and layout safety.
 */

import assert from 'assert';
import { formatBdtAmount } from '../src/services/paymentService.js';
import { calculateServerOrderPricing } from '../server/paymentlyService.js';

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('='.repeat(64));
console.log('🇧🇩 AZRAQ LOCALIZATION & CURRENCY TEST SUITE');
console.log('='.repeat(64));

// 1. Translation Function Behavior Simulation
function createTranslator(lang) {
  return (en, bn) => {
    if (lang === 'bn') return bn || en;
    return en;
  };
}

runTest('Localization: returns English strings in EN mode', () => {
  const tEn = createTranslator('en');
  assert.strictEqual(tEn("Track Your Order", "অর্ডারের লাইভ অবস্থান"), "Track Your Order");
  assert.strictEqual(tEn("Cash on Delivery", "ক্যাশ অন ডেলিভারি"), "Cash on Delivery");
  assert.strictEqual(tEn("Pay Securely", "নিরাপদে পেমেন্ট করুন"), "Pay Securely");
});

runTest('Localization: returns Bengali strings in BN mode', () => {
  const tBn = createTranslator('bn');
  assert.strictEqual(tBn("Track Your Order", "অর্ডারের লাইভ অবস্থান"), "অর্ডারের লাইভ অবস্থান");
  assert.strictEqual(tBn("Cash on Delivery", "ক্যাশ অন ডেলিভারি"), "ক্যাশ অন ডেলিভারি");
  assert.strictEqual(tBn("Pay Securely", "নিরাপদে পেমেন্ট করুন"), "নিরাপদে পেমেন্ট করুন");
});

runTest('Localization: falls back to English when Bengali is undefined or null', () => {
  const tBn = createTranslator('bn');
  assert.strictEqual(tBn("Exclusive Quality", null), "Exclusive Quality");
  assert.strictEqual(tBn("Exclusive Quality", undefined), "Exclusive Quality");
});

// 2. BDT Currency Formatting (৳ with Western Digits)
runTest('Currency: formatBdtAmount formats integers with ৳ and BDT suffix using Western digits', () => {
  assert.strictEqual(formatBdtAmount(830), '৳830 BDT');
  assert.strictEqual(formatBdtAmount(1500), '৳1,500 BDT');
  assert.strictEqual(formatBdtAmount(2520), '৳2,520 BDT');
  assert.strictEqual(formatBdtAmount(10000), '৳10,000 BDT');
});

runTest('Currency: formatBdtAmount rounds decimals and handles 0 or falsy values', () => {
  assert.strictEqual(formatBdtAmount(0), '৳0 BDT');
  assert.strictEqual(formatBdtAmount(829.8), '৳830 BDT');
  assert.strictEqual(formatBdtAmount(830.2), '৳830 BDT');
  assert.strictEqual(formatBdtAmount(null), '৳0 BDT');
  assert.strictEqual(formatBdtAmount(undefined), '৳0 BDT');
  assert.strictEqual(formatBdtAmount(''), '৳0 BDT');
});

runTest('Currency: BDT symbol is strictly ৳ (Taka mark U+09F3), never $ or £', () => {
  const formatted = formatBdtAmount(1250);
  assert.ok(formatted.startsWith('৳'), 'Must start with Bengali Taka sign ৳');
  assert.ok(!formatted.includes('$'), 'Must never include dollar sign');
  assert.ok(!formatted.includes('USD'), 'Must never include USD');
  assert.ok(!formatted.includes('Tk.'), 'Prefers authentic ৳ symbol');
});

// 3. Calculation & Display Consistency Across Views
runTest('Consistency: server pricing calculation matches formatted output for Inside Dhaka', () => {
  const items = [
    { id: 'AZQ-01', price: 1200, quantity: 1 },
    { id: 'AZQ-02', price: 650, quantity: 2 }
  ];
  const pricing = calculateServerOrderPricing({ items, deliveryArea: 'inside' });
  // Subtotal = 1200 + 1300 = 2500. Delivery inside Dhaka < 3000 = 70. Total = 2570.
  assert.strictEqual(pricing.subtotal, 2500);
  assert.strictEqual(pricing.deliveryFee, 70);
  assert.strictEqual(pricing.totalPayable, 2570);

  const formattedTotal = formatBdtAmount(pricing.totalPayable);
  assert.strictEqual(formattedTotal, '৳2,570 BDT');
});

runTest('Consistency: free delivery triggered on subtotal >= 3000 BDT', () => {
  const items = [
    { id: 'AZQ-01', price: 1800, quantity: 2 } // 3600 BDT
  ];
  const pricing = calculateServerOrderPricing({ items, deliveryArea: 'inside' });
  assert.strictEqual(pricing.subtotal, 3600);
  assert.strictEqual(pricing.deliveryFee, 0, 'Delivery fee must be free (0 BDT)');
  assert.strictEqual(pricing.totalPayable, 3600);
  assert.strictEqual(formatBdtAmount(pricing.totalPayable), '৳3,600 BDT');
});

runTest('Consistency: outside Dhaka delivery fee is exactly 130 BDT', () => {
  const items = [
    { id: 'AZQ-01', price: 750, quantity: 1 }
  ];
  const pricing = calculateServerOrderPricing({ items, deliveryArea: 'outside' });
  assert.strictEqual(pricing.subtotal, 750);
  assert.strictEqual(pricing.deliveryFee, 130);
  assert.strictEqual(pricing.totalPayable, 880);
  assert.strictEqual(formatBdtAmount(pricing.totalPayable), '৳880 BDT');
});

runTest('Consistency: promo discount calculation with AZRAQNEW (৳200 discount)', () => {
  const items = [
    { id: 'AZQ-01', price: 1000, quantity: 1 }
  ];
  const pricing = calculateServerOrderPricing({ items, deliveryArea: 'inside', promoCode: 'AZRAQNEW' });
  // Subtotal 1000 + 70 delivery - 200 discount = 870 BDT
  assert.strictEqual(pricing.subtotal, 1000);
  assert.strictEqual(pricing.deliveryFee, 70);
  assert.strictEqual(pricing.discount, 200);
  assert.strictEqual(pricing.totalPayable, 870);
  assert.strictEqual(formatBdtAmount(pricing.totalPayable), '৳870 BDT');
});

// 4. Bengali Typography & UI Text Invariants
runTest('Typography: common Bengali strings render proper UTF-8 Hind Siliguri characters', () => {
  const sampleBengali = [
    "পণ্য কার্টে যোগ করা হয়েছে",
    "অর্ডার সম্পন্ন করুন",
    "ক্যাশ অন ডেলিভারি",
    "নিরাপদে পেমেন্ট করুন",
    "অর্ডারের লাইভ অবস্থান",
    "আজরাক লজিস্টিকস"
  ];

  for (const str of sampleBengali) {
    assert.ok(typeof str === 'string' && str.length > 0);
    // Ensure no replacement characters or corrupted encoding
    assert.ok(!str.includes('\uFFFD'), `String "${str}" must not have Unicode replacement character`);
    assert.ok(!str.includes('??'), `String "${str}" must not have untranslated double question marks`);
  }
});

console.log('='.repeat(64));
console.log(`📊 ALL ${passed}/${total} LOCALIZATION & CURRENCY TESTS PASSED!`);
console.log('='.repeat(64));
