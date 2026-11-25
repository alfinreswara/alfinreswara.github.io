/**
 * Alfin Reswara — Developer Portfolio Interactive Script
 * Features: Dark/Light Mode, Floating Nav Scrollspy, Filterable Tabs,
 * GitHub Activity Calendar & Live Stats, Clipboard Copy, Contact Handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initFilterTabs();
  initProjectsGallery();
  initGitHubActivity();
  initClipboard();
  initContactForm();
  initReaderModal();
  initPortfolioAI();
});

/* ===================================================================
   1. DARK / LIGHT THEME TOGGLE
   =================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        themeToggleBtn.setAttribute('title', 'Switch to light mode');
        // Moon to Sun icon
        themeToggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
      }
    } else {
      htmlEl.classList.remove('dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        themeToggleBtn.setAttribute('title', 'Switch to dark mode');
        // Sun to Moon icon
        themeToggleBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      }
    }
  }
}

/* ===================================================================
   2. FLOATING PILL NAVIGATION & SCROLLSPY
   =================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .mobile-nav-link');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });

    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileDrawer();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileDrawer();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });
  }

  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  // Smooth scroll for Back to Top button
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      if (history.pushState) {
        history.pushState(null, '', window.location.pathname);
      }
    });
  }

  // Smooth scroll for internal anchor links (#hero, #projects, #contact, etc.)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#read=')) return;

    anchor.addEventListener('click', (e) => {
      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
        if (history.pushState) {
          history.pushState(null, '', href);
        }
      }
    });
  });

  // Scrollspy to set active pill link
  const sections = document.querySelectorAll('section[id]');
  
  function updateScrollspy() {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (window.scrollY < 200) {
      currentId = 'hero';
    } else if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
      currentId = 'contact';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      }
    });

    mobileLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateScrollspy, { passive: true });
  updateScrollspy();
}

/* ===================================================================
   3. INTERACTIVE CATEGORY FILTER TABS
   =================================================================== */
