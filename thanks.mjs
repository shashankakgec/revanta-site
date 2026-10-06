import * as U from '../ui.mjs';

// Dedicated thank-you URL: gives ad platforms and analytics a clean, URL-based conversion event.
export default {
  path: '/contact/thanks',
  title: 'Thank you | Revanta',
  description: 'Your growth audit request has been received.',
  noindex: true,
  conversion: 'lead',
  body: () => `
${U.pageHero({
  title: 'Thank you.',
  lead: 'We’ve received your request. We’ll review what you sent and follow up about the biggest opportunities we see.',
})}

<section class="section theme-light">
  <div class="container">
    <div class="btn-row">
      ${U.btn({ label: 'Back to the homepage', href: '/', cta: 'thanks_home' })}
      ${U.btn({ label: 'Explore our approach', href: '/approach', variant: 'ghost', cta: 'thanks_approach' })}
    </div>
  </div>
</section>
`,
};
