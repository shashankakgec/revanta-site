import { neon } from '@neondatabase/serverless';

function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}
function sameOrigin(req) {
  if (!req.headers.origin) return true;
  try { return new URL(req.headers.origin).host === req.headers.host; }
  catch { return false; }
}
async function session(req) {
  const authUrl = String(process.env.NEON_AUTH_URL || '').replace(/\/+$/, '');
  if (!authUrl || !req.headers.cookie) return null;
  const response = await fetch(authUrl + '/get-session', {
    headers: { cookie: req.headers.cookie, accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) return null;
  const data = await response.json().catch(() => null);
  const user = data && (
    data.user ||
    (data.data && data.data.user) ||
    (data.session && data.session.user) ||
    (data.data && data.data.session && data.data.session.user)
  );
  if (!user || !user.id || !user.email) return null;
  return { id: user.id, email: String(user.email).toLowerCase() };
}

export default async function handler(req, res) {
  if (!sameOrigin(req)) return send(res, 403, { error: 'forbidden' });
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'method_not_allowed' });
  }
  try {
    const user = await session(req);
    if (!user) return send(res, 401, { error: 'sign_in_required' });
    if (!process.env.NEON_DATABASE_URL) return send(res, 503, { error: 'database_not_configured' });
    const sql = neon(process.env.NEON_DATABASE_URL);
    const [profile] = await sql`SELECT full_name, business_name FROM public.client_profiles WHERE user_id=${user.id}::uuid`;
    const projects = await sql`SELECT p.id,p.name,p.live_url,p.preview_url FROM public.client_projects p JOIN public.client_project_members m ON m.project_id=p.id WHERE m.user_id=${user.id}::uuid ORDER BY p.updated_at DESC`;
    if (!projects.length) {
      return send(res, 200, { user, profile: profile || null, leads: [], appointments: [], project_assigned: false, projects: [] });
    }

    const ids = projects.map((project) => project.id);
    const leads = await sql`SELECT l.id,l.name,l.email,l.industry,l.budget,l.form_type,l.created_at,l.page_path,l.status FROM public.leads l WHERE l.client_project_id = ANY(${ids}::uuid[]) ORDER BY l.created_at DESC LIMIT 500`;

    const happyToothProject = projects.find((project) => {
      if (project.name !== 'Happy Tooth') return false;
      try {
        const url = new URL(project.live_url || project.preview_url || '');
        return url.hostname === 'happy-tooth-hello-shas.vercel.app';
      } catch { return false; }
    });

    let appointments = [];
    let appointments_unavailable = false;
    if (happyToothProject) {
      if (!process.env.HAPPY_TOOTH_DATABASE_URL) {
        appointments_unavailable = true;
      } else {
        const clinicSql = neon(process.env.HAPPY_TOOTH_DATABASE_URL);
        appointments = await clinicSql`SELECT id,patient_name,phone,email,service,to_char(preferred_date,'YYYY-MM-DD') AS preferred_date,preferred_time,message,status,created_at FROM public.happy_tooth_appointments ORDER BY created_at DESC LIMIT 500`;
      }
    }

    return send(res, 200, {
      user,
      profile: profile || null,
      leads,
      appointments,
      appointments_unavailable,
      project_assigned: true,
      projects: projects.map(({ id, name, live_url, preview_url }) => ({ id, name, live_url, preview_url })),
    });
  } catch (error) {
    console.error('[client leads api]', error && error.message);
    return send(res, 500, { error: 'dashboard_request_failed' });
  }
}
