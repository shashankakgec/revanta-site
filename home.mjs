import config from '../config.mjs';
import * as C from '../content.mjs';
import * as U from '../ui.mjs';
import caseStudies from '../data/case-studies.mjs';
import { plain } from '../util.mjs';

export default {
  path: '/',
  title: 'Revanta | AI-Powered Growth Systems for Modern Businesses',
  description:
    'Revanta builds AI-powered growth systems that help modern businesses acquire customers, convert demand, automate operations and grow revenue.',
  jsonld: () => [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: C.faqs.map((f) => ({
        '@type': 'Question',
        name: plain(f.q),
        acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
      })),
    },
  ],
  body: () => `
${U.pageHero({
  eyebrow: 'AI-Powered Growth',
  title: 'Build a Growth Engine, Not Just a Marketing Campaign.',
  lead: 'Revanta combines acquisition, conversion, automation, AI and data to help businesses attract better customers, turn more opportunities into revenue, and build scalable growth systems.',
  actions:
    U.auditBtn('hero_book_growth_audit', { size: 'lg' }) +
    U.btn({ label: config.cta.approach, href: '/approach', variant: 'ghost', cta: 'hero_explore_approach', size: 'lg' }),
  visual: U.schematic(C.heroNodes),
})}

${U.strip()}

<section class="section theme-light problem">
  <div class="container split">
    <div class="split__main">
      <h2>Most businesses don’t have a marketing problem. They have a growth-system problem.</h2>
      <div class="prose">
        <p>Advertising, websites, landing pages, lead capture, CRM, follow-up, sales processes, analytics, automation and customer data often operate independently.</p>
        <p class="statement">More traffic doesn’t automatically create more revenue.</p>
        <p>A business can generate leads and still lose customers because the website doesn’t convert, follow-up is slow, sales processes are inconsistent, or valuable data is never used.</p>
        <p>Revanta connects the critical parts of the growth journey into one system.</p>
      </div>
    </div>
    <div class="split__aside">${U.problemVisual()}</div>
  </div>
</section>

<section class="section theme-dark approach">
  <div class="container">
    ${U.shead({
      title: 'From scattered marketing activities to one connected growth system.',
      text: '<p>Five stages, one loop. Each stage passes data and decisions to the next, and the last feeds the first.</p>',
    })}
    ${U.flow()}
    <p class="section__more">${U.link('See how each stage works', '/approach', 'home_approach_detail')}</p>
  </div>
</section>

<section class="section theme-light">
  <div class="container">
    ${U.shead({
      title: 'Everything required to build a modern growth engine.',
      text: '<p>Six capabilities, designed as components of one system rather than a menu of separate services.</p>',
    })}
    ${U.capGrid()}
    <p class="section__more">${U.link('Explore all solutions', '/solutions', 'home_all_solutions')}</p>
  </div>
</section>

<section class="section theme-light section--alt why">
  <div class="container">
    ${U.shead({
      title: 'Marketing is changing. The companies that connect marketing with technology will move faster.',
      text: '<p>The difference isn’t effort. It’s how the pieces are connected, measured and improved.</p>',
      cls: 'shead--wide',
    })}
    ${U.compare()}
  </div>
</section>

${U.aiBlock()}

<section class="section theme-light section--white start">
  <div class="container start__grid">
    <div class="start__copy">
      <h2>Where We’re Starting</h2>
      <p class="start__sub">Our first growth market: high-value dental practices.</p>
      <div class="prose">
        <p>Revanta is initially focused on businesses where every new customer can have significant economic value and where measurable growth can create a meaningful impact.</p>
        <p>We are beginning with high-value dental practices in the United States, particularly practices offering implant, cosmetic and other high-value treatments.</p>
        <p>High-value treatments create clear economics around customer acquisition, which makes growth easier to measure and improve.</p>
      </div>
      <p class="callout">This is our starting point — not our limit.</p>
      <div class="btn-row">${U.btn({ label: 'Explore the Dental Growth System', href: '/industries/dental', cta: 'home_explore_dental_system' })}</div>
    </div>
    <div class="start__sys">
      <p class="label">The dental growth system</p>
      ${U.ladder()}
    </div>
  </div>
</section>

<section class="section theme-light">
  <div class="container">
    ${U.shead({
      title: 'Built to expand across industries.',
      text: '<p>The same growth principles can apply wherever customer acquisition, conversion and operational efficiency have meaningful economic value.</p>',
    })}
    ${U.industryList()}
    <p class="note">Industries marked “Future expansion” are planned, not active.</p>
  </div>
</section>

<section class="section theme-light section--white">
  <div class="container">
    ${U.shead({ title: 'A growth system built around your business.' })}
    ${U.steps()}
    <div class="btn-row">${U.auditBtn('process_book_growth_audit')}</div>
  </div>
</section>

<section class="section theme-dark sample">
  <div class="container">
    ${U.shead({
      title: 'What Revanta actually builds.',
      text: '<p>A sample growth system, from first click to measured revenue. Every deployment is designed around the individual business.</p>',
    })}
    ${U.architecture()}
    <p class="section__more">${U.link('Explore the solutions behind each stage', '/solutions', 'home_sample_to_solutions')}</p>
  </div>
</section>

${U.results(caseStudies)}

<section class="section theme-light section--white about">
  <div class="container split">
    <div class="split__main">
      <h2>We’re building the infrastructure behind modern growth.</h2>
    </div>
    <div class="split__aside">
      <div class="prose">
        <p>Revanta exists at the intersection of marketing, technology and artificial intelligence.</p>
        <p>We believe growth should be treated as a system, not a collection of disconnected marketing activities.</p>
      </div>
      <p>${U.link('About Revanta', '/about', 'home_about')}</p>
    </div>
  </div>
</section>

<section class="section theme-light faq-section">
  <div class="container split split--faq">
    <div class="split__main">
      <h2>Straight answers.</h2>
      <p class="lead">What Revanta is, how it works, and what it does not promise.</p>
    </div>
    <div class="split__aside">${U.faqList()}</div>
  </div>
</section>

${U.finalCta('final')}
`,
};
