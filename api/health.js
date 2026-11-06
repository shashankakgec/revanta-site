import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false });
  }
  if (!process.env.NEON_DATABASE_URL) return res.status(503).json({ ok: false });
  try {
    const sql = neon(process.env.NEON_DATABASE_URL);
    await sql`SELECT 1 AS ok`;
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('[health]', error && error.message);
    return res.status(503).json({ ok: false });
  }
}
