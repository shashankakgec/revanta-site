export default {
  path:'/site-analytics',
  title:'Website Analytics | Revanta',
  description:'Owner-only anonymous website engagement analytics.',
  noindex:true,
  body:()=>`
<style>
body.page-site-analytics .site-header,body.page-site-analytics .site-footer{display:none}
body.page-site-analytics{background:#f4f6fa;color:#10203b}
.sa-wrap{max-width:1050px;margin:0 auto;padding:30px 20px 70px;font-family:Arial,sans-serif}
.sa-top{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:30px}
.sa-brand{font-weight:800;letter-spacing:.16em;font-size:14px}
.sa-eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#52637e;font-weight:700}
.sa-wrap h1{font-size:clamp(28px,4vw,40px);letter-spacing:-.04em;margin:8px 0}
.sa-sub,.sa-muted{color:#5b6980;line-height:1.6}
.sa-btn{border:0;border-radius:9px;background:#142b50;color:white;font-weight:700;padding:11px 15px;cursor:pointer;text-decoration:none;display:inline-block}
.sa-light{background:#eaf0f8;color:#142b50}
.sa-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:22px 0}
.sa-card{background:white;border:1px solid #e1e7f0;border-radius:14px;padding:18px;min-width:0}
.sa-card span{display:block;font-size:12px;color:#64748b;margin-bottom:8px}
.sa-card strong{font-size:26px;letter-spacing:-.04em}
.sa-section{margin:22px 0}
.sa-list{margin-top:12px}
.sa-row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid #e9edf3}
.sa-row:last-child{border-bottom:0}
.sa-row strong{display:block;overflow-wrap:anywhere;font-size:13px}
.sa-small{font-size:12px;color:#64748b;line-height:1.5;margin-top:4px}
.sa-message{font-size:13px;color:#53647e;line-height:1.5;margin-top:14px}
.sa-error{color:#a62c38}
@media(max-width:680px){.sa-wrap{padding:22px 14px}.sa-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.sa-row{align-items:flex-start;flex-direction:column}}
</style>
<div class="sa-wrap">
  <div class="sa-top"><div><div class="sa-brand">REVANTA</div><div class="sa-eyebrow" style="margin-top:8px">Owner workspace / Website analytics</div></div><a class="sa-btn sa-light" href="/dashboard">Back to dashboard</a></div>
  <section id="sa-login" class="sa-card" style="max-width:460px;margin:45px auto">
    <div class="sa-eyebrow">Restricted access</div><h1>Website analytics</h1>
    <p class="sa-sub">Sign in with the authorised Revanta staff account.</p>
    <form id="sa-login-form">
      <label style="display:block;font-size:13px;font-weight:700;margin:16px 0 7px" for="sa-email">Authorised email</label><input id="sa-email" type="email" autocomplete="username" required style="box-sizing:border-box;width:100%;padding:11px;border:1px solid #d4dce8;border-radius:9px">
      <label style="display:block;font-size:13px;font-weight:700;margin:16px 0 7px" for="sa-password">Password</label><input id="sa-password" type="password" autocomplete="current-password" required style="box-sizing:border-box;width:100%;padding:11px;border:1px solid #d4dce8;border-radius:9px">
      <button class="sa-btn" id="sa-login-btn" style="width:100%;margin-top:16px">Sign in</button>
    </form><p id="sa-login-message" class="sa-message" role="status">Only authorised staff can view analytics.</p>
  </section>
  <main id="sa-app" hidden>
    <div class="sa-eyebrow">Engagement / Last 7 days</div><h1>Website time report</h1>
    <p class="sa-sub">Counts visible-tab time in 15-second intervals. This is an estimate of active browsing time, not proof that a person was reading or interacting.</p>
    <div class="sa-grid">
      <div class="sa-card"><span>Visits · 24 hours</span><strong id="sa-24">—</strong></div>
      <div class="sa-card"><span>Visits · 7 days</span><strong id="sa-7">—</strong></div>
      <div class="sa-card"><span>Average active time</span><strong id="sa-avg">—</strong></div>
      <div class="sa-card"><span>Total active time · 7 days</span><strong id="sa-total">—</strong></div>
    </div>
    <section class="sa-card sa-section"><h2 style="font-size:19px;margin:0">Recent visits</h2><div id="sa-recent" class="sa-list sa-muted">Loading…</div></section>
    <section class="sa-card sa-section"><h2 style="font-size:19px;margin:0">Pages with most active time</h2><div id="sa-pages" class="sa-list sa-muted">Loading…</div></section>
    <p class="sa-small">No names, email addresses, IP addresses, precise locations, or cross-site tracking IDs are collected by this feature. A random session identifier lasts only for the browser tab session.</p>
    <button id="sa-signout" class="sa-btn sa-light" type="button">Sign out</button>
  </main>
</div>
<script type="module">
(async function(){
'use strict';
var AUTH_URL='https://ep-blue-darkness-b3wymttv.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';
var $=function(id){return document.getElementById(id)},auth,token='';
function dataOf(r){return r&&r.data?r.data:r||{}}
function tokenOf(r){var d=dataOf(r);return d.session&&d.session.token||d.token||''}
function msg(el,t,bad){el.textContent=t||'';el.classList.toggle('sa-error',!!bad)}
function duration(v){v=Math.max(0,Number(v)||0);var m=Math.floor(v/60),s=v%60;if(m<60)return m+'m '+s+'s';var h=Math.floor(m/60);return h+'h '+(m%60)+'m'}
function date(v){var d=new Date(v);return isNaN(d.getTime())?'—':d.toLocaleString()}
async function api(){var r=await fetch('/api/site-analytics',{headers:{Authorization:'Bearer '+token},cache:'no-store'});var j=await r.json().catch(function(){return {}});if(!r.ok)throw new Error(j.error||'Analytics request failed.');return j}
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
async function load(){
var d=await api(),s=d.summary||{};
$('sa-24').textContent=s.visits_24h||0;$('sa-7').textContent=s.visits_7d||0;
$('sa-avg').textContent=duration(s.avg_seconds_7d||0);
$('sa-total').textContent=duration(s.active_seconds_7d||0);
$('sa-recent').innerHTML=(d.recent||[]).length?d.recent.map(function(x){return '<div class="sa-row"><div><strong>'+esc(x.last_page_path||'/')+'</strong><div class="sa-small">Started '+esc(date(x.started_at))+' · '+esc(x.page_views)+' page view(s)</div></div><div><strong>'+esc(duration(x.active_seconds))+'</strong><div class="sa-small">'+(x.ended_at?'Session ended':'Last seen '+esc(date(x.last_seen_at)))+'</div></div></div>'}).join(''):'No visits recorded yet.';
$('sa-pages').innerHTML=(d.pages||[]).length?d.pages.map(function(x){return '<div class="sa-row"><div><strong>'+esc(x.page_path||'/')+'</strong><div class="sa-small">'+esc(x.visits)+' visit(s)</div></div><strong>'+esc(duration(x.active_seconds))+'</strong></div>'}).join(''):'No page activity yet.';
}
function app(){ $('sa-login').hidden=true;$('sa-app').hidden=false }
function login(t,bad){$('sa-login').hidden=false;$('sa-app').hidden=true;if(t)msg($('sa-login-message'),t,bad)}
$('sa-login-form').addEventListener('submit',async function(e){e.preventDefault();$('sa-login-btn').disabled=true;msg($('sa-login-message'),'Signing in…');try{var r=await auth.signIn.email({email:$('sa-email').value.trim().toLowerCase(),password:$('sa-password').value});if(r&&r.error)throw r.error;var s=await auth.getSession();token=tokenOf(s)||tokenOf(r);if(!token)throw new Error('No session token returned.');app();await load()}catch(e){token='';login(e.message||'Sign-in failed.',true)}finally{$('sa-login-btn').disabled=false}});
$('sa-signout').addEventListener('click',async function(){try{await auth.signOut()}catch(e){}token='';login('You have signed out.')});
try{var m=await import('https://esm.sh/@neondatabase/auth@latest');auth=m.createAuthClient(AUTH_URL);var s=await auth.getSession();token=tokenOf(s);if(token){app();await load()}else login('Sign in with your authorised Revanta account.')}catch(e){login('Could not connect to Neon Auth: '+(e.message||'network error'),true)}
})();
</script>
`,
};
