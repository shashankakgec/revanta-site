import { neon } from '@neondatabase/serverless';

// POST /api/lead
// Receives and validates Revanta growth-audit forms, then stores every valid lead in Neon.

const FORMS = {
  general: {
    required: ['name', 'email', 'industry', 'budget'],
    text: { name: 120, email: 200, company: 160, website: 300, industry: 80, offering: 200, customer_value: 120, challenge: 2000, budget: 80, notes: 3000 },
    list: { channels: 6 },
  },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([/?#].*)?$/i;

const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, ' ');
const cleanList = (v, max) => (Array.isArray(v) ? v : v ? [v] : []).slice(0, max).map((x) => oneLine(x, 80)).filter(Boolean);

function sanitizeAttribution(a) {
  const stringMap = (o) => o && typeof o === 'object'
    ? Object.fromEntries(Object.entries(o).slice(0, 12).map(([k, v]) => [oneLine(k, 40), oneLine(v, 200)]))
    : {};
  const touch = (t) => {
    if (!t || typeof t !== 'object') return null;
    const out = {};
    for (const [k, v] of Object.entries(t).slice(0, 8)) {
      if (k === 'params') out.params = stringMap(v);
      else if (typeof v === 'string') out[oneLine(k, 40)] = oneLine(v, 300);
    }
    return out;
  };
  return a && typeof a === 'object'
    ? { first_touch: touch(a.first_touch), last_touch: touch(a.last_touch), current: stringMap(a.current) }
    : {};
}

const wantsJson = (req) => /application\/json/.test(req.headers['content-type'] || '') || /application\/json/.test(req.headers.accept || '');

function reply(req, res, status, payload, type = 'general') {
  if (wantsJson(req)) return res.status(status).json(payload);
  return res.status(status).redirect(303, payload.ok ? `/contact/thanks?type=${type}` : '/contact#submit-error');
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

async function storeLead(lead) {
  if (!process.env.NEON_DATABASE_URL) throw new Error('not_configured');
  const sql = neon(process.env.NEON_DATABASE_URL);
  const f = lead.fields;
  await sql`INSERT INTO public.leads
    (name,email,company,website,industry,offering,customer_value,channels,challenge,budget,notes,form_type,created_at,page_path,attribution,user_agent,status)
    VALUES
    (${f.name},${f.email},${f.company || null},${f.website || null},${f.industry},${f.offering || null},${f.customer_value || null},${f.channels || []},${f.challenge || null},${f.budget},${f.notes || null},${lead.form_type},${lead.submitted_at},${lead.page},${JSON.stringify(lead.attribution)},${lead.user_agent},'New')`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: 'forbidden' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body && typeof body === 'object' ? body : {};

  const type = 'general';
  const spec = FORMS[type];

  const submittedFast = Number(body.form_ts) > 0 && Date.now() - Number(body.form_ts) < 1500;
  if (clean(body.url_confirm, 50) || submittedFast) return reply(req, res, 200, { ok: true }, type);

  const fields = {};
  for (const [key, max] of Object.entries(spec.text)) fields[key] = oneLine(body[key], max);
  for (const [key, max] of Object.entries(spec.list)) fields[key] = cleanList(body[key], max);


  const errors = {};
  for (const key of spec.required) {
    const v = fields[key];
    if (!v || (Array.isArray(v) && v.length === 0)) errors[key] = key === 'treatments' ? 'Select at least one option.' : 'This field is required.';
  }
  if (fields.email && !EMAIL.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (fields.website && !SITE.test(fields.website)) errors.website = 'Enter a valid website, for example yourcompany.com.';
  if (Object.keys(errors).length) return reply(req, res, 422, { ok: false, errors }, type);

  const lead = {
    form_type: type,
    submitted_at: new Date().toISOString(),
    page: oneLine(body.page_path, 300),
    fields,
    attribution: sanitizeAttribution(body.attribution),
    user_agent: oneLine(req.headers['user-agent'], 300),
  };

  try {
    await storeLead(lead);
  } catch (err) {
    console.error('[lead] not stored:', err.message);
    return reply(req, res, err.message === 'not_configured' ? 503 : 502, { ok: false, error: err.message }, type);
  }

  return reply(req, res, 200, { ok: true }, type);
}
