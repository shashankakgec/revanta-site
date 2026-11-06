import { neon } from '@neondatabase/serverless';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

const json = (res, status, payload) => res.status(status).json(payload);
const clean = (value, max = 120) => String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const CATEGORIES = new Set(['photos', 'videos', 'contacts']);

async function staff(req, sql) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token || token.length > 512) return null;
  const rows = await sql`
    SELECT u.id, u.email
    FROM neon_auth.session s
    JOIN neon_auth."user" u ON u.id = s."userId"
    JOIN public.app_user_roles r ON r.user_id = u.id
    WHERE s.token = ${token} AND s."expiresAt" > NOW() AND r.role = 'staff'
    LIMIT 1
  `;
  return rows[0] || null;
}

async function device(req, sql) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Device ') ? header.slice(7).trim() : '';
  if (!token || token.length !== 64) return null;
  const rows = await sql`
    SELECT id, device_name
    FROM public.device_enrollments
    WHERE token_hash = ${sha256(token)} AND revoked_at IS NULL
    LIMIT 1
  `;
  if (!rows[0]) return null;
  await sql`UPDATE public.device_enrollments SET last_seen_at = NOW() WHERE id = ${rows[0].id}`;
  return rows[0];
}

function bodyOf(req) {
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  return body && typeof body === 'object' ? body : {};
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Authorization');
  if (!process.env.NEON_DATABASE_URL) return json(res, 503, { error: 'Database is not configured.' });
  const sql = neon(process.env.NEON_DATABASE_URL);
  try {
    const body = bodyOf(req);

    // Owner-only operations: create pairing codes, inspect enrolled devices, revoke access.
    const owner = await staff(req, sql);
    if (req.method === 'GET') {
      if (!owner) return json(res, 401, { error: 'Staff access required.' });
      const devices = await sql`
        SELECT d.id, d.device_name, d.platform, d.created_at, d.last_seen_at, d.revoked_at,
          COALESCE(jsonb_object_agg(c.category, jsonb_build_object(
            'granted', c.granted, 'updated_at', c.updated_at, 'revoked_at', c.revoked_at
          )) FILTER (WHERE c.category IS NOT NULL), '{}'::jsonb) AS consents
        FROM public.device_enrollments d
        LEFT JOIN public.device_consents c ON c.device_id = d.id
        GROUP BY d.id
        ORDER BY d.created_at DESC
      `;
      return json(res, 200, { devices });
    }

    if (req.method === 'POST' && body.action === 'create_pairing') {
      if (!owner) return json(res, 401, { error: 'Staff access required.' });
      const code = randomBytes(12).toString('hex').toUpperCase();
      const rows = await sql`
        INSERT INTO public.device_pairing_codes (code_hash, created_by, expires_at)
        VALUES (${sha256(code)}, ${owner.id}, NOW() + INTERVAL '15 minutes')
        RETURNING id, expires_at
      `;
      return json(res, 201, { pairing_code: code, expires_at: rows[0].expires_at, pairing_id: rows[0].id });
    }

    if (req.method === 'PATCH' && body.action === 'revoke') {
      if (!owner) return json(res, 401, { error: 'Staff access required.' });
      const id = clean(body.device_id, 36);
      const rows = await sql`
        UPDATE public.device_enrollments SET revoked_at = COALESCE(revoked_at, NOW())
        WHERE id = ${id}::uuid RETURNING id
      `;
      if (!rows.length) return json(res, 404, { error: 'Device not found.' });
      return json(res, 200, { ok: true });
    }

    // Pairing is the only unauthenticated device operation. Codes are one-use and expire in 15 minutes.
    if (req.method === 'POST' && body.action === 'pair') {
      const code = clean(body.pairing_code, 32).toUpperCase();
      const installId = clean(body.install_id, 128);
      const deviceName = clean(body.device_name, 120);
      if (!/^[A-F0-9]{24}$/.test(code) || !/^[A-Fa-f0-9-]{16,128}$/.test(installId) || !deviceName) {
        return json(res, 422, { error: 'Enter a valid pairing code and device name.' });
      }
      const matches = await sql`
        SELECT id FROM public.device_pairing_codes
        WHERE code_hash = ${sha256(code)} AND redeemed_at IS NULL AND expires_at > NOW()
        LIMIT 1
      `;
      if (!matches.length) return json(res, 401, { error: 'Pairing code is invalid, expired, or already used.' });
      const token = randomBytes(32).toString('hex');
      const enrolled = await sql`
        INSERT INTO public.device_enrollments (install_id, device_name, platform, token_hash)
        VALUES (${installId}, ${deviceName}, 'android', ${sha256(token)})
        ON CONFLICT (install_id) DO NOTHING
        RETURNING id
      `;
      if (!enrolled.length) return json(res, 409, { error: 'This app installation is already paired. Revoke it before pairing again.' });
      const redeemed = await sql`
        UPDATE public.device_pairing_codes SET redeemed_at = NOW(), device_id = ${enrolled[0].id}
        WHERE id = ${matches[0].id} AND redeemed_at IS NULL
        RETURNING id
      `;
      if (!redeemed.length) {
        await sql`UPDATE public.device_enrollments SET revoked_at = NOW() WHERE id = ${enrolled[0].id}`;
        return json(res, 409, { error: 'Pairing code was just used. Generate a new code.' });
      }
      return json(res, 201, { device_token: token, device_id: enrolled[0].id, consent_required: true });
    }

    if (req.method === 'POST' && body.action === 'consent') {
      const enrolled = await device(req, sql);
      if (!enrolled) return json(res, 401, { error: 'This device is not paired or its access has been revoked.' });
      const consents = body.consents && typeof body.consents === 'object' ? body.consents : {};
      const keys = Object.keys(consents);
      if (!keys.length || keys.some((key) => !CATEGORIES.has(key) || typeof consents[key] !== 'boolean')) {
        return json(res, 422, { error: 'Send an explicit true or false choice for photos, videos, and contacts.' });
      }
      for (const category of keys) {
        const granted = consents[category];
        await sql`
          INSERT INTO public.device_consents
            (device_id, category, granted, consent_version, granted_at, revoked_at, updated_at)
          VALUES (
            ${enrolled.id}, ${category}, ${granted}, 1,
            CASE WHEN ${granted} THEN NOW() ELSE NULL END,
            CASE WHEN ${granted} THEN NULL ELSE NOW() END,
            NOW()
          )
          ON CONFLICT (device_id, category) DO UPDATE SET
            granted = EXCLUDED.granted,
            consent_version = EXCLUDED.consent_version,
            granted_at = CASE WHEN EXCLUDED.granted THEN NOW() ELSE public.device_consents.granted_at END,
            revoked_at = CASE WHEN EXCLUDED.granted THEN NULL ELSE NOW() END,
            updated_at = NOW()
        `;
      }
      const saved = await sql`
        SELECT category, granted, consent_version, granted_at, revoked_at
        FROM public.device_consents WHERE device_id = ${enrolled.id}
      `;
      return json(res, 200, { ok: true, consents: saved });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return json(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    console.error('[device-api]', error && error.message);
    return json(res, 500, { error: 'The device request failed. Please retry.' });
  }
}
