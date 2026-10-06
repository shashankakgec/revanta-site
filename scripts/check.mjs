// Post-build quality gate. Run with `npm run check` (builds first). Exits 1 if anything fails.
// Zero dependencies: lightweight regex checks tuned to this site's generated markup.
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const notes = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(DIST);
const exists = new Set(files.map((f) => '/' + path.relative(DIST, f).split(path.sep).join('/')));
const resolves = (p) => {
  const clean = p.replace(/\/+$/, '') || '/';
  if (clean === '/') return exists.has('/index.html');
  return exists.has(clean) || exists.has(`${clean}.html`) || exists.has(`${clean}/index.html`);
};

const VOID = new Set(['meta', 'link', 'br', 'hr', 'img', 'input', 'source', 'area', 'base', 'col', 'embed', 'wbr']);
const SVG_SHAPES = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'stop']);

function balanced(file, html) {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, '<script></script>')
    .replace(/<style[\s\S]*?<\/style>/gi, '<style></style>')
    .replace(/<!--[\s\S]*?-->/g, '');
  const stack = [];
  const tag = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
  let m;
  while ((m = tag.exec(stripped))) {
    const name = m[1].toLowerCase();
    const closing = m[0].startsWith('</');
    const selfClosed = m[0].endsWith('/>');
    if (VOID.has(name) || selfClosed || (SVG_SHAPES.has(name) && !closing)) continue;
    if (!closing) stack.push(name);
    else {
      const top = stack.pop();
      if (top !== name) return fail(file, `tag mismatch: expected </${top}> but found </${name}>`);
    }
  }
  if (stack.length) fail(file, `unclosed tags: ${stack.slice(-3).join(', ')}`);
}

const BANNED = [
  [/\b10x\b/i, '"10x" hype'],
  [/revolutionary|disruptive|game[- ]chang/i, 'hype word'],
  [/\b(we|revanta) guarantee|\bguaranteed\b|\bguarantees\b/i, 'guarantee claim'],
  [/\bROAS\b/, 'ROAS claim'],
  [/testimonial|award[- ]winning|years of experience|trusted by/i, 'unsupported proof claim'],
  [/\b\d{2,}\+?\s+(clients|customers|practices|businesses|brands)\b/i, 'client-count claim'],
];

let total = 0;
for (const abs of files.filter((f) => f.endsWith('.html'))) {
  total++;
  const rel = '/' + path.relative(DIST, abs).split(path.sep).join('/');
  const html = await readFile(abs, 'utf8');
  const isPrivacyDraft = rel === '/privacy.html';

  // --- metadata
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail(rel, 'missing <title>');
  else if (title.length > 72) fail(rel, `title too long (${title.length})`);
  if (!desc) fail(rel, 'missing meta description');
  else if (desc.length > 175) fail(rel, `meta description too long (${desc.length})`);
  if (!/<link rel="canonical" href="https?:\/\//.test(html)) fail(rel, 'missing absolute canonical');
  if (!/<meta property="og:image" content="https?:\/\//.test(html)) fail(rel, 'missing absolute og:image');
  if (!/<html lang="en">/.test(html)) fail(rel, 'missing html lang');
  if (!/<meta name="viewport"/.test(html)) fail(rel, 'missing viewport');

  // --- headings
  const heads = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  if (heads.filter((h) => h === 1).length !== 1) fail(rel, `expected exactly one <h1>, found ${heads.filter((h) => h === 1).length}`);
  let prev = 0;
  for (const h of heads) {
    if (prev && h > prev + 1) {
      fail(rel, `heading level jumps from h${prev} to h${h}`);
      break;
    }
    prev = h;
  }

  // --- ids, anchors, links
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(rel, `duplicate ids: ${[...new Set(dupes)].join(', ')}`);

  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    if (m[1].startsWith('//')) continue;
    if (!resolves(m[1])) fail(rel, `broken internal reference ${m[1]}`);
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.includes(m[1])) fail(rel, `anchor #${m[1]} has no target`);
  }
  if (/<a\b[^>]*>\s*<\/a>/.test(html)) fail(rel, 'empty link');

  // --- forms: every visible control has a label
  for (const m of html.matchAll(/<(input|select|textarea)\b([^>]*)>/g)) {
    const attrs = m[2];
    if (/type="(hidden|checkbox|radio)"/.test(attrs)) continue;
    const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (!id) continue; // honeypot lives inside its own <label>
    if (!new RegExp(`<label[^>]*for="${id}"`).test(html)) fail(rel, `control #${id} has no <label for>`);
  }

  // --- structured data
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(rel, 'invalid JSON-LD');
    }
  }

  balanced(rel, html);

  // --- brand rules
  if (rel === '/index.html') {
    const heroH1 = (html.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1] || '';
    const header = (html.match(/<header class="site-header">([\s\S]*?)<\/header>/) || [])[1] || '';
    if (/dent|patient|health/i.test(heroH1)) fail(rel, 'hero headline must not mention dental/patients/healthcare');
    if (/dent/i.test(header)) fail(rel, 'main navigation must not mention dental');
    const main = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0];
    const start = main.indexOf('class="section theme-light section--white start"');
    const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (start > -1) {
      const end = main.indexOf('</section>', start);
      const share = text(main.slice(start, end)).length / text(main).length;
      notes.push(`home: dental section is ${(share * 100).toFixed(0)}% of homepage text (brief target 10-20%)`);
    }
    const dentalMentions = (text(main).match(/dental|dentist/gi) || []).length;
    notes.push(`home: "dental" appears ${dentalMentions} times in <main>`);
  }

  // --- forbidden claims
  if (!isPrivacyDraft) {
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, ' ');
    for (const [re, label] of BANNED) {
      const hit = visible.match(re);
      if (hit) fail(rel, `${label}: "${hit[0]}"`);
    }
  }
}

for (const need of ['/sitemap.xml', '/robots.txt', '/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/og-image.png', '/site.webmanifest', '/404.html']) {
  if (!exists.has(need)) errors.push(`dist: missing ${need}`);
}

console.log(`Checked ${total} HTML files.`);
notes.forEach((n) => console.log(`  note: ${n}`));
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.error(`  x ${e}`));
  process.exit(1);
}
console.log('All checks passed.');
