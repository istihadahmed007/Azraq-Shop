/**
 * AZRAQ Shop — Standalone Production Node.js Server
 * 
 * Provider-independent HTTP server:
 * 1. GET /health — Lightweight health check without exposing sensitive secrets.
 * 2. API Endpoints (/api/*) — Products, Visual Search, Payments, Orders, Admin, DB.
 *    (All API endpoints return JSON; unknown API routes return 404 JSON, never HTML).
 * 3. Static Assets (/assets/*, /data/*, /branding/*, favicon, etc.) served from dist/.
 * 4. Missing Asset Protection — Missing JS, CSS, images, and JSON return 404, never HTML.
 * 5. SPA Fallback — Client-side HTML routes (/, /product/:slug, /collections, etc.) serve dist/index.html.
 * 6. Binds to process.env.HOST (0.0.0.0) and process.env.PORT.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handlePaymentRoutes } from './server/paymentRoutes.js';
import searchByImageHandler from './api/search-by-image.js';
import productsHandler from './api/products/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.resolve(__dirname, 'dist');
const START_TIME = Date.now();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const ASSET_EXTENSIONS = new Set(Object.keys(MIME_TYPES));

const server = http.createServer(async (req, res) => {
  // Polyfill helper methods for serverless API handlers
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      this.end(JSON.stringify(data));
      return this;
    };
  }

  // Cross-Origin Resource Sharing (CORS) Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization, x-admin-key');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost:' + PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  // =========================================================================
  // 1. Health-Check Endpoints (Safe, no sensitive secrets exposed)
  // =========================================================================
  if (req.method === 'GET' && (pathname === '/health' || pathname === '/api/health')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(JSON.stringify({
      status: 'ok',
      service: 'azraq-shop',
      version: '1.0.0',
      uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // =========================================================================
  // 2. Existing API Routes (/api/*) — Strictly JSON, never returns index.html
  // =========================================================================
  if (pathname.startsWith('/api/')) {
    // 2a. Standalone Single Product Lookup Endpoint
    if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
      try {
        await productsHandler(req, res);
      } catch (err) {
        console.error('[API Products Error]:', err.message);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ success: false, code: 'PRODUCTS_API_ERROR', error: err.message }));
        }
      }
      return;
    }

    // 2b. AI Visual Search Endpoint
    if (pathname === '/api/search-by-image') {
      try {
        await searchByImageHandler(req, res);
      } catch (err) {
        console.error('[API Visual Search Error]:', err.message);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ success: false, code: 'VISUAL_SEARCH_ERROR', error: err.message }));
        }
      }
      return;
    }

    // 2c. Paymently, Orders, Admin, and Tracking Endpoints
    try {
      const handled = await handlePaymentRoutes(req, res);
      if (handled) return;
    } catch (err) {
      console.error('[Server API Error]:', err.message);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ success: false, code: 'SERVER_API_ERROR', error: err.message }));
      }
      return;
    }

    // 2d. Unhandled API Routes: Explicit JSON 404 (NEVER fall through to index.html!)
    if (!res.headersSent) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        success: false,
        code: 'ENDPOINT_NOT_FOUND',
        error: `API route not found: ${pathname}`
      }));
    }
    return;
  }

  // =========================================================================
  // 3. Static Assets & Files from dist/
  // =========================================================================
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(DIST_DIR, relativePath);

  // Security: Prevent directory traversal attacks
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Forbidden');
    return;
  }

  // If the physical static file exists in dist/, stream it with appropriate headers
  if (fs.existsSync(filePath)) {
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);

        if (ext === '.html') {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (pathname.startsWith('/assets/')) {
          // Vite hashed bundles are immutable
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          // Other static resources (data records, icons, branding images)
          res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
        }
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    } catch (err) {
      console.warn(`[Static File Warning] ${pathname}:`, err.message);
    }
  }

  // =========================================================================
  // 4. Missing Static Asset Protection
  // =========================================================================
  // If the request has a known asset extension (.js, .css, .png, .json, etc.) OR
  // is under an asset path prefix (/assets/, /data/, /branding/), missing files
  // MUST return an explicit 404, NEVER index.html!
  const fileExt = path.extname(pathname).toLowerCase();
  const isAssetPath = 
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/data/') ||
    pathname.startsWith('/branding/') ||
    ASSET_EXTENSIONS.has(fileExt);

  if (isAssetPath) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Asset not found: ${pathname}`);
    return;
  }

  // =========================================================================
  // 5. SPA Fallback — Frontend Navigation Routes (/, /product/*, /collections, etc.)
  // =========================================================================
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    fs.createReadStream(indexPath).pipe(res);
    return;
  }

  // If dist/index.html is missing because the project hasn't been built yet
  res.statusCode = 503;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!DOCTYPE html><html><body><h1>AZRAQ Shop — Production Build Missing</h1><p>Please run <code>npm run build</code> first.</p></body></html>');
});

// Start listening on 0.0.0.0 and process.env.PORT
server.listen(PORT, HOST, () => {
  console.log(`[AZRAQ Shop Standalone Server] Listening on http://${HOST}:${PORT}`);
  console.log(`[AZRAQ Shop Standalone Server] Serving static build from: ${DIST_DIR}`);
});

export default server;
