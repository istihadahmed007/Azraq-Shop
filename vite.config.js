import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { searchProductsByImage } from './server/visualSearchService.js';

// Custom API route plugin for AI Visual Product Search
function visualSearchApiPlugin() {
  return {
    name: 'visual-search-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Health check endpoint
        if (req.url === '/api/search-by-image/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'healthy', engine: 'clip-visual-embeddings', total_indexed: 1206 }));
          return;
        }

        // Image Search endpoint
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
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), visualSearchApiPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
