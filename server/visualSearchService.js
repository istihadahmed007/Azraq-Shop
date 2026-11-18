import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  extractVisualFeaturesFromBuffer,
  hammingDistance,
  cosineSimilarity
} from './visualFeatureExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cached embeddings & category models
let embeddingsCache = null;
let categoryCentroids = {};
let categoryAspectRatios = {};
let categoryCounts = {};
let lastMtime = 0;

function loadEmbeddingsIndex() {
  const embeddingsPath = path.join(__dirname, '../src/data/product_embeddings.json');
  if (!fs.existsSync(embeddingsPath)) {
    console.warn(`[Visual Search Server] Embeddings file not found at ${embeddingsPath}`);
    return [];
  }

  const stat = fs.statSync(embeddingsPath);
  if (!embeddingsCache || stat.mtimeMs !== lastMtime) {
    try {
      const data = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
      embeddingsCache = data.embeddings || [];
      categoryCentroids = data.category_centroids || {};
      categoryAspectRatios = data.category_aspect_ratios || {};
      
      categoryCounts = {};
      embeddingsCache.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      });

      lastMtime = stat.mtimeMs;
      console.log(`[Visual Search Server] Loaded ${embeddingsCache.length} products (dim: ${data.dimensions || 256}, version: ${data.version || 'v2'}) into visual memory.`);
    } catch (err) {
      console.error('[Visual Search Server] Failed to parse embeddings file:', err.message);
      embeddingsCache = [];
    }
  }
  return embeddingsCache;
}

