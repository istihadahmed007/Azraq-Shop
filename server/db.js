import pg from 'pg';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const { Pool } = pg;

let pool = null;
let isInitialized = false;

// Fallback in-memory and disk-cache store for serverless/local environments without DATABASE_URL
// ALWAYS STARTS COMPLETELY EMPTY — NO DUMMY OR FAKE TRANSACTIONS
const DB_CACHE_FILE = path.join(os.tmpdir(), 'azraq_db_cache.json');

const memoryStore = {
  checkout_attempts: new Map(),
  orders: new Map(),
  order_items: new Map(),
  payment_transactions: new Map(),
  payment_webhook_logs: new Map(),
  order_status_history: new Map()
};

function persistFallbackStore() {
  try {
    const data = {
      checkout_attempts: Array.from(memoryStore.checkout_attempts.entries()),
      orders: Array.from(memoryStore.orders.entries()),
      order_items: Array.from(memoryStore.order_items.entries()),
      payment_transactions: Array.from(memoryStore.payment_transactions.entries()),
      payment_webhook_logs: Array.from(memoryStore.payment_webhook_logs.entries()),
      order_status_history: Array.from(memoryStore.order_status_history.entries())
    };
    fs.writeFileSync(DB_CACHE_FILE, JSON.stringify(data), 'utf8');
  } catch (e) {
    // Non-blocking in restricted environments
  }
}

function hydrateFallbackStore() {
  try {
    if (fs.existsSync(DB_CACHE_FILE)) {
      const raw = fs.readFileSync(DB_CACHE_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.checkout_attempts) {
        data.checkout_attempts.forEach(([k, v]) => memoryStore.checkout_attempts.set(k, v));
      }
      if (data.orders) {
        data.orders.forEach(([k, v]) => memoryStore.orders.set(k, v));
      }
      if (data.order_items) {
        data.order_items.forEach(([k, v]) => memoryStore.order_items.set(k, v));
      }
      if (data.payment_transactions) {
        data.payment_transactions.forEach(([k, v]) => memoryStore.payment_transactions.set(k, v));
      }
      if (data.payment_webhook_logs) {
        data.payment_webhook_logs.forEach(([k, v]) => memoryStore.payment_webhook_logs.set(k, v));
      }
      if (data.order_status_history) {
        data.order_status_history.forEach(([k, v]) => memoryStore.order_status_history.set(k, v));
      }
    }
  } catch (e) {
    // Ignore hydrate errors
  }
}

// Hydrate on module load
hydrateFallbackStore();

export function getDbPool() {
  if (!pool && process.env.DATABASE_URL) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });
      pool.on('error', (err) => {
        console.error('[PostgreSQL Pool Error]:', err.message);
      });
    } catch (e) {
      console.warn('[DB Connection Warning] Could not initialize PostgreSQL pool, using memory store:', e.message);
      pool = null;
    }
  }
  return pool;
}

