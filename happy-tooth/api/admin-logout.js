import { cookieHeader, originAllowed } from "./_auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({error:"Method not allowed."}); }
  if (!originAllowed(req)) return res.status(403).json({error:"Request origin could not be verified."});
  res.setHeader("Set-Cookie", cookieHeader(req, "", 0));
  return res.status(200).json({ok:true});
}
