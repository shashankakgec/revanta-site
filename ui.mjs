// Reusable HTML builders. Every function returns a string of trusted markup.
import config from './config.mjs';
import { icon, visuals } from './icons.mjs';
import * as C from './content.mjs';
import { esc } from './util.mjs';

const items = (list, cls = '') =>
  list.map((t) => `<li${cls ? ` class="${cls}"` : ''}>${t}</li>`).join('');

// ---------------------------------------------------------------- primitives

export const btn = ({ label, href, variant = 'primary', cta = '', audit = false, size = '' }) =>
  `<a class="btn btn--${variant}${size ? ` btn--${size}` : ''}" href="${esc(href)}"` +
  `${cta ? ` data-cta="${esc(cta)}"` : ''}${audit ? ' data-cta-audit' : ''}>${esc(label)}</a>`;

/** Corporate CTA. On dental campaign traffic, main.js swaps the label and destination. */
export const auditBtn = (cta, opts = {}) =>
  btn({ label: config.cta.audit, href: '/contact', cta, audit: true, ...opts });

export const dentalAuditBtn = (cta, opts = {}) =>
  btn({ label: config.cta.dental, href: '/contact?industry=dental', cta, ...opts });

export const link = (label, href, cta = '') =>
  `<a class="link" href="${esc(href)}"${cta ? ` data-cta="${esc(cta)}"` : ''}>${esc(label)}</a>`;

export const shead = ({ title, text = '', id = '', cls = '' }) =>
  `<header class="shead${cls ? ` ${cls}` : ''}"><h2${id ? ` id="${id}"` : ''}>${title}</h2>` +
  `${text ? `<div class="shead__text">${text}</div>` : ''}</header>`;

export const crumbs = (list) =>
  `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list
    .map((c, i) =>
      i < list.length - 1
        ? `<li><a href="${c.href}">${esc(c.label)}</a></li>`
        : `<li aria-current="page">${esc(c.label)}</li>`,
    )
    .join('')}</ol></nav>`;

// ---------------------------------------------------------------- hero

export const pageHero = ({ crumbs: trail = [], eyebrow = '', title, lead = '', actions = '', visual = '' }) => `
<section class="page-hero theme-dark">
  <div class="page-hero__bg" aria-hidden="true"></div>
  <div class="container">
    ${trail.length ? crumbs(trail) : ''}
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <div class="page-hero__grid">
      <h1>${title}</h1>
      ${
        lead || actions
          ? `<div class="page-hero__side">${lead ? `<p class="lead">${lead}</p>` : ''}${
              actions ? `<div class="btn-row">${actions}</div>` : ''
            }</div>`
          : ''
      }
    </div>
    ${visual}
  </div>
</section>`;

/** The signature visual: a growth system drawn as a schematic. Illustrative, contains no data. */
export function schematic(nodes, { caption = 'Illustrative model of a connected growth system. Contains no client data.', loop = 'Measure, learn, reallocate' } = {}) {
  const cells = nodes
    .map(
      (n, i) => `
      <li class="snode" style="--i:${i}">
        <div class="snode__top"><span class="snode__idx">${String(i + 1).padStart(2, '0')}</span><p class="snode__title">${n.title}</p></div>
        <div class="snode__vis">${visuals[n.vis]}</div>
        <p class="snode__text">${n.text}</p>
      </li>`,
    )
    .join('');
  return `
    <figure class="schematic">
      <ol class="schematic__nodes">${cells}</ol>
      <div class="schematic__loop" aria-hidden="true"><span>${loop}</span></div>
      <figcaption class="schematic__cap">${caption}</figcaption>
    </figure>`;
}

export const strip = () => `
<section class="strip theme-dark" aria-label="Positioning">
  <div class="container strip__inner">
    <p class="strip__title">One growth system. Multiple capabilities.</p>
    <ol class="chain">${items(C.stripSteps)}</ol>
  </div>
</section>`;

// ---------------------------------------------------------------- problem

export const problemVisual = () => `
<div class="pv">
  <figure class="pv__panel">
    <figcaption>Typical setup: each piece runs on its own.</figcaption>
    <ul class="frag">${items(C.fragments)}</ul>
  </figure>
  <figure class="pv__panel pv__panel--on">
    <figcaption>With Revanta: each piece feeds the next.</figcaption>
    <ul class="bus">${items(C.fragments)}</ul>
  </figure>
</div>`;

// ---------------------------------------------------------------- approach

