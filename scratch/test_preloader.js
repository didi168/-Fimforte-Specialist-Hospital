/**
 * Test 3-Second Preloader Screen Implementation
 */
const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const submitHtml = fs.readFileSync('submit-testimonial.html', 'utf8');
const notFoundHtml = fs.readFileSync('404.html', 'utf8');
const animCss = fs.readFileSync('css/animations.css', 'utf8');
const animJs = fs.readFileSync('js/animations.js', 'utf8');

console.log('=== VERIFYING 3-SECOND CLINICAL PRELOADER SCREEN ===');

// Check 1: HTML markup in all 3 pages
['index.html', 'submit-testimonial.html', '404.html'].forEach(page => {
  const html = fs.readFileSync(page, 'utf8');
  const preloaderStart = html.indexOf('id="pagePreloader"');
  const preloaderBlock = html.substring(preloaderStart, preloaderStart + 1200);

  const hasPreloader = preloaderStart !== -1 && 
                       preloaderBlock.includes('class="page-preloader"') &&
                       preloaderBlock.includes('preloader-logo-img') &&
                       preloaderBlock.includes('preloader-bar-fill');
  const hasNoPulse = !preloaderBlock.includes('preloader-pulse-visual') && 
                     !preloaderBlock.includes('fa-heart') &&
                     !preloaderBlock.includes('pulse-svg');
  console.log(`[${hasPreloader ? 'PASS' : 'FAIL'}] ${page} preloader HTML markup: ${hasPreloader ? 'Present' : 'Missing'}`);
  console.log(`[${hasNoPulse ? 'PASS' : 'FAIL'}] ${page} heartbeat & pulse removed: ${hasNoPulse ? 'Confirmed' : 'Still present'}`);
  if (!hasPreloader || !hasNoPulse) process.exit(1);
});

// Check 2: CSS rules for preloader
const hasPreloaderCss = animCss.includes('.page-preloader') &&
                        animCss.includes('.preloader-logo-img') &&
                        animCss.includes('clamp(290px, 84vw, 920px)') &&
                        animCss.includes('.preloader-bar-fill');
console.log(`[${hasPreloaderCss ? 'PASS' : 'FAIL'}] CSS preloader styling & big responsive logo: ${hasPreloaderCss ? 'Present' : 'Missing'}`);
if (!hasPreloaderCss) process.exit(1);

// Check 3: JavaScript 3000ms timer and navigation interceptor
const has3000ms = animJs.includes('TOTAL_DURATION = 3000');
const hasNavInterceptor = animJs.includes("preloader.classList.add('navigating')");
console.log(`[${has3000ms ? 'PASS' : 'FAIL'}] JS 3000ms (3 seconds) exact timer: ${has3000ms ? 'Confirmed' : 'Missing'}`);
console.log(`[${hasNavInterceptor ? 'PASS' : 'FAIL'}] JS Page-to-Page Navigation Interceptor: ${hasNavInterceptor ? 'Confirmed' : 'Missing'}`);
if (!has3000ms || !hasNavInterceptor) process.exit(1);

// Check 4: HMO cards grid is guaranteed visible
const hasHmoVisible = animCss.includes('.hmo-cards-grid') && 
                      animCss.includes('opacity: 1 !important');
console.log(`[${hasHmoVisible ? 'PASS' : 'FAIL'}] HMO cards grid guaranteed visible (Zero scroll-block): ${hasHmoVisible ? 'Confirmed' : 'Missing'}`);
if (!hasHmoVisible) process.exit(1);

console.log('ALL PRELOADER & HMO SECTION CHECKS PASSED 100%!');
