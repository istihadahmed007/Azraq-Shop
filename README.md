# AZRAQ — Curated Everyday Goods

> **Tagline:** *Discover better. Live better.*  
> **Descriptor:** CURATED EVERYDAY GOODS  
> **Market:** Bangladesh  
> **Currency:** BDT (৳)  
> **Repository:** [https://github.com/istihadahmed007/Azraq-Shop](https://github.com/istihadahmed007/Azraq-Shop)  

---

## 🌟 Overview

**AZRAQ** is a premium, modern e-commerce platform built for the Bangladesh market, combining a futuristic visual design system inspired by the Nexora editorial aesthetic with a complete dropshipping catalog ingestion from [EasyDrop Asia](https://easydrop.asia/new-store).

---

## 🚀 Key Features

### 1. Complete 18-Collection Taxonomy Ingestion
- Ingests **all 18 official supplier collections** from EasyDrop (IDs: 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22).
- **1,206 authentic unique products** with multi-photo image galleries, authentic specifications, and verified real-time stock statuses.

### 2. Strict Pricing Governance
- **100% EasyDrop Retail Price:** All products display the exact supplier retail price in BDT (৳) with **zero markup**.
- **No Artificial Discounts:** Zero synthetic crossed-out original prices or fake markdown percentages.
- **Supplier Privacy:** Private supplier buying costs are strictly secluded inside the administrative portal and never exposed to customers.

### 3. Authentic Description Preservation
- Every product preserves 100% of the original manufacturer descriptions, technical bullet points, measurements, Bengali phrasing, and specs with zero AI rewriting or hallucination.

### 4. Futuristic Nexora-Inspired Visual Identity
- **Palette:** Deep Navy (`#12233F`), Azure Blue (`#2677D9`), Lavender (`#EAE5FF`), Soft Purple (`#A78BFA`), Violet (`#7955E8`), and Neon-Lime (`#C9F34A`).
- **Floating 3D Hero Composition:** Elevated product cards with a circular violet aura, floating dot matrix accents, and an interactive glass ingestion badge (`18 Collections • 1206 Products`).
- **Signature Action Buttons:** High-contrast neon-lime pill and circular buttons (`#C9F34A`) featuring dark navy arrow badges (`#12233F`) with drop-shadow glows.
- **Dark Feature Bar & Brand Pillars:** 4 core brand pillars (*Innovative Design*, *Powerful Performance*, *Seamless Connectivity*, *Secure by Default*).
- **Interactive Multi-Collection Browsing:** Sibling category filter pills, dual layout modes (Editorial Visual Grid vs. Compact High-Density List), dynamic search, and price sorting.
- **Domestic Bangladesh Checkout:** Support for Cash on Delivery (COD), bKash, and Nagad, complete with automated shipping fee calculation (Dhaka: ৳70, Outside Dhaka: ৳130, Free delivery over ৳3,000).

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS with custom color extensions
- **Icons:** Lucide React
- **Deployment:** GitHub Pages / GitHub Actions

---

## 💻 Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/istihadahmed007/Azraq-Shop.git
cd Azraq-Shop
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📂 Project Structure

```
├── .github/workflows/deploy.yml     # Automated GitHub Pages CI/CD workflow
├── database/schema.sql              # Relational PostgreSQL architecture
├── src/
│   ├── components/                  # UI components (Header, Hero, ProductGrid, etc.)
│   ├── context/ShopContext.jsx      # Global multi-collection state & cart manager
│   ├── data/
│   │   ├── central_products.json    # 1,206 deduplicated master products
│   │   ├── collections.json         # 18 official supplier collections
│   │   └── reconciliation_report.json # Supplier ingestion audit report
│   ├── App.jsx                      # Main application view router
│   ├── main.jsx                     # Vite entry point
│   └── index.css                    # Tailwind CSS configuration
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 📄 License

MIT © [AZRAQ](https://github.com/istihadahmed007/Azraq-Shop)
