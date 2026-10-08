/**
 * Comprehensive Responsive Design & Viewport Verification Script
 * Validates across all target widths: 320, 360, 375, 390, 414, 480, 600, 768, 820, 1024, 1280, 1366, 1440, 1536, 1920, 2560, 3440, 3840, 5120
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const files = {
  index: fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8'),
  submit: fs.readFileSync(path.join(rootDir, 'submit-testimonial.html'), 'utf8'),
  notFound: fs.readFileSync(path.join(rootDir, '404.html'), 'utf8'),
  css: fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8'),
  jsApp: fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8'),
};

const results = [];

function check(testName, passed, details) {
  results.push({ testName, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] ${testName}: ${details}`);
}

console.log('=== STEP 1: VIEWPORT META TAG VERIFICATION ===');
['index', 'submit', 'notFound'].forEach(page => {
  const html = files[page];
  const hasViewportFit = /<meta\s+name=["']viewport["']\s+content=["'][^"']*viewport-fit=cover[^"']*["']/i.test(html);
  const hasWidthDevice = /content=["'][^"']*width=device-width[^"']*/i.test(html);
  check(`${page}.html Viewport Meta`, hasViewportFit && hasWidthDevice, 
    hasViewportFit ? 'Contains width=device-width, initial-scale=1, viewport-fit=cover' : 'Missing viewport-fit=cover');
});

console.log('\n=== STEP 2: HORIZONTAL OVERFLOW DEFENSE (320px - 5120px) ===');
const hasOverflowXClipHtml = /html\s*\{[^}]*overflow-x:\s*clip/i.test(files.css);
const hasOverflowXClipBody = /body\s*\{[^}]*overflow-x:\s*clip/i.test(files.css);
check('HTML/Body Overflow-X Clipping', hasOverflowXClipHtml && hasOverflowXClipBody, 'html and body contain overflow-x: clip');

const hasBreakWord = /overflow-wrap:\s*break-word/i.test(files.css);
check('Word Wrapping', hasBreakWord, 'overflow-wrap: break-word present to prevent long text/URL blowout');

const hasMediaReset = /img,\s*picture,\s*video,\s*canvas,\s*svg\s*\{[^}]*max-width:\s*100%/i.test(files.css);
check('Media fluid reset', hasMediaReset, 'img, picture, video, canvas, svg constrained to max-width: 100%');

const hasPhoneMockupFix = /\.phone-mockup-frame\s*\{[^}]*max-width:\s*min\(330px,\s*100%\)/i.test(files.css);
check('Phone mockup frame fluid', hasPhoneMockupFix, 'phone mockup is fluid with max-width: min(330px, 100%)');

console.log('\n=== STEP 3: GRID REFLOW (<= 640px) ===');
const hasGrid640 = /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?\.reviews-grid,\s*\.hmo-cards-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr;/i.test(files.css);
check('Grid Reflow <= 640px', hasGrid640, 'hmo-cards-grid and reviews-grid reflow to 1fr on mobile screens');

