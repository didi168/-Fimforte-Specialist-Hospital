/**
 * FIMFORTE SPECIALIST HOSPITAL — MASTER MOTION SCRIPT
 * Native, Hardware-Accelerated Animation Controller
 * - Safe early .js class toggle
 * - Universal Floating Scroll-to-Top Button with circular progress indicator
 * - IntersectionObserver Scroll Reveals (zero layout shift)
 * - Animated Statistics Number Counters (RAF eased)
 * - Smart Hide/Show Sticky Navbar on scroll direction
 * - Smooth anchor offset scrolling
 */

(function () {
  'use strict';

  // 1. Mark document as JS-enabled immediately (prevents FOUC & preserves no-JS accessibility)
  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initScrollToTop();
    initScrollReveals();
    initNumberCounters();
    initSmartHeader();
  });

  /* ==========================================================================
     1.5. LUXURY 3-SECOND CLINICAL PRELOADER CONTROLLER
     ========================================================================== */
  function initPreloader() {
    let preloader = document.getElementById('pagePreloader');

    // Create preloader dynamically if not in static HTML
    if (!preloader) {
      preloader = document.createElement('div');
      preloader.id = 'pagePreloader';
      preloader.className = 'page-preloader';
      preloader.setAttribute('aria-live', 'polite');
      preloader.setAttribute('aria-busy', 'true');
      preloader.innerHTML = `
        <div class="preloader-content">
          <div class="preloader-brand-logo">
            <img src="assets/icons/fimforte-logo.svg" alt="Fimforte Specialist Hospital Ltd" class="preloader-logo-img">
          </div>
          <div class="preloader-status-text" id="preloaderStatus">Initializing Clinical Portal...</div>
          <div class="preloader-bar-track">
            <div class="preloader-bar-fill" id="preloaderBar"></div>
          </div>
          <div class="preloader-meta">
            <span class="preloader-percent" id="preloaderPercent">0%</span>
            <span class="preloader-caption">24/7 Specialist Hospital • Port Harcourt</span>
          </div>
        </div>
      `;
      document.body.prepend(preloader);
    }

    // Lock body scroll while loader is active
    document.body.style.overflow = 'hidden';

    const bar = preloader.querySelector('#preloaderBar');
    const percent = preloader.querySelector('#preloaderPercent');
    const status = preloader.querySelector('#preloaderStatus');

    const TOTAL_DURATION = 3000; // Exact 3 seconds
    const startTime = performance.now();

    function updatePreloader(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);
      const currentPercent = Math.round(progress * 100);

      if (bar) bar.style.width = `${currentPercent}%`;
      if (percent) percent.textContent = `${currentPercent}%`;

      // Status text message milestones
      if (status) {
        if (elapsed < 1100) {
          status.textContent = 'Initializing Clinical Portal...';
        } else if (elapsed < 2200) {
          status.textContent = 'Connecting 24/7 Triage & Accredited HMOs...';
        } else {
          status.textContent = 'Welcome to Fimforte Specialist Hospital';
        }
      }

      if (progress < 1) {
        requestAnimationFrame(updatePreloader);
      } else {
        // Complete! Fade out smoothly
        setTimeout(() => {
          preloader.classList.add('fade-out');
          preloader.setAttribute('aria-busy', 'false');
          document.body.style.overflow = '';
        }, 150);
      }
    }

    requestAnimationFrame(updatePreloader);

    // Page-to-Page Navigation Interceptor:
    // When clicking any link navigating to another page on the website, show preloader
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore pure hash anchors (#hero, #specialties, etc.), tel:, mailto:, javascript:, or external targets
      if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || 
          href.startsWith('https://wa.me') || anchor.target === '_blank') {
        return;
      }

      // If it points to an internal page (e.g. index.html, submit-testimonial.html, 404.html)
      if (href.endsWith('.html') || href === '/' || href.startsWith('/') || href.startsWith('index.html')) {
        e.preventDefault();
        preloader.classList.remove('fade-out');
        preloader.classList.add('navigating');
        if (bar) bar.style.width = '20%';
        if (percent) percent.textContent = '20%';
        if (status) status.textContent = 'Loading Destination Page...';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
          window.location.href = href;
        }, 220);
      }
    });
  }

  /* ==========================================================================
     2. UNIVERSAL FLOATING SCROLL-TO-TOP BUTTON
     ========================================================================== */

  function initScrollToTop() {
    let btn = document.getElementById('scrollToTopBtn');

    // Create the button dynamically if not explicitly present in HTML
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'scrollToTopBtn';
      btn.className = 'scroll-to-top-btn';
      btn.setAttribute('aria-label', 'Scroll back to top of page');
      btn.setAttribute('aria-hidden', 'true');
      btn.tabIndex = -1;

      // Inline SVG Progress Circle + Minimalist Arrow
      btn.innerHTML = `
        <svg class="scroll-progress-svg" viewBox="0 0 48 48" aria-hidden="true">
          <circle class="scroll-progress-track" cx="24" cy="24" r="21"></circle>
          <circle class="scroll-progress-bar" id="scrollProgressBar" cx="24" cy="24" r="21"></circle>
        </svg>
        <svg class="scroll-top-arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      `;

      document.body.appendChild(btn);
    }

    const progressBar = btn.querySelector('#scrollProgressBar');
    const radius = 21;
    const circumference = 2 * Math.PI * radius;

    if (progressBar) {
      progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
      progressBar.style.strokeDashoffset = `${circumference}`;
    }

    let isVisible = false;
    let ticking = false;

    function updateScrollState() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

      // Update circular stroke progress
      if (progressBar) {
        const offset = circumference - progress * circumference;
        progressBar.style.strokeDashoffset = `${offset}`;
      }

      // Show/Hide threshold (~350px)
      if (scrollY > 350) {
        if (!isVisible) {
          btn.classList.add('is-active');
          btn.setAttribute('aria-hidden', 'false');
          btn.tabIndex = 0;
          isVisible = true;
        }
      } else {
        if (isVisible) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-hidden', 'true');
          btn.tabIndex = -1;
          isVisible = false;
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    }, { passive: true });

    // Smooth scroll back to top
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      btn.blur();
    });

    // Initial check on page load
    updateScrollState();
  }

  /* ==========================================================================
     3. INTERSECTION OBSERVER SCROLL REVEALS
     ========================================================================== */
  function initScrollReveals() {
    if (prefersReducedMotion) return;

    // Target static section containers, headers, and card grids (Dynamic grids like HMO & Reviews are kept always visible)
    const revealTargets = document.querySelectorAll(
      '.section-header, .specialties-grid, .doctors-grid, .about-grid, ' +
      '.faq-grid, .booking-banner-card, .metrics-dark-card, .submission-form-card, .error-card'
    );

    if (!('IntersectionObserver' in window)) {
      revealTargets.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '100px 0px 40px 0px',
      threshold: 0.02
    });

    revealTargets.forEach(el => {
      el.classList.add('reveal-on-scroll');
      if (el.classList.contains('specialties-grid') || 
          el.classList.contains('doctors-grid')) {
        el.classList.add('reveal-stagger');
      }
      observer.observe(el);
    });
  }

  /* ==========================================================================
     4. ANIMATED STATISTICS NUMBER COUNTERS
     ========================================================================== */
  function initNumberCounters() {
    const metricElements = document.querySelectorAll('.metric-value');
    if (!metricElements.length || prefersReducedMotion) return;

    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    metricElements.forEach(el => {
      const originalText = el.textContent.trim();
      // Store original formatting
      el.setAttribute('data-original-val', originalText);
      counterObserver.observe(el);
    });

    function animateCounter(el) {
      const original = el.getAttribute('data-original-val') || el.textContent.trim();
      // Parse numeric portion and prefix/suffix
      // Examples: "99%", "15+", "5,000+", "24/7", "0 NGN"
      const match = original.match(/([\d,.]+)/);
      if (!match) return;

      const numStr = match[1].replace(/,/g, '');
      const targetNum = parseFloat(numStr);
      if (isNaN(targetNum)) return;

      const prefix = original.substring(0, match.index);
      const suffix = original.substring(match.index + match[1].length);
      const isInteger = !numStr.includes('.');
      const hasComma = match[1].includes(',');

      const duration = 1600; // ms
      const startTime = performance.now();

      el.classList.add('counting');

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out expo curve: 1 - Math.pow(2, -10 * progress)
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = targetNum * easeProgress;

        let formattedVal;
        if (isInteger) {
          const rounded = Math.round(currentVal);
          formattedVal = hasComma ? rounded.toLocaleString() : rounded.toString();
        } else {
          formattedVal = currentVal.toFixed(1);
        }

        el.textContent = `${prefix}${formattedVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = original;
          el.classList.remove('counting');
        }
      }

      requestAnimationFrame(updateNumber);
    }
  }

  /* ==========================================================================
     5. SMART STICKY HEADER (Hide on Scroll Down, Reveal on Scroll Up)
     ========================================================================== */
  function initSmartHeader() {
    const header = document.getElementById('siteHeader');
    const navMenu = document.getElementById('navMenu');
    if (!header) return;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    function handleScrollDirection() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollDiff = currentScrollY - lastScrollY;

      // Don't hide if mobile nav drawer is open
      const isDrawerOpen = navMenu && navMenu.classList.contains('open');

      if (!isDrawerOpen && currentScrollY > 200) {
        if (scrollDiff > 12 && !header.classList.contains('nav-hidden')) {
          // Scrolling down rapidly -> hide header
          header.classList.add('nav-hidden');
          header.classList.remove('nav-visible');
        } else if (scrollDiff < -8 && header.classList.contains('nav-hidden')) {
          // Scrolling up -> show header
          header.classList.remove('nav-hidden');
          header.classList.add('nav-visible');
        }
      } else {
        // At or near top -> always visible
        header.classList.remove('nav-hidden');
        header.classList.add('nav-visible');
      }

      lastScrollY = Math.max(currentScrollY, 0);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScrollDirection);
        ticking = true;
      }
    }, { passive: true });
  }

})();
