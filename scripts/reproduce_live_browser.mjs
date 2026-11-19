import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_USER_DATA = path.join(os.tmpdir(), `chrome-test-${Date.now()}`);
const DEBUG_PORT = 9222;

const targetUrl = process.argv[2] || 'https://azraq.azraqtrips.com/product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002';

console.log('='.repeat(72));
console.log('🌐 HEADLESS CHROME DIRECT LOAD & HARD REFRESH INSPECTION');
console.log('Target URL:', targetUrl);
console.log('='.repeat(72));

let chromeProcess;

async function run() {
  fs.mkdirSync(TEMP_USER_DATA, { recursive: true });

  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${TEMP_USER_DATA}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for DevTools port to open
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
    } catch (e) {
      // waiting
    }
  }

  if (!wsUrl) {
    throw new Error('Failed to connect to Chrome DevTools port 9222');
  }

  console.log('Connected to Chrome DevTools:', wsUrl);

  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const networkRequests = new Map();
  const consoleMessages = [];
  const runtimeExceptions = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
      return;
    }

    if (data.method === 'Network.requestWillBeSent') {
      const req = data.params.request;
      networkRequests.set(data.params.requestId, {
        url: req.url,
        method: req.method,
        status: null,
        failed: false,
        mimeType: null
      });
    } else if (data.method === 'Network.responseReceived') {
      const entry = networkRequests.get(data.params.requestId);
      if (entry) {
        entry.status = data.params.response.status;
        entry.mimeType = data.params.response.mimeType;
      }
    } else if (data.method === 'Network.loadingFailed') {
      const entry = networkRequests.get(data.params.requestId);
      if (entry) {
        entry.failed = true;
        entry.errorText = data.params.errorText;
      }
    } else if (data.method === 'Console.messageAdded') {
      consoleMessages.push(data.params.message);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push({
        type: data.params.type,
        text: data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ')
      });
    } else if (data.method === 'Runtime.exceptionThrown') {
      runtimeExceptions.push(data.params.exceptionDetails);
    }
  };

  // Enable DevTools domains
  await send('Page.enable');
  await send('Network.enable');
  await send('Console.enable');
  await send('Runtime.enable');

  // Disable cache for true cold hard refresh
  await send('Network.setCacheDisabled', { cacheDisabled: true });

  console.log('\nNavigating to target URL...');
  await send('Page.navigate', { url: targetUrl });

  // Wait 4 seconds for page to mount and hydrate
  console.log('Waiting for load and hydration...');
  await new Promise(r => setTimeout(r, 4000));

  // Evaluate DOM state
  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const root = document.getElementById('root');
      const hasInitialLoader = !!document.querySelector('#root > div[style*=\"azraq-pulse\"]');
      const title = document.title;
      const h1 = document.querySelector('h1')?.innerText || null;
      const h2 = document.querySelector('h2')?.innerText || null;
      const rootHtmlSnippet = root ? root.innerHTML.slice(0, 300) : 'NO_ROOT';
      const isProductRendered = !!document.querySelector('[data-product-id]') || rootHtmlSnippet.includes('Yonex') || rootHtmlSnippet.includes('AZQ-');
      return {
        title,
        h1,
        h2,
        hasInitialLoader,
        isProductRendered,
        rootHtmlLength: root ? root.innerHTML.length : 0,
        rootHtmlSnippet
      };
    })()`,
    returnByValue: true
  });

  console.log('\n--- DOM Evaluation Result ---');
  console.log(evalResult.result.value);

  console.log('\n--- Network Requests ---');
  for (const [id, req] of networkRequests) {
    const isError = req.status >= 400 || req.failed;
    const prefix = isError ? '❌' : '✓';
    console.log(`${prefix} [${req.method}] ${req.status || 'FAILED'} ${req.url} (${req.mimeType || req.errorText || ''})`);
  }

  console.log('\n--- Console Logs & Messages ---');
  if (consoleMessages.length === 0) {
    console.log('No console messages.');
  } else {
    for (const msg of consoleMessages) {
      console.log(`[${msg.type || msg.level}] ${msg.text}`);
    }
  }

  console.log('\n--- Runtime Exceptions ---');
  if (runtimeExceptions.length === 0) {
    console.log('No runtime exceptions.');
  } else {
    for (const ex of runtimeExceptions) {
      console.error('Exception:', ex.text || ex.exception?.description);
    }
  }

  ws.close();
}

try {
  await run();
} catch (err) {
  console.error('Error in headless runner:', err);
} finally {
  if (chromeProcess && !chromeProcess.killed) {
    chromeProcess.kill();
  }
  try {
    fs.rmSync(TEMP_USER_DATA, { recursive: true, force: true });
  } catch (e) {}
}
