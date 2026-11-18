import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import { searchProductsByImage, predictProductCategory } from '../server/visualSearchService.js';
import {
  extractVisualFeaturesFromBuffer,
  hammingDistance,
  cosineSimilarity
} from '../server/visualFeatureExtractor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('🧪 AZRAQ SHOP — VISUAL SEARCH ACCURACY & PURITY TEST SUITE');
  console.log('=============================================================\n');

  // TEST 1: Feature Extraction & Dimensions
  console.log('Test 1: Validating Feature Extraction Pipeline...');
  const shirtPath = path.join(__dirname, '../test_images/shirt.jpg');
  const shirtBuf = fs.readFileSync(shirtPath);
  const shirtFeatures = await extractVisualFeaturesFromBuffer(shirtBuf);

  assert.strictEqual(shirtFeatures.vector.length, 256, 'Feature vector must be exactly 256 dimensions');
  assert.strictEqual(shirtFeatures.dhash.length, 16, 'dHash must be 16-character hex string (64 bits)');
  assert.ok(shirtFeatures.dominantColor.startsWith('#'), 'Dominant color must be valid hex');
  assert.ok(shirtFeatures.rawAspectRatio > 0, 'Aspect ratio must be positive');
  console.log('  ✅ Extracted 256-D vector & 64-bit dHash successfully.\n');

  // TEST 2: Index Loading & Consistency
  console.log('Test 2: Verifying Index Structure & Schema...');
  const indexPath = path.join(__dirname, '../src/data/product_embeddings.json');
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  assert.strictEqual(indexData.dimensions, 256, 'Index dimensions must be 256');
  assert.strictEqual(indexData.total_indexed, 1206, 'All 1,206 catalog items must be indexed');
  assert.ok(indexData.embeddings.length === 1206, 'Embeddings array length must be 1206');
  assert.ok(Object.keys(indexData.category_centroids).length > 0, 'Category centroids must be present');
  console.log(`  ✅ Index verified: ${indexData.total_indexed} products, ${Object.keys(indexData.category_centroids).length} category models.\n`);

  // TEST 3: Cross-Category Leakage & Taxonomy Integrity
  console.log('Test 3: Testing Category Recognition & Category Leakage...');
  const testScenarios = [
    {
      categoryName: "Men Clothing",
      imageFile: 'shirt.jpg',
      allowedGroup: ['Men Clothing', 'Drop Shoulder T-Shirt', 'Winter Collection'],
      expectedSample: 'Punjabi'
    },
    {
      categoryName: "Sunglass Collection",
      imageFile: 'sunglass.jpg',
      allowedGroup: ['Sunglass Collection', 'Men Accessories'],
      expectedSample: 'Sunglass'
    },
    {
      categoryName: "Kitchen Appliances",
      imageFile: 'kitchen.jpg',
      allowedGroup: ['Kitchen Appliances', 'Home & Lifestyle'],
      expectedSample: 'Kitchen'
    },
    {
      categoryName: "Gadgets & IT Accessories",
      imageFile: 'powerbank.jpg',
      allowedGroup: ['Gadgets & IT Accessories', 'Consumer Electronics'],
      expectedSample: 'Baseus'
    },
    {
      categoryName: "Jewelries & Accessories",
      imageFile: 'handbag.jpg',
      allowedGroup: ['Jewelries & Accessories', 'Men Accessories'],
      expectedSample: 'Bag'
    }
  ];

  for (const scenario of testScenarios) {
    const imgBuf = fs.readFileSync(path.join(__dirname, '../test_images', scenario.imageFile));
    const base64 = imgBuf.toString('base64');

    const result = await searchProductsByImage({
      imageBase64: base64,
      mimeType: 'image/jpeg'
    });

    assert.strictEqual(result.success, true, 'Search should succeed');
    assert.ok(result.total_candidates > 0, `Should find matching products for ${scenario.categoryName}`);

    const bestMatches = result.sections.best_matches || [];
    const similarProducts = result.sections.similar_products || [];
    const allMatches = [...bestMatches, ...similarProducts];

    // Verify #1 top match
    const topMatch = allMatches[0];
    assert.ok(topMatch, `Must have at least one match for ${scenario.categoryName}`);
    assert.strictEqual(topMatch.match_type, 'exact', 'Catalog image query must yield exact match type');
    assert.ok(topMatch.similarity >= 95, 'Exact match similarity must be >= 95%');
    assert.strictEqual(topMatch.dhash_distance, 0, 'Exact catalog image dHash distance must be 0');

    // Strict cross-category leakage test
    const foreignItems = allMatches.filter(p => !scenario.allowedGroup.includes(p.category));
    assert.strictEqual(
      foreignItems.length,
      0,
      `Cross-category leakage detected for ${scenario.categoryName}! Leaked: ${foreignItems.map(f => f.category).join(', ')}`
    );

    console.log(`  ✅ [${scenario.categoryName}]: Predicted "${result.predicted_category}" (Confidence: ${result.category_confidence}) | Top Match: "${topMatch.name.slice(0, 35)}..." (${topMatch.similarity}%) | Leakage: ZERO`);
  }

  // TEST 4: Exact vs Similar Partitioning
  console.log('\nTest 4: Verifying Exact vs Similar Partitioning...');
  const shirtSearch = await searchProductsByImage({
    imageBase64: shirtBuf.toString('base64')
  });

  const best = shirtSearch.sections.best_matches;
  const similar = shirtSearch.sections.similar_products;

  assert.ok(best.length > 0, 'Must have best matches');
  assert.ok(similar.length > 0, 'Must have similar products');
  best.forEach(p => {
    assert.ok(p.match_type === 'exact' || p.similarity >= 80, 'Best matches must have similarity >= 80% or exact type');
  });
  similar.forEach(p => {
    assert.ok(p.similarity >= 50 && p.similarity < 80, 'Similar products must be within 50% - 79% similarity');
  });
  console.log(`  ✅ Partitioned correctly: ${best.length} Exact/Best Matches, ${similar.length} Similar Alternatives.\n`);

  // TEST 5: Verify speaker query never leaks into Men Clothing
  console.log('Test 5: Validating Speaker Query Category Purity (Zero Clothing Leakage)...');
  const speakerBuf = fs.readFileSync(path.join(__dirname, '../test_images/user_query_speaker.jpg'));
  const speakerRes = await searchProductsByImage({
    imageBase64: speakerBuf.toString('base64')
  });
  assert.notStrictEqual(speakerRes.predicted_category, 'Men Clothing', 'Speaker must NOT classify as Men Clothing');
  assert.ok(
    ['Gadgets & IT Accessories', 'Consumer Electronics'].includes(speakerRes.predicted_category),
    `Speaker must classify into electronics/gadgets, got: ${speakerRes.predicted_category}`
  );
  const speakerAllMatches = [
    ...(speakerRes.sections.best_matches || []),
    ...(speakerRes.sections.similar_products || [])
  ];
  const clothingMatches = speakerAllMatches.filter(p => p.category === 'Men Clothing');
  assert.strictEqual(clothingMatches.length, 0, 'Speaker results must contain ZERO clothing products');
  console.log(`  ✅ Speaker query predicted "${speakerRes.predicted_category}" with 0 clothing leakage.\n`);

  console.log('=============================================================');
  console.log('🎉 ALL VISUAL SEARCH ACCURACY TESTS PASSED PERFECTLY!');
  console.log('=============================================================\n');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
