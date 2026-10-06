import * as U from '../ui.mjs';
import caseStudies from '../data/case-studies.mjs';

// What each future case study section will cover. Describes the format only; no claims.
const structure = [
  ['Business challenge', 'The commercial problem the business needed to solve.'],
  ['Starting situation', 'Where acquisition, conversion and follow-up stood before the work began.'],
  ['Strategy', 'The approach chosen, and why.'],
  ['Growth system implemented', 'The connected components that were built and deployed.'],
  ['Acquisition channels', 'Where demand came from.'],
  ['Conversion improvements', 'What changed between the click and the inquiry.'],
  ['Automation', 'Which processes were automated, including where AI was used.'],
  ['Results', 'Measured outcomes with time period and definitions. Real data only.'],
  ['Lessons learned', 'What worked, what did not, and what changed as a result.'],
];

const hero = () =>
  caseStudies.length
    ? U.pageHero({
        title: 'Case studies.',
        lead: 'Documented results from Revanta growth systems, from the starting point to the measured outcome.',
      })
    : U.pageHero({
        title: 'We’re building the first generation of Revanta growth systems.',
        lead: 'Revanta is currently developing and deploying its initial growth systems with a focused group of businesses. As measurable case studies become available, this section will showcase real performance data.',
      });

export default {
  path: '/case-studies',
  title: 'Case Studies | Revanta',
  description:
    'Real, documented results from Revanta growth systems. Case studies will be published here as measurable results become available.',
  body: () => `
${hero()}

${
  caseStudies.length
    ? `<section class="section theme-light"><div class="container">${U.shead({ title: 'All case studies.', text: '<p>Each one documents the system from the starting point to the measured result.</p>' })}${U.caseStudyCards(caseStudies)}</div></section>`
    : ''
}

<section class="section theme-light${caseStudies.length ? ' section--white' : ''}">
  <div class="container">
    ${U.shead({
      title: 'What every case study will include.',
      text: '<p>Each one documents the full growth system, from the starting point to the measured result. No placeholder numbers, no unnamed “leading brands”.</p>',
    })}
    <ol class="spec">${structure
      .map(
        ([name, text], i) =>
          `<li class="spec__item"><span class="spec__n">${String(i + 1).padStart(2, '0')}</span><h3>${name}</h3><p>${text}</p></li>`,
      )
      .join('')}</ol>
  </div>
</section>

${U.finalCta('case_studies')}
`,
};
