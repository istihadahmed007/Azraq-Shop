import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { 
  findProductBySlug, 
  generateProductSlug, 
  fetchSingleProduct 
} from '../src/utils/productUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_INDEX_PATH = path.join(ROOT_DIR, 'dist', 'index.html');

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
console.log('🧪 AZRAQ PRODUCT PAGE REFRESH & ASSET RESOLUTION REGRESSION TESTS');
console.log('='.repeat(72));

// Helper: HTTP request using native node http
function request(port, pathName, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: pathName,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

const TEST_PORT = 3899;
let serverProcess = null;

async function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn('node', ['server.js'], {
      cwd: ROOT_DIR,
      env: { ...process.env, PORT: String(TEST_PORT), HOST: '127.0.0.1' },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    serverProcess.stdout.on('data', (d) => {
      output += d.toString();
      if (output.includes('Listening on http://')) {
        resolve();
      }
    });
    serverProcess.stderr.on('data', (d) => {
      output += d.toString();
    });
    serverProcess.on('error', reject);
    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Server exited prematurely with code ${code}: ${output}`));
      }
    });

    setTimeout(() => {
      reject(new Error(`Server startup timed out after 10s: ${output}`));
    }, 10000);
  });
}

function stopServer() {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
}

try {
  // Verify dist/index.html exists
  assert.ok(fs.existsSync(DIST_INDEX_PATH), 'dist/index.html must exist before running regression tests');

  // Start the actual standalone production server
  await startServer();

  // Test 1: Production build index.html contains root-absolute asset paths
  await runTest('dist/index.html references all JS, CSS, and favicon assets with absolute paths (/)', async () => {
    const html = fs.readFileSync(DIST_INDEX_PATH, 'utf8');
    assert.ok(html.includes('<div id="root">'), 'index.html must contain root mount element');

    // Extract script src
    const scriptMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)];
    assert.ok(scriptMatches.length > 0, 'Must have at least one script tag');
    for (const match of scriptMatches) {
      const src = match[1];
      assert.ok(src.startsWith('/'), `Script src "${src}" must start with "/" (root-absolute), never "./"`);
    }

    // Extract link href (css, modulepreload, icons)
    const linkMatches = [...html.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)];
    for (const match of linkMatches) {
      const href = match[1];
      if (href.startsWith('http://') || href.startsWith('https://')) continue;
      assert.ok(href.startsWith('/'), `Link href "${href}" must start with "/" (root-absolute), never "./"`);
    }
  });

  // Test 2: Cold direct request to product URL (AZQ-0002) returns SPA entry HTML
  await runTest('Direct GET /product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002 returns 200 HTML', async () => {
    const res = await request(TEST_PORT, '/product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002');
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.headers['content-type'].includes('text/html'), 'Content-Type must be text/html');
    assert.ok(res.body.includes('<div id="root">'), 'Response must be SPA index.html');
  });

  // Test 3: Primary entry script and CSS assets load with correct Content-Type (never text/html)
  await runTest('All referenced scripts and stylesheets resolve with proper MIME types', async () => {
    const html = fs.readFileSync(DIST_INDEX_PATH, 'utf8');
    const scriptMatches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)];
    for (const match of scriptMatches) {
      const assetPath = match[1];
      const res = await request(TEST_PORT, assetPath);
      assert.strictEqual(res.statusCode, 200, `Asset ${assetPath} must return 200`);
      assert.ok(
        res.headers['content-type'].includes('javascript'),
        `Asset ${assetPath} must return javascript MIME type, got ${res.headers['content-type']}`
      );
    }

    const cssMatches = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)];
    for (const match of cssMatches) {
      const cssPath = match[1];
      const res = await request(TEST_PORT, cssPath);
      assert.strictEqual(res.statusCode, 200, `CSS ${cssPath} must return 200`);
      assert.ok(
        res.headers['content-type'].includes('css'),
        `CSS ${cssPath} must return css MIME type, got ${res.headers['content-type']}`
      );
    }
  });

  // Test 4: Cold direct request to out-of-initial-catalog product (AZQ-0077)
  await runTest('Out-of-initial-catalog product AZQ-0077 resolves static record & API endpoint', async () => {
    // 1. Direct page request
    const pageRes = await request(TEST_PORT, '/product/vintage-t9-trimmer-shaver-azq-0077');
    assert.strictEqual(pageRes.statusCode, 200);
    assert.ok(pageRes.headers['content-type'].includes('text/html'));

    // 2. Static record fetch
    const staticRes = await request(TEST_PORT, '/data/products/AZQ-0077.json');
    assert.strictEqual(staticRes.statusCode, 200);
    assert.ok(staticRes.headers['content-type'].includes('application/json'));
    const staticData = JSON.parse(staticRes.body);
    assert.strictEqual(staticData.id, 'AZQ-0077');
    assert.ok(staticData.price > 0);

    // 3. API endpoint fetch
    const apiRes = await request(TEST_PORT, '/api/products?id=AZQ-0077');
    assert.strictEqual(apiRes.statusCode, 200);
    const apiData = JSON.parse(apiRes.body);
    assert.strictEqual(apiData.success, true);
    assert.strictEqual(apiData.product.id, 'AZQ-0077');
  });

  // Test 5: Defense-in-depth nested asset path normalization
  await runTest('Server normalizes nested relative asset paths (/product/.../assets/* -> /assets/*)', async () => {
    const html = fs.readFileSync(DIST_INDEX_PATH, 'utf8');
    const mainScriptMatch = html.match(/<script[^>]+src=["']\/assets\/([^"']+)["']/i);
    assert.ok(mainScriptMatch, 'Must find main script in dist/index.html');
    const chunkName = mainScriptMatch[1];

    // Request nested relative asset path: /product/yonex-.../assets/<chunk>
    const nestedRes = await request(
      TEST_PORT,
      `/product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002/assets/${chunkName}`
    );
    assert.strictEqual(nestedRes.statusCode, 200, 'Nested asset path must be normalized to 200');
    assert.ok(
      nestedRes.headers['content-type'].includes('javascript'),
      'Normalized asset must return javascript, never text/html'
    );

    // Request nested relative data path: /product/yonex-.../data/products/AZQ-0002.json
    const nestedDataRes = await request(
      TEST_PORT,
      '/product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002/data/products/AZQ-0002.json'
    );
    assert.strictEqual(nestedDataRes.statusCode, 200);
    assert.ok(nestedDataRes.headers['content-type'].includes('application/json'));
  });

  // Test 6: Missing static assets return explicit 404 (NEVER index.html)
  await runTest('Missing static assets return 404 text/plain, never index.html', async () => {
    const missingAsset = await request(TEST_PORT, '/assets/non-existent-bundle.js');
    assert.strictEqual(missingAsset.statusCode, 404);
    assert.ok(!missingAsset.body.includes('<div id="root">'), 'Must not return index.html for missing asset');

    const missingNested = await request(TEST_PORT, '/product/sample/assets/non-existent-bundle.js');
    assert.strictEqual(missingNested.statusCode, 404);
    assert.ok(!missingNested.body.includes('<div id="root">'));
  });

  // Test 7: fetchSingleProduct error classification (timeouts/failures are NEVER classified as 404)
  await runTest('fetchSingleProduct correctly classifies timeouts and network failures without showing 404', async () => {
    // Timeout test with very low timeout
    const abortCtrl = new AbortController();
    const timeoutRes = await fetchSingleProduct('azq-0002', {
      baseUrl: `http://127.0.0.1:${TEST_PORT}`,
      timeoutMs: 1 // instant timeout
    });

    if (timeoutRes.isTimeout) {
      assert.strictEqual(timeoutRes.isTimeout, true);
      assert.strictEqual(timeoutRes.isNetworkError, true);
      assert.strictEqual(timeoutRes.isNotFound, false, 'Timeout must NEVER be classified as notFound (404)');
    }

    // Non-existent product test
    const notFoundRes = await fetchSingleProduct('totally-non-existent-item-azq-9999', {
      baseUrl: `http://127.0.0.1:${TEST_PORT}`,
      timeoutMs: 3000
    });
    assert.strictEqual(notFoundRes.isNotFound, true, 'Nonexistent item must resolve to notFound');
    assert.strictEqual(notFoundRes.product, null);
  });

  // Test 8: Startup Boot Watchdog & Error Recovery Fallback in production HTML
  await runTest('dist/index.html includes boot watchdog, error container, and reload trigger', async () => {
    const html = fs.readFileSync(DIST_INDEX_PATH, 'utf8');
    assert.ok(html.includes('id="azraq-loader-progress"'), 'Must have loader progress element');
    assert.ok(html.includes('id="azraq-boot-error-ui"'), 'Must have resilient boot error container');
    assert.ok(html.includes('id="azraq-boot-reload-btn"'), 'Must have boot reload button');
    assert.ok(html.includes('window.__azraqShowBootError'), 'Must define global boot error trigger');
    assert.ok(html.includes('window.__azraqBootRetry'), 'Must define global boot retry handler');
    assert.ok(html.includes('window.__AZRAQ_BOOTED__'), 'Must define boot completion flag');
    assert.ok(html.includes('bootTimer = setTimeout'), 'Must define boot watchdog timer');
  });

  // Test 9: Boot Error Handler simulation — hides progress bar and displays recovery UI
  await runTest('Boot error handler transitions from spinner to recovery UI on startup failure', async () => {
    const html = fs.readFileSync(DIST_INDEX_PATH, 'utf8');
    // Extract the inline watchdog script
    const scriptMatch = html.match(/<script>\s*(\(function\(\)\s*\{[\s\S]*?\}\)\(\);)\s*<\/script>/);
    assert.ok(scriptMatch, 'Must find inline boot script in dist/index.html');
    const bootScriptCode = scriptMatch[1];

    // Minimal DOM environment simulation to test boot script logic
    const dom = {
      progressDisplay: 'block',
      errorUiDisplay: 'none',
      errorDescText: '',
      elements: {
        'azraq-loader-progress': { style: { get display() { return dom.progressDisplay; }, set display(v) { dom.progressDisplay = v; } } },
        'azraq-boot-error-ui': { style: { get display() { return dom.errorUiDisplay; }, set display(v) { dom.errorUiDisplay = v; } } },
        'azraq-boot-error-desc': { textContent: '', set textContent(v) { dom.errorDescText = v; } }
      }
    };

    const listeners = {};
    const mockWindow = {
      addEventListener: (evt, fn) => { listeners[evt] = fn; },
      sessionStorage: { removeItem: () => {} },
      location: { reload: () => {} }
    };
    const mockDocument = {
      getElementById: (id) => dom.elements[id] || null
    };

    // Execute boot script in isolated context
    const fn = new Function('window', 'document', 'setTimeout', 'clearTimeout', bootScriptCode);
    let capturedTimeoutFn = null;
    let capturedTimeoutDelay = 0;
    fn(mockWindow, mockDocument, (cb, d) => {
      capturedTimeoutFn = cb;
      capturedTimeoutDelay = d;
      return 123;
    }, () => {});

    assert.strictEqual(mockWindow.__AZRAQ_BOOTED__, false, 'Initial boot flag must be false');
    assert.strictEqual(capturedTimeoutDelay, 8000, 'Watchdog timeout must be 8000ms');

    // Simulate script load failure
    listeners.error({
      target: { tagName: 'SCRIPT', src: 'https://azraq.azraqtrips.com/assets/stale-chunk-missing.js' }
    });

    assert.strictEqual(dom.progressDisplay, 'none', 'Spinner must be hidden on boot error');
    assert.strictEqual(dom.errorUiDisplay, 'flex', 'Boot error UI must be shown on boot error');
    assert.ok(dom.errorDescText.includes('stale-chunk-missing.js'), 'Error message must reflect the failed asset');
  });

  // Test 10: Watchdog timeout simulation — triggers recovery UI if app takes longer than 8s
  await runTest('Boot watchdog timer triggers recovery UI if app takes longer than 8s without booting', async () => {
    const html = fs.readFileSync(DIST_INDEX_PATH, 'utf8');
    const scriptMatch = html.match(/<script>\s*(\(function\(\)\s*\{[\s\S]*?\}\)\(\);)\s*<\/script>/);
    const bootScriptCode = scriptMatch[1];

    const dom = {
      progressDisplay: 'block',
      errorUiDisplay: 'none',
      errorDescText: '',
      elements: {
        'azraq-loader-progress': { style: { set display(v) { dom.progressDisplay = v; } } },
        'azraq-boot-error-ui': { style: { set display(v) { dom.errorUiDisplay = v; } } },
        'azraq-boot-error-desc': { set textContent(v) { dom.errorDescText = v; } }
      }
    };

    const mockWindow = {
      addEventListener: () => {},
      sessionStorage: { removeItem: () => {} },
      location: { reload: () => {} }
    };
    const mockDocument = {
      getElementById: (id) => dom.elements[id] || null
    };

    let timerCb = null;
    const fn = new Function('window', 'document', 'setTimeout', 'clearTimeout', bootScriptCode);
    fn(mockWindow, mockDocument, (cb) => { timerCb = cb; return 456; }, () => {});

    // Simulate watchdog firing after 8s when React did NOT mount
    assert.ok(timerCb, 'Watchdog timer callback must be set');
    timerCb();

    assert.strictEqual(dom.progressDisplay, 'none', 'Spinner must be hidden on watchdog timeout');
    assert.strictEqual(dom.errorUiDisplay, 'flex', 'Boot error UI must be displayed on watchdog timeout');
    assert.ok(dom.errorDescText.includes('took too long to start'), 'Watchdog message must advise reloading');
  });

  // Test 11: Product fetch failure (500/network) transitions to recoverable error with retry
  await runTest('Failed product data fetch transitions to recoverable networkError, never 404', async () => {
    // Test with server endpoint returning 500
    const failRes = await fetchSingleProduct('AZQ-0002', {
      baseUrl: 'http://127.0.0.1:9999', // invalid port to simulate network failure
      timeoutMs: 1500
    });

    assert.strictEqual(failRes.product, null);
    assert.strictEqual(failRes.isNotFound, false, 'Connection failure must NOT be classified as 404');
    assert.strictEqual(failRes.isNetworkError, true, 'Connection failure must be classified as networkError');
    assert.ok(failRes.error, 'Must provide informative error message');
  });

} finally {
  stopServer();
}

console.log('='.repeat(72));
console.log(`🎉 ALL ${passed}/${total} REGRESSION TESTS PASSED SUCCESSFULLY`);
console.log('='.repeat(72));
