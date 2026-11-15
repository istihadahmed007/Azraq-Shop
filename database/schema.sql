-- ====================================================================
-- AZRAQ E-COMMERCE PLATFORM — POSTGRESQL DATABASE SCHEMA
-- Multi-Collection Dropshipping Architecture with EasyDrop Integration
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'EASYDROP_ASIA'
    name VARCHAR(255) NOT NULL,
    base_url VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'MYR',
    fx_rate_to_bdt NUMERIC(10, 4) DEFAULT 27.0000,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Supplier Collections (Preserving original supplier taxonomy)
CREATE TABLE IF NOT EXISTS supplier_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    external_collection_id VARCHAR(100) NOT NULL,
    parent_collection_id VARCHAR(100),
    collection_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    source_url TEXT,
    description TEXT,
    image_url TEXT,
    source_product_count INTEGER DEFAULT 0,
    imported_product_count INTEGER DEFAULT 0,
    publication_status VARCHAR(50) DEFAULT 'published', -- 'published', 'draft', 'archived'
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_supplier_external_collection UNIQUE (supplier_id, external_collection_id)
);

CREATE INDEX IF NOT EXISTS idx_supplier_col_slug ON supplier_collections(slug);
CREATE INDEX IF NOT EXISTS idx_supplier_col_ext_id ON supplier_collections(external_collection_id);

-- 3. Supplier Collection Relations (Hierarchical Parent-Child taxonomies)
CREATE TABLE IF NOT EXISTS supplier_collection_relations (
    parent_collection_id UUID NOT NULL REFERENCES supplier_collections(id) ON DELETE CASCADE,
    child_collection_id UUID NOT NULL REFERENCES supplier_collections(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (parent_collection_id, child_collection_id)
);

-- 4. AZRAQ Merchandising Categories (Storefront categories independent of supplier)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    cover_image TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Central Products Database (Unique deduplicated master products)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    azraq_sku VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'AZQ-001'
    primary_name_en VARCHAR(500) NOT NULL,
    primary_name_bn VARCHAR(500),
    sub_title VARCHAR(500),
    slug VARCHAR(500) UNIQUE NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    retail_price_bdt NUMERIC(12, 2) NOT NULL,
    original_price_bdt NUMERIC(12, 2),
    material VARCHAR(255),
    dimensions VARCHAR(255),
    weight_grams NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    is_in_stock BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 0,
    main_image_url TEXT NOT NULL,
    video_url TEXT,
    status VARCHAR(50) DEFAULT 'published', -- 'published', 'draft', 'archived'
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON products(azraq_sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 6. Product-to-Collection Many-to-Many Relationships
CREATE TABLE IF NOT EXISTS product_collections (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_collection_id UUID NOT NULL REFERENCES supplier_collections(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (product_id, supplier_collection_id)
);

CREATE INDEX IF NOT EXISTS idx_prod_col_prod ON product_collections(product_id);
CREATE INDEX IF NOT EXISTS idx_prod_col_col ON product_collections(supplier_collection_id);

-- 7. Product Images Gallery
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT FALSE,
    alt_text VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_sku VARCHAR(100),
    variant_name VARCHAR(255) NOT NULL, -- e.g. 'Size: XL', 'Color: Midnight Navy'
    price_bdt NUMERIC(12, 2),
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Supplier Products (Mapping AZRAQ products back to EasyDrop items)
CREATE TABLE IF NOT EXISTS supplier_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    external_product_id VARCHAR(100) NOT NULL,
    external_sku VARCHAR(100),
    external_title TEXT NOT NULL,
    supplier_cost_currency NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MYR',
    supplier_stock_status VARCHAR(50) DEFAULT 'in_stock',
    source_url TEXT,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_supplier_ext_product UNIQUE (supplier_id, external_product_id)
);

-- 10. Supplier Stock Logs & Price Logs
CREATE TABLE IF NOT EXISTS supplier_stock_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_product_id UUID NOT NULL REFERENCES supplier_products(id) ON DELETE CASCADE,
    old_stock_status VARCHAR(50),
    new_stock_status VARCHAR(50),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_price_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_product_id UUID NOT NULL REFERENCES supplier_products(id) ON DELETE CASCADE,
    old_cost NUMERIC(12, 2),
    new_cost NUMERIC(12, 2),
    currency VARCHAR(10),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Product Import Jobs & Logs
CREATE TABLE IF NOT EXISTS product_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- 'FULL_CATALOG', 'COLLECTION_SYNC', 'PRICE_REFRESH'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    total_collections_discovered INTEGER DEFAULT 0,
    total_products_discovered INTEGER DEFAULT 0,
    total_products_imported INTEGER DEFAULT 0,
    duplicates_prevented INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS product_import_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES product_import_jobs(id) ON DELETE CASCADE,
    log_level VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'error'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES product_import_jobs(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sync_action VARCHAR(50), -- 'CREATED', 'UPDATED', 'STOCK_OUT', 'PRICE_CHANGED'
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

