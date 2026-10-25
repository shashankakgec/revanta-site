import { neon } from "@neondatabase/serverless";
import { isAuthenticated, originAllowed, parseBody } from "./_auth.js";

const statuses = new Set(["pending","contacted","confirmed","cancelled"]);
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({error:"Method not allowed."}); }
  if (!originAllowed(req)) return res.status(403).json({error:"Request origin could not be verified."});
  if (!isAuthenticated(req)) return res.status(401).json({error:"Please sign in again."});
  const body = parseBody(req);
  const id = Number(body?.id);
  const status = String(body?.status || "");
  if (!Number.isSafeInteger(id) || id < 1 || !statuses.has(status)) return res.status(400).json({error:"Invalid request update."});
  if (!process.env.DATABASE_URL) return res.status(503).json({error:"Database is not configured."});
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`UPDATE public.happy_tooth_appointments SET status = ${status} WHERE id = ${id} RETURNING id, status`;
    if (!result.length) return res.status(404).json({error:"Appointment request not found."});
    return res.status(200).json({ok:true,appointment:result[0]});
  } catch (error) {
    console.error("Appointment status update failed", error?.message || "unknown error");
    return res.status(500).json({error:"Could not update the appointment status."});
  }
}