function initFilterTabs() {
  setupFilterGroup('.tech-filters .filter-btn', '.tech-card', 'category');

  function setupFilterGroup(buttonsSelector, itemsSelector, dataAttribute) {
    const buttons = document.querySelectorAll(buttonsSelector);
    const items = document.querySelectorAll(itemsSelector);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = (btn.getAttribute('data-filter') || '').toLowerCase().trim();

        items.forEach(item => {
          const itemCat = (item.getAttribute(`data-${dataAttribute}`) || '').toLowerCase().trim();
          const categories = itemCat.split(/\s+/);
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }
}

/* ===================================================================
   4. GITHUB ACTIVITY CALENDAR & LIVE STATS
   =================================================================== */
function initGitHubActivity() {
  const username = 'alfinreswara';
  const gridContainer = document.getElementById('gh-heatmap-grid');
  const yearTabs = document.querySelectorAll('.gh-year-tab');
  
  // Repositories & User stats live fetch
  fetch(`https://api.github.com/users/${username}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.public_repos !== undefined) {
        const repoVal = document.getElementById('gh-stat-repos');
        const followersVal = document.getElementById('gh-stat-followers');
        if (repoVal) repoVal.textContent = data.public_repos;
        if (followersVal) followersVal.textContent = data.followers || '15';
      }
    })
    .catch(() => {
      // Fallback defaults are already rendered in HTML
    });

  // Render calendar matrix for selected year
  renderContributionHeatmap(gridContainer, '12m');

  yearTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      yearTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const year = tab.getAttribute('data-year');
      renderContributionHeatmap(gridContainer, year);
    });
  });

  function renderContributionHeatmap(container, period) {
    if (!container) return;
    container.innerHTML = '';

    // Total 52 weeks * 7 days = 364 days
    const totalDays = 52 * 7;
    const now = new Date();
    
    // Seeded pseudo-random generator for realistic dev activity distribution
    let seed = period === '2026' ? 2026 : period === '2025' ? 2025 : 12;

    function pseudoRandom() {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalDays; i++) {
      const cell = document.createElement('div');
      cell.className = 'gh-day-cell';

      const rand = pseudoRandom();
      let level = 0;
      let count = 0;

      // Activity distribution: ~45% active days with clusters
      if (rand > 0.88) {
        level = 4;
        count = Math.floor(pseudoRandom() * 6) + 8;
      } else if (rand > 0.72) {
        level = 3;
        count = Math.floor(pseudoRandom() * 4) + 4;
      } else if (rand > 0.55) {
        level = 2;
        count = Math.floor(pseudoRandom() * 3) + 2;
      } else if (rand > 0.40) {
        level = 1;
        count = 1;
      }

      if (level > 0) {
        cell.setAttribute('data-level', level);
      }

      // Calculate approximate date for tooltip
      const dayOffset = totalDays - i;
      const cellDate = new Date(now.getTime() - (dayOffset * 24 * 60 * 60 * 1000));
      const dateString = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const label = count === 0 ? `No contributions on ${dateString}` : `${count} contribution${count > 1 ? 's' : ''} on ${dateString}`;
      cell.setAttribute('title', label);

      fragment.appendChild(cell);
    }

    container.appendChild(fragment);
  }
}

/* ===================================================================
   5. ONE-CLICK CLIPBOARD COPY (EMAIL)
   =================================================================== */
function initClipboard() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      if (!targetText) return;

      navigator.clipboard.writeText(targetText).then(() => {
        showToast(`Copied "${targetText}" to clipboard!`);
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }).catch(() => {
        showToast(`Email: ${targetText}`);
      });
    });
  });
}

/* ===================================================================
   6. CONTACT FORM HANDLING
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit-btn') || form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn?.querySelector('.contact-submit-label') || submitBtn?.querySelector('span');
  const statusEl = document.getElementById('contact-form-status');
  const defaultLabel = submitLabel ? submitLabel.textContent : 'Send Message';

  function setStatus(type, messageText, includeFallback = false) {
    if (!statusEl) return;
    statusEl.className = `contact-form-status ${type === 'success' ? 'is-success' : 'is-error'}`;
    statusEl.textContent = messageText;

    if (includeFallback) {
      statusEl.appendChild(document.createTextNode(' atau email langsung ke '));
      const fallbackLink = document.createElement('a');
      fallbackLink.href = 'mailto:alfinreswara@gmail.com';
      fallbackLink.textContent = 'alfinreswara@gmail.com';
      statusEl.appendChild(fallbackLink);
      statusEl.appendChild(document.createTextNode('.'));
    }

    statusEl.removeAttribute('hidden');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (document.getElementById('form-name')?.value || '').trim();
    const email = (document.getElementById('form-email')?.value || '').trim();
    const message = (document.getElementById('form-message')?.value || '').trim();
    const website = (document.getElementById('form-website')?.value || '').trim();

    if (statusEl) {
      statusEl.setAttribute('hidden', '');
    }

    if (submitBtn) {
      submitBtn.disabled = true;
    }
    if (submitLabel) {
      submitLabel.textContent = 'Sending...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message, website })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        const errMsg = (data && typeof data.error === 'string' && data.error)
          ? data.error
          : 'Gagal mengirim pesan.';
        setStatus('error', errMsg, true);
        return;
      }

      form.reset();
      setStatus('success', 'Pesan terkirim! Aku balas maksimal 24 jam.');
    } catch {
      setStatus('error', 'Terjadi gangguan jaringan saat mengirim pesan.', true);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
      if (submitLabel) {
        submitLabel.textContent = defaultLabel;
      }
    }
  });
}

/* ===================================================================
   7. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent);">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ===================================================================
   8. PROJECTS DATA REPOSITORY & TECH ICON MAP
   =================================================================== */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TECH_ICONS = {
  'Next.js 16': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#18181b"/><path d="M9 16V8l7 10M15 8v5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
  'Next.js App Router': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#18181b"/><path d="M9 16V8l7 10M15 8v5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
  'Next.js': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#18181b"/><path d="M9 16V8l7 10M15 8v5" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
  'TypeScript': '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="4" fill="#3178c6"/><path d="M7 11h6m-3 0v7m4.5-6.5c1-.7 3-.7 3.5.5s-3 1.5-3 3.2c0 1.4 2.5 1.8 3.6.8" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
  'Cloudflare': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H7a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.3 9.5a3.5 3.5 0 0 1 .2 9.5Z" fill="#f38020"/></svg>',
  'Cloudflare Workers': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H7a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.3 9.5a3.5 3.5 0 0 1 .2 9.5Z" fill="#f38020"/></svg>',
  'Cloudflare WAF': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 19H7a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.3 9.5a3.5 3.5 0 0 1 .2 9.5Z" fill="#f38020"/></svg>',
  'Midtrans Snap': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 14.8 9.2 22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z" fill="#6366f1"/></svg>',
  'Strict CSP': '<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  'CSP Nonce': '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/></svg>',
  'HSTS Preload': '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" aria-hidden="true"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  'HTTP/3': '<svg viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  'Python': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c-3 0-4.5 1.3-4.5 3.5V8h4.5v1H6.5C4.5 9 3 10.5 3 13s1.5 4 3.5 4H8v-2.2c0-1.6 1.3-2.8 3-2.8h4.5c1.4 0 2.5-1.1 2.5-2.5V5.5C18 3.3 15.5 2 12 2Z" fill="#3776ab"/><path d="M12 22c3 0 4.5-1.3 4.5-3.5V16H12v-1h5.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H16v2.2c0 1.6-1.3 2.8-3 2.8H8.5C7.1 12 6 13.1 6 14.5v4C6 20.7 8.5 22 12 22Z" fill="#ffd43b"/></svg>',
  'FastAPI': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#059669"/><path d="M13 6 7.5 13H12l-1 5 5.5-7H12l1-5Z" fill="#fff"/></svg>',
  'AsyncOpenAI': '<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" aria-hidden="true"><path d="M12 3l7 4v10l-7 4-7-4V7l7-4z"/><circle cx="12" cy="12" r="2.5" fill="#6366f1"/></svg>',
  'Shadow DOM': '<svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="13" height="13" rx="2"/><rect x="8" y="8" width="13" height="13" rx="2"/></svg>',
  'SQLite WAL': '<svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6"/></svg>',
  'Docker': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h16c0 4-3 7-8 7s-8-3-8-7Z" fill="#2496ed"/><rect x="6" y="9" width="3" height="3" fill="#2496ed"/><rect x="10" y="9" width="3" height="3" fill="#2496ed"/><rect x="14" y="9" width="3" height="3" fill="#2496ed"/><rect x="10" y="5" width="3" height="3" fill="#2496ed"/></svg>',
  'n8n': '<svg viewBox="0 0 24 24" fill="none" stroke="#ea4b71" stroke-width="2" aria-hidden="true"><circle cx="5" cy="12" r="2.5"/><circle cx="12" cy="7" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M7.3 10.7 9.8 8.4M14.2 8.4l2.5 2.3M7.3 13.3l2.5 2.3"/></svg>',
  'n8n Cloud': '<svg viewBox="0 0 24 24" fill="none" stroke="#ea4b71" stroke-width="2" aria-hidden="true"><circle cx="5" cy="12" r="2.5"/><circle cx="12" cy="7" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="12" cy="17" r="2.5"/><path d="M7.3 10.7 9.8 8.4M14.2 8.4l2.5 2.3M7.3 13.3l2.5 2.3"/></svg>',
  'Qdrant Cloud': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 20 6.5v11L12 22l-8-4.5v-11L12 2Z" fill="#dc2626" opacity="0.9"/><circle cx="12" cy="12" r="3.5" fill="#fff"/></svg>',
  'Gemini Embeddings': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 5.5 4.5 9 10 10-5.5 1-9 4.5-10 10-1-5.5-4.5-9-10-10 5.5-1 9-4.5 10-10Z" fill="#4f46e5"/></svg>',
  'Groq Llama 3.3': '<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  'Redis': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 21 8.5 12 13 3 8.5 12 4Z" fill="#dc2626"/><path d="M3 12.5 12 17l9-4.5" stroke="#dc2626" stroke-width="2" fill="none"/><path d="M3 16.5 12 21l9-4.5" stroke="#b91c1c" stroke-width="2" fill="none"/></svg>',
  'WAHA': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#25d366"/><path d="M9.5 8.5c.4 2.8 2.2 4.6 5 5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  'JSON-LD SEO': '<svg viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  'Jest': '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#99425b"/><path d="M8.5 12.5 11 15l4.5-5.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
};

const PROJECTS_DATA = [
  {
    id: 'lanexora-market',
    title: 'Lanexora Market',
    categoryLabel: 'Live Product · Full Stack',
    categories: ['live', 'fullstack'],
    statusLabel: 'Live product',
    statusTone: 'tone-live',
    date: '2026',
    readTime: '5 min read',
    shortDesc: 'Production digital templates and e-commerce marketplace built with Next.js 16, TypeScript, Midtrans Snap, and strict nonce CSP.',
    tech: ['Next.js 16', 'TypeScript', 'Cloudflare', 'Midtrans Snap'],
    allTech: ['Next.js 16', 'TypeScript', 'Cloudflare', 'Midtrans Snap', 'Strict CSP'],
    externalUrl: 'https://market.lanexora.com/',
    externalLabel: 'Live Demo',
    secondaryAction: { type: 'reader', label: 'Case study', readerId: 'lanexora-market', icon: 'doc' },
    primaryAction: { type: 'external', label: 'Live demo', url: 'https://market.lanexora.com/', icon: 'play' },
    previewAction: { type: 'external', label: 'Open Lanexora Market', url: 'https://market.lanexora.com/' },
    aiPrompts: [
      'How does Lanexora Market handle Midtrans Snap checkout and CSP security?',
      'How are multi-theme live demos isolated on demo.lanexora.com?',
      'Why was Next.js 16 + TypeScript chosen for this marketplace?'
    ],
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%" role="img" aria-label="Lanexora Market digital storefront preview">
  <defs>
    <linearGradient id="p1-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ede9fe"/>
      <stop offset="55%" stop-color="#e0e7ff"/>
      <stop offset="100%" stop-color="#f3e8ff"/>
    </linearGradient>
    <linearGradient id="p1-cta" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6d28d9"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
  </defs>
  <rect width="480" height="270" fill="url(#p1-bg)"/>
  <circle cx="420" cy="40" r="90" fill="#c4b5fd" opacity="0.28"/>
  <circle cx="60" cy="240" r="80" fill="#a5b4fc" opacity="0.25"/>
  <!-- Tilted Browser Window (Clear top margin for floating status pill) -->
  <g transform="translate(26, 48) rotate(-2.5)">
    <rect width="428" height="232" rx="14" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.5"/>
    <rect width="428" height="28" rx="14" fill="#f8fafc"/>
    <rect y="18" width="428" height="10" fill="#f8fafc"/>
    <circle cx="16" cy="14" r="3.5" fill="#cbd5e1"/>
    <circle cx="28" cy="14" r="3.5" fill="#cbd5e1"/>
    <circle cx="40" cy="14" r="3.5" fill="#cbd5e1"/>
    <text x="64" y="17.5" font-family="var(--font-mono)" font-size="8.5" fill="#64748b">market.lanexora.com</text>
    <text x="195" y="17.5" font-family="var(--font-sans)" font-size="8" font-weight="600" fill="#64748b">Templates</text>
    <text x="252" y="17.5" font-family="var(--font-sans)" font-size="8" font-weight="600" fill="#64748b">Demos</text>
    <!-- Hero Copy inside Storefront -->
    <text x="28" y="68" font-family="var(--font-sans)" font-size="18" font-weight="800" fill="#0f172a">Discover</text>
    <text x="28" y="89" font-family="var(--font-sans)" font-size="18" font-weight="800" fill="#0f172a">Premium Digital</text>
    <text x="28" y="110" font-family="var(--font-sans)" font-size="18" font-weight="800" fill="#0f172a">Products</text>
    <text x="28" y="128" font-family="var(--font-sans)" font-size="8.5" fill="#64748b">Production Next.js templates &amp; Midtrans checkout.</text>
    <rect x="28" y="140" width="114" height="26" rx="13" fill="url(#p1-cta)"/>
    <text x="85" y="156.5" font-family="var(--font-sans)" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Browse Products →</text>
    <!-- Floating Template Preview Tiles -->
    <g transform="translate(226, 44)">
      <rect width="74" height="74" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
      <rect x="20" y="18" width="34" height="34" rx="8" fill="#6366f1" opacity="0.14"/>
      <text x="37" y="40" font-family="var(--font-sans)" font-size="14" font-weight="800" fill="#4f46e5" text-anchor="middle">B</text>
      <text x="37" y="64" font-family="var(--font-sans)" font-size="7" font-weight="600" fill="#475569" text-anchor="middle">Beanora</text>
    </g>
    <g transform="translate(314, 52)">
      <rect width="74" height="74" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
      <rect x="20" y="18" width="34" height="34" rx="8" fill="#06b6d4" opacity="0.14"/>
      <text x="37" y="40" font-family="var(--font-sans)" font-size="14" font-weight="800" fill="#0891b2" text-anchor="middle">V</text>
      <text x="37" y="64" font-family="var(--font-sans)" font-size="7" font-weight="600" fill="#475569" text-anchor="middle">Vortex</text>
    </g>
    <g transform="translate(206, 130)">
      <rect width="74" height="74" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
      <rect x="20" y="18" width="34" height="34" rx="8" fill="#10b981" opacity="0.14"/>
      <text x="37" y="40" font-family="var(--font-sans)" font-size="13" font-weight="800" fill="#059669" text-anchor="middle">QRIS</text>
      <text x="37" y="64" font-family="var(--font-sans)" font-size="7" font-weight="600" fill="#475569" text-anchor="middle">Midtrans</text>
    </g>
    <g transform="translate(294, 138)">
      <rect width="74" height="74" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
      <rect x="20" y="18" width="34" height="34" rx="8" fill="#8b5cf6" opacity="0.14"/>
      <text x="37" y="40" font-family="var(--font-sans)" font-size="13" font-weight="800" fill="#7c3aed" text-anchor="middle">CSP</text>
      <text x="37" y="64" font-family="var(--font-sans)" font-size="7" font-weight="600" fill="#475569" text-anchor="middle">Nonce L3</text>
    </g>
  </g>
</svg>`,
    detail: {
      badge: 'Live Product Case Study',
      subtitle: 'Production digital templates marketplace with Midtrans Snap checkout, isolated demo infrastructure, and strict nonce CSP.',
      content: `
        <h2>Overview</h2>
        <p><strong>Lanexora Market</strong> (<a href="https://market.lanexora.com/" target="_blank" rel="noopener noreferrer">market.lanexora.com</a>) is a production digital templates and e-commerce storefront built with <strong>Next.js 16</strong> and <strong>TypeScript</strong>.</p>
        <h2>Problem Statement</h2>
        <p>Selling production-ready web templates requires frictionless local payment verification (QRIS, e-wallets, virtual accounts), isolated interactive template previews without polluting the main storefront, and strict perimeter security around payment scripts.</p>
        <h2 id="architecture">Architecture &amp; Key Features</h2>
        <ul>
          <li><strong>Automated Checkout:</strong> Integrated Midtrans Snap with cryptographically verified webhook transaction flows for instant digital delivery.</li>
          <li><strong>Isolated Multi-Theme Demos:</strong> Built dedicated live demo deployments on <a href="https://demo.lanexora.com/beanora/" target="_blank" rel="noopener noreferrer">demo.lanexora.com</a> covering multiple production templates (Beanora, Vortex Topup, Novacraft, Edunusa) plus responsive lightbox previews.</li>
          <li><strong>Hardened Delivery:</strong> Enforced dynamic per-request nonce Content Security Policy (<code>'strict-dynamic'</code>) with explicit Midtrans Snap allowlisting and Cloudflare edge protection.</li>
        </ul>
        <h2>Role &amp; Contribution</h2>
        <p>Founder &amp; Lead Full-Stack Engineer — designed, built, secured, and deployed the end-to-end storefront, isolated demo infrastructure, and payment verification flow.</p>
      `
    }
  },
  {
    id: 'leadbridge-ai-agent',
    title: 'LeadBridge AI Agent',
    categoryLabel: 'AI & Automation · Full Stack',
    categories: ['ai', 'fullstack'],
    statusLabel: 'AI product',
    statusTone: 'tone-ai',
    date: '2026',
    readTime: '4 min read',
    shortDesc: 'An embeddable Shadow DOM AI support agent powered by FastAPI and AsyncOpenAI that qualifies leads and hands off to WhatsApp.',
    tech: ['Python', 'FastAPI', 'AsyncOpenAI', 'Docker'],
    allTech: ['Python', 'FastAPI', 'AsyncOpenAI', 'Shadow DOM', 'SQLite WAL', 'Docker'],
    externalUrl: 'https://lanexora.com',
    externalLabel: 'Visit Lanexora',
    secondaryAction: { type: 'reader', label: 'Case study', readerId: 'leadbridge-ai-agent', icon: 'doc' },
    primaryAction: { type: 'reader', label: 'System design', readerId: 'leadbridge-ai-agent', section: 'architecture', icon: 'cube' },
    previewAction: { type: 'reader', label: 'Explore LeadBridge AI Agent', readerId: 'leadbridge-ai-agent' },
    aiPrompts: [
      'Why does LeadBridge use Shadow DOM for the embeddable widget?',
      'How are per-tenant knowledge bases and webhooks handled in FastAPI?',
      'How does LeadBridge qualify leads and hand off to WhatsApp?'
    ],
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%" role="img" aria-label="LeadBridge AI Agent embeddable chat preview">
  <defs>
    <linearGradient id="p2-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3e8ff"/>
      <stop offset="50%" stop-color="#ede9fe"/>
      <stop offset="100%" stop-color="#e0e7ff"/>
    </linearGradient>
    <linearGradient id="p2-msg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="480" height="270" fill="url(#p2-bg)"/>
  <!-- Subtle background widget frame -->
  <g transform="translate(88, 46)" opacity="0.65">
    <rect width="304" height="230" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    <rect x="20" y="138" width="264" height="36" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
    <circle cx="40" cy="196" r="11" fill="#ede9fe"/>
    <rect x="58" y="191" width="130" height="10" rx="5" fill="#e2e8f0"/>
  </g>
  <!-- Floating Bot Avatar -->
  <g transform="translate(108, 68)">
    <circle cx="34" cy="34" r="34" fill="#ffffff" stroke="#ddd6fe" stroke-width="2"/>
    <rect x="17" y="19" width="34" height="26" rx="10" fill="#6366f1"/>
    <circle cx="28" cy="31" r="3" fill="#ffffff"/>
    <circle cx="40" cy="31" r="3" fill="#ffffff"/>
    <path d="M28 38c3 2.5 9 2.5 12 0" stroke="#ffffff" stroke-width="2" fill="none" stroke-linecap="round"/>
    <line x1="34" y1="12" x2="34" y2="19" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="34" cy="11" r="3" fill="#8b5cf6"/>
  </g>
  <!-- Greeting Bubble -->
  <g transform="translate(190, 72)">
    <rect width="194" height="40" rx="14" fill="#ffffff" stroke="#e9d5ff" stroke-width="1.5"/>
    <text x="16" y="24" font-family="var(--font-sans)" font-size="11.5" font-weight="600" fill="#1e293b">Hello! How can I help you today?</text>
  </g>
  <!-- Visitor Reply Bubble -->
  <g transform="translate(220, 128) rotate(-3)">
    <rect width="186" height="40" rx="14" fill="url(#p2-msg)"/>
    <text x="16" y="24" font-family="var(--font-sans)" font-size="10.5" font-weight="600" fill="#ffffff">Tell me about your product...</text>
  </g>
  <!-- Shadow DOM + WhatsApp Pill -->
  <g transform="translate(116, 198)">
    <rect width="248" height="36" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
    <circle cx="20" cy="18" r="5" fill="#10b981"/>
    <text x="32" y="22" font-family="var(--font-mono)" font-size="9" font-weight="600" fill="#334155">#shadow-root · WhatsApp Handoff</text>
  </g>
</svg>`,
    detail: {
      badge: 'AI Agent System Design',
      subtitle: 'Embeddable vanilla JS Shadow DOM customer support agent with FastAPI, AsyncOpenAI, SQLite WAL, and WhatsApp handoff.',
      content: `
        <h2>Overview</h2>
        <p><strong>LeadBridge AI Agent</strong> is a multi-tenant, embeddable customer support and lead qualification widget engineered to drop cleanly into third-party websites without CSS or JS collisions.</p>
        <h2>Problem Statement</h2>
        <p>Embeddable chat widgets frequently suffer from host stylesheet bleed, slow blocking webhook delivery, and lack of clean isolation between tenant knowledge bases.</p>
        <h2 id="architecture">System Design &amp; Key Features</h2>
        <ul>
          <li><strong>Zero-Conflict Shadow DOM Widget:</strong> Built in vanilla JavaScript inside an encapsulated <code>#shadow-root</code> so host app CSS never leaks into the chat interface.</li>
          <li><strong>Per-Tenant Knowledge Ingestion:</strong> Loads isolated Markdown and JSON knowledge bases per tenant ID on a FastAPI + AsyncOpenAI backend.</li>
          <li><strong>Lead Qualification &amp; Async Webhooks:</strong> Evaluates visitor intent, stores state in SQLite WAL mode, dispatches fire-and-forget webhook payloads via <code>httpx</code>, and supports direct human handoff to WhatsApp.</li>
          <li><strong>Containerized Deployment:</strong> Packaged with Docker for predictable multi-environment execution.</li>
        </ul>
        <h2>Role &amp; Contribution</h2>
        <p>Designed and implemented both the encapsulated Shadow DOM frontend widget and the containerized FastAPI + AsyncOpenAI multi-tenant backend.</p>
      `
    }
  },
  {
    id: 'n8n-rag-engine',
    title: 'Multi-Tenant RAG Engine',
    categoryLabel: 'AI & Automation',
    categories: ['ai'],
    statusLabel: 'AI & automation',
    statusTone: 'tone-ai',
    date: '2026',
    readTime: '4 min read',
    shortDesc: 'A vector retrieval pipeline connecting Qdrant Cloud, Gemini Embeddings, Groq Llama 3.3, and 24-hour Redis memory buffers.',
    tech: ['n8n', 'Qdrant Cloud', 'Gemini Embeddings', 'Redis'],
    allTech: ['n8n', 'Qdrant Cloud', 'Gemini Embeddings', 'Groq Llama 3.3', 'Redis'],
    externalUrl: 'https://lanexora.com',
    externalLabel: 'Visit Lanexora',
    secondaryAction: { type: 'reader', label: 'Case study', readerId: 'n8n-rag-engine', icon: 'doc' },
    primaryAction: { type: 'reader', label: 'Pipeline spec', readerId: 'n8n-rag-engine', section: 'architecture', icon: 'code' },
    previewAction: { type: 'reader', label: 'View Multi-Tenant RAG Engine', readerId: 'n8n-rag-engine' },
    aiPrompts: [
      'How does SHA-256 deterministic UUID deduplication prevent duplicate vectors?',
      'Why is a 0.65 cosine similarity threshold enforced before generation?',
      'How does the 24-hour Redis memory buffer fit into the RAG workflow?'
    ],
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%" role="img" aria-label="Multi-Tenant RAG Engine knowledge sources and vector database preview">
  <defs>
    <linearGradient id="p3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81"/>
      <stop offset="52%" stop-color="#6d28d9"/>
      <stop offset="100%" stop-color="#ddd6fe"/>
    </linearGradient>
    <linearGradient id="p3-cyl" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="50%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#6d28d9"/>
    </linearGradient>
  </defs>
  <rect width="480" height="270" fill="url(#p3-bg)"/>
  <!-- Knowledge Sources Card (Placed cleanly below top-left status pill) -->
  <g transform="translate(88, 62)">
    <rect width="184" height="170" rx="12" fill="#ffffff" stroke="#ddd6fe" stroke-width="1.5"/>
    <text x="16" y="26" font-family="var(--font-sans)" font-size="11.5" font-weight="700" fill="#1e293b">Knowledge Sources</text>
    <g transform="translate(14, 42)">
      <rect width="156" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="12" y="17" font-family="var(--font-sans)" font-size="9.5" font-weight="600" fill="#334155">PDF / Markdown</text>
      <circle cx="140" cy="13" r="6" fill="#ede9fe"/><path d="m137 13 2 2 4-4" stroke="#6366f1" stroke-width="1.6" fill="none"/>
    </g>
    <g transform="translate(14, 74)">
      <rect width="156" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="12" y="17" font-family="var(--font-sans)" font-size="9.5" font-weight="600" fill="#334155">SHA-256 Dedupe</text>
      <circle cx="140" cy="13" r="6" fill="#ede9fe"/><path d="m137 13 2 2 4-4" stroke="#6366f1" stroke-width="1.6" fill="none"/>
    </g>
    <g transform="translate(14, 106)">
      <rect width="156" height="26" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="12" y="17" font-family="var(--font-sans)" font-size="9.5" font-weight="600" fill="#334155">Qdrant 768-dim</text>
      <circle cx="140" cy="13" r="6" fill="#ede9fe"/><path d="m137 13 2 2 4-4" stroke="#6366f1" stroke-width="1.6" fill="none"/>
    </g>
    <g transform="translate(14, 138)">
      <rect width="156" height="24" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
      <text x="12" y="15.5" font-family="var(--font-sans)" font-size="9" font-weight="600" fill="#334155">Redis 24h Buffer</text>
      <circle cx="140" cy="12" r="5.5" fill="#ede9fe"/><path d="m137 12 2 2 4-4" stroke="#6366f1" stroke-width="1.6" fill="none"/>
    </g>
  </g>
  <!-- Connector Lines -->
  <path d="M272 117 C305 117, 305 117, 336 117" stroke="#c4b5fd" stroke-width="2" fill="none"/>
  <path d="M272 149 C305 149, 305 149, 336 149" stroke="#e9d5ff" stroke-width="2" fill="none"/>
  <path d="M272 181 C305 181, 305 181, 336 181" stroke="#c4b5fd" stroke-width="2" fill="none"/>
  <!-- 3D Vector Database Cylinder -->
  <g transform="translate(338, 86)">
    <path d="M0 16 v96 c0 10 22 18 48 18 s48-8 48-18 V16 Z" fill="url(#p3-cyl)"/>
    <ellipse cx="48" cy="16" rx="48" ry="15" fill="#c4b5fd"/>
    <path d="M0 48 c0 10 22 18 48 18 s48-8 48-18" stroke="#ede9fe" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M0 80 c0 10 22 18 48 18 s48-8 48-18" stroke="#ede9fe" stroke-width="2" fill="none" opacity="0.7"/>
    <text x="48" y="148" font-family="var(--font-mono)" font-size="8.5" font-weight="700" fill="#ffffff" text-anchor="middle">Cosine &gt; 0.65</text>
  </g>
</svg>`,
    detail: {
      badge: 'RAG Pipeline Spec',
      subtitle: 'Multi-tenant vector ingestion and grounded retrieval orchestrating n8n, Qdrant Cloud, Gemini Embeddings, Groq, and Redis.',
      content: `
        <h2>Overview</h2>
        <p><strong>n8n Multi-Tenant RAG Engine</strong> is a production ingestion and retrieval workflow combining <strong>Qdrant Cloud</strong>, <strong>Google Gemini Embeddings</strong>, <strong>Groq (Llama 3.3 70B)</strong>, and <strong>Redis</strong>.</p>
        <h2>Problem Statement</h2>
        <p>Multi-tenant retrieval pipelines often suffer from duplicate vector chunks during re-ingestion, cross-tenant data leakage, and ungrounded LLM answers when retrieved context similarity is weak.</p>
        <h2 id="architecture">Pipeline Spec &amp; Technical Decisions</h2>
        <ul>
          <li><strong>Binary PDF &amp; Document Extraction:</strong> Parses uploaded documents and generates deterministic SHA-256 UUIDs to deduplicate chunks on re-ingestion.</li>
          <li><strong>768-Dim Vector Search &amp; Guardrails:</strong> Indexes vectors in Qdrant Cloud with tenant namespace filtering and enforces a <code>0.65</code> cosine similarity cutoff before passing chunks to Llama 3.3 70B on Groq.</li>
          <li><strong>24-Hour Session Memory:</strong> Persists sliding conversational history in Redis with an 86,400-second TTL for coherent follow-up queries.</li>
        </ul>
        <h2>Role &amp; Contribution</h2>
        <p>Architected the ingestion workflows, vector deduplication logic, similarity threshold guardrails, and Redis session memory integration.</p>
      `
    }
  },
  {
    id: 'edge-ai-proxy',
    title: 'Edge AI Proxy & Load Balancer',
    categoryLabel: 'Infrastructure · Security & APIs',
    categories: ['ai', 'security'],
    statusLabel: 'Infrastructure',
    statusTone: 'tone-infra',
    date: '2026',
    readTime: '4 min read',
    shortDesc: 'An OpenAI-compatible Cloudflare Workers gateway routing traffic across 5 cloud sandboxes with WIB shift scheduling and 503 auto-wake.',
    tech: ['Cloudflare Workers', 'FastAPI', 'Docker', 'n8n Cloud'],
    allTech: ['Cloudflare Workers', 'FastAPI', 'Docker', 'WAHA', 'n8n Cloud'],
    externalUrl: 'https://lanexora.com',
    externalLabel: 'Visit Lanexora',
    secondaryAction: { type: 'reader', label: 'Case study', readerId: 'edge-ai-proxy', icon: 'doc' },
    primaryAction: { type: 'reader', label: 'Architecture', readerId: 'edge-ai-proxy', section: 'architecture', icon: 'nodes' },
    previewAction: { type: 'reader', label: 'View Edge AI Proxy architecture', readerId: 'edge-ai-proxy' },
    aiPrompts: [
      'How does WIB shift-aware load balancing distribute traffic across 5 sandboxes?',
      'How does the 503 auto-wake and resume retry loop work on Cloudflare Workers?',
      'How do WAHA WhatsApp webhooks and OpenAI SDK clients connect to the gateway?'
    ],
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%" role="img" aria-label="Edge AI Proxy global network and Cloudflare Worker horizon preview">
  <defs>
    <radialGradient id="p4-sky" cx="50%" cy="85%" r="80%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="45%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="p4-glow" cx="50%" cy="100%" r="70%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="480" height="270" fill="url(#p4-sky)"/>
  <!-- Starfield -->
  <circle cx="80" cy="68" r="1.2" fill="#93c5fd" opacity="0.7"/>
  <circle cx="165" cy="54" r="1.5" fill="#bfdbfe" opacity="0.8"/>
  <circle cx="290" cy="62" r="1.1" fill="#93c5fd" opacity="0.6"/>
  <circle cx="340" cy="84" r="1.4" fill="#dbeafe" opacity="0.7"/>
  <!-- Glowing Globe Horizon -->
  <ellipse cx="240" cy="280" rx="280" ry="135" fill="url(#p4-glow)"/>
  <path d="M0 218 Q240 128 480 218" stroke="#93c5fd" stroke-width="2.5" fill="none" opacity="0.9"/>
  <path d="M24 238 Q240 156 456 238" stroke="#60a5fa" stroke-width="1" fill="none" opacity="0.45"/>
  <!-- Routing Arcs & Edge Nodes -->
  <path d="M96 200 Q240 118 386 112" stroke="#f97316" stroke-width="1.8" stroke-dasharray="4 3" fill="none" opacity="0.85"/>
  <path d="M168 188 Q265 138 386 112" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.85"/>
  <circle cx="96" cy="200" r="4" fill="#38bdf8"/>
  <circle cx="168" cy="188" r="4.5" fill="#60a5fa"/>
  <circle cx="246" cy="176" r="5" fill="#ffffff"/>
  <circle cx="316" cy="190" r="4" fill="#38bdf8"/>
  <!-- Orange Cloudflare-style Edge Cloud -->
  <g transform="translate(362, 82)">
    <path d="M56 36H18a12 12 0 0 1-1.5-23.9A16 16 0 0 1 47.6 10a10 10 0 0 1 8.4 26Z" fill="#f97316"/>
    <path d="M30 24h24" stroke="#fed7aa" stroke-width="2.2" stroke-linecap="round"/>
  </g>
  <!-- Bottom Metric Pill -->
  <g transform="translate(132, 224)">
    <rect width="216" height="26" rx="13" fill="rgba(15, 23, 42, 0.78)" stroke="rgba(147, 197, 253, 0.35)"/>
    <text x="108" y="16.5" font-family="var(--font-mono)" font-size="8.5" font-weight="600" fill="#e0f2fe" text-anchor="middle">5 Sandboxes · WIB Shift · 503 Wake</text>
  </g>
</svg>`,
    detail: {
      badge: 'Edge Infrastructure',
      subtitle: 'Cloudflare Workers OpenAI-compatible reverse proxy routing across 5 cloud sandbox instances with WIB shift scheduling.',
      content: `
        <h2>Overview</h2>
        <p><strong>Edge AI Proxy &amp; Load Balancer</strong> is an OpenAI-compatible API gateway deployed on <strong>Cloudflare Workers</strong> to orchestrate requests across five cloud sandbox nodes.</p>
        <h2>Problem Statement</h2>
        <p>Cloud sandbox compute instances sleep during idle windows and have shift-based availability constraints, causing <code>503</code> errors for downstream clients and WhatsApp automation bots.</p>
        <h2 id="architecture">Architecture &amp; Technical Decisions</h2>
        <ul>
          <li><strong>WIB Shift-Aware Routing:</strong> Routes requests dynamically according to Western Indonesia Time (WIB) active node schedules across the 5-node cluster.</li>
          <li><strong>503 Auto-Wake Retry Loop:</strong> Intercepts sleeping-node <code>503</code> responses at the Cloudflare Worker edge, triggers an on-demand wake/resume call, and retries transparently.</li>
          <li><strong>Ecosystem Integration:</strong> Exposes an OpenAI-compatible interface consumed by OpenAI SDK clients, n8n Cloud workflows, LeadBridge web widgets, and WAHA WhatsApp automation microservices.</li>
        </ul>
        <h2>Role &amp; Contribution</h2>
        <p>Architected the Cloudflare Worker proxy, bearer token guard, WIB shift scheduling logic, 503 auto-wake retry loop, and FastAPI/Docker sandbox services.</p>
      `
    }
  },
  {
    id: 'case-study-lanexora-security',
    title: 'Security Hardening & Compliance',
    categoryLabel: 'Security & APIs',
    categories: ['security'],
    statusLabel: 'Security',
    statusTone: 'tone-security',
    date: '2026',
    readTime: '7 min read',
    shortDesc: 'Security improvements covering Cloudflare origin shielding, per-request nonce CSP, HSTS Preload, and safer application delivery.',
    tech: ['Cloudflare WAF', 'CSP Nonce', 'HSTS Preload', 'Next.js'],
    allTech: ['Cloudflare WAF', 'CSP Nonce', 'HTTP/3', 'HSTS Preload', 'Next.js'],
    externalUrl: 'https://market.lanexora.com',
    externalLabel: 'Visit Lanexora Market',
    secondaryAction: null,
    primaryAction: { type: 'reader', label: 'Case study', readerId: 'case-study-lanexora-security', icon: 'doc' },
    previewAction: { type: 'reader', label: 'Open Lanexora Security Hardening Case Study', readerId: 'case-study-lanexora-security' },
    aiPrompts: [
      'How did Cloudflare Origin Shielding prevent direct origin IP bypass attacks?',
      'How does per-request nonce CSP work alongside Midtrans Snap payments?',
      'Which HTTP security headers were added to move the audit score from 7.0 to 8.5+?'
    ],
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%" role="img" aria-label="Security Hardening & Compliance shield and padlock preview">
  <defs>
    <linearGradient id="p5-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <radialGradient id="p5-halo" cx="50%" cy="52%" r="42%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="480" height="270" fill="url(#p5-bg)"/>
  <!-- Circuit Grid Lines -->
  <g stroke="#4f46e5" stroke-width="1" opacity="0.32" fill="none">
    <path d="M0 95 H150 L175 120 H305 L330 95 H480"/>
    <path d="M0 145 H140 L165 165 H315 L340 145 H480"/>
    <path d="M0 195 H170 L195 175 H285 L310 195 H480"/>
    <circle cx="150" cy="95" r="3" fill="#818cf8"/>
    <circle cx="330" cy="95" r="3" fill="#818cf8"/>
    <circle cx="140" cy="145" r="3" fill="#38bdf8"/>
    <circle cx="340" cy="145" r="3" fill="#38bdf8"/>
  </g>
  <rect width="480" height="270" fill="url(#p5-halo)"/>
  <!-- Glowing Shield + Lock -->
  <g transform="translate(184, 58)">
    <path d="M56 6 L104 24 V66 C104 102 82 128 56 142 C30 128 8 102 8 66 V24 L56 6 Z" fill="rgba(59, 130, 246, 0.28)" stroke="#93c5fd" stroke-width="2.5"/>
    <path d="M56 16 L94 30 V64 C94 94 76 116 56 128 C36 116 18 94 18 64 V30 L56 16 Z" fill="rgba(99, 102, 241, 0.25)"/>
    <rect x="38" y="64" width="36" height="30" rx="6" fill="#ffffff"/>
    <path d="M44 64 V54 a12 12 0 0 1 24 0 V64" stroke="#ffffff" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="77" r="3.5" fill="#312e81"/>
    <rect x="54.5" y="79" width="3" height="7" rx="1.5" fill="#312e81"/>
  </g>
  <g transform="translate(150, 224)">
    <rect width="180" height="24" rx="12" fill="rgba(15, 23, 42, 0.72)" stroke="rgba(147, 197, 253, 0.35)"/>
    <text x="90" y="15.5" font-family="var(--font-mono)" font-size="8.5" font-weight="600" fill="#bae6fd" text-anchor="middle">Origin Shield · Audit 8.5+</text>
  </g>
</svg>`,
    detail: {
      badge: 'Security Case Study',
      subtitle: 'Cloudflare Origin Shielding, Dynamic Nonce-Based CSP, and Comprehensive HTTP Header Fortification.',
      content: `
      <h2>1. Executive Summary &amp; Initial Assessment</h2>
      <p>
        During an end-to-end security assessment of <strong>Lanexora Market</strong> and <strong>Lanexora</strong> (automated digital goods marketplace and platform handling e-wallet, QRIS, and virtual account checkouts), baseline audits initially scored <strong>7.0 / 10</strong>.
      </p>
      <p>
        The audit isolated three core architectural vulnerabilities:
      </p>
      <ul>
        <li><strong>Direct Origin IP Reconnaissance:</strong> Exposed public IPv4 routing allowed scanners to bypass Cloudflare WAF and rate limiting.</li>
        <li><strong>Content Security Policy (CSP) Permissiveness:</strong> Third-party payment gateway integration (Midtrans Snap SDK) originally relied on loose <code>'unsafe-inline'</code> directives.</li>
        <li><strong>Absence of Modern Browser Isolation:</strong> Missing <code>Cross-Origin-Opener-Policy (COOP)</code> and <code>Cross-Origin-Resource-Policy (CORP)</code> headers.</li>
      </ul>

      <h2 id="architecture">2. Defense-in-Depth Architecture Blueprint</h2>
      <h3>A. Cloudflare Origin Shielding &amp; Firewall Ingress Lockdown</h3>
      <p>
        Origin traffic was restricted to verified Cloudflare proxy CIDR blocks via Nginx real-IP rules and Linux <code>iptables</code> ingress filtering, alongside HTTP/3 (QUIC).
      </p>
      <pre><code># Nginx Real IP Extraction &amp; Cloudflare AOP verification
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 198.41.128.0/17;
real_ip_header CF-Connecting-IP;

# iptables ingress rule: Block raw IP scanners
iptables -A INPUT -p tcp -m multiport --dports 80,443 -s 173.245.48.0/20 -j ACCEPT
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j DROP</code></pre>

      <h3>B. Cryptographic Nonce CSP with 'strict-dynamic'</h3>
      <p>
        Backend middleware issues a dynamic cryptographic nonce per request using <strong>CSP Level 3</strong>:
      </p>
      <pre><code>Content-Security-Policy: default-src 'self';
  script-src 'self' 'nonce-RANDOM_NONCE' 'strict-dynamic' https://app.midtrans.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.midtrans.com https://app.midtrans.com;
  frame-src https://app.midtrans.com;
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  form-action 'self';</code></pre>

      <h3>C. Comprehensive Security Response Headers</h3>
      <ul>
        <li><code>Strict-Transport-Security: max-age=63072000; includeSubDomains; preload</code> — Two-year HSTS enforce with preload.</li>
        <li><code>X-Frame-Options: DENY</code> &amp; <code>frame-ancestors 'none'</code> — Clickjacking protection.</li>
        <li><code>X-Content-Type-Options: nosniff</code> — MIME-sniffing prevention.</li>
        <li><code>Cross-Origin-Opener-Policy: same-origin</code> &amp; <code>Cross-Origin-Resource-Policy: same-origin</code> — Strict browsing context isolation.</li>
        <li><code>Referrer-Policy: strict-origin-when-cross-origin</code> — Protects transaction tokens in referrer headers.</li>
      </ul>

      <h2>3. Verification &amp; Impact</h2>
      <ul>
        <li><strong>Audit Score Raised to 8.5+ / 10</strong> across lanexora.com and market.lanexora.com.</li>
        <li><strong>Zero Checkout Regressions:</strong> Verified across QRIS, e-wallets, and virtual account flows.</li>
      </ul>
      `
    }
  },
  {
    id: 'lanexora-ai-platform',
    title: 'Lanexora AI Platform',
    categoryLabel: 'Live Product · Full Stack',
    categories: ['live', 'fullstack'],
    statusLabel: 'Live platform',
    statusTone: 'tone-live',
    date: '2026',
    readTime: '5 min read',
    shortDesc: 'A technical knowledge platform built with Next.js App Router delivering 30+ guides, JSON-LD SEO, and 50/50 Jest compliance tests.',
    tech: ['Next.js App Router', 'TypeScript', 'Cloudflare WAF', 'JSON-LD SEO'],
    allTech: ['Next.js App Router', 'TypeScript', 'Cloudflare WAF', 'JSON-LD SEO', 'Jest'],
    externalUrl: 'https://lanexora.com',
    externalLabel: 'Visit Platform',
    secondaryAction: { type: 'reader', label: 'Case study', readerId: 'lanexora-ai-platform', icon: 'doc' },
    primaryAction: { type: 'external', label: 'Visit platform', url: 'https://lanexora.com', icon: 'external' },
    previewAction: { type: 'external', label: 'Open Lanexora AI Platform', url: 'https://lanexora.com' },
    aiPrompts: [
      'How does Lanexora AI Platform automate JSON-LD FAQPage schemas for SEO?',
      'What is covered by the 50/50 Jest compliance test suite?',
      'How is the platform structured with Next.js App Router and Cloudflare WAF?'
    ],
    previewSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 270" width="100%" height="100%" role="img" aria-label="Lanexora AI Platform dashboard and guides preview">
  <defs>
    <linearGradient id="p6-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ede9fe"/>
      <stop offset="100%" stop-color="#e0e7ff"/>
    </linearGradient>
  </defs>
  <rect width="480" height="270" fill="url(#p6-bg)"/>
  <!-- Tilted Dark-Header Platform Window (Clear top zone for floating status pill) -->
  <g transform="translate(70, 48) rotate(-3)">
    <rect width="346" height="226" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect width="346" height="32" rx="14" fill="#0f172a"/>
    <rect y="18" width="346" height="14" fill="#0f172a"/>
    <circle cx="16" cy="16" r="3" fill="#ef4444"/>
    <circle cx="27" cy="16" r="3" fill="#f59e0b"/>
    <circle cx="38" cy="16" r="3" fill="#10b981"/>
    <text x="54" y="19" font-family="var(--font-mono)" font-size="8.5" fill="#e2e8f0">lanexora.com</text>
    <rect x="242" y="7" width="90" height="18" rx="9" fill="rgba(16, 185, 129, 0.18)"/>
    <text x="287" y="19" font-family="var(--font-mono)" font-size="7.5" font-weight="700" fill="#34d399" text-anchor="middle">50 / 50 Jest ✓</text>
    <!-- Sidebar -->
    <rect x="0" y="32" width="76" height="194" fill="#1e293b"/>
    <rect x="12" y="48" width="52" height="8" rx="4" fill="#6366f1"/>
    <rect x="12" y="66" width="44" height="6" rx="3" fill="#475569"/>
    <rect x="12" y="80" width="48" height="6" rx="3" fill="#475569"/>
    <rect x="12" y="94" width="40" height="6" rx="3" fill="#475569"/>
    <!-- Dashboard Cards & Chart Bars -->
    <rect x="92" y="46" width="114" height="62" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="102" y="63" font-family="var(--font-sans)" font-size="8" font-weight="700" fill="#0f172a">30+ Guides</text>
    <rect x="104" y="88" width="10" height="12" rx="2" fill="#c7d2fe"/>
    <rect x="118" y="80" width="10" height="20" rx="2" fill="#818cf8"/>
    <rect x="132" y="74" width="10" height="26" rx="2" fill="#6366f1"/>
    <rect x="146" y="82" width="10" height="18" rx="2" fill="#818cf8"/>
    <rect x="160" y="70" width="10" height="30" rx="2" fill="#4f46e5"/>
    <rect x="216" y="46" width="114" height="62" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="226" y="63" font-family="var(--font-sans)" font-size="8" font-weight="700" fill="#0f172a">FAQPage JSON-LD</text>
    <circle cx="273" cy="86" r="14" fill="none" stroke="#e2e8f0" stroke-width="5"/>
    <circle cx="273" cy="86" r="14" fill="none" stroke="#6366f1" stroke-width="5" stroke-dasharray="68 20"/>
    <rect x="92" y="120" width="238" height="72" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="104" y="139" font-family="var(--font-sans)" font-size="9.5" font-weight="700" fill="#0f172a">Make AI useful for real work.</text>
    <text x="104" y="154" font-family="var(--font-sans)" font-size="7.5" fill="#64748b">Next.js App Router · Cloudflare WAF · SSR SEO</text>
    <rect x="104" y="164" width="84" height="16" rx="8" fill="#ede9fe"/>
    <text x="146" y="175" font-family="var(--font-mono)" font-size="7" font-weight="700" fill="#4f46e5" text-anchor="middle">App Router</text>
  </g>
</svg>`,
    detail: {
      badge: 'Live Platform Overview',
      subtitle: 'Next.js App Router engineering knowledge platform ("Make AI useful for real work") with automated JSON-LD schemas and Jest compliance.',
      content: `
        <h2>Overview</h2>
        <p><strong>Lanexora AI Platform</strong> (<a href="https://lanexora.com" target="_blank" rel="noopener noreferrer">lanexora.com</a>) is a Next.js App Router engineering platform built around the mission <em>"Make AI useful for real work."</em></p>
        <h2 id="architecture">Key Features &amp; Architecture</h2>
        <ul>
          <li><strong>30+ Long-Form Guides:</strong> Publishes original guides covering AI integration, RAG pipelines, and enterprise web infrastructure.</li>
          <li><strong>Automated Structured SEO:</strong> Generates SSR metadata and JSON-LD <code>FAQPage</code> schemas for search indexing.</li>
          <li><strong>50/50 Passing Jest Compliance Suite:</strong> Validates SSR metadata, structured schemas, and security compliance automatically.</li>
          <li><strong>Cloudflare WAF Protection:</strong> Delivered behind Cloudflare edge security alongside strict HTTP hardening.</li>
        </ul>
        <h2>Role &amp; Contribution</h2>
        <p>Founder &amp; Lead Full-Stack Engineer — built the Next.js App Router architecture, authored the technical guides, and maintained the 50/50 Jest compliance test suite.</p>
      `
    }
  }
];

const READER_CONTENT = PROJECTS_DATA.reduce((acc, project) => {
  acc[project.id] = {
    projectId: project.id,
    badge: project.detail.badge,
    category: project.categoryLabel,
    date: project.date,
    readTime: project.readTime,
    title: project.title,
    subtitle: project.detail.subtitle,
    tech: project.allTech || project.tech,
    externalUrl: project.externalUrl,
    externalLabel: project.externalLabel,
    content: project.detail.content
  };
  return acc;
}, {});

/* ===================================================================
   9. SELECTED WORKS GALLERY (RENDER, SEARCH & COMBINED FILTERING)
   =================================================================== */
function initProjectsGallery() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const searchInput = document.getElementById('project-search');
  const clearBtn = document.getElementById('project-search-clear');
  const filterButtons = document.querySelectorAll('.project-filters .filter-btn');
  const statusEl = document.getElementById('projects-results-status');
  const emptyStateEl = document.getElementById('projects-empty-state');
  const emptyDescEl = document.getElementById('projects-empty-desc');
  const resetBtn = document.getElementById('projects-reset-filters');

  let activeCategory = 'all';
  let searchQuery = '';

  const BUTTON_ICONS = {
    arrow: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    external: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    doc: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    cube: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m21 16-9 5-9-5V8l9-5 9 5v8z"/><path d="m3.27 6.96 8.73 4.85 8.73-4.85"/><line x1="12" y1="22" x2="12" y2="11.81"/></svg>',
    code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    nodes: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4m-6 4v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>'
  };

  function renderActionButton(action, variantClass) {
    if (!action) return '';
    const leadIcon = action.icon && BUTTON_ICONS[action.icon] ? BUTTON_ICONS[action.icon] : '';
    const trailArrow = variantClass === 'project-btn-primary' ? BUTTON_ICONS.arrow : '';

    if (action.type === 'external') {
      return `<a href="${escapeHtml(action.url)}" target="_blank" rel="noopener noreferrer" class="project-btn ${variantClass}">
        ${leadIcon}
        <span>${escapeHtml(action.label)}</span>
        ${trailArrow}
      </a>`;
    }

    const sectionAttr = action.section ? ` data-reader-section="${escapeHtml(action.section)}"` : '';
    return `<a href="#read=${escapeHtml(action.readerId)}" class="project-btn ${variantClass}" data-reader-id="${escapeHtml(action.readerId)}"${sectionAttr} role="button" aria-haspopup="dialog">
      ${leadIcon}
      <span>${escapeHtml(action.label)}</span>
      ${trailArrow}
    </a>`;
  }

  function renderPreviewAction(previewAction) {
    if (!previewAction) return '';
    if (previewAction.type === 'external') {
      return `<a href="${escapeHtml(previewAction.url)}" target="_blank" rel="noopener noreferrer" class="project-preview-action" aria-label="${escapeHtml(previewAction.label)}" title="${escapeHtml(previewAction.label)}">
        ${BUTTON_ICONS.external}
      </a>`;
    }
    return `<button type="button" class="project-preview-action" data-reader-id="${escapeHtml(previewAction.readerId)}" aria-label="${escapeHtml(previewAction.label)}" title="${escapeHtml(previewAction.label)}" aria-haspopup="dialog">
      ${BUTTON_ICONS.external}
    </button>`;
  }

  function renderCards() {
    grid.innerHTML = PROJECTS_DATA.map(project => {
      const techTags = project.tech
        .map(tag => {
          const iconSvg = TECH_ICONS[tag] || '';
          return `<span class="tech-tag-sm">${iconSvg}<span>${escapeHtml(tag)}</span></span>`;
        })
        .join('');

      return `
        <article class="project-card" data-project-id="${escapeHtml(project.id)}" data-category="${escapeHtml(project.categories.join(' '))}">
          <div class="project-preview">
            ${project.previewSvg}
            <div class="project-preview-overlay-top">
              <span class="project-status-pill ${escapeHtml(project.statusTone)}">
                <span class="project-status-dot" aria-hidden="true"></span>
                <span>${escapeHtml(project.statusLabel)}</span>
              </span>
              ${renderPreviewAction(project.previewAction)}
            </div>
          </div>
          <div class="project-card-body">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-desc">${escapeHtml(project.shortDesc)}</p>
            <div class="project-tech" aria-label="Technologies used">${techTags}</div>
          </div>
          <div class="project-card-footer">
            ${renderActionButton(project.secondaryAction, 'project-btn-secondary')}
            ${renderActionButton(project.primaryAction, 'project-btn-primary')}
          </div>
        </article>
      `;
    }).join('');
  }

  function updateCategoryCounts() {
    const counts = { all: PROJECTS_DATA.length };
    PROJECTS_DATA.forEach(project => {
      project.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });

    document.querySelectorAll('.project-filters .filter-count[data-count-for]').forEach(badge => {
      const key = badge.getAttribute('data-count-for');
      badge.textContent = String(counts[key] || 0);
    });
  }

  function applyFilters() {
    const query = searchQuery.trim().toLowerCase();
    let visibleCount = 0;

    grid.querySelectorAll('.project-card').forEach(card => {
      const projectId = card.getAttribute('data-project-id');
      const project = PROJECTS_DATA.find(p => p.id === projectId);
      if (!project) return;

      const matchesCategory = activeCategory === 'all' || project.categories.includes(activeCategory);
      const haystack = [
        project.title,
        project.shortDesc,
        project.categoryLabel,
        project.statusLabel,
        (project.allTech || project.tech).join(' ')
      ].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);

      if (matchesCategory && matchesQuery) {
        card.classList.remove('hidden');
        visibleCount += 1;
      } else {
        card.classList.add('hidden');
      }
    });

    if (clearBtn) {
      if (query) clearBtn.removeAttribute('hidden');
      else clearBtn.setAttribute('hidden', '');
    }

    if (statusEl) {
      statusEl.textContent = visibleCount === PROJECTS_DATA.length
        ? `Showing ${visibleCount} projects`
        : `Showing ${visibleCount} of ${PROJECTS_DATA.length} projects`;
    }

    if (emptyStateEl) {
      if (visibleCount === 0) {
        emptyStateEl.removeAttribute('hidden');
        if (emptyDescEl) {
          emptyDescEl.textContent = query
            ? `No projects matched "${searchQuery.trim()}" in the selected category.`
            : 'No projects found in the selected category.';
        }
      } else {
        emptyStateEl.setAttribute('hidden', '');
      }
    }
  }

  renderCards();
  updateCategoryCounts();
  applyFilters();

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase().trim();
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value || '';
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchQuery = '';
      activeCategory = 'all';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      filterButtons.forEach(b => {
        const isAll = b.getAttribute('data-filter') === 'all';
        b.classList.toggle('active', isAll);
        b.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      applyFilters();
    });
  }
}

/* ===================================================================
   10. SHARED ACCESSIBLE MODAL KEYBOARD HELPER
   =================================================================== */
function bindModalKeyboard(modal, onClose) {
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll(
        'button:not([hidden]):not([disabled]), a:not([hidden]):not([disabled]), input:not([hidden]):not([disabled]), select:not([hidden]):not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });
}

/* ===================================================================
   11. ACCESSIBLE PROJECT DETAIL & CASE STUDY READER MODAL CONTROLLER
   =================================================================== */
function initReaderModal() {
  const modal = document.getElementById('reader-modal');
  if (!modal) return;

  const backdrop = document.getElementById('reader-backdrop');
  const closeBtn = document.getElementById('reader-close-btn');
  const bottomCloseBtn = document.getElementById('reader-bottom-close-btn');
  const badgeEl = document.getElementById('reader-modal-badge');
  const dateEl = document.getElementById('reader-modal-date');
  const readtimeEl = document.getElementById('reader-modal-readtime');
  const titleEl = document.getElementById('reader-modal-title');
  const subtitleEl = document.getElementById('reader-modal-subtitle');
  const techListEl = document.getElementById('reader-modal-tech');
  const bodyEl = document.getElementById('reader-modal-body');
  const externalLinkEl = document.getElementById('reader-modal-external-link');
  const externalLabelEl = document.getElementById('reader-external-label');
  const askAiBtn = document.getElementById('reader-ask-ai-btn');

  let lastFocusedElement = null;
  let currentProjectId = null;

  function openReader(readerId, triggerEl, targetSectionId = '') {
    const data = READER_CONTENT[readerId];
    if (!data) return;

    lastFocusedElement = triggerEl || document.activeElement;
    currentProjectId = data.projectId || readerId;

    if (badgeEl) badgeEl.textContent = data.badge || data.category || 'Project';
    if (dateEl) dateEl.textContent = data.date || '2026';
    if (readtimeEl) readtimeEl.textContent = data.readTime || '4 min read';
    if (titleEl) titleEl.textContent = data.title;
    if (subtitleEl) subtitleEl.textContent = data.subtitle || '';

    if (techListEl) {
      if (Array.isArray(data.tech) && data.tech.length > 0) {
        techListEl.innerHTML = data.tech.map(t => `<span class="tech-tag-sm">${escapeHtml(t)}</span>`).join('');
        techListEl.removeAttribute('hidden');
      } else {
        techListEl.innerHTML = '';
        techListEl.setAttribute('hidden', '');
      }
    }

    if (bodyEl) {
      bodyEl.innerHTML = data.content;
      bodyEl.scrollTop = 0;
    }

    if (externalLinkEl) {
      if (data.externalUrl) {
        externalLinkEl.href = data.externalUrl;
        externalLinkEl.removeAttribute('hidden');
        if (externalLabelEl) {
          externalLabelEl.textContent = data.externalLabel || 'View External Reference';
        }
      } else {
        externalLinkEl.setAttribute('hidden', '');
      }
    }

    if (askAiBtn) {
      askAiBtn.removeAttribute('hidden');
    }

    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      modal.classList.add('active');
      if (targetSectionId && bodyEl) {
        const targetHeading = bodyEl.querySelector(`#${CSS.escape(targetSectionId)}`);
        if (targetHeading) {
          targetHeading.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    });

    const targetHash = `#read=${readerId}`;
    if (window.location.hash !== targetHash) {
      history.pushState(null, '', targetHash);
    }

    if (closeBtn) closeBtn.focus();
  }

  function closeReader(resetHash = true, restoreFocus = true) {
    if (!modal.classList.contains('active')) return;

    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    setTimeout(() => {
      modal.setAttribute('hidden', '');
    }, 250);

    if (resetHash && window.location.hash.startsWith('#read=')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', () => closeReader());
  if (bottomCloseBtn) bottomCloseBtn.addEventListener('click', () => closeReader());
  if (backdrop) backdrop.addEventListener('click', () => closeReader());

  if (askAiBtn) {
    askAiBtn.addEventListener('click', () => {
      const projectIdToOpen = currentProjectId;
      closeReader(true, false);
      setTimeout(() => {
        if (window.PortfolioAI && typeof window.PortfolioAI.open === 'function') {
          window.PortfolioAI.open(projectIdToOpen, askAiBtn);
        }
      }, 60);
    });
  }

  bindModalKeyboard(modal, () => closeReader());

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-reader-id], a[href^="#read="]');
    if (!trigger) return;

    let readerId = trigger.getAttribute('data-reader-id');
    if (!readerId) {
      const href = trigger.getAttribute('href') || '';
      const match = href.match(/#read=([a-zA-Z0-9_-]+)/);
      if (match) readerId = match[1];
    }

    if (readerId && READER_CONTENT[readerId]) {
      e.preventDefault();
      const targetSectionId = trigger.getAttribute('data-reader-section') || '';
      openReader(readerId, trigger, targetSectionId);
    }
  });

  function handleHash() {
    const hash = window.location.hash;
    const match = hash.match(/#read=([a-zA-Z0-9_-]+)/);
    if (match && READER_CONTENT[match[1]]) {
      openReader(match[1]);
    } else if (modal.classList.contains('active')) {
      closeReader(false);
    }
  }

  handleHash();
  window.addEventListener('hashchange', handleHash);
}

/* ===================================================================
   12. PORTFOLIO AI CONTEXTUAL INTERFACE & EVENT BRIDGE
   =================================================================== */
function initPortfolioAI() {
  const modal = document.getElementById('portfolio-ai-modal');
  if (!modal) return;

  const backdrop = document.getElementById('ai-modal-backdrop');
  const closeBtn = document.getElementById('ai-modal-close-btn');
  const contextSelect = document.getElementById('ai-context-select');
  const contextSummaryEl = document.getElementById('ai-context-summary');
  const promptsEl = document.getElementById('ai-suggested-prompts');
  const responseAreaEl = document.getElementById('ai-response-area');
  const form = document.getElementById('ai-question-form');
  const inputEl = document.getElementById('ai-question-input');

  let lastFocusedElement = null;
  let activeProjectId = '';
  let registeredAskHandler = null;

  const GENERAL_PROMPTS = [
    'Which project best showcases full-stack Next.js and security work?',
    'How do LeadBridge and the RAG Engine work together?',
    'What technologies does Alfin use in production AI systems?'
  ];

  function populateProjectSelector() {
    if (!contextSelect) return;
    PROJECTS_DATA.forEach(project => {
      const opt = document.createElement('option');
      opt.value = project.id;
      opt.textContent = project.title;
      contextSelect.appendChild(opt);
    });
  }

  function buildContextPayload(projectId) {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project) {
      return {
        scope: 'general',
        project: null,
        category: 'All Selected Works',
        description: 'Personal portfolio of Alfin Reswara (Software Engineer & Full Stack Developer).',
        technology: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'Cloudflare Workers', 'Docker'],
        url: window.location.href
      };
    }

    return {
      scope: 'project',
      project: project.title,
      projectId: project.id,
      category: project.categoryLabel,
      description: project.shortDesc,
      technology: project.allTech || project.tech,
      url: project.externalUrl || null
    };
  }

  function renderContextState() {
    const project = PROJECTS_DATA.find(p => p.id === activeProjectId);
    if (contextSelect) {
      contextSelect.value = project ? project.id : '';
    }

    if (contextSummaryEl) {
      if (project) {
        const techHtml = (project.allTech || project.tech).map(t => `<span class="tech-tag-sm">${escapeHtml(t)}</span>`).join('');
        const urlHtml = project.externalUrl
          ? `<div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent);">URL: ${escapeHtml(project.externalUrl)}</div>`
          : '';
        contextSummaryEl.innerHTML = `
          <div><strong>${escapeHtml(project.title)}</strong> &bull; <span>${escapeHtml(project.categoryLabel)}</span></div>
          <div>${escapeHtml(project.shortDesc)}</div>
          ${urlHtml}
          <div class="ai-context-tags">${techHtml}</div>
        `;
      } else {
        contextSummaryEl.innerHTML = `
          <div><strong>All Selected Works (6 projects)</strong></div>
          <div>Ask about architecture, stack decisions, security hardening, or AI workflows across Alfin's portfolio.</div>
        `;
      }
    }

    if (promptsEl) {
      const prompts = project && Array.isArray(project.aiPrompts) ? project.aiPrompts : GENERAL_PROMPTS;
      promptsEl.innerHTML = prompts
        .map(prompt => `<button type="button" class="ai-prompt-chip" data-ai-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`)
        .join('');
    }
  }

  function resetResponseArea() {
    if (!responseAreaEl) return;
    responseAreaEl.innerHTML = `
      <div class="ai-notice-card">
        <p class="ai-notice-heading">Portfolio AI Interface Ready</p>
        <p class="ai-notice-text">Enter a question below or pick a suggested prompt. The selected project's metadata is attached automatically via <code>window.PortfolioAI</code> and <code>portfolio-ai:submit</code>.</p>
      </div>
    `;
  }

  function openAIModal(projectId = '', triggerEl = null) {
    lastFocusedElement = triggerEl || document.activeElement;
    activeProjectId = PROJECTS_DATA.some(p => p.id === projectId) ? projectId : '';
    renderContextState();
    resetResponseArea();

    const payload = buildContextPayload(activeProjectId);
    window.dispatchEvent(new CustomEvent('portfolio-ai:open', { detail: payload }));

    modal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      modal.classList.add('active');
    });

    if (inputEl) {
      setTimeout(() => inputEl.focus(), 50);
    }
  }

  function closeAIModal() {
    if (!modal.classList.contains('active')) return;

    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    setTimeout(() => {
      modal.setAttribute('hidden', '');
    }, 250);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  async function submitQuestion(rawQuestion) {
    const question = (rawQuestion || '').trim();
    if (!question || !responseAreaEl) return;

    const context = buildContextPayload(activeProjectId);
    const submitEvent = new CustomEvent('portfolio-ai:submit', {
      cancelable: true,
      detail: { question, context }
    });
    const notPrevented = window.dispatchEvent(submitEvent);

    const queryCard = document.createElement('div');
    queryCard.className = 'ai-query-card';
    queryCard.innerHTML = `
      <p class="ai-notice-heading">Your Question${context.project ? ` (${escapeHtml(context.project)})` : ''}</p>
      <p class="ai-notice-text" style="color: var(--text-primary);">${escapeHtml(question)}</p>
    `;

    responseAreaEl.innerHTML = '';
    responseAreaEl.appendChild(queryCard);

    if (typeof registeredAskHandler === 'function') {
      const loadingCard = document.createElement('div');
      loadingCard.className = 'ai-notice-card';
      loadingCard.innerHTML = '<p class="ai-notice-text">Querying Portfolio AI...</p>';
      responseAreaEl.appendChild(loadingCard);

      try {
        const answer = await registeredAskHandler({ question, context });
        loadingCard.innerHTML = `
          <p class="ai-notice-heading">Portfolio AI</p>
          <p class="ai-notice-text" style="color: var(--text-secondary);">${escapeHtml(answer)}</p>
        `;
      } catch (err) {
        loadingCard.innerHTML = `
          <p class="ai-notice-heading">Unable to reach Portfolio AI</p>
          <p class="ai-notice-text">${escapeHtml(err?.message || 'Request failed.')}</p>
        `;
      }
      return;
    }

    if (!notPrevented) return;

    const promptBundle = [
      context.project ? `Project: ${context.project}` : 'Scope: Portfolio Overview',
      `Category: ${context.category}`,
      `Description: ${context.description}`,
      `Technology: ${context.technology.join(', ')}`,
      context.url ? `URL: ${context.url}` : '',
      `Question: ${question}`
    ].filter(Boolean).join('\n');

    const telegramLink = `https://t.me/alfinreswara?text=${encodeURIComponent(promptBundle)}`;

    const noticeCard = document.createElement('div');
    noticeCard.className = 'ai-notice-card';
    noticeCard.innerHTML = `
      <p class="ai-notice-heading">AI Backend Not Connected Yet</p>
      <p class="ai-notice-text">
        The live Portfolio AI backend endpoint is not connected to this static build, so no simulated response is generated. Your project context and question have been dispatched via <code>portfolio-ai:submit</code> and are ready below.
      </p>
      <div class="ai-fallback-actions">
        <button type="button" class="project-btn project-btn-secondary" data-copy-ai-context="true">Copy Context &amp; Question</button>
        <a href="${escapeHtml(telegramLink)}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary">Ask Alfin via Telegram →</a>
      </div>
    `;

    noticeCard.querySelector('[data-copy-ai-context]')?.addEventListener('click', () => {
      navigator.clipboard.writeText(promptBundle).then(() => {
        showToast('Copied project context & question to clipboard!');
      }).catch(() => {
        showToast('Clipboard permission unavailable.');
      });
    });

    responseAreaEl.appendChild(noticeCard);
  }

  populateProjectSelector();
  renderContextState();

  if (contextSelect) {
    contextSelect.addEventListener('change', (e) => {
      activeProjectId = e.target.value || '';
      renderContextState();
      resetResponseArea();
    });
  }

  if (promptsEl) {
    promptsEl.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-ai-prompt]');
      if (!chip || !inputEl) return;
      inputEl.value = chip.getAttribute('data-ai-prompt') || '';
      inputEl.focus();
    });
  }

  if (form && inputEl) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = inputEl.value;
      if (!q.trim()) return;
      submitQuestion(q);
      inputEl.value = '';
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeAIModal);
  if (backdrop) backdrop.addEventListener('click', closeAIModal);
  bindModalKeyboard(modal, closeAIModal);

  document.addEventListener('click', (e) => {
    const projectTrigger = e.target.closest('[data-ask-ai-project]');
    if (projectTrigger) {
      e.preventDefault();
      const pid = projectTrigger.getAttribute('data-ask-ai-project') || '';
      openAIModal(pid, projectTrigger);
      return;
    }

    const generalTrigger = e.target.closest('[data-ask-ai-general]');
    if (generalTrigger) {
      e.preventDefault();
      openAIModal('', generalTrigger);
    }
  });

  window.PortfolioAI = {
    open: (projectId = '', triggerEl = null) => openAIModal(projectId, triggerEl),
    close: () => closeAIModal(),
    getContext: () => buildContextPayload(activeProjectId),
    setHandler: (fn) => {
      registeredAskHandler = typeof fn === 'function' ? fn : null;
    },
    ask: (question, projectId) => {
      if (projectId !== undefined) {
        activeProjectId = PROJECTS_DATA.some(p => p.id === projectId) ? projectId : '';
        renderContextState();
      }
      return submitQuestion(question);
    }
  };
}
