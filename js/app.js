/**
 * FIMFORTE SPECIALIST HOSPITAL — PRODUCTION SCRIPTS (AUDITED)
 * Keyboard Navigation, ARIA sync, Modal Focus Management & Booking Logic
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

  // 3. Mobile Navigation Drawer Toggle & ARIA state
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      
      const icon = mobileToggle.querySelector('i');
      if (isOpen) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
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

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus first input in dialog
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
        // Trap focus inside modal
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

  // 6. Quick Booking Search Console on Hero
  const quickSearchForm = document.getElementById('quickSearchForm');
  if (quickSearchForm) {
    quickSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const specialty = document.getElementById('quickSpecialtySelect').value;
      const insurance = document.getElementById('quickInsuranceSelect').value;
      
      if (specialty && specialtySelect) {
        specialtySelect.value = specialty;
      }
      if (insurance) {
        const insuranceInput = document.getElementById('insuranceType');
        if (insuranceInput) insuranceInput.value = insurance;
      }

      openModal();
    });
  }

  // 7. Appointment Form Submission Handler
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName').value.trim();
      const patientPhone = document.getElementById('patientPhone').value.trim();
      const chosenDept = document.getElementById('modalSpecialtySelect').value;
      const chosenDate = document.getElementById('preferredDate').value;

      closeModal();
      appointmentForm.reset();

      // Reset minimum date
      if (preferredDateInput) {
        const today = new Date().toISOString().split('T')[0];
        preferredDateInput.value = today;
      }

      showToast(`Thank you, ${patientName}! Your consultation with ${chosenDept} on ${chosenDate} is registered. Our triage desk will call ${patientPhone} to confirm.`);
    });
  }
});
