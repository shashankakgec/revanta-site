import { neon } from "@neondatabase/serverless";
import { isAuthenticated } from "../lib/admin-auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({error:"Method not allowed."}); }
  if (!isAuthenticated(req)) return res.status(401).json({error:"Please sign in to view appointment requests."});
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"Database is not configured."});
  try {
    const sql = neon(process.env.DATABASE_URL);
    const appointments = await sql`SELECT id, patient_name, phone, email, service, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date, preferred_time, message, status, created_at FROM public.happy_tooth_appointments ORDER BY created_at DESC LIMIT 500`;
    return res.status(200).json({appointments});
  } catch (error) {
    console.error("Admin appointment list failed", error?.message || "unknown error");
    return res.status(500).json({error:"Could not load appointment requests."});
  }
}
