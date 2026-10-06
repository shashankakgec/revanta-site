/* Revanta site behaviour. No dependencies. */
(function (w, d) {
  'use strict';

  var body = d.body;

  // ---- Mobile navigation ---------------------------------------------------------
  var toggle = d.querySelector('.nav-toggle');
  var nav = d.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setOpen(false);
    });

    // If the viewport grows past the mobile breakpoint, make sure the menu state resets.
    var wide = w.matchMedia('(min-width: 900px)');
    var onChange = function (e) {
      if (e.matches) setOpen(false);
    };
    if (wide.addEventListener) wide.addEventListener('change', onChange);
    else if (wide.addListener) wide.addListener(onChange);
  }

  // ---- Dental campaign context ------------------------------------------------------
  // The corporate site says "Book a Growth Audit". Traffic from a dental campaign
  // (?industry=dental, or a UTM campaign/content value containing "dental") sees the dental
  // label instead, and the choice is remembered for the rest of the session.
  var vertical = null;
  try {
    var p = new URLSearchParams(w.location.search);
    var hint = [p.get('industry'), p.get('vertical'), p.get('utm_campaign'), p.get('utm_content')]
      .join(' ')
      .toLowerCase();
    if (hint.indexOf('dental') > -1) {
      vertical = 'dental';
      w.sessionStorage.setItem('rv_vertical', 'dental');
    } else {
      vertical = w.sessionStorage.getItem('rv_vertical');
    }
  } catch (e) {
    /* storage unavailable: keep corporate labels */
  }

  if (vertical === 'dental') {
    var buttons = d.querySelectorAll('[data-cta-audit]');
    for (var i = 0; i < buttons.length; i++) {
      var a = buttons[i];
      a.textContent = 'Get a Dental Growth Audit';
      a.setAttribute('href', '/contact?industry=dental');
      a.setAttribute('data-cta', (a.getAttribute('data-cta') || 'audit') + '_dental');
    }
  }
})(window, document);
