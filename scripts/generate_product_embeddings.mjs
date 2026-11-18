import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractVisualFeaturesFromBuffer } from '../server/visualFeatureExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const centralProductsPath = path.join(__dirname, '../src/data/central_products.json');
const outputPathSrc = path.join(__dirname, '../src/data/product_embeddings.json');
const outputPathPub = path.join(__dirname, '../public/data/product_embeddings.json');
const cacheDir = path.join(__dirname, '../.cache');
const cacheFilePath = path.join(cacheDir, 'image_features_cache_v2.json');

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

let featureCache = {};
if (fs.existsSync(cacheFilePath)) {
  try {
    featureCache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
    console.log(`[Index Generator] Loaded ${Object.keys(featureCache).length} cached product feature records.`);
  } catch (e) {
    console.warn('[Index Generator] Could not parse cache, starting fresh.');
  }
}

async function fetchImageBuffer(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processProduct(product) {
  const cacheKey = `${product.id}_${product.main_image}`;
  if (featureCache[cacheKey]) {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      category_id: product.category_id || product.primary_collection_id || 1,
      price: product.price,
      main_image: product.main_image,
      images: product.images || [product.main_image],
      ...featureCache[cacheKey]
    };
  }

  // Fetch and decode main image
  let buffer = null;
  try {
    buffer = await fetchImageBuffer(product.main_image);
  } catch (err) {
    // If main image failed, try alternative gallery images
    if (product.images && product.images.length > 1) {
      for (const altUrl of product.images) {
        if (altUrl !== product.main_image) {
          try {
            buffer = await fetchImageBuffer(altUrl);
            break;
          } catch (e) {}
        }
      }
    }
  }

  if (!buffer) {
    throw new Error(`Failed to download image for ${product.id}`);
  }

  const features = await extractVisualFeaturesFromBuffer(buffer);

  const cachedData = {
    vector: features.vector,
    dhash: features.dhash,
    dominant_color: features.dominantColor,
    raw_aspect_ratio: features.rawAspectRatio,
    fg_aspect_ratio: features.fgAspectRatio,
    fill_factor: features.fillFactor,
    detected_intensity: features.detectedIntensity
  };

  featureCache[cacheKey] = cachedData;

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    category_id: product.category_id || product.primary_collection_id || 1,
    price: product.price,
    main_image: product.main_image,
    images: product.images || [product.main_image],
    ...cachedData
  };
}

async function main() {
  const startTime = Date.now();
  const rawCatalog = fs.readFileSync(centralProductsPath, 'utf8');
  const { products } = JSON.parse(rawCatalog);

  console.log(`[Index Generator] Starting visual index build for ${products.length} products...`);

  const results = [];
  const batchSize = 16;
  let successes = 0;
  let failures = 0;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchPromises = batch.map(async (prod) => {
      try {
        const item = await processProduct(prod);
        successes++;
        return item;
      } catch (err) {
        failures++;
        // Fallback placeholder record if download completely failed
        return {
          id: prod.id,
          sku: prod.sku,
          name: prod.name,
          category: prod.category,
          category_id: prod.category_id || prod.primary_collection_id || 1,
          price: prod.price,
          main_image: prod.main_image,
          images: prod.images || [prod.main_image],
          vector: new Array(256).fill(0),
          dhash: '0000000000000000',
          dominant_color: '#0877C9',
          raw_aspect_ratio: 1.0,
          fg_aspect_ratio: 1.0,
          fill_factor: 0.5,
          detected_intensity: 0.5
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    if ((i + batchSize) % 80 === 0 || i + batchSize >= products.length) {
      console.log(`[Index Generator] Processed ${Math.min(i + batchSize, products.length)} / ${products.length} products (${successes} succeeded, ${failures} failed)...`);
      // Save cache checkpoint
      fs.writeFileSync(cacheFilePath, JSON.stringify(featureCache), 'utf8');
    }
  }

  // Calculate category centroid models and taxonomy signatures
  const categoryCentroids = {};
  const categoryAspectRatios = {};
  const catGroups = {};

  results.forEach(item => {
    if (!item.vector || item.vector.every(v => v === 0)) return;
    if (!catGroups[item.category]) catGroups[item.category] = [];
    catGroups[item.category].push(item);
  });

  for (const [category, items] of Object.entries(catGroups)) {
    const centroid = new Float32Array(256);
    let aspectSum = 0;
    items.forEach(it => {
      for (let d = 0; d < 256; d++) centroid[d] += it.vector[d];
      aspectSum += (it.raw_aspect_ratio || 1.0);
    });
    // Normalize centroid
    let norm = 0;
    for (let d = 0; d < 256; d++) {
      centroid[d] /= items.length;
      norm += centroid[d] * centroid[d];
    }
    norm = Math.sqrt(norm) || 1;
    for (let d = 0; d < 256; d++) centroid[d] /= norm;

    categoryCentroids[category] = Array.from(centroid).map(v => +(v.toFixed(5)));
    categoryAspectRatios[category] = +(aspectSum / items.length).toFixed(3);
  }

  const finalOutput = {
    version: 'v2.0_visual_hog_hsv_dhash_256',
    model: 'sharp-hog-hsv-dhash-256',
    dimensions: 256,
    total_indexed: results.length,
    catalog_revision: '2026-11-central-products',
    generated_at: new Date().toISOString(),
    category_centroids: categoryCentroids,
    category_aspect_ratios: categoryAspectRatios,
    embeddings: results
  };

  const jsonStr = JSON.stringify(finalOutput);
  fs.writeFileSync(outputPathSrc, jsonStr, 'utf8');
  fs.writeFileSync(outputPathPub, jsonStr, 'utf8');

  console.log(`\n======================================================`);
  console.log(`[Index Generator] Successfully built visual index!`);
  console.log(`Total Products Indexed: ${results.length} (${successes} succeeded, ${failures} failed)`);
  console.log(`Dimensions: 256`);
  console.log(`Saved to:`);
  console.log(` - ${outputPathSrc}`);
  console.log(` - ${outputPathPub}`);
  console.log(`Total Elapsed Time: ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('[Index Generator Fatal Error]:', err);
  process.exit(1);
});
