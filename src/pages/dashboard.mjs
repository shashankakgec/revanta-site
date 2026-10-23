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
  .dash-followup-panel{background:#fff;border:1px solid #e1e7f0;border-radius:16px;padding:22px;margin:22px 0;box-shadow:0 8px 28px #1223420a}
  .visitor-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}
  .visitor-session-list{margin:8px 0 0;padding-left:18px;line-height:1.65;color:#64748b;font-size:12px}
  .visitor-session-list code{font-size:11px;overflow-wrap:anywhere}
  .visitor-analytics-table{min-width:1120px}
  .visitor-analytics-table details summary{cursor:pointer;font-weight:700;color:#315b98}
  .visitor-analytics-table .visitor-id{font-family:monospace;font-size:12px;overflow-wrap:anywhere}
  body.page-dashboard.dark-mode .visitor-session-list{color:#a8b4c8}
  body.page-dashboard.dark-mode .visitor-analytics-table details summary{color:#93c5fd}
  @media(max-width:720px){.visitor-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .dash-followup-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
  .dash-followup-head h2{font-size:22px;letter-spacing:-.03em;margin:7px 0}
  .dash-followup-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:18px 0}
  .dash-followup-stat{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:5px;padding:15px;border:1px solid #e1e7f0;border-radius:12px;background:#f8faff;color:#142b50;cursor:pointer}
  .dash-followup-stat[aria-pressed="true"]{border-color:#315b98;box-shadow:inset 0 0 0 1px #315b98}
  .dash-followup-stat span{font-size:12px;color:#64748b;font-weight:700}
  .dash-followup-stat strong{font-size:26px;letter-spacing:-.04em}
  .dash-followup-stat small{font-size:11px;color:#64748b}
  .dash-followup-list{display:grid;gap:8px}
  .dash-followup-item{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 14px;border:1px solid #edf0f5;border-radius:10px}
  .dash-followup-item strong{display:block;font-size:13px;overflow-wrap:anywhere}
  .dash-followup-item p{margin:4px 0 0;font-size:12px;color:#64748b;line-height:1.5}
  .dash-followup-item button{flex-shrink:0}
  .dash-followup-empty{padding:14px;border-radius:10px;background:#f8faff;color:#64748b;font-size:13px}
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
  .dash-email-link{color:#2563eb;text-decoration:underline;text-underline-offset:2px;overflow-wrap:anywhere}
  .dash-email-link:hover{color:#1d4ed8}
  body.page-dashboard.dark-mode .dash-email-link{color:#93c5fd}
  .dash-cell-select{min-width:145px;padding:8px;border:1px solid #d4dce8;border-radius:8px;background:#fff;color:#10203b}
  .dash-date{padding:8px;border:1px solid #d4dce8;border-radius:8px;min-width:145px}
  .dash-notes{display:block;min-width:190px;min-height:58px;padding:8px;border:1px solid #d4dce8;border-radius:8px;box-sizing:border-box}
  .dash-save{margin-top:7px;padding:8px 10px;font-size:12px}
  .dash-foot{color:#738097;font-size:12px;margin-top:16px}
  .dash-view-toggle{display:flex;gap:6px;align-items:center;justify-content:flex-end;margin:0 0 12px}
  .dash-view-btn{border:1px solid #d4dce8;border-radius:9px;background:#fff;color:#43536d;padding:9px 13px;font-weight:700;cursor:pointer}
  .dash-view-btn[aria-pressed="true"]{background:#142b50;color:#fff;border-color:#142b50}
  .dash-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
  .dash-cards[hidden],.dash-table-wrap[hidden]{display:none!important}
  .dash-lead-card{background:#fff;border:1px solid #e1e7f0;border-radius:14px;padding:18px;box-shadow:0 8px 28px #12234208;min-width:0}
  .dash-lead-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  .dash-lead-card h3{font-size:17px;margin:0 0 5px;overflow-wrap:anywhere}
  .dash-pill{display:inline-flex;align-items:center;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:700;background:#edf2f8;color:#40516d;white-space:nowrap}
  .dash-lead-meta{color:#66748a;font-size:12px;line-height:1.55;overflow-wrap:anywhere}
  .dash-lead-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:16px 0}
  .dash-lead-details span{display:block;color:#718096;font-size:11px;margin-bottom:4px}
  .dash-lead-details strong{display:block;font-size:13px;font-weight:600;overflow-wrap:anywhere}
  .dash-card-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
  .dash-card-actions label{display:block;font-size:11px;font-weight:700;color:#64748b;margin-bottom:6px}
  .dash-card-actions .dash-cell-select,.dash-card-actions .dash-date{box-sizing:border-box;width:100%;min-width:0}
  .dash-card-notes{margin-top:12px}
  .dash-card-notes label{display:block;font-size:11px;font-weight:700;color:#64748b;margin-bottom:6px}
  .dash-card-notes .dash-notes{width:100%;box-sizing:border-box;min-width:0}
  .dash-card-save{margin-top:10px}
  .dash-top-actions{display:flex;align-items:center;gap:8px}
  .dash-theme-btn{border:1px solid #d4dce8;border-radius:9px;background:#fff;color:#43536d;padding:10px 12px;font-weight:700;cursor:pointer}
  body.page-dashboard.dark-mode{background:#0b1220;color:#e5eaf3}
  body.page-dashboard.dark-mode .dash-brand{color:#f1f5fb}
  body.page-dashboard.dark-mode .dash-eyebrow{color:#9baac2}
  body.page-dashboard.dark-mode .dash-sub{color:#a8b4c8}
  body.page-dashboard.dark-mode .dash-card,body.page-dashboard.dark-mode .dash-stat,body.page-dashboard.dark-mode .dash-lead-card{background:#141e30;border-color:#2a3850;box-shadow:0 8px 28px #00000020}
  body.page-dashboard.dark-mode .dash-input,body.page-dashboard.dark-mode .dash-select,body.page-dashboard.dark-mode .dash-textarea,body.page-dashboard.dark-mode .dash-cell-select,body.page-dashboard.dark-mode .dash-date,body.page-dashboard.dark-mode .dash-notes{background:#0f1828;color:#e5eaf3;border-color:#35445d;color-scheme:dark}
  body.page-dashboard.dark-mode .dash-btn--light{background:#263650;color:#e5eaf3}
  body.page-dashboard.dark-mode .dash-theme-btn,body.page-dashboard.dark-mode .dash-view-btn{background:#17243a;color:#cbd5e1;border-color:#35445d}
  body.page-dashboard.dark-mode .dash-view-btn[aria-pressed="true"]{background:#dbeafe;color:#142b50;border-color:#dbeafe}
  body.page-dashboard.dark-mode .dash-table-wrap{background:#141e30;border-color:#2a3850}
  body.page-dashboard.dark-mode .dash-followup-panel{background:#141e30;border-color:#2a3850;box-shadow:0 8px 28px #00000020}
  body.page-dashboard.dark-mode .dash-followup-stat{background:#17243a;color:#e5eaf3;border-color:#35445d}
  body.page-dashboard.dark-mode .dash-followup-stat span,body.page-dashboard.dark-mode .dash-followup-stat small{color:#a8b4c8}
  body.page-dashboard.dark-mode .dash-followup-stat[aria-pressed="true"]{border-color:#93c5fd;box-shadow:inset 0 0 0 1px #93c5fd}
  body.page-dashboard.dark-mode .dash-followup-item{border-color:#26354b}
  body.page-dashboard.dark-mode .dash-followup-item p{color:#a8b4c8}
  body.page-dashboard.dark-mode .dash-followup-empty{background:#17243a;color:#a8b4c8}
  body.page-dashboard.dark-mode .dash-table th{background:#1a2940;color:#a8b7ce}
  body.page-dashboard.dark-mode .dash-table th,body.page-dashboard.dark-mode .dash-table td{border-bottom-color:#26354b}
  body.page-dashboard.dark-mode .dash-name{color:#f1f5fb}
  body.page-dashboard.dark-mode .dash-muted,body.page-dashboard.dark-mode .dash-lead-meta{color:#a8b4c8}
  body.page-dashboard.dark-mode .dash-stat span,body.page-dashboard.dark-mode .dash-lead-details span,body.page-dashboard.dark-mode .dash-card-actions label,body.page-dashboard.dark-mode .dash-card-notes label{color:#a8b4c8}
  body.page-dashboard.dark-mode .dash-pill{background:#263650;color:#dbeafe}
  body.page-dashboard.dark-mode .dash-foot{color:#8999b2}
  @media(max-width:720px){.dash-cards{grid-template-columns:1fr}.dash-view-toggle{justify-content:flex-start}.dash-lead-details{gap:10px}}
  @media(max-width:720px){.dash-wrap{padding:22px 14px 50px}.dash-top{align-items:flex-start}.dash-toolbar{grid-template-columns:1fr}.dash-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.dash-card{padding:18px}.dash-followup-panel{padding:16px}.dash-followup-head{flex-direction:column}.dash-followup-stats{gap:8px}.dash-followup-stat{padding:11px}.dash-followup-stat strong{font-size:22px}.dash-followup-item{align-items:flex-start}.dash-followup-item button{white-space:nowrap}}
</style>
<div class="dash-wrap">
  <div class="dash-top"><div><div class="dash-brand">REVANTA</div><div class="dash-eyebrow" style="margin-top:8px">Private workspace</div></div><div class="dash-top-actions"><button class="dash-theme-btn" id="dash-theme-toggle" type="button" aria-label="Switch to dark mode" title="Switch to dark mode">☾</button><button class="dash-btn dash-btn--light" id="dash-signout" hidden>Sign out</button></div></div>
  <section id="dash-login" class="dash-card dash-auth">
    <div class="dash-eyebrow">Lead management</div><h1 style="font-size:32px;margin-top:10px">Welcome back.</h1>
    <p class="dash-sub">Sign in with your authorised Revanta email and password.</p>
    <form id="dash-login-form"><label class="dash-label" for="dash-email">Authorised email</label><input class="dash-input" id="dash-email" type="email" autocomplete="username" required placeholder="you@company.com"><label class="dash-label" for="dash-password">Password</label><input class="dash-input" id="dash-password" type="password" autocomplete="current-password" required minlength="8"><button class="dash-btn" id="dash-login-btn" type="submit" style="width:100%;margin-top:16px">Sign in</button></form>
    <p id="dash-login-message" class="dash-message" role="status">Only the two approved Revanta accounts can access lead records. Sign-in does not send an email.</p>
  </section>
  <section id="dash-app" hidden>
    <div class="dash-eyebrow">Revanta / Operations</div><h1>Lead dashboard</h1><p class="dash-sub">Review enquiries, track progress and keep follow-ups in one place.</p>
    <section class="dash-followup-panel" aria-labelledby="dash-followup-heading">
      <div class="dash-followup-head"><div><div class="dash-eyebrow">Daily action list</div><h2 id="dash-followup-heading">Follow-up centre</h2><p class="dash-sub">See who needs attention next. Schedule follow-ups in each lead's row or card.</p></div><button class="dash-btn dash-btn--light" id="dash-followup-reset" type="button">Show all leads</button></div>
      <div class="dash-followup-stats">
        <button type="button" class="dash-followup-stat" data-task-filter="overdue"><span>Overdue</span><strong id="followup-overdue">—</strong><small>Needs attention</small></button>
        <button type="button" class="dash-followup-stat" data-task-filter="today"><span>Due today</span><strong id="followup-today">—</strong><small>Scheduled for today</small></button>
        <button type="button" class="dash-followup-stat" data-task-filter="upcoming"><span>Upcoming</span><strong id="followup-upcoming">—</strong><small>Next 7 days</small></button>
      </div>
      <div class="dash-followup-list" id="dash-followup-list"><p class="dash-message">Loading follow-ups…</p></div>
      <p class="dash-foot">Closed leads (Won or Lost) are excluded. Follow-up times use your device's local time.</p>
    </section>
    <div class="dash-stats">
      <div class="dash-stat"><span>Total leads</span><strong id="stat-total">—</strong></div>
      <div class="dash-stat"><span>New</span><strong id="stat-new">—</strong></div>
      <div class="dash-stat"><span>Meetings booked</span><strong id="stat-meetings">—</strong></div>
      <div class="dash-stat"><span>Won</span><strong id="stat-won">—</strong></div>
    </div>
    <div class="dash-toolbar"><input class="dash-input" id="dash-search" placeholder="Search name, email, industry…" aria-label="Search leads"><select class="dash-select" id="dash-filter" aria-label="Filter by status"><option value="">All statuses</option><option>New</option><option>Contacted</option><option>Meeting Booked</option><option>Won</option><option>Lost</option></select></div>
    <div class="dash-view-toggle" role="group" aria-label="Choose lead display">
      <button class="dash-view-btn" id="dash-table-view" type="button" aria-pressed="true">☷ Table view</button>
      <button class="dash-view-btn" id="dash-card-view" type="button" aria-pressed="false">▦ Card view</button>
    </div>
    <div id="dash-status" class="dash-message" role="status">Loading leads…</div>
    <div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>Lead</th><th>Enquiry</th><th>Submitted</th><th>Status</th><th>Follow-up</th><th>Internal notes</th></tr></thead><tbody id="dash-rows"></tbody></table></div>
    <div id="dash-cards" class="dash-cards" hidden></div>
    <p class="dash-foot">Lead details are protected by server-side Neon authentication. Internal notes are visible only to the two approved accounts.</p>
    <section class="dash-followup-panel" id="visitor-analytics-panel" aria-labelledby="visitor-analytics-heading">
      <div class="dash-followup-head">
        <div><div class="dash-eyebrow">Website insights</div><h2 id="visitor-analytics-heading">Returning visitors</h2><p class="dash-sub">Opted-in anonymous browsers, repeat visits, active and passive time, viewed pages, and linked lead details.</p></div>
        <button class="dash-btn dash-btn--light" id="visitor-analytics-refresh" type="button">Refresh analytics</button>
      </div>
      <div class="visitor-stats" id="visitor-analytics-stats">
        <div class="dash-stat"><span>Unique visitors</span><strong>—</strong></div>
        <div class="dash-stat"><span>Returning visitors</span><strong>—</strong></div>
        <div class="dash-stat"><span>Total visits</span><strong>—</strong></div>
        <div class="dash-stat"><span>Sessions</span><strong>—</strong></div>
        <div class="dash-stat"><span>Total active time</span><strong>—</strong></div>
        <div class="dash-stat"><span>Total passive time</span><strong>—</strong></div>
      </div>
      <div id="visitor-analytics-status" class="dash-message" role="status">Loading visitor analytics…</div>
      <div class="dash-table-wrap">
        <table class="dash-table visitor-analytics-table">
          <thead><tr><th>Visitor</th><th>First / last seen</th><th>Visits</th><th>Active time</th><th>Passive time</th><th>Linked lead</th><th>Session history</th></tr></thead>
          <tbody id="visitor-analytics-rows"><tr><td colspan="7" style="padding:24px;color:#6c7890">Loading…</td></tr></tbody>
        </table>
      </div>
      <p class="dash-foot">Only opted-in visitors are measured. Active/passive time is an estimate, not proof of attention. History has no automatic expiry. To remove records, an authorised operator must manually delete them in Neon; linked leads remain but are unlinked. Respect applicable deletion requests and legal obligations.</p>
    </section>
  </section>
</div>
<script>
(async function(){
  'use strict';
  var APPROVED_EMAILS = ['jaiswalshashank100@gmail.com', 'shashank2310131@akgec.ac.in'];
  var login=document.getElementById('dash-login'), app=document.getElementById('dash-app');
  var loginForm=document.getElementById('dash-login-form'), loginMessage=document.getElementById('dash-login-message');
  var loginButton=document.getElementById('dash-login-btn'), signout=document.getElementById('dash-signout');
  var statusEl=document.getElementById('dash-status'), rowsEl=document.getElementById('dash-rows');
  var tableWrap=document.querySelector('.dash-table-wrap'), cardsEl=document.getElementById('dash-cards');
  var tableViewBtn=document.getElementById('dash-table-view'), cardViewBtn=document.getElementById('dash-card-view');
  var allLeads=[], taskFilter='', viewMode='table';
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function msg(el,text,error){el.textContent=text;el.classList.toggle('dash-error',!!error);}
  function showOut(text){login.hidden=false;app.hidden=true;signout.hidden=true;if(text)msg(loginMessage,text,false);}
  function showIn(){login.hidden=true;app.hidden=false;signout.hidden=false;}
  function dateLabel(v){if(!v)return '—';var d=new Date(v);return isNaN(d.getTime())?'—':d.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});}
  var themeToggle=document.getElementById('dash-theme-toggle');
  function setTheme(theme){var dark=theme==='dark';document.body.classList.toggle('dark-mode',dark);themeToggle.textContent=dark?'☀':'☾';themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');try{localStorage.setItem('revanta-dashboard-theme',theme);}catch(e){}}
  try{setTheme(localStorage.getItem('revanta-dashboard-theme')||'light');}catch(e){setTheme('light');}
  themeToggle.addEventListener('click',function(){setTheme(document.body.classList.contains('dark-mode')?'light':'dark');});
  var authClient=null;
  async function api(path,options){
    options=options||{};
    var headers=Object.assign({},options.headers||{});
    var requestOptions=Object.assign({},options,{method:options.method||'GET',headers:headers,credentials:'same-origin'});
    var response=await fetch(path,requestOptions);
    var data=await response.json().catch(function(){return {};});
    if(response.status===401){if(authClient)await authClient.signOut();throw new Error('Your session expired. Please sign in again.');}
    if(!response.ok)throw new Error(data.error==='database_not_configured'?'Neon database is not configured for this preview.':data.error==='auth_not_configured'?'Neon Auth is not configured for this preview.':data.error==='forbidden'?'This account is not authorised.':'Request failed ('+response.status+').');
    return data;
  }
  function formatDuration(value){
    var n=Math.max(0,Number(value)||0),h=Math.floor(n/3600),m=Math.floor((n%3600)/60),s=n%60;
    return h?h+'h '+m+'m':m?m+'m '+s+'s':s+'s';
  }
  function renderVisitorAnalytics(data){
    var summary=data.summary||{}, visitors=data.visitors||[];
    var stats=[
      ['Unique visitors',summary.unique_visitors||0],
      ['Returning visitors',summary.returning_visitors||0],
      ['Total visits',summary.total_visits||0],
      ['Sessions',summary.total_sessions||0],
      ['Total active time',formatDuration(summary.active_seconds)],
      ['Total passive time',formatDuration(summary.passive_seconds)]
    ];
    document.getElementById('visitor-analytics-stats').innerHTML=stats.map(function(x){return '<div class="dash-stat"><span>'+esc(x[0])+'</span><strong>'+esc(x[1])+'</strong></div>';}).join('');
    var rows=document.getElementById('visitor-analytics-rows');
    rows.innerHTML=visitors.map(function(v){
      var sessions=Array.isArray(v.sessions)?v.sessions:[];
      var history=sessions.length?sessions.map(function(s){
        var paths=Array.isArray(s.page_paths)?s.page_paths:[];
        return '<li><strong>'+esc(dateLabel(s.started_at))+'</strong> · Active '+esc(formatDuration(s.active_seconds))+' · Passive '+esc(formatDuration(s.passive_seconds))+
          '<br>Pages: '+(paths.length?paths.map(function(p){return '<code>'+esc(p)+'</code>';}).join(', '):'—')+'</li>';
      }).join(''):'<li>No session details yet.</li>';
      var lead=v.lead_email?'<strong>'+esc(v.lead_name||'Submitted lead')+'</strong><div class="dash-muted"><a class="dash-email-link" href="mailto:'+esc(v.lead_email)+'">'+esc(v.lead_email)+'</a></div><div class="dash-muted">Submitted '+esc(dateLabel(v.lead_created_at))+'</div>':'<span class="dash-muted">Anonymous · no linked lead</span>';
      return '<tr><td><div class="dash-name">Visitor</div><div class="visitor-id">'+esc(String(v.visitor_id||'').slice(0,8))+'…</div><div class="dash-muted">Consent '+esc(dateLabel(v.consented_at))+'</div></td>'+
        '<td><div>'+esc(dateLabel(v.first_seen))+'</div><div class="dash-muted">Last: '+esc(dateLabel(v.last_seen))+'</div></td>'+
        '<td><strong>'+esc(v.visit_count||0)+'</strong><div class="dash-muted">'+esc(v.session_count||0)+' sessions</div></td>'+
        '<td>'+esc(formatDuration(v.active_seconds))+'</td><td>'+esc(formatDuration(v.passive_seconds))+'</td><td>'+lead+'</td>'+
        '<td><details><summary>'+sessions.length+' sessions · view</summary><ul class="visitor-session-list">'+history+'</ul></details></td></tr>';
    }).join('');
    if(!visitors.length)rows.innerHTML='<tr><td colspan="7" style="padding:24px;color:#6c7890">No opted-in visitors recorded yet.</td></tr>';
    msg(document.getElementById('visitor-analytics-status'),'Showing '+visitors.length+' visitors. Data is retained until manually deleted.',false);
  }
  async function loadVisitorAnalytics(){
    var el=document.getElementById('visitor-analytics-status');
    msg(el,'Loading visitor analytics…',false);
    try{renderVisitorAnalytics(await api('/api/analytics/admin'));}
    catch(error){msg(el,'Could not load visitor analytics: '+error.message,true);document.getElementById('visitor-analytics-rows').innerHTML='<tr><td colspan="7" style="padding:24px">Analytics could not be loaded.</td></tr>';}
  }
  document.getElementById('visitor-analytics-refresh').addEventListener('click',loadVisitorAnalytics);
  function taskKind(x){if(!x.follow_up_at||x.status==='Won'||x.status==='Lost')return '';var d=new Date(x.follow_up_at),now=new Date();if(isNaN(d.getTime()))return '';var today=new Date(now.getFullYear(),now.getMonth(),now.getDate()),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),week=new Date(today.getTime()+7*86400000);if(d<today)return 'overdue';if(d<tomorrow)return 'today';if(d<week)return 'upcoming';return '';}
  function render(){
    var q=document.getElementById('dash-search').value.trim().toLowerCase(),filter=document.getElementById('dash-filter').value;
    var due=allLeads.filter(function(x){return !!taskKind(x)}).sort(function(a,b){return new Date(a.follow_up_at)-new Date(b.follow_up_at)});
    ['overdue','today','upcoming'].forEach(function(k){document.getElementById('followup-'+k).textContent=due.filter(function(x){return taskKind(x)===k}).length;});
    document.querySelectorAll('[data-task-filter]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-task-filter')===taskFilter?'true':'false')});
    var priority=due.filter(function(x){return taskFilter?taskKind(x)===taskFilter:true}).slice(0,5);
    document.getElementById('dash-followup-list').innerHTML=priority.length?priority.map(function(x){var k=taskKind(x),label=k==='overdue'?'Overdue':k==='today'?'Due today':'Upcoming';return '<div class="dash-followup-item"><div><strong>'+esc(x.name||'Unnamed lead')+'</strong><p>'+(x.email?'<a class="dash-email-link" href="mailto:'+esc(x.email)+'">'+esc(x.email)+'</a>':'No email')+' · '+label+' · '+esc(dateLabel(x.follow_up_at))+'</p></div><button type="button" class="dash-btn dash-btn--light" data-open-lead="'+esc(x.id)+'">Open lead</button></div>'}).join(''):'<div class="dash-followup-empty">'+(taskFilter?'No leads in this follow-up group.':'No follow-ups due or scheduled in the next 7 days.')+'</div>';
    var visible=allLeads.filter(function(x){var hay=[x.name,x.email,x.industry,x.budget].join(' ').toLowerCase();return (!q||hay.indexOf(q)!==-1)&&(!filter||x.status===filter)&&(!taskFilter||taskKind(x)===taskFilter)});
    document.getElementById('stat-total').textContent=allLeads.length;
    document.getElementById('stat-new').textContent=allLeads.filter(function(x){return x.status==='New'}).length;
    document.getElementById('stat-meetings').textContent=allLeads.filter(function(x){return x.status==='Meeting Booked'}).length;
    document.getElementById('stat-won').textContent=allLeads.filter(function(x){return x.status==='Won'}).length;
    function fields(x){var d=x.follow_up_at?new Date(x.follow_up_at):null;return d&&!isNaN(d.getTime())?new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16):'';}
    function statusSelect(x){return '<select class="dash-cell-select" data-field="status" aria-label="Lead status">'+['New','Contacted','Meeting Booked','Won','Lost'].map(function(s){return '<option'+(x.status===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select>';}
    function editor(x){return '<div class="dash-card-actions"><div><label>Status</label>'+statusSelect(x)+'</div><div><label>Follow-up</label><input class="dash-date" data-field="follow_up_at" type="datetime-local" value="'+esc(fields(x))+'" aria-label="Follow-up date"></div></div><div class="dash-card-notes"><label>Internal notes</label><textarea class="dash-notes" data-field="internal_notes" maxlength="4000" placeholder="Private notes…">'+esc(x.internal_notes||'')+'</textarea><button class="dash-btn dash-save" data-save type="button">Save changes</button><div class="dash-muted" data-row-message></div></div>';}
    rowsEl.innerHTML=visible.map(function(x){return '<tr data-id="'+esc(x.id)+'"><td><div class="dash-name">'+esc(x.name||'Unnamed')+'</div><div class="dash-muted">'+(x.email?'<a class="dash-email-link" href="mailto:'+esc(x.email)+'">'+esc(x.email)+'</a>':'')+'</div></td><td>'+esc(x.industry||'—')+'<div class="dash-muted">Budget: '+esc(x.budget||'—')+'</div></td><td>'+esc(dateLabel(x.created_at))+'</td><td>'+statusSelect(x)+'</td><td><input class="dash-date" data-field="follow_up_at" type="datetime-local" value="'+esc(fields(x))+'" aria-label="Follow-up date"></td><td><textarea class="dash-notes" data-field="internal_notes" maxlength="4000" placeholder="Private notes…">'+esc(x.internal_notes||'')+'</textarea><button class="dash-btn dash-save" data-save type="button">Save changes</button><div class="dash-muted" data-row-message></div></td></tr>'}).join('');
    if(!visible.length)rowsEl.innerHTML='<tr><td colspan="6" style="padding:24px;color:#6c7890">No leads match this search.</td></tr>';
    cardsEl.innerHTML=visible.map(function(x){return '<article class="dash-lead-card" data-id="'+esc(x.id)+'"><div class="dash-lead-card-top"><div><h3>'+esc(x.name||'Unnamed')+'</h3><div class="dash-lead-meta">'+(x.email?'<a class="dash-email-link" href="mailto:'+esc(x.email)+'">'+esc(x.email)+'</a>':'No email')+'</div></div><span class="dash-pill">'+esc(x.status||'New')+'</span></div><div class="dash-lead-details"><div><span>Industry</span><strong>'+esc(x.industry||'—')+'</strong></div><div><span>Budget</span><strong>'+esc(x.budget||'—')+'</strong></div><div><span>Submitted</span><strong>'+esc(dateLabel(x.created_at))+'</strong></div><div><span>Form</span><strong>'+esc(x.form_type||'—')+'</strong></div></div>'+editor(x)+'</article>'}).join('');
    if(!visible.length)cardsEl.innerHTML='<div class="dash-card">No leads match this search.</div>';
    tableWrap.hidden=viewMode!=='table';cardsEl.hidden=viewMode!=='cards';
    tableViewBtn.setAttribute('aria-pressed',viewMode==='table'?'true':'false');cardViewBtn.setAttribute('aria-pressed',viewMode==='cards'?'true':'false');
    msg(statusEl,'Showing '+visible.length+' of '+allLeads.length+' leads.',false);
  }
  async function loadLeads(){msg(statusEl,'Loading leads from Neon…',false);try{var data=await api('/api/dashboard-leads');allLeads=data.leads||[];render();}catch(e){msg(statusEl,e.message,true);}}
  async function verifySession(){
    var r=await authClient.getSession();
    var data=r&&r.data;
    var user=data&&(data.user||(data.session&&data.session.user));
    if(!user){showOut();return;}
    if(!APPROVED_EMAILS.includes(String(user.email||'').toLowerCase())){
      await authClient.signOut();showOut('This account is not authorised for the Revanta dashboard.');return;
    }
    showIn();await loadLeads();await loadVisitorAnalytics();
  }
  loginForm.addEventListener('submit',async function(e){
    e.preventDefault();loginButton.disabled=true;loginButton.textContent='Signing in…';
    try{
      var result=await authClient.signIn.email({email:document.getElementById('dash-email').value.trim().toLowerCase(),password:document.getElementById('dash-password').value});
      if(result&&result.error)msg(loginMessage,'Could not sign in: '+(result.error.message||'Please check your email and password.'),true);
      else{document.getElementById('dash-password').value='';await verifySession();}
    }catch(error){msg(loginMessage,error.message||'Could not sign in. Please try again.',true);}
    finally{loginButton.disabled=false;loginButton.textContent='Sign in';}
  });
  signout.addEventListener('click',async function(){try{await authClient.signOut();showOut('You have signed out.');}catch(e){showOut('Sign-out failed. Please reload the page.');}});
  document.getElementById('dash-search').addEventListener('input',render);document.getElementById('dash-filter').addEventListener('change',render);
  document.querySelectorAll('[data-task-filter]').forEach(function(b){b.addEventListener('click',function(){taskFilter=taskFilter===b.getAttribute('data-task-filter')?'':b.getAttribute('data-task-filter');render();});});
  document.getElementById('dash-followup-reset').addEventListener('click',function(){taskFilter='';document.getElementById('dash-search').value='';document.getElementById('dash-filter').value='';render();});
  document.getElementById('dash-followup-list').addEventListener('click',function(e){var b=e.target.closest('[data-open-lead]');if(!b)return;taskFilter='';document.getElementById('dash-search').value='';document.getElementById('dash-filter').value='';render();var target=(viewMode==='table'?rowsEl:cardsEl).querySelector('[data-id="'+b.getAttribute('data-open-lead')+'"]');if(target)target.scrollIntoView({behavior:'smooth',block:'center'});});
  tableViewBtn.addEventListener('click',function(){viewMode='table';render();});cardViewBtn.addEventListener('click',function(){viewMode='cards';render();});
  async function saveLead(button){var row=button.closest('[data-id]'),id=row.getAttribute('data-id'),status=row.querySelector('[data-field="status"]').value,follow=row.querySelector('[data-field="follow_up_at"]').value,notes=row.querySelector('[data-field="internal_notes"]').value.trim(),label=row.querySelector('[data-row-message]');button.disabled=true;button.textContent='Saving…';try{var data=await api('/api/dashboard-leads',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,status:status,follow_up_at:follow?new Date(follow).toISOString():null,internal_notes:notes})});var lead=allLeads.find(function(x){return String(x.id)===String(id)});if(lead){lead.status=data.lead.status;lead.follow_up_at=data.lead.follow_up_at;lead.internal_notes=data.lead.internal_notes;}msg(label,'Saved to Neon.',false);render();}catch(e){msg(label,'Not saved: '+e.message,true);button.disabled=false;button.textContent='Save changes';}}
  rowsEl.addEventListener('click',function(e){var b=e.target.closest('[data-save]');if(b)saveLead(b);});cardsEl.addEventListener('click',function(e){var b=e.target.closest('[data-save]');if(b)saveLead(b);});
  try{
    var authModule=await import('https://esm.sh/@neondatabase/auth@latest');
    if(!authModule.createAuthClient)throw new Error('Neon Auth client did not load.');
    authClient=authModule.createAuthClient(window.location.origin+'/api/auth');
    await verifySession();
  }catch(error){showOut('Neon Auth could not initialize: '+(error.message||'Please reload and try again.'));}
})();
</script>
`,
};
