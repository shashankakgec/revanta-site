import { neon } from "@neondatabase/serverless";

const TIME_ZONE = "Asia/Kolkata";
const allowedServices = new Set([
  "General checkup",
  "Cleaning / whitening",
  "Braces / aligners",
  "Restorative / root canal consultation",
  "Tooth pain / urgent consultation",
  "Other / not sure yet"
]);

function dateInClinicZone(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return values.year + "-" + values.month + "-" + values.day;
}
function addDays(iso, days) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}
function dayOfWeek(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}
function minutesInClinicZone(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}
function validCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function validSlot(value) {
  return /^(?:0[9]|1[0-5]):(?:00|20|40)$/.test(value) || /^16:(?:00|20|40)$/.test(value);
}
function slotMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}
function validateBookingDate(date, time) {
  const today = dateInClinicZone();
  if (!validCalendarDate(date) || date < today || date > addDays(today, 14)) {
    return "Please choose a valid date within the next 14 days.";
  }
  if ([0, 6].includes(dayOfWeek(date))) {
    return "Appointments are available Monday through Friday only.";
  }
  if (!validSlot(time)) {
    return "Please choose a time slot between 9:00 AM and 4:40 PM in 20-minute intervals.";
  }
  if (date === today && slotMinutes(time) < minutesInClinicZone()) {
    return "That time has already passed. Please choose a later available slot.";
  }
  return null;
}

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
      if (new URL(origin).host !== host) return res.status(403).json({ error: "Request origin could not be verified." });
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
  if (typeof body.website === "string" && body.website.trim()) return res.status(200).json({ ok: true });

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
  const dateError = validateBookingDate(preferredDate, preferredTime);
  if (dateError) return res.status(400).json({ error: dateError });
  if (message.length > 1000) return res.status(400).json({ error: "Please keep your message under 1,000 characters." });
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > 12000) return res.status(413).json({ error: "The submitted form is too large." });
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: "Appointment requests are not available yet. Please try again later." });

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`INSERT INTO public.happy_tooth_appointments
      (patient_name, phone, email, service, preferred_date, preferred_time, message, status)
      VALUES (${patientName}, ${phone}, ${email || null}, ${service}, ${preferredDate}, ${preferredTime}, ${message || null}, 'pending')`;
    return res.status(201).json({ ok: true });
  } catch (error) {
    if (error?.code === "23505" || error?.constraint === "happy_tooth_active_slot_unique" || String(error?.message || "").includes("happy_tooth_active_slot_unique")) {
      return res.status(409).json({ error: "Sorry, that time was just booked by another patient. Please choose another available slot." });
    }
    console.error("Appointment request save failed", error?.message || "unknown error");
    return res.status(500).json({ error: "We couldn't save your request. Please try again later." });
  }
}
