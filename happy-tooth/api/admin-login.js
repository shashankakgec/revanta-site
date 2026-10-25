import { createHmac, timingSafeEqual } from "node:crypto";
import { cookieHeader, makeSession, originAllowed, parseBody } from "../lib/admin-auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({error:"Method not allowed."}); }
  if (!originAllowed(req)) return res.status(403).json({error:"Request origin could not be verified."});
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!expected || expected.length < 12 || !secret || secret.length < 32) return res.status(503).json({error:"Admin access is not configured yet."});
  const body = parseBody(req);
  const password = typeof body?.password === "string" ? body.password : "";
  const a = createHmac("sha256", "happy-tooth-login").update(password).digest();
  const b = createHmac("sha256", "happy-tooth-login").update(expected).digest();
  if (password.length > 200 || !timingSafeEqual(a,b)) return res.status(401).json({error:"Incorrect password."});
  res.setHeader("Set-Cookie", cookieHeader(req, makeSession(secret), 8*60*60));
  return res.status(200).json({ok:true});
}
