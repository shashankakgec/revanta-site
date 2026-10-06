import config from '../config.mjs';
import * as U from '../ui.mjs';

const criteria = [
  {
    title: 'Significant value per customer',
    text: 'Each new customer carries enough economic value to justify investing in better acquisition, conversion and follow-up.',
  },
  {
    title: 'Measurable acquisition and conversion',
    text: 'The path from first touch to revenue can be tracked, so the system can be improved with evidence.',
  },
  {
    title: 'Meaningful impact from growth',
    text: 'Better results in acquisition and conversion change the economics of the business.',
  },
];

export default {
  path: '/industries',
  title: 'Industries We Build Growth Systems For | Revanta',
  description:
    'Revanta is starting with high-value dental practices and building AI-powered growth systems that can expand across other high-value industries.',
  body: () => `
${U.pageHero({
  title: 'Built to expand across industries.',
  lead: 'The same growth principles can apply wherever customer acquisition, conversion and operational efficiency have meaningful economic value.',
})}

<section class="section theme-light">
  <div class="container">
    ${U.shead({
      title: 'Where Revanta stands today.',
      text: '<p>Dental is the first vertical. Every other industry below is planned, and labeled that way.</p>',
    })}
    ${U.industryList({ showLink: true })}
    <p class="note">Industries marked “Future expansion” are planned, not active.</p>
  </div>
</section>

<section class="section theme-light section--white">
  <div class="container">
    ${U.shead({
      title: 'What makes an industry a fit.',
      text: '<p>Revanta is initially focused on businesses where every new customer can have significant economic value and where measurable growth can create a meaningful impact.</p>',
    })}
    <ol class="criteria">${criteria.map((c) => `<li><h3>${c.title}</h3><p>${c.text}</p></li>`).join('')}</ol>
  </div>
</section>

${U.ctaBand({
  title: 'Don’t see your industry?',
  text: 'Dental is our initial focus, and the systems are built to expand. If your business has high customer value and measurable acquisition, tell us about it.',
  primary: U.auditBtn('industries_book_growth_audit', { size: 'lg' }),
  secondary: U.btn({ label: config.cta.talk, href: '/contact', variant: 'ghost', cta: 'industries_talk_to_revanta', size: 'lg' }),
})}
`,
};
