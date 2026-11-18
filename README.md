# AZRAQ — Curated Everyday Goods

> **Tagline:** *Discover better. Live better.*  
> **Descriptor:** CURATED EVERYDAY GOODS  
> **Market:** Bangladesh  
> **Currency:** BDT (৳)  
> **Production Store:** [https://azraq.azraqtrips.com](https://azraq.azraqtrips.com)  
> **Repository:** [https://github.com/istihadahmed007/Azraq-Shop](https://github.com/istihadahmed007/Azraq-Shop)  

---

## 🌟 Architecture & Hosting Topology

AZRAQ operates on a **Unified Standalone Node.js Server Architecture**:

* **Standalone Node.js Server (`server.js`):** A lightweight, provider-independent HTTP server serving the production Vite React SPA (`dist/`) alongside all API routes (`/api/products`, `/api/payments/*`, `/api/orders/*`, `/api/admin/*`, `/api/search-by-image`) and `/health`. Binds to `0.0.0.0` and `process.env.PORT`.
* **Relational Persistence (PostgreSQL):** Stores checkout attempts, confirmed customer orders, payment transaction logs, and append-only status audit histories (`order_status_history`). Fails closed in production if `DATABASE_URL` is omitted.
* **Continuous Integration (GitHub Actions):** Executes all unit, security, localization, direct load, and audit test suites and compiles the production bundle on every push and pull request.

```mermaid
flowchart TD
    Client["Customer Browser (Mobile & Desktop)"]
    NodeServer["Standalone Node.js Server (server.js: 0.0.0.0:PORT)"]
    ViteSPA["Vite React SPA (dist/index.html & assets)"]
    ServerAPI["Native Node.js API Endpoints (/api/*)"]
    PostgresDB[("PostgreSQL Database (Neon / Supabase / VPS)")]
    PaymentlyGW["Paymently Gateway (azraq.paymently.io)"]

    Client -->|HTTP/HTTPS| NodeServer
    NodeServer -->|Static Assets & HTML Fallback| ViteSPA
    NodeServer -->|API Requests| ServerAPI
    ServerAPI -->|Durable Persistence| PostgresDB
    ServerAPI -->|Payment Verification| PaymentlyGW
```

---

## 🔒 Security & Payment Safety Invariants

1. **Server-Side Administrative Authentication:**
   * Every administrative endpoint (`/api/orders`, `/api/payments/transactions`, `/api/payments/refund`, `/api/orders/update-status`) requires a valid `x-admin-key` or `Authorization: Bearer <key>` header.
   * Compares secrets using constant-time `crypto.timingSafeEqual` to prevent timing attacks.
   * **Fail-Closed in Production:** If `ADMIN_API_KEY` is missing or shorter than 8 characters, administrative endpoints reject all incoming requests with HTTP 500.

2. **Durable Database Persistence:**
   * In production (`NODE_ENV=production`), `DATABASE_URL` is strictly required. Persistent write operations (order creation, webhook logs, refunds) reject execution rather than silently dropping data into ephemeral serverless memory.

3. **Ownership-Verified Order Tracking:**
   * Guessable Order IDs alone are never sufficient for authorization.
   * Customers must supply both their Order ID and either their normalized 11-digit mobile number (`018...`) or cryptographically unguessable tracking token (`trk_...`).
   * Responses mask customer names and phone numbers to eliminate PII harvesting.

4. **Payment Authoritativeness & Idempotency:**
   * All prices, delivery fees (Inside Dhaka ৳70 / Outside Dhaka ৳130 / Free >= ৳3,000), and promo discounts are calculated server-side.
   * Orders are only marked `PAID` after authentic provider verification.
   * Repeated webhook and verification calls are processed idempotently.

---

## ⚡ Loading Performance & Storage Resiliency

* **Initial JS Bundle Reduction (>96%):** The initial entry bundle was reduced from **3.58 MB down to 125 kB** (29 kB gzip) by:
  * Extracting the 4.16 MB catalog from the synchronously bundled module graph. An ultra-slim initial catalog (13 kB) renders above-the-fold content instantly, followed by asynchronous hydration of the full catalog.
  * Lazy-loading non-critical overlays (`CheckoutModal`, `OrderTrackingModal`, `AdminPanel`, `VisualSearchModal`, `ProductDetailModal`).
* **Resilient Browser Storage:**
  * Uses a safe storage utility (`src/utils/storage.js`) with versioning, runtime schema validation, and graceful quota-exceeded handling to prevent mobile browser crashes.
  * The master catalog is never written to `localStorage`.

---

## ⚙️ Production Environment Variables

Configure these variables in your deployment environment (e.g. systemd, PM2, Docker, or hosting dashboard):

| Variable Name | Environment | Required | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | Production | No | Listening port for Node.js server (Default: `3000`). |
| `HOST` | Production | No | Interface to bind to (Default: `0.0.0.0`). |
| `NODE_ENV` | Production | Yes | Set to `production` to activate strict fail-closed security. |
| `ADMIN_API_KEY` | Production | Yes | Strong secret token for administrative APIs (min 16 chars). |
| `DATABASE_URL` | Production | Yes | PostgreSQL connection string with SSL (`sslmode=require`). |
| `PAYMENTLY_API_KEY` | Production | Yes | Merchant API key from your Paymently portal. |
| `PAYMENTLY_BASE_URL` | Production | Yes | Default: `https://azraq.paymently.io` |
| `APP_BASE_URL` | Production | Yes | Public URL (e.g. `https://azraq.azraqtrips.com`). |

---

## 🧪 Automated Testing & Verification

Run all test suites locally:

```bash
# Run all 60 audit, security, and storefront tests
npm test

# Run individual test suites
npm run test:payment     # Paymently gateway & verification tests (14 tests)
npm run test:storefront  # Delivery, catalog, and engine tests (10 tests)
npm run test:tracking    # Customer order tracking & authorization (14 tests)
npm run test:locale      # Bengali translation & BDT currency tests (11 tests)
npm run test:security    # Admin auth, durability & storage tests (11 tests)

# Run deployment API smoke tests
npm run smoke:api
```

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/istihadahmed007/Azraq-Shop.git
cd Azraq-Shop

# Install dependencies
npm install

# Start local full-stack dev server (with API middleware)
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

MIT © [AZRAQ](https://github.com/istihadahmed007/Azraq-Shop)
