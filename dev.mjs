// Local development server. `npm run dev` (rebuild on change) or `npm start` (serve once).
// Serves ./dist with clean URLs like Vercel does, and runs the real /api/lead handler locally.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 3000;
const WATCH = !process.argv.includes('--no-watch');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json',
};

const build = () =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, ['build.mjs'], { cwd: ROOT, stdio: 'inherit' });
    child.on('close', resolve);
  });

async function tryRead(file) {
  try {
    return await readFile(file);
  } catch {
    return null;
  }
}

/** Resolve a URL path the way Vercel's cleanUrls does: /x -> x.html -> x/index.html */
async function resolveStatic(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/\/+$/, '') || '/';
  const base = path.join(DIST, rel);
  if (!base.startsWith(DIST)) return null;
  for (const candidate of [base, `${base}.html`, path.join(base, 'index.html')]) {
    if (path.extname(candidate) || candidate.endsWith('index.html')) {
      const data = await tryRead(candidate);
      if (data) return { data, file: candidate };
    }
  }
  return null;
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString('utf8');
  const type = req.headers['content-type'] || '';
  if (type.includes('application/json')) {
    try {
      return JSON.parse(raw || '{}');
    } catch {
      return {};
    }
  }
  if (type.includes('application/x-www-form-urlencoded')) {
    const out = {};
    for (const [k, v] of new URLSearchParams(raw)) {
      out[k] = k in out ? [].concat(out[k], v) : v;
    }
    return out;
  }
  return {};
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/lead') {
    // Minimal Vercel-style helpers so the production handler runs unchanged.
    res.status = (code) => ((res.statusCode = code), res);
    res.json = (obj) => {
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(obj));
    };
    res.redirect = (code, to) => {
      res.statusCode = code;
      res.setHeader('location', to);
      res.end();
    };
    req.body = await readBody(req);
    const { default: handler } = await import(`${pathToFileURL(path.join(ROOT, 'api/lead.js')).href}?t=${Date.now()}`);
    return handler(req, res);
  }

  const hit = await resolveStatic(url.pathname);
  if (hit) {
    res.writeHead(200, { 'content-type': TYPES[path.extname(hit.file)] || 'application/octet-stream' });
    return res.end(hit.data);
  }
  const notFound = await tryRead(path.join(DIST, '404.html'));
  res.writeHead(404, { 'content-type': TYPES['.html'] });
  res.end(notFound || 'Not found');
});

await build();
server.listen(PORT, () => console.log(`\nRevanta dev server: http://localhost:${PORT}${WATCH ? '  (watching for changes)' : ''}\n`));

if (WATCH) {
  let timer;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(build, 150);
  };
  for (const dir of ['src', 'public']) {
    try {
      watch(path.join(ROOT, dir), { recursive: true }, rebuild);
    } catch {
      console.warn(`Could not watch ${dir}/ (recursive watch unsupported); restart to pick up changes.`);
    }
  }
}
