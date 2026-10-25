import { neon } from '@neondatabase/serverless';

const sql = () => {
  if (!process.env.NEON_DATABASE_URL) throw new Error('Neon database is not configured.');
  return neon(process.env.NEON_DATABASE_URL);
};
const OWNER_EMAIL = String(process.env.REVANTA_OWNER_EMAIL || 'shashank2310131@akgec.ac.in').trim().toLowerCase();
const LEGACY_STAFF_EMAILS = new Set(['jaiswalshashank100@gmail.com']);
const authUrl = process.env.NEON_AUTH_URL;

async function session(req) {
  if (!authUrl) throw new Error('Neon Auth is not configured.');
  const cookie = req.headers.cookie || '';
  if (!cookie) return null;
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const origin = host ? proto + '://' + host : '';
  const headers = { cookie, accept: 'application/json' };
  // Neon Auth/Better Auth can validate requests against the application origin.
  // Forward the current deployment origin just as the same-origin auth proxy does.
  if (origin) {
    headers.origin = origin;
    headers.referer = origin + '/admin/clients';
  }
  const r = await fetch(authUrl.replace(/\/$/, '') + '/get-session', {
    headers,
    cache: 'no-store',
  });
  if (!r.ok) return null;
  const data = await r.json().catch(() => null);
  const payload = data && typeof data === 'object' ? data : {};
  // Neon Auth can return different envelope shapes across versions. Match the
  // session parsing used by the working lead-admin API.
  const user = payload.user || payload.data?.user || payload.session?.user || payload.data?.session?.user;
  if (!user || !user.id || !user.email) return null;
  return { id: user.id, email: String(user.email).toLowerCase(), name: user.name || '' };
}
function send(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}
function sameOrigin(req) {
  if (!req.headers.origin) return true;
  try { return new URL(req.headers.origin).host === req.headers.host; } catch { return false; }
}
function isUrl(v) {
  if (!v) return null;
  try { const u = new URL(String(v)); return /^https?:$/.test(u.protocol) ? u.href : null; } catch { return null; }
}
export default async function handler(req, res) {
  if (!sameOrigin(req)) return send(res, 403, { error: 'forbidden' });
  try {
    const user = await session(req);
    if (!user) return send(res, 401, { error: 'sign_in_required' });
    const db = sql();
    const owner = user.email === OWNER_EMAIL;
    // Known staff emails must be authorised before consulting the optional role table.
    // This avoids a missing/stale role row or role-table query preventing the existing admin account from entering.
    let staff = owner || LEGACY_STAFF_EMAILS.has(user.email);
    if (!staff) {
      const [roleRecord] = await db`SELECT role FROM public.app_user_roles WHERE user_id = ${user.id}::uuid`;
      staff = Boolean(roleRecord && roleRecord.role === 'staff');
    }
    if (req.method === 'GET') {
      const [profile] = await db`SELECT full_name, business_name FROM public.client_profiles WHERE user_id = ${user.id}::uuid`;
      if (staff) {
        const projects = await db`SELECT p.*, COALESCE(json_agg(json_build_object('user_id', m.user_id, 'email', u.email)) FILTER (WHERE m.user_id IS NOT NULL), '[]'::json) AS members FROM public.client_projects p LEFT JOIN public.client_project_members m ON m.project_id=p.id LEFT JOIN neon_auth."user" u ON u.id=m.user_id GROUP BY p.id ORDER BY p.updated_at DESC`;
        const users = await db`SELECT u.id, u.name, u.email, u."createdAt" AS created_at, cp.full_name, cp.business_name, CASE WHEN lower(u.email) = ${OWNER_EMAIL} THEN 'owner' WHEN lower(u.email) = 'jaiswalshashank100@gmail.com' THEN 'staff' ELSE COALESCE(r.role, 'client') END AS role, COALESCE((SELECT json_agg(p.name ORDER BY p.name) FROM public.client_project_members m JOIN public.client_projects p ON p.id=m.project_id WHERE m.user_id=u.id), '[]'::json) AS projects FROM neon_auth."user" u LEFT JOIN public.app_user_roles r ON r.user_id=u.id LEFT JOIN public.client_profiles cp ON cp.user_id=u.id ORDER BY u."createdAt" DESC LIMIT 200`;
        return send(res, 200, { user, staff: true, owner, profile: profile || null, projects, users });
      }
      const projects = await db`SELECT p.id,p.name,p.description,p.status,p.preview_url,p.live_url,p.created_at,p.updated_at FROM public.client_projects p JOIN public.client_project_members m ON m.project_id=p.id WHERE m.user_id=${user.id}::uuid ORDER BY p.updated_at DESC`;
      return send(res, 200, { user, staff: false, owner: false, profile: profile || null, projects });
    }
    if (req.method === 'POST') {
      if (!staff) return send(res, 403, { error: 'staff_only' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      if (body.action === 'create-project') {
        const name = String(body.name || '').trim().slice(0,150);
        if (!name) return send(res, 422, { error: 'project_name_required' });
        const description = String(body.description || '').slice(0,2000);
        const status = ['planning','in_progress','review','ready','live','paused'].includes(body.status) ? body.status : 'planning';
        const [project] = await db`INSERT INTO public.client_projects (name,description,status,preview_url,live_url,created_by) VALUES (${name},${description},${status},${isUrl(body.preview_url)},${isUrl(body.live_url)},${user.id}::uuid) RETURNING *`;
        return send(res, 201, { project });
      }
      if (body.action === 'assign-project') {
        const projectId = String(body.project_id || '');
        const userId = String(body.user_id || '');
        const [exists] = await db`SELECT id FROM neon_auth."user" WHERE id=${userId}::uuid`;
        if (!exists) return send(res, 404, { error: 'client_not_found' });
        const [project] = await db`SELECT id FROM public.client_projects WHERE id=${projectId}::uuid`;
        if (!project) return send(res, 404, { error: 'project_not_found' });
        await db`INSERT INTO public.client_project_members(project_id,user_id) VALUES (${projectId}::uuid,${userId}::uuid) ON CONFLICT DO NOTHING`;
        return send(res, 200, { ok: true });
      }
      if (body.action === 'set-role') {
        if (!owner) return send(res, 403, { error: 'owner_only' });
        const userId = String(body.user_id || '');
        const role = body.role === 'staff' ? 'staff' : 'client';
        if (userId === user.id && role !== 'staff') return send(res, 400, { error: 'cannot_remove_owner_role' });
        const [target] = await db`SELECT id,email FROM neon_auth."user" WHERE id=${userId}::uuid`;
        if (!target) return send(res, 404, { error: 'user_not_found' });
        if (String(target.email).toLowerCase() === OWNER_EMAIL && role !== 'staff') return send(res, 400, { error: 'cannot_demote_owner' });
        await db`INSERT INTO public.app_user_roles(user_id,role) VALUES (${userId}::uuid,${role}) ON CONFLICT(user_id) DO UPDATE SET role=EXCLUDED.role`;
        return send(res, 200, { ok: true });
      }
      return send(res, 400, { error: 'unknown_action' });
    }
    if (req.method === 'PATCH') {
      if (!staff) return send(res, 403, { error: 'staff_only' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const id = String(body.id || '');
      const name = String(body.name || '').trim().slice(0,150);
      const description = String(body.description || '').slice(0,2000);
      const status = ['planning','in_progress','review','ready','live','paused'].includes(body.status) ? body.status : 'planning';
      const [project] = await db`UPDATE public.client_projects SET name=${name}, description=${description}, status=${status}, preview_url=${isUrl(body.preview_url)}, live_url=${isUrl(body.live_url)}, updated_at=now() WHERE id=${id}::uuid RETURNING *`;
      return project ? send(res, 200, { project }) : send(res, 404, { error: 'project_not_found' });
    }
    res.setHeader('Allow', 'GET, POST, PATCH');
    return send(res, 405, { error: 'method_not_allowed' });
  } catch (e) {
    console.error('[neon portal api]', e && e.message);
    return send(res, 500, { error: 'server_error' });
  }
}