/** Five-stage flow used on the home page (horizontal rail on wide screens). */
export const flow = (stages = C.stages) => `
<ol class="flow">${stages
  .map(
    (s) => `
  <li class="flow__item">
    <span class="flow__node">${s.n}</span>
    <h3>${s.title}</h3>
    <p>${s.text}</p>
  </li>`,
  )
  .join('')}
</ol>`;

/** Detailed stage rows used on /approach. */
export const stageDetail = (stages = C.stages) => `
<ol class="sdetail">${stages
  .map(
    (s) => `
  <li class="sdetail__row">
    <div class="sdetail__head"><span class="sdetail__n">${s.n}</span><h3>${s.title}</h3><p>${s.text}</p></div>
    <dl class="sdetail__cols">
      <div><dt>What we examine</dt><dd>${s.examine}</dd></div>
      <div><dt>What we build</dt><dd>${s.build}</dd></div>
      <div><dt>What we measure</dt><dd>${s.measure}</dd></div>
    </dl>
  </li>`,
  )
  .join('')}
</ol>`;

export const steps = (list = C.process) => `
<ol class="steps">${list
  .map((s) => `<li class="step"><span class="step__n">${s.n}</span><h3>${s.title}</h3><p>${s.text}</p></li>`)
  .join('')}
</ol>`;

// ---------------------------------------------------------------- capabilities

export const capGrid = (caps = C.capabilities) => `
<ul class="capgrid">${caps
  .map(
    (c) => `
  <li class="cap">
    <span class="cap__icon">${icon(c.icon)}</span>
    <h3>${c.title}</h3>
    <p>${c.text}</p>
    <p class="cap__stage"><span>Stage</span> ${c.stage}</p>
  </li>`,
  )
  .join('')}
</ul>`;

export const capDetail = (caps = C.capabilities) =>
  caps
    .map(
      (c) => `
<article class="cdetail" id="cap-${c.id}">
  <div class="cdetail__head">
    <span class="cap__icon">${icon(c.icon)}</span>
    <h2>${c.title}</h2>
    <p>${c.text}</p>
    <p class="cap__stage"><span>Stage</span> ${c.stage}</p>
  </div>
  <div class="cdetail__body">
    <p class="label">What it covers</p>
    <ul class="ticks">${items(c.covers)}</ul>
  </div>
</article>`,
    )
    .join('');

// ---------------------------------------------------------------- positioning blocks

export const compare = () => `
<div class="compare">
  <div class="compare__col">
    <h3>Traditional approach</h3>
    <ul class="marks marks--dash">${items(C.compare.traditional)}</ul>
  </div>
  <div class="compare__col compare__col--rv theme-dark">
    <h3>Revanta approach</h3>
    <ul class="marks marks--signal">${items(C.compare.revanta)}</ul>
  </div>
</div>`;

const lever = `
<svg class="lever" viewBox="0 0 420 240" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">
  <path d="M0 200H420" opacity=".5"/>
  <path d="M244 200h52l-26-76z"/>
  <g transform="rotate(-12.6 270 124)">
    <path d="M30 124H380"/>
    <rect x="334" y="88" width="36" height="36" fill="var(--signal)" stroke="none"/>
    <path d="M54 60v46M47 96l7 10 7-10"/>
    <circle cx="270" cy="124" r="3.5" fill="var(--navy-900)"/>
  </g>
</svg>`;

export const aiBlock = () => `
<section class="section theme-dark ai">
  <div class="container ai__grid">
    <div class="ai__copy">
      <h2>AI isn’t the product. It’s the leverage.</h2>
      <div class="prose">
        <p>Revanta uses AI where it creates a genuine advantage, from research and content production to lead qualification, automation, analysis and workflow optimization.</p>
        <p>The goal isn’t to add “AI” to everything.</p>
        <p>The goal is to use technology to build faster, smarter and more scalable growth systems.</p>
      </div>
      <ul class="tags" aria-label="Where Revanta applies AI">${items(C.aiAreas)}</ul>
    </div>
    <div class="ai__art">${lever}</div>
  </div>
</section>`;

export const ladder = (list = C.dentalFlow) => `
<ol class="ladder">${list
  .map((t, i) => `<li${i === list.length - 1 ? ' class="ladder__end"' : ''}>${t}</li>`)
  .join('')}</ol>`;

export const ladderDetail = (list) => `
<ol class="ladder ladder--detail">${list
  .map(
    (s, i) =>
      `<li${i === list.length - 1 ? ' class="ladder__end"' : ''}><h3>${s.title}</h3><p>${s.text}</p></li>`,
  )
  .join('')}</ol>`;

