/**
 * Validation Script for Google Search Favicon & Logo Rich Result Compliance
 */
const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING GOOGLE SEARCH FAVICON & LOGO COMPLIANCE ===');

// 1. Verify physical icon files exist
const requiredIcons = [
  'favicon.ico',
  'assets/icons/favicon.ico',
  'assets/icons/favicon-48x48.png',
  'assets/icons/favicon-96x96.png',
  'assets/icons/favicon-192x192.png',
  'assets/icons/favicon-512x512.png',
  'assets/icons/apple-touch-icon.png',
  'assets/icons/fimforte-emblem-512.png',
  'assets/icons/fimforte-favicon.svg'
];

let allFilesExist = true;
requiredIcons.forEach(icon => {
  const exists = fs.existsSync(icon);
  const size = exists ? fs.statSync(icon).size : 0;
  console.log(`[${exists && size > 0 ? 'PASS' : 'FAIL'}] File: ${icon} (${size} bytes)`);
  if (!exists || size === 0) allFilesExist = false;
});

if (!allFilesExist) {
  console.error('Missing required icon files!');
  process.exit(1);
}

// 2. Verify HTML head links across all pages
['index.html', 'submit-testimonial.html', '404.html'].forEach(page => {
  const html = fs.readFileSync(page, 'utf8');
  const hasSvgIcon = html.includes('rel="icon" type="image/svg+xml"') && html.includes('fimforte-favicon.svg');
  const has48png = html.includes('sizes="48x48"') && html.includes('favicon-48x48.png');
  const has96png = html.includes('sizes="96x96"') && html.includes('favicon-96x96.png');
  const has192png = html.includes('sizes="192x192"') && html.includes('favicon-192x192.png');
  const hasAppleTouch = html.includes('rel="apple-touch-icon"') && html.includes('apple-touch-icon.png');
  const hasShortcutIco = html.includes('rel="shortcut icon"') && html.includes('favicon.ico');

  const pagePass = hasSvgIcon && has48png && has96png && has192png && hasAppleTouch && hasShortcutIco;
  console.log(`[${pagePass ? 'PASS' : 'FAIL'}] ${page} Google Search icon <link> tags`);
  if (!pagePass) process.exit(1);
});

// 3. Verify Schema.org Organization / Hospital logo for Google Search Rich Results
const indexHtml = fs.readFileSync('index.html', 'utf8');
const hasSchemaLogo = indexHtml.includes('https://fimfortehospital.ng/assets/icons/fimforte-emblem-512.png') &&
                      indexHtml.includes('"width": 512') &&
                      indexHtml.includes('"height": 512');
console.log(`[${hasSchemaLogo ? 'PASS' : 'FAIL'}] index.html Schema.org 512x512 Logo ImageObject for Google Rich Results`);
if (!hasSchemaLogo) process.exit(1);

// 4. Verify site.webmanifest
const manifest = JSON.parse(fs.readFileSync('site.webmanifest', 'utf8'));
const hasManifestIcons = manifest.icons && manifest.icons.length >= 3;
console.log(`[${hasManifestIcons ? 'PASS' : 'FAIL'}] site.webmanifest multi-resolution icons: ${manifest.icons.length} registered`);
if (!hasManifestIcons) process.exit(1);

// 5. Verify robots.txt allows icon crawling
const robots = fs.readFileSync('robots.txt', 'utf8');
const allowsIcons = !robots.includes('Disallow: /assets/icons') && !robots.includes('Disallow: /favicon');
console.log(`[${allowsIcons ? 'PASS' : 'FAIL'}] robots.txt permits Googlebot icon crawling`);
if (!allowsIcons) process.exit(1);

console.log('ALL GOOGLE SEARCH FAVICON & LOGO CHECKS PASSED 100%!');
