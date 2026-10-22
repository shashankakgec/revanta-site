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
    <form id="dash-login-form"><label class="dash-label" for="dash-email">Authorised email</label><input class="dash-input" id="dash-email" type="email" autocomplete="username" required value="${adminEmail}" readonly><label class="dash-label" for="dash-password">Password</label><input class="dash-input" id="dash-password" type="password" autocomplete="current-password" required minlength="8"><button class="dash-btn" id="dash-login-btn" type="submit" style="width:100%;margin-top:16px">Sign in</button></form>
    <p id="dash-login-message" class="dash-message" role="status">Only the authorised account can access lead records. Sign-in does not send an email.</p>
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
  var themeToggle = document.getElementById('dash-theme-toggle');
  function setTheme(theme){
    var dark=theme==='dark';
    document.body.classList.toggle('dark-mode',dark);
    themeToggle.textContent=dark?'☀':'☾';
    themeToggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
    themeToggle.setAttribute('title',dark?'Switch to light theme':'Switch to dark theme');
    try{window.localStorage.setItem('revanta-dashboard-theme',dark?'dark':'light');}catch(e){}
  }
  var savedTheme='light';
  try{savedTheme=window.localStorage.getItem('revanta-dashboard-theme')||'light';}catch(e){}
  setTheme(savedTheme);
  themeToggle.addEventListener('click',function(){
    setTheme(document.body.classList.contains('dark-mode')?'light':'dark');
  });
  var statusEl = document.getElementById('dash-status');
  var rowsEl = document.getElementById('dash-rows');
  var tableWrap = document.querySelector('.dash-table-wrap');
  var cardsEl = document.getElementById('dash-cards');
  var tableViewBtn = document.getElementById('dash-table-view');
  var cardViewBtn = document.getElementById('dash-card-view');
  var viewMode = 'table';
  var allLeads = [];
  var taskFilter = '';
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
    var now=new Date();
    var startToday=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var startTomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
    var nextWeek=new Date(startToday.getTime()+7*24*60*60*1000);
    function activeLead(x){return x.status!=='Won'&&x.status!=='Lost';}
    function taskKind(x){
      if(!x.follow_up_at||!activeLead(x)) return '';
      var d=new Date(x.follow_up_at); if(isNaN(d.getTime())) return '';
      if(d<startToday) return 'overdue';
      if(d>=startToday&&d<startTomorrow) return 'today';
      if(d>=startTomorrow&&d<nextWeek) return 'upcoming';
      return '';
    }
    var dueLeads=allLeads.filter(function(x){return !!taskKind(x);}).sort(function(a,b){return new Date(a.follow_up_at)-new Date(b.follow_up_at);});
    document.getElementById('followup-overdue').textContent=dueLeads.filter(function(x){return taskKind(x)==='overdue';}).length;
    document.getElementById('followup-today').textContent=dueLeads.filter(function(x){return taskKind(x)==='today';}).length;
    document.getElementById('followup-upcoming').textContent=dueLeads.filter(function(x){return taskKind(x)==='upcoming';}).length;
    document.querySelectorAll('[data-task-filter]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-task-filter')===taskFilter?'true':'false');});
    var taskList=document.getElementById('dash-followup-list');
    var priority=dueLeads.filter(function(x){return taskFilter?taskKind(x)===taskFilter:true;}).slice(0,5);
    taskList.innerHTML=priority.length?priority.map(function(x){
      var kind=taskKind(x);var label=kind==='overdue'?'Overdue':kind==='today'?'Due today':'Upcoming';
      return '<div class="dash-followup-item"><div><strong>'+esc(x.name||'Unnamed lead')+'</strong><p>'+esc(x.email||x.company||'No contact details')+' · '+esc(label)+' · '+esc(dateLabel(x.follow_up_at))+'</p></div><button type="button" class="dash-btn dash-btn--light" data-open-lead="'+esc(x.id)+'">Open lead</button></div>';
    }).join(''):'<div class="dash-followup-empty">'+(taskFilter?'No leads in this follow-up group.':'No follow-ups due or scheduled in the next 7 days. Add a follow-up date to a lead to see it here.')+'</div>';
    var visible=allLeads.filter(function(x){
      var hay=[x.name,x.email,x.industry,x.budget,x.company,x.website].join(' ').toLowerCase();
      return (!q||hay.indexOf(q)!==-1)&&(!filter||x.status===filter)&&(!taskFilter||taskKind(x)===taskFilter);
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
    cardsEl.innerHTML=visible.map(function(x){
      var d=x.follow_up_at?new Date(x.follow_up_at):null;
      var localDate=d&&!isNaN(d.getTime())?new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16):'';
      return '<article class="dash-lead-card" data-id="'+esc(x.id)+'">'+
        '<div class="dash-lead-card-top"><div><h3>'+esc(x.name||'Unnamed')+'</h3><div class="dash-lead-meta">'+esc(x.email||'No email provided')+'</div>'+(x.company?'<div class="dash-lead-meta">'+esc(x.company)+'</div>':'')+'</div><span class="dash-pill">'+esc(x.status||'New')+'</span></div>'+
        '<div class="dash-lead-details"><div><span>Industry</span><strong>'+esc(x.industry||'—')+'</strong></div><div><span>Budget</span><strong>'+esc(x.budget||'—')+'</strong></div><div><span>Enquiry type</span><strong>'+esc(x.form_type||'—')+'</strong></div><div><span>Submitted</span><strong>'+esc(dateLabel(x.created_at))+'</strong></div></div>'+
        '<div class="dash-lead-meta">Source page: '+esc(x.page_path||'—')+'</div>'+
        '<div class="dash-card-actions"><div><label>Status</label><select class="dash-cell-select" data-field="status" aria-label="Lead status">'+['New','Contacted','Meeting Booked','Won','Lost'].map(function(st){return '<option'+((x.status||'New')===st?' selected':'')+'>'+st+'</option>';}).join('')+'</select></div><div><label>Follow-up</label><input class="dash-date" data-field="follow_up_at" type="datetime-local" value="'+esc(localDate)+'" aria-label="Follow-up date"></div></div>'+
        '<div class="dash-card-notes"><label>Internal notes</label><textarea class="dash-notes" data-field="internal_notes" maxlength="4000" aria-label="Internal notes" placeholder="Private notes…">'+esc(x.internal_notes||'')+'</textarea><button class="dash-btn dash-save dash-card-save" data-save type="button">Save changes</button><div class="dash-muted" data-row-message></div></div>'+
        '</article>';
    }).join('');
    if(!visible.length) cardsEl.innerHTML='<div class="dash-card" style="grid-column:1/-1;color:#6c7890">No leads match this search.</div>';
    tableWrap.hidden=viewMode!=='table';
    cardsEl.hidden=viewMode!=='cards';
    tableViewBtn.setAttribute('aria-pressed',viewMode==='table'?'true':'false');
    cardViewBtn.setAttribute('aria-pressed',viewMode==='cards'?'true':'false');
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
  document.querySelectorAll('[data-task-filter]').forEach(function(button){button.addEventListener('click',function(){taskFilter=taskFilter===button.getAttribute('data-task-filter')?'':button.getAttribute('data-task-filter');render();});});
  document.getElementById('dash-followup-reset').addEventListener('click',function(){taskFilter='';document.getElementById('dash-search').value='';document.getElementById('dash-filter').value='';render();});
  document.getElementById('dash-followup-list').addEventListener('click',function(e){
    var button=e.target.closest('[data-open-lead]');if(!button)return;
    var id=button.getAttribute('data-open-lead');taskFilter='';
    document.getElementById('dash-search').value='';
    document.getElementById('dash-filter').value='';
    render();
    var selector='[data-id="'+String(id).replace(/"/g,'\\"')+'"]';
    var target=(viewMode==='table'?rowsEl:cardsEl).querySelector(selector);
    if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.style.outline='2px solid #7da7e8';setTimeout(function(){target.style.outline='';},1800);}
  });
  document.getElementById('dash-filter').addEventListener('change',render);
  tableViewBtn.addEventListener('click',function(){viewMode='table';render();});
  cardViewBtn.addEventListener('click',function(){viewMode='cards';render();});
  async function saveLeadFromRow(button){
    var row=button.closest('[data-id]');var id=row.getAttribute('data-id');
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
  }
  rowsEl.addEventListener('click',async function(e){
    var button=e.target.closest('[data-save]');if(button) await saveLeadFromRow(button);
  });
  cardsEl.addEventListener('click',async function(e){
    var button=e.target.closest('[data-save]');if(button) await saveLeadFromRow(button);
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
