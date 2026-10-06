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
const channelOptions = ['Google Ads', 'Meta Ads', 'SEO / organic', 'Referrals', 'Email or SMS', 'Outbound sales', 'Other'];
const budgetOptions = [
  'Under $2,000',
  '$2,000 to $5,000',
  '$5,000 to $10,000',
  '$10,000 to $25,000',
  '$25,000 or more',
  'Prefer not to say',
];
const treatmentOptions = [
  'Dental implants',
  'Full-arch restorations',
  'Cosmetic dentistry',
  'Other high-value treatments',
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

// ---------------------------------------------------------------- the two forms

const generalFields = [
  [
    { kind: 'input', name: 'name', label: 'Name', autocomplete: 'name', required: true },
    { kind: 'input', name: 'email', label: 'Work email', type: 'email', autocomplete: 'email', inputmode: 'email', required: true },
  ],
  [
    { kind: 'input', name: 'company', label: 'Company', autocomplete: 'organization', required: true },
    { kind: 'input', name: 'website', label: 'Website', autocomplete: 'url', inputmode: 'url', placeholder: 'yourcompany.com', required: true },
  ],
  { kind: 'select', name: 'industry', label: 'Industry', options: industryOptions, required: true },
  { kind: 'textarea', name: 'offering', label: 'What does your company sell?', rows: 2, required: true },
  {
    kind: 'input',
    name: 'customer_value',
    label: 'Approximate customer value',
    hint: 'Average revenue from a new customer. A rough estimate is fine.',
    placeholder: 'e.g. $5,000',
  },
  { kind: 'checks', name: 'channels', label: 'Current acquisition channels', options: channelOptions },
  { kind: 'textarea', name: 'challenge', label: 'Biggest growth challenge', rows: 3, required: true },
  { kind: 'select', name: 'budget', label: 'Monthly marketing budget', options: budgetOptions },
  { kind: 'textarea', name: 'notes', label: 'Additional information', rows: 3 },
];

const dentalFields = [
  [
    { kind: 'input', name: 'name', label: 'Name', autocomplete: 'name', required: true },
    { kind: 'input', name: 'email', label: 'Email', type: 'email', autocomplete: 'email', inputmode: 'email', required: true },
  ],
  { kind: 'input', name: 'practice', label: 'Practice name', autocomplete: 'organization', required: true },
  [
    { kind: 'input', name: 'location', label: 'Location', placeholder: 'City, State', required: true },
    { kind: 'input', name: 'website', label: 'Website', autocomplete: 'url', inputmode: 'url', placeholder: 'yourpractice.com', required: true },
  ],
  { kind: 'checks', name: 'treatments', label: 'Main high-value treatments', options: treatmentOptions, required: true },
  { kind: 'checks', name: 'channels', label: 'Current marketing channels', options: channelOptions },
  { kind: 'select', name: 'budget', label: 'Approximate monthly marketing spend', options: budgetOptions },
  { kind: 'textarea', name: 'challenge', label: 'Biggest patient acquisition challenge', rows: 3, required: true },
];

function form({ type, prefix, fields, submit, extraNote = '', hidden = false }) {
  return `
<form class="form" data-form="${type}" action="/api/lead" method="post"${config.contactEmail ? ` data-contact-email="${esc(config.contactEmail)}"` : ''}${hidden ? ' hidden' : ''}>
  <input type="hidden" name="form_type" value="${type}">
  <input type="hidden" name="page_path" value="">
  <input type="hidden" name="attribution" value="">
  <input type="hidden" name="form_ts" value="">
  <div class="hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="url_confirm" tabindex="-1" autocomplete="off"></label></div>
  ${render(prefix, fields)}
  <div class="form__actions">
    <button class="btn btn--primary btn--lg" type="submit">${esc(submit)}</button>
    <p class="form__note">We use what you submit to respond to your request. See our <a href="/privacy">Privacy Policy</a>.${extraNote}</p>
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
      <fieldset class="form-switch">
        <legend class="sr-only">Which best describes you?</legend>
        <label><input type="radio" name="form_switch" value="general" checked><span>Business</span></label>
        <label><input type="radio" name="form_switch" value="dental"><span>Dental practice</span></label>
      </fieldset>
      ${form({ type: 'general', prefix: 'g', fields: generalFields, submit: 'Book a Growth Audit' })}
      ${form({
        type: 'dental',
        prefix: 'd',
        fields: dentalFields,
        submit: 'Get a Dental Growth Audit',
        extraNote: ' Please don’t include patient names or health information.',
        hidden: true,
      })}
    </div>

    <aside class="contact__aside">
      <h2>What happens next</h2>
      <ol class="next">
        <li><h3>You tell us about the business</h3><p>The form takes a few minutes. Optional fields can be skipped.</p></li>
        <li><h3>We review the growth system</h3><p>Your acquisition, conversion, follow-up and measurement, as they stand today.</p></li>
        <li><h3>We follow up with what we find</h3><p>The biggest opportunities we see, and whether Revanta is a fit.</p></li>
      </ol>
      <p class="contact__fine">Revanta does not guarantee leads or revenue. Growth depends on many variables.</p>
    </aside>
  </div>
</section>
`,
};
