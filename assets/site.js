/**
 * ALFIN RESWARA — PORTFOLIO CLIENT SCRIPTS
 * Lightweight vanilla JavaScript (Zero external dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Light mode default)
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('alfin-theme');
  
  // Set initial theme: default to light unless explicitly saved as dark
  const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
  root.setAttribute('data-theme', initialTheme);
  updateThemeButtonUI(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      root.setAttribute('data-theme', nextTheme);
      localStorage.setItem('alfin-theme', nextTheme);
      updateThemeButtonUI(nextTheme);
    });
  }

  function updateThemeButtonUI(theme) {
    if (!themeToggle) return;
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
    themeToggle.setAttribute('title', isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap');
    
    // Switch icon inside button
    themeToggle.innerHTML = isDark
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      setMobileMenuState(!isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMobileMenuState(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        setMobileMenuState(false);
        mobileToggle.focus();
      }
    });
  }

  function setMobileMenuState(open) {
    if (!mobileToggle || !mobileDrawer) return;
    mobileDrawer.classList.toggle('is-open', open);
    mobileToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileToggle.innerHTML = open
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  }

  // 3. Header Scroll Glass Effect
  const header = document.querySelector('.site-header');
  function handleScroll() {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Subtle Scroll Reveal (Intersection Observer)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // 5. Contact Form Submission (Google Apps Script POST)
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwaSRNaOcMI3zEIi92j91hWrh3gzFhzjq5hpzQPk2xTwF7xhkJJRZQaugg3mzvjvlL_/exec';
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = form.querySelector('.form-status');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Kirim Pesan';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Mengirim...</span>`;
      }
      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.style.display = 'none';
      }

      try {
        await fetch(scriptURL, {
          method: 'POST',
          body: new FormData(form),
          mode: 'no-cors'
        });

        if (statusEl) {
          statusEl.textContent = 'Pesan berhasil terkirim! Alfin akan segera menghubungi Anda via WhatsApp / Email.';
          statusEl.className = 'form-status success';
          statusEl.style.display = 'block';
        }
        form.reset();

        setTimeout(() => {
          if (statusEl) statusEl.style.display = 'none';
        }, 8000);
      } catch (err) {
        console.error('Contact form submission error:', err);
        if (statusEl) {
          statusEl.textContent = 'Gagal mengirim pesan melalui form. Silakan langsung hubungi Alfin melalui WhatsApp di atas.';
          statusEl.className = 'form-status error';
          statusEl.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // 6. Dynamic Copyright Year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
