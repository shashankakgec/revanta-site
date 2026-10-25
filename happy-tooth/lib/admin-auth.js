import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function cookieHeader(req, value, maxAge) {
  const secure = req.headers["x-forwarded-proto"] === "https" || String(req.headers.host || "").endsWith(".vercel.app");
  return "ht_admin_session=" + value + "; HttpOnly; SameSite=Strict; Path=/api; Max-Age=" + maxAge + ";" + (secure ? " Secure;" : "");
}
export function makeSession(secret) {
  const expires = Date.now() + 28800000;
  const nonce = randomBytes(18).toString("hex");
  const payload = String(expires) + "." + nonce;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return payload + "." + signature;
}
export function isAuthenticated(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const cookie = String(req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith("ht_admin_session="));
  if (!cookie) return false;
  const parts = cookie.slice("ht_admin_session=".length).split(".");
  if (parts.length !== 3) return false;
  const expires = parts[0], nonce = parts[1], signature = parts[2];
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now() || Number(expires) > Date.now() + 28860000) return false;
  const expected = createHmac("sha256", secret).update(expires + "." + nonce).digest();
  const received = Buffer.from(signature, "base64url");
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
