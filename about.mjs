import config from '../config.mjs';
import * as C from '../content.mjs';
import * as U from '../ui.mjs';

export default {
  path: '/about',
  title: 'About Revanta | Infrastructure for Modern Growth',
  description:
    'Revanta sits at the intersection of marketing, technology and AI. We build growth infrastructure that treats growth as a system and improves continuously.',
  body: () => `
${U.pageHero({ title: 'We’re building the infrastructure behind modern growth.' })}

<section class="section theme-light">
  <div class="container split">
    <div class="split__main">
      <h2>Marketing, technology and AI, built as one system.</h2>
    </div>
    <div class="split__aside">
      <div class="prose prose--lg">
        <p>Revanta exists at the intersection of marketing, technology and artificial intelligence.</p>
        <p>We believe growth should be treated as a system, not a collection of disconnected marketing activities.</p>
        <p>Our approach combines customer acquisition, conversion, automation, data and AI to create growth infrastructure that can continuously improve.</p>
        <p>We are starting with high-value businesses where the economics are clear and measurable. Our ambition is to take what works and build systems that can scale across industries.</p>
      </div>
    </div>
  </div>
</section>

<section class="section theme-dark">
  <div class="container">
    ${U.shead({
      title: 'How we operate.',
      text: '<p>We understand the economics. We build the system. We measure what happens. We improve it.</p>',
    })}
    <ol class="principles">${C.principles
      .map((p) => `<li><h3>${p.title}</h3><p>${p.text}</p></li>`)
      .join('')}</ol>
  </div>
</section>

<section class="section theme-light section--white">
  <div class="container split">
    <div class="split__main"><h2>Where we are today.</h2></div>
    <div class="split__aside">
      <p class="lead">Revanta is currently developing and deploying its initial growth systems with a focused group of businesses. We are starting with high-value dental practices in the United States and building toward other high-value industries.</p>
      <p>${U.link('The dental growth system', '/industries/dental', 'about_dental')} &nbsp;&nbsp; ${U.link('All industries', '/industries', 'about_industries')}${
        config.features.caseStudiesInNav ? ` &nbsp;&nbsp; ${U.link('Case studies', '/case-studies', 'about_case_studies')}` : ''
      }</p>
    </div>
  </div>
</section>

${U.finalCta('about')}
`,
};
