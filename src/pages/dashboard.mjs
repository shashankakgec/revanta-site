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
    <p id="dash-login-message" class="dash-message" role="status">Access is limited to the authorised Revanta owner account. New account registration is disabled.</p>
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
    <div class="dash-table-wrap"><table class="dash-table"><thead><tr><th>Lead</th><th>Enquiry</th><th>Submitted</th><th>Status</th><th>Follow-up</th><th>Internal notes</th><th>Actions</th></tr></thead><tbody id="dash-rows"></tbody></table></div>
    <div id="dash-cards" class="dash-cards" hidden></div>
    <p class="dash-foot">Lead records are served only after server-side Neon Auth verification. Internal notes are visible only to authorised Revanta staff.</p>
  </section>
</div>
<script type="module">
(async function(){
  'use strict';
  var AUTH_URL='https://ep-blue-darkness-b3wymttv.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';
  var $=function(id){return document.getElementById(id)};
  var auth, sessionToken='', leads=[], view='table';
  var login=$('dash-login'), app=$('dash-app'), loginForm=$('dash-login-form');
  var loginMsg=$('dash-login-message'), loginBtn=$('dash-login-btn'), signout=$('dash-signout');
  var status=$('dash-status'), rows=$('dash-rows'), cards=$('dash-cards');
  var tableWrap=document.querySelector('.dash-table-wrap');
  var tableBtn=$('dash-table-view'), cardBtn=$('dash-card-view');
  function msg(el,text,bad){el.textContent=text||'';el.classList.toggle('dash-error',!!bad)}
  function escapeHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function dataOf(r){return r&&r.data?r.data:r||{}}
  function tokenOf(r){var d=dataOf(r),s=d.session||d.data&&d.data.session||{};return s.access_token||s.accessToken||d.access_token||d.accessToken||d.token||s.token||''}
  function setTheme(t){var dark=t==='dark';document.body.classList.toggle('dark-mode',dark);$('dash-theme-toggle').textContent=dark?'☀':'☾';$('dash-theme-toggle').setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');try{localStorage.setItem('revanta-dashboard-theme',t)}catch(e){}}
  try{setTheme(localStorage.getItem('revanta-dashboard-theme')||'light')}catch(e){setTheme('light')}
  $('dash-theme-toggle').addEventListener('click',function(){setTheme(document.body.classList.contains('dark-mode')?'light':'dark')});
  function loggedOut(text){login.hidden=false;app.hidden=true;signout.hidden=true;if(text)msg(loginMsg,text,true)}
  function loggedIn(){login.hidden=true;app.hidden=false;signout.hidden=false}
  function dateLabel(v){if(!v)return '—';var d=new Date(v);return isNaN(d.getTime())?'—':d.toLocaleString()}
  function localDate(v){if(!v)return '';var d=new Date(v);if(isNaN(d.getTime()))return '';var p=function(n){return String(n).padStart(2,'0')};return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())}
  async function api(method,body){var r=await fetch('/api/admin',{method:method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+sessionToken},body:body?JSON.stringify(body):undefined,cache:'no-store'});var j=await r.json().catch(function(){return {}});if(!r.ok)throw new Error(j.error||('Request failed ('+r.status+')'));return j}
  function taskKind(x){if(!x.follow_up_at||x.status==='Won'||x.status==='Lost')return '';var d=new Date(x.follow_up_at);if(isNaN(d.getTime()))return '';var now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate()),tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1),week=new Date(today.getTime()+7*86400000);if(d<today)return 'overdue';if(d<tomorrow)return 'today';if(d<week)return 'upcoming';return ''}
  function visible(){var q=$('dash-search').value.trim().toLowerCase(),f=$('dash-filter').value;return leads.filter(function(x){var text=[x.name,x.email,x.industry,x.budget].join(' ').toLowerCase();return (!q||text.indexOf(q)>=0)&&(!f||x.status===f)})}
  function setView(v){view=v;tableWrap.hidden=v!=='table';cards.hidden=v!=='cards';tableBtn.setAttribute('aria-pressed',v==='table'?'true':'false');cardBtn.setAttribute('aria-pressed',v==='cards'?'true':'false');render()}
  function render(){
    var filtered=visible(),active=leads.filter(function(x){return x.status!=='Won'&&x.status!=='Lost'});
    $('stat-total').textContent=leads.length;$('stat-new').textContent=leads.filter(function(x){return x.status==='New'}).length;
    $('stat-meetings').textContent=leads.filter(function(x){return x.status==='Meeting Booked'}).length;$('stat-won').textContent=leads.filter(function(x){return x.status==='Won'}).length;
    var due=leads.filter(function(x){return !!taskKind(x)}).sort(function(a,b){return new Date(a.follow_up_at)-new Date(b.follow_up_at)});
    $('followup-overdue').textContent=due.filter(function(x){return taskKind(x)==='overdue'}).length;
    $('followup-today').textContent=due.filter(function(x){return taskKind(x)==='today'}).length;
    $('followup-upcoming').textContent=due.filter(function(x){return taskKind(x)==='upcoming'}).length;
    var list=$('dash-followup-list');list.innerHTML=due.length?due.slice(0,6).map(function(x){return '<div class="dash-followup-item"><div><strong>'+escapeHtml(x.name||'Unnamed lead')+'</strong><p>'+escapeHtml(x.email||'')+' · '+escapeHtml(taskKind(x))+' · '+escapeHtml(dateLabel(x.follow_up_at))+'</p></div><button class="dash-btn dash-btn--light" type="button" data-focus="'+escapeHtml(x.id)+'">Open</button></div>'}).join(''):'<div class="dash-followup-empty">No follow-ups are due. Schedule one from a lead below.</div>';
    rows.innerHTML=filtered.map(function(x){return '<tr data-id="'+escapeHtml(x.id)+'"><td><div class="dash-name">'+escapeHtml(x.name||'—')+'</div><div class="dash-muted"><a class="dash-email-link" href="mailto:'+escapeHtml(x.email||'')+'">'+escapeHtml(x.email||'—')+'</a></div></td><td>'+escapeHtml(x.industry||'—')+'<div class="dash-muted">'+escapeHtml(x.budget||'—')+'</div></td><td>'+escapeHtml(dateLabel(x.created_at))+'</td><td><select class="dash-cell-select" data-field="status">'+['New','Contacted','Meeting Booked','Won','Lost'].map(function(s){return '<option'+(x.status===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select></td><td><input class="dash-date" type="datetime-local" data-field="follow_up_at" value="'+escapeHtml(localDate(x.follow_up_at))+'"></td><td><textarea class="dash-notes" data-field="internal_notes">'+escapeHtml(x.internal_notes||'')+'</textarea><button class="dash-btn dash-save" data-action="save" type="button">Save</button></td><td><button class="dash-btn dash-btn--light" data-action="delete" type="button">Delete</button></td></tr>'}).join('');
    cards.innerHTML=filtered.map(function(x){return '<article class="dash-lead-card" data-id="'+escapeHtml(x.id)+'"><div class="dash-lead-card-top"><div><h3>'+escapeHtml(x.name||'Unnamed lead')+'</h3><div class="dash-lead-meta"><a class="dash-email-link" href="mailto:'+escapeHtml(x.email||'')+'">'+escapeHtml(x.email||'—')+'</a><br>'+escapeHtml(dateLabel(x.created_at))+'</div></div><span class="dash-pill">'+escapeHtml(x.status)+'</span></div><div class="dash-lead-details"><div><span>Industry</span><strong>'+escapeHtml(x.industry||'—')+'</strong></div><div><span>Marketing budget</span><strong>'+escapeHtml(x.budget||'—')+'</strong></div></div><div class="dash-card-actions"><div><label>Status</label><select class="dash-cell-select" data-field="status">'+['New','Contacted','Meeting Booked','Won','Lost'].map(function(s){return '<option'+(x.status===s?' selected':'')+'>'+s+'</option>'}).join('')+'</select></div><div><label>Follow-up</label><input class="dash-date" type="datetime-local" data-field="follow_up_at" value="'+escapeHtml(localDate(x.follow_up_at))+'"></div></div><div class="dash-card-notes"><label>Internal notes</label><textarea class="dash-notes" data-field="internal_notes">'+escapeHtml(x.internal_notes||'')+'</textarea></div><div class="dash-card-actions dash-card-save"><button class="dash-btn" data-action="save" type="button">Save changes</button><button class="dash-btn dash-btn--light" data-action="delete" type="button">Delete lead</button></div></article>'}).join('');
    msg(status,filtered.length+' of '+leads.length+' leads',false);
  }
  async function load(){msg(status,'Loading leads…',false);var d=await api('GET');leads=d.leads||[];loggedIn();render()}
  async function saveLead(el){var card=el.closest('[data-id]'),id=card.getAttribute('data-id'),payload={id:id};card.querySelectorAll('[data-field]').forEach(function(f){var k=f.getAttribute('data-field');payload[k]=f.value});if(payload.follow_up_at)payload.follow_up_at=new Date(payload.follow_up_at).toISOString();else payload.follow_up_at=null;await api('PATCH',payload);await load()}
  async function deleteLead(el){var card=el.closest('[data-id]'),id=card.getAttribute('data-id');if(!confirm('Delete this lead permanently?'))return;await api('DELETE',{id:id});await load()}
  document.addEventListener('click',async function(e){var b=e.target.closest('button');if(!b)return;try{if(b.dataset.action==='save'){b.disabled=true;await saveLead(b)}else if(b.dataset.action==='delete'){b.disabled=true;await deleteLead(b)}else if(b.dataset.focus){$('dash-search').value='';$('dash-filter').value='';render();var target=document.querySelector('[data-id="'+CSS.escape(b.dataset.focus)+'"]');if(target)target.scrollIntoView({behavior:'smooth',block:'center'})}}catch(err){alert(err.message)}finally{b.disabled=false}});
  $('dash-search').addEventListener('input',render);$('dash-filter').addEventListener('change',render);
  tableBtn.addEventListener('click',function(){setView('table')});cardBtn.addEventListener('click',function(){setView('cards')});
  $('dash-followup-reset').addEventListener('click',function(){$('dash-search').value='';$('dash-filter').value='';render()});
  loginForm.addEventListener('submit',async function(e){e.preventDefault();loginBtn.disabled=true;msg(loginMsg,'Signing in…',false);try{var result=await auth.signIn.email({email:$('dash-email').value.trim().toLowerCase(),password:$('dash-password').value});if(result&&result.error)throw result.error;var sess=await auth.getSession();sessionToken=tokenOf(sess)||tokenOf(result);if(!sessionToken)throw new Error('Neon Auth did not return a session token.');await load()}catch(err){sessionToken='';loggedOut(err.message||'Sign-in failed.')}finally{loginBtn.disabled=false}});
  signout.addEventListener('click',async function(){try{await auth.signOut()}catch(e){}sessionToken='';loggedOut('You have signed out.')});
  try{var mod=await import('https://esm.sh/@neondatabase/auth@latest');auth=mod.createAuthClient(AUTH_URL);var sess=await auth.getSession();sessionToken=tokenOf(sess);if(sessionToken){try{await load()}catch(e){sessionToken='';loggedOut(e.message)}}else loggedOut('Sign in with your authorised Revanta account.')}catch(e){loggedOut('Could not connect to Neon Auth: '+(e.message||'network error'))}
})();
</script>
`,
};
