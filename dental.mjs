import * as C from '../content.mjs';
import * as U from '../ui.mjs';
import { icon } from '../icons.mjs';
import { plain } from '../util.mjs';

const crumbs = [{ label: 'Industries', href: '/industries' }, { label: 'Dental' }];

const leaks = [
  {
    title: 'Clicks that never convert',
    text: 'A generic page for a specialized treatment. Someone searching for implants lands somewhere that does not speak to implants.',
  },
  {
    title: 'Leads that go cold',
    text: 'Follow-up that is slow or inconsistent after an inquiry arrives, so interested prospects move on to the next practice.',
  },
  {
    title: 'Revenue you can’t trace',
    text: 'Calls, forms and bookings are not tied back to campaigns, so budget moves on instinct instead of evidence.',
  },
];

const flowDetail = [
  {
    title: 'Demand Generation',
    text: 'Google Ads and Meta Ads campaigns built around implant, cosmetic and other high-value treatment demand.',
  },
  {
    title: 'High-Converting Experience',
    text: 'Treatment-specific landing pages and offers designed to turn visits into inquiries.',
  },
  {
    title: 'Lead Capture',
    text: 'Forms, calls and booking requests captured and tracked from the first touch.',
  },
  {
    title: 'AI-Assisted Qualification & Follow-Up',
    text: 'Inquiries are qualified and followed up quickly and consistently through email and SMS automation, so fewer opportunities go cold.',
  },
  {
    title: 'Appointment Opportunity',
    text: 'Qualified inquiries move toward a consultation or appointment request for the practice team.',
  },
  {
    title: 'Revenue',
    text: 'Tracking and revenue attribution connect campaigns to appointments and, where the data is available, to treatment value.',
  },
];

const included = [
  { title: 'Treatment focus', items: ['Dental implants', 'Cosmetic dentistry', 'Other high-value procedures'] },
  {
    title: 'Acquisition',
    items: ['Google Ads', 'Meta Ads', 'Dental implant patient acquisition campaigns'],
  },
  { title: 'Conversion', items: ['Treatment-specific landing pages', 'Lead capture', 'Appointment conversion'] },
  { title: 'Automation', items: ['AI qualification', 'Automated follow-up'] },
  { title: 'Measurement', items: ['Tracking', 'Revenue attribution'] },
];

export default {
  path: '/industries/dental',
  title: 'Dental Implant Marketing & Dental Lead Generation | Revanta',
  description:
    'Dental marketing built as a system: acquisition, conversion and AI-assisted follow-up for implant and cosmetic dentistry practices. Get a Dental Growth Audit.',
  crumbs,
  jsonld: () => [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: C.dentalFaqs.map((f) => ({
        '@type': 'Question',
        name: plain(f.q),
        acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
      })),
    },
  ],
  body: () => `
${U.pageHero({
  crumbs,
  title: 'Turn High-Value Dental Demand Into More Revenue Opportunities.',
  lead: 'Revanta builds acquisition, conversion and follow-up systems for dental practices offering implants, cosmetic dentistry and other high-value treatments.',
  actions:
    U.dentalAuditBtn('dental_hero_get_dental_growth_audit', { size: 'lg' }) +
    U.btn({ label: 'See how the system works', href: '#dental-system', variant: 'ghost', cta: 'dental_hero_see_system', size: 'lg' }),
  visual: U.schematic(C.dentalNodes, {
    caption: 'Illustrative model of a dental growth system. Contains no practice or patient data.',
  }),
})}

<section class="section theme-light">
  <div class="container">
    ${U.shead({
      title: 'Dental lead generation fails when it stops at the lead.',
      text: '<p>Dental marketing for high-value treatments such as implants and cosmetic cases is not a click-volume game. Each case can matter a great deal to a practice, which is why it matters where they get lost.</p>',
    })}
    <ol class="criteria">${leaks.map((l) => `<li><h3>${l.title}</h3><p>${l.text}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="section theme-dark" id="dental-system">
  <div class="container">
    ${U.shead({
      title: 'Dental implant marketing and cosmetic dentistry marketing, built as one system.',
      text: '<p>Not a collection of ads. A connected path from demand to appointment to measured revenue.</p>',
    })}
    ${U.ladderDetail(flowDetail)}
  </div>
</section>

<section class="section theme-light section--white">
  <div class="container">
    ${U.shead({
      title: 'What the Dental Growth System includes.',
      text: '<p>Every component is designed to work with the others, and every one can be measured.</p>',
    })}
    <ul class="capgrid">
      ${included
        .map(
          (g) =>
            `<li class="cap"><h3>${g.title}</h3><ul class="ticks">${g.items.map((i) => `<li>${i}</li>`).join('')}</ul></li>`,
        )
        .join('')}
      <li class="cap cap--cta">
        <span class="cap__icon">${icon('search')}</span>
        <h3>Not sure where the gaps are?</h3>
        <p>Start with an audit of your current acquisition, conversion and follow-up.</p>
        <div class="btn-row">${U.dentalAuditBtn('dental_included_get_dental_growth_audit', { size: 'sm' })}</div>
      </li>
    </ul>
  </div>
</section>

<section class="section theme-light faq-section">
  <div class="container split split--faq">
    <div class="split__main">
      <h2>Dental growth system FAQ.</h2>
      <p class="lead">What it covers, how AI fits, and what it does not promise.</p>
    </div>
    <div class="split__aside">${U.faqList(C.dentalFaqs)}</div>
  </div>
</section>

<section class="section theme-light section--white">
  <div class="container split">
    <div class="split__main"><h2>One system, starting in dental.</h2></div>
    <div class="split__aside">
      <p class="lead">Dental is the first vertical for Revanta’s growth systems. The same architecture is being built to expand into other high-value industries.</p>
      <p>${U.link('About Revanta', '/about', 'dental_about')} &nbsp;&nbsp; ${U.link('All industries', '/industries', 'dental_industries')}</p>
    </div>
  </div>
</section>

${U.ctaBand({
  title: 'Find out where high-value demand is slipping away.',
  text: 'Let’s identify the biggest opportunities in your practice’s acquisition, conversion and follow-up.',
  primary: U.dentalAuditBtn('dental_final_get_dental_growth_audit', { size: 'lg' }),
  secondary: U.btn({ label: 'Talk to Revanta', href: '/contact?industry=dental', variant: 'ghost', cta: 'dental_final_talk', size: 'lg' }),
})}
`,
};
