// POST /api/lead  (Vercel serverless function; also run locally by dev.mjs)
//
// Receives the growth-audit forms, validates and sanitizes them, then delivers the lead to every
// configured channel:
//   LEAD_WEBHOOK_URL                                  any webhook (Zapier, Make, n8n, Slack, CRM inbound hook)
//   RESEND_API_KEY + LEAD_TO_EMAIL + LEAD_FROM_EMAIL  email through Resend (LEAD_TO_EMAIL may be comma separated)
// With neither configured the function returns 503 on purpose, so leads are never silently lost.

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

const clean = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, ' ');
const cleanList = (v, max) =>
  (Array.isArray(v) ? v : v ? [v] : [])
    .slice(0, max)
    .map((x) => oneLine(x, 80))
    .filter(Boolean);

function sanitizeAttribution(a) {
  const stringMap = (o) =>
    o && typeof o === 'object'
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

const wantsJson = (req) =>
  /application\/json/.test(req.headers['content-type'] || '') || /application\/json/.test(req.headers.accept || '');

function reply(req, res, status, payload, type = 'general') {
  if (wantsJson(req)) return res.status(status).json(payload);
  // Native (no-JavaScript) form post: send the visitor to a real page.
  return res.redirect(303, payload.ok ? `/contact/thanks?type=${type}` : '/contact#submit-error');
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function summary(lead) {
  const f = lead.fields;
  const lines = Object.entries(f).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
  return [
    `New ${lead.form_type === 'dental' ? 'dental ' : ''}growth audit request`,
    '',
    ...lines,
    '',
    `page: ${lead.page}`,
    `submitted_at: ${lead.submitted_at}`,
    `first_touch: ${JSON.stringify(lead.attribution.first_touch || {})}`,
    `last_touch: ${JSON.stringify(lead.attribution.last_touch || {})}`,
  ].join('\n');
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`${new URL(url).hostname} responded ${res.status}`);
}

async function deliver(lead) {
  const { LEAD_WEBHOOK_URL, RESEND_API_KEY, LEAD_TO_EMAIL, LEAD_FROM_EMAIL } = process.env;
  const jobs = [];
  if (LEAD_WEBHOOK_URL) jobs.push(postJson(LEAD_WEBHOOK_URL, lead));
  if (RESEND_API_KEY && LEAD_TO_EMAIL && LEAD_FROM_EMAIL) {
    const who = lead.fields.company || lead.fields.practice || lead.fields.name;
    jobs.push(
      postJson(
        'https://api.resend.com/emails',
        {
          from: LEAD_FROM_EMAIL,
          to: LEAD_TO_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
          reply_to: lead.fields.email,
          subject: oneLine(`New ${lead.form_type === 'dental' ? 'dental ' : ''}growth audit request: ${who}`, 150),
          text: summary(lead),
        },
        { Authorization: `Bearer ${RESEND_API_KEY}` },
      ),
    );
  }
  if (!jobs.length) throw new Error('not_configured');
  const results = await Promise.allSettled(jobs);
  const failed = results.filter((r) => r.status === 'rejected');
  failed.forEach((f) => console.error('[lead] delivery channel failed:', f.reason && f.reason.message));
  if (failed.length === results.length) throw new Error('delivery_failed');
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
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body && typeof body === 'object' ? body : {};

  const type = body.form_type === 'dental' ? 'dental' : 'general';
  const spec = FORMS[type];

  // Bots: a filled honeypot, or a submission faster than a person can type. Pretend it worked.
  const submittedFast = Number(body.form_ts) > 0 && Date.now() - Number(body.form_ts) < 1500;
  if (clean(body.url_confirm, 50) || submittedFast) return reply(req, res, 200, { ok: true }, type);

  const fields = {};
  for (const [key, max] of Object.entries(spec.text)) fields[key] = oneLine(body[key], max);
  for (const [key, max] of Object.entries(spec.list)) fields[key] = cleanList(body[key], max);
  // Long free-text fields keep their line breaks.
  for (const key of ['offering', 'challenge', 'notes']) if (key in fields) fields[key] = clean(body[key], spec.text[key]);

  const errors = {};
  for (const key of spec.required) {
    const v = fields[key];
    if (!v || (Array.isArray(v) && v.length === 0)) errors[key] = key === 'treatments' ? 'Select at least one option.' : 'This field is required.';
  }
  if (fields.email && !EMAIL.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (fields.website && !SITE.test(fields.website)) errors.website = 'Enter a valid website, for example yourcompany.com.';
  if (Object.keys(errors).length) return reply(req, res, 422, { ok: false, errors }, type);

  const lead = {
    event: 'lead',
    form_type: type,
    submitted_at: new Date().toISOString(),
    page: oneLine(body.page_path, 300),
    fields,
    attribution: sanitizeAttribution(body.attribution),
    user_agent: oneLine(req.headers['user-agent'], 300),
  };

  try {
    await deliver(lead);
  } catch (err) {
    console.error('[lead] not delivered:', err.message);
    return reply(req, res, err.message === 'not_configured' ? 503 : 502, { ok: false, error: err.message }, type);
  }
  return reply(req, res, 200, { ok: true }, type);
}
