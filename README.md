# Revanta website

Corporate site for Revanta, an AI-powered growth company. Dental is the first vertical, not the identity.

**Stack:** a zero-dependency static site generator (plain Node, no `npm install` needed), a single serverless function for the lead form, hand-written CSS and a few small JS files. It builds in milliseconds, ships no framework JavaScript, and deploys on Vercel with no configuration beyond environment variables.

```
npm run dev      # build + serve on http://localhost:3000, rebuild on change, runs the real /api/lead locally
npm run build    # writes ./dist
npm run check    # build, then validate links, headings, ids, metadata, JSON-LD, forms and brand rules
```

Requires Node 18.17 or newer.

## Deploy (GitHub + Vercel)

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New Project**, import the repo. Framework preset **Other**. `vercel.json` already sets the build command (`npm run build`) and output directory (`dist`).
3. Add environment variables (see `.env.example`). The two that matter on day one:
   - `SITE_URL` - your public URL, e.g. `https://www.yourdomain.com`
   - `LEAD_WEBHOOK_URL` **or** `RESEND_API_KEY` + `LEAD_TO_EMAIL` + `LEAD_FROM_EMAIL` - where form submissions go
4. Add your custom domain in **Settings > Domains**, then redeploy.
5. Submit `https://yourdomain.com/sitemap.xml` in Google Search Console. Set `GOOGLE_SITE_VERIFICATION` if you verify with the meta tag.

Preview deployments are automatically `noindex` and `robots.txt` disallows them.

## Lead form

`/contact` has two forms (general and dental) behind a switch. `/contact?industry=dental` opens the dental one. Both post JSON to `/api/lead` (`api/lead.js`), which validates, sanitizes and forwards to every configured channel:

| Channel | Variables |
| --- | --- |
| Webhook (Zapier, Make, n8n, Slack, HubSpot/GoHighLevel inbound hook, your own API) | `LEAD_WEBHOOK_URL` |
| Email via Resend | `RESEND_API_KEY`, `LEAD_TO_EMAIL` (comma separated), `LEAD_FROM_EMAIL` |

**If neither is configured the endpoint returns 503 on purpose**, so a lead is never silently lost; the visitor sees an error message. Set one before launch.

The webhook receives `{ event, form_type, submitted_at, page, fields, attribution, user_agent }`. `attribution` carries first-touch and last-touch UTM/click IDs (`utm_*`, `gclid`, `fbclid`, `msclkid`), which is what makes later CRM integration straightforward. Spam controls: honeypot field, a minimum-time check, same-origin check, length limits. Without JavaScript the form still posts natively and redirects.

Successful submissions land on `/contact/thanks?type=general|dental`, a dedicated URL for ad-platform and analytics conversions.

## Analytics

Set `GTM_ID` (preferred) or `GA_MEASUREMENT_ID` and redeploy; the vendor snippet is injected on production builds only. With neither set, events still queue in `window.dataLayer`, so nothing needs rewriting later.

| Event | Fires | Parameters |
| --- | --- | --- |
| `cta_click` | any element with `data-cta` | `cta_id`, `cta_text`, `cta_destination` |
| `form_start` | first interaction with a form | `form_type` |
| `form_submit` | accepted by the API | `form_type` |
| `form_error` | client-side validation failed | `form_type` |
| `generate_lead` | `/contact/thanks` loads | `form_type` |

Mark `generate_lead` as your key conversion. In GTM, use these as Custom Event triggers; Meta Pixel and Google Ads conversion tags attach there. `window.revanta.track(name, params)` is available for new events and `window.revanta.attribution()` returns first/last touch.

## Brand and copy rules (enforced by `npm run check`)

- Revanta is a growth company; dental is its first application. No dental or patient wording in the homepage hero headline or main navigation. The dental section stays at roughly 10 to 20 percent of the homepage.
- Never claim clients, results, revenue, ROAS, leads generated, testimonials, awards, partnerships, headcount, years in business or logos unless real and provided. The checker fails the build on common offenders.
- No hype ("10x", "revolutionary"), no guarantees.

## Common tasks

- **Edit copy:** shared copy lives in `src/content.mjs`; page-specific copy in `src/pages/*.mjs`.
- **Add a page:** create `src/pages/<name>.mjs` (copy a small one such as `industries.mjs`) and register it in `src/pages/index.mjs`. It appears in the build, sitemap and checks automatically.
- **Add an industry page:** add the page module (see `dental.mjs`), then set `href` on the entry in `industries` in `src/content.mjs`. Statuses stay honest: "Initial focus" or "Future expansion".
- **Publish a case study:** add an entry to `src/data/case-studies.mjs` (the file documents the shape). The build creates `/case-studies/<slug>`, lists it, adds it to the sitemap, and replaces the "we're building the first generation" message on the home page. An incomplete entry fails the build.
- **Dental campaign CTA:** traffic with `?industry=dental` (or a UTM campaign/content containing "dental") sees "Get a Dental Growth Audit" across the site for the session. Everyone else sees "Book a Growth Audit". Labels live in `src/config.mjs`.
- **Hide Case Studies from the nav** until there is a real case study: set `features.caseStudiesInNav: false` in `src/config.mjs`.
- **Colors and type:** tokens are at the top of `src/assets/css/styles.css`.

## Before launch: replace and decide

- [ ] `SITE_URL` set to the real domain (canonical URLs, Open Graph, sitemap depend on it)
- [ ] Lead delivery configured and tested with a real submission
- [ ] `/privacy` is a **draft template**: fill the bracketed items, have counsel review, then remove `noindex` in `src/pages/privacy.mjs`
- [ ] `legalName` in `src/config.mjs`; optionally `CONTACT_EMAIL` for the form's error fallback
- [ ] `public/og-image.png` was generated with a system font; replace with a designed 1200x630 image
- [ ] Fonts load from Google Fonts. For best Core Web Vitals and privacy, self-host IBM Plex Sans and Mono and swap the link in `src/layout.mjs`
- [ ] If you serve visitors in the EU or UK, add a consent banner before enabling GA/GTM
- [ ] Run Lighthouse on the deployed URL and fix anything environment-specific

### Compliance notes (not legal advice)

The forms collect business contact details only and tell people not to submit patient information. Once campaigns run, the follow-up automation is a separate compliance surface: SMS needs documented consent (TCPA), handling patient inquiries for a dental practice can create HIPAA obligations (a Business Associate Agreement with the practice), and Google and Meta have restrictions on health-related advertising and audience data. Get advice before launching the dental campaigns, not just the website.

## Structure

```
build.mjs            static generator: pages, hashed assets, sitemap.xml, robots.txt
dev.mjs              local server (clean URLs, rebuild on change, runs api/lead.js)
api/lead.js          POST /api/lead serverless function
scripts/check.mjs    post-build quality gate
public/              copied to the site root (favicon, og-image, manifest)
src/config.mjs       URL, nav, CTA labels, analytics IDs, feature flags
src/content.mjs      shared copy and structured content
src/ui.mjs           reusable HTML sections
src/layout.mjs       <head>, metadata, JSON-LD, header, footer
src/pages/           one module per page
src/data/            case-studies.mjs (empty on purpose)
src/assets/          css/styles.css, js/{analytics,main,form}.js
```
