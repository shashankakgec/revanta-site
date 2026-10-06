// REAL CASE STUDIES ONLY.
//
// Leave this array empty until Revanta has documented, client-approved results. While it is empty:
//   - the home page and /case-studies show the honest "we're building the first generation" message
//   - no case study pages are generated
//
// To publish a case study, add an entry below and redeploy. The build then:
//   - creates /case-studies/<slug>
//   - lists it on /case-studies and on the home page
//   - adds it to sitemap.xml
// The build fails if a required field is missing, so a half-finished entry can never ship.
//
// Never use placeholder numbers. Every value in `results` must come from real, approved data.
//
// Entry shape (strings or arrays of strings are both fine for the long-form fields):
//
// {
//   slug: 'short-url-slug',
//   title: 'Headline for the case study',
//   industry: 'Dental',
//   summary: 'One or two sentences used in listings and meta description.',
//   publishedAt: '2027-01-15',                // ISO date, used for sitemap lastmod
//   challenge: 'Business challenge',
//   startingSituation: 'Starting situation',
//   strategy: 'Strategy',
//   systemImplemented: 'Growth system implemented',
//   channels: ['Acquisition channels'],
//   conversionImprovements: ['Conversion improvements'],
//   automation: ['Automation'],
//   results: [{ label: 'Metric name', value: 'Real value', note: 'Time period, definition, source' }],
//   lessons: ['Lessons learned'],
// }

export default [];
