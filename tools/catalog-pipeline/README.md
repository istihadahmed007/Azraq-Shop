# AZRAQ Catalog Ingestion & Extraction Pipeline

This directory documents the data pipelines used to ingest, reconcile, and build the unified catalog from EasyDrop sources for the AZRAQ storefront.

## Pipeline Architecture
1. **Raw Scrape Ingestion:**
   - `easydrop_complete_catalog_raw.json`: Full unfiltered product dump from supplier endpoint.
   - `all_easydrop_categories.json`: Complete 18-category taxonomy definitions.
2. **Catalog Compilation (`build_full_catalog.py`):**
   - Normalizes pricing to authentic BDT values.
   - Extracts categories, generates image arrays, cleans descriptions, and builds collection mappings.
   - Produces the master catalog: `public/data/central_products.json` and `src/data/central_products.json`.
3. **Slim Fast-Boot Catalog (`src/data/initial_catalog.json`):**
   - Contains the initial 8-product payload (13 kB) bundled for immediate above-the-fold first paint.
   - The full catalog is hydrated asynchronously via `fetch('/data/central_products.json')` to maintain ultra-fast page load times and keep the initial JS bundle under 130 kB.
4. **Visual Embedding Indexing (`scripts/generate_product_embeddings.cjs`):**
   - Generates 512-dimension semantic vectors (`public/data/product_embeddings.json`) used by the Visual Image Search API.
