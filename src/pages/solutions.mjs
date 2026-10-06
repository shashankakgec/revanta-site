import * as U from '../ui.mjs';

export default {
  path: '/solutions',
  title: 'AI Growth Systems & Marketing Automation | Revanta Solutions',
  description:
    'Customer acquisition, conversion optimization, AI and automation, CRM, analytics and content, built as one connected revenue growth system.',
  body: () => `
${U.pageHero({
  title: 'Growth systems, not a menu of services.',
  lead: 'Revanta’s capabilities are components of one system. Each is designed to feed the next, so acquisition, conversion, automation and data work together instead of in silos.',
  actions: U.auditBtn('solutions_hero_book_growth_audit', { size: 'lg' }),
})}

<section class="section theme-light">
  <div class="container">
    ${U.shead({
      title: 'Six capabilities. One connected system.',
      text: '<p>Each capability is built to share data and decisions with the others, so the system gets clearer and faster as it runs.</p>',
    })}
    <div class="cdetail-list">${U.capDetail()}</div>
  </div>
</section>

<section class="section theme-dark sample">
  <div class="container">
    ${U.shead({
      title: 'How the capabilities connect.',
      text: '<p>A sample customer acquisition system, from first click to measured revenue. Every deployment is designed around the individual business.</p>',
    })}
    ${U.architecture()}
  </div>
</section>

${U.finalCta('solutions', 'light')}
`,
};