// Category Taxonomy Relationships (Sister categories for natural discovery without leakage)
const CATEGORY_TAXONOMY_GROUPS = {
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

/**
 * Predicts the most accurate category for an uploaded image.
 * 1. Checks for exact/near dHash catalog matches (distance <= 8).
 * 2. Uses category-canonical centroid similarity + normalized top-20 k-NN voting.
 */
export function predictProductCategory(queryFeatures, catalogEmbeddings) {
  // Step 1: Exact dHash catalog match check
  let closestDhash = 64;
  let exactMatchProduct = null;

  for (const item of catalogEmbeddings) {
    const dist = hammingDistance(queryFeatures.dhash, item.dhash);
    if (dist < closestDhash) {
      closestDhash = dist;
      exactMatchProduct = item;
    }
  }

  if (closestDhash <= 8 && exactMatchProduct) {
    const cat = exactMatchProduct.category;
    return {
      predictedCategory: cat,
      confidence: 0.98,
      allowedCategories: CATEGORY_TAXONOMY_GROUPS[cat] || [cat],
      exactCatalogMatch: exactMatchProduct
    };
  }

  // Step 2: Canonical Centroid & Normalized k-NN Classification
  const queryVector = queryFeatures.vector;

  // A. Canonical Centroid Cosine Similarity
  const centroidScores = {};
  for (const [category, centroid] of Object.entries(categoryCentroids)) {
    const canonical = CATEGORY_CANONICAL_MAP[category] || category;
    const sim = cosineSimilarity(queryVector, centroid);
    centroidScores[canonical] = Math.max(centroidScores[canonical] || 0, sim);
  }

  // B. Normalized k-NN Voting (top 20 nearest neighbors)
  const neighbors = catalogEmbeddings
    .map(p => ({
      category: p.category,
      canonical: CATEGORY_CANONICAL_MAP[p.category] || p.category,
      sim: cosineSimilarity(queryVector, p.vector)
    }))
    .sort((a, b) => b.sim - a.sim)
    .slice(0, 20);

  const neighborScores = {};
  neighbors.forEach((n, idx) => {
    const rankWeight = (20 - idx) / 20;
    const count = categoryCounts[n.canonical] || categoryCounts[n.category] || 1;
    const normWeight = 1 / Math.pow(count, 0.4);
    neighborScores[n.canonical] = (neighborScores[n.canonical] || 0) + n.sim * rankWeight * normWeight;
  });

  const combined = {};
  for (const [c, cent] of Object.entries(centroidScores)) {
    combined[c] = cent * 0.70 + (neighborScores[c] || 0) * 0.30;
  }

  const sortedCategories = Object.entries(combined).sort((a, b) => b[1] - a[1]);

  if (sortedCategories.length === 0) {
    return { predictedCategory: 'All', confidence: 0.0, allowedCategories: [] };
  }

  const topCategory = sortedCategories[0][0];
  const topScore = Math.max(0.01, sortedCategories[0][1]);
  const secondScore = sortedCategories[1] ? Math.max(0, sortedCategories[1][1]) : 0;
  const confidence = Math.min(0.99, +(topScore / (topScore + secondScore * 0.6)).toFixed(2));

  const allowedCategories = CATEGORY_TAXONOMY_GROUPS[topCategory] || [topCategory];

  return {
    predictedCategory: topCategory,
    confidence,
    allowedCategories,
    exactCatalogMatch: null
  };
}

/**
 * Main API Handler for Visual Product Search
 */
export async function searchProductsByImage({ imageBase64, mimeType = 'image/jpeg', filters = {} }) {
  const startTime = Date.now();

  if (!imageBase64) {
    throw new Error('Image data is required');
  }

  // Strip data URL prefix if present
  let cleanBase64 = imageBase64;
  if (imageBase64.includes('base64,')) {
    cleanBase64 = imageBase64.split('base64,')[1];
  }

  const buffer = Buffer.from(cleanBase64, 'base64');

  // Max 10MB validation
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('Image file size exceeds the 10 MB limit');
  }

  // 1. Extract genuine visual features from uploaded image
  const queryFeatures = await extractVisualFeaturesFromBuffer(buffer);
  const catalogEmbeddings = loadEmbeddingsIndex();

  if (!catalogEmbeddings || catalogEmbeddings.length === 0) {
    throw new Error('Product catalogue visual embeddings are not initialized.');
  }

  // 2. Predict Product Category & Restrict Candidate Pool
  const { predictedCategory, confidence, allowedCategories, exactCatalogMatch } = predictProductCategory(
    queryFeatures,
    catalogEmbeddings
  );

  let candidatePool = catalogEmbeddings;

  // If client explicitly selected a category filter
  if (filters.category && filters.category !== 'All') {
    candidatePool = candidatePool.filter(p => p.category === filters.category);
  } else if (allowedCategories && allowedCategories.length > 0) {
    // Restrict strictly to predicted category taxonomy to eliminate cross-category leakage
    candidatePool = candidatePool.filter(p => allowedCategories.includes(p.category));
  }

  // Apply optional price filters
  if (filters.maxPrice) {
    candidatePool = candidatePool.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.minPrice) {
    candidatePool = candidatePool.filter(p => p.price >= filters.minPrice);
  }

  // 3. Score Candidates with Genuine Visual Similarity & dHash Distance
  const scoredProducts = [];

  for (const item of candidatePool) {
    if (!item.vector || item.vector.length !== 256) continue;

    const dhashDist = hammingDistance(queryFeatures.dhash, item.dhash);
    const cosSim = cosineSimilarity(queryFeatures.vector, item.vector);

    let similarityPercent = 0;
    let matchType = 'similar';

    if (dhashDist <= 6) {
      // Exact duplicate or tight crop of product photography
      similarityPercent = Math.min(99, Math.round(96 + (6 - dhashDist) * 0.5));
      matchType = 'exact';
    } else if (dhashDist <= 12) {
      // Near-identical photograph / variant angle
      similarityPercent = Math.min(94, Math.round(86 + (12 - dhashDist) * 1.3));
      matchType = 'exact';
    } else {
      // Calibrated cosine similarity for zero-centered unit vectors
      const normalizedSim = (cosSim + 0.15) / 1.05;
      similarityPercent = Math.max(0, Math.min(85, Math.round(normalizedSim * 100)));
      if (similarityPercent >= 82) {
        matchType = 'similar';
      }
    }

    // Strict relevance threshold: products below 50% are discarded to prevent unrelated results
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

  // If there's an exactCatalogMatch from Step 1 and it's not already in scoredProducts, ensure it is added
  if (exactCatalogMatch && !scoredProducts.some(p => p.id === exactCatalogMatch.id)) {
    const dist = hammingDistance(queryFeatures.dhash, exactCatalogMatch.dhash);
    scoredProducts.unshift({
      id: exactCatalogMatch.id,
      sku: exactCatalogMatch.sku,
      name: exactCatalogMatch.name,
      category: exactCatalogMatch.category,
      category_id: exactCatalogMatch.category_id,
      price: exactCatalogMatch.price,
      main_image: exactCatalogMatch.main_image,
      images: exactCatalogMatch.images,
      similarity: 99,
      raw_similarity: 1.0,
      dhash_distance: dist,
      match_type: 'exact'
    });
  }

  // Sort descending by similarity, exact matches first
  scoredProducts.sort((a, b) => {
    if (a.match_type === 'exact' && b.match_type !== 'exact') return -1;
    if (b.match_type === 'exact' && a.match_type !== 'exact') return 1;
    return b.similarity - a.similarity;
  });

  // 4. Partition into Section A (Exact / Best Matches) and Section B (Similar Products)
  const bestMatches = scoredProducts.filter(p => p.match_type === 'exact' || p.similarity >= 80);
  const similarProducts = scoredProducts.filter(p => p.match_type !== 'exact' && p.similarity < 80);

  const durationMs = Date.now() - startTime;

  return {
    success: true,
    predicted_category: predictedCategory,
    category_confidence: confidence,
    total_candidates: scoredProducts.length,
    search_duration_ms: durationMs,
    extracted_features: {
      dominant_color: queryFeatures.dominantColor,
      raw_aspect_ratio: queryFeatures.rawAspectRatio,
      fg_aspect_ratio: queryFeatures.fgAspectRatio,
      detected_intensity: queryFeatures.detectedIntensity,
      dimensions_analyzed: 256
    },
    sections: {
      best_matches: bestMatches.slice(0, 12),
      similar_products: similarProducts.slice(0, 24)
    },
    no_matches: scoredProducts.length === 0
  };
}
