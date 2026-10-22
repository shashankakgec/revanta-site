import { neon } from '@neondatabase/serverless';

const AUTH_URL = String(process.env.NEON_AUTH_URL || '').replace(/\/+$/, '');

async function currentUser(req) {
  if (!AUTH_URL) return null;
  const host = req.headers.host || '';
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const origin = host ? proto + '://' + host : '';
  const response = await fetch(AUTH_URL + '/get-session', {
    headers: {
      cookie: req.headers.cookie || '',
      ...(origin ? { origin, referer: origin + String(req.url || '/') } : {}),
      accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const payload = await response.json().catch(() => ({}));
  return payload.user || payload.data?.user || payload.session?.user || payload.data?.session?.user || null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  try {
    const user = await currentUser(req);
    if (!user || !user.id || !user.email) return res.status(401).json({ error: 'unauthorised' });
    if (!process.env.NEON_DATABASE_URL) return res.status(503).json({ error: 'database_not_configured' });
    const sql = neon(process.env.NEON_DATABASE_URL);
    const email = String(user.email).toLowerCase();
    const admins = new Set(['jaiswalshashank100@gmail.com', 'shashank2310131@akgec.ac.in']);
    if (!admins.has(email)) {
      await sql`INSERT INTO public.app_user_roles (user_id, role) VALUES (${user.id}, 'client') ON CONFLICT (user_id) DO NOTHING`;
    }

    if (req.method === 'POST') {
      let body = req.body || {};
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
      const fullName = String(body.full_name || user.name || '').trim().slice(0, 160) || null;
      const businessName = String(body.business_name || '').trim().slice(0, 200) || null;
      const rows = await sql`INSERT INTO public.client_profiles (user_id, full_name, business_name)
        VALUES (${user.id}, ${fullName}, ${businessName})
        ON CONFLICT (user_id) DO UPDATE SET
          full_name = COALESCE(EXCLUDED.full_name, public.client_profiles.full_name),
          business_name = COALESCE(EXCLUDED.business_name, public.client_profiles.business_name),
          updated_at = NOW()
        RETURNING user_id, full_name, business_name`;
      return res.status(200).json({ profile: rows[0] || null });
    }

    const profileRows = await sql`SELECT full_name, business_name FROM public.client_profiles WHERE user_id = ${user.id} LIMIT 1`;
    const projects = await sql`SELECT p.id, p.name, p.description, p.status, p.preview_url, p.live_url, p.updated_at
      FROM public.client_projects p
      INNER JOIN public.client_project_members m ON m.project_id = p.id
      WHERE m.user_id = ${user.id}
      ORDER BY p.updated_at DESC`;
    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name || null },
      profile: profileRows[0] || null,
      projects,
    });
  } catch (error) {
    console.error('[client-projects] request failed:', error && error.message);
    return res.status(500).json({ error: 'client_workspace_failed' });
  }
}
