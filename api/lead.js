import { neon } from '@neondatabase/serverless';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/\s+/g, ' ');
const wantsJson = (req) => /application\/json/.test(req.headers['content-type'] || '') || /application\/json/.test(req.headers.accept || '');
function reply(req, res, status, payload) {
  if (wantsJson(req)) return res.status(status).json(payload);
  return res.status(status).redirect(303, payload.ok ? '/contact/thanks?type=general' : '/contact#submit-error');
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok:false, error:'method_not_allowed' }); }
  if (!sameOrigin(req)) return res.status(403).json({ ok:false, error:'forbidden' });
  let body=req.body;
  if(typeof body==='string'){try{body=JSON.parse(body)}catch{body={}}}
  body=body&&typeof body==='object'?body:{};
  if(clean(body.url_confirm,50)|| (Number(body.form_ts)>0 && Date.now()-Number(body.form_ts)<1500)) return reply(req,res,200,{ok:true});
  const f={
    name:oneLine(body.name,120), email:oneLine(body.email,200), company:oneLine(body.company,160),
    website:oneLine(body.website,300), industry:oneLine(body.industry,80), budget:oneLine(body.budget,80),
    offering:oneLine(body.offering,200), customer_value:oneLine(body.customer_value,120),
    challenge:clean(body.challenge,2000), notes:clean(body.notes,3000),
    channels:(Array.isArray(body.channels)?body.channels:[]).slice(0,6).map(x=>oneLine(x,80)).filter(Boolean)
  };
  const errors={};
  for(const key of ['name','email','industry','budget']) if(!f[key]) errors[key]='This field is required.';
  if(f.email&&!EMAIL.test(f.email)) errors.email='Enter a valid email address.';
  if(Object.keys(errors).length) return reply(req,res,422,{ok:false,errors});
  if(!process.env.NEON_DATABASE_URL) return reply(req,res,503,{ok:false,error:'not_configured'});
  try {
    const sql=neon(process.env.NEON_DATABASE_URL);
    const attribution=body.attribution&&typeof body.attribution==='object'?body.attribution:{};
    await sql`
      INSERT INTO public.leads
      (name,email,company,website,industry,budget,form_type,message,created_at,page_path,status,
       follow_up_at,internal_notes,updated_at,offering,customer_value,channels,challenge,notes,attribution,user_agent)
      VALUES
      (\${f.name},\${f.email},\${f.company||null},\${f.website||null},\${f.industry},\${f.budget},
       'general',\${f.challenge||f.notes||null},NOW(),\${oneLine(body.page_path,300)||null},'New',
       NULL,'',NOW(),\${f.offering||null},\${f.customer_value||null},\${f.channels},
       \${f.challenge||null},\${f.notes||null},\${JSON.stringify(attribution)}::jsonb,
       \${oneLine(req.headers['user-agent'],300)||null})
    `;
    return reply(req,res,200,{ok:true});
  } catch(error) {
    console.error('[lead] Neon insert failed:',error&&error.message);
    return reply(req,res,502,{ok:false,error:'database_failed'});
  }
}
