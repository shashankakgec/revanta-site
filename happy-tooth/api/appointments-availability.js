import { neon } from "@neondatabase/serverless";

const TIME_ZONE = "Asia/Kolkata";
function clinicDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
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
function validDate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}
function currentMinutes() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}
function slots() {
  const out = [];
  for (let minute = 9 * 60; minute <= 16 * 60 + 40; minute += 20) {
    out.push(String(Math.floor(minute / 60)).padStart(2, "0") + ":" + String(minute % 60).padStart(2, "0"));
  }
  return out;
}
function toMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
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
  const date = String(req.query?.date || "").trim();
  const today = clinicDate();
  if (!validDate(date) || date < today || date > addDays(today, 14)) {
    return res.status(400).json({ error: "Please choose a date within the next 14 days." });
  }
  if ([0, 6].includes(dayOfWeek(date))) {
    return res.status(400).json({ error: "Appointments are available Monday through Friday only." });
  }
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: "Appointment availability is not configured." });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT preferred_time FROM public.happy_tooth_appointments WHERE preferred_date = ${date}::date AND status <> 'cancelled' AND preferred_time ~ '^([01][0-9]|16):(00|20|40)$'`;
    const booked = new Set(rows.map((row) => row.preferred_time));
    const now = currentMinutes();
    const availableTimes = slots().filter((slot) => !booked.has(slot) && (date !== today || toMinutes(slot) >= now));
    return res.status(200).json({ date, availableTimes, bookedTimes: [...booked] });
  } catch (error) {
    console.error("Appointment availability lookup failed", error?.message || "unknown error");
    return res.status(500).json({ error: "Could not load available times. Please try again." });
  }
}
