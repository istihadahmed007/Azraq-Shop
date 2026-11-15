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

-- 12. AI Visual Search & Vector Embeddings (pgvector extension)
-- Supports CLIP-compatible 128/512-dimension visual embeddings
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS product_visual_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    embedding vector(128) NOT NULL,
    dominant_colors TEXT[] DEFAULT '{}',
    visual_tags TEXT[] DEFAULT '{}',
    aspect_ratio NUMERIC(5, 3) DEFAULT 1.0,
    model_version VARCHAR(50) DEFAULT 'clip-vit-b32-v1',
    indexed_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_product_visual_embedding UNIQUE (product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_visual_embeddings_cosine 
ON product_visual_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE TABLE IF NOT EXISTS visual_search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_image_hash VARCHAR(64),
    top_matched_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    max_similarity NUMERIC(5, 4),
    total_candidates_returned INTEGER DEFAULT 0,
    search_duration_ms INTEGER,
    client_ip VARCHAR(50),
    user_agent TEXT,
    searched_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 13. Checkout Attempts (Pre-Payment Session State)
CREATE TABLE IF NOT EXISTS checkout_attempts (
    id VARCHAR(100) PRIMARY KEY, -- e.g. 'AZQ-CHK-MXXXXX-XXX'
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Dhaka',
    thana VARCHAR(100),
    delivery_area VARCHAR(20) DEFAULT 'inside', -- 'inside', 'outside'
    notes TEXT,
    items_snapshot JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total_payable NUMERIC(12, 2) NOT NULL,
    promo_code VARCHAR(50),
    payment_method VARCHAR(50) DEFAULT 'PAYMENTLY', -- 'PAYMENTLY', 'COD'
    gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
    gateway_invoice_id VARCHAR(100) UNIQUE,
    gateway_payment_url TEXT,
    status VARCHAR(50) DEFAULT 'INITIATED', -- 'INITIATED', 'AWAITING_PAYMENT', 'PAID', 'COD_CONFIRMED', 'FAILED', 'CANCELLED', 'EXPIRED'
    order_id VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chk_status ON checkout_attempts(status);
CREATE INDEX IF NOT EXISTS idx_chk_invoice ON checkout_attempts(gateway_invoice_id);
CREATE INDEX IF NOT EXISTS idx_chk_phone ON checkout_attempts(customer_phone);

-- 14. Customer Orders (Created strictly after verified payment or confirmed COD)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- e.g. 'AZQ-ORD-92101'
    tracking_token VARCHAR(100) UNIQUE NOT NULL, -- Secure unguessable token for tracking authorization
    checkout_attempt_id VARCHAR(100) REFERENCES checkout_attempts(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Dhaka',
    thana VARCHAR(100),
    delivery_area VARCHAR(20) DEFAULT 'inside',
    notes TEXT,
    currency VARCHAR(10) DEFAULT 'BDT',
    subtotal NUMERIC(12, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL,
    promo_code VARCHAR(50),
    payment_method VARCHAR(50) NOT NULL, -- 'PAYMENTLY', 'COD'
    payment_status VARCHAR(50) NOT NULL, -- 'PAID', 'PENDING_COD', 'PENDING_VERIFICATION'
    fulfillment_status VARCHAR(50) DEFAULT 'Processing', -- 'Processing', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'
    order_status VARCHAR(50) DEFAULT 'Processing', -- Kept in sync with fulfillment_status
    gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
    gateway_invoice_id VARCHAR(100),
    gateway_transaction_id VARCHAR(100), -- Authentic provider transaction reference (TrxID)
    sender_number VARCHAR(30),
    verified_at TIMESTAMPTZ,
    courier_name VARCHAR(100),
    courier_tracking_id VARCHAR(100),
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment ON orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_pay_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_trx ON orders(gateway_transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_invoice ON orders(gateway_invoice_id);

-- 14b. Append-Only Order Status Audit History
CREATE TABLE IF NOT EXISTS order_status_history (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status_type VARCHAR(20) NOT NULL, -- 'fulfillment' | 'payment'
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    actor_source VARCHAR(100) DEFAULT 'SYSTEM',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_osh_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_osh_created ON order_status_history(created_at);

-- 15. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    sku VARCHAR(100),
    name VARCHAR(500) NOT NULL,
    variant VARCHAR(255) DEFAULT 'Default',
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price NUMERIC(12, 2) NOT NULL,
    collection_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 16. Payment Gateway & Transaction Reconciliation (Paymently Integration)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(50), -- e.g. 'AZQ-ORD-92101' (populated upon confirmed order)
    checkout_attempt_id VARCHAR(100) REFERENCES checkout_attempts(id) ON DELETE SET NULL,
    gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY', -- 'PAYMENTLY', 'COD'
    gateway_invoice_id VARCHAR(100) UNIQUE,
    gateway_payment_url TEXT,
    transaction_id VARCHAR(100), -- Provider Transaction Reference (TrxID)
    sender_number VARCHAR(30), -- Customer wallet / phone (e.g. 017...)
    payment_method VARCHAR(50) DEFAULT 'ONLINE', -- 'bkash', 'nagad', 'rocket', 'upay', 'cards', 'cod'
    currency VARCHAR(10) DEFAULT 'BDT',
    amount NUMERIC(12, 2) NOT NULL,
    fee NUMERIC(10, 2) DEFAULT 0.00,
    charged_amount NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'
    idempotency_key VARCHAR(100) UNIQUE,
    verified_at TIMESTAMPTZ,
    raw_payload JSONB,
    refund_status VARCHAR(50), -- 'NONE', 'REQUESTED', 'APPROVED', 'PROCESSED'
    refund_amount NUMERIC(12, 2),
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_trx_id ON payment_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_invoice ON payment_transactions(gateway_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_transactions(status);

-- 17. Payment Webhook Audit Logs (Idempotency and Anti-Tampering)
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
    invoice_id VARCHAR(100),
    event_type VARCHAR(100),
    signature VARCHAR(255),
    payload JSONB NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_invoice ON payment_webhook_logs(invoice_id);


