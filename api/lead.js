// POST /api/lead
// Receives and validates Revanta growth-audit forms, then stores every valid lead in Supabase.

const FORMS = {
  general: {
    required: ['name', 'email', 'company', 'website', 'industry', 'offering', 'challenge'],
    text: { name: 120, email: 200, company: 160, website: 200, industry: 80, offering: 600, customer_value: 160, challenge: 2000, budget: 80, notes: 3000 },
    list: { channels: 12 },
  },
  dental: {
    required: ['name', 'email', 'practice', 'location', 'website', 'treatments', 'challenge'],
    text: { name: 120, email: 200, practice: 160, location: 120, website: 200, budget: 80, challenge: 2000 },
    list: { treatments: 12, channels: 12 },
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
  return res.redirect(303, payload.ok ? `/contact/thanks?type=${type}` : '/contact#submit-error');
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

async function storeLead(lead) {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) throw new Error('not_configured');

  const f = lead.fields;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: f.name,
      email: f.email || null,
      phone: f.phone || null,
      company: f.company || f.practice || null,
      message: f.challenge || f.notes || null,
      form_type: lead.form_type,
      created_at: lead.submitted_at,
      page_path: lead.page,
      attribution: lead.attribution,
      user_agent: lead.user_agent,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[lead] Supabase insert failed:', response.status, detail.slice(0, 500));
    throw new Error('database_failed');
  }
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

  const type = body.form_type === 'dental' ? 'dental' : 'general';
  const spec = FORMS[type];

  const submittedFast = Number(body.form_ts) > 0 && Date.now() - Number(body.form_ts) < 1500;
  if (clean(body.url_confirm, 50) || submittedFast) return reply(req, res, 200, { ok: true }, type);

  const fields = {};
  for (const [key, max] of Object.entries(spec.text)) fields[key] = oneLine(body[key], max);
  for (const [key, max] of Object.entries(spec.list)) fields[key] = cleanList(body[key], max);
  for (const key of ['offering', 'challenge', 'notes']) if (key in fields) fields[key] = clean(body[key], spec.text[key]);

  // Preserve a phone field when a form provides one, even though it is optional.
  if ('phone' in body) fields.phone = oneLine(body.phone, 80);

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
