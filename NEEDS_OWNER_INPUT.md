# Needs Owner Input & Decision Registry (SEO & GEO)
**Project:** Fimforte Specialist Hospital Ltd  
**Status:** All Items Resolved & Confirmed (Production-Ready)  
**Last Updated:** October 2026  

---

## 1. Domain & DNS Configuration
- **Production URL:** `https://fimfortehospital.ng/`
- **Status:** **CONFIRMED & FINALIZED**
- **Resolution:**
  - Canonical URLs (`https://fimfortehospital.ng/` and `https://fimfortehospital.ng/submit-testimonial.html`) are active.
  - Open Graph and Twitter Card image URLs resolve to absolute `https://fimfortehospital.ng/assets/images/og-preview.jpg`.
  - `sitemap.xml` and `robots.txt` are aligned with `https://fimfortehospital.ng/`.

---

## 2. Google Search Console & Webmaster Tools
- **Ownership Verification:**
- **Status:** **COMPLETED BY OWNER**
- **Resolution:** Ownership confirmed on Google Search Console. The `sitemap.xml` has been submitted for direct discovery and indexing of all pages, images, and clinical metadata.

---

## 3. Social Media & Online Profiles (`sameAs` Entity Resolution)
- **Status:** **RESOLVED**
- **Resolution:**
  - Confirmed no active social media accounts (Facebook/Instagram/LinkedIn) at this time.
  - Schema.org `sameAs` array strictly contains the official verified WhatsApp 24/7 emergency triage link (`https://wa.me/2347016357096`).
  - No dummy or broken external social links exist anywhere in the code or footer.

---

## 4. Google Maps & Geographic Coordinates
- **Coordinates:** `Latitude: 4.8465`, `Longitude: 6.9745`
- **Physical Address:** Number 1 Bloombreed School Road, Opposite NTA, Mgbuoba, Port Harcourt 500272, Rivers State, Nigeria.
- **Status:** **CONFIRMED ACCURATE**
- **Resolution:** Coordinates are embedded in `Hospital` schema.org JSON-LD and direct Google Maps navigation links.

---

## 5. Doctor Professional Qualifications (E-E-A-T Signals)
- **Status:** **SKIPPED PER OWNER INSTRUCTION**
- **Resolution:** Standard consultant profiles for Dr. Fimber Chukwuka (Obstetrician & Gynaecologist) and departments are maintained in the schema and factual AI context (`llms.txt` / `llms-full.txt`) without requiring external folio registry codes.

---

## 6. Motion & Animation Customization (Owner Preferences)
- **Status:** **IMPLEMENTED & CONFIGURED**
- **Key Settings Available for Tuning:**
  1. **Floating Scroll-To-Top Button:**
     - *Current Default:* 48x48px circle bottom-right with brand Navy (`#0B2238`) background, white arrow, and teal progress indicator ring showing exact scroll percentage. Appears after scrolling 350px.
     - *Owner Options:* If you wish to adjust the appearance threshold (e.g. 200px vs 500px) or disable the circular progress ring, it can be adjusted in `js/animations.js`.
  2. **Smart Sticky Navigation (Hide on Scroll Down, Reveal on Scroll Up):**
     - *Current Default:* Active on desktop & mobile. Hides smoothly on fast downward scroll to maximize screen real estate for clinical reading, and reappears instantly when scrolling up.
     - *Owner Options:* Can be switched to permanent sticky without hiding if preferred.
  3. **HMO Mobile Card Action Stacking (Bug Fixed):**
     - *Current Default:* Below 480px, action buttons stack vertically (`width: 100%`) with 44px touch targets. "Desk Verify" is 100% visible with zero clipping.