export const industryList = ({ showLink = false } = {}) => `
<ul class="ilist">${C.industries
  .map((ind) => {
    const primary = Boolean(ind.href);
    return `
  <li class="irow${primary ? ' irow--primary' : ''}">
    <div class="irow__main">
      <h3>${primary ? `<a href="${ind.href}" data-cta="industries_${esc(ind.name.toLowerCase())}">${ind.name}</a>` : ind.name}</h3>
      <p>${ind.text}</p>
      ${primary && showLink ? `<p class="irow__link">${link('View the Dental Growth System', ind.href, 'industries_view_dental_system')}</p>` : ''}
    </div>
    <span class="pill${primary ? ' pill--signal' : ''}">${ind.status}</span>
  </li>`;
  })
  .join('')}
</ul>`;

// ---------------------------------------------------------------- sample growth system

export const architecture = () => `
<ol class="arch">${C.archNodes
  .map(
    (n) => `
  <li class="arch__node">
    <div class="arch__head">${icon(n.icon)}<h3>${n.title}</h3></div>
    ${n.items.length ? `<ul class="arch__items">${items(n.items)}</ul>` : ''}
    <p class="arch__text">${n.text}</p>
  </li>`,
  )
  .join('')}
</ol>`;

// ---------------------------------------------------------------- results / case studies

export const caseStudyCards = (list) => `
<ul class="cs-list">${list
  .map(
    (c) => `
  <li class="cs-card">
    <p class="cs-card__meta">${esc(c.industry || '')}</p>
    <h3><a href="/case-studies/${esc(c.slug)}">${esc(c.title)}</a></h3>
    <p>${esc(c.summary || '')}</p>
  </li>`,
  )
  .join('')}</ul>`;

/** Home page results block. Honest empty state until real case studies exist. */
export const results = (studies) =>
  studies.length
    ? `
<section class="section theme-light results">
  <div class="container">
    ${shead({ title: 'Results from real growth systems.', text: '<p>Every figure on this site comes from a documented case study.</p>' })}
    ${caseStudyCards(studies.slice(0, 3))}
    <p class="results__more">${link('All case studies', '/case-studies', 'results_all_case_studies')}</p>
  </div>
</section>`
    : `
<section class="section theme-light results">
  <div class="container split">
    <div class="split__main">
      <h2>We’re building the first generation of Revanta growth systems.</h2>
    </div>
    <div class="split__aside">
      <p class="lead">Revanta is currently developing and deploying its initial growth systems with a focused group of businesses. As measurable case studies become available, this section will showcase real performance data.</p>
      <p class="results__note">When they are published, each case study will cover ${C.caseStudyFields
        .slice(0, -1)
        .map((f) => f.toLowerCase())
        .join(', ')} and ${C.caseStudyFields[C.caseStudyFields.length - 1].toLowerCase()}.</p>
      <p>${link('See what every case study will include', '/case-studies', 'results_case_study_structure')}</p>
    </div>
  </div>
</section>`;

// ---------------------------------------------------------------- FAQ + CTA

export const faqList = (list = C.faqs) => `
<div class="faq">${list
  .map((f) => `<details><summary>${f.q}</summary><div class="faq__a"><p>${f.a}</p></div></details>`)
  .join('')}</div>`;

export const ctaBand = ({ title, text, primary, secondary = '', note = '', tone = 'dark' }) => `
<section class="section cta-band theme-${tone}${tone === 'light' ? ' section--alt' : ''}">
  <div class="cta-band__bg" aria-hidden="true"></div>
  <div class="container cta-band__inner">
    <h2>${title}</h2>
    <p class="lead">${text}</p>
    <div class="btn-row">${primary}${secondary}</div>
    ${note ? `<p class="cta-band__note">${note}</p>` : ''}
  </div>
</section>`;

export const finalCta = (prefix = 'final', tone = 'dark') =>
  ctaBand({
    tone,
    title: 'Your next stage of growth starts with understanding what’s holding it back.',
    text: 'Let’s identify the biggest opportunities in your acquisition, conversion and growth system.',
    primary: auditBtn(`${prefix}_book_growth_audit`, { size: 'lg' }),
    secondary: btn({ label: config.cta.talk, href: '/contact', variant: 'ghost', cta: `${prefix}_talk_to_revanta`, size: 'lg' }),
  });
