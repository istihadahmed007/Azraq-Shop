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
