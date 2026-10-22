const adminEmail = 'jaiswalshashank100@gmail.com';

export default {
  path: '/dashboard',
  title: 'Private Lead Dashboard | Revanta',
  description: 'Private Revanta lead management dashboard.',
  noindex: true,
  body: () => `
<style>
  body.page-dashboard .site-header, body.page-dashboard .site-footer { display:none; }
  body.page-dashboard { background:#f4f6fa; color:#10203b; }
  .dash-wrap{max-width:1240px;margin:0 auto;padding:32px 22px 70px;font-family:Arial,sans-serif}
  .dash-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:28px}
  .dash-brand{font-weight:800;letter-spacing:.16em;font-size:14px;color:#122342}
  .dash-eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#52637e;font-weight:700}
  .dash-wrap h1{font-size:clamp(28px,4vw,42px);letter-spacing:-.04em;margin:8px 0}
  .dash-sub{color:#5b6980;margin:0;line-height:1.6}
  .dash-card{background:#fff;border:1px solid #e1e7f0;border-radius:16px;padding:22px;box-shadow:0 8px 28px #1223420a}
  .dash-auth{max-width:460px;margin:50px auto}
  .dash-auth h2{margin:0 0 8px}
  .dash-label{display:block;font-size:13px;font-weight:700;margin:18px 0 7px}
  .dash-input,.dash-select,.dash-textarea{width:100%;box-sizing:border-box;border:1px solid #d4dce8;border-radius:9px;padding:11px 12px;font:inherit;background:#fff;color:#10203b}
  .dash-textarea{min-height:78px;resize:vertical}
  .dash-btn{border:0;border-radius:9px;background:#142b50;color:#fff;font-weight:700;padding:12px 16px;cursor:pointer}
  .dash-btn:disabled{opacity:.55;cursor:wait}
  .dash-btn--light{background:#eaf0f8;color:#142b50}
  .dash-message{font-size:13px;line-height:1.5;margin-top:14px;color:#53647e}
  .dash-error{color:#a62c38}
  .dash-toolbar{display:grid;grid-template-columns:minmax(220px,1fr) 220px;gap:12px;margin:22px 0}
  .dash-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}
  .dash-stat{background:#fff;border:1px solid #e1e7f0;border-radius:13px;padding:16px}
  .dash-stat span{display:block;color:#66748a;font-size:12px;margin-bottom:8px}
  .dash-stat strong{font-size:25px;letter-spacing:-.04em}
  .dash-table-wrap{overflow:auto;border:1px solid #e1e7f0;border-radius:14px;background:#fff}
  .dash-table{border-collapse:collapse;width:100%;min-width:1000px;font-size:13px}
  .dash-table th{text-align:left;color:#65728a;font-size:11px;text-transform:uppercase;letter-spacing:.08em;background:#f8faff}
  .dash-table th,.dash-table td{padding:14px;border-bottom:1px solid #edf0f5;vertical-align:top}
  .dash-table tr:last-child td{border-bottom:0}
  .dash-name{font-weight:700;color:#152846}
  .dash-muted{color:#6c7890;font-size:12px;margin-top:4px;line-height:1.5}
  .dash-cell-select{min-width:145px;padding:8px;border:1px solid #d4dce8;border-radius:8px;background:#fff;color:#10203b}
  .dash-date{padding:8px;border:1px solid #d4dce8;border-radius:8px;min-width:145px}
  .dash-notes{display:block;min-width:190px;min-height:58px;padding:8px;border:1px solid #d4dce8;border-radius:8px;box-sizing:border-box}
  .dash-save{margin-top:7px;padding:8px 10px;font-size:12px}
  .dash-foot{color:#738097;font-size:12px;margin-top:16px}
  @media(max-width:720px){.dash-wrap{padding:22px 14px 50px}.dash-top{align-items:flex-start}.dash-toolbar{grid-template-columns:1fr}.dash-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.dash-card{padding:18px}}
</style>
<div class="dash-wrap">
  <div class="dash-top"><div><div class="dash-brand">REVANTA</div><div class="dash-eyebrow" style="margin-top:8px">Private workspace</div></div><button class="dash-btn dash-btn--light" id="dash-signout" hidden>Sign out</button></div>
  <section id="dash-login" class="dash-card dash-auth">
    <div class="dash-eyebrow">Lead management</div><h1 style="font-size:32px;margin-top:10px">Welcome back.</h1>
    <p class="dash-sub">Sign in with your authorised Revanta email and password.</p>
    <form id="dash-login-form"><label class="dash-label" for="dash-email">Authorised email</label><input class="dash-input" id="dash-email" type="email" autocomplete="username" required value="${adminEmail}" readonly><label class="dash-label" for="dash-password">Password</label><input class="dash-input" id="dash-password" type="password" autocomplete="current-password" required minlength="8><button class="dash-btn" id="dash-login-btn" type="submit" style="width:100%;margin-top:16px">Sign in</button></form>
    <p id="dash-login-message" class="dash-message" role="status">Only the authorised account can access lead records. Sign-in does not send an email.</p>
  </section>
  <section id="dash-app" hidden>
    <div class="dash-eyebrow">Revanta / Operations</div><h1>Lead dashboard</h1><p class="dash-sub">Review enquiries, track progress and keep follow-ups in one place.</p>
    <div class="dash-stats">
      <div class="dash-stat"><span>Total leads</span><strong id="stat-total">—</strong></div>
      <div class="dash-stat"><span>New</span><strong id="stat-new">—</strong></div>
      <div class="dash-stat"><span>Meetings booked</span><strong id="stat-meetings">—</strong></div>
      <div class="dash-stat"><span>Won</span><strong id="stat-won">—</strong></div>
    </div>
    <div class="dash-toolbar"><input class="dash-input" id="dash-search" placeholder="Search name, email, industry…" aria-label="Search leads"><select class="dash-select" id="dash-filter" aria-label="Filter by status"><option value="">All statuses</option><option>New</option><option>Contacted</option><option>Meeting Booked</option><option>Won</option><option>Lost</option></select></div>
    <div id="dash-status" class="dash-message" role="status">Loading leads…</div>
    <div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>Lead</th><th>Enquiry</th><th>Submitted</th><th>Status</th><th>Follow-up</th><th>Internal notes</th></tr></thead><tbody id="dash-rows"></tbody></table></div>
    <p class="dash-foot">Lead details are protected by Supabase row-level security. Internal notes are visible only to the authorised account.</p>
  </section>
</div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
(function(){
  'use strict';
  var ADMIN = '${adminEmail}';
  var SUPABASE_URL = 'https://zedwounhjhfiuystjfhr.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_f6tVXoTs5YKs5guQWe16Jg_hPMoDjGo';
  var login = document.getElementById('dash-login');
  var app = document.getElementById('dash-app');
  var loginForm = document.getElementById('dash-login-form');
  var loginMessage = document.getElementById('dash-login-message');
  var loginButton = document.getElementById('dash-login-btn');
  var signout = document.getElementById('dash-signout');
  var statusEl = document.getElementById('dash-status');
  var rowsEl = document.getElementById('dash-rows');
  var allLeads = [];
  if (!window.supabase || !window.supabase.createClient) {
    loginMessage.textContent = 'The sign-in library did not load. Check your connection and reload.';
    loginMessage.classList.add('dash-error'); return;
  }
  var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
  });
  function esc(v){return String(v == null ? '' : v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function message(el, text, error){el.textContent=text;el.classList.toggle('dash-error',!!error);}
  function showLoggedOut(text){login.hidden=false;app.hidden=true;signout.hidden=true;if(text)message(loginMessage,text,false);}
  function showLoggedIn(){login.hidden=true;app.hidden=false;signout.hidden=false;}
  function dateLabel(v){if(!v)return '—';var d=new Date(v);return isNaN(d.getTime())?'—':d.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});}
  function render(){
    var q=document.getElementById('dash-search').value.trim().toLowerCase();
    var filter=document.getElementById('dash-filter').value;
    var visible=allLeads.filter(function(x){
      var hay=[x.name,x.email,x.industry,x.budget,x.company,x.website].join(' ').toLowerCase();
      return (!q||hay.indexOf(q)!==-1)&&(!filter||x.status===filter);
    });
    document.getElementById('stat-total').textContent=allLeads.length;
    document.getElementById('stat-new').textContent=allLeads.filter(function(x){return x.status==='New';}).length;
    document.getElementById('stat-meetings').textContent=allLeads.filter(function(x){return x.status==='Meeting Booked';}).length;
    document.getElementById('stat-won').textContent=allLeads.filter(function(x){return x.status==='Won';}).length;
    rowsEl.innerHTML=visible.map(function(x){
      var d=x.follow_up_at?new Date(x.follow_up_at):null;
      var localDate=d&&!isNaN(d.getTime())?new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16):'';
      return '<tr data-id="'+esc(x.id)+'"><td><div class="dash-name">'+esc(x.name||'Unnamed')+'</div><div class="dash-muted">'+esc(x.email||'')+'</div>'+(x.company?'<div class="dash-muted">'+esc(x.company)+'</div>':'')+'</td><td><div>'+esc(x.industry||'—')+'</div><div class="dash-muted">Budget: '+esc(x.budget||'—')+'</div><div class="dash-muted">'+esc(x.form_type||'')+'</div></td><td>'+esc(dateLabel(x.created_at))+'<div class="dash-muted">'+esc(x.page_path||'')+'</div></td><td><select class="dash-cell-select" data-field="status" aria-label="Lead status">'+['New','Contacted','Meeting Booked','Won','Lost'].map(function(s){return '<option'+(x.status===s?' selected':'')+'>'+s+'</option>';}).join('')+'</select></td><td><input class="dash-date" data-field="follow_up_at" type="datetime-local" value="'+esc(localDate)+'" aria-label="Follow-up date"></td><td><textarea class="dash-notes" data-field="internal_notes" maxlength="4000" aria-label="Internal notes" placeholder="Private notes…">'+esc(x.internal_notes||'')+'</textarea><button class="dash-btn dash-save" data-save type="button">Save changes</button><div class="dash-muted" data-row-message></div></td></tr>';
    }).join('');
    if(!visible.length) rowsEl.innerHTML='<tr><td colspan="6" style="padding:24px;color:#6c7890">No leads match this search.</td></tr>';
    message(statusEl,'Showing '+visible.length+' of '+allLeads.length+' leads.',false);
  }
  async function loadLeads(){
    message(statusEl,'Loading leads…',false);
    var result=await client.from('leads').select('id,name,email,company,website,industry,budget,form_type,created_at,page_path,status,follow_up_at,internal_notes').order('created_at',{ascending:false}).limit(500);
    if(result.error){message(statusEl,'Could not load leads: '+result.error.message,true);return;}
    allLeads=result.data||[];render();
  }
  async function verifySession(){
    var result=await client.auth.getSession();
    var user=result.data&&result.data.session&&result.data.session.user;
    if(!user){showLoggedOut();return;}
    if((user.email||'').toLowerCase()!==ADMIN.toLowerCase()){
      await client.auth.signOut();showLoggedOut('This account is not authorised for the Revanta dashboard.');return;
    }
    showLoggedIn();await loadLeads();
  }
  loginForm.addEventListener('submit',async function(e){
    e.preventDefault();loginButton.disabled=true;loginButton.textContent='Signing in…';
    var password=document.getElementById('dash-password').value;
    var result=await client.auth.signInWithPassword({email:ADMIN,password:password});
    if(result.error) message(loginMessage,'Could not sign in: '+result.error.message,true);
    else {document.getElementById('dash-password').value='';message(loginMessage,'Signed in successfully.',false);}
    loginButton.disabled=false;loginButton.textContent='Sign in';
  });
  signout.addEventListener('click',async function(){await client.auth.signOut();showLoggedOut('You have signed out.');});
  document.getElementById('dash-search').addEventListener('input',render);
  document.getElementById('dash-filter').addEventListener('change',render);
  rowsEl.addEventListener('click',async function(e){
    var button=e.target.closest('[data-save]');if(!button)return;
    var row=button.closest('tr');var id=row.getAttribute('data-id');
    var status=row.querySelector('[data-field="status"]').value;
    var follow=row.querySelector('[data-field="follow_up_at"]').value;
    var notes=row.querySelector('[data-field="internal_notes"]').value.trim();
    var msg=row.querySelector('[data-row-message]');
    button.disabled=true;button.textContent='Saving…';
    var patch={status:status,follow_up_at:follow?new Date(follow).toISOString():null,internal_notes:notes||null};
    var result=await client.from('leads').update(patch).eq('id',id).select('id,status,follow_up_at,internal_notes').single();
    button.disabled=false;button.textContent='Save changes';
    if(result.error){message(msg,'Not saved: '+result.error.message,true);return;}
    var lead=allLeads.find(function(x){return String(x.id)===String(id);});
    if(lead){lead.status=result.data.status;lead.follow_up_at=result.data.follow_up_at;lead.internal_notes=result.data.internal_notes;}
    message(msg,'Saved',false);render();
  });
  client.auth.onAuthStateChange(function(event,session){
    if(event==='SIGNED_OUT'){showLoggedOut();}
    else if(event==='SIGNED_IN'&&session&&session.user&&(session.user.email||'').toLowerCase()===ADMIN.toLowerCase()){showLoggedIn();loadLeads();}
  });
  verifySession();
})();
</script>
`,
};
