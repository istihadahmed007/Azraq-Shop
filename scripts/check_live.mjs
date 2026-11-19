async function check() {
  const url = 'https://azraq.azraqtrips.com/product/yonex-astrox-100-zz-yonex-mastet-copy-azq-0002';
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
  console.log('Status:', res.status);
  console.log('Response Headers:', Object.fromEntries(res.headers.entries()));
  const html = await res.text();
  console.log('HTML length:', html.length);
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/gi;
  const linkRegex = /<link[^>]+href=["']([^"']+)["']/gi;
  const scripts = [];
  const links = [];
  let m;
  while ((m = scriptRegex.exec(html)) !== null) scripts.push(m[1]);
  while ((m = linkRegex.exec(html)) !== null) links.push(m[1]);

  console.log('Scripts in live HTML:', scripts);
  console.log('Links in live HTML:', links);

  for (const s of scripts) {
    const fullUrl = new URL(s, url).href;
    const r = await fetch(fullUrl, { headers: { 'Cache-Control': 'no-cache' } });
    const text = await r.text();
    console.log('Script:', s);
    console.log('  Resolved URL:', fullUrl);
    console.log('  Status:', r.status);
    console.log('  Content-Type:', r.headers.get('content-type'));
    console.log('  Content Length:', text.length);
    console.log('  Preview (first 100 chars):', text.slice(0, 100));
  }

  for (const l of links) {
    if (l.includes('.css') || l.includes('.js')) {
      const fullUrl = new URL(l, url).href;
      const r = await fetch(fullUrl, { headers: { 'Cache-Control': 'no-cache' } });
      const text = await r.text();
      console.log('Link:', l);
      console.log('  Resolved URL:', fullUrl);
      console.log('  Status:', r.status);
      console.log('  Content-Type:', r.headers.get('content-type'));
      console.log('  Content Length:', text.length);
    }
  }
}
check().catch(console.error);
