import { neon } from '@neondatabase/serverless';
import { createRemoteJWKSet, jwtVerify } from 'jose';
const authIssuer = process.env.NEON_AUTH_BASE_URL;
const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
let jwks;
function send(res,status,body){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');return res.status(status).json(body)}
function sameOrigin(req){if(!req.headers.origin)return true;try{return new URL(req.headers.origin).host===req.headers.host}catch{return false}}
async function session(req){
 const h=String(req.headers.authorization||'');
 if(!h.startsWith('Bearer '))return null;
 if(!authIssuer||!jwksUrl)throw new Error('Neon Auth JWT verification is not configured.');
 try{
  if(!jwks)jwks=createRemoteJWKSet(new URL(jwksUrl));
  const {payload}=await jwtVerify(h.slice(7),jwks,{issuer:new URL(authIssuer).origin});
  const id=payload.sub;
  if(typeof id!=='string'||!id)return null;
  return {id,email:typeof payload.email==='string'?payload.email.toLowerCase():''};
 }catch{return null}
}
export default async function handler(req,res){
 if(!sameOrigin(req))return send(res,403,{error:'forbidden'});
 if(req.method!=='GET'){res.setHeader('Allow','GET');return send(res,405,{error:'method_not_allowed'})}
 try{
  const user=await session(req);if(!user)return send(res,401,{error:'sign_in_required'});
  if(!process.env.NEON_DATABASE_URL)return send(res,503,{error:'database_not_configured'});
  const sql=neon(process.env.NEON_DATABASE_URL);
  const projects=await sql`SELECT p.id,p.name FROM public.client_projects p JOIN public.client_project_members m ON m.project_id=p.id WHERE m.user_id=${user.id}::uuid ORDER BY p.updated_at DESC`;
  if(!projects.length)return send(res,200,{user,leads:[],project_assigned:false});
  const ids=projects.map(p=>p.id);
  const leads=await sql`SELECT l.id,l.name,l.email,l.industry,l.budget,l.form_type,l.created_at,l.page_path,l.status FROM public.leads l WHERE l.client_project_id = ANY(${ids}::uuid[]) ORDER BY l.created_at DESC LIMIT 500`;
  return send(res,200,{user,leads,project_assigned:true,projects});
 }catch(e){console.error('[client leads api]',e&&e.message);return send(res,500,{error:'dashboard_request_failed'})}
}