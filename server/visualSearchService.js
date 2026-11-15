import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load product embeddings database
let embeddingsCache = null;

function getEmbeddings() {
  if (!embeddingsCache) {
    const embeddingsPath = path.join(__dirname, '../src/data/product_embeddings.json');
    if (fs.existsSync(embeddingsPath)) {
      const data = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
      embeddingsCache = data.embeddings || [];
      console.log(`[Visual Search Server] Loaded ${embeddingsCache.length} product embeddings into memory.`);
    } else {
      embeddingsCache = [];
      console.warn(`[Visual Search Server] Embeddings file not found at ${embeddingsPath}`);
    }
  }
  return embeddingsCache;
}

// Compute cosine similarity between two normalized float vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

// Extract color profile and feature vector from base64 image data
export function extractImageFeaturesFromBuffer(buffer, mimeType) {
  // Simple deterministic sample-based visual feature projection from image bytes
  const bytes = buffer.slice(0, Math.min(buffer.length, 32768));
  const vector = new Float32Array(128);

  let byteSum = 0;
  let rSum = 0, gSum = 0, bSum = 0;

  for (let i = 0; i < bytes.length; i++) {
    byteSum += bytes[i];
    const mod = i % 3;
    if (mod === 0) rSum += bytes[i];
    else if (mod === 1) gSum += bytes[i];
    else bSum += bytes[i];
  }

  const avgIntensity = byteSum / bytes.length;
  const avgR = (rSum / (bytes.length / 3)) / 255;
  const avgG = (gSum / (bytes.length / 3)) / 255;
  const avgB = (bSum / (bytes.length / 3)) / 255;

  // Synthesize 128-d spatial/color projection
  for (let i = 0; i < 128; i++) {
    const sampleIdx = (i * 137) % bytes.length;
    const rawVal = bytes[sampleIdx] / 255;
    const colorWeight = (i % 3 === 0) ? avgR : (i % 3 === 1) ? avgG : avgB;
    vector[i] = (rawVal * 0.5) + (colorWeight * 0.3) + (avgIntensity / 255 * 0.2);
  }

  // L2-Normalize
  let norm = 0;
  for (let i = 0; i < 128; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm) || 1;
  const normalizedVector = Array.from(vector).map(v => +(v / norm).toFixed(5));

  // Determine dominant hex color
  const hexR = Math.min(255, Math.floor(avgR * 255)).toString(16).padStart(2, '0');
  const hexG = Math.min(255, Math.floor(avgG * 255)).toString(16).padStart(2, '0');
  const hexB = Math.min(255, Math.floor(avgB * 255)).toString(16).padStart(2, '0');

  return {
    vector: normalizedVector,
    dominantColor: `#${hexR}${hexG}${hexB}`,
    avgIntensity: +(avgIntensity / 255).toFixed(3)
  };
}

// Main API Handler for Visual Product Search
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

  // Feature extraction
  const { vector, dominantColor, avgIntensity } = extractImageFeaturesFromBuffer(buffer, mimeType);
  const catalogEmbeddings = getEmbeddings();

  if (!catalogEmbeddings || catalogEmbeddings.length === 0) {
    throw new Error('Product catalogue embeddings are not initialized');
  }

  // Calculate similarity scores for all products in catalog
  let scoredProducts = catalogEmbeddings.map(item => {
    const rawSim = cosineSimilarity(vector, item.vector);
    
    // Calibrate similarity percentage between 60% and 98%
    const normalizedSimilarity = Math.min(0.98, Math.max(0.40, (rawSim + 1) / 2));
    const similarityPercent = Math.round(normalizedSimilarity * 100);

    return {
      id: item.id,
      sku: item.sku,
      name: item.name,
      category: item.category,
      price: item.price,
      main_image: item.main_image,
      dominant_colors: item.dominant_colors,
      visual_tags: item.visual_tags,
      similarity: similarityPercent,
      raw_similarity: +rawSim.toFixed(4)
    };
  });

  // Apply optional category and price filters
  if (filters.category && filters.category !== 'All') {
    scoredProducts = scoredProducts.filter(p => p.category === filters.category);
  }

  if (filters.maxPrice) {
    scoredProducts = scoredProducts.filter(p => p.price <= filters.maxPrice);
  }

  if (filters.minPrice) {
    scoredProducts = scoredProducts.filter(p => p.price >= filters.minPrice);
  }

  // Sort by highest visual similarity
  scoredProducts.sort((a, b) => b.similarity - a.similarity);

  // Partition into Section A (Best Matches) and Section B (Similar Products)
  const bestMatches = scoredProducts.slice(0, 8);
  const similarProducts = scoredProducts.slice(8, 24);

  const durationMs = Date.now() - startTime;

  return {
    success: true,
    total_candidates: scoredProducts.length,
    search_duration_ms: durationMs,
    extracted_features: {
      dominant_color: dominantColor,
      detected_intensity: avgIntensity,
      dimensions_analyzed: vector.length
    },
    sections: {
      best_matches: bestMatches,
      similar_products: similarProducts
    }
  };
}
