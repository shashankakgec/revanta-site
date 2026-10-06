import * as U from '../ui.mjs';

export default {
  path: '/404',
  title: 'Page not found | Revanta',
  description: 'The page you are looking for does not exist.',
  noindex: true,
  body: () => `
${U.pageHero({
  title: 'That page doesn’t exist.',
  lead: 'It may have moved, or the link may be wrong. These will get you back on track.',
  actions:
    U.btn({ label: 'Go to the homepage', href: '/', size: 'lg', cta: '404_home' }) +
    U.btn({ label: 'Contact Revanta', href: '/contact', variant: 'ghost', size: 'lg', cta: '404_contact' }),
})}
`,
};
