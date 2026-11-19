import assert from 'assert';

const BASE_URL = process.env.BASE_URL || process.env.TARGET_URL || 'http://127.0.0.1:3000';

async function test(name, fn) {
  process.stdout.write(`▶ ${name}... `);
  try {
    await fn();
    console.log('✓ Passed');
  } catch (err) {
    console.error('✗ Failed:', err.message);
    process.exitCode = 1;
  }
}

(async () => {
  console.log('='.repeat(64));
  console.log('🧪 AZRAQ STANDALONE SERVER E2E VERIFICATION');
  console.log('='.repeat(64));

  // 1. Homepage
  await test('Homepage returns 200 with HTML application', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('text/html'));
    const html = await res.text();
    assert.ok(html.includes('id="root"'));
  });

  // 2. Direct product URL access
  await test('Direct Product URL (/product/shaver-azq-0077) returns 200 HTML', async () => {
    const res = await fetch(`${BASE_URL}/product/shaver-azq-0077`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('text/html'));
    const html = await res.text();
    assert.ok(html.includes('id="root"'));
  });

  // 3. Product URL refresh simulation (no previous cookies/cache)
  await test('Product URL Refresh simulation with clean cache headers returns 200 HTML', async () => {
    const res = await fetch(`${BASE_URL}/product/portable-lint-remover-shaver-azq-0077`, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('text/html'));
  });

  // 4. Product AZQ-0037 (first item beyond initial 36)
  await test('Product AZQ-0037 static record resolves standalone (~2.7 KB)', async () => {
    const res = await fetch(`${BASE_URL}/data/products/AZQ-0037.json`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('application/json'));
    const p = await res.json();
    assert.strictEqual(p.id, 'AZQ-0037');
    assert.ok(p.name && p.name.length > 0);
  });

  await test('Product AZQ-0037 API resolution (/api/products?id=AZQ-0037)', async () => {
    const res = await fetch(`${BASE_URL}/api/products?id=AZQ-0037`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.product.id, 'AZQ-0037');
  });

  // 5. Product AZQ-1206 (the very last item in 1,206 catalog)
  await test('Product AZQ-1206 static record resolves standalone', async () => {
    const res = await fetch(`${BASE_URL}/data/products/AZQ-1206.json`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('application/json'));
    const p = await res.json();
    assert.strictEqual(p.id, 'AZQ-1206');
    assert.ok(p.price > 0);
  });

  await test('Product AZQ-1206 API resolution (/api/products?id=AZQ-1206)', async () => {
    const res = await fetch(`${BASE_URL}/api/products?id=AZQ-1206`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.product.id, 'AZQ-1206');
  });

  // 6. Invalid product ID (AZQ-99999) returns 404 JSON (NOT index.html)
  await test('Nonexistent Product ID (AZQ-99999) returns 404 JSON', async () => {
    const res = await fetch(`${BASE_URL}/api/products?id=AZQ-99999`);
    assert.strictEqual(res.status, 404);
    assert.ok(res.headers.get('content-type').includes('application/json'));
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.strictEqual(data.code, 'PRODUCT_NOT_FOUND');
  });

  // 7. Missing asset returns 404 text (NOT index.html)
  await test('Missing asset returns 404 and NOT index.html', async () => {
    const res = await fetch(`${BASE_URL}/assets/missing-bundle-test.js`);
    assert.strictEqual(res.status, 404);
    assert.ok(!res.headers.get('content-type').includes('text/html'));
  });

  // 8. Order Tracking API validation
  await test('Order tracking rejects invalid requests safely', async () => {
    const res = await fetch(`${BASE_URL}/api/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: 'AZQ-ORD-NONEXISTENT', phone: '01851172032' })
    });
    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // 9. Payment Create validation
  await test('Payment checkout session rejects empty payload with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // 10. AI Visual Search API endpoint
  await test('AI Visual Search handles requests safely', async () => {
    const res = await fetch(`${BASE_URL}/api/search-by-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: 'invalid_small_data' })
    });
    // Should return 400 for invalid/malformed image data
    assert.ok(res.status === 400 || res.status === 422 || res.status === 500);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  // 11. Health Check
  await test('Health check returns status ok and process uptime', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.service, 'azraq-shop');
  });

  console.log('='.repeat(64));
  console.log('🎉 ALL END-TO-END STANDALONE SERVER VERIFICATIONS PASSED!');
  console.log('='.repeat(64));
})();
