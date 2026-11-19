import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { searchProductsByImage } from './server/visualSearchService.js';
import { handlePaymentRoutes } from './server/paymentRoutes.js';
import productsHandler from './api/products/index.js';

// Custom API route plugin for AI Visual Product Search & Paymently Gateway
function azraqApiPlugin() {
  const attachMiddleware = (server) => {
    server.middlewares.use(async (req, res, next) => {
      // 1. Paymently Gateway API & Checkout Session Endpoints & Order Tracking & Admin API
      if (req.url?.startsWith('/api/payments') || req.url?.startsWith('/api/orders') || req.url?.startsWith('/api/admin') || req.url?.startsWith('/payment-checkout')) {
        const handled = await handlePaymentRoutes(req, res);
        if (handled) return;
      }

      // 1b. Standalone Product Retrieval Endpoint
      if (req.url?.startsWith('/api/products')) {
        await productsHandler(req, res);
        return;
      }

      // 2. Visual Search Health check endpoint
      if (req.url === '/api/search-by-image/health' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'healthy', engine: 'clip-visual-embeddings', total_indexed: 1206 }));
        return;
      }

      // 3. Visual Search Image Search endpoint
      if (req.url?.startsWith('/api/search-by-image') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const payload = JSON.parse(body);
            const searchResult = await searchProductsByImage(payload);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(searchResult));
          } catch (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }

      next();
    });
  };

  return {
    name: 'azraq-api-endpoints',
    configureServer(server) {
      attachMiddleware(server);
    },
    configurePreviewServer(server) {
      attachMiddleware(server);
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), azraqApiPlugin()],
  server: {
    port: 3000,
    open: false
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash]-v3.js',
        chunkFileNames: 'assets/[name]-[hash]-v3.js',
        assetFileNames: 'assets/[name]-[hash]-v3.[ext]',
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        }
      }
    }
  }
});
