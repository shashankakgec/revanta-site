/* Growth-audit forms: general + dental. Progressive enhancement over a plain POST to /api/lead. */
(function (w, d) {
  'use strict';

  var forms = d.querySelectorAll('form[data-form]');
  if (!forms.length) return;

  var go = function (url) { w.location.assign(url); };
  var track = function (name, params) {
    if (w.revanta && w.revanta.track) w.revanta.track(name, params);
  };

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var SITE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?([\/?#].*)?$/i;

  // ---- Which form to show --------------------------------------------------------
  var byType = {};
  var switches = d.querySelectorAll('input[name="form_switch"]');
  for (var i = 0; i < forms.length; i++) byType[forms[i].getAttribute('data-form')] = forms[i];

  function show(type) {
    Object.keys(byType).forEach(function (key) {
      byType[key].hidden = key !== type;
    });
    for (var s = 0; s < switches.length; s++) switches[s].checked = switches[s].value === type;
  }

  var params = new URLSearchParams(w.location.search);
  show((params.get('industry') || '').toLowerCase() === 'dental' && byType.dental ? 'dental' : 'general');

  for (var s = 0; s < switches.length; s++) {
    switches[s].addEventListener('change', function (e) {
      if (!e.target.checked) return;
      show(e.target.value);
      track('form_switch', { form_type: e.target.value });
    });
  }

  // ---- Errors ----------------------------------------------------------------------
  function setError(el, message) {
    var out = d.getElementById(el.id + '-err');
    if (!out) return;
    out.textContent = message || '';
    out.hidden = !message;
    if (message) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  }

  function setGroupError(fieldset, message) {
    var out = fieldset.querySelector('.field__error');
    if (!out) return;
    out.textContent = message || '';
    out.hidden = !message;
  }

  /** Returns the first invalid control (to focus), or null when everything is valid. */
  function validate(form) {
    var firstBad = null;
    for (var n = 0; n < form.elements.length; n++) {
      var el = form.elements[n];
      var t = el.type;
      if (!el.name || t === 'hidden' || t === 'checkbox' || t === 'submit' || el.name === 'url_confirm') continue;
      var value = (el.value || '').trim();
      var message = '';
      if (el.required && !value) message = 'This field is required.';
      else if (t === 'email' && value && !EMAIL.test(value)) message = 'Enter a valid email address.';
      else if (el.name === 'website' && value && !SITE.test(value)) message = 'Enter a valid website, for example yourcompany.com.';
      setError(el, message);
      if (message && !firstBad) firstBad = el;
    }
    var groups = form.querySelectorAll('fieldset[data-required-group]');
    for (var g = 0; g < groups.length; g++) {
      var checked = groups[g].querySelector('input:checked');
      setGroupError(groups[g], checked ? '' : 'Select at least one option.');
      if (!checked && !firstBad) firstBad = groups[g].querySelector('input');
    }
    return firstBad;
  }

  function serialize(form) {
    var out = {};
    for (var n = 0; n < form.elements.length; n++) {
      var el = form.elements[n];
      if (!el.name || el.type === 'submit' || el.name === 'form_switch') continue;
      if (el.type === 'checkbox') {
        if (el.checked) (out[el.name] = out[el.name] || []).push(el.value);
      } else {
        out[el.name] = el.value;
      }
    }
    try {
      out.attribution = JSON.parse(out.attribution || '{}');
    } catch (e) {
      out.attribution = {};
    }
    return out;
  }

  // ---- Wire up each form ---------------------------------------------------------------
  Array.prototype.forEach.call(forms, function (form) {
    var type = form.getAttribute('data-form');
    var status = form.querySelector('.form__status');
    var submit = form.querySelector('button[type="submit"]');
    var started = false;

    form.setAttribute('novalidate', '');
    form.elements.page_path.value = w.location.pathname + w.location.search;
    form.elements.form_ts.value = String(Date.now());
    form.elements.attribution.value = JSON.stringify(w.revanta && w.revanta.attribution ? w.revanta.attribution() : {});

    form.addEventListener('focusin', function () {
      if (started) return;
      started = true;
      track('form_start', { form_type: type });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.hidden = true;

      var bad = validate(form);
      if (bad) {
        track('form_error', { form_type: type });
        bad.focus();
        return;
      }

      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Sending…';

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(serialize(form)),
      })
        .then(function (res) {
          return res
            .json()
            .catch(function () { return {}; })
            .then(function (data) { return { ok: res.ok && data.ok, status: res.status, data: data }; });
        })
        .then(function (r) {
          if (r.ok) {
            track('form_submit', { form_type: type });
            go('/contact/thanks?type=' + encodeURIComponent(type));
            return;
          }
          if (r.status === 422 && r.data.errors) {
            var first = null;
            Object.keys(r.data.errors).forEach(function (name) {
              var el = form.querySelector('[name="' + name + '"]');
              if (!el) return;
              var group = el.closest && el.closest('fieldset');
              if (el.type === 'checkbox' && group) setGroupError(group, r.data.errors[name]);
              else setError(el, r.data.errors[name]);
              if (!first) first = el;
            });
            if (first) first.focus();
            throw new Error('validation');
          }
          throw new Error('failed');
        })
        .catch(function (err) {
          submit.disabled = false;
          submit.textContent = label;
          if (err && err.message === 'validation') return;
          var email = form.getAttribute('data-contact-email');
          status.textContent =
            'Something went wrong and your request was not sent. Please try again in a moment' +
            (email ? ', or email us at ' + email : '') +
            '.';
          status.hidden = false;
        });
    });
  });
})(window, document);
