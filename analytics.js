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

  var first = local ? read(local, 'rv_first') : null;
  if (local && !first) {
    first = {
      landing_page: w.location.pathname,
      referrer: (d.referrer || '').slice(0, 300),
      ts: new Date().toISOString(),
      params: current,
    };
    write(local, 'rv_first', first);
  }
  if (session && hasParams) {
    write(session, 'rv_last', { landing_page: w.location.pathname, ts: new Date().toISOString(), params: current });
  }
  var last = session ? read(session, 'rv_last') : null;

  var api = (w.revanta = w.revanta || {});

  api.attribution = function () {
    return { first_touch: first || null, last_touch: last || null, current: current };
  };

  // ---- Event helper -----------------------------------------------------------
  api.track = function (name, params) {
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
  if (d.body && d.body.getAttribute('data-conversion') === 'lead') {
    var type = query.get('type') || '';
    var stamp = session ? read(session, 'rv_lead_fired') : null;
    if (!stamp || Date.now() - stamp > 30000) {
      api.track('generate_lead', { form_type: type, lead_source: 'growth_audit_form' });
      if (session) write(session, 'rv_lead_fired', Date.now());
    }
  }
})(window, document);
