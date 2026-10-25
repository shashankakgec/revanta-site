export default {
  path: '/admin/clients',
  title: 'Client Access | Revanta',
  description: 'Manage Revanta client projects and dashboard access.',
  noindex: true,
  scripts: ['admin-clients'],
  body: () => `
<style>
body.page-admin-clients{background:#f2f5fa;color:#152640}body.page-admin-clients .site-header,body.page-admin-clients .site-footer{display:none}
.ac{max-width:1120px;margin:auto;padding:26px 16px 60px;font-family:Arial,sans-serif}.ac-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px}.ac-brand{font-weight:800;letter-spacing:.16em;color:#173253;text-decoration:none}
.ac-hero{background:linear-gradient(125deg,#112746,#1f4776);color:white;padding:25px;border-radius:18px;margin-bottom:16px}.ac-hero h1{margin:9px 0;font-size:clamp(26px,4vw,38px)}.ac-hero p{margin:0;color:#e1eafa;line-height:1.6}
.ac-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ac-card{background:#fff;border:1px solid #dce4ef;border-radius:14px;padding:18px;min-width:0}.ac-card h2{margin:0 0 8px;font-size:19px}.ac-label{display:block;font-size:12px;font-weight:700;margin:13px 0 6px}.ac-input,.ac-select,.ac-textarea{width:100%;box-sizing:border-box;border:1px solid #cbd6e5;border-radius:8px;padding:10px;font:inherit;background:#fff;color:#152640}.ac-textarea{min-height:70px;resize:vertical}.ac-btn{border:0;border-radius:8px;background:#17385f;color:white;padding:10px 13px;font-weight:700;cursor:pointer}.ac-btn:disabled{opacity:.6}.ac-btn.secondary{background:#e8eef7;color:#17385f;border:1px solid #cfdaea}.ac-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.ac-msg{font-size:13px;line-height:1.5;margin-top:10px;overflow-wrap:anywhere}.ac-error{color:#a42c3a}.ac-ok{color:#18734b}.ac-muted{font-size:12px;color:#65748b;line-height:1.55}.ac-list{display:grid;gap:10px;margin-top:12px}.ac-item{border:1px solid #e0e7f0;border-radius:10px;padding:13px;min-width:0}.ac-item-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.ac-item h3{margin:0 0 5px;font-size:15px;overflow-wrap:anywhere}.ac-chip{font-size:11px;font-weight:700;border-radius:99px;padding:5px 8px;background:#e8eef7;color:#27496e;white-space:nowrap}.ac-item code{font-size:11px;overflow-wrap:anywhere;word-break:break-all}.ac-item .ac-label{margin-top:9px}.ac-admin-only{display:none}.ac-admin-only.visible{display:block}.ac-auth{max-width:650px}.ac[hidden]{display:none!important}
@media(max-width:720px){.ac-grid{grid-template-columns:1fr}.ac-hero{padding:21px}.ac-top{align-items:flex-start}}
</style>
<div class="ac">
  <div class="ac-top"><a class="ac-brand" href="/">REVANTA</a><div class="ac-actions" style="margin:0"><a class="ac-btn secondary" href="/dashboard" style="text-decoration:none">Lead admin</a><button class="ac-btn secondary" id="ac-signout" type="button">Sign out</button></div></div>
  <section class="ac-hero"><div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:700;opacity:.8">Client access management</div><h1>Clients and websites</h1><p>Create client website records, assign authenticated client accounts, and control who can access the Revanta dashboards.</p></section>
  <section class="ac-card ac-auth" id="ac-auth"><h2>Admin sign-in required</h2><p class="ac-muted">Sign in through the existing Revanta admin dashboard first, then return here. Client accounts cannot access this section.</p><div class="ac-actions"><a class="ac-btn" href="/dashboard" style="text-decoration:none">Open admin login</a><button class="ac-btn secondary" id="ac-retry" type="button">Check access again</button></div><p class="ac-msg" id="ac-auth-message" role="status"></p></section>
  <main id="ac-app" hidden>
    <div class="ac-grid">
      <section class="ac-card"><h2>Create a client website</h2><p class="ac-muted">Create a project record before assigning a client. The client dashboard will show only projects assigned to that account.</p>
        <form id="ac-project-form"><label class="ac-label" for="ac-name">Website / business name</label><input class="ac-input" id="ac-name" maxlength="150" required><label class="ac-label" for="ac-description">Project notes</label><textarea class="ac-textarea" id="ac-description" maxlength="2000"></textarea><label class="ac-label" for="ac-preview">Preview URL (optional)</label><input class="ac-input" id="ac-preview" type="url" placeholder="https://preview.example.com"><label class="ac-label" for="ac-live">Live website URL (optional)</label><input class="ac-input" id="ac-live" type="url" placeholder="https://example.com"><div class="ac-actions"><button class="ac-btn" id="ac-create" type="submit">Create website</button></div><p class="ac-msg" id="ac-project-message" role="status"></p></form>
      </section>
      <section class="ac-card"><h2>Assign a client</h2><p class="ac-muted">Clients create their account from the client dashboard. Assign that account to a website here.</p>
        <form id="ac-assign-form"><label class="ac-label" for="ac-user">Client account</label><select class="ac-select" id="ac-user" required><option value="">Loading accounts…</option></select><label class="ac-label" for="ac-project">Website</label><select class="ac-select" id="ac-project" required><option value="">Create a website first</option></select><div class="ac-actions"><button class="ac-btn" type="submit" id="ac-assign">Assign website</button><a class="ac-btn secondary" href="/client-dashboard?mode=signup" style="text-decoration:none">Open client registration</a></div><p class="ac-msg" id="ac-assign-message" role="status"></p></form>
      </section>
    </div>
    <section class="ac-card" style="margin-top:14px"><h2>Client accounts</h2><p class="ac-muted">Account details are separate from public lead-form enquiries.</p><div id="ac-client-list" class="ac-list"><p class="ac-muted">Loading client accounts…</p></div></section>
    <section class="ac-card" style="margin-top:14px"><h2>Website assignments</h2><p class="ac-muted">These assignments determine which client websites and leads each account can access.</p><div id="ac-project-list" class="ac-list"><p class="ac-muted">Loading…</p></div></section>
    <section class="ac-card ac-admin-only" id="ac-role-card" style="margin-top:14px"><h2>Authorized administrators</h2><p class="ac-muted">Only the owner can grant or remove admin privileges. Clients cannot change their own roles.</p><div id="ac-user-list" class="ac-list"></div></section>
    <p class="ac-msg" id="ac-global-message" role="status"></p>
  </main>
</div>
`,
};
