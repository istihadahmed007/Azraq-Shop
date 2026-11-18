/**
 * AZRAQ Shop — Product Utilities & Deterministic URL Slugs
 * Provides stable slug generation, URL parsing, and image normalization.
 */

/**
 * Generates a clean, deterministic, SEO-friendly slug for any product.
 * Format: {sanitized-name}-{product-id}
 * Example: "premium-printed-co-ord-set-azq-0028"
 */
export function generateProductSlug(product) {
  if (!product) return '';
  
  const idStr = String(product.id || '').toLowerCase().trim();
  const rawName = String(product.name || '').trim();

  // Clean title: remove emojis, special characters, normalize spaces
  let cleanName = rawName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
    .replace(/[^\w\s-]/g, ' ')       // replace symbols/emojis with space
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/-+/g, '-');          // collapse repeated hyphens

  // If cleanName is empty (e.g. Pure Bengali / emoji title), use a clean fallback
  if (!cleanName || cleanName.length < 2) {
    const categorySlug = (product.category || product.primary_collection_name || 'item')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    cleanName = `${categorySlug}-product`;
  }

  // Truncate long slugs to keep URLs readable
  if (cleanName.length > 50) {
    cleanName = cleanName.slice(0, 50).replace(/-+$/, '');
  }

  return `${cleanName}-${idStr}`;
}

/**
 * Extracts product ID and locates the matching product in the catalog.
 * Supports:
 * 1. Direct ID matching (e.g., "AZQ-0028")
 * 2. Slugs ending with product ID (e.g., "premium-co-ord-set-azq-0028")
 * 3. Exact slug match
 */
export function findProductBySlug(slugOrId, products = []) {
  if (!slugOrId || !Array.isArray(products) || products.length === 0) return null;

  const target = String(slugOrId).trim().toLowerCase();

  // 1. Direct product ID match (e.g., 'azq-0028' or '1206')
  const directMatch = products.find(p => String(p.id).toLowerCase() === target);
  if (directMatch) return directMatch;

  // 2. Extract AZQ ID pattern from slug ending: /-(azq-\w+)/i or /-(\d+)$/i
  const azqMatch = target.match(/(azq-[a-z0-9_-]+)$/i) || target.match(/(azq-[0-9]+)/i);
  if (azqMatch) {
    const extractedId = azqMatch[1].toLowerCase();
    const foundById = products.find(p => String(p.id).toLowerCase() === extractedId);
    if (foundById) return foundById;
  }

  // 3. Match against computed product slug
  const foundBySlug = products.find(p => {
    const computedSlug = generateProductSlug(p);
    return computedSlug === target;
  });
  if (foundBySlug) return foundBySlug;

  // 4. Match against SKU or easydrop_id
  const foundBySku = products.find(p => 
    (p.sku && String(p.sku).toLowerCase() === target) ||
    (p.easydrop_id && String(p.easydrop_id) === target)
  );

  return foundBySku || null;
}

/**
 * Normalizes product images into a clean, validated array of unique URLs.
 * Eliminates duplicates, places verified main_image first, and removes invalid/generic dummy URLs.
 */
export function normalizeProductImages(product) {
  if (!product) return [];

  const candidateUrls = [];

  // Main image first
  if (typeof product.main_image === 'string' && product.main_image.trim()) {
    candidateUrls.push(product.main_image.trim());
  }

  // Secondary images from gallery
  if (Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (typeof img === 'string' && img.trim()) {
        candidateUrls.push(img.trim());
      }
    });
  }

  // Filter and deduplicate
  const seen = new Set();
  const normalized = [];

  for (const url of candidateUrls) {
    // Validate protocol
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      continue;
    }
    // Filter common generic dummies if accidentally attached
    if (url.includes('placeholder.com') || url.includes('via.placeholder')) {
      continue;
    }

    if (!seen.has(url)) {
      seen.add(url);
      normalized.push(url);
    }
  }

  return normalized;
}

/**
 * Extracts product ID from slug or direct ID string.
 * Supports patterns like "AZQ-0028", "azq-0028", "name-azq-0028", etc.
 */
