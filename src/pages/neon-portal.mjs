export default {
  path: '/portal-neon',
  title: 'Neon Auth Test | Revanta',
  description: 'Isolated signup and sign-in test for Revanta using Neon Auth.',
  noindex: true,
  scripts: ['neon-portal'],
  body: () => `
<style>
body.page-portal-neon{background:#f4f7fb;color:#10203b}
.neon-test{max-width:760px;margin:0 auto;padding:28px 18px 64px;font-family:Arial,sans-serif}
.neon-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:26px}
.neon-brand{font-weight:800;letter-spacing:.16em;color:#13294b;text-decoration:none}
.neon-hero{background:linear-gradient(125deg,#112746,#1f4776);color:white;padding:28px;border-radius:20px;margin-bottom:18px}
.neon-hero h1{font-size:clamp(28px,5vw,40px);margin:12px 0}
.neon-hero p{line-height:1.65;color:#e0eaf8;margin-bottom:0}
.neon-card{background:white;border:1px solid #dfe7f1;border-radius:16px;padding:22px;box-shadow:0 8px 28px #142b500a}
.neon-label{display:block;font-size:12px;font-weight:700;margin:15px 0 7px}
.neon-input{box-sizing:border-box;width:100%;padding:12px;border:1px solid #d4deeb;border-radius:9px;font:inherit;color:#10203b;background:#fff}
.neon-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:16px}
.neon-btn{border:0;border-radius:9px;background:#17385f;color:white;font-weight:700;padding:12px 16px;cursor:pointer}
.neon-btn.secondary{background:#eaf0f8;color:#17385f}
.neon-btn:disabled{opacity:.6;cursor:wait}
.neon-msg{font-size:13px;line-height:1.55;overflow-wrap:anywhere;margin-top:12px}
.neon-error{color:#a42c3a}.neon-success{color:#18734b}
.neon-note{font-size:12px;line-height:1.6;color:#62718a}
.neon-session{margin-top:16px;padding:14px;border-radius:10px;background:#f7f9fc;overflow-wrap:anywhere}
[hidden]{display:none!important}
</style>
<div class="neon-test">
  <div class="neon-head"><a class="neon-brand" href="/">REVANTA</a><a href="/portal">Existing portal ↗</a></div>
  <section class="neon-hero"><div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;opacity:.8">Isolated backend experiment</div><h1>Neon signup test</h1><p>This page is separate from the existing client portal. Use a test email and password. This prototype tests account creation and sign-in only; it does not read or modify client projects or leads.</p></section>
  <section class="neon-card">
    <div id="neon-form-area">
      <h2 id="neon-title">Create a test account</h2>
      <p class="neon-note" id="neon-copy">Create an account using Neon Auth. If you already registered, switch to sign in.</p>
      <form id="neon-signup-form">
        <label class="neon-label" for="neon-name">Name</label><input class="neon-input" id="neon-name" autocomplete="name" maxlength="100" required placeholder="Your name">
        <label class="neon-label" for="neon-signup-email">Email</label><input class="neon-input" id="neon-signup-email" type="email" autocomplete="email" maxlength="254" required placeholder="test@example.com">
        <label class="neon-label" for="neon-signup-password">Password</label><input class="neon-input" id="neon-signup-password" type="password" autocomplete="new-password" minlength="8" maxlength="128" required placeholder="At least 8 characters">
        <div class="neon-actions"><button class="neon-btn" id="neon-signup-submit" type="submit">Create test account</button></div>
      </form>
      <form id="neon-signin-form" hidden>
        <label class="neon-label" for="neon-signin-email">Email</label><input class="neon-input" id="neon-signin-email" type="email" autocomplete="username" maxlength="254" required placeholder="test@example.com">
        <label class="neon-label" for="neon-signin-password">Password</label><input class="neon-input" id="neon-signin-password" type="password" autocomplete="current-password" minlength="8" maxlength="128" required placeholder="Your password">
        <div class="neon-actions"><button class="neon-btn" id="neon-signin-submit" type="submit">Sign in</button></div>
      </form>
      <p class="neon-msg" id="neon-message" role="status" aria-live="polite"></p>
      <div class="neon-actions"><button class="neon-btn secondary" type="button" id="neon-mode-toggle">Already registered? Sign in</button></div>
    </div>
    <div id="neon-signed-in" hidden><h2>Authentication successful</h2><p class="neon-note">Neon Auth has an active session in this browser.</p><div class="neon-session"><strong>Signed-in account</strong><p id="neon-session-email"></p><p class="neon-note" id="neon-session-id"></p></div><div class="neon-actions"><button class="neon-btn" id="neon-signout" type="button">Sign out</button></div><p class="neon-msg" id="neon-session-message" role="status"></p></div>
  </section>
  <p class="neon-note" style="text-align:center;margin-top:20px">Test only. This does not replace the existing Supabase-backed portal or its database.</p>
</div>
`,
};
