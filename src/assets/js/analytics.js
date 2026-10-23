/* Revanta analytics layer.
 * Loads on every page and is safe with no analytics configured: events simply queue in
 * window.dataLayer. When GTM_ID or GA_MEASUREMENT_ID is set at build time, layout.mjs injects the
 * vendor snippet and these same events start flowing, with no code changes.
 *
 * Events pushed (GTM: use as Custom Event triggers; GA4 via gtag: appear as events):
 *   cta_click      cta_id, cta_text, cta_destination
 *   form_start     form_type
 *   form_submit    form_type
 *   form_error     form_type
 *   generate_lead  form_type        (fires on /contact/thanks; mark as the key conversion)
 * Every event also carries page_path.
 */
(function (w, d) {
  'use strict';

  w.dataLayer = w.dataLayer || [];

  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];

  function safe(fn, fallback) {
    try {
      return fn();
    } catch (e) {
      return fallback;
    }
  }
  function read(store, key) {
    return safe(function () {
      return JSON.parse(store.getItem(key) || 'null');
    }, null);
  }
  function write(store, key, value) {
    safe(function () {
      store.setItem(key, JSON.stringify(value));
    });
  }

  var local = safe(function () {
    return w.localStorage;
  }, null);
  var session = safe(function () {
    return w.sessionStorage;
  }, null);

  // ---- Campaign attribution -------------------------------------------------
  // First touch persists in this browser; last touch lasts for the session. Both are attached to
  // lead submissions so every lead can be traced to the campaign that produced it.
  var query = new URLSearchParams(w.location.search);
  var current = {};
  var hasParams = false;
  KEYS.forEach(function (key) {
    var value = query.get(key);
    if (value) {
      current[key] = value.slice(0, 200);
      hasParams = true;
    }
  });

  var consent = local ? safe(function () { return local.getItem('rv_analytics_consent'); }, null) : null;
  var first = local && consent === 'accepted' ? read(local, 'rv_first') : null;
  if (local && consent === 'accepted' && !first) {
    first = {
      landing_page: w.location.pathname,
      referrer: (d.referrer || '').slice(0, 300),
      ts: new Date().toISOString(),
      params: current,
    };
    write(local, 'rv_first', first);
  }
  if (session && consent === 'accepted' && hasParams) {
    write(session, 'rv_last', { landing_page: w.location.pathname, ts: new Date().toISOString(), params: current });
  }
  var last = session && consent === 'accepted' ? read(session, 'rv_last') : null;

  var api = (w.revanta = w.revanta || {});

  api.attribution = function () {
    return { first_touch: first || null, last_touch: last || null, current: current };
  };

  // ---- Event helper -----------------------------------------------------------
  api.track = function (name, params) {
    if (consent !== 'accepted') return;
    var payload = {};
    payload.page_path = w.location.pathname;
    Object.keys(params || {}).forEach(function (k) {
      payload[k] = params[k];
    });
    var gtmEvent = { event: name };
    Object.keys(payload).forEach(function (k) {
      gtmEvent[k] = payload[k];
    });
    w.dataLayer.push(gtmEvent); // Google Tag Manager
    if (typeof w.gtag === 'function') w.gtag('event', name, payload); // gtag.js (GA4 without GTM)
  };

  // ---- CTA click tracking -------------------------------------------------------
  d.addEventListener(
    'click',
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-cta]') : null;
      if (!el) return;
      api.track('cta_click', {
        cta_id: el.getAttribute('data-cta'),
        cta_text: (el.textContent || '').trim().slice(0, 80),
        cta_destination: el.getAttribute('href') || '',
      });
    },
    true,
  );

  // ---- Lead conversion (thank-you page) ------------------------------------------
  if (d.body && d.body.getAttribute('data-conversion') === 'lead' && consent === 'accepted') {
    var type = query.get('type') || '';
    var stamp = session ? read(session, 'rv_lead_fired') : null;
    if (!stamp || Date.now() - stamp > 30000) {
      api.track('generate_lead', { form_type: type, lead_source: 'growth_audit_form' });
      if (session) write(session, 'rv_lead_fired', Date.now());
    }
  }

  // ---- Optional visitor analytics (opt-in only) -------------------------------
  // Do not track staff/client workspaces or store identifiers until the visitor opts in.
  var internalPath = /^\/(dashboard|portal|client-dashboard|neon-portal)(\/|$)/.test(w.location.pathname);
  var visitorId = null;
  var sessionId = null;
  var timer = null;
  var lastSample = 0;
  var lastActivity = Date.now();
  var activeTracker = false;
  var consentPanel = null;
  var consentLauncher = null;

  function uuid() {
    if (w.crypto && typeof w.crypto.randomUUID === 'function') return w.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) {
      var r = Math.random() * 16 | 0;
      return (ch === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }
  function captureAttribution() {
    if (consent !== 'accepted') return;
    first = local ? read(local, 'rv_first') : null;
    if (local && !first) {
      first = { landing_page: w.location.pathname, referrer: (d.referrer || '').slice(0, 300), ts: new Date().toISOString(), params: current };
      write(local, 'rv_first', first);
    }
    if (session && hasParams) {
      last = { landing_page: w.location.pathname, ts: new Date().toISOString(), params: current };
      write(session, 'rv_last', last);
    } else if (session) {
      last = read(session, 'rv_last');
    }
  }
  function pagePath() { return String(w.location.pathname || '/').slice(0, 180); }
  function sendSessionEvent(event, activeSeconds, passiveSeconds, keepalive) {
    if (consent !== 'accepted' || !visitorId || !sessionId) return;
    var body = JSON.stringify({
      visitor_id: visitorId, session_id: sessionId, event: event, page_path: pagePath(),
      active_seconds: activeSeconds || 0, passive_seconds: passiveSeconds || 0
    });
    try {
      fetch('/api/analytics/track', {
        method: 'POST', credentials: 'same-origin', keepalive: !!keepalive,
        headers: { 'Content-Type': 'application/json' }, body: body
      }).catch(function () {});
    } catch (e) {}
  }
  function newSessionIfNeeded() {
    var oldSession = session ? safe(function () { return session.getItem('rv_session_id'); }, null) : null;
    var oldActivity = session ? Number(safe(function () { return session.getItem('rv_session_last'); }, 0)) : 0;
    if (!oldSession || !oldActivity || Date.now() - oldActivity > 30 * 60 * 1000) {
      sessionId = uuid();
      if (session) {
        safe(function () { session.setItem('rv_session_id', sessionId); session.setItem('rv_session_last', String(Date.now())); });
      }
      return true;
    }
    sessionId = oldSession;
    return false;
  }
  function flushHeartbeat(eventName) {
    if (!activeTracker || !sessionId) return;
    var now = Date.now();
    var elapsed = lastSample ? Math.max(0, Math.min(30, Math.floor((now - lastSample) / 1000))) : 0;
    var visible = d.visibilityState === 'visible';
    var active = visible && now - lastActivity <= 30000 ? elapsed : 0;
    var passive = visible && now - lastActivity > 30000 ? elapsed : 0;
    if (!visible) { active = 0; passive = 0; }
    sendSessionEvent(eventName || 'heartbeat', active, passive, true);
    lastSample = now;
    if (session) safe(function () { session.setItem('rv_session_last', String(now)); });
  }
  function noteActivity() { if (d.visibilityState === 'visible') lastActivity = Date.now(); }
  function stopTracking() {
    if (timer) w.clearInterval(timer);
    timer = null;
    activeTracker = false;
    d.removeEventListener('pointerdown', noteActivity, true);
    d.removeEventListener('keydown', noteActivity, true);
    d.removeEventListener('scroll', noteActivity, true);
    d.removeEventListener('touchstart', noteActivity, true);
    d.removeEventListener('visibilitychange', onVisibility);
    w.removeEventListener('pagehide', onPageHide);
  }
  function onVisibility() {
    if (d.visibilityState === 'hidden') flushHeartbeat('heartbeat');
    else { lastSample = Date.now(); lastActivity = Date.now(); }
  }
  function onPageHide() { flushHeartbeat('end'); }
  function startTracking() {
    if (internalPath || consent !== 'accepted' || !local || !session || activeTracker) return;
    visitorId = safe(function () { return local.getItem('rv_visitor_id'); }, null);
    if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
      visitorId = uuid();
      safe(function () { local.setItem('rv_visitor_id', visitorId); });
    }
    var isNewSession = newSessionIfNeeded();
    activeTracker = true;
    lastSample = Date.now();
    lastActivity = lastSample;
    sendSessionEvent('start', 0, 0, false);
    d.addEventListener('pointerdown', noteActivity, true);
    d.addEventListener('keydown', noteActivity, true);
    d.addEventListener('scroll', noteActivity, true);
    d.addEventListener('touchstart', noteActivity, true);
    d.addEventListener('visibilitychange', onVisibility);
    w.addEventListener('pagehide', onPageHide);
    timer = w.setInterval(function () { flushHeartbeat('heartbeat'); }, 15000);
    api.visitorId = function () { return consent === 'accepted' ? visitorId : null; };
  }
  api.visitorId = function () { return consent === 'accepted' ? visitorId : null; };

  function renderConsentControls() {
    if (internalPath || !d.body) return;
    var style = d.createElement('style');
    style.textContent = '#rv-consent-panel{position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:620px;margin:0 auto;padding:18px;border:1px solid #dbe3ef;border-radius:14px;background:#fff;color:#13233d;box-shadow:0 16px 50px #0b173022;font:14px/1.5 Arial,sans-serif}#rv-consent-panel p{margin:0 0 12px}#rv-consent-panel a{color:#1d4ed8}#rv-consent-panel .rv-consent-actions{display:flex;gap:8px;flex-wrap:wrap}#rv-consent-panel button,#rv-consent-manage{border:1px solid #cbd5e1;border-radius:8px;padding:9px 12px;font-weight:700;cursor:pointer;background:#f8fafc;color:#142b50}#rv-consent-panel #rv-consent-accept{background:#142b50;color:#fff;border-color:#142b50}#rv-consent-manage{position:fixed;z-index:9998;right:12px;bottom:12px;font:12px Arial,sans-serif;padding:7px 10px}';
    d.head.appendChild(style);
    consentLauncher = d.createElement('button');
    consentLauncher.id = 'rv-consent-manage';
    consentLauncher.type = 'button';
    consentLauncher.textContent = 'Privacy choices';
    consentLauncher.hidden = true;
    consentLauncher.addEventListener('click', showConsentPanel);
    d.body.appendChild(consentLauncher);
    if (!consent) showConsentPanel();
    else consentLauncher.hidden = false;
  }
  function showConsentPanel() {
    if (consentPanel) consentPanel.remove();
    consentPanel = d.createElement('section');
    consentPanel.id = 'rv-consent-panel';
    consentPanel.setAttribute('role', 'dialog');
    consentPanel.setAttribute('aria-label', 'Privacy choices');
    consentPanel.innerHTML = '<p><strong>Help us improve Revanta?</strong> Optional analytics can remember this browser across visits and estimate active and idle time. It is enabled only if you accept. You can change your choice later. <a href="/privacy">Privacy policy</a>.</p><div class="rv-consent-actions"><button type="button" id="rv-consent-accept">Accept analytics</button><button type="button" id="rv-consent-reject">Reject analytics</button></div>';
    d.body.appendChild(consentPanel);
    consentPanel.querySelector('#rv-consent-accept').addEventListener('click', function () { chooseConsent('accepted'); });
    consentPanel.querySelector('#rv-consent-reject').addEventListener('click', function () { chooseConsent('rejected'); });
    if (consentLauncher) consentLauncher.hidden = true;
  }
  function chooseConsent(choice) {
    consent = choice;
    if (local) safe(function () { local.setItem('rv_analytics_consent', choice); });
    if (consentPanel) { consentPanel.remove(); consentPanel = null; }
    if (consentLauncher) consentLauncher.hidden = false;
    if (choice === 'accepted') {
      captureAttribution();
      startTracking();
    } else {
      if (activeTracker) flushHeartbeat('end');
      stopTracking();
      visitorId = null;
      sessionId = null;
      if (local) safe(function () { local.removeItem('rv_visitor_id'); });
      if (session) safe(function () { session.removeItem('rv_session_id'); session.removeItem('rv_session_last'); });
    }
  }
  if (!internalPath) {
    renderConsentControls();
    if (consent === 'accepted') { captureAttribution(); startTracking(); }
  }
})(window, document);
