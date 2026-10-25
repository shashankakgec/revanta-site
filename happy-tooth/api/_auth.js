import { createHmac, timingSafeEqual } from "node:crypto";

export function cookieHeader(req, value, maxAge) {
  const secure = req.headers["x-forwarded-proto"] === "https" || String(req.headers.host || "").endsWith(".vercel.app");
  return `ht_admin_session=${value}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${maxAge};${secure ? " Secure;" : ""}`;
}
export function makeSession(secret) {
  const payload = `${Date.now() + 8 * 60 * 60 * 1000}.${createHmac("sha256", secret).update(String(Date.now()) + Math.random()).digest("hex").slice(0, 24)}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}
export function isAuthenticated(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const cookie = String(req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith("ht_admin_session="));
  if (!cookie) return false;
  const value = cookie.slice("ht_admin_session=".length);
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now() || Number(expires) > Date.now() + 8 * 60 * 60 * 1000 + 60000) return false;
  const payload = `${expires}.${nonce}`;
  const expected = createHmac("sha256", secret).update(payload).digest();
  let received;
  try { received = Buffer.from(signature, "base64url"); } catch { return false; }
  return received.length === expected.length && timingSafeEqual(received, expected);
}
export function originAllowed(req) {
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (!origin || !host) return true;
  try { return new URL(origin).host === String(host).split(",")[0].trim(); } catch { return false; }
}
export function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") { try { return JSON.parse(req.body); } catch { return null; } }
  return null;
}
