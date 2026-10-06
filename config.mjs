// Central site configuration. Edit here, not in page files.
// Anything read from process.env is set in Vercel (Settings > Environment Variables).

const env = process.env;

// Canonical origin. Priority: SITE_URL > Vercel production domain > Vercel deployment URL > localhost.
const fromVercel = env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : env.VERCEL_URL
    ? `https://${env.VERCEL_URL}`
    : '';

/** True for local builds and Vercel production builds. Preview deployments are kept out of search. */
export const isProduction = env.VERCEL_ENV ? env.VERCEL_ENV === 'production' : true;

export default {
  name: 'Revanta',
  // TODO(launch): replace with the registered legal entity name (used in the footer and privacy policy).
  legalName: 'Revanta',
  tagline: 'AI-powered growth systems for modern businesses',
  url: (env.SITE_URL || fromVercel || 'http://localhost:3000').replace(/\/+$/, ''),
  locale: 'en_US',

  // Shown to visitors only if the lead form fails to submit. Leave empty to omit.
  contactEmail: env.CONTACT_EMAIL || '',

  analytics: {
    gtmId: env.GTM_ID || '',
    gaId: env.GA_MEASUREMENT_ID || '',
  },
  searchConsoleVerification: env.GOOGLE_SITE_VERIFICATION || '',

  features: {
    // The brief asks for Case Studies in the main nav. While there are no real case studies,
    // set this to false to remove the link from the nav and footer (the page itself stays live).
    caseStudiesInNav: true,
  },

  // Main navigation. "Dental" is intentionally not here (see brand rules in README).
  nav: [
    { label: 'Solutions', href: '/solutions' },
    { label: 'Approach', href: '/approach' },
    { label: 'Industries', href: '/industries' },
    { label: 'Case Studies', href: '/case-studies', flag: 'caseStudiesInNav' },
    { label: 'About', href: '/about' },
  ],

  // CTA labels. The corporate site always says "Book a Growth Audit".
  // Dental campaign traffic (?industry=dental) and the dental page use the dental label.
  cta: {
    audit: 'Book a Growth Audit',
    dental: 'Get a Dental Growth Audit',
    talk: 'Talk to Revanta',
    approach: 'Explore Our Approach',
  },
};
