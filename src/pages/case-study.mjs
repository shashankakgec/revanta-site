// Template for individual case study pages. Pages are generated only from real entries in
// src/data/case-studies.mjs. Nothing is rendered when that file is empty.
import * as U from '../ui.mjs';
import { esc } from '../util.mjs';

const REQUIRED = [
  'slug',
  'title',
  'industry',
  'summary',
  'publishedAt',
  'challenge',
  'startingSituation',
  'strategy',
  'systemImplemented',
  'channels',
  'conversionImprovements',
  'automation',
  'results',
  'lessons',
];

export function validateCaseStudy(entry) {
  const missing = REQUIRED.filter((k) => {
    const v = entry[k];
    return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
  });
  if (missing.length) {
    throw new Error(
      `Case study "${entry.slug || entry.title || '(unnamed)'}" is missing: ${missing.join(', ')}. ` +
        'Complete every field in src/data/case-studies.mjs or remove the entry.',
    );
  }
  for (const r of entry.results) {
    if (!r.label || !r.value) throw new Error(`Case study "${entry.slug}" has a result without label and value.`);
  }
}

const text = (v) =>
  Array.isArray(v) ? `<ul class="ticks">${v.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : `<p>${esc(v)}</p>`;

const block = (title, content) => `
  <section class="csx__block">
    <h2>${title}</h2>
    <div class="csx__content">${content}</div>
  </section>`;

export function caseStudyPage(entry) {
  validateCaseStudy(entry);
  const crumbs = [{ label: 'Case Studies', href: '/case-studies' }, { label: entry.title }];
  return {
    path: `/case-studies/${entry.slug}`,
    title: `${entry.title} | Revanta Case Study`,
    description: entry.summary,
    crumbs,
    lastmod: entry.publishedAt,
    body: () => `
${U.pageHero({ crumbs, title: esc(entry.title), lead: esc(entry.summary) })}
<section class="section theme-light csx">
  <div class="container">
    ${block('Business challenge', text(entry.challenge))}
    ${block('Starting situation', text(entry.startingSituation))}
    ${block('Strategy', text(entry.strategy))}
    ${block('Growth system implemented', text(entry.systemImplemented))}
    ${block('Acquisition channels', text(entry.channels))}
    ${block('Conversion improvements', text(entry.conversionImprovements))}
    ${block('Automation', text(entry.automation))}
    ${block(
      'Results',
      `<dl class="metrics">${entry.results
        .map(
          (r) =>
            `<div><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd>${r.note ? `<dd class="metrics__note">${esc(r.note)}</dd>` : ''}</div>`,
        )
        .join('')}</dl>`,
    )}
    ${block('Lessons learned', text(entry.lessons))}
  </div>
</section>
${U.finalCta('case_study')}
`,
  };
}
