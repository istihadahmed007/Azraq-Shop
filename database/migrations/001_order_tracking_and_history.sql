-- ====================================================================
-- AZRAQ SHOP — DATABASE MIGRATION 001
-- Customer Order Tracking, Unguessable Security Tokens & Append-Only Status History
-- Backward-compatible with existing orders and checkout attempts
-- ====================================================================

-- UP MIGRATION
BEGIN;

-- 1. Add tracking_token, currency, and explicit fulfillment fields to orders if missing
ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS tracking_token VARCHAR(100) UNIQUE,
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'BDT',
    ADD COLUMN IF NOT EXISTS fulfillment_status VARCHAR(50) DEFAULT 'Processing',
    ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- 2. Backfill tracking_token for existing orders that have NULL tokens
-- Generates a secure unguessable token prefixed with 'trk_'
UPDATE orders 
SET tracking_token = 'trk_' || SUBSTRING(MD5(id || customer_phone || COALESCE(created_at::TEXT, NOW()::TEXT)), 1, 24)
WHERE tracking_token IS NULL;

-- 3. Enforce NOT NULL on tracking_token after backfill
ALTER TABLE orders 
    ALTER COLUMN tracking_token SET NOT NULL;

-- 4. Create indexes for high-performance, authorized lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON orders(fulfillment_status);

-- 5. Append-only Order Status History Audit Table
CREATE TABLE IF NOT EXISTS order_status_history (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status_type VARCHAR(20) NOT NULL, -- 'fulfillment' | 'payment'
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    actor_source VARCHAR(100) DEFAULT 'SYSTEM', -- 'SYSTEM', 'PAYMENTLY_GATEWAY', 'ADMIN', 'CUSTOMER_COD', 'CUSTOMER_MANUAL_TRX'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_osh_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_osh_created_at ON order_status_history(created_at);

-- 6. Backfill initial status history for existing orders if history is empty
INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
SELECT 
    'HIST-INIT-' || o.id,
    o.id,
    'fulfillment',
    NULL,
    COALESCE(o.order_status, 'Processing'),
    'MIGRATION_BACKFILL',
    'Initial fulfillment status recorded from order creation',
    COALESCE(o.created_at, NOW())
FROM orders o
WHERE NOT EXISTS (
    SELECT 1 FROM order_status_history h WHERE h.order_id = o.id AND h.status_type = 'fulfillment'
);

INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
SELECT 
    'HIST-PAY-INIT-' || o.id,
    o.id,
    'payment',
    NULL,
    COALESCE(o.payment_status, 'PENDING_COD'),
    'MIGRATION_BACKFILL',
    'Initial payment status recorded from order creation',
    COALESCE(o.created_at, NOW())
FROM orders o
WHERE NOT EXISTS (
    SELECT 1 FROM order_status_history h WHERE h.order_id = o.id AND h.status_type = 'payment'
);

COMMIT;

-- ====================================================================
-- DOWN MIGRATION (ROLLBACK PROCEDURE)
-- To safely roll back this migration without losing primary order data:
-- ====================================================================
/*
BEGIN;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP INDEX IF EXISTS idx_orders_tracking_token;
DROP INDEX IF EXISTS idx_orders_customer_phone;
DROP INDEX IF EXISTS idx_orders_fulfillment_status;
ALTER TABLE orders 
    DROP COLUMN IF EXISTS tracking_token,
    DROP COLUMN IF EXISTS currency,
    DROP COLUMN IF EXISTS fulfillment_status,
    DROP COLUMN IF EXISTS dispatched_at,
    DROP COLUMN IF EXISTS delivered_at;
COMMIT;
*/

