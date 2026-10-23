import { neon } from '@neondatabase/serverless';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PATH = /^\/(?!\/)[^?#]{0,179}$/;

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
function bodyOf(req) {
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return req.body && typeof req.body === 'object' ? req.body : {};
}
function seconds(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(30, Math.floor(n))) : 0;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'method_not_allowed' });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: 'forbidden' });
  if (!process.env.NEON_DATABASE_URL) return send(res, 503, { error: 'database_not_configured' });

  const body = bodyOf(req);
  const visitorId = String(body.visitor_id || '');
  const sessionId = String(body.session_id || '');
  const event = String(body.event || '');
  const pagePath = String(body.page_path || '/');
  if (!UUID.test(visitorId) || !UUID.test(sessionId)) return send(res, 400, { error: 'invalid_identifier' });
  if (!['start', 'pageview', 'heartbeat', 'end'].includes(event)) return send(res, 400, { error: 'invalid_event' });
  if (!PATH.test(pagePath)) return send(res, 400, { error: 'invalid_page_path' });

  const active = seconds(body.active_seconds);
  const passive = seconds(body.passive_seconds);
  if (active + passive > 30) return send(res, 400, { error: 'invalid_duration' });

  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    if (event === 'start') {
      await sql`INSERT INTO public.website_visitors (visitor_id, first_seen, last_seen, visit_count, consented_at)
        VALUES (${visitorId}::uuid, now(), now(), 1, now())
        ON CONFLICT (visitor_id) DO UPDATE SET
          last_seen = now(),
          visit_count = public.website_visitors.visit_count +
            CASE WHEN NOT EXISTS (SELECT 1 FROM public.visitor_sessions WHERE session_id = ${sessionId}::uuid) THEN 1 ELSE 0 END`;
      await sql`INSERT INTO public.visitor_sessions (session_id, visitor_id, started_at, last_seen, page_paths)
        VALUES (${sessionId}::uuid, ${visitorId}::uuid, now(), now(), ARRAY[${pagePath}]::text[])
        ON CONFLICT (session_id) DO UPDATE SET
          last_seen = now(), ended_at = NULL,
          page_paths = CASE WHEN ${pagePath} = ANY(public.visitor_sessions.page_paths)
            THEN public.visitor_sessions.page_paths
            ELSE array_append(public.visitor_sessions.page_paths, ${pagePath}) END`;
    } else {
      const ended = event === 'end';
      const rows = await sql`UPDATE public.visitor_sessions SET
          last_seen = now(),
          active_seconds = active_seconds + ${active},
          passive_seconds = passive_seconds + ${passive},
          ended_at = CASE WHEN ${ended} THEN now() ELSE ended_at END,
          page_paths = CASE WHEN ${pagePath} = ANY(page_paths) THEN page_paths ELSE array_append(page_paths, ${pagePath}) END
        WHERE session_id = ${sessionId}::uuid AND visitor_id = ${visitorId}::uuid
        RETURNING session_id`;
      if (!rows.length) return send(res, 404, { error: 'session_not_found' });
      await sql`UPDATE public.website_visitors SET last_seen = now() WHERE visitor_id = ${visitorId}::uuid`;
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('[visitor-analytics] tracking failed:', error && error.message);
    return send(res, 500, { error: 'tracking_failed' });
  }
}
