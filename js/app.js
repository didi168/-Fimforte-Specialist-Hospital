/**
 * FIMFORTE SPECIALIST HOSPITAL — PRODUCTION SCRIPTS (AUDITED & EXTENDED)
 * Includes:
 * 1. Mobile Navigation & Sticky Header
 * 2. Appointment Booking Modal & Focus Management
 * 3. Quick Booking Search on Hero
 * 4. Interactive HMO Coverage Checker Console (Zero-Latency Client-Side)
 * 5. Dynamic Testimonials (Text, Photo & Video Lightbox Modal)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Key DOM Elements
  const header = document.getElementById('siteHeader');
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  
  const modal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const appointmentForm = document.getElementById('appointmentForm');
  const specialtySelect = document.getElementById('modalSpecialtySelect');
  const insuranceSelect = document.getElementById('insuranceType');
  const toastNotice = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  const preferredDateInput = document.getElementById('preferredDate');

  let lastActiveElement = null;

  // 1. Minimum Date Setting (No Past Dates)
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.min = today;
    preferredDateInput.value = today;
  }

  // 2. Sticky Header Scroll Performance (Throttled via requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 25) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 3. Mobile Navigation Drawer Toggle, Body Scroll Lock, Focus & ARIA State
  function closeMobileNav() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }
  }

  function openMobileNav() {
    if (navMenu && mobileToggle) {
      navMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      mobileToggle.setAttribute('aria-expanded', 'true');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      }
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when clicking nav links or buttons inside the drawer
    navMenu.querySelectorAll('.nav-link, button').forEach(el => {
      el.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close mobile drawer when clicking outside the header
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close mobile drawer on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });

    // Auto-close drawer if screen is resized back to desktop (> 1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navMenu.classList.contains('open')) {
        closeMobileNav();
      }
    }, { passive: true });
  }

  // 4. Modal Open / Close Logic with Focus Management
  const openModalButtons = document.querySelectorAll('.open-booking-modal');
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lastActiveElement = btn;

      const specialty = btn.getAttribute('data-specialty');
      if (specialty && specialtySelect) {
        specialtySelect.value = specialty;
      }
      openModal();
    });
  });

  function openModal(preselectedInsurance = null) {
    if (modal) {
      if (preselectedInsurance && insuranceSelect) {
        // Try exact match or match containing provider name
        let matched = false;
        for (let i = 0; i < insuranceSelect.options.length; i++) {
          const opt = insuranceSelect.options[i];
          if (opt.value.toLowerCase().includes(preselectedInsurance.toLowerCase()) || 
              preselectedInsurance.toLowerCase().includes(opt.value.toLowerCase())) {
            insuranceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          insuranceSelect.value = 'Other HMO';
        }
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        const firstInput = modal.querySelector('input, select');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastActiveElement) {
        lastActiveElement.focus();
      }
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Backdrop click closes modal
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Keyboard accessibility: Escape key and Focus Trap
  document.addEventListener('keydown', (e) => {
    if (modal && modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length > 0) {
          const firstFocusable = focusable[0];
          const lastFocusable = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    }
  });

  // 5. Toast Notification System
  let toastTimer = null;
  function showToast(message) {
    if (toastNotice) {
      if (message && toastMsg) {
        toastMsg.textContent = message;
      }
      toastNotice.classList.add('show');
      
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toastNotice.classList.remove('show');
      }, 5500);
    }
  }

  // 6. Booking Channel Radio Listener (WhatsApp vs Email UI Sync)
  const channelRadios = document.querySelectorAll('input[name="bookingChannel"]');
  const channelWhatsappLabel = document.getElementById('channelWhatsappLabel');
  const channelEmailLabel = document.getElementById('channelEmailLabel');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitBtnIcon = document.getElementById('submitBtnIcon');

  if (channelRadios.length > 0) {
    channelRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'whatsapp') {
          channelWhatsappLabel?.classList.add('active');
          channelEmailLabel?.classList.remove('active');
          if (submitBtnText) submitBtnText.textContent = 'Confirm & Send via WhatsApp';
          if (submitBtnIcon) submitBtnIcon.className = 'fa-brands fa-whatsapp';
        } else {
          channelEmailLabel?.classList.add('active');
          channelWhatsappLabel?.classList.remove('active');
          if (submitBtnText) submitBtnText.textContent = 'Confirm & Send via Email';
          if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-paper-plane';
        }
      });
    });
  }

  // 7. Appointment Form Submission Handler (WhatsApp OR Email)
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName').value.trim();
      const patientPhone = document.getElementById('patientPhone').value.trim();
      const patientEmail = document.getElementById('patientEmail')?.value.trim();
      const chosenDept = document.getElementById('modalSpecialtySelect').value;
      const chosenDate = document.getElementById('preferredDate').value;
      const chosenInsurance = document.getElementById('insuranceType')?.value || 'Private Pay';
      const patientNotes = document.getElementById('notes')?.value.trim();
      const selectedChannel = document.querySelector('input[name="bookingChannel"]:checked')?.value || 'whatsapp';

      closeModal();
      appointmentForm.reset();

      if (preferredDateInput) {
        const today = new Date().toISOString().split('T')[0];
        preferredDateInput.value = today;
      }

      // Format appointment text exactly as requested
      const bookingSummaryText = 
        `Hello Fimforte, I would like to book an appointment.\n` +
        `Name: ${patientName}\n` +
        `Phone: ${patientPhone}\n` +
        (patientEmail ? `Email: ${patientEmail}\n` : '') +
        `Clinic: ${chosenDept}\n` +
        `Date: ${chosenDate}\n` +
        `Payment/HMO: ${chosenInsurance}` +
        (patientNotes ? `\nNotes: ${patientNotes}` : '');

      if (selectedChannel === 'whatsapp') {
        // Direct WhatsApp Booking to +234 701 635 7096
        const waUrl = `https://wa.me/2347016357096?text=${encodeURIComponent(bookingSummaryText)}`;
        window.open(waUrl, '_blank');
        showToast(`Appointment details prepared! Opening WhatsApp to send to the Fimforte duty triage desk.`);
      } else {
        // Hospital Email Booking to fimfortehospital@gmail.com
        const mailSubject = `Appointment Booking: ${patientName} (${chosenDept})`;
        
        // Zero-backend email forwarder via Web3Forms with graceful mailto fallback
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: '64e8e458-396a-493e-ba4c-83b6f00880bf', // Web3Forms direct forwarder
            to: 'fimfortehospital@gmail.com',
            from_name: 'Fimforte Web Patient Booking',
            subject: mailSubject,
            message: bookingSummaryText,
            patient_name: patientName,
            patient_phone: patientPhone,
            patient_email: patientEmail || 'None',
            department: chosenDept,
            appointment_date: chosenDate,
            insurance_hmo: chosenInsurance,
            notes: patientNotes || 'None'
          })
        }).catch(() => {
          // Fallback to mailto protocol if offline or API blocked
          const mailtoUrl = `mailto:fimfortehospital@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(bookingSummaryText)}`;
          window.location.href = mailtoUrl;
        });

        showToast(`Thank you, ${patientName}! Your booking was sent to fimfortehospital@gmail.com. Our triage desk will call ${patientPhone} to confirm.`);
      }
    });
  }

  // =========================================================================
  // 7b. MINI HERO HMO QUICK CHECKER CONSOLE
  // =========================================================================
  const heroHmoInput = document.getElementById('heroHmoInput');
  const heroHmoCheckBtn = document.getElementById('heroHmoCheckBtn');
  const heroHmoResult = document.getElementById('heroHmoResult');

  if (heroHmoInput && typeof HMO_DIRECTORY !== 'undefined') {
    function evaluateHeroHmo(query) {
      if (!query || query.length < 2) {
        if (heroHmoResult) {
          heroHmoResult.innerHTML = `
            <div class="hero-hmo-chip-row">
              <span class="hero-hmo-label">Popular:</span>
              <span class="hero-hmo-chip" data-hmo="Reliance HMO">Reliance</span>
              <span class="hero-hmo-chip" data-hmo="Hygeia HMO">Hygeia</span>
              <span class="hero-hmo-chip" data-hmo="Avon HMO">Avon</span>
              <span class="hero-hmo-chip" data-hmo="Leadway Health HMO">Leadway</span>
              <span class="hero-hmo-chip" data-hmo="RIVCHPP (Rivers State Contributory Health Protection Programme)">RIVCHPP</span>
              <span class="hero-hmo-chip" data-hmo="Bastion HMO">Bastion</span>
            </div>
          `;
          attachHeroChipListeners();
        }
        return;
      }

      const q = query.trim().toLowerCase();
      const match = HMO_DIRECTORY.find(item => 
        item.name.toLowerCase().includes(q) || 
        (item.keywords || []).some(k => k.toLowerCase().includes(q))
      );

      if (match) {
        const cleanName = match.name.split('(')[0].trim();
        const logoHtml = match.logo ? `
          <div class="hero-hmo-match-logo-wrap">
            <img src="${match.logo}" alt="" class="hero-hmo-match-logo" onerror="this.parentElement.style.display='none'">
          </div>
        ` : '';
        heroHmoResult.innerHTML = `
          <div class="hero-hmo-status-matched">
            <div class="hero-hmo-match-text" style="display: flex; align-items: center; gap: var(--space-2);">
              ${logoHtml}
              <div>
                <i class="fa-solid fa-circle-check"></i>
                <span><strong>${cleanName}</strong> is accepted!</span>
              </div>
            </div>
            <button type="button" class="btn-hero-hmo-book-mini" id="heroBookMatchedHmo" data-hmo="${match.name}">
              <span>Book Clinic</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        `;
        document.getElementById('heroBookMatchedHmo')?.addEventListener('click', () => {
          openModal(match.name);
        });
      } else {
        heroHmoResult.innerHTML = `
          <div class="hero-hmo-status-unmatched">
            <span>HMO not in quick preview.</span>
            <a href="#hmo-partners">Check All 22+ HMOs →</a>
          </div>
        `;
      }
    }

    function attachHeroChipListeners() {
      document.querySelectorAll('.hero-hmo-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const hmoName = chip.getAttribute('data-hmo');
          if (heroHmoInput) heroHmoInput.value = hmoName;
          evaluateHeroHmo(hmoName);
        });
      });
    }

    heroHmoInput.addEventListener('input', (e) => {
      evaluateHeroHmo(e.target.value);
    });

    if (heroHmoCheckBtn) {
      heroHmoCheckBtn.addEventListener('click', () => {
        const val = heroHmoInput.value.trim();
        if (val) {
          evaluateHeroHmo(val);
        } else {
          heroHmoInput.focus();
        }
      });
    }

    attachHeroChipListeners();
  }

  // =========================================================================
  // 8. INTERACTIVE HMO COVERAGE CHECKER CONSOLE
  // =========================================================================
  const hmoCardsContainer = document.getElementById('hmoCardsContainer');
  const hmoSearchInput = document.getElementById('hmoSearchInput');
  const hmoClearBtn = document.getElementById('hmoClearBtn');
  const hmoResultCount = document.getElementById('hmoResultCount');
  const hmoTabs = document.querySelectorAll('.hmo-tab-pill');

  let activeHmoCategory = 'all';
  let currentHmoQuery = '';

  if (typeof HMO_DIRECTORY !== 'undefined' && hmoCardsContainer) {
    function renderHmoCards() {
      const q = currentHmoQuery.trim().toLowerCase();
      
      const filtered = HMO_DIRECTORY.filter(item => {
        // Category check
        const matchesCategory = (activeHmoCategory === 'all') || (item.category === activeHmoCategory);
        if (!matchesCategory) return false;

        // Search query check
        if (!q) return true;
        const inName = item.name.toLowerCase().includes(q);
        const inTier = item.tier.toLowerCase().includes(q);
        const inCoverage = item.coverage.toLowerCase().includes(q);
        const inKeywords = (item.keywords || []).some(k => k.toLowerCase().includes(q));

        return inName || inTier || inCoverage || inKeywords;
      });

      // Update counter
      if (hmoResultCount) {
        if (filtered.length === HMO_DIRECTORY.length) {
          hmoResultCount.textContent = `Showing all ${filtered.length} accredited HMO & insurance partners`;
        } else if (filtered.length === 0) {
          hmoResultCount.innerHTML = `<span style="color: var(--brand-crimson-600); font-weight: 700;">No exact match found for "${currentHmoQuery}".</span> Verify with our desk below:`;
        } else {
          hmoResultCount.textContent = `Showing ${filtered.length} accredited partner${filtered.length === 1 ? '' : 's'}`;
        }
      }

      if (filtered.length === 0) {
        hmoCardsContainer.innerHTML = `
          <div style="grid-column: 1 / -1; background: #FFFFFF; border: 2px dashed #CBD5E1; border-radius: var(--radius-lg); padding: var(--space-8); text-align: center;">
            <i class="fa-solid fa-hospital-user" style="font-size: 2.4rem; color: var(--brand-teal-700); margin-bottom: var(--space-3);" aria-hidden="true"></i>
            <h4 style="font-size: var(--text-lg); color: var(--brand-navy-900); margin-bottom: var(--space-2);">HMO "${currentHmoQuery}" is not listed in quick-lookup</h4>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 520px; margin: 0 auto var(--space-5) auto;">
              We partner with 22+ accredited private HMOs, state schemes (RIVCHPP), and company retainerships. Our 24/7 NHIS desk can instantly verify your policy eligibility by phone or WhatsApp.
            </p>
            <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
              <a href="https://wa.me/2347016357096?text=Hello%20Fimforte%20Desk%2C%20is%20${encodeURIComponent(currentHmoQuery)}%20covered%20at%20your%20hospital%3F" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="btn btn-primary"
                 style="background: #25D366; border-color: #25D366;">
                <i class="fa-brands fa-whatsapp"></i> Inquire "${currentHmoQuery}" on WhatsApp
              </a>
              <button type="button" class="btn btn-secondary" id="resetHmoSearchBtn">
                View All Partners
              </button>
            </div>
          </div>
        `;

        const resetBtn = document.getElementById('resetHmoSearchBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            currentHmoQuery = '';
            if (hmoSearchInput) hmoSearchInput.value = '';
            if (hmoClearBtn) hmoClearBtn.style.display = 'none';
            renderHmoCards();
          });
        }
        return;
      }

      // Render cards
      hmoCardsContainer.innerHTML = filtered.map(hmo => {
        const badgeClass = hmo.badgeColor === 'emerald' ? 'hmo-badge-emerald' : 'hmo-badge-teal';
        const encodedMsg = encodeURIComponent(`Hello Fimforte Desk, I hold a ${hmo.name} (${hmo.tier}) plan and would like to confirm coverage for a clinic visit.`);
        const fallbackInitials = (hmo.shortCode || hmo.name || 'HM').slice(0, 2).toUpperCase();
        const logoHtml = hmo.logo ? `
          <div class="hmo-logo-avatar">
            <img src="${hmo.logo}" alt="${hmo.name} logo" class="hmo-logo-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <span class="hmo-fallback-initials" style="display: none;">${fallbackInitials}</span>
          </div>
        ` : `
          <div class="hmo-logo-avatar">
            <span class="hmo-fallback-initials">${fallbackInitials}</span>
          </div>
        `;

        return `
          <article class="hmo-card">
            <div class="hmo-card-top">
              <div class="hmo-card-header-left">
                ${logoHtml}
                <h3 class="hmo-card-name">${hmo.name}</h3>
              </div>
              <span class="hmo-card-badge ${badgeClass}">
                <i class="fa-solid fa-check"></i> ${hmo.badge}
              </span>
            </div>

            <div class="hmo-card-tier">
              <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
              <span>${hmo.tier}</span>
            </div>

            <div class="hmo-coverage-block">
              <span class="hmo-coverage-title">Covered Services:</span>
              ${hmo.coverage}
            </div>

            <p class="hmo-notes-text">
              <i class="fa-solid fa-circle-info" style="color: var(--brand-teal-700);"></i> ${hmo.notes}
            </p>

            <div class="hmo-card-actions">
              <button type="button" class="btn-hmo-book select-hmo-booking-btn" data-hmo="${hmo.name}">
                <i class="fa-regular fa-calendar-check" aria-hidden="true"></i>
                <span>Book with this HMO</span>
              </button>
              <a href="https://wa.me/2347016357096?text=${encodedMsg}" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="btn-hmo-whatsapp"
                 title="Verify with Front Desk">
                <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
                <span>Desk Verify</span>
              </a>
            </div>
          </article>
        `;
      }).join('');

      // Attach booking triggers to HMO cards
      hmoCardsContainer.querySelectorAll('.select-hmo-booking-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const hmoName = btn.getAttribute('data-hmo');
          openModal(hmoName);
        });
      });
    }

    // Initial Render
    renderHmoCards();

    // Search Input Listener
    if (hmoSearchInput) {
      hmoSearchInput.addEventListener('input', (e) => {
        currentHmoQuery = e.target.value;
        if (hmoClearBtn) {
          hmoClearBtn.style.display = currentHmoQuery ? 'flex' : 'none';
        }
        renderHmoCards();
      });
    }

    // Clear Button
    if (hmoClearBtn) {
      hmoClearBtn.addEventListener('click', () => {
        currentHmoQuery = '';
        if (hmoSearchInput) hmoSearchInput.value = '';
        hmoClearBtn.style.display = 'none';
        renderHmoCards();
        if (hmoSearchInput) hmoSearchInput.focus();
      });
    }

    // Category Tabs
    hmoTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        hmoTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        activeHmoCategory = tab.getAttribute('data-category');
        renderHmoCards();
      });
    });
  }

  // =========================================================================
  // 9. DYNAMIC TESTIMONIALS & VIDEO LIGHTBOX PLAYER
  // =========================================================================
  const testimonialsContainer = document.getElementById('testimonialsContainer');
  const testFilterTabs = document.querySelectorAll('.test-filter-tab');
  const videoModal = document.getElementById('videoLightboxModal');
  const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
  const lightboxVideoPlayer = document.getElementById('lightboxVideoPlayer');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalAuthor = document.getElementById('videoModalAuthor');

  let activeTestimonialFilter = 'all';

  async function renderTestimonials() {
    if (!testimonialsContainer) return;

    let allReviews = [];
    if (typeof fetchAllTestimonialsAsync === 'function') {
      allReviews = await fetchAllTestimonialsAsync();
    } else if (typeof getCombinedTestimonials === 'function') {
      allReviews = getCombinedTestimonials();
    }

    const filtered = allReviews.filter(rev => {
      if (activeTestimonialFilter === 'all') return true;
      if (activeTestimonialFilter === 'video') return rev.type === 'video';
      return rev.department === activeTestimonialFilter;
    });

    if (filtered.length === 0) {
      testimonialsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1px solid var(--border-card); border-radius: var(--radius-lg); padding: var(--space-8); text-align: center;">
          <p style="color: var(--text-secondary); margin-bottom: var(--space-4);">No reviews found in this department yet.</p>
          <a href="submit-testimonial.html" class="btn btn-primary">
            <i class="fa-solid fa-pen-to-square"></i> Be the first to share your experience
          </a>
        </div>
      `;
      return;
    }

    testimonialsContainer.innerHTML = filtered.map(rev => {
      const starsHtml = Array.from({ length: 5 }, (_, i) => 
        `<i class="fa-solid fa-star${i < rev.rating ? '' : '-half-stroke'}"></i>`
      ).join('');

      if (rev.type === 'video' && rev.videoUrl) {
        const thumb = rev.videoThumbnail || 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&auto=format&fit=crop&q=80';
        return `
          <article class="video-review-card" data-type="video" data-dept="${rev.department}">
            <div class="video-thumb-container play-video-trigger" 
                 data-video="${rev.videoUrl}"
                 data-author="${rev.author}"
                 data-title="${rev.department} Experience">
              <img src="${thumb}" alt="${rev.author} video testimony" class="video-thumb-img" loading="lazy">
              <div class="video-play-overlay">
                <div class="video-play-button-circle" aria-label="Play patient video story">
                  <i class="fa-solid fa-play"></i>
                </div>
              </div>
              <span class="video-duration-pill">${rev.videoDuration || 'Video'}</span>
            </div>
            <div class="video-content-body">
              <div class="review-stars" aria-label="${rev.rating} out of 5 stars">
                ${starsHtml}
              </div>
              <blockquote class="review-quote">
                "${rev.quote}"
              </blockquote>
              <div class="reviewer-meta">
                <img src="${rev.avatar}" alt="${rev.author}" class="reviewer-avatar" width="42" height="42" loading="lazy">
                <div class="reviewer-info">
                  <h5>${rev.author}</h5>
                  <p>${rev.location}</p>
                </div>
              </div>
            </div>
          </article>
        `;
      } else {
        const storyPhotoHtml = rev.storyPhoto ? `
          <div class="review-story-photo-wrap" style="margin-bottom: var(--space-4); border-radius: var(--radius-md); overflow: hidden; max-height: 220px; background: #0F172A;">
            <img src="${rev.storyPhoto}" alt="${rev.author} recovery story photo" style="width: 100%; height: 180px; object-fit: cover; display: block;" loading="lazy">
          </div>
        ` : '';

        return `
          <article class="review-card" data-type="${rev.storyPhoto ? 'photo' : 'text'}" data-dept="${rev.department}">
            <div>
              ${storyPhotoHtml}
              <div class="review-stars" aria-label="${rev.rating} out of 5 stars">
                ${starsHtml}
              </div>
              <blockquote class="review-quote">
                "${rev.quote}"
              </blockquote>
            </div>
            <div class="reviewer-meta">
              <img src="${rev.avatar}" alt="${rev.author}" class="reviewer-avatar" width="42" height="42" loading="lazy">
              <div class="reviewer-info">
                <h5>${rev.author}</h5>
                <p>${rev.location}</p>
              </div>
            </div>
          </article>
        `;
      }
    }).join('');

    // Reattach video trigger listeners
    attachVideoTriggers();
  }

  function attachVideoTriggers() {
    const videoTriggers = document.querySelectorAll('.play-video-trigger');
    videoTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const videoSrc = trigger.getAttribute('data-video');
        const author = trigger.getAttribute('data-author');
        const title = trigger.getAttribute('data-title');

        if (videoModal && lightboxVideoPlayer && videoSrc) {
          lightboxVideoPlayer.src = videoSrc;
          if (videoModalTitle) videoModalTitle.textContent = title || 'Patient Video Testimony';
          if (videoModalAuthor) videoModalAuthor.textContent = `${author} • Fimforte Specialist Hospital`;
          
          videoModal.classList.add('active');
          document.body.style.overflow = 'hidden';
          lightboxVideoPlayer.play().catch(() => {});
        }
      });
    });
  }

  function closeVideoLightbox() {
    if (videoModal) {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxVideoPlayer) {
        lightboxVideoPlayer.pause();
        lightboxVideoPlayer.src = '';
      }
    }
  }

  if (closeVideoModalBtn) {
    closeVideoModalBtn.addEventListener('click', closeVideoLightbox);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoLightbox();
      }
    });
  }

  // Keyboard escape for video modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoLightbox();
    }
  });

  // Filter tab interactions
  testFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      testFilterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeTestimonialFilter = tab.getAttribute('data-filter');
      renderTestimonials();
    });
  });

  // Initial Testimonials Render
  renderTestimonials();
});
