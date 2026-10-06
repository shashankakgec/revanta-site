import * as C from '../content.mjs';
import * as U from '../ui.mjs';

export default {
  path: '/approach',
  title: 'Our Approach: Connected Revenue Growth Systems | Revanta',
  description:
    'How Revanta builds revenue growth systems: attract, convert, engage, measure and scale as one connected loop, improved continuously with data and AI.',
  body: () => `
${U.pageHero({
  title: 'From scattered marketing activities to one connected growth system.',
  lead: 'Revanta treats growth as infrastructure: acquisition, conversion, engagement, intelligence and scale designed as one loop, then measured and improved continuously.',
  actions: U.auditBtn('approach_hero_book_growth_audit', { size: 'lg' }),
})}

<section class="section theme-light">
  <div class="container">
    ${U.shead({
      title: 'Five stages, one loop.',
      text: '<p>For every stage we look at the same three things: what is happening today, what needs to be built, and how it will be measured.</p>',
    })}
    ${U.stageDetail()}
  </div>
</section>

${U.aiBlock()}

<section class="section theme-light section--white">
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

<section class="section theme-light">
  <div class="container">
    ${U.shead({ title: 'A growth system built around your business.' })}
    ${U.steps()}
    <div class="btn-row">${U.auditBtn('approach_process_book_growth_audit')}</div>
  </div>
</section>

${U.finalCta('approach')}
`,
};