export async function initDb() {
  const p = getDbPool();
  if (!p || isInitialized) return;

  try {
    const client = await p.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS checkout_attempts (
            id VARCHAR(100) PRIMARY KEY,
            customer_name VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(50) NOT NULL,
            customer_email VARCHAR(255),
            shipping_address TEXT NOT NULL,
            city VARCHAR(100) DEFAULT 'Dhaka',
            thana VARCHAR(100),
            delivery_area VARCHAR(20) DEFAULT 'inside',
            notes TEXT,
            items_snapshot JSONB NOT NULL,
            subtotal NUMERIC(12, 2) NOT NULL,
            delivery_fee NUMERIC(10, 2) NOT NULL,
            discount NUMERIC(10, 2) DEFAULT 0.00,
            total_payable NUMERIC(12, 2) NOT NULL,
            promo_code VARCHAR(50),
            payment_method VARCHAR(50) DEFAULT 'PAYMENTLY',
            gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
            gateway_invoice_id VARCHAR(100) UNIQUE,
            gateway_payment_url TEXT,
            status VARCHAR(50) DEFAULT 'INITIATED',
            order_id VARCHAR(50),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(50) PRIMARY KEY,
            tracking_token VARCHAR(100) UNIQUE,
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
            payment_method VARCHAR(50) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            fulfillment_status VARCHAR(50) DEFAULT 'Processing',
            order_status VARCHAR(50) DEFAULT 'Processing',
            gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
            gateway_invoice_id VARCHAR(100),
            gateway_transaction_id VARCHAR(100),
            sender_number VARCHAR(30),
            verified_at TIMESTAMPTZ,
            courier_name VARCHAR(100),
            courier_tracking_id VARCHAR(100),
            dispatched_at TIMESTAMPTZ,
            delivered_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Backward-compatible column additions for existing PostgreSQL tables
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token VARCHAR(100) UNIQUE;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'BDT';
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status VARCHAR(50) DEFAULT 'Processing';
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

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

        CREATE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
        CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
        CREATE INDEX IF NOT EXISTS idx_orders_fulfillment ON orders(fulfillment_status);
        CREATE INDEX IF NOT EXISTS idx_osh_order_id ON order_status_history(order_id);
        CREATE INDEX IF NOT EXISTS idx_osh_created ON order_status_history(created_at);

        CREATE TABLE IF NOT EXISTS order_items (
            id VARCHAR(100) PRIMARY KEY,
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

        CREATE TABLE IF NOT EXISTS payment_transactions (
            id VARCHAR(100) PRIMARY KEY,
            order_id VARCHAR(50),
            checkout_attempt_id VARCHAR(100) REFERENCES checkout_attempts(id) ON DELETE SET NULL,
            gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
            gateway_invoice_id VARCHAR(100) UNIQUE,
            gateway_payment_url TEXT,
            transaction_id VARCHAR(100),
            sender_number VARCHAR(30),
            payment_method VARCHAR(50) DEFAULT 'ONLINE',
            currency VARCHAR(10) DEFAULT 'BDT',
            amount NUMERIC(12, 2) NOT NULL,
            fee NUMERIC(10, 2) DEFAULT 0.00,
            charged_amount NUMERIC(12, 2),
            status VARCHAR(50) DEFAULT 'PENDING',
            idempotency_key VARCHAR(100) UNIQUE,
            verified_at TIMESTAMPTZ,
            raw_payload JSONB,
            refund_status VARCHAR(50),
            refund_amount NUMERIC(12, 2),
            refund_reason TEXT,
            refunded_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS payment_webhook_logs (
            id VARCHAR(100) PRIMARY KEY,
            gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
            invoice_id VARCHAR(100),
            event_type VARCHAR(100),
            signature VARCHAR(255),
            payload JSONB NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE,
            processed_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      isInitialized = true;
      console.log('[PostgreSQL] Database tables initialized successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('[PostgreSQL Init Warning]:', err.message);
  }
}

/**
 * 1. Save a new checkout attempt before initiating any gateway action
 */
export async function saveCheckoutAttempt(attempt) {
  const p = getDbPool();
  const now = new Date().toISOString();
  const record = {
    ...attempt,
    created_at: attempt.created_at || now,
    updated_at: attempt.updated_at || now
  };

  if (p) {
    try {
      await p.query(
        `INSERT INTO checkout_attempts (
          id, customer_name, customer_phone, customer_email, shipping_address,
          city, thana, delivery_area, notes, items_snapshot, subtotal, delivery_fee,
          discount, total_payable, promo_code, payment_method, gateway_name,
          gateway_invoice_id, gateway_payment_url, status, order_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        ON CONFLICT (id) DO UPDATE SET
          gateway_invoice_id = EXCLUDED.gateway_invoice_id,
          gateway_payment_url = EXCLUDED.gateway_payment_url,
          status = EXCLUDED.status,
          order_id = EXCLUDED.order_id,
          updated_at = EXCLUDED.updated_at`,
        [
          record.id, record.customer_name, record.customer_phone, record.customer_email || null,
          record.shipping_address, record.city || 'Dhaka', record.thana || null, record.delivery_area || 'inside',
          record.notes || null, JSON.stringify(record.items_snapshot), record.subtotal, record.delivery_fee,
          record.discount || 0, record.total_payable, record.promo_code || null, record.payment_method || 'PAYMENTLY',
          record.gateway_name || 'PAYMENTLY', record.gateway_invoice_id || null, record.gateway_payment_url || null,
          record.status || 'INITIATED', record.order_id || null, record.created_at, record.updated_at
        ]
      );
    } catch (e) {
      console.error('[DB Error saveCheckoutAttempt]:', e.message);
    }
  }

  memoryStore.checkout_attempts.set(record.id, record);
  persistFallbackStore();
  return record;
}

/**
 * 2. Get checkout attempt by ID
 */
export async function getCheckoutAttempt(id) {
  if (!id) return null;
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query('SELECT * FROM checkout_attempts WHERE id = $1', [id]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        row.items_snapshot = typeof row.items_snapshot === 'string' ? JSON.parse(row.items_snapshot) : row.items_snapshot;
        return row;
      }
    } catch (e) {
      console.error('[DB Error getCheckoutAttempt]:', e.message);
    }
  }
  if (!memoryStore.checkout_attempts.has(id)) {
    hydrateFallbackStore();
  }
  return memoryStore.checkout_attempts.get(id) || null;
}

/**
 * 3. Get checkout attempt by Gateway Invoice ID
 */
export async function getCheckoutAttemptByInvoice(invoiceId) {
  if (!invoiceId) return null;
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query('SELECT * FROM checkout_attempts WHERE gateway_invoice_id = $1', [invoiceId]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        row.items_snapshot = typeof row.items_snapshot === 'string' ? JSON.parse(row.items_snapshot) : row.items_snapshot;
        return row;
      }
    } catch (e) {
      console.error('[DB Error getCheckoutAttemptByInvoice]:', e.message);
    }
  }

  hydrateFallbackStore();
  for (const att of memoryStore.checkout_attempts.values()) {
    if (att.gateway_invoice_id === invoiceId) return att;
  }
  return null;
}

/**
 * 4. Update checkout attempt fields
 */
export async function updateCheckoutAttempt(id, updates) {
  const existing = await getCheckoutAttempt(id);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...updates,
    updated_at: new Date().toISOString()
  };

  const p = getDbPool();
  if (p) {
    try {
      await p.query(
        `UPDATE checkout_attempts SET
          gateway_invoice_id = COALESCE($2, gateway_invoice_id),
          gateway_payment_url = COALESCE($3, gateway_payment_url),
          status = COALESCE($4, status),
          order_id = COALESCE($5, order_id),
          updated_at = $6
        WHERE id = $1`,
        [id, updated.gateway_invoice_id, updated.gateway_payment_url, updated.status, updated.order_id, updated.updated_at]
      );
    } catch (e) {
      console.error('[DB Error updateCheckoutAttempt]:', e.message);
    }
  }

  memoryStore.checkout_attempts.set(id, updated);
  persistFallbackStore();
  return updated;
}

// ====================================================================
// SECURITY, TOKEN GENERATION & PHONE NORMALIZATION HELPERS
// ====================================================================

export function generateTrackingToken() {
  return `trk_${Date.now().toString(36)}_${crypto.randomBytes(12).toString('hex')}`;
}

