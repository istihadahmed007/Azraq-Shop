import pg from 'pg';

const { Pool } = pg;

let pool = null;
let isInitialized = false;

// Fallback in-memory store for local environments without DATABASE_URL
// ALWAYS STARTS COMPLETELY EMPTY — NO DUMMY OR FAKE TRANSACTIONS
const memoryStore = {
  checkout_attempts: new Map(),
  orders: new Map(),
  order_items: new Map(),
  payment_transactions: new Map(),
  payment_webhook_logs: new Map()
};

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
            checkout_attempt_id VARCHAR(100) REFERENCES checkout_attempts(id) ON DELETE SET NULL,
            customer_name VARCHAR(255) NOT NULL,
            customer_phone VARCHAR(50) NOT NULL,
            customer_email VARCHAR(255),
            shipping_address TEXT NOT NULL,
            city VARCHAR(100) DEFAULT 'Dhaka',
            thana VARCHAR(100),
            delivery_area VARCHAR(20) DEFAULT 'inside',
            notes TEXT,
            subtotal NUMERIC(12, 2) NOT NULL,
            delivery_fee NUMERIC(10, 2) NOT NULL,
            discount NUMERIC(10, 2) DEFAULT 0.00,
            total NUMERIC(12, 2) NOT NULL,
            promo_code VARCHAR(50),
            payment_method VARCHAR(50) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            order_status VARCHAR(50) DEFAULT 'Processing',
            gateway_name VARCHAR(50) DEFAULT 'PAYMENTLY',
            gateway_invoice_id VARCHAR(100),
            gateway_transaction_id VARCHAR(100),
            sender_number VARCHAR(30),
            verified_at TIMESTAMPTZ,
            courier_name VARCHAR(100),
            courier_tracking_id VARCHAR(100),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

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
  return updated;
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

  const orderRecord = {
    id: orderId,
    checkout_attempt_id: checkoutAttempt.id,
    customer_name: checkoutAttempt.customer_name,
    customer_phone: checkoutAttempt.customer_phone,
    customer_email: checkoutAttempt.customer_email || null,
    shipping_address: checkoutAttempt.shipping_address,
    city: checkoutAttempt.city || 'Dhaka',
    thana: checkoutAttempt.thana || null,
    delivery_area: checkoutAttempt.delivery_area || 'inside',
    notes: checkoutAttempt.notes || null,
    subtotal: checkoutAttempt.subtotal,
    delivery_fee: checkoutAttempt.delivery_fee,
    discount: checkoutAttempt.discount || 0,
    total: checkoutAttempt.total_payable,
    promo_code: checkoutAttempt.promo_code || null,
    payment_method: 'PAYMENTLY',
    payment_status: 'PAID',
    order_status: 'Processing',
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: gatewayInvoiceId || checkoutAttempt.gateway_invoice_id,
    gateway_transaction_id: transactionId,
    sender_number: senderNumber || checkoutAttempt.customer_phone,
    verified_at: verificationTime,
    courier_name: null,
    courier_tracking_id: null,
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
          id, checkout_attempt_id, customer_name, customer_phone, customer_email,
          shipping_address, city, thana, delivery_area, notes, subtotal, delivery_fee,
          discount, total, promo_code, payment_method, payment_status, order_status,
          gateway_name, gateway_invoice_id, gateway_transaction_id, sender_number,
          verified_at, courier_name, courier_tracking_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
        [
          orderRecord.id, orderRecord.checkout_attempt_id, orderRecord.customer_name, orderRecord.customer_phone,
          orderRecord.customer_email, orderRecord.shipping_address, orderRecord.city, orderRecord.thana,
          orderRecord.delivery_area, orderRecord.notes, orderRecord.subtotal, orderRecord.delivery_fee,
          orderRecord.discount, orderRecord.total, orderRecord.promo_code, orderRecord.payment_method,
          orderRecord.payment_status, orderRecord.order_status, orderRecord.gateway_name, orderRecord.gateway_invoice_id,
          orderRecord.gateway_transaction_id, orderRecord.sender_number, orderRecord.verified_at,
          orderRecord.courier_name, orderRecord.courier_tracking_id, orderRecord.created_at, orderRecord.updated_at
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
  memoryStore.orders.set(orderRecord.id, orderRecord);
  const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
  memoryStore.order_items.set(orderRecord.id, items);

  const txnRecord = {
    id: `TXN-${Date.now().toString(36).toUpperCase()}`,
    order_id: orderId,
    checkout_attempt_id: checkoutAttempt.id,
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: gatewayInvoiceId,
    transaction_id: transactionId,
    payment_method: paymentMethod,
    currency: 'BDT',
    amount: checkoutAttempt.total_payable,
    status: 'PAID',
    verified_at: verificationTime,
    created_at: now
  };
  memoryStore.payment_transactions.set(txnRecord.id, txnRecord);

  // Update memory checkout attempt
  checkoutAttempt.status = 'PAID';
  checkoutAttempt.order_id = orderId;
  checkoutAttempt.updated_at = now;
  memoryStore.checkout_attempts.set(checkoutAttempt.id, checkoutAttempt);

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

  const orderRecord = {
    id: orderId,
    checkout_attempt_id: checkoutAttempt.id,
    customer_name: checkoutAttempt.customer_name,
    customer_phone: checkoutAttempt.customer_phone,
    customer_email: checkoutAttempt.customer_email || null,
    shipping_address: checkoutAttempt.shipping_address,
    city: checkoutAttempt.city || 'Dhaka',
    thana: checkoutAttempt.thana || null,
    delivery_area: checkoutAttempt.delivery_area || 'inside',
    notes: checkoutAttempt.notes || null,
    subtotal: checkoutAttempt.subtotal,
    delivery_fee: checkoutAttempt.delivery_fee,
    discount: checkoutAttempt.discount || 0,
    total: checkoutAttempt.total_payable,
    promo_code: checkoutAttempt.promo_code || null,
    payment_method: 'COD',
    payment_status: 'PENDING_COD', // Strictly marked PENDING_COD, NOT PAID!
    order_status: 'Confirmed',
    gateway_name: 'COD',
    gateway_invoice_id: null,
    gateway_transaction_id: null,
    sender_number: null,
    verified_at: null,
    courier_name: null,
    courier_tracking_id: null,
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
          id, checkout_attempt_id, customer_name, customer_phone, customer_email,
          shipping_address, city, thana, delivery_area, notes, subtotal, delivery_fee,
          discount, total, promo_code, payment_method, payment_status, order_status,
          gateway_name, gateway_invoice_id, gateway_transaction_id, sender_number,
          verified_at, courier_name, courier_tracking_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
        [
          orderRecord.id, orderRecord.checkout_attempt_id, orderRecord.customer_name, orderRecord.customer_phone,
          orderRecord.customer_email, orderRecord.shipping_address, orderRecord.city, orderRecord.thana,
          orderRecord.delivery_area, orderRecord.notes, orderRecord.subtotal, orderRecord.delivery_fee,
          orderRecord.discount, orderRecord.total, orderRecord.promo_code, orderRecord.payment_method,
          orderRecord.payment_status, orderRecord.order_status, orderRecord.gateway_name, null, null, null,
          null, null, null, orderRecord.created_at, orderRecord.updated_at
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

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('[DB Error createCodOrder]:', e.message);
      throw e;
    } finally {
      client.release();
    }
  }

  memoryStore.orders.set(orderRecord.id, orderRecord);
  const items = Array.isArray(checkoutAttempt.items_snapshot) ? checkoutAttempt.items_snapshot : [];
  memoryStore.order_items.set(orderRecord.id, items);

  checkoutAttempt.status = 'COD_CONFIRMED';
  checkoutAttempt.order_id = orderId;
  checkoutAttempt.updated_at = now;
  memoryStore.checkout_attempts.set(checkoutAttempt.id, checkoutAttempt);

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

  const orderRecord = {
    id: orderId,
    checkout_attempt_id: checkoutAttempt.id,
    customer_name: checkoutAttempt.customer_name,
    customer_phone: checkoutAttempt.customer_phone,
    customer_email: checkoutAttempt.customer_email || null,
    shipping_address: checkoutAttempt.shipping_address,
    city: checkoutAttempt.city || 'Dhaka',
    thana: checkoutAttempt.thana || null,
    delivery_area: checkoutAttempt.delivery_area || 'inside',
    notes: checkoutAttempt.notes || null,
    subtotal: checkoutAttempt.subtotal,
    delivery_fee: checkoutAttempt.delivery_fee,
    discount: checkoutAttempt.discount || 0,
    total: checkoutAttempt.total_payable,
    promo_code: checkoutAttempt.promo_code || null,
    payment_method: 'PAYMENTLY',
    payment_status: 'PENDING_VERIFICATION',
    order_status: 'Processing',
    gateway_name: 'PAYMENTLY',
    gateway_invoice_id: checkoutAttempt.gateway_invoice_id || checkoutAttempt.id,
    gateway_transaction_id: transactionId,
    sender_number: checkoutAttempt.customer_phone,
    verified_at: null,
    courier_name: null,
    courier_tracking_id: null,
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
          id, checkout_attempt_id, customer_name, customer_phone, customer_email,
          shipping_address, city, thana, delivery_area, notes, subtotal, delivery_fee,
          discount, total, promo_code, payment_method, payment_status, order_status,
          gateway_name, gateway_invoice_id, gateway_transaction_id, sender_number,
          verified_at, courier_name, courier_tracking_id, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)`,
        [
          orderRecord.id, orderRecord.checkout_attempt_id, orderRecord.customer_name, orderRecord.customer_phone,
          orderRecord.customer_email, orderRecord.shipping_address, orderRecord.city, orderRecord.thana,
          orderRecord.delivery_area, orderRecord.notes, orderRecord.subtotal, orderRecord.delivery_fee,
          orderRecord.discount, orderRecord.total, orderRecord.promo_code, orderRecord.payment_method,
          orderRecord.payment_status, orderRecord.order_status, orderRecord.gateway_name,
          orderRecord.gateway_invoice_id, orderRecord.gateway_transaction_id, orderRecord.sender_number,
          null, null, null, orderRecord.created_at, orderRecord.updated_at
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

  checkoutAttempt.status = 'PENDING_VERIFICATION';
  checkoutAttempt.order_id = orderId;
  checkoutAttempt.updated_at = now;
  memoryStore.checkout_attempts.set(checkoutAttempt.id, checkoutAttempt);

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

