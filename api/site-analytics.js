import { neon } from '@neondatabase/serverless';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (res, status, payload) => res.status(status).json(payload);
const clean = (v, max = 300) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}
async function staff(req, sql) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7).trim() : '';
  if (!token || token.length > 512) return null;
  const rows = await sql`
    SELECT u.id FROM neon_auth.session s
    JOIN neon_auth."user" u ON u.id=s."userId"
    JOIN public.app_user_roles r ON r.user_id=u.id
    WHERE s.token=${token} AND s."expiresAt">NOW() AND r.role='staff' LIMIT 1
  `;
  return rows[0] || null;
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Authorization');
  if (!process.env.NEON_DATABASE_URL) return json(res,503,{error:'Database is not configured.'});
  const sql=neon(process.env.NEON_DATABASE_URL);
  try {
    if (req.method === 'POST') {
      if (!sameOrigin(req)) return json(res,403,{error:'forbidden'});
      let body=req.body;
      if(typeof body==='string'){try{body=JSON.parse(body)}catch{body={}}}
      body=body&&typeof body==='object'?body:{};
      const id=String(body.session_id||'').toLowerCase();
      if(!UUID.test(id)) return json(res,422,{error:'Invalid session.'});
      const seconds=Math.max(0,Math.min(30,Math.floor(Number(body.seconds)||0)));
      const path=clean(body.page_path||'/',300);
      if(!path.startsWith('/') || path.startsWith('//')) return json(res,422,{error:'Invalid page path.'});
      await sql`
        INSERT INTO public.site_visit_sessions
          (session_id,started_at,last_seen_at,active_seconds,page_views,last_page_path,ended_at)
        VALUES (${id}::uuid,NOW(),NOW(),${seconds},1,${path},CASE WHEN ${body.ended===true} THEN NOW() ELSE NULL END)
        ON CONFLICT (session_id) DO UPDATE SET
          last_seen_at=NOW(),
          active_seconds=public.site_visit_sessions.active_seconds+${seconds},
          page_views=public.site_visit_sessions.page_views+
            CASE WHEN public.site_visit_sessions.last_page_path IS DISTINCT FROM ${path} THEN 1 ELSE 0 END,
          last_page_path=${path},
          ended_at=CASE WHEN ${body.ended===true} THEN NOW() ELSE NULL END
      `;
      return json(res,204,{});
    }
    if (req.method === 'GET') {
      const owner=await staff(req,sql);
      if(!owner) return json(res,401,{error:'Staff access required.'});
      const [summary,recent,pages]=await Promise.all([
        sql`SELECT
          COUNT(*) FILTER (WHERE started_at >= NOW()-INTERVAL '24 hours')::int AS visits_24h,
          COUNT(*) FILTER (WHERE started_at >= NOW()-INTERVAL '7 days')::int AS visits_7d,
          COALESCE(SUM(active_seconds) FILTER (WHERE started_at >= NOW()-INTERVAL '7 days'),0)::bigint AS active_seconds_7d,
          COALESCE(ROUND(AVG(active_seconds) FILTER (WHERE started_at >= NOW()-INTERVAL '7 days')),0)::int AS avg_seconds_7d
          FROM public.site_visit_sessions`,
        sql`SELECT session_id,started_at,last_seen_at,active_seconds,page_views,last_page_path,ended_at
          FROM public.site_visit_sessions ORDER BY started_at DESC LIMIT 50`,
        sql`SELECT last_page_path AS page_path,COUNT(*)::int AS visits,
          COALESCE(SUM(active_seconds),0)::bigint AS active_seconds
          FROM public.site_visit_sessions WHERE started_at>=NOW()-INTERVAL '7 days'
          GROUP BY last_page_path ORDER BY active_seconds DESC LIMIT 20`
      ]);
      return json(res,200,{summary:summary[0],recent,pages});
    }
    res.setHeader('Allow','GET, POST');
    return json(res,405,{error:'Method not allowed.'});
  } catch(error) {
    console.error('[site-analytics]',error&&error.message);
    return json(res,500,{error:'Analytics request failed.'});
  }
}
