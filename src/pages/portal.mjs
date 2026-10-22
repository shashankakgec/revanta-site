export default {
  path: '/portal',
  title: 'Client Portal | Revanta',
  description: 'Sign in to view your Revanta project status, milestones, previews and live website links.',
  noindex: true,
  scripts: ['client-portal'],
  body: () => `
<style>
body.page-portal{background:#f4f7fb;color:#10203b}
#portal-signin-form[hidden],#portal-signup-section[hidden]{display:none!important}
body.page-portal .site-header,body.page-portal .site-footer{display:none}
.portal{max-width:1080px;margin:auto;padding:30px 20px 70px;font-family:Arial,sans-serif}
.portal-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:30px}
.portal-brand{font-weight:800;letter-spacing:.16em;color:#13294b;text-decoration:none}
.portal-top a{color:#244a7e}
.portal-hero{padding:32px;border-radius:22px;background:linear-gradient(125deg,#112746,#1f4776);color:#fff;margin-bottom:22px}
.portal-eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:11px;font-weight:700;opacity:.8}
.portal h1{font-size:clamp(30px,5vw,46px);letter-spacing:-.045em;margin:12px 0}
.portal-hero p{line-height:1.7;max-width:650px;color:#e0eaf8;margin-bottom:0}
.portal-grid{display:grid;grid-template-columns: minmax(0,1fr) minmax(0,1fr);gap:18px}
.portal-card{background:#fff;border:1px solid #dfe7f1;border-radius:16px;padding:22px;box-shadow:0 8px 28px #142b500a;min-width:0}
.portal-card h2{font-size:20px;margin:0 0 8px}
.portal-muted{color:#62718a;font-size:13px;line-height:1.6}
.portal-label{display:block;font-size:12px;font-weight:700;margin:15px 0 7px}
.portal-input,.portal-select,.portal-area{box-sizing:border-box;width:100%;padding:12px;border:1px solid #d4deeb;border-radius:9px;font:inherit;background:#fff;color:#10203b}
.portal-area{min-height:90px;resize:vertical}
.portal-btn{border:0;border-radius:9px;background:#17385f;color:white;font-weight:700;padding:12px 16px;cursor:pointer}
.portal-btn:disabled{opacity:.6;cursor:wait}
.portal-btn--light{background:#eaf0f8;color:#17385f}
.portal-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:16px}
.portal-msg{font-size:13px;line-height:1.5;margin-top:12px;overflow-wrap:anywhere}
.portal-error{color:#a42c3a}
.portal-success{color:#18734b}
.portal-panel{margin-top:20px}
.portal-panel[hidden],.portal-auth[hidden],.portal-staff[hidden],.portal-client[hidden]{display:none!important}
.portal-project{border:1px solid #e2e9f2;border-radius:13px;padding:17px;margin-top:12px}
.portal-project-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.portal-project h3{margin:0 0 7px;font-size:17px;overflow-wrap:anywhere}
.portal-pill{display:inline-flex;border-radius:99px;padding:6px 9px;background:#edf3fb;color:#254a78;font-size:11px;font-weight:700;text-transform:capitalize;white-space:nowrap}
.portal-links{display:flex;gap:12px;flex-wrap:wrap;margin-top:14px}
.portal-links a{color:#2259a2;font-weight:700;font-size:13px}
.portal-empty{padding:18px;background:#f7f9fc;border-radius:12px;color:#62718a;font-size:13px;line-height:1.6;margin-top:14px}
.portal-divider{height:1px;background:#e8edf4;margin:20px 0}
.portal-small{font-size:11px;color:#75839a;line-height:1.5;overflow-wrap:anywhere}
.portal-stat{background:#f7f9fc;border-radius:10px;padding:13px;margin-top:14px}
.portal-stat strong{display:block;font-size:12px;margin-bottom:5px}
@media(max-width:720px){.portal-grid{grid-template-columns:1fr}.portal-hero{padding:24px}.portal{padding:18px 14px 50px}.portal-top{margin-bottom:20px}}
</style>
<div class="portal">
  <div class="portal-top"><a class="portal-brand" href="/">REVANTA</a><a href="/">Back to website ↗</a></div>
  <section class="portal-hero"><div class="portal-eyebrow">Revanta · Client workspace</div><h1>Your project, clearly in view.</h1><p>Sign in to track project progress, review preview links, and open your live website when it is ready. Project access is granted individually by the Revanta team.</p></section>
  <section class="portal-card portal-auth" id="portal-auth">
    <h2 id="portal-auth-title">Sign in</h2>
    <p class="portal-muted" id="portal-auth-copy">Sign in with your email ID and password to view your Revanta projects.</p>
    <form id="portal-signin-form">
      <label class="portal-label" for="portal-signin-email">ID (email address)</label><input class="portal-input" id="portal-signin-email" type="email" autocomplete="username" required maxlength="254" placeholder="you@company.com">
      <label class="portal-label" for="portal-signin-password">Password</label><input class="portal-input" id="portal-signin-password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" placeholder="Your password">
      <div class="portal-actions"><button class="portal-btn" id="portal-signin-submit" type="submit">Sign in</button></div>
      <p class="portal-msg" id="portal-signin-message" role="status" aria-live="polite"></p>
    </form>
    <details id="portal-signup-details" style="margin-top:16px">
      <summary class="portal-btn portal-btn--light" style="display:inline-block;list-style:none">Create account</summary>
      <div id="portal-signup-section">
      <div class="portal-divider"></div><h2>Create account</h2>
      <p class="portal-muted">Create your client account. Your projects remain private until Revanta assigns them.</p>
      <form id="portal-signup-form">
        <label class="portal-label" for="portal-name">Your name</label><input class="portal-input" id="portal-name" autocomplete="name" required maxlength="100" placeholder="Full name">
        <label class="portal-label" for="portal-business">Business name</label><input class="portal-input" id="portal-business" autocomplete="organization" required maxlength="150" placeholder="Your business">
        <label class="portal-label" for="portal-signup-email">ID (email address)</label><input class="portal-input" id="portal-signup-email" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com">
        <label class="portal-label" for="portal-signup-password">Password</label><input class="portal-input" id="portal-signup-password" type="password" autocomplete="new-password" required minlength="8" maxlength="128" placeholder="At least 8 characters">
        <div class="portal-actions"><button class="portal-btn" id="portal-signup-submit" type="submit">Create account</button></div>
        <p class="portal-msg" id="portal-signup-message" role="status" aria-live="polite"></p>
      </form>
      </div>
    </details>
  </section>
  <section class="portal-panel portal-client" id="portal-client" hidden>
    <div class="portal-card"><div class="portal-project-head"><div><div class="portal-eyebrow" style="color:#526b8d">Client overview</div><h2 id="portal-greeting">Your workspace</h2><p class="portal-muted" id="portal-account"></p></div><button class="portal-btn portal-btn--light" id="portal-signout" type="button">Sign out</button></div>
      <div class="portal-stat"><strong>Account ID (share with Revanta if your project is not listed)</strong><span class="portal-small" id="portal-user-id"></span><button class="portal-btn portal-btn--light" id="portal-copy-id" type="button" style="margin-top:10px">Copy account ID</button></div>
    </div>
    <div class="portal-card portal-panel"><h2>Your projects</h2><p class="portal-muted">Project details appear here after Revanta assigns a project to your account.</p><div id="portal-project-list"><div class="portal-empty">Loading your projects…</div></div><p class="portal-msg" id="portal-client-message" role="status"></p></div>
  </section>
  <section class="portal-panel portal-staff" id="portal-staff" hidden>
    <div class="portal-card"><div class="portal-project-head"><div><div class="portal-eyebrow" style="color:#526b8d">Revanta team</div><h2>Project management</h2><p class="portal-muted">Create a project, update its status and assign it to a client account.</p></div><button class="portal-btn portal-btn--light" id="portal-staff-signout" type="button">Sign out</button></div></div>
    <div class="portal-grid portal-panel">
      <form class="portal-card" id="portal-project-form"><h2>Create a project</h2>
        <label class="portal-label" for="project-name">Project name</label><input class="portal-input" id="project-name" required maxlength="150" placeholder="e.g. Website redesign">
        <label class="portal-label" for="project-description">Description / next milestone</label><textarea class="portal-area" id="project-description" maxlength="2000" placeholder="What is being delivered and what happens next?"></textarea>
        <label class="portal-label" for="project-status">Status</label><select class="portal-select" id="project-status"><option value="planning">Planning</option><option value="in_progress">In progress</option><option value="review">In review</option><option value="ready">Ready</option><option value="live">Live</option><option value="paused">Paused</option></select>
        <label class="portal-label" for="project-preview">Preview URL (optional)</label><input class="portal-input" id="project-preview" type="url" maxlength="2048" placeholder="https://preview.example.com">
        <label class="portal-label" for="project-live">Live website URL (optional)</label><input class="portal-input" id="project-live" type="url" maxlength="2048" placeholder="https://example.com">
        <div class="portal-actions"><button class="portal-btn" type="submit">Create project</button></div><p class="portal-msg" id="portal-create-message" role="status"></p>
      </form>
      <div class="portal-card"><h2>Assign a client</h2><p class="portal-muted">Ask the client to sign up, then use the account ID shown in their portal. Only staff can assign projects.</p>
        <label class="portal-label" for="assign-project">Project</label><select class="portal-select" id="assign-project"><option value="">Choose a project</option></select>
        <label class="portal-label" for="assign-user">Client account ID</label><input class="portal-input" id="assign-user" required placeholder="UUID from client portal" maxlength="36">
        <div class="portal-actions"><button class="portal-btn" id="portal-assign" type="button">Assign project</button></div><p class="portal-msg" id="portal-assign-message" role="status"></p>
      </div>
    </div>
    <div class="portal-card portal-panel"><h2>All projects</h2><div id="portal-staff-projects"><div class="portal-empty">Loading projects…</div></div></div>
  </section>
  <p class="portal-small" style="text-align:center;margin-top:24px">Keep your password private. Revanta will never ask you to send it by email or message.</p>
</div>`,
};
