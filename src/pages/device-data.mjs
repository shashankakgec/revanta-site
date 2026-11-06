export default {
  path: '/device-data',
  title: 'Device Data | Revanta',
  description: 'Owner-only device enrollment and consent management.',
  noindex: true,
  body: () => `
<style>
  body.page-device-data .site-header,body.page-device-data .site-footer{display:none}
  body.page-device-data{background:#f4f6fa;color:#10203b}
  .device-wrap{max-width:1040px;margin:0 auto;padding:30px 20px 70px;font-family:Arial,sans-serif}
  .device-top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:28px}
  .device-brand{font-weight:800;letter-spacing:.16em;font-size:14px}
  .device-card{background:#fff;border:1px solid #e1e7f0;border-radius:16px;padding:22px;margin:18px 0;box-shadow:0 8px 28px #1223420a}
  .device-eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#52637e;font-weight:700}
  .device-wrap h1{font-size:clamp(28px,4vw,40px);letter-spacing:-.04em;margin:8px 0}
  .device-wrap h2{font-size:20px;margin:0 0 10px}
  .device-sub,.device-muted{color:#5b6980;line-height:1.6}
  .device-label{display:block;font-size:13px;font-weight:700;margin:16px 0 7px}
  .device-input{width:100%;box-sizing:border-box;border:1px solid #d4dce8;border-radius:9px;padding:11px 12px;font:inherit;background:#fff;color:#10203b}
  .device-btn{border:0;border-radius:9px;background:#142b50;color:#fff;font-weight:700;padding:11px 15px;cursor:pointer}
  .device-btn:disabled{opacity:.55}
  .device-btn-light{background:#eaf0f8;color:#142b50}
  .device-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;border-bottom:1px solid #edf0f5}
  .device-row:last-child{border-bottom:0}
  .device-row strong{display:block;overflow-wrap:anywhere}
  .device-small{font-size:12px;color:#64748b;line-height:1.5}
  .device-code{font:700 26px ui-monospace,monospace;letter-spacing:.12em;word-break:break-all;margin:12px 0}
  .device-message{font-size:13px;line-height:1.5;margin-top:12px;color:#53647e}
  .device-error{color:#a62c38}
  .device-pill{display:inline-block;border-radius:999px;background:#edf2f8;color:#40516d;padding:4px 8px;font-size:11px;font-weight:700;margin:3px 3px 0 0}
  @media(max-width:620px){.device-wrap{padding:22px 14px}.device-card{padding:17px}.device-row{align-items:flex-start;flex-direction:column}}
</style>
<div class="device-wrap">
  <div class="device-top"><div><div class="device-brand">REVANTA</div><div class="device-eyebrow" style="margin-top:8px">Owner workspace / Device data</div></div><a class="device-btn device-btn-light" href="/dashboard">Back to leads</a></div>
  <section id="device-login" class="device-card" style="max-width:460px;margin:45px auto">
    <div class="device-eyebrow">Restricted access</div><h1>Device data</h1>
    <p class="device-sub">Sign in with the authorised Revanta staff account. Customer registration is not available.</p>
    <form id="device-login-form">
      <label class="device-label" for="device-email">Authorised email</label><input class="device-input" id="device-email" type="email" autocomplete="username" required>
      <label class="device-label" for="device-password">Password</label><input class="device-input" id="device-password" type="password" autocomplete="current-password" required>
      <button class="device-btn" id="device-login-btn" type="submit" style="width:100%;margin-top:16px">Sign in</button>
    </form><p id="device-login-message" class="device-message" role="status">Only authorised staff can create pairing codes or view connected devices.</p>
  </section>
  <main id="device-app" hidden>
    <div class="device-eyebrow">Enrollment</div><h1>Connected devices</h1>
    <p class="device-sub">Generate a one-use pairing code. It expires after 15 minutes. Pairing does not grant media or contacts access; the device must separately approve each category.</p>
    <section class="device-card">
      <h2>Create a pairing code</h2><p class="device-muted">Give this code directly to the person using the device. Do not post it publicly.</p>
      <button id="device-create-code" class="device-btn" type="button">Generate pairing code</button>
      <div id="device-code-result" hidden><div class="device-code" id="device-code-value"></div><div class="device-small" id="device-code-expiry"></div><button id="device-copy-code" class="device-btn device-btn-light" type="button">Copy code</button></div>
      <p id="device-status" class="device-message" role="status"></p>
    </section>
    <section class="device-card"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px"><h2>Enrolled devices</h2><button id="device-refresh" class="device-btn device-btn-light" type="button">Refresh</button></div><div id="device-list" class="device-muted">Loading…</div></section>
    <p class="device-small">Revoking a device immediately blocks its device token from future API requests. This does not automatically delete previously uploaded files.</p>
    <button id="device-signout" class="device-btn device-btn-light" type="button">Sign out</button>
  </main>
</div>
<script type="module">
(async function(){
  'use strict';
  var AUTH_URL='https://ep-blue-darkness-b3wymttv.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';
  var $=function(id){return document.getElementById(id)};
  var auth,token='';
  function dataOf(r){return r&&r.data?r.data:r||{}}
  function tokenOf(r){var d=dataOf(r);return d.session&&d.session.token||d.token||''}
  function message(el,t,bad){el.textContent=t||'';el.classList.toggle('device-error',!!bad)}
  function showApp(){ $('device-login').hidden=true;$('device-app').hidden=false }
  function showLogin(t,bad){$('device-login').hidden=false;$('device-app').hidden=true;if(t)message($('device-login-message'),t,bad)}
  async function api(method,body){
    var r=await fetch('/api/device',{method:method,headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:body?JSON.stringify(body):undefined,cache:'no-store'});
    var j=await r.json().catch(function(){return {}});
    if(!r.ok)throw new Error(j.error||'Request failed ('+r.status+')');
    return j;
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function date(v){var d=new Date(v);return isNaN(d.getTime())?'—':d.toLocaleString()}
  async function refresh(){
    var d=await api('GET');
    var list=$('device-list');
    if(!d.devices||!d.devices.length){list.textContent='No devices have been paired yet.';return}
    list.innerHTML=d.devices.map(function(x){
      var consent=x.consents||{};
      var tags=['photos','videos','contacts'].map(function(k){var c=consent[k];return '<span class="device-pill">'+k+': '+(c&&c.granted?'approved':'not approved')+'</span>'}).join('');
      return '<div class="device-row"><div><strong>'+esc(x.device_name)+'</strong><div class="device-small">Added '+esc(date(x.created_at))+' · Last seen '+esc(x.last_seen_at?date(x.last_seen_at):'never')+'</div><div>'+tags+'</div><div class="device-small">'+(x.revoked_at?'Access revoked':'Active')+'</div></div>'+(x.revoked_at?'':'<button class="device-btn device-btn-light" type="button" data-revoke="'+esc(x.id)+'">Revoke access</button>')+'</div>';
    }).join('');
  }
  $('device-login-form').addEventListener('submit',async function(e){
    e.preventDefault();$('device-login-btn').disabled=true;message($('device-login-message'),'Signing in…');
    try{var result=await auth.signIn.email({email:$('device-email').value.trim().toLowerCase(),password:$('device-password').value});if(result&&result.error)throw result.error;var sess=await auth.getSession();token=tokenOf(sess)||tokenOf(result);if(!token)throw new Error('No session token was returned.');showApp();await refresh()}
    catch(err){token='';showLogin(err.message||'Sign-in failed.',true)}
    finally{$('device-login-btn').disabled=false}
  });
  $('device-create-code').addEventListener('click',async function(){
    var b=$('device-create-code');b.disabled=true;message($('device-status'),'Generating a one-use code…');
    try{var d=await api('POST',{action:'create_pairing'});$('device-code-value').textContent=d.pairing_code;$('device-code-expiry').textContent='Expires '+date(d.expires_at);$('device-code-result').hidden=false;message($('device-status'),'Code created. Share it privately and use it within 15 minutes.');await refresh()}
    catch(e){message($('device-status'),e.message,true)}finally{b.disabled=false}
  });
  $('device-copy-code').addEventListener('click',async function(){try{await navigator.clipboard.writeText($('device-code-value').textContent);message($('device-status'),'Pairing code copied.')}catch(e){message($('device-status'),'Copy unavailable; select the code manually.',true)}});
  $('device-refresh').addEventListener('click',async function(){try{await refresh()}catch(e){message($('device-status'),e.message,true)}});
  $('device-list').addEventListener('click',async function(e){var b=e.target.closest('[data-revoke]');if(!b)return;if(!confirm('Revoke this device now?'))return;b.disabled=true;try{await api('PATCH',{action:'revoke',device_id:b.dataset.revoke});await refresh()}catch(err){alert(err.message)}finally{b.disabled=false}});
  $('device-signout').addEventListener('click',async function(){try{await auth.signOut()}catch(e){}token='';showLogin('You have signed out.')});
  try{var mod=await import('https://esm.sh/@neondatabase/auth@latest');auth=mod.createAuthClient(AUTH_URL);var s=await auth.getSession();token=tokenOf(s);if(token){showApp();await refresh()}else showLogin('Sign in with your authorised Revanta staff account.')}
  catch(e){showLogin('Could not connect to Neon Auth: '+(e.message||'network error'),true)}
})();
</script>
`,
};
