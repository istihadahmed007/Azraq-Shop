const fs = require('fs');
const path = require('path');
const decode = require('image-decode');

const centralProductsPath = path.join(__dirname, '../src/data/central_products.json');
const outputPathSrc = path.join(__dirname, '../src/data/product_embeddings.json');
const outputPathPub = path.join(__dirname, '../public/data/product_embeddings.json');
const cacheDir = path.join(__dirname, '../.cache');
const cacheFilePath = path.join(cacheDir, 'image_features_cache.json');

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

// Visual Feature Extractor (Matches backend server exactly)
function extractVisualFeatures(decoded) {
  const { data, width, height } = decoded;

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let fgPixels = 0;
  const step = Math.max(1, Math.floor(Math.min(width, height) / 80));

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
      const isBg = (a < 50) || (r > 240 && g > 240 && b > 240) || (r < 15 && g < 15 && b < 15 && a > 240 && y < 10);
      if (!isBg) {
        fgPixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const fgWidth = Math.max(1, (maxX >= minX ? maxX - minX : width));
  const fgHeight = Math.max(1, (maxY >= minY ? maxY - minY : height));
  const aspectRatio = fgWidth / fgHeight;
  const fillFactor = fgPixels / (Math.max(1, (fgWidth * fgHeight) / (step * step)));

  // Resample to 64x64 for spatial HOG and texture
  const targetSize = 64;
  const gray64 = new Float32Array(targetSize * targetSize);
  const rgb64 = new Uint8Array(targetSize * targetSize * 3);
  const xRatio = (width - 1) / (targetSize - 1);
  const yRatio = (height - 1) / (targetSize - 1);

  for (let y = 0; y < targetSize; y++) {
    const srcY = Math.floor(y * yRatio);
    for (let x = 0; x < targetSize; x++) {
      const srcX = Math.floor(x * xRatio);
      const srcIdx = (srcY * width + srcX) * 4;
      const r = data[srcIdx], g = data[srcIdx + 1], b = data[srcIdx + 2];
      const outIdx = y * targetSize + x;
      gray64[outIdx] = 0.299 * r + 0.587 * g + 0.114 * b;
      rgb64[outIdx * 3] = r;
      rgb64[outIdx * 3 + 1] = g;
      rgb64[outIdx * 3 + 2] = b;
    }
  }

  // 64-bit dHash (9x8 grayscale)
  let dhashBits = '';
  const dW = 9, dH = 8;
  const dXRatio = (width - 1) / (dW - 1);
  const dYRatio = (height - 1) / (dH - 1);
  const dGray = new Float32Array(dW * dH);
  for (let y = 0; y < dH; y++) {
    const sY = Math.floor(y * dYRatio);
    for (let x = 0; x < dW; x++) {
      const sX = Math.floor(x * dXRatio);
      const sIdx = (sY * width + sX) * 4;
      dGray[y * dW + x] = 0.299 * data[sIdx] + 0.587 * data[sIdx + 1] + 0.114 * data[sIdx + 2];
    }
  }
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      dhashBits += (dGray[y * 9 + x] > dGray[y * 9 + (x + 1)]) ? '1' : '0';
    }
  }
  let dhash = '';
  for (let i = 0; i < 64; i += 4) {
    dhash += parseInt(dhashBits.slice(i, i + 4), 2).toString(16);
  }

  // Multi-scale Spatial HOG (4x4 spatial blocks x 8 orientation bins = 128 features)
  const hog = new Float32Array(128);
  const blockSize = targetSize / 4;
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
  const sCell = targetSize / 8;
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
          const lap = Math.abs(4 * gray64[idx] - gray64[idx - 1] - gray64[idx + 1] - gray64[idx - targetSize] - gray64[idx + targetSize]);
          lapSum += lap;
        }
      }
      texture[cy * 4 + cx] = lapSum / (blockSize * blockSize * 255);
    }
  }

  // HSV (32 features)
  const hsv = new Float32Array(32);
  let rAcc = 0, gAcc = 0, bAcc = 0, colorCount = 0;
  for (let i = 0; i < targetSize * targetSize; i++) {
    const r = rgb64[i * 3] / 255;
    const g = rgb64[i * 3 + 1] / 255;
    const b = rgb64[i * 3 + 2] / 255;
    if (r > 0.95 && g > 0.95 && b > 0.95) continue;
    rAcc += r; gAcc += g; bAcc += b;
    colorCount++;
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
  const colorNorm = colorCount || 1;
  for (let i = 0; i < 32; i++) hsv[i] /= colorNorm;

  const domR = Math.min(255, Math.floor((rAcc / colorNorm) * 255)).toString(16).padStart(2, '0');
  const domG = Math.min(255, Math.floor((gAcc / colorNorm) * 255)).toString(16).padStart(2, '0');
  const domB = Math.min(255, Math.floor((bAcc / colorNorm) * 255)).toString(16).padStart(2, '0');

  const geom = new Float32Array(16);
  geom[0] = Math.min(3, aspectRatio) / 3;
  geom[1] = Math.min(1, fillFactor);
  geom[2] = fgWidth / width;
  geom[3] = fgHeight / height;
  geom[4] = (minX + maxX) / (2 * width);
  geom[5] = (minY + maxY) / (2 * height);

  const rawVector = new Float32Array(256);
  rawVector.set(hog, 0);
  rawVector.set(spatialMass, 128);
  rawVector.set(texture, 192);
  rawVector.set(hsv, 208);
  rawVector.set(geom, 240);

  // Mean-centering and L2 normalization for balanced discrimination
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
    vector: Array.from(normalizedVector).map(v => +(v.toFixed(5))),
    dhash,
    dominantColor: '#' + domR + domG + domB,
    aspectRatio: +(aspectRatio.toFixed(3)),
    fillFactor: +(fillFactor.toFixed(3))
  };
}

async function fetchImageBuffer(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processProduct(product) {
  const key = `${product.id}_${product.main_image}`;
  if (featureCache[key]) {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      category_id: product.category_id || product.primary_collection_id || 1,
      price: product.price,
      main_image: product.main_image,
      images: product.images || [product.main_image],
      ...featureCache[key]
    };
  }

  // Fetch and decode main image
  let buffer = null;
  try {
    buffer = await fetchImageBuffer(product.main_image);
  } catch (err) {
    // If main image failed, try gallery image
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

  const decoded = decode(buffer);
  const features = extractVisualFeatures(decoded);

  featureCache[key] = {
    vector: features.vector,
    dhash: features.dhash,
    dominant_color: features.dominantColor,
    aspect_ratio: features.aspectRatio,
    fill_factor: features.fillFactor
  };

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    category_id: product.category_id || product.primary_collection_id || 1,
    price: product.price,
    main_image: product.main_image,
    images: product.images || [product.main_image],
    ...featureCache[key]
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
        console.warn(`[Index Generator] Warning for ${prod.id}: ${err.message}`);
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
          aspect_ratio: 1.0,
          fill_factor: 0.5
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

  // Calculate category centroid models
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
      aspectSum += (it.aspect_ratio || 1.0);
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
    dimensions: 256,
    total_indexed: results.length,
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
  console.log(`Total Products Indexed: ${results.length}`);
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
