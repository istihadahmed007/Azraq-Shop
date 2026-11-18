/**
 * Client Visual Search Service
 * Hybrid Architecture:
 * 1. Attempts backend API POST /api/search-by-image (Node server / PHP Apache)
 * 2. If the backend returns 404 or is unavailable (e.g. Hostinger static deploy, GitHub Pages, or offline),
 *    seamlessly runs the in-browser 256-D visual recognition engine with identical category taxonomy rules.
 */

let cachedClientEmbeddings = null;
let cachedCentroids = null;
let cachedAspectRatios = null;

async function loadClientCatalogEmbeddings() {
  if (cachedClientEmbeddings && cachedClientEmbeddings.length > 0) {
    return {
      embeddings: cachedClientEmbeddings,
      centroids: cachedCentroids,
      aspectRatios: cachedAspectRatios
    };
  }

  // 1. Try Vite dynamic module import first (100% reliable across any origin, port, base path)
  try {
    const mod = await import('../data/product_embeddings.json');
    const data = mod.default || mod;
    if (data && Array.isArray(data.embeddings) && data.embeddings.length > 0) {
      cachedClientEmbeddings = data.embeddings;
      cachedCentroids = data.category_centroids || {};
      cachedAspectRatios = data.category_aspect_ratios || {};
      return {
        embeddings: cachedClientEmbeddings,
        centroids: cachedCentroids,
        aspectRatios: cachedAspectRatios
      };
    }
  } catch (err) {
    // Dynamic import failed, continue to fetch fallback
  }

  const possibleUrls = [
    './data/product_embeddings.json',
    '/data/product_embeddings.json',
    '../data/product_embeddings.json'
  ];

  for (const url of possibleUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.embeddings) && data.embeddings.length > 0) {
          cachedClientEmbeddings = data.embeddings;
          cachedCentroids = data.category_centroids || {};
          cachedAspectRatios = data.category_aspect_ratios || {};
          return {
            embeddings: cachedClientEmbeddings,
            centroids: cachedCentroids,
            aspectRatios: cachedAspectRatios
          };
        }
      }
    } catch (e) {
      // Try next URL
    }
  }

  throw new Error('Product catalogue embeddings could not be loaded.');
}

// Taxonomy boundary definitions to prevent cross-category leakage
const TAXONOMY_GROUPS = {
  'Men Clothing': ['Men Clothing', 'Drop Shoulder T-Shirt', 'Winter Collection'],
  'Drop Shoulder T-Shirt': ['Drop Shoulder T-Shirt', 'Men Clothing'],
  'Winter Collection': ['Winter Collection', 'Men Clothing'],
  'Sunglass Collection': ['Sunglass Collection', 'Men Accessories'],
  'Men Accessories': ['Men Accessories', 'Sunglass Collection', 'Jewelries & Accessories'],
  'Kitchen Appliances': ['Kitchen Appliances', 'Home & Lifestyle'],
  'Home & Lifestyle': ['Home & Lifestyle', 'Kitchen Appliances'],
  'Gadgets & IT Accessories': ['Gadgets & IT Accessories', 'Consumer Electronics'],
  'Consumer Electronics': ['Consumer Electronics', 'Gadgets & IT Accessories'],
  'Jewelries & Accessories': ['Jewelries & Accessories', 'Men Accessories'],
  'Health & Beauty': ['Health & Beauty', 'Personal Wellness', 'Soap & Fragrance'],
  'Personal Wellness': ['Personal Wellness', 'Health & Beauty'],
  'Soap & Fragrance': ['Soap & Fragrance', 'Health & Beauty'],
  'Sports & Kids': ['Sports & Kids', 'Baby & Mom'],
  'Baby & Mom': ['Baby & Mom', 'Sports & Kids'],
  'Couple Combo': ['Couple Combo', 'Gifts', 'Jewelries & Accessories'],
  'Gifts': ['Gifts', 'Couple Combo']
};

