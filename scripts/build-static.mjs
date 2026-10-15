import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const output = 'dist';
const files = [
  'index.html',
  'script.js',
  'styles.css',
  'favicon.png',
  'eu-flag.png',
  'europa-ucc-logo.png',
  'og-share.png',
];
const directories = ['assets', 'contribute', 'county', 'data', 'pairings'];
const oldOrigin = 'https://jamesc1111.github.io/europa';
const siteOrigin = process.env.SITE_URL?.replace(/\/$/, '');

if (siteOrigin && !/^https:\/\/[^/]+$/.test(siteOrigin)) {
  throw new Error('SITE_URL must be an HTTPS origin without a path.');
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output);
for (const file of files) cpSync(file, join(output, file));
for (const directory of directories) {
  cpSync(directory, join(output, directory), { recursive: true });
}

for (const page of [
  'index.html',
  'county/index.html',
  'contribute/index.html',
  'pairings/cork-france/index.html',
]) {
  const path = join(output, page);
  let html = readFileSync(path, 'utf8');
  if (siteOrigin) {
    html = html.replaceAll(oldOrigin, siteOrigin);
  } else {
    html = html
      .replace(/^\s*<link rel="canonical"[^>]*>\s*$/gm, '')
      .replace(/^\s*<meta property="og:url"[^>]*>\s*$/gm, '')
      .replace(/\s*<meta\s+property="og:image(?::[^"]+)?"[\s\S]*?\/>/g, '');
  }
  writeFileSync(path, html);
}

const siteDataPath = join(output, 'data/site.json');
const siteData = JSON.parse(readFileSync(siteDataPath, 'utf8'));
if (siteOrigin) siteData.canonicalUrl = `${siteOrigin}/`;
else delete siteData.canonicalUrl;
writeFileSync(siteDataPath, `${JSON.stringify(siteData, null, 2)}\n`);

console.log(`Built ${output}/ for ${siteOrigin ?? 'a temporary host'}`);
