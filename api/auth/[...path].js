// Same-origin proxy for Neon Managed Auth. Keeps the session cookie on the Revanta host.
const AUTH_URL = String(process.env.NEON_AUTH_URL || '').replace(/\/+$/, '');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!AUTH_URL) return res.status(503).json({ error: 'auth_not_configured' });

  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : String(req.query.path || '');
  const queryIndex = String(req.url || '').indexOf('?');
  const search = queryIndex >= 0 ? String(req.url).slice(queryIndex) : '';
  const host = req.headers.host;
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const origin = process.env.VERCEL_ENV === 'preview' ? 'https://revanta-site-git-feature-neon-full-migration-hello-shas.vercel.app' : (host ? proto + '://' + host : '');
  const headers = new Headers();
  for (const key of ['accept', 'content-type', 'cookie', 'authorization', 'user-agent']) {
    if (req.headers[key]) headers.set(key, String(req.headers[key]));
  }
  if (origin) {
    headers.set('origin', origin);
    headers.set('referer', origin + String(req.url || '/'));
  }

  let body;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body == null ? {} : req.body);
  }

  try {
    const upstream = await fetch(AUTH_URL + '/' + path + search, {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
    });
    // Avoid Headers.getSetCookie(), which throws Illegal invocation in this runtime.
    const cookie = upstream.headers.get('set-cookie');
    if (cookie) res.setHeader('Set-Cookie', cookie.replace(/;\s*Domain=[^;]+/ig, ''));
    for (const key of ['content-type', 'cache-control', 'www-authenticate']) {
      const value = upstream.headers.get(key);
      if (value) res.setHeader(key, value);
    }
    const text = await upstream.text();
    return res.status(upstream.status).send(text);
  } catch (error) {
    console.error('[neon-auth-proxy] request failed:', error && error.message);
    return res.status(502).json({ error: 'auth_upstream_failed' });
  }
}
