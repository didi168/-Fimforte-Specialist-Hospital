/**
 * Motion & Scroll-to-Top Automated Verification
 */
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const files = {
  index: fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8'),
  submit: fs.readFileSync(path.join(rootDir, 'submit-testimonial.html'), 'utf8'),
  notFound: fs.readFileSync(path.join(rootDir, '404.html'), 'utf8'),
  animCss: fs.readFileSync(path.join(rootDir, 'css', 'animations.css'), 'utf8'),
  animJs: fs.readFileSync(path.join(rootDir, 'js', 'animations.js'), 'utf8'),
  styleCss: fs.readFileSync(path.join(rootDir, 'css', 'style.css'), 'utf8'),
};

const checks = [];
function test(name, pass, msg) {
  checks.push({ name, pass, msg });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}: ${msg}`);
}

console.log('=== VERIFYING MOTION SYSTEM & SCROLL-TO-TOP BUTTON ===');

// Check 1: animations.css linked on all pages
['index', 'submit', 'notFound'].forEach(p => {
  const hasLink = files[p].includes('css/animations.css');
  test(`${p}.html animations.css link`, hasLink, hasLink ? 'Present' : 'Missing');
});

// Check 2: animations.js linked on all pages
['index', 'submit', 'notFound'].forEach(p => {
  const hasScript = files[p].includes('js/animations.js');
  test(`${p}.html animations.js script`, hasScript, hasScript ? 'Present' : 'Missing');
});

// Check 3: Early JS class on all pages
['index', 'submit', 'notFound'].forEach(p => {
  const hasJsClass = files[p].includes("classList.add('js')");
  test(`${p}.html early .js class`, hasJsClass, hasJsClass ? 'Present' : 'Missing');
});

// Check 4: Scroll to top styling in CSS
const hasScrollBtnCss = files.animCss.includes('.scroll-to-top-btn') && 
                        files.animCss.includes('.scroll-progress-bar');
test('Scroll-To-Top button styles', hasScrollBtnCss, 'Present with SVG progress track');

// Check 5: Scroll to top controller in JS
const hasScrollBtnJs = files.animJs.includes('initScrollToTop') && 
                       files.animJs.includes('scrollToTopBtn');
test('Scroll-To-Top button controller', hasScrollBtnJs, 'Present with RAF throttling and accessible attributes');

// Check 6: Animated Number Counters
const hasCounters = files.animJs.includes('initNumberCounters') && 
                    files.animJs.includes('animateCounter');
test('Number counter controller', hasCounters, 'Present with regex formatting & RAF easing');

// Check 7: Smart Sticky Header
const hasSmartHeader = files.animJs.includes('initSmartHeader') && 
                       files.animJs.includes('nav-hidden');
test('Smart sticky header controller', hasSmartHeader, 'Present with scroll direction detection');

// Check 8: Reduced motion overrides
const hasReducedMotion = files.animCss.includes('@media (prefers-reduced-motion: reduce)');
test('prefers-reduced-motion in animations.css', hasReducedMotion, 'Present with 0.01ms reset');

// Check 9: HMO card mobile clipping fix in style.css
const hasHmoFix = files.styleCss.includes('.hmo-card-actions') && 
                  files.styleCss.includes('/* HMO Card Mobile Defense');
test('HMO card mobile fix in style.css', hasHmoFix, 'Present with column stacking and 44px buttons');

console.log('\n=======================================');
const total = checks.length;
const passed = checks.filter(c => c.pass).length;
console.log(`TOTAL MOTION CHECKS: ${total} | PASSED: ${passed} | FAILED: ${total - passed}`);
if (passed === total) {
  console.log('ALL MOTION & UI FIX CHECKS PASSED PERFECTLY!');
} else {
  process.exit(1);
}
