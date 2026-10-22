import config from '../config.mjs';
import * as U from '../ui.mjs';
import { esc } from '../util.mjs';

const industryOptions = [
  'Dental',
  'Healthcare (non-dental)',
  'Professional services',
  'Home & commercial services',
  'Technology & B2B',
  'Other',
];
const budgetOptions = [
  'Under £1,000',
  '£1,000 to £3,000',
  '£3,000 to £5,000',
  '£5,000 to £10,000',
  '£10,000 or more',
  'Prefer not to say',
];

// ---------------------------------------------------------------- field builders

const optional = (f) => (f.required ? '' : ' <span class="opt">Optional</span>');
const describedBy = (id, f) => [f.hint ? `${id}-hint` : '', `${id}-err`].filter(Boolean).join(' ');
const hintHtml = (id, f) => (f.hint ? `<p class="field__hint" id="${id}-hint">${f.hint}</p>` : '');
const errHtml = (id) => `<p class="field__error" id="${id}-err" hidden></p>`;

function input(p, f) {
  const id = `${p}-${f.name}`;
  const attrs = [
    `id="${id}"`,
    `name="${f.name}"`,
    `type="${f.type || 'text'}"`,
    f.autocomplete ? `autocomplete="${f.autocomplete}"` : '',
    f.inputmode ? `inputmode="${f.inputmode}"` : '',
    f.inputmode === 'url' ? 'autocapitalize="off" spellcheck="false"' : '',
    f.placeholder ? `placeholder="${esc(f.placeholder)}"` : '',
    f.required ? 'required' : '',
    `aria-describedby="${describedBy(id, f)}"`,
  ]
    .filter(Boolean)
    .join(' ');
  return `<div class="field"><label for="${id}">${f.label}${optional(f)}</label>${hintHtml(id, f)}<input ${attrs}>${errHtml(id)}</div>`;
}

function textarea(p, f) {
  const id = `${p}-${f.name}`;
  return `<div class="field"><label for="${id}">${f.label}${optional(f)}</label>${hintHtml(id, f)}<textarea id="${id}" name="${f.name}" rows="${f.rows || 3}"${f.required ? ' required' : ''} aria-describedby="${describedBy(id, f)}"></textarea>${errHtml(id)}</div>`;
}

function select(p, f) {
  const id = `${p}-${f.name}`;
  const opts = f.options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
  return `<div class="field"><label for="${id}">${f.label}${optional(f)}</label>${hintHtml(id, f)}<select id="${id}" name="${f.name}"${f.required ? ' required' : ''} aria-describedby="${describedBy(id, f)}"><option value=""${f.required ? ' disabled' : ''} selected>${f.required ? 'Select one' : 'Select one (optional)'}</option>${opts}</select>${errHtml(id)}</div>`;
}

function checks(p, f) {
  const id = `${p}-${f.name}`;
  const boxes = f.options
    .map(
      (o) =>
        `<label class="check"><input type="checkbox" name="${f.name}" value="${esc(o)}"><span>${esc(o)}</span></label>`,
    )
    .join('');
  return `<fieldset class="field field--group"${f.required ? ' data-required-group' : ''}><legend>${f.label}${optional(f)}</legend>${hintHtml(id, f)}<div class="checks">${boxes}</div>${errHtml(id)}</fieldset>`;
}

const builders = { input, textarea, select, checks };

/** Render a list of fields. A nested array is rendered as a two-column row on wide screens. */
const render = (p, list) =>
  list
    .map((f) =>
      Array.isArray(f)
        ? `<div class="form__row">${f.map((x) => builders[x.kind](p, x)).join('')}</div>`
        : builders[f.kind](p, f),
    )
    .join('\n');

// ---------------------------------------------------------------- the lead form

const fields = [
  { kind: 'input', name: 'name', label: 'Name', autocomplete: 'name', required: true },
  { kind: 'input', name: 'email', label: 'Work email', type: 'email', autocomplete: 'email', inputmode: 'email', required: true },
  { kind: 'select', name: 'industry', label: 'Industry', options: industryOptions, required: true },
  { kind: 'select', name: 'budget', label: 'Marketing budget', options: budgetOptions, required: true },
];

function form({ type, prefix, fields, submit }) {
  return `
<form class="form" data-form="${type}" action="/api/lead" method="post"${config.contactEmail ? ` data-contact-email="${esc(config.contactEmail)}` : ''}>
  <input type="hidden" name="form_type" value="${type}">
  <input type="hidden" name="page_path" value="">
  <input type="hidden" name="attribution" value="">
  <input type="hidden" name="form_ts" value="">
  <div class="hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="url_confirm" tabindex="-1" autocomplete="off"></label></div>
  ${render(prefix, fields)}
  <div class="form__actions">
    <button class="btn btn--primary btn--lg" type="submit">${esc(submit)}</button>
    <p class="form__note">We use what you submit to respond to your request. See our <a href="/privacy">Privacy Policy</a>.</p>
  </div>
  <div class="form__status" role="alert" aria-live="assertive" hidden></div>
</form>`;
}

export default {
  path: '/contact',
  title: 'Book a Growth Audit | Contact Revanta',
  description:
    'Book a Growth Audit with Revanta. Tell us about your business and we will identify the biggest opportunities in your acquisition, conversion and growth system.',
  scripts: ['form'],
  body: () => `
${U.pageHero({
  title: 'Book a Growth Audit.',
  lead: 'Let’s identify the biggest opportunities in your acquisition, conversion and growth system.',
})}

<section class="section theme-light contact">
  <div class="container contact__grid">
    <div class="contact__form">
      <p class="form__banner" id="submit-error" role="alert">Something went wrong and your request was not sent. Please try again in a moment.</p>
      ${form({ type: 'general', prefix: 'g', fields, submit: 'Get in touch' })}
    </div>

    <aside class="contact__aside">
      <h2>What happens next</h2>
      <ol class="next">
        <li><h3>You tell us about the business</h3><p>Share a few details so we can understand your business and budget.</p></li>
        <li><h3>We review the growth system</h3><p>Your acquisition, conversion, follow-up and measurement, as they stand today.</p></li>
        <li><h3>We follow up with what we find</h3><p>The biggest opportunities we see, and whether Revanta is a fit.</p></li>
      </ol>
      <p class="contact__fine">Revanta does not guarantee leads or revenue. Growth depends on many variables.</p>
    </aside>
  </div>
</section>
`,
};
