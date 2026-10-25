export default {
  path: '/client-dashboard',
  title: 'Lead Dashboard | Revanta',
  description: 'View leads collected by your Revanta-built website.',
  noindex: true,
  scripts: ['client-dashboard'],
  body: () => `
<style>
body.page-client-dashboard{background:#edf2f8;color:#17263d}
body.page-client-dashboard .site-header,body.page-client-dashboard .site-footer{display:none}
.cd{max-width:1120px;margin:auto;padding:28px 18px 64px;font-family:Arial,sans-serif}
.cd-top{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:24px}
.cd-brand{font-weight:800;letter-spacing:.16em;color:#13294b;text-decoration:none}
.cd-hero{background:linear-gradient(125deg,#112746,#1f4776);color:#fff;padding:28px;border-radius:20px;margin-bottom:18px}
.cd-hero h1{font-size:clamp(28px,5vw,40px);margin:10px 0}.cd-hero p{color:#e0eaf8;line-height:1.6;margin:0}
.cd-card{background:white;border:1px solid #c8d4e3;border-radius:16px;padding:20px;box-shadow:0 8px 28px #142b5014;min-width:0}
.cd-label{display:block;font-size:12px;font-weight:700;margin:14px 0 6px}
.cd-input,.cd-select{box-sizing:border-box;width:100%;padding:11px;border:1px solid #aebed2;border-radius:9px;font:inherit;background:#fff;color:#10203b}
.cd-btn{border:0;border-radius:9px;background:#17385f;color:#fff;font-weight:700;padding:11px 15px;cursor:pointer}.cd-btn:disabled{opacity:.6}
.cd-light{background:#dce7f5;color:#12345a;border:1px solid #b6c9e0}.cd-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}
.cd-muted{font-size:13px;line-height:1.6;color:#42536b}
.cd-business-name{font-size:20px;font-weight:800;line-height:1.3;color:#17385f;margin:5px 0 0;overflow-wrap:anywhere}.cd-msg{font-size:13px;line-height:1.5;margin-top:12px;overflow-wrap:anywhere}.cd-error{color:#a42c3a}.cd-success{color:#18734b}
.cd-panel[hidden],.cd-auth[hidden]{display:none!important}
.cd-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:16px 0}
.cd-stat{background:#eef3f9;border:1px solid #cbd7e6;border-radius:12px;padding:14px}.cd-stat strong{display:block;font-size:24px;margin-top:6px}.cd-stat span{font-size:12px;color:#62718a}
.cd-lead{border:1px solid #c8d4e3;border-radius:12px;padding:15px;margin-top:10px}.cd-lead-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.cd-lead h3{margin:0 0 5px;font-size:16px;overflow-wrap:anywhere}.cd-pill{background:#dce9f8;color:#173b68;padding:5px 8px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap}
.cd-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.cd-grid p{margin:0;font-size:13px;overflow-wrap:anywhere}.cd-empty{padding:18px;background:#f7f9fc;border-radius:10px;color:#62718a;font-size:13px;line-height:1.6;margin-top:12px}
@media(max-width:700px){.cd-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.cd-grid{grid-template-columns:1fr}.cd-hero{padding:23px}.cd{padding:18px 13px 45px}.cd-top{align-items:flex-start}}
</style>
<div class="cd">
  <div class="cd-top"><a class="cd-brand" href="/">REVANTA</a></div>
  <section class="cd-hero"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;opacity:.8">Client workspace · Lead generation</div><h1>Your leads, all in one place.</h1><p>See enquiries collected by the website Revanta built for your business. Each account only sees leads assigned to its own project.</p></section>
  <section class="cd-card cd-auth" id="cd-auth">
    <h2 id="cd-auth-title">Sign in to your lead dashboard</h2><p class="cd-muted" id="cd-auth-copy">Use your Revanta client account. If you don't have one yet, create an account first.</p>
    <form id="cd-signin-form"><label class="cd-label" for="cd-email">Email</label><input class="cd-input" id="cd-email" type="email" autocomplete="username" maxlength="254" required><label class="cd-label" for="cd-password">Password</label><input class="cd-input" id="cd-password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required><div class="cd-actions"><button class="cd-btn" type="submit" id="cd-signin">Sign in</button><button class="cd-btn cd-light" type="button" id="cd-show-signup" onclick="document.getElementById('cd-signin-form').hidden=true;document.getElementById('cd-signup-form').hidden=false;document.getElementById('cd-auth-title').textContent='Create your client account';">Create account</button></div></form>
    <form id="cd-signup-form" hidden><label class="cd-label" for="cd-name">Full name</label><input class="cd-input" id="cd-name" autocomplete="name" maxlength="100" required><label class="cd-label" for="cd-business">Business name</label><input class="cd-input" id="cd-business" autocomplete="organization" maxlength="150" required><label class="cd-label" for="cd-new-email">Email</label><input class="cd-input" id="cd-new-email" type="email" autocomplete="email" maxlength="254" required><label class="cd-label" for="cd-new-password">Password</label><input class="cd-input" id="cd-new-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required><div class="cd-actions"><button class="cd-btn" type="submit" id="cd-signup">Create account</button><button class="cd-btn cd-light" type="button" id="cd-show-signin" onclick="document.getElementById('cd-signup-form').hidden=true;document.getElementById('cd-signin-form').hidden=false;document.getElementById('cd-auth-title').textContent='Sign in to your lead dashboard';">Back to sign in</button></div></form>
    <p class="cd-msg" id="cd-auth-message" role="status" aria-live="polite"></p>
  </section>
  <section class="cd-panel" id="cd-dashboard" hidden>
    <div class="cd-card"><div class="cd-lead-head"><div><div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#62718a;font-weight:700">Your lead generation</div><h2 id="cd-greeting">Dashboard overview</h2><p class="cd-muted" id="cd-account"></p><p class="cd-business-name" id="cd-business-name"></p></div><button class="cd-btn cd-light" id="cd-signout" type="button">Sign out</button></div>
      <div class="cd-stats"><div class="cd-stat"><span>Total leads</span><strong id="cd-total">—</strong></div><div class="cd-stat"><span>New</span><strong id="cd-new">—</strong></div><div class="cd-stat"><span>Contacted</span><strong id="cd-contacted">—</strong></div><div class="cd-stat"><span>Won</span><strong id="cd-won">—</strong></div></div>
    </div>
    <div class="cd-card" style="margin-top:16px"><div class="cd-lead-head"><div><h2>Your leads</h2><p class="cd-muted">Only enquiries associated with your assigned Revanta website project appear here.</p></div><button class="cd-btn cd-light" id="cd-refresh" type="button">Refresh</button></div><div id="cd-leads"><div class="cd-empty">Loading leads…</div></div><p class="cd-msg" id="cd-dashboard-message" role="status"></p></div>
  </section>
</div>`,
};