// Static site generator for the Revanta site. Zero dependencies. Usage: `node build.mjs`
// Output: ./dist (HTML pages, hashed CSS/JS, public files, sitemap.xml, robots.txt)
import { mkdir, rm, writeFile, readFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import config, { isProduction } from './src/config.mjs';
import pages from './src/pages/index.mjs';
import { caseStudyPage } from './src/pages/case-study.mjs';
import caseStudies from './src/data/case-studies.mjs';
import { renderDocument, pageUrl } from './src/layout.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');

// Conservative CSS minifier: strips comments and redundant whitespace only.
const minifyCss = (css) =>
  css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

/** Write a content-hashed asset so it can be cached forever. Returns its public URL. */
async function emit(kind, name, ext, content) {
  const hash = createHash('md5').update(content).digest('hex').slice(0, 10);
  const rel = `assets/${kind}/${name}.${hash}.${ext}`;
  const file = path.join(OUT, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
  return `/${rel}`;
}

const outputFile = (p) => (p === '/' ? 'index.html' : `${p.slice(1)}.html`);

async function build() {
  const started = Date.now();
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // 1. Static files (favicon, og-image, manifest...) are copied to the site root.
  await cp(path.join(ROOT, 'public'), OUT, { recursive: true });

  // 2. Hashed assets.
  const assets = { css: '', js: {} };
  const css = minifyCss(await readFile(path.join(SRC, 'assets/css/styles.css'), 'utf8'));
  assets.css = await emit('css', 'styles', 'css', css);
  for (const name of ['analytics', 'main', 'form']) {
    assets.js[name] = await emit('js', name, 'js', await readFile(path.join(SRC, `assets/js/${name}.js`), 'utf8'));
  }

  // 3. Pages (registry + generated case study pages).
  const all = [...pages, ...caseStudies.map(caseStudyPage)];
  const seen = new Set();
  const year = new Date().getFullYear();
  for (const page of all) {
    if (seen.has(page.path)) throw new Error(`Duplicate page path: ${page.path}`);
    seen.add(page.path);
    const file = path.join(OUT, outputFile(page.path));
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, renderDocument(page, assets, { year }));
  }

  // 4. sitemap.xml and robots.txt
  const today = new Date().toISOString().slice(0, 10);
  const indexable = all.filter((p) => !p.noindex && p.path !== '/404');
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable.map((p) => `  <url><loc>${pageUrl(p.path)}</loc><lastmod>${p.lastmod || today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`;
  await writeFile(path.join(OUT, 'sitemap.xml'), sitemap);

  const robots = isProduction
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /contact/thanks\n\nSitemap: ${config.url}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  await writeFile(path.join(OUT, 'robots.txt'), robots);

  // 5. Summary
  console.log(`Built ${all.length} pages in ${Date.now() - started}ms -> dist/`);
  console.log(`  site url:   ${config.url}${isProduction ? '' : '  (non-production build: noindex + robots disallow)'}`);
  console.log(`  indexable:  ${indexable.length} pages in sitemap.xml`);
  console.log(`  analytics:  ${config.analytics.gtmId ? 'GTM ' + config.analytics.gtmId : config.analytics.gaId ? 'GA4 ' + config.analytics.gaId : 'none configured'}`);
  if (process.env.VERCEL_ENV === 'production' && /localhost/.test(config.url)) {
    console.warn('  WARNING: SITE_URL is not set. Canonical URLs and Open Graph tags point at localhost.');
  }
  if (!process.env.SITE_URL && process.env.VERCEL_ENV === 'production') {
    console.warn('  NOTE: SITE_URL not set; using the Vercel production domain. Set SITE_URL to your custom domain.');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