export function normalizeBdPhone(phoneStr) {
  if (!phoneStr || typeof phoneStr !== 'string') return '';
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.startsWith('880')) {
    return '0' + digits.slice(3);
  }
  if (digits.length === 11 && digits.startsWith('01')) {
    return digits;
  }
  if (digits.length > 11) {
    return digits.slice(-11);
  }
  return digits;
}

export function maskCustomerName(name) {
  if (!name || typeof name !== 'string') return 'Valued Customer';
  const parts = name.trim().split(/\s+/);
  return parts.map(p => {
    if (p.length <= 2) return p;
    return p[0] + '*'.repeat(Math.max(1, p.length - 2)) + p[p.length - 1];
  }).join(' ');
}

export function maskPhoneNumber(phone) {
  const norm = normalizeBdPhone(phone);
  if (norm.length === 11) {
    return norm.slice(0, 3) + '****' + norm.slice(7);
  }
  return phone ? phone.slice(0, 2) + '****' + phone.slice(-2) : '****';
}

// ====================================================================
// APPEND-ONLY ORDER STATUS AUDIT LOG
// ====================================================================

export async function recordOrderStatusHistory({
  orderId,
  statusType, // 'fulfillment' | 'payment'
  previousStatus = null,
  newStatus,
  actorSource = 'SYSTEM',
  notes = null
}) {
  const p = getDbPool();
  const id = `HIST-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const record = {
    id,
    order_id: orderId,
    status_type: statusType,
    previous_status: previousStatus,
    new_status: newStatus,
    actor_source: actorSource,
    notes: notes || null,
    created_at: now
  };

  if (p) {
    try {
      await p.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [record.id, record.order_id, record.status_type, record.previous_status, record.new_status, record.actor_source, record.notes, record.created_at]
      );
    } catch (e) {
      console.error('[DB Error recordOrderStatusHistory]:', e.message);
    }
  }

  memoryStore.order_status_history.set(record.id, record);
  persistFallbackStore();
  return record;
}

export async function getOrderStatusHistory(orderId) {
  if (!orderId) return [];
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query(
        `SELECT id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at
         FROM order_status_history
         WHERE order_id = $1
         ORDER BY created_at ASC`,
        [orderId]
      );
      if (res.rows.length > 0) return res.rows;
    } catch (e) {
      console.error('[DB Error getOrderStatusHistory]:', e.message);
    }
  }

  hydrateFallbackStore();
  return Array.from(memoryStore.order_status_history.values())
    .filter(h => h.order_id === orderId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

// ====================================================================
// AUTHORIZED STATUS TRANSITIONS (SEPARATE FULFILLMENT & PAYMENT)
// ====================================================================

export async function updateOrderFulfillmentStatus(orderId, newStatus, optionsOrActor = 'ADMIN', notesArg = null) {
  const order = await getOrderWithItems(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);

  let actorSource = typeof optionsOrActor === 'object' ? (optionsOrActor.actorSource || 'ADMIN') : optionsOrActor;
  let notes = typeof optionsOrActor === 'object' ? (optionsOrActor.notes || null) : notesArg;
  const courierName = typeof optionsOrActor === 'object' ? optionsOrActor.courierName : null;
  const courierTrackingId = typeof optionsOrActor === 'object' ? optionsOrActor.courierTrackingId : null;

  const prevStatus = order.fulfillment_status || order.order_status || 'Processing';
  if (prevStatus === newStatus && !courierName && !courierTrackingId) return order;

  const now = new Date().toISOString();
  let dispatchedAt = order.dispatched_at;
  let deliveredAt = order.delivered_at;

  if (newStatus === 'Dispatched' && !dispatchedAt) dispatchedAt = now;
  if (newStatus === 'Delivered' && !deliveredAt) deliveredAt = now;
  if (courierName) order.courier_name = courierName;
  if (courierTrackingId) order.courier_tracking_id = courierTrackingId;

  const p = getDbPool();
  if (p) {
    try {
      await p.query(
        `UPDATE orders SET
          fulfillment_status = $2,
          order_status = $2,
          courier_name = COALESCE($3, courier_name),
          courier_tracking_id = COALESCE($4, courier_tracking_id),
          dispatched_at = COALESCE($5, dispatched_at),
          delivered_at = COALESCE($6, delivered_at),
          updated_at = $7
         WHERE id = $1`,
        [orderId, newStatus, order.courier_name, order.courier_tracking_id, dispatchedAt, deliveredAt, now]
      );
    } catch (e) {
      console.error('[DB Error updateOrderFulfillmentStatus]:', e.message);
    }
  }

  order.fulfillment_status = newStatus;
  order.order_status = newStatus;
  order.dispatched_at = dispatchedAt;
  order.delivered_at = deliveredAt;
  order.updated_at = now;
  memoryStore.orders.set(orderId, order);
  persistFallbackStore();

  await recordOrderStatusHistory({
    orderId,
    statusType: 'fulfillment',
    previousStatus: prevStatus,
    newStatus,
    actorSource,
    notes: notes || `Fulfillment state changed from ${prevStatus} to ${newStatus}`
  });

  return order;
}

export async function updateOrderPaymentStatus(orderId, newStatus, optionsOrActor = 'SYSTEM', notesArg = null) {
  const order = await getOrderWithItems(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);

  let actorSource = typeof optionsOrActor === 'object' ? (optionsOrActor.actorSource || 'SYSTEM') : optionsOrActor;
  let notes = typeof optionsOrActor === 'object' ? (optionsOrActor.notes || null) : notesArg;
  const transactionId = typeof optionsOrActor === 'object' ? optionsOrActor.transactionId : null;

  const prevStatus = order.payment_status;
  if (prevStatus === newStatus && !transactionId) return order;

  const now = new Date().toISOString();
  let verifiedAt = order.verified_at;
  if (newStatus === 'PAID' && !verifiedAt) verifiedAt = now;
  if (transactionId) order.gateway_transaction_id = transactionId;

  const p = getDbPool();
  if (p) {
    try {
      await p.query(
        `UPDATE orders SET
          payment_status = $2,
          gateway_transaction_id = COALESCE($3, gateway_transaction_id),
          verified_at = COALESCE($4, verified_at),
          updated_at = $5
         WHERE id = $1`,
        [orderId, newStatus, order.gateway_transaction_id, verifiedAt, now]
      );
    } catch (e) {
      console.error('[DB Error updateOrderPaymentStatus]:', e.message);
    }
  }

  order.payment_status = newStatus;
  order.verified_at = verifiedAt;
  order.updated_at = now;
  memoryStore.orders.set(orderId, order);
  persistFallbackStore();

  await recordOrderStatusHistory({
    orderId,
    statusType: 'payment',
    previousStatus: prevStatus,
    newStatus,
    actorSource,
    notes: notes || `Payment status transitioned from ${prevStatus} to ${newStatus}`
  });

  return order;
}

// ====================================================================
// AUTHORIZED CUSTOMER ORDER TRACKING ACCESS (VERIFIED OWNERSHIP CHECK)
// ====================================================================

export async function getOrderByTrackingAuth(orderId, { phone = null, trackingToken = null } = {}) {
  if (!orderId || typeof orderId !== 'string') {
    return { success: false, error: 'INVALID_REQUEST', message: 'Valid Order ID reference is required.' };
  }

  const cleanOrderId = orderId.trim();
  const order = await getOrderWithItems(cleanOrderId);
  if (!order) {
    return { success: false, error: 'NOT_FOUND', message: 'No matching order found for this reference.' };
  }

  // OWNERSHIP VERIFICATION RULE:
  // Must provide EITHER a matching customer phone number OR the unguessable tracking token.
  // Order ID alone is NEVER sufficient authorization.
  const hasTokenAuth = Boolean(
    trackingToken && 
    typeof trackingToken === 'string' && 
    order.tracking_token && 
    order.tracking_token.toLowerCase() === trackingToken.trim().toLowerCase()
  );

  const cleanPhone = normalizeBdPhone(phone);
  const orderPhone = normalizeBdPhone(order.customer_phone);
  const hasPhoneAuth = Boolean(
    cleanPhone && 
    cleanPhone.length >= 10 && 
    orderPhone && 
    (cleanPhone === orderPhone || orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone))
  );

  if (!hasTokenAuth && !hasPhoneAuth) {
    return {
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication failed. Please provide the 11-digit phone number or secure tracking token associated with this order.'
    };
  }

  // Load audit history
  const history = await getOrderStatusHistory(cleanOrderId);

  // Return minimal, privacy-safe tracking payload
  return {
    success: true,
    order: {
      id: order.id,
      order_id: order.id,
      tracking_token: order.tracking_token,
      fulfillment_status: order.fulfillment_status || order.order_status || 'Processing',
      order_status: order.order_status || order.fulfillment_status || 'Processing',
      payment_status: order.payment_status,
      payment_method: order.payment_method,
      currency: order.currency || 'BDT',
      subtotal: Number(order.subtotal || 0),
      delivery_fee: Number(order.delivery_fee || 0),
      discount: Number(order.discount || 0),
      total: Number(order.total || 0),
      delivery_area: order.delivery_area || 'inside',
      shipping_city: order.city || 'Dhaka',
      courier_name: order.courier_name || null,
      courier_tracking_id: order.courier_tracking_id || null,
      customer_name_masked: maskCustomerName(order.customer_name),
      customer_phone_masked: maskPhoneNumber(order.customer_phone),
      masked_customer: {
        name: maskCustomerName(order.customer_name),
        phone: maskPhoneNumber(order.customer_phone)
      },
      item_count: (order.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0),
      items: (order.items || []).map(it => ({
        name: it.name,
        variant: it.variant || 'Standard',
        quantity: it.quantity || 1,
        unit_price: Number(it.unit_price || it.price || 0)
      })),
      timestamps: {
        created_at: order.created_at,
        verified_at: order.verified_at || null,
        dispatched_at: order.dispatched_at || null,
        delivered_at: order.delivered_at || null,
        updated_at: order.updated_at
      },
      status_history: history.map(h => ({
        id: h.id,
        status_type: h.status_type,
        previous_status: h.previous_status,
        new_status: h.new_status,
        actor_source: h.actor_source,
        notes: h.notes,
        created_at: h.created_at
      }))
    }
  };
}

/**
 * 5. Atomic Order Creation upon Verified Online Payment
 * ONLY CALLED AFTER GENUINE VERIFICATION SUCCEEDS!
 */
export async function createOrderFromVerifiedPayment({
  checkoutAttempt,
  gatewayInvoiceId,
  transactionId,
  paymentMethod = 'bKash/Nagad',
  senderNumber = null,
  verifiedAt = null
}) {
  const now = new Date().toISOString();
  const verificationTime = verifiedAt || now;
  const orderId = `AZQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const trackingToken = generateTrackingToken();

  const orderRecord = {
    id: orderId,
    tracking_token: trackingToken,
    checkout_attempt_id: checkoutAttempt.id,
    customer_name: checkoutAttempt.customer_name,
    customer_phone: checkoutAttempt.customer_phone,
    customer_email: checkoutAttempt.customer_email || null,
    shipping_address: checkoutAttempt.shipping_address,
    city: checkoutAttempt.city || 'Dhaka',
    thana: checkoutAttempt.thana || null,
    delivery_area: checkoutAttempt.delivery_area || 'inside',
    notes: checkoutAttempt.notes || null,
    currency: 'BDT',
    subtotal: checkoutAttempt.subtotal,
    delivery_fee: checkoutAttempt.delivery_fee,
    discount: checkoutAttempt.discount || 0,
    total: checkoutAttempt.total_payable,
    promo_code: checkoutAttempt.promo_code || null,
    payment_method: 'PAYMENTLY',
    payment_status: 'PAID',
    fulfillment_status: 'Processing',
    order_status: 'Processing',
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: gatewayInvoiceId || checkoutAttempt.gateway_invoice_id,
    gateway_transaction_id: transactionId,
    sender_number: senderNumber || checkoutAttempt.customer_phone,
    verified_at: verificationTime,
    courier_name: null,
    courier_tracking_id: null,
    dispatched_at: null,
    delivered_at: null,
    created_at: now,
    updated_at: now
  };

  const p = getDbPool();
  if (p) {
    const client = await p.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert into orders
      await client.query(
        `INSERT INTO orders (
          id, tracking_token, checkout_attempt_id, customer_name, customer_phone, customer_email,
          shipping_address, city, thana, delivery_area, notes, currency, subtotal, delivery_fee,
          discount, total, promo_code, payment_method, payment_status, fulfillment_status, order_status,
          gateway_name, gateway_invoice_id, gateway_transaction_id, sender_number,
          verified_at, courier_name, courier_tracking_id, dispatched_at, delivered_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)`,
        [
          orderRecord.id, orderRecord.tracking_token, orderRecord.checkout_attempt_id, orderRecord.customer_name, orderRecord.customer_phone,
          orderRecord.customer_email, orderRecord.shipping_address, orderRecord.city, orderRecord.thana,
          orderRecord.delivery_area, orderRecord.notes, orderRecord.currency, orderRecord.subtotal, orderRecord.delivery_fee,
          orderRecord.discount, orderRecord.total, orderRecord.promo_code, orderRecord.payment_method,
          orderRecord.payment_status, orderRecord.fulfillment_status, orderRecord.order_status, orderRecord.gateway_name, orderRecord.gateway_invoice_id,
          orderRecord.gateway_transaction_id, orderRecord.sender_number, orderRecord.verified_at,
          orderRecord.courier_name, orderRecord.courier_tracking_id, orderRecord.dispatched_at, orderRecord.delivered_at, orderRecord.created_at, orderRecord.updated_at
        ]
      );

      // 2. Insert items
      const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
      for (const item of items) {
        const itemId = `ITEM-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, sku, name, variant, unit_price, quantity, total_price, collection_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            itemId, orderId, item.id || item.product_id, item.sku || null,
            item.name, item.variant || 'Default', item.unit_price || item.price,
            item.quantity, (item.unit_price || item.price) * item.quantity,
            item.collection_name || null
          ]
        );
      }

      // 3. Insert transaction
      const txnId = `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      await client.query(
        `INSERT INTO payment_transactions (
          id, order_id, checkout_attempt_id, gateway_name, gateway_invoice_id,
          gateway_payment_url, transaction_id, sender_number, payment_method, currency,
          amount, charged_amount, status, verified_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          txnId, orderId, checkoutAttempt.id, 'PAYMENTLY', gatewayInvoiceId,
          checkoutAttempt.gateway_payment_url, transactionId, senderNumber,
          paymentMethod, 'BDT', checkoutAttempt.total_payable, checkoutAttempt.total_payable,
          'PAID', verificationTime, now, now
        ]
      );

      // 4. Update checkout attempt to PAID with order_id
      await client.query(
        `UPDATE checkout_attempts SET status = 'PAID', order_id = $2, updated_at = $3 WHERE id = $1`,
        [checkoutAttempt.id, orderId, now]
      );

      // 5. Initial status history audit records
      const histFulfillId = `HIST-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await client.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [histFulfillId, orderId, 'fulfillment', null, 'Processing', 'SYSTEM', 'Order placed & verified', now]
      );

      const histPayId = `HIST-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await client.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [histPayId, orderId, 'payment', null, 'PAID', 'PAYMENTLY_GATEWAY', `Payment verified via Paymently (TrxID: ${transactionId})`, now]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('[DB Transaction Error createOrderFromVerifiedPayment]:', e.message);
      throw e;
    } finally {
      client.release();
    }
  }

  // Also maintain in memoryStore
  const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
  orderRecord.items = items;
  memoryStore.orders.set(orderId, orderRecord);

  const txnRecord = {
    id: `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    order_id: orderId,
    checkout_attempt_id: checkoutAttempt.id,
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: gatewayInvoiceId || checkoutAttempt.gateway_invoice_id,
    gateway_payment_url: checkoutAttempt.gateway_payment_url,
    transaction_id: transactionId,
    sender_number: senderNumber || checkoutAttempt.customer_phone,
    payment_method: paymentMethod,
    currency: 'BDT',
    amount: checkoutAttempt.total_payable,
    status: 'PAID',
    verified_at: verificationTime,
    created_at: now
  };
  memoryStore.payment_transactions.set(txnRecord.id, txnRecord);

  // Status history in memory
  const histFulfill = {
    id: `HIST-${Date.now().toString(36)}-1`,
    order_id: orderId,
    status_type: 'fulfillment',
    previous_status: null,
    new_status: 'Processing',
    actor_source: 'SYSTEM',
    notes: 'Order placed & verified',
    created_at: now
  };
  const histPay = {
    id: `HIST-${Date.now().toString(36)}-2`,
    order_id: orderId,
    status_type: 'payment',
    previous_status: null,
    new_status: 'PAID',
    actor_source: 'PAYMENTLY_GATEWAY',
    notes: `Payment verified via Paymently (TrxID: ${transactionId})`,
    created_at: now
  };
  memoryStore.order_status_history.set(histFulfill.id, histFulfill);
  memoryStore.order_status_history.set(histPay.id, histPay);

  // Update memory checkout attempt
  checkoutAttempt.status = 'PAID';
  checkoutAttempt.order_id = orderId;
  checkoutAttempt.updated_at = now;
  memoryStore.checkout_attempts.set(checkoutAttempt.id, checkoutAttempt);
  persistFallbackStore();

  return {
    order: orderRecord,
    items,
    transaction: txnRecord
  };
}

/**
 * 6. Explicit Cash on Delivery (COD) Order Creation
 * ONLY created upon explicit user confirmation of COD!
 */
export async function createCodOrder({ checkoutAttempt }) {
  const now = new Date().toISOString();
  const orderId = `AZQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const trackingToken = generateTrackingToken();

  const orderRecord = {
    id: orderId,
    tracking_token: trackingToken,
    checkout_attempt_id: checkoutAttempt.id,
    customer_name: checkoutAttempt.customer_name,
    customer_phone: checkoutAttempt.customer_phone,
    customer_email: checkoutAttempt.customer_email || null,
    shipping_address: checkoutAttempt.shipping_address,
    city: checkoutAttempt.city || 'Dhaka',
    thana: checkoutAttempt.thana || null,
    delivery_area: checkoutAttempt.delivery_area || 'inside',
    notes: checkoutAttempt.notes || null,
    currency: 'BDT',
    subtotal: checkoutAttempt.subtotal,
    delivery_fee: checkoutAttempt.delivery_fee,
    discount: checkoutAttempt.discount || 0,
    total: checkoutAttempt.total_payable,
    promo_code: checkoutAttempt.promo_code || null,
    payment_method: 'COD',
    payment_status: 'PENDING_COD', // Strictly marked PENDING_COD, NOT PAID!
    fulfillment_status: 'Processing',
    order_status: 'Processing',
    gateway_name: 'COD',
    gateway_invoice_id: null,
    gateway_transaction_id: null,
    sender_number: null,
    verified_at: null,
    courier_name: null,
    courier_tracking_id: null,
    dispatched_at: null,
    delivered_at: null,
    created_at: now,
    updated_at: now
  };

  const p = getDbPool();
  if (p) {
    const client = await p.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO orders (
          id, tracking_token, checkout_attempt_id, customer_name, customer_phone, customer_email,
          shipping_address, city, thana, delivery_area, notes, currency, subtotal, delivery_fee,
          discount, total, promo_code, payment_method, payment_status, fulfillment_status, order_status,
          gateway_name, gateway_invoice_id, gateway_transaction_id, sender_number,
          verified_at, courier_name, courier_tracking_id, dispatched_at, delivered_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)`,
        [
          orderRecord.id, orderRecord.tracking_token, orderRecord.checkout_attempt_id, orderRecord.customer_name, orderRecord.customer_phone,
          orderRecord.customer_email, orderRecord.shipping_address, orderRecord.city, orderRecord.thana,
          orderRecord.delivery_area, orderRecord.notes, orderRecord.currency, orderRecord.subtotal, orderRecord.delivery_fee,
          orderRecord.discount, orderRecord.total, orderRecord.promo_code, orderRecord.payment_method,
          orderRecord.payment_status, orderRecord.fulfillment_status, orderRecord.order_status, orderRecord.gateway_name, null, null, null,
          null, null, null, null, null, orderRecord.created_at, orderRecord.updated_at
        ]
      );

      const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
      for (const item of items) {
        const itemId = `ITEM-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, sku, name, variant, unit_price, quantity, total_price, collection_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            itemId, orderId, item.id || item.product_id, item.sku || null,
            item.name, item.variant || 'Default', item.unit_price || item.price,
            item.quantity, (item.unit_price || item.price) * item.quantity,
            item.collection_name || null
          ]
        );
      }

      await client.query(
        `UPDATE checkout_attempts SET status = 'COD_CONFIRMED', order_id = $2, updated_at = $3 WHERE id = $1`,
        [checkoutAttempt.id, orderId, now]
      );

      // Status history
      const histFulfillId = `HIST-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await client.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [histFulfillId, orderId, 'fulfillment', null, 'Processing', 'CUSTOMER_COD', 'Cash on Delivery order confirmed by customer', now]
      );

      const histPayId = `HIST-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await client.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [histPayId, orderId, 'payment', null, 'PENDING_COD', 'CUSTOMER_COD', 'Payment collectable upon doorstep delivery', now]
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('[DB Error createCodOrder]:', e.message);
      throw e;
    } finally {
      client.release();
    }
  }

  const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
  orderRecord.items = items;
  memoryStore.orders.set(orderRecord.id, orderRecord);
  memoryStore.order_items.set(orderRecord.id, items);

  const histFulfill = {
    id: `HIST-${Date.now().toString(36)}-COD-1`,
    order_id: orderId,
    status_type: 'fulfillment',
    previous_status: null,
    new_status: 'Processing',
    actor_source: 'CUSTOMER_COD',
    notes: 'Cash on Delivery order confirmed by customer',
    created_at: now
  };
  const histPay = {
    id: `HIST-${Date.now().toString(36)}-COD-2`,
    order_id: orderId,
    status_type: 'payment',
    previous_status: null,
    new_status: 'PENDING_COD',
    actor_source: 'CUSTOMER_COD',
    notes: 'Payment collectable upon doorstep delivery',
    created_at: now
  };
  memoryStore.order_status_history.set(histFulfill.id, histFulfill);
  memoryStore.order_status_history.set(histPay.id, histPay);

  checkoutAttempt.status = 'COD_CONFIRMED';
  checkoutAttempt.order_id = orderId;
  checkoutAttempt.updated_at = now;
  memoryStore.checkout_attempts.set(checkoutAttempt.id, checkoutAttempt);
  persistFallbackStore();

  return {
    order: orderRecord,
    items
  };
}

/**
 * 7. Manual TrxID Order Creation (Pending Review)
 * Created when customer submits genuine TrxID via official merchant payment portal.
 * Strictly marked PENDING_VERIFICATION (never auto-marked PAID).
 */
export async function createOrderWithManualTrx({
  checkoutAttempt,
  transactionId,
  paymentMethod = 'Paymently Portal'
}) {
  const now = new Date().toISOString();
  const orderId = `AZQ-ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const trackingToken = generateTrackingToken();

  const orderRecord = {
    id: orderId,
    tracking_token: trackingToken,
    checkout_attempt_id: checkoutAttempt.id,
    customer_name: checkoutAttempt.customer_name,
    customer_phone: checkoutAttempt.customer_phone,
    customer_email: checkoutAttempt.customer_email || null,
    shipping_address: checkoutAttempt.shipping_address,
    city: checkoutAttempt.city || 'Dhaka',
    thana: checkoutAttempt.thana || null,
    delivery_area: checkoutAttempt.delivery_area || 'inside',
    notes: checkoutAttempt.notes || null,
    currency: 'BDT',
    subtotal: checkoutAttempt.subtotal,
    delivery_fee: checkoutAttempt.delivery_fee,
    discount: checkoutAttempt.discount || 0,
    total: checkoutAttempt.total_payable,
    promo_code: checkoutAttempt.promo_code || null,
    payment_method: 'PAYMENTLY',
    payment_status: 'PENDING_VERIFICATION',
    fulfillment_status: 'Processing',
    order_status: 'Processing',
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: checkoutAttempt.gateway_invoice_id || checkoutAttempt.id,
    gateway_transaction_id: transactionId,
    sender_number: checkoutAttempt.customer_phone,
    verified_at: null,
    courier_name: null,
    courier_tracking_id: null,
    dispatched_at: null,
    delivered_at: null,
    created_at: now,
    updated_at: now
  };

  const p = getDbPool();
  if (p) {
    const client = await p.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        `INSERT INTO orders (
          id, tracking_token, checkout_attempt_id, customer_name, customer_phone, customer_email,
          shipping_address, city, thana, delivery_area, notes, currency, subtotal, delivery_fee,
          discount, total, promo_code, payment_method, payment_status, fulfillment_status, order_status,
          gateway_name, gateway_invoice_id, gateway_transaction_id, sender_number,
          verified_at, courier_name, courier_tracking_id, dispatched_at, delivered_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32)`,
        [
          orderRecord.id, orderRecord.tracking_token, orderRecord.checkout_attempt_id, orderRecord.customer_name, orderRecord.customer_phone,
          orderRecord.customer_email, orderRecord.shipping_address, orderRecord.city, orderRecord.thana,
          orderRecord.delivery_area, orderRecord.notes, orderRecord.currency, orderRecord.subtotal, orderRecord.delivery_fee,
          orderRecord.discount, orderRecord.total, orderRecord.promo_code, orderRecord.payment_method,
          orderRecord.payment_status, orderRecord.fulfillment_status, orderRecord.order_status, orderRecord.gateway_name,
          orderRecord.gateway_invoice_id, orderRecord.gateway_transaction_id, orderRecord.sender_number,
          null, null, null, null, null, orderRecord.created_at, orderRecord.updated_at
        ]
      );

      const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
      for (const item of items) {
        const itemId = `ITEM-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, sku, name, variant, unit_price, quantity, total_price, collection_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            itemId, orderId, item.id || item.product_id, item.sku || null,
            item.name, item.variant || 'Default', item.unit_price || item.price,
            item.quantity, (item.unit_price || item.price) * item.quantity,
            item.collection_name || null
          ]
        );
      }

      const txnId = `TXN-${Date.now().toString(36).toUpperCase()}`;
      await client.query(
        `INSERT INTO payment_transactions (
          id, order_id, checkout_attempt_id, gateway_name, gateway_invoice_id,
          transaction_id, payment_method, currency, amount, status, verified_at, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          txnId, orderId, checkoutAttempt.id, 'PAYMENTLY',
          orderRecord.gateway_invoice_id, transactionId, paymentMethod,
          'BDT', checkoutAttempt.total_payable, 'PENDING_VERIFICATION', null, now
        ]
      );

      await client.query(
        `UPDATE checkout_attempts SET status = 'PENDING_VERIFICATION', order_id = $2, updated_at = $3 WHERE id = $1`,
        [checkoutAttempt.id, orderId, now]
      );

      // Status history
      const histFulfillId = `HIST-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await client.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [histFulfillId, orderId, 'fulfillment', null, 'Processing', 'CUSTOMER_MANUAL_TRX', 'Order placed via Paymently portal; awaiting manual verification', now]
      );

      const histPayId = `HIST-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await client.query(
        `INSERT INTO order_status_history (id, order_id, status_type, previous_status, new_status, actor_source, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [histPayId, orderId, 'payment', null, 'PENDING_VERIFICATION', 'CUSTOMER_MANUAL_TRX', `Manual TrxID submitted: ${transactionId}`, now]
      );

      await client.query('COMMIT');

      orderRecord.items = items;
      return {
        order: orderRecord,
        items,
        transaction: {
          id: txnId,
          order_id: orderId,
          transaction_id: transactionId,
          amount: checkoutAttempt.total_payable,
          status: 'PENDING_VERIFICATION'
        }
      };
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('[DB Error createOrderWithManualTrx]:', e.message);
      throw e;
    } finally {
      client.release();
    }
  }

  // Fallback in-memory
  const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
  orderRecord.items = items;
  memoryStore.orders.set(orderId, orderRecord);

  const txnRecord = {
    id: `TXN-${Date.now().toString(36).toUpperCase()}`,
    order_id: orderId,
    checkout_attempt_id: checkoutAttempt.id,
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: orderRecord.gateway_invoice_id,
    transaction_id: transactionId,
    payment_method: paymentMethod,
    currency: 'BDT',
    amount: checkoutAttempt.total_payable,
    status: 'PENDING_VERIFICATION',
    created_at: now
  };
  memoryStore.payment_transactions.set(txnRecord.id, txnRecord);

  const histFulfill = {
    id: `HIST-${Date.now().toString(36)}-TRX-1`,
    order_id: orderId,
    status_type: 'fulfillment',
    previous_status: null,
    new_status: 'Processing',
    actor_source: 'CUSTOMER_MANUAL_TRX',
    notes: 'Order placed via Paymently portal; awaiting manual verification',
    created_at: now
  };
  const histPay = {
    id: `HIST-${Date.now().toString(36)}-TRX-2`,
    order_id: orderId,
    status_type: 'payment',
    previous_status: null,
    new_status: 'PENDING_VERIFICATION',
    actor_source: 'CUSTOMER_MANUAL_TRX',
    notes: `Manual TrxID submitted: ${transactionId}`,
    created_at: now
  };
  memoryStore.order_status_history.set(histFulfill.id, histFulfill);
  memoryStore.order_status_history.set(histPay.id, histPay);

  checkoutAttempt.status = 'PENDING_VERIFICATION';
  checkoutAttempt.order_id = orderId;
  checkoutAttempt.updated_at = now;
  memoryStore.checkout_attempts.set(checkoutAttempt.id, checkoutAttempt);
  persistFallbackStore();

  return {
    order: orderRecord,
    items,
    transaction: txnRecord
  };
}

/**
 * 7. Query All Orders (Genuine Records Only)
 */
export async function getAllOrders() {
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query('SELECT * FROM orders ORDER BY created_at DESC');
      return res.rows;
    } catch (e) {
      console.error('[DB Error getAllOrders]:', e.message);
    }
  }
  hydrateFallbackStore();
  return Array.from(memoryStore.orders.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * 8. Query All Transactions (Genuine Records Only)
 */
export async function getAllTransactions() {
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query('SELECT * FROM payment_transactions ORDER BY created_at DESC');
      return res.rows;
    } catch (e) {
      console.error('[DB Error getAllTransactions]:', e.message);
    }
  }
  hydrateFallbackStore();
  return Array.from(memoryStore.payment_transactions.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * 9. Get Single Order with Items
 */
export async function getOrderWithItems(orderId) {
  if (!orderId) return null;
  const p = getDbPool();
  if (p) {
    try {
      const orderRes = await p.query('SELECT * FROM orders WHERE id = $1', [orderId]);
      if (orderRes.rows.length === 0) return null;
      const order = orderRes.rows[0];
      const itemsRes = await p.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
      order.items = itemsRes.rows;
      return order;
    } catch (e) {
      console.error('[DB Error getOrderWithItems]:', e.message);
    }
  }

  hydrateFallbackStore();
  const order = memoryStore.orders.get(orderId);
  if (!order) return null;
  order.items = memoryStore.order_items.get(orderId) || [];
  return order;
}

/**
 * 10. Record Webhook Audit Log
 */
export async function recordWebhookLog({ invoiceId, eventType, payload, isVerified = false }) {
  const p = getDbPool();
  const id = `WH-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  if (p) {
    try {
      await p.query(
        `INSERT INTO payment_webhook_logs (id, gateway_name, invoice_id, event_type, payload, is_verified, processed_at)
         VALUES ($1, 'PAYMENTLY', $2, $3, $4, $5, $6)`,
        [id, invoiceId, eventType || 'PAYMENT_NOTIFICATION', JSON.stringify(payload), isVerified, now]
      );
    } catch (e) {
      console.error('[DB Error recordWebhookLog]:', e.message);
    }
  }

  memoryStore.payment_webhook_logs.set(id, { id, invoiceId, eventType, payload, isVerified, processed_at: now });
}

/**
 * 11. Check if invoice was already fulfilled (Database-level Idempotency)
 */
export async function isInvoiceFulfilled(invoiceId) {
  if (!invoiceId) return false;
  const p = getDbPool();
  if (p) {
    try {
      const res = await p.query(`SELECT id FROM orders WHERE gateway_invoice_id = $1`, [invoiceId]);
      if (res.rows.length > 0) return true;

      const chkRes = await p.query(`SELECT status FROM checkout_attempts WHERE gateway_invoice_id = $1 AND status = 'PAID'`, [invoiceId]);
      if (chkRes.rows.length > 0) return true;
    } catch (e) {
      console.error('[DB Error isInvoiceFulfilled]:', e.message);
    }
  }

  for (const ord of memoryStore.orders.values()) {
    if (ord.gateway_invoice_id === invoiceId) return true;
  }
  for (const att of memoryStore.checkout_attempts.values()) {
    if (att.gateway_invoice_id === invoiceId && att.status === 'PAID') return true;
  }
  return false;
}

