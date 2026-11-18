/**
 * AZRAQ Shop — Standalone Product Retrieval API
 * Supports direct product resolution via query param: /api/products?id=AZQ-0028 or /api/products?slug=...
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory catalog cache for sub-millisecond response times
let cachedProducts = null;
let cachedMap = null;

function getCatalogMap() {
  if (cachedMap) return cachedMap;
  try {
    const candidates = [
      path.resolve(__dirname, '../../src/data/central_products.json'),
      path.resolve(__dirname, '../../public/data/central_products.json'),
      path.resolve(process.cwd(), 'src/data/central_products.json'),
      path.resolve(process.cwd(), 'public/data/central_products.json')
    ];

    for (const catalogPath of candidates) {
      if (fs.existsSync(catalogPath)) {
        const data = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        cachedProducts = data.products || [];
        cachedMap = new Map();
        for (const p of cachedProducts) {
          if (p.id) cachedMap.set(String(p.id).toUpperCase(), p);
        }
        return cachedMap;
      }
    }
  } catch (err) {
    console.error('[API Products Error] Failed to load catalog map:', err.message);
  }
  return new Map();
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const idQuery = (url.searchParams.get('id') || '').trim();
  const slugQuery = (url.searchParams.get('slug') || '').trim();

  const map = getCatalogMap();

  let targetId = null;
  if (idQuery) {
    targetId = idQuery.toUpperCase();
  } else if (slugQuery) {
    const match = slugQuery.match(/(azq-[a-z0-9_-]+)$/i) || slugQuery.match(/(azq-[0-9]+)/i);
    if (match) targetId = match[1].toUpperCase();
    else targetId = slugQuery.toUpperCase();
  }

  if (!targetId) {
    return res.status(400).json({ success: false, error: 'Product id or slug parameter required' });
  }

  const product = map.get(targetId);
  if (!product) {
    return res.status(404).json({
      success: false,
      code: 'PRODUCT_NOT_FOUND',
      error: `Product with reference ${targetId} not found in catalog`
    });
  }

  // Set cache headers (public cache 1 hour, stale-while-revalidate 1 day)
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
  return res.status(200).json({
    success: true,
    product
  });
}
