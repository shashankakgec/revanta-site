import { neon } from '@neondatabase/serverless';

const STAFF_EMAILS = new Set(['jaiswalshashank100@gmail.com', 'shashank2310131@akgec.ac.in']);
function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}
async function getStaff(req) {
  const authUrl = String(process.env.NEON_AUTH_URL || '').replace(/\/+$/, '');
  if (!authUrl || !req.headers.cookie) return null;
  const host = req.headers.host || '';
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const origin = process.env.VERCEL_ENV === 'preview'
    ? 'https://revanta-site-git-feature-neon-full-migration-hello-shas.vercel.app'
    : (host ? proto + '://' + host : '');
  const response = await fetch(authUrl + '/get-session', {
    headers: { cookie: req.headers.cookie || '', ...(origin ? { origin, referer: origin + String(req.url || '/') } : {}), accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const payload = await response.json().catch(() => ({}));
  const user = payload && (payload.user || payload.data?.user || payload.session?.user || payload.data?.session?.user);
  if (!user || !user.email) return null;
  const email = String(user.email).toLowerCase();
  return STAFF_EMAILS.has(email) ? { email } : { forbidden: true };
}
export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return send(res, 405, { error: 'method_not_allowed' }); }
  if (!sameOrigin(req)) return send(res, 403, { error: 'forbidden' });
  try {
    const staff = await getStaff(req);
    if (!staff) return send(res, 401, { error: 'unauthorised' });
    if (staff.forbidden) return send(res, 403, { error: 'forbidden' });
    if (!process.env.NEON_DATABASE_URL) return send(res, 503, { error: 'database_not_configured' });
    const sql = neon(process.env.NEON_DATABASE_URL);
    const summaryRows = await sql`SELECT COUNT(*)::int AS unique_visitors,
      COUNT(*) FILTER (WHERE visit_count > 1)::int AS returning_visitors,
      COALESCE(SUM(visit_count), 0)::int AS total_visits
      FROM public.website_visitors`;
    const timeRows = await sql`SELECT COUNT(*)::int AS total_sessions,
      COALESCE(SUM(active_seconds), 0)::int AS active_seconds,
      COALESCE(SUM(passive_seconds), 0)::int AS passive_seconds,
      COALESCE(ROUND(AVG(active_seconds))::int, 0) AS avg_active_seconds
      FROM public.visitor_sessions`;
    const visitors = await sql`SELECT v.visitor_id, v.first_seen, v.last_seen, v.visit_count, v.consented_at,
      COALESCE(s.session_count, 0)::int AS session_count,
      COALESCE(s.active_seconds, 0)::int AS active_seconds,
      COALESCE(s.passive_seconds, 0)::int AS passive_seconds,
      COALESCE(s.sessions, '[]'::json) AS sessions,
      l.name AS lead_name, l.email AS lead_email, l.created_at AS lead_created_at
      FROM public.website_visitors v
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS session_count, COALESCE(SUM(active_seconds), 0)::int AS active_seconds,
          COALESCE(SUM(passive_seconds), 0)::int AS passive_seconds,
          json_agg(json_build_object('session_id', session_id, 'started_at', started_at, 'last_seen', last_seen,
            'ended_at', ended_at, 'active_seconds', active_seconds, 'passive_seconds', passive_seconds,
            'page_paths', page_paths) ORDER BY started_at DESC) AS sessions
        FROM public.visitor_sessions WHERE visitor_id = v.visitor_id
      ) s ON true
      LEFT JOIN LATERAL (
        SELECT name, email, created_at FROM public.leads WHERE visitor_id = v.visitor_id
        ORDER BY created_at DESC LIMIT 1
      ) l ON true
      ORDER BY v.last_seen DESC LIMIT 500`;
    return send(res, 200, { summary: Object.assign({}, summaryRows[0] || {}, timeRows[0] || {}), visitors });
  } catch (error) {
    console.error('[visitor-analytics] admin request failed:', error && error.message);
    return send(res, 500, { error: 'analytics_request_failed' });
  }
}
