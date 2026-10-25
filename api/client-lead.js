import { neon } from '@neondatabase/serverless';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().replace(/\s+/g, ' ').slice(0, max);
function send(res, status, body) { res.setHeader('Cache-Control','no-store'); res.setHeader('X-Content-Type-Options','nosniff'); return res.status(status).json(body); }
function originHost(origin) { try { const u = new URL(origin); return /^https?:$/.test(u.protocol) ? u.host.toLowerCase() : ''; } catch { return ''; } }
async function getProject(sql, id) {
  const [p] = await sql`SELECT id, live_url, preview_url FROM public.client_projects WHERE id = ${id}::uuid`;
  return p || null;
}
function projectAllowsOrigin(project, origin) {
  const host = originHost(origin);
  if (!host) return false;
  return [project.live_url, project.preview_url].some(function(value) {
    if (!value) return false;
    try { const u = new URL(value); return /^https?:$/.test(u.protocol) && u.host.toLowerCase() === host; } catch { return false; }
  });
}
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    res.setHeader('Allow','POST, OPTIONS');
    return send(res,405,{error:'method_not_allowed'});
  }
  if (!process.env.NEON_DATABASE_URL) return send(res,503,{error:'database_not_configured'});
  const rawBody = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const projectId = String((rawBody.project_id || req.query.project_id || '')).trim();
  const origin = String(req.headers.origin || '');
  if (!UUID.test(projectId) || !origin) return send(res,403,{error:'origin_or_project_required'});
  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    const project = await getProject(sql,projectId);
    if (!project || !projectAllowsOrigin(project,origin)) return send(res,403,{error:'origin_not_authorized_for_project'});
    res.setHeader('Access-Control-Allow-Origin',origin);
    res.setHeader('Vary','Origin');
    res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Max-Age','600');
    if (req.method === 'OPTIONS') return res.status(204).end();
    const body = rawBody;
    const name = clean(body.name,120);
    const email = clean(body.email,200).toLowerCase();
    const industry = clean(body.industry,80);
    const budget = clean(body.budget,80);
    if (!name || !email || !industry || !budget) return send(res,422,{error:'required_fields_missing'});
    if (!EMAIL.test(email)) return send(res,422,{error:'invalid_email'});
    const pagePath = clean(body.page_path,500);
    const [lead] = await sql`INSERT INTO public.leads (name,email,industry,budget,form_type,created_at,page_path,status,client_project_id) VALUES (${name},${email},${industry},${budget},'client_website',now(),${pagePath || origin},'New',${project.id}::uuid) RETURNING id,created_at,status`;
    return send(res,201,{ok:true,lead_id:lead.id,created_at:lead.created_at,status:lead.status});
  } catch (error) {
    console.error('[client-lead] request failed:',error && error.message);
    return send(res,500,{error:'lead_submission_failed'});
  }
}
