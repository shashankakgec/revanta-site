import { neon } from '@neondatabase/serverless';

const ALLOWED = new Set(['jaiswalshashank100@gmail.com', 'shashank2310131@akgec.ac.in']);
const STATUSES = new Set(['New', 'Contacted', 'Meeting Booked', 'Won', 'Lost']);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'PATCH') {
    res.setHeader('Allow', 'GET, PATCH');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  try {
    const authUrl = String(process.env.NEON_AUTH_URL || '').replace(/\\/+$/, '');
    if (!authUrl) return res.status(503).json({ error: 'auth_not_configured' });
    const host = req.headers.host || '';
    const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
    const origin = host ? proto + '://' + host : '';
    const auth = await fetch(authUrl + '/get-session', {
      headers: {
        cookie: req.headers.cookie || '',
        ...(origin ? { origin, referer: origin + String(req.url || '/') } : {}),
        accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!auth.ok) return res.status(401).json({ error: 'unauthorised' });
    const payload = await auth.json().catch(() => ({}));
    const user = payload.user || payload.data?.user || payload.session?.user || payload.data?.session?.user;
    if (!user || !user.email) return res.status(401).json({ error: 'unauthorised' });
    if (!ALLOWED.has(String(user.email || '').toLowerCase())) return res.status(403).json({ error: 'forbidden' });
    if (!process.env.NEON_DATABASE_URL) return res.status(503).json({ error: 'database_not_configured' });
    const sql = neon(process.env.NEON_DATABASE_URL);
    if (req.method === 'GET') {
      const leads = await sql`SELECT id, name, email, industry, budget, form_type, created_at, page_path, status, follow_up_at, internal_notes FROM public.leads ORDER BY created_at DESC LIMIT 500`;
      return res.status(200).json({ leads });
    }
    let body = req.body || {};
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const id = String(body.id || '');
    const status = String(body.status || '');
    const follow = body.follow_up_at ? new Date(body.follow_up_at) : null;
    const notes = String(body.internal_notes || '').trim().slice(0, 4000);
    if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: 'invalid_lead_id' });
    if (!STATUSES.has(status)) return res.status(400).json({ error: 'invalid_status' });
    if (follow && Number.isNaN(follow.getTime())) return res.status(400).json({ error: 'invalid_follow_up_date' });
    const result = await sql`UPDATE public.leads SET status = ${status}, follow_up_at = ${follow ? follow.toISOString() : null}, internal_notes = ${notes || null}, updated_at = NOW() WHERE id = ${id} RETURNING id, status, follow_up_at, internal_notes`;
    if (!result.length) return res.status(404).json({ error: 'lead_not_found' });
    return res.status(200).json({ lead: result[0] });
  } catch (err) {
    console.error('[dashboard-leads] request failed:', err && err.message);
    return res.status(500).json({ error: 'dashboard_request_failed' });
  }
}
