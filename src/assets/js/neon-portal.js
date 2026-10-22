(async function () {
  'use strict';
  var AUTH_URL = 'https://ep-blue-darkness-b3wymttv.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth';
  var $ = function (id) { return document.getElementById(id); };
  var client;
  var signupMode = true;

  function message(text, bad) {
    var el = $('neon-message');
    el.textContent = text || '';
    el.className = 'neon-msg' + (bad ? ' neon-error' : text ? ' neon-success' : '');
  }
  function errorText(err) {
    var msg = err && (err.message || err.error && err.error.message) || 'Authentication failed. Please try again.';
    if (/already exists|already registered|user already/i.test(msg)) return 'An account with this email already exists. Switch to Sign in.';
    if (/invalid email or password|invalid credentials/i.test(msg)) return 'Email or password is incorrect.';
    if (/failed to fetch|networkerror|load failed/i.test(msg)) return 'Could not reach Neon Auth. The preview domain may need to be added to the auth trusted-domain list.';
    return msg;
  }
  function setMode(signup) {
    signupMode = !!signup;
    $('neon-signup-form').hidden = !signupMode;
    $('neon-signin-form').hidden = signupMode;
    $('neon-title').textContent = signupMode ? 'Create a test account' : 'Sign in to your test account';
    $('neon-copy').textContent = signupMode ? 'Create an account using Neon Auth. If you already registered, switch to sign in.' : 'Sign in with the test account you created.';
    $('neon-mode-toggle').textContent = signupMode ? 'Already registered? Sign in' : 'Need an account? Create one';
    message('', false);
  }
  function showSession(session) {
    var user = session && (session.user || session.data && session.data.user);
    $('neon-form-area').hidden = !!user;
    $('neon-signed-in').hidden = !user;
    if (user) {
      $('neon-session-email').textContent = user.email || '(email not returned)';
      $('neon-session-id').textContent = 'User ID: ' + (user.id || user.userId || 'not returned');
    }
  }
  try {
    var mod = await import('https://esm.sh/@neondatabase/auth@latest');
    var createAuthClient = mod.createAuthClient;
    if (!createAuthClient) throw new Error('Neon Auth SDK did not expose createAuthClient. Please refresh and retry.');
    client = createAuthClient(AUTH_URL);
    $('neon-mode-toggle').addEventListener('click', function () { setMode(!signupMode); });
    $('neon-signup-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = $('neon-signup-submit');
      btn.disabled = true;
      message('Creating account with Neon…', false);
      try {
        var result = await client.signUp.email({
          name: $('neon-name').value.trim(),
          email: $('neon-signup-email').value.trim().toLowerCase(),
          password: $('neon-signup-password').value
        });
        if (result && result.error) throw result.error;
        var session = result && result.data;
        if (session && session.user) {
          showSession(session);
          $('neon-session-message').textContent = 'Signup succeeded and a session was returned.';
        } else {
          setMode(false);
          message('Signup request completed. Try signing in; if verification is required, follow the instructions from Neon Auth.', false);
          $('neon-signin-email').value = $('neon-signup-email').value.trim().toLowerCase();
        }
      } catch (err) { message(errorText(err), true); }
      finally { btn.disabled = false; }
    });
    $('neon-signin-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = $('neon-signin-submit');
      btn.disabled = true;
      message('Signing in with Neon…', false);
      try {
        var result = await client.signIn.email({
          email: $('neon-signin-email').value.trim().toLowerCase(),
          password: $('neon-signin-password').value
        });
        if (result && result.error) throw result.error;
        var session = result && result.data;
        if (session && (session.user || session.session)) {
          showSession(session);
          $('neon-session-message').textContent = 'Sign-in succeeded.';
        } else {
          var current = await client.getSession();
          if (current && current.error) throw current.error;
          if (current && current.data && current.data.user) {
            showSession(current.data);
            $('neon-session-message').textContent = 'Sign-in succeeded.';
          } else {
            message('The sign-in request returned without a visible session. Check the SDK response and trusted-domain settings.', true);
          }
        }
      } catch (err) { message(errorText(err), true); }
      finally { btn.disabled = false; }
    });
    $('neon-signout').addEventListener('click', async function () {
      try {
        var result = await client.signOut();
        if (result && result.error) throw result.error;
        showSession(null);
        setMode(false);
        $('neon-session-message').textContent = '';
        message('Signed out successfully.', false);
      } catch (err) { $('neon-session-message').textContent = errorText(err); }
    });
    try {
      var current = await client.getSession();
      if (current && current.data && current.data.user) showSession(current.data);
    } catch (_) {}
  } catch (err) {
    $('neon-signup-submit').disabled = true;
    $('neon-signin-submit').disabled = true;
    message('Neon Auth SDK could not initialize: ' + errorText(err), true);
  }
})();