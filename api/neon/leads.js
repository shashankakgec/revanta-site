import { neon } from '@neondatabase/serverless';
const OWNER_EMAIL = String(process.env.REVANTA_OWNER_EMAIL || 'shashank2310131@akgec.ac.in').trim().toLowerCase();
const LEGACY_STAFF_EMAILS = new Set(['jaiswalshashank100@gmail.com']);
function send(res,status,body){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');return res.status(status).json(body)}
async function getUser(req){
  if(!process.env.NEON_AUTH_URL||!req.headers.cookie)return null;
  const r=await fetch(process.env.NEON_AUTH_URL.replace(/\/$/,'')+'/get-session',{headers:{cookie:req.headers.cookie,accept:'application/json'},cache:'no-store'});
  if(!r.ok)return null;
  const d=await r.json().catch(()=>null);const u=d&&(d.user||d.data&&d.data.user);
  return u&&u.id&&u.email?{id:u.id,email:String(u.email).toLowerCase()}:null;
}
function sameOrigin(req){if(!req.headers.origin)return true;try{return new URL(req.headers.origin).host===req.headers.host}catch{return false}}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!sameOrigin(req))return send(res,403,{error:'forbidden'});
  const user=await getUser(req);
  if(!user)return send(res,401,{error:'sign_in_required'});
  if(!process.env.NEON_DATABASE_URL)return send(res,503,{error:'database_not_configured'});
  const sql=neon(process.env.NEON_DATABASE_URL);
  const [roleRecord]=await sql`SELECT role FROM public.app_user_roles WHERE user_id=${user.id}::uuid`;
  const staff=user.email===OWNER_EMAIL||LEGACY_STAFF_EMAILS.has(user.email)||(roleRecord&&roleRecord.role==='staff');
  if(!staff)return send(res,403,{error:'staff_only'});
  try{
    if(req.method==='GET'){
      const leads=await sql`SELECT id,name,email,company,website,industry,budget,offering,customer_value,channels,challenge,notes,form_type,created_at,page_path,attribution,user_agent,status,follow_up_at,internal_notes,updated_at FROM public.leads ORDER BY created_at DESC LIMIT 500`;
      return send(res,200,{leads});
    }
    if(req.method==='PATCH'){
      const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
      const id=String(b.id||'');const status=['New','Contacted','Meeting Booked','Won','Lost'].includes(b.status)?b.status:'New';
      const follow=b.follow_up_at?new Date(b.follow_up_at):null;
      if(follow&&Number.isNaN(follow.getTime()))return send(res,422,{error:'invalid_follow_up'});
      const notes=String(b.internal_notes||'').slice(0,4000);
      const [lead]=await sql`UPDATE public.leads SET status=${status},follow_up_at=${follow?follow.toISOString():null}::timestamptz,internal_notes=${notes},updated_at=now() WHERE id=${id}::uuid RETURNING id,status,follow_up_at,internal_notes,updated_at`;
      return lead?send(res,200,{lead}):send(res,404,{error:'lead_not_found'});
    }
    res.setHeader('Allow','GET, PATCH');return send(res,405,{error:'method_not_allowed'});
  }catch(e){console.error('[neon leads api]',e&&e.message);return send(res,500,{error:'server_error'})}
}