export function extractProductIdFromSlug(slugOrId) {
  if (!slugOrId) return null;
  const target = String(slugOrId).trim();
  if (/^azq-[a-z0-9_-]+$/i.test(target)) {
    return target.toUpperCase();
  }
  const match = target.match(/(azq-[a-z0-9_-]+)$/i) || target.match(/(azq-[0-9]+)/i);
  if (match) {
    return match[1].toUpperCase();
  }
  return null;
}

// In-flight request deduplication cache to prevent duplicate network requests
const inFlightRequests = new Map();

/**
 * Safely parses response as JSON, preventing SyntaxErrors when non-JSON is received.
 */
async function safeParseResponse(res) {
  try {
    if (typeof res.json === 'function' && typeof res.text !== 'function') {
      return await res.json();
    }
    const contentType = res.headers && typeof res.headers.get === 'function' ? (res.headers.get('content-type') || '') : '';
    if (typeof res.text === 'function') {
      const text = await res.text();
      if (contentType && !contentType.includes('json') && text.trim().startsWith('<')) {
        return null;
      }
      return JSON.parse(text);
    }
    if (typeof res.json === 'function') {
      return await res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Fetches a single product record directly without needing the full monolithic catalog.
 * Resolution chain:
 * 1. Fast static lookup: /data/products/{ID}.json (~2.7 KB)
 * 2. Dedicated API lookup: /api/products?id={ID} or ?slug={SLUG}
 * 3. Graceful timeout, request deduplication, and safe error classification.
 */
export async function fetchSingleProduct(slugOrId, options = {}) {
  const { signal, timeoutMs = 8000, baseUrl = '' } = options;
  if (!slugOrId) {
    return { product: null, isNotFound: true, isError: false, isServerError: false, isNetworkError: false, error: null };
  }

  const cacheKey = `${baseUrl}:${String(slugOrId).trim().toLowerCase()}`;
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey);
  }

  const fetchPromise = (async () => {
    const extractedId = extractProductIdFromSlug(slugOrId);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    if (signal) {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener('abort', () => controller.abort(), { once: true });
      }
    }

    try {
      // 1. Try static standalone record first if ID is recognized
      if (extractedId) {
        try {
          const staticUrl = `${baseUrl}/data/products/${extractedId}.json`;
          const res = await fetch(staticUrl, { signal: controller.signal });
          if (res.ok) {
            const product = await safeParseResponse(res);
            if (product && product.id) {
              clearTimeout(timeoutId);
              return { 
                product, 
                isNotFound: false, 
                isError: false, 
                isServerError: false, 
                isNetworkError: false, 
                error: null 
              };
            }
          }
        } catch (err) {
          if (err.name === 'AbortError' && signal?.aborted) throw err;
          // Continue to API fallback on static fetch issue
        }
      }

      // 2. Fallback to server API endpoint (/api/products?id=... or ?slug=...)
      const param = extractedId 
        ? `id=${encodeURIComponent(extractedId)}` 
        : `slug=${encodeURIComponent(slugOrId)}`;
      const apiUrl = `${baseUrl}/api/products?${param}`;

      const apiRes = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (apiRes.ok) {
        const data = await safeParseResponse(apiRes);
        if (data && data.product) {
          return { 
            product: data.product, 
            isNotFound: false, 
            isError: false, 
            isServerError: false, 
            isNetworkError: false, 
            error: null 
          };
        }
      } else if (apiRes.status === 404) {
        return { 
          product: null, 
          isNotFound: true, 
          isError: false, 
          isServerError: false, 
          isNetworkError: false, 
          error: 'Product not found' 
        };
      }

      const isServer = apiRes.status >= 500;
      return {
        product: null,
        isNotFound: apiRes.status === 404,
        isError: true,
        isServerError: isServer,
        isNetworkError: false,
        error: `Server responded with status ${apiRes.status}`
      };
    } catch (err) {
      clearTimeout(timeoutId);
      const isTimeout = err.name === 'AbortError' && !signal?.aborted;
      return {
        product: null,
        isNotFound: false,
        isError: true,
        isServerError: false,
        isNetworkError: true,
        isTimeout,
        error: isTimeout ? 'Product loading timed out' : (err.message || 'Network connection failed')
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, fetchPromise);
  return fetchPromise;
}
