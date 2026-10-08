# Motion & Animation Changelog — Fimforte Specialist Hospital

All changes implemented to integrate professional, Apple/Stripe-level animations, interactive stats counters, and a universal accessible floating scroll-to-top button.

---

## 1. `css/animations.css` (Created)
- **Motion Design Tokens**:
  - Defined standard durations: `--motion-dur-instant: 120ms`, `--motion-dur-fast: 240ms`, `--motion-dur-normal: 500ms`, `--motion-dur-slow: 750ms`, `--motion-dur-ambient: 14000ms`.
  - Defined cubic-bezier easings: `--motion-ease-out`, `--motion-ease-spring`, `--motion-ease-smooth`, `--motion-ease-in-out`.
  - Defined transform distance offsets: `--motion-offset-sm: 8px`, `--motion-offset-md: 24px`, `--motion-offset-lg: 38px`.
- **Hero Staggered Entrance**:
  - Scoped to `html.js` so content remains instantly visible if JavaScript is disabled.
  - Cascades badge pill (80ms), main headline (180ms), description (280ms), CTAs (380ms), doctor photo visual (200ms), and hero HMO checker widget (440ms).
  - Ambient breathing aura animation on `.hero-glow-blob` running GPU-composited transform and opacity cycles.
- **Scroll Reveals & Staggers**:
  - Implemented `.reveal-on-scroll` using GPU-accelerated `translate3d(0, 24px, 0)` and `opacity: 0` transitioning to `translate3d(0, 0, 0)` and `opacity: 1`.
  - Added `.reveal-stagger` for grids (`.specialties-grid`, `.doctors-grid`, `.reviews-grid`, `.hmo-cards-grid`) cascading cards with micro-staggers (40ms–390ms).
- **Tactile Micro-Interactions**:
  - Card hover gentle elevations (`translate3d(0, -5px, 0)` with softened shadow bloom under `@media (hover: hover)`).
  - Button active press tactile feedback (`transform: scale(0.97)` on active click/tap).
  - Button arrow icon rightward shift on hover.
  - Smart navbar show/hide transitions (`.site-header.nav-hidden`, `.site-header.nav-visible`).
- **Floating Scroll-To-Top Button Component**:
  - Fixed position at bottom right with safe area padding: `bottom: max(24px, env(safe-area-inset-bottom, 24px)); right: max(24px, env(safe-area-inset-right, 24px));`.
  - Circular SVG progress track and dynamic progress bar (`#scrollProgressBar`) reflecting page scroll percentage.
  - Inline SVG minimalist upward arrow.
  - Responsive dimensions: 48x48px on desktop, 44x44px on mobile screens.
  - Hidden state with `visibility: hidden; pointer-events: none; opacity: 0; transform: translate3d(0, 16px, 0) scale(0.85);`.
  - Visible active state (`.is-active`).
- **Accessibility & Reduced Motion**:
  - Full `@media (prefers-reduced-motion: reduce)` overrides disabling all transitions and animations, ensuring immediate display and zero layout movement.

---

## 2. `js/animations.js` (Created)
- **Early JS Initialization**:
  - Sets `document.documentElement.classList.add('js')` immediately to avoid any flash of unstyled content (FOUC).
- **Floating Scroll-To-Top Controller**:
  - Dynamically injects or activates `#scrollToTopBtn`.
  - Calculates page scroll progress: `progress = scrollY / (docHeight - winHeight)` and updates SVG stroke-dashoffset via requestAnimationFrame.
  - Displays button when `window.scrollY > 350px`; hides and sets `tabIndex = -1` and `aria-hidden="true"` when near the top.
  - Smoothly scrolls to top on click (instantly if reduced motion is preferred).
- **IntersectionObserver Scroll Reveals**:
  - Observes section headers, grids, cards, and banners.
  - Triggers `.is-visible` once with 12% viewport threshold (`observer.unobserve`).
- **Animated Statistics Number Counters**:
  - Observes `.metric-value` elements.
  - Parses numbers (e.g., `99%`, `15+`, `5,000+`, `24/7`, `0 NGN`) and smoothly animates from 0 to target number using an exponential ease-out curve over 1600ms.
- **Smart Sticky Header Controller**:
  - Tracks scroll direction: hides header on rapid scroll down (`> 12px` delta) once past 200px, instantly reveals on scroll up (`< -8px` delta).
  - Skips hiding if mobile navigation drawer is open.

---

## 3. `css/style.css` (Updated)
- **Fixed HMO Card Mobile Clipping (QA Issue from Screenshot)**:
  - Added `flex-wrap: wrap;` to `.hmo-card-top` and `.hmo-card-actions`.
  - Added `@media (max-width: 480px)` stacking rules:
    - Card padding reduced to `16px 14px`.
    - `.hmo-card-top` stacks into column with `align-items: flex-start;` and `white-space: normal;` on badge, preventing badge truncation.
    - `.hmo-card-actions` stacks into vertical column with full-width action buttons (`.btn-hmo-book`, `.btn-hmo-whatsapp`) meeting 44px touch target minimums.
    - Completely eliminates the "Desk Verify" button clipping off the right edge of the card.

---

## 4. `index.html` (Updated)
- Added `<link rel="stylesheet" href="css/animations.css">` and inline `<script>document.documentElement.classList.add('js');</script>` in `<head>`.
- Linked `<script src="js/animations.js" defer></script>` before closing `</body>`.

---

## 5. `submit-testimonial.html` (Updated)
- Added `<link rel="stylesheet" href="css/animations.css">` and inline `<script>document.documentElement.classList.add('js');</script>` in `<head>`.
- Linked `<script src="js/animations.js" defer></script>` before closing `</body>` to enable universal scroll-to-top button.

---

## 6. `404.html` (Updated)
- Added `<link rel="stylesheet" href="css/animations.css">` and inline `<script>document.documentElement.classList.add('js');</script>` in `<head>`.
- Linked `<script src="js/animations.js" defer></script>` before closing `</body>` to enable universal scroll-to-top button.