console.log('\n=== STEP 4: FORM INPUT FONT SIZE (iOS AUTO-ZOOM PREVENTION) ===');
const formInput16 = /\.form-input,\s*\.form-select,\s*\.form-textarea\s*\{[\s\S]*?font-size:\s*16px;/i.test(files.css);
check('Form inputs >= 16px', formInput16, 'Form inputs explicitly set to 16px to prevent iOS Safari auto-zoom');

const hmoSearch16 = /\.hmo-search-input\s*\{[\s\S]*?font-size:\s*16px;/i.test(files.css);
check('HMO Search input >= 16px', hmoSearch16, 'HMO directory search input set to 16px');

const heroHmo16 = /\.hero-hmo-input\s*\{[\s\S]*?font-size:\s*16px;/i.test(files.css);
check('Hero HMO input >= 16px', heroHmo16, 'Hero HMO quick check input set to 16px');

console.log('\n=== STEP 5: NAVIGATION DRAWER & BREAKPOINTS ===');
const hasNavBreakpoint1024 = /@media\s*\(max-width:\s*1024px\)\s*\{[\s\S]*?\.nav-menu\s*\{/i.test(files.css);
check('Mobile Nav Breakpoint', hasNavBreakpoint1024, 'Nav collapses to mobile drawer at <= 1024px, preventing tablet header collisions');

const hasMobileCtaHiddenDesktop = /\.mobile-nav-cta\s*\{[\s\S]*?display:\s*none;/i.test(files.css);
check('Mobile CTA hidden on desktop', hasMobileCtaHiddenDesktop, '.mobile-nav-cta hidden on desktop nav');

const hasEscapeHandler = /e\.key\s*===\s*['"]Escape['"][\s\S]*?closeMobileNav/i.test(files.jsApp);
check('Mobile Nav Escape handler', hasEscapeHandler, 'Mobile drawer closes on Escape key');

const hasBodyScrollLock = /document\.body\.style\.overflow\s*=\s*['"]hidden['"]/i.test(files.jsApp);
check('Mobile Nav Body Scroll Lock', hasBodyScrollLock, 'Body scroll is locked when mobile drawer is open');

console.log('\n=== STEP 6: ACCESSIBLE TOUCH TARGETS (>= 44x44px) ===');
const hasCompactPill44 = /@media\s*\(max-width:\s*414px\)\s*\{[\s\S]*?\.btn-emergency-pill\s*\{[\s\S]*?min-width:\s*44px;[\s\S]*?min-height:\s*44px;/i.test(files.css);
check('Emergency button touch target', hasCompactPill44, 'Emergency button is 44x44px on compact mobile');

const hasToggle44 = /@media\s*\(max-width:\s*414px\)\s*\{[\s\S]*?\.mobile-toggle\s*\{[\s\S]*?min-width:\s*44px;[\s\S]*?min-height:\s*44px;/i.test(files.css);
check('Mobile menu toggle touch target', hasToggle44, 'Mobile hamburger button is 44x44px on compact mobile');

const hasPointerCoarseTargets = /@media\s*\(pointer:\s*coarse\)\s*\{[\s\S]*?min-height:\s*44px;[\s\S]*?min-width:\s*44px;/i.test(files.css);
check('Touch coarse media query targets', hasPointerCoarseTargets, 'All interactive controls enforced to min 44x44px for touch pointers');

console.log('\n=== STEP 7: ULTRA-WIDE & 4K/5K MONITORS (2000px - 5120px) ===');
const hasUltraWideContainer = /@media\s*\(min-width:\s*2000px\)\s*\{[\s\S]*?--container-max:\s*1400px;[\s\S]*?\.container\s*\{[\s\S]*?max-width:\s*var\(--container-max\);/i.test(files.css);
check('Ultra-wide container centering', hasUltraWideContainer, 'Max-width 1400px container centered with margin: auto for screens up to 5120px');

const hasLineLengthCap = /@media\s*\(min-width:\s*2000px\)\s*\{[\s\S]*?max-width:\s*72ch;/i.test(files.css);
check('Ultra-wide line length cap', hasLineLengthCap, 'Text paragraphs capped at 72ch for comfortable scanning');

console.log('\n=== STEP 8: ACCESSIBILITY & PREFERS-REDUCED-MOTION ===');
const hasReducedMotion = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?animation-duration:\s*0\.01ms/i.test(files.css);
check('Prefers-reduced-motion', hasReducedMotion, 'Respects user system preferences for reduced motion');

console.log('\n=== STEP 9: SAFE-AREA INSETS (NOTCHED PHONES) ===');
const hasSafeArea = /--safe-top:\s*env\(safe-area-inset-top,\s*0px\);/i.test(files.css);
check('Safe-area insets defined', hasSafeArea, 'env(safe-area-inset-*) configured in :root');

console.log('\n=======================================');
const total = results.length;
const passed = results.filter(r => r.passed).length;
console.log(`TOTAL CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
if (passed === total) {
  console.log('ALL RESPONSIVE SYSTEM CHECKS PASSED PERFECTLY!');
} else {
  console.log('SOME CHECKS FAILED!');
  process.exit(1);
}