// Canonical Category Mapping (Maps micro-categories to root department models to prevent overfitting)
const CATEGORY_CANONICAL_MAP = {
  'Drop Shoulder T-Shirt': 'Men Clothing',
  'Winter Collection': 'Men Clothing',
  'Men Clothing': 'Men Clothing',
  'Sunglass Collection': 'Men Accessories',
  'Men Accessories': 'Men Accessories',
  'Kitchen Appliances': 'Kitchen Appliances',
  'Home & Lifestyle': 'Home & Lifestyle',
  'Gadgets & IT Accessories': 'Gadgets & IT Accessories',
  'Consumer Electronics': 'Gadgets & IT Accessories',
  'Jewelries & Accessories': 'Jewelries & Accessories',
  'Health & Beauty': 'Health & Beauty',
  'Personal Wellness': 'Health & Beauty',
  'Soap & Fragrance': 'Health & Beauty',
  'Sports & Kids': 'Sports & Kids',
  'Baby & Mom': 'Baby & Mom',
  'Couple Combo': 'Couple Combo',
  'Gifts': 'Gifts'
};

function hammingDistance(hex1, hex2) {
  if (!hex1 || !hex2 || hex1.length !== 16 || hex2.length !== 16) return 64;
  let dist = 0;
  for (let i = 0; i < 16; i++) {
    const v1 = parseInt(hex1[i], 16);
    const v2 = parseInt(hex2[i], 16);
    let xor = v1 ^ v2;
    while (xor > 0) {
      dist += xor & 1;
      xor >>= 1;
    }
  }
  return dist;
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

/**
 * Extracts 256-D visual features and 64-bit dHash from an HTMLImageElement using Canvas
 */
async function extractFeaturesInBrowser(imgElement) {
  const targetSize = 64;

  // 1. Draw 64x64 canvas for spatial HOG, mass, texture, and HSV
  const canvas64 = document.createElement('canvas');
  canvas64.width = targetSize;
  canvas64.height = targetSize;
  const ctx64 = canvas64.getContext('2d', { willReadFrequently: true });
  ctx64.drawImage(imgElement, 0, 0, targetSize, targetSize);
  const rgba64 = ctx64.getImageData(0, 0, targetSize, targetSize).data;

  // 2. Draw 9x8 canvas for 64-bit dHash
  const canvas9x8 = document.createElement('canvas');
  canvas9x8.width = 9;
  canvas9x8.height = 8;
  const ctx9x8 = canvas9x8.getContext('2d', { willReadFrequently: true });
  ctx9x8.drawImage(imgElement, 0, 0, 9, 8);
  const data9x8 = ctx9x8.getImageData(0, 0, 9, 8).data;

  // Compute 64-bit dHash
  let dhashBits = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const idxLeft = (y * 9 + x) * 4;
      const idxRight = (y * 9 + (x + 1)) * 4;
      const lumaLeft = 0.299 * data9x8[idxLeft] + 0.587 * data9x8[idxLeft + 1] + 0.114 * data9x8[idxLeft + 2];
      const lumaRight = 0.299 * data9x8[idxRight] + 0.587 * data9x8[idxRight + 1] + 0.114 * data9x8[idxRight + 2];
      dhashBits += (lumaLeft > lumaRight) ? '1' : '0';
    }
  }
  let dhash = '';
  for (let i = 0; i < 64; i += 4) {
    dhash += parseInt(dhashBits.slice(i, i + 4), 2).toString(16);
  }

  // Compute 64x64 Grayscale & Foreground Mask
  const gray64 = new Float32Array(targetSize * targetSize);
  let minX = targetSize, maxX = 0, minY = targetSize, maxY = 0;
  let fgPixels = 0;
  let rAcc = 0, gAcc = 0, bAcc = 0, colorCount = 0;

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const idx = (y * targetSize + x) * 4;
      const r = rgba64[idx];
      const g = rgba64[idx + 1];
      const b = rgba64[idx + 2];
      const a = rgba64[idx + 3];

      const outIdx = y * targetSize + x;
      gray64[outIdx] = 0.299 * r + 0.587 * g + 0.114 * b;

      const isBg = (a < 50) || (r > 240 && g > 240 && b > 240);
      if (!isBg) {
        fgPixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        rAcc += r;
        gAcc += g;
        bAcc += b;
        colorCount++;
      }
    }
  }

  const origWidth = imgElement.naturalWidth || imgElement.width || 64;
  const origHeight = imgElement.naturalHeight || imgElement.height || 64;
  const rawAspectRatio = +(origWidth / Math.max(1, origHeight)).toFixed(3);
  const fgWidth = Math.max(1, (maxX >= minX ? maxX - minX : targetSize));
  const fgHeight = Math.max(1, (maxY >= minY ? maxY - minY : targetSize));
  const fgAspectRatio = +(fgWidth / fgHeight).toFixed(3);
  const fillFactor = +(fgPixels / (targetSize * targetSize)).toFixed(3);

  const denom = colorCount || (targetSize * targetSize);
  const domR = Math.min(255, Math.floor(rAcc / denom)).toString(16).padStart(2, '0');
  const domG = Math.min(255, Math.floor(gAcc / denom)).toString(16).padStart(2, '0');
  const domB = Math.min(255, Math.floor(bAcc / denom)).toString(16).padStart(2, '0');
  const dominantColor = `#${domR}${domG}${domB}`;

  // Multi-scale Spatial HOG (4x4 blocks x 8 gradient directions = 128 features)
  const hog = new Float32Array(128);
  const blockSize = 16;
  for (let by = 0; by < 4; by++) {
    for (let bx = 0; bx < 4; bx++) {
      const blockIdx = (by * 4 + bx) * 8;
      for (let py = 1; py < blockSize - 1; py++) {
        const y = by * blockSize + py;
        for (let px = 1; px < blockSize - 1; px++) {
          const x = bx * blockSize + px;
          const idx = y * targetSize + x;
          const gx = gray64[idx + 1] - gray64[idx - 1];
          const gy = gray64[idx + targetSize] - gray64[idx - targetSize];
          const mag = Math.sqrt(gx * gx + gy * gy);
          if (mag > 0.001) {
            let angle = Math.atan2(gy, gx);
            if (angle < 0) angle += Math.PI;
            const bin = Math.min(7, Math.floor((angle / Math.PI) * 8));
            hog[blockIdx + bin] += mag;
          }
        }
      }
    }
  }

  for (let b = 0; b < 16; b++) {
    let bNorm = 0;
    for (let bin = 0; bin < 8; bin++) {
      const val = hog[b * 8 + bin];
      bNorm += val * val;
    }
    bNorm = Math.sqrt(bNorm) || 1;
    for (let bin = 0; bin < 8; bin++) {
      hog[b * 8 + bin] /= bNorm;
    }
  }

  // Spatial Mass Grid (8x8 = 64 features)
  const spatialMass = new Float32Array(64);
  const sCell = 8;
  for (let cy = 0; cy < 8; cy++) {
    for (let cx = 0; cx < 8; cx++) {
      let sum = 0;
      for (let py = 0; py < sCell; py++) {
        for (let px = 0; px < sCell; px++) {
          sum += gray64[(cy * sCell + py) * targetSize + (cx * sCell + px)];
        }
      }
      spatialMass[cy * 8 + cx] = sum / (sCell * sCell * 255);
    }
  }

  // Texture roughness (16 features)
  const texture = new Float32Array(16);
  for (let cy = 0; cy < 4; cy++) {
    for (let cx = 0; cx < 4; cx++) {
      let lapSum = 0;
      for (let py = 1; py < blockSize - 1; py++) {
        const y = cy * blockSize + py;
        for (let px = 1; px < blockSize - 1; px++) {
          const x = cx * blockSize + px;
          const idx = y * targetSize + x;
          const lap = Math.abs(
            4 * gray64[idx] -
            gray64[idx - 1] -
            gray64[idx + 1] -
            gray64[idx - targetSize] -
            gray64[idx + targetSize]
          );
          lapSum += lap;
        }
      }
      texture[cy * 4 + cx] = lapSum / (blockSize * blockSize * 255);
    }
  }

  // HSV (32 features)
  const hsv = new Float32Array(32);
  let hsvCount = 0;
  for (let i = 0; i < targetSize * targetSize; i++) {
    const r = rgba64[i * 4] / 255;
    const g = rgba64[i * 4 + 1] / 255;
    const b = rgba64[i * 4 + 2] / 255;
    const a = rgba64[i * 4 + 3] / 255;

    if (a < 0.2 || (r > 0.95 && g > 0.95 && b > 0.95)) continue;
    hsvCount++;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let h = 0;
    if (delta > 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h = (h * 60 + 360) % 360;
    }
    const s = max === 0 ? 0 : delta / max;
    const v = max;

    hsv[Math.min(15, Math.floor((h / 360) * 16))]++;
    hsv[16 + Math.min(7, Math.floor(s * 8))]++;
    hsv[24 + Math.min(7, Math.floor(v * 8))]++;
  }
  const hsvNorm = hsvCount || 1;
  for (let i = 0; i < 32; i++) hsv[i] /= hsvNorm;

  // Geometry (16 features)
  const geom = new Float32Array(16);
  geom[0] = Math.min(3, rawAspectRatio) / 3;
  geom[1] = Math.min(3, fgAspectRatio) / 3;
  geom[2] = fillFactor;
  geom[3] = fgWidth / targetSize;
  geom[4] = fgHeight / targetSize;
  geom[5] = (minX + maxX) / (2 * targetSize);
  geom[6] = (minY + maxY) / (2 * targetSize);

  // Assemble full 256-D vector
  const rawVector = new Float32Array(256);
  rawVector.set(hog, 0);
  rawVector.set(spatialMass, 128);
  rawVector.set(texture, 192);
  rawVector.set(hsv, 208);
  rawVector.set(geom, 240);

  // Mean-centering and L2 normalization
  let mean = 0;
  for (let i = 0; i < 256; i++) mean += rawVector[i];
  mean /= 256;

  const normalizedVector = new Float32Array(256);
  let norm = 0;
  for (let i = 0; i < 256; i++) {
    normalizedVector[i] = rawVector[i] - mean;
    norm += normalizedVector[i] * normalizedVector[i];
  }
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < 256; i++) {
    normalizedVector[i] /= norm;
  }

  return {
    vector: Array.from(normalizedVector),
    dhash,
    dominantColor,
    rawAspectRatio,
    fgAspectRatio,
    fillFactor
  };
}

