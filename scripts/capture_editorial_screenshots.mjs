import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const PORT = 3456;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(os.tmpdir(), `chrome-editorial-${Date.now()}`);
const DEBUG_PORT = 9223;
const SCREENSHOT_DIR = path.resolve('tests/screenshots');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// Minimal static server serving dist/ with SPA fallback
function startServer() {
  const distDir = path.resolve('dist');
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';

    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (e) {
      res.writeHead(500);
      res.end('Error');
    }
  });

  return new Promise(resolve => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`Local test server running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

let chromeProcess;

async function run() {
  const server = await startServer();
  fs.mkdirSync(TEMP_USER_DATA, { recursive: true });

  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ], { stdio: 'ignore' });

  // Connect to Chrome DevTools
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
      if (res.ok) {
        const list = await res.json();
        if (list.length > 0 && list[0].webSocketDebuggerUrl) {
          wsUrl = list[0].webSocketDebuggerUrl;
          break;
        }
      }
    } catch (e) {}
  }

  if (!wsUrl) {
    throw new Error('Failed to connect to Chrome');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise(r => (ws.onopen = r));

  let reqId = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await send('Page.enable');
  await send('Runtime.enable');

  const targets = [
    {
      name: '01_storefront_desktop.png',
      url: `http://127.0.0.1:${PORT}/`,
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    },
    {
      name: '01b_products_section_desktop.png',
      url: `http://127.0.0.1:${PORT}/`,
      viewport: { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false },
      scroll: '#popular-products'
    },
    {
      name: '02_storefront_mobile.png',
      url: `http://127.0.0.1:${PORT}/`,
      viewport: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
    },
    {
      name: '03_category_desktop.png',
      url: `http://127.0.0.1:${PORT}/collections`,
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    },
    {
      name: '04_product_detail_desktop.png',
      url: `http://127.0.0.1:${PORT}/product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002`,
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    },
    {
      name: '07_login_page_desktop.png',
      url: `http://127.0.0.1:${PORT}/login`,
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    },
    {
      name: '08_admin_portal_desktop.png',
      url: `http://127.0.0.1:${PORT}/admin`,
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
    }
  ];

  for (const t of targets) {
    console.log(`\nNavigating to: ${t.url} (${t.viewport.width}x${t.viewport.height})...`);
    await send('Emulation.setDeviceMetricsOverride', t.viewport);
    await send('Page.navigate', { url: t.url });

    // Wait for page to render and images/fonts to settle
    await new Promise(r => setTimeout(r, 2500));

    if (t.scroll) {
      await send('Runtime.evaluate', {
        expression: `document.querySelector('${t.scroll}')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 1200));
    }

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(SCREENSHOT_DIR, t.name);
    fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
    console.log(`Saved screenshot: ${outPath} (${Math.round(screenshot.data.length / 1024)} KB)`);
  }

  ws.close();
  chromeProcess.kill();
  server.close();
  try { fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true }); } catch (e) {}

  console.log('\nAll editorial verification screenshots captured successfully!');
}

run().catch(err => {
  console.error('Screenshot error:', err);
  if (chromeProcess) chromeProcess.kill();
  process.exit(1);
});
