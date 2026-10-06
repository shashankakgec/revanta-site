import * as U from '../ui.mjs';

// DRAFT TEMPLATE. Not legal advice. Replace every [bracketed item], have counsel review it,
// then remove `noindex` below and delete the notice paragraph.
export default {
  path: '/privacy',
  title: 'Privacy Policy | Revanta',
  description: 'How Revanta collects, uses and protects information submitted through this website.',
  noindex: true,
  body: () => `
${U.pageHero({ title: 'Privacy Policy.' })}

<section class="section theme-light legal">
  <div class="container container--narrow">
    <p class="notice"><strong>Draft for legal review.</strong> This is a starting template, not legal advice. Replace every [bracketed item] and have counsel review it before launch. The page is set to noindex until it is finalized.</p>
    <div class="prose">
      <h2>Who we are</h2>
      <p>This website is operated by [legal entity name] (“Revanta”, “we”, “us”). You can reach us about privacy at [privacy contact email].</p>

      <h2>What we collect</h2>
      <p><strong>Information you submit.</strong> When you request a growth audit we collect the details you enter in the form: name, email, company or practice name, website, location, industry, what the business sells or its main treatments, approximate customer value, current acquisition or marketing channels, monthly marketing budget or spend, your biggest challenge, and any additional information you choose to add.</p>
      <p><strong>Usage and campaign data.</strong> [If analytics is enabled:] we use [Google Analytics / Google Tag Manager] to understand how the site is used. We also store campaign parameters (such as UTM values) and the first page you visited in your browser so that a form submission can be attributed to the campaign that brought you here.</p>

      <h2>Please don’t send patient information</h2>
      <p>Our forms are for business inquiries. Do not include patient names, health information or other sensitive personal data in any form field.</p>

      <h2>How we use information</h2>
      <p>We use submitted information to respond to your request, assess whether we can help, and follow up about your inquiry. We use usage and campaign data to measure and improve the website and our marketing. [Add any other purposes, such as newsletters, and the legal bases that apply.]</p>

      <h2>Who we share it with</h2>
      <p>We share information with service providers that help us operate the site and handle inquiries: [hosting provider], [form delivery / CRM provider], [analytics provider]. We may disclose information if required by law. We do not sell personal information. [Confirm with counsel.]</p>

      <h2>Cookies and similar technologies</h2>
      <p>[Describe cookies and browser storage in use, how to opt out, and add a consent mechanism if you serve visitors in regions that require one.]</p>

      <h2>Retention</h2>
      <p>[State how long inquiry and analytics data is kept.]</p>

      <h2>Your choices and rights</h2>
      <p>[Describe access, correction, deletion and opt-out rights that apply, and how to exercise them at [privacy contact email].]</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The date of the latest revision is [date].</p>
    </div>
  </div>
</section>
`,
};
