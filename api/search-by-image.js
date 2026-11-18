import { searchProductsByImage } from '../server/visualSearchService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (!body) {
      // Buffer raw Node http stream when running in standalone server or custom runner
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawText = Buffer.concat(chunks).toString('utf8');
      if (rawText) {
        try {
          body = JSON.parse(rawText);
        } catch (e) {
          body = { imageBase64: rawText };
        }
      }
    } else if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    const result = await searchProductsByImage(body || {});
    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/search-by-image Error]:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
}
