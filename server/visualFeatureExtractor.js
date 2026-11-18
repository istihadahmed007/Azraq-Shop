import sharp from 'sharp';

/**
 * Universal Visual Feature Extractor
 * Produces genuine 256-dimensional normalized visual embedding vectors
 * and 64-bit perceptual difference hashes (dHash).
 */

export async function extractVisualFeaturesFromBuffer(buffer) {
  if (!buffer || buffer.length === 0) {
    throw new Error('Image buffer is empty or invalid.');
  }

  // 1. Inspect image metadata and get 64x64 RGBA + 9x8 grayscale buffers via sharp
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 64;
  const height = metadata.height || 64;
  const rawAspectRatio = +(width / Math.max(1, height)).toFixed(3);

  // 64x64 RGBA for feature extraction
  const { data: rgba64 } = await sharp(buffer)
    .resize(64, 64, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 9x8 grayscale for 64-bit dHash
  const { data: gray9x8 } = await sharp(buffer)
    .resize(9, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 2. Compute 64-bit dHash
  let dhashBits = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const left = gray9x8[y * 9 + x];
      const right = gray9x8[y * 9 + (x + 1)];
      dhashBits += (left > right) ? '1' : '0';
    }
  }
  let dhash = '';
  for (let i = 0; i < 64; i += 4) {
    dhash += parseInt(dhashBits.slice(i, i + 4), 2).toString(16);
  }

  // 3. Compute 64x64 Grayscale & Foreground mask
  const targetSize = 64;
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

      // Identify foreground (excluding near-white studio backdrop > 240 or transparent alpha < 50)
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

  const fgWidth = Math.max(1, (maxX >= minX ? maxX - minX : targetSize));
  const fgHeight = Math.max(1, (maxY >= minY ? maxY - minY : targetSize));
  const fgAspectRatio = +(fgWidth / fgHeight).toFixed(3);
  const fillFactor = +(fgPixels / (targetSize * targetSize)).toFixed(3);

  // Dominant color hex
  const denom = colorCount || (targetSize * targetSize);
  const domR = Math.min(255, Math.floor((rAcc / denom) || 128)).toString(16).padStart(2, '0');
  const domG = Math.min(255, Math.floor((gAcc / denom) || 128)).toString(16).padStart(2, '0');
  const domB = Math.min(255, Math.floor((bAcc / denom) || 128)).toString(16).padStart(2, '0');
  const dominantColor = `#${domR}${domG}${domB}`;

  // 4. Multi-scale Spatial HOG (4x4 spatial blocks x 8 gradient orientations = 128 features)
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

  // Normalize each HOG block
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

  // 5. Spatial Mass Grid (8x8 = 64 features)
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

  // 6. Texture roughness & Laplacian variance in 16 cells (16 features)
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

  // 7. HSV Color distribution (16 hue, 8 sat, 8 val = 32 features)
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

  // 8. Geometry & Aspect Features (16 features)
  const geom = new Float32Array(16);
  geom[0] = Math.min(3, rawAspectRatio) / 3;
  geom[1] = Math.min(3, fgAspectRatio) / 3;
  geom[2] = fillFactor;
  geom[3] = fgWidth / targetSize;
  geom[4] = fgHeight / targetSize;
  geom[5] = (minX + maxX) / (2 * targetSize);
  geom[6] = (minY + maxY) / (2 * targetSize);

  // 9. Assemble 256-D Feature Vector
  const rawVector = new Float32Array(256);
  rawVector.set(hog, 0);          // [0..127]
  rawVector.set(spatialMass, 128); // [128..191]
  rawVector.set(texture, 192);     // [192..207]
  rawVector.set(hsv, 208);         // [208..239]
  rawVector.set(geom, 240);        // [240..255]

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
    vector: Array.from(normalizedVector).map(v => +(v.toFixed(5))),
    dhash,
    dominantColor,
    rawAspectRatio,
    fgAspectRatio,
    fillFactor,
    detectedIntensity: +(gray64.reduce((acc, v) => acc + v, 0) / (targetSize * targetSize * 255)).toFixed(3)
  };
}

/**
 * Computes Hamming distance between two 16-character hexadecimal dHash strings.
 * Distance ranges from 0 (identical) to 64 (complete inverse).
 */
export function hammingDistance(hex1, hex2) {
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

/**
 * Computes Cosine similarity between two normalized float vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}
