import { neon } from '@neondatabase/serverless';

const STATUSES = new Set(['New', 'Contacted', 'Meeting Booked', 'Won', 'Lost']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (res, status, payload) => res.status(status).json(payload);

async function authorize(req, sql) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token || token.length > 512) return null;
  const rows = await sql`
    SELECT u.id, u.email, r.role
    FROM neon_auth.session s
    JOIN neon_auth."user" u ON u.id = s."userId"
    JOIN public.app_user_roles r ON r.user_id = u.id
    WHERE s.token = ${token} AND s."expiresAt" > NOW() AND r.role = 'staff'
    LIMIT 1
  `;
  return rows[0] || null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Authorization');
  if (!process.env.NEON_DATABASE_URL) return json(res, 503, { error: 'Database is not configured.' });
  const sql = neon(process.env.NEON_DATABASE_URL);
  try {
    const user = await authorize(req, sql);
    if (!user) return json(res, 401, { error: 'Your account is not authorised to access the Revanta admin dashboard.' });
    if (req.method === 'GET') {
      const leads = await sql`
        SELECT id, name, email, industry, budget, status, follow_up_at,
               internal_notes, created_at
        FROM public.leads ORDER BY created_at DESC
      `;
      return json(res, 200, { leads });
    }
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    body = body && typeof body === 'object' ? body : {};
    if (!UUID.test(String(body.id || ''))) return json(res, 400, { error: 'Invalid lead ID.' });
    if (req.method === 'PATCH') {
      if (!STATUSES.has(body.status)) return json(res, 422, { error: 'Invalid lead status.' });
      const follow = body.follow_up_at ? new Date(body.follow_up_at) : null;
      if (body.follow_up_at && Number.isNaN(follow.getTime())) return json(res, 422, { error: 'Invalid follow-up date.' });
      const notes = String(body.internal_notes || '').slice(0, 5000);
      const rows = await sql`
        UPDATE public.leads
        SET status = ${body.status},
            follow_up_at = ${follow ? follow.toISOString() : null},
            internal_notes = ${notes},
            updated_at = NOW()
        WHERE id = ${body.id}
        RETURNING id
      `;
      if (!rows.length) return json(res, 404, { error: 'Lead not found.' });
      return json(res, 200, { ok: true });
    }
    if (req.method === 'DELETE') {
      const rows = await sql`DELETE FROM public.leads WHERE id = ${body.id} RETURNING id`;
      if (!rows.length) return json(res, 404, { error: 'Lead not found.' });
      return json(res, 200, { ok: true });
    }
    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return json(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('[admin-api]', error && error.message);
    return json(res, 500, { error: 'The dashboard request failed. Please retry.' });
  }
}
