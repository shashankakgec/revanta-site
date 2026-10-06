// Page shell: <head> metadata, header, footer, scripts.
import config, { isProduction } from './config.mjs';
import { mark } from './icons.mjs';
import { esc, jsonForScript } from './util.mjs';

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap';

const SAFE_ID = /^[A-Za-z0-9_-]{3,40}$/;

const navItems = () => config.nav.filter((n) => !n.flag || config.features[n.flag]);
const isActive = (href, path) => path === href || path.startsWith(`${href}/`);

export const pageUrl = (path) => (path === '/' ? `${config.url}/` : `${config.url}${path}`);

// ------------------------------------------------------------------ header / footer

function header(path) {
  const links = navItems()
    .map(
      (n) =>
        `<li><a href="${n.href}"${isActive(n.href, path) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`,
    )
    .join('');
  return `
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="Revanta home">${mark()}<span class="brand__word">REVANTA</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="sr-only">Menu</span><span class="nav-toggle__bars" aria-hidden="true"></span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Primary">
      <ul class="site-nav__list">${links}</ul>
      <a class="btn btn--primary btn--sm site-nav__cta" href="/contact" data-cta="nav_book_growth_audit" data-cta-audit>${esc(config.cta.audit)}</a>
    </nav>
  </div>
</header>`;
}

function footer(year) {
  const company = [
    { label: 'About', href: '/about' },
    { label: 'Approach', href: '/approach' },
    ...(config.features.caseStudiesInNav ? [{ label: 'Case Studies', href: '/case-studies' }] : []),
    { label: 'Contact', href: '/contact' },
  ];
  const explore = [
    { label: 'Solutions', href: '/solutions' },
    { label: 'Industries', href: '/industries' },
    { label: 'Dental growth system', href: '/industries/dental' },
  ];
  const list = (arr) => arr.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('');
  return `
<footer class="site-footer theme-dark">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="brand" href="/" aria-label="Revanta home">${mark()}<span class="brand__word">REVANTA</span></a>
      <p>${esc(config.tagline)}.</p>
    </div>
    <nav class="footer__col" aria-label="Company"><h2 class="footer__h">Company</h2><ul>${list(company)}</ul></nav>
    <nav class="footer__col" aria-label="Explore"><h2 class="footer__h">Explore</h2><ul>${list(explore)}</ul></nav>
  </div>
  <div class="container footer__legal">
    <p>© ${year} ${esc(config.legalName)}. All rights reserved.</p>
    <p><a href="/privacy">Privacy</a></p>
  </div>
</footer>`;
}

// ------------------------------------------------------------------ analytics hooks

const gtmHead = (id) =>
  `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');</script>`;
const gtmBody = (id) =>
  `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
const gaHead = (id) =>
  `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');</script>`;

function analyticsSnippets() {
  const { gtmId, gaId } = config.analytics;
  // Only production builds load third-party analytics. Preview deployments stay clean.
  if (!isProduction) return { head: '', body: '' };
  if (SAFE_ID.test(gtmId)) return { head: gtmHead(gtmId), body: gtmBody(gtmId) };
  if (SAFE_ID.test(gaId)) return { head: gaHead(gaId), body: '' };
  return { head: '', body: '' };
}

// ------------------------------------------------------------------ structured data

function structuredData(page) {
  const out = [];
  if (page.path === '/') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: config.name,
      url: `${config.url}/`,
      logo: `${config.url}/apple-touch-icon.png`,
      description: `${config.tagline}.`,
    });
    out.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: config.name, url: `${config.url}/` });
  }
  if (page.crumbs?.length) {
    const trail = [{ label: 'Home', href: '/' }, ...page.crumbs];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: c.href ? pageUrl(c.href) : pageUrl(page.path),
      })),
    });
  }
  if (page.jsonld) out.push(...page.jsonld());
  return out;
}

// ------------------------------------------------------------------ document

export function renderDocument(page, assets, { year }) {
  const url = pageUrl(page.path);
  const image = `${config.url}/og-image.png`;
  const title = esc(page.title);
  const desc = esc(page.description);
  const indexable = isProduction && !page.noindex;
  const robots = indexable
    ? '<meta name="robots" content="index,follow,max-image-preview:large">'
    : '<meta name="robots" content="noindex,follow">';
  const { head: analyticsHead, body: analyticsBody } = analyticsSnippets();
  const verification = config.searchConsoleVerification
    ? `<meta name="google-site-verification" content="${esc(config.searchConsoleVerification)}">`
    : '';
  const ld = structuredData(page)
    .map((o) => `<script type="application/ld+json">${jsonForScript(o)}</script>`)
    .join('\n');
  const pageScripts = (page.scripts || []).map((s) => `<script defer src="${assets.js[s]}"></script>`).join('\n');
  const bodyClass = `page-${page.path === '/' ? 'home' : page.path.slice(1).replace(/\//g, '-')}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${robots}
${verification}
<meta name="theme-color" content="#0A1730">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(config.name)}">
<meta property="og:locale" content="${config.locale}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Revanta: ${esc(config.tagline)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONT_URL}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONT_URL}"></noscript>
<link rel="stylesheet" href="${assets.css}">
<script>document.documentElement.classList.add('js')</script>
<noscript><style>.nav-toggle{display:none!important}.site-nav{position:static!important;transform:none!important;opacity:1!important;visibility:visible!important;max-height:none!important;flex-wrap:wrap;padding:0!important}.form-switch{display:none!important}[data-form][hidden]{display:block!important}</style></noscript>
${ld}
${analyticsHead}
</head>
<body class="${bodyClass}" data-page="${esc(page.path)}"${page.conversion ? ` data-conversion="${esc(page.conversion)}"` : ''}>
${analyticsBody}
<a class="skip-link" href="#main">Skip to content</a>
${header(page.path)}
<main id="main">
${page.body()}
</main>
${footer(year)}
<script defer src="${assets.js.analytics}"></script>
<script defer src="${assets.js.main}"></script>
${pageScripts}
</body>
</html>
`;
}
