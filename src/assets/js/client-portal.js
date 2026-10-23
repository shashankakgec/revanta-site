(function () {
  'use strict';
  var authClient, user = null, profile = null, items = [];
  var $ = function (id) { return document.getElementById(id); };

  function msg(id, text, bad) {
    var el = $(id);
    if (el) {
      el.textContent = text || '';
      el.className = 'portal-msg' + (bad ? ' portal-error' : text ? ' portal-success' : '');
    }
  }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(value) {
    try { var u = new URL(value); return /^https?:$/.test(u.protocol) ? u.href : ''; }
    catch (_) { return ''; }
  }
  function link(label, value) {
    var href = safeUrl(value);
    return href ? '<a target="_blank" rel="noopener noreferrer" href="' + esc(href) + '">' + label + '</a>' : '';
  }
  var labels = { planning: 'Planning', in_progress: 'In progress', review: 'In review', ready: 'Ready', live: 'Live', paused: 'Paused' };
  function card(project) {
    return '<article class="portal-project" data-id="' + esc(project.id) + '">' +
      '<div class="portal-project-head"><div><h3>' + esc(project.name) + '</h3><p class="portal-muted">' +
      esc(project.description || 'No milestone details yet.') + '</p></div><span class="portal-pill">' +
      esc(labels[project.status] || project.status || 'Planning') + '</span></div><div class="portal-links">' +
      link('Open preview ↗', project.preview_url) + link('Open live website ↗', project.live_url) + '</div></article>';
  }
  function normalizeSession(result) {
    var data = result && result.data;
    return data && (data.user || (data.session && data.session.user)) || null;
  }
  function show(nextUser) {
    user = nextUser || null;
    $('portal-auth').hidden = !!user;
    $('portal-client').hidden = !user;
    $('portal-staff').hidden = true;
    if (user) {
      $('portal-user-id').textContent = user.id || '';
      $('portal-account').textContent = user.email || '';
      $('portal-greeting').textContent = 'Hello' + (profile && profile.full_name ? ' ' + profile.full_name : user.name ? ' ' + user.name : '') + '.';
    }
  }
  async function api(method, body) {
    var response = await fetch('/api/client-projects', {
      method: method || 'GET',
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined
    });
    var data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      if (response.status === 401) throw new Error('Your session expired. Please sign in again.');
      if (data.error === 'database_not_configured') throw new Error('Neon database is not configured for this preview.');
      throw new Error(data.error === 'forbidden' ? 'This account cannot access this workspace.' : 'Could not load your workspace (' + response.status + ').');
    }
    return data;
  }
  async function load() {
    var data = await api('GET');
    profile = data.profile || null;
    if (!profile) {
      var saved = await api('POST', {
        full_name: $('portal-name').value.trim() || (user && user.name) || '',
        business_name: $('portal-business').value.trim() || ''
      });
      profile = saved.profile || null;
    }
    $('portal-greeting').textContent = 'Hello' + (profile && profile.full_name ? ' ' + profile.full_name : user.name ? ' ' + user.name : '') + '.';
    $('portal-account').textContent = (user.email || '') + (profile && profile.business_name ? ' · ' + profile.business_name : '');
    items = Array.isArray(data.projects) ? data.projects : [];
    $('portal-project-list').innerHTML = items.length ? items.map(card).join('') :
      '<div class="portal-empty">No project has been assigned yet. Your project will appear here once Revanta links it to your account.</div>';
    msg('portal-client-message', items.length ? 'Your workspace is up to date.' : 'You are signed in. Your projects will appear here once assigned.', false);
  }
  function errorText(error) {
    var text = error && error.message || 'Something went wrong. Please try again.';
    if (/already exists|already registered|user already/i.test(text)) return 'An account with this email already exists. Switch to Sign in.';
    if (/invalid email or password|invalid credentials|incorrect password/i.test(text)) return 'Email or password is incorrect.';
    if (/failed to fetch|networkerror|load failed/i.test(text)) return 'Could not reach Neon Auth. Check your connection and try again.';
    return text;
  }
  var signupMode = false;
  function setMode(signup) {
    signupMode = !!signup;
    $('portal-signin-form').hidden = signupMode;
    $('portal-signup-section').hidden = !signupMode;
    $('portal-auth-title').textContent = signupMode ? 'Create your client account' : 'Sign in';
    $('portal-auth-copy').textContent = signupMode
      ? 'Create an account to get started. Your projects remain private until Revanta assigns them.'
      : 'Sign in with your email ID and password to view your Revanta projects.';
    $('portal-auth-toggle-copy').textContent = signupMode ? 'Already have an account?' : 'Don’t have an account yet?';
    $('portal-auth-toggle').textContent = signupMode ? 'Sign in' : 'Create account';
    msg('portal-signin-message', '', false);
    msg('portal-signup-message', '', false);
    $('portal-name').disabled = !signupMode;
    $('portal-business').disabled = !signupMode;
    $('portal-signup-email').disabled = !signupMode;
    $('portal-signup-password').disabled = !signupMode;
    $('portal-name').required = signupMode;
    $('portal-business').required = signupMode;
    $('portal-signup-email').required = signupMode;
    $('portal-signup-password').required = signupMode;
  }
  async function refreshSession() {
    var result = await authClient.getSession();
    var nextUser = normalizeSession(result);
    show(nextUser);
    if (nextUser) {
      try { await load(); }
      catch (error) { msg('portal-client-message', errorText(error), true); }
    }
  }
  function bind() {
    $('portal-auth-toggle').addEventListener('click', function (event) {
      event.preventDefault();
      setMode(!signupMode);
      try { history.replaceState(null, '', location.pathname + (signupMode ? '?mode=signup' : '')); } catch (_) {}
      if (signupMode) $('portal-name').focus();
    });
    $('portal-signup-form').addEventListener('submit', async function (event) {
      event.preventDefault();
      var button = $('portal-signup-submit');
      button.disabled = true;
      msg('portal-signup-message', 'Creating account with Neon…', false);
      try {
        var result = await authClient.signUp.email({
          name: $('portal-name').value.trim(),
          email: $('portal-signup-email').value.trim().toLowerCase(),
          password: $('portal-signup-password').value
        });
        if (result && result.error) throw result.error;
        var sessionResult = await authClient.getSession();
        var nextUser = normalizeSession(sessionResult);
        if (!nextUser) {
          setMode(false);
          $('portal-signin-email').value = $('portal-signup-email').value.trim().toLowerCase();
          msg('portal-signin-message', 'Account created. Sign in to open your workspace.', false);
          return;
        }
        show(nextUser);
        await api('POST', { full_name: $('portal-name').value.trim(), business_name: $('portal-business').value.trim() });
        await load();
        msg('portal-client-message', 'Account created. Your client workspace is ready.', false);
      } catch (error) {
        setMode(true);
        msg('portal-signup-message', errorText(error), true);
      } finally { button.disabled = false; }
    });
    $('portal-signin-form').addEventListener('submit', async function (event) {
      event.preventDefault();
      var button = $('portal-signin-submit');
      button.disabled = true;
      msg('portal-signin-message', 'Signing in…', false);
      try {
        var result = await authClient.signIn.email({
          email: $('portal-signin-email').value.trim().toLowerCase(),
          password: $('portal-signin-password').value
        });
        if (result && result.error) throw result.error;
        await refreshSession();
        if (!user) throw new Error('Sign-in did not establish a session. Please try again.');
      } catch (error) { msg('portal-signin-message', errorText(error), true); }
      finally { button.disabled = false; }
    });
    async function signout() {
      try { await authClient.signOut(); } finally { profile = null; show(null); setMode(false); }
    }
    $('portal-signout').addEventListener('click', signout);
    $('portal-staff-signout').addEventListener('click', signout);
    $('portal-copy-id').addEventListener('click', async function () {
      try { await navigator.clipboard.writeText(user.id); msg('portal-client-message', 'Account ID copied.', false); }
      catch (_) { msg('portal-client-message', 'Select and copy the account ID shown above.', true); }
    });
  }
  async function boot() {
    var signupRequested = false;
    try { signupRequested = new URLSearchParams(location.search).get('mode') === 'signup'; } catch (_) {}
    setMode(signupRequested);
    try {
      var mod = await import('https://esm.sh/@neondatabase/auth@latest');
      if (!mod.createAuthClient) throw new Error('Neon Auth client did not load.');
      // The Better Auth client appends its default /api/auth base path itself.
      // Pass only the origin to avoid requests to /api/auth/api/auth/... (404).
      authClient = mod.createAuthClient(window.location.origin);
      bind();
      await refreshSession();
    } catch (error) {
      msg('portal-signin-message', 'Neon Auth could not initialize: ' + errorText(error), true);
      msg('portal-signup-message', 'Neon Auth could not initialize: ' + errorText(error), true);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
