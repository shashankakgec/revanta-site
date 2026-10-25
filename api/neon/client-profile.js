import { neon } from '@neondatabase/serverless';

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}
function sameOrigin(req) {
  if (!req.headers.origin) return true;
  try { return new URL(req.headers.origin).host === req.headers.host; } catch { return false; }
}
async function getUser(req) {
  const authUrl = String(process.env.NEON_AUTH_URL || '').replace(/\/+$/, '');
  if (!authUrl || !req.headers.cookie) return null;
  const response = await fetch(authUrl + '/get-session', {
    headers: { cookie: req.headers.cookie, accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const data = await response.json().catch(() => null);
  const user = data && (data.user || (data.data && data.data.user) || (data.session && data.session.user) || (data.data && data.data.session && data.data.session.user));
  return user && user.id ? { id: user.id, name: user.name || '' } : null;
}
export default async function handler(req, res) {
  if (!sameOrigin(req)) return send(res, 403, { error: 'forbidden' });
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'method_not_allowed' });
  }
  try {
    const user = await getUser(req);
    if (!user) return send(res, 401, { error: 'sign_in_required' });
    if (!process.env.NEON_DATABASE_URL) return send(res, 503, { error: 'database_not_configured' });
    const db = neon(process.env.NEON_DATABASE_URL);
    if (req.method === 'GET') {
      const [profile] = await db`SELECT full_name, business_name FROM public.client_profiles WHERE user_id = ${user.id}::uuid`;
      return send(res, 200, { profile: profile || null });
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const fullName = String(body.full_name || user.name || '').trim().slice(0, 100);
    const businessName = String(body.business_name || '').trim().slice(0, 150);
    if (!fullName || !businessName) return send(res, 422, { error: 'name_and_business_required' });
    const [profile] = await db`INSERT INTO public.client_profiles (user_id, full_name, business_name, updated_at)
      VALUES (${user.id}::uuid, ${fullName}, ${businessName}, now())
      ON CONFLICT (user_id) DO UPDATE SET full_name=EXCLUDED.full_name, business_name=EXCLUDED.business_name, updated_at=now()
      RETURNING full_name, business_name`;
    return send(res, 200, { profile });
  } catch (error) {
    console.error('[client profile api]', error && error.message);
    return send(res, 500, { error: 'profile_save_failed' });
  }
}
