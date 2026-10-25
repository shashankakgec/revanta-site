import { neon } from "@neondatabase/serverless";

const allowedServices = new Set([
  "General checkup",
  "Cleaning / whitening",
  "Braces / aligners",
  "Restorative / root canal consultation",
  "Tooth pain / urgent consultation",
  "Other / not sure yet"
]);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return res.status(403).json({ error: "Request origin could not be verified." });
    } catch {
      return res.status(403).json({ error: "Invalid request origin." });
    }
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Please check the form and try again." }); }
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Please check the form and try again." });
  }
  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const patientName = String(body.patientName || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const service = String(body.service || "").trim();
  const preferredDate = String(body.preferredDate || "").trim();
  const preferredTime = String(body.preferredTime || "").trim();
  const message = String(body.message || "").trim();

  if (patientName.length < 2 || patientName.length > 120) return res.status(400).json({ error: "Please enter your full name." });
  if (phone.length < 7 || phone.length > 25 || !/^[+()\d\s.-]+$/.test(phone)) return res.status(400).json({ error: "Please enter a valid phone number." });
  if (email.length > 254 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ error: "Please check your email address." });
  if (!allowedServices.has(service)) return res.status(400).json({ error: "Please choose a service from the list." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || Number.isNaN(Date.parse(preferredDate)) || preferredDate < new Date().toISOString().slice(0, 10)) return res.status(400).json({ error: "Please choose a valid future date." });
  if (!["Morning (9 AM–12 PM)", "Afternoon (12 PM–3 PM)", "Evening (3 PM–7 PM)", "Flexible"].includes(preferredTime)) return res.status(400).json({ error: "Please choose a preferred time." });
  if (message.length > 1000) return res.status(400).json({ error: "Please keep your message under 1,000 characters." });
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > 12000) return res.status(413).json({ error: "The submitted form is too large." });

  if (!process.env.DATABASE_URL) return res.status(503).json({ error: "Appointment requests are not available yet. Please try again later." });

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`INSERT INTO public.happy_tooth_appointments
      (patient_name, phone, email, service, preferred_date, preferred_time, message)
      VALUES (${patientName}, ${phone}, ${email || null}, ${service}, ${preferredDate}, ${preferredTime}, ${message || null})`;
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Appointment request save failed", error?.message || "unknown error");
    return res.status(500).json({ error: "We couldn't save your request. Please try again later." });
  }
}