/**
 * High-Precision In-Browser Search Engine
 * Runs completely locally with zero network reliance when backend API is unavailable.
 */
async function runInBrowserSearch({ imageBase64, filters = {} }) {
  const startTime = Date.now();
  const { embeddings, centroids, aspectRatios } = await loadClientCatalogEmbeddings();

  // Load image into DOM element
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Failed to load image for visual analysis.'));
    img.src = imageBase64;
  });

  const queryFeatures = await extractFeaturesInBrowser(img);

  // Step 1: Exact dHash catalog match check
  let closestDhash = 64;
  let exactMatchProduct = null;

  for (const item of embeddings) {
    const dist = hammingDistance(queryFeatures.dhash, item.dhash);
    if (dist < closestDhash) {
      closestDhash = dist;
      exactMatchProduct = item;
    }
  }

  let predictedCategory = 'All';
  let allowedCategories = [];
  let confidence = 0.90;

  if (closestDhash <= 8 && exactMatchProduct) {
    predictedCategory = exactMatchProduct.category;
    confidence = 0.98;
    allowedCategories = TAXONOMY_GROUPS[predictedCategory] || [predictedCategory];
  } else {
    // Step 2: Canonical Centroid and Normalized k-NN classification
    const queryVector = queryFeatures.vector;

    // A. Canonical Centroid Cosine Similarity
    const centroidScores = {};
    for (const [category, centroid] of Object.entries(centroids)) {
      const canonical = CATEGORY_CANONICAL_MAP[category] || category;
      const sim = cosineSimilarity(queryVector, centroid);
      centroidScores[canonical] = Math.max(centroidScores[canonical] || 0, sim);
    }

    // B. Normalized k-NN Voting (top 20 nearest neighbors)
    const neighbors = embeddings
      .map(p => ({
        category: p.category,
        canonical: CATEGORY_CANONICAL_MAP[p.category] || p.category,
        sim: cosineSimilarity(queryVector, p.vector)
      }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 20);

    const catCounts = {};
    embeddings.forEach(p => {
      const c = CATEGORY_CANONICAL_MAP[p.category] || p.category;
      catCounts[c] = (catCounts[c] || 0) + 1;
    });

    const neighborScores = {};
    neighbors.forEach((n, idx) => {
      const rankWeight = (20 - idx) / 20;
      const count = catCounts[n.canonical] || 1;
      const normWeight = 1 / Math.pow(count, 0.4);
      neighborScores[n.canonical] = (neighborScores[n.canonical] || 0) + n.sim * rankWeight * normWeight;
    });

    const combined = {};
    for (const [c, cent] of Object.entries(centroidScores)) {
      combined[c] = cent * 0.70 + (neighborScores[c] || 0) * 0.30;
    }

    const sortedCats = Object.entries(combined).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0) {
      predictedCategory = sortedCats[0][0];
      const topScore = Math.max(0.01, sortedCats[0][1]);
      const secondScore = sortedCats[1] ? Math.max(0, sortedCats[1][1]) : 0;
      confidence = Math.min(0.99, +(topScore / (topScore + secondScore * 0.6)).toFixed(2));
      allowedCategories = TAXONOMY_GROUPS[predictedCategory] || [predictedCategory];
    }
  }

  let candidatePool = embeddings;
  if (filters.category && filters.category !== 'All') {
    candidatePool = candidatePool.filter(p => p.category === filters.category);
  } else if (allowedCategories && allowedCategories.length > 0) {
    candidatePool = candidatePool.filter(p => allowedCategories.includes(p.category));
  }

  if (filters.maxPrice) candidatePool = candidatePool.filter(p => p.price <= filters.maxPrice);
  if (filters.minPrice) candidatePool = candidatePool.filter(p => p.price >= filters.minPrice);

  const scoredProducts = [];

  for (const item of candidatePool) {
    if (!item.vector || item.vector.length !== 256) continue;

    const dhashDist = hammingDistance(queryFeatures.dhash, item.dhash);
    const cosSim = cosineSimilarity(queryFeatures.vector, item.vector);

    let similarityPercent = 0;
    let matchType = 'similar';

    if (dhashDist <= 6) {
      similarityPercent = Math.min(99, Math.round(96 + (6 - dhashDist) * 0.5));
      matchType = 'exact';
    } else if (dhashDist <= 12) {
      similarityPercent = Math.min(94, Math.round(86 + (12 - dhashDist) * 1.3));
      matchType = 'exact';
    } else {
      const normalizedSim = (cosSim + 0.15) / 1.05;
      similarityPercent = Math.max(0, Math.min(85, Math.round(normalizedSim * 100)));
    }

    if (similarityPercent >= 50) {
      scoredProducts.push({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        category_id: item.category_id,
        price: item.price,
        main_image: item.main_image,
        images: item.images,
        similarity: similarityPercent,
        raw_similarity: +cosSim.toFixed(4),
        dhash_distance: dhashDist,
        match_type: matchType
      });
    }
  }

  if (exactMatchProduct && !scoredProducts.some(p => p.id === exactMatchProduct.id)) {
    scoredProducts.unshift({
      id: exactMatchProduct.id,
      sku: exactMatchProduct.sku,
      name: exactMatchProduct.name,
      category: exactMatchProduct.category,
      category_id: exactMatchProduct.category_id,
      price: exactMatchProduct.price,
      main_image: exactMatchProduct.main_image,
      images: exactMatchProduct.images,
      similarity: 99,
      raw_similarity: 1.0,
      dhash_distance: closestDhash,
      match_type: 'exact'
    });
  }

  scoredProducts.sort((a, b) => {
    if (a.match_type === 'exact' && b.match_type !== 'exact') return -1;
    if (b.match_type === 'exact' && a.match_type !== 'exact') return 1;
    return b.similarity - a.similarity;
  });

  const bestMatches = scoredProducts.filter(p => p.match_type === 'exact' || p.similarity >= 80);
  const similarProducts = scoredProducts.filter(p => p.match_type !== 'exact' && p.similarity < 80);

  return {
    success: true,
    predicted_category: predictedCategory,
    category_confidence: confidence,
    total_candidates: scoredProducts.length,
    search_duration_ms: Date.now() - startTime,
    extracted_features: {
      dominant_color: queryFeatures.dominantColor,
      raw_aspect_ratio: queryFeatures.rawAspectRatio,
      dimensions_analyzed: 256
    },
    sections: {
      best_matches: bestMatches.slice(0, 12),
      similar_products: similarProducts.slice(0, 24)
    },
    no_matches: scoredProducts.length === 0
  };
}

/**
 * Public Visual Search Entrypoint
 */
export async function performVisualSearch({ imageBase64, mimeType = 'image/jpeg', filters = {} }) {
  if (!imageBase64) {
    throw new Error('Please select or capture a photo first.');
  }

  // 1. Attempt Serverless / Backend API Endpoint
  try {
    const response = await fetch('/api/search-by-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        filters
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.success) {
        return data;
      }
    }
  } catch (netErr) {
    // Network/404 fallback
  }

  // 2. Seamlessly execute in-browser 256-D vector engine if server endpoint is 404 or offline
  try {
    return await runInBrowserSearch({ imageBase64, filters });
  } catch (browserErr) {
    console.error('[Visual Search Failure]:', browserErr);
    throw new Error(
      browserErr.message || 'Visual search could not process this image. Please try again or search by keyword.'
    );
  }
}
