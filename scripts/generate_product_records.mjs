/**
 * AZRAQ Shop — Build-Time Individual Product Record Generator
 * 
 * Generates lightweight standalone JSON records for every product from the canonical catalog.
 * This eliminates the requirement to download the entire 4.2 MB catalog on direct product page visits.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const catalogPath = path.join(rootDir, 'src', 'data', 'central_products.json');
const targetDir = path.join(rootDir, 'public', 'data', 'products');

if (!fs.existsSync(catalogPath)) {
  console.error(`[Error] Canonical catalog not found at: ${catalogPath}`);
  process.exit(1);
}

const startTime = Date.now();
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const products = catalog.products || [];

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

let writtenCount = 0;

for (const product of products) {
  if (!product.id) continue;
  const jsonStr = JSON.stringify(product);
  
  // Canonical ID (uppercase)
  const canonicalFile = path.join(targetDir, `${product.id.toUpperCase()}.json`);
  fs.writeFileSync(canonicalFile, jsonStr, 'utf8');

  // Lowercase alias for case-sensitive environments (Linux/Vercel)
  const lowerId = product.id.toLowerCase();
  if (lowerId !== product.id.toUpperCase()) {
    const lowerFile = path.join(targetDir, `${lowerId}.json`);
    try {
      // On case-insensitive Windows this might overwrite same file, which is safe
      fs.writeFileSync(lowerFile, jsonStr, 'utf8');
    } catch (e) {
      // Ignored on case-insensitive filesystems
    }
  }

  writtenCount++;
}

// Also write a lightweight manifest with all product IDs, names, and slugs for fast index lookup
const manifest = products.map(p => ({
  id: p.id,
  name: p.name,
  sku: p.sku || null,
  category: p.category || null,
  price: p.price,
  main_image: p.main_image
}));
fs.writeFileSync(path.join(targetDir, 'manifest.json'), JSON.stringify(manifest), 'utf8');

console.log(`[Product Record Generator] Generated ${writtenCount} standalone product records in ${Date.now() - startTime}ms`);
