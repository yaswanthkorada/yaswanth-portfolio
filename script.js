/**
 * script.js — Yaswanth Korada Portfolio
 * ============================================================
 * Responsibilities:
 *  1. Fetch and render content from content.json
 *  2. Dark / Light theme toggle (persists to localStorage)
 *  3. Sticky nav scroll behaviour
 *  4. Smooth scroll (honouring prefers-reduced-motion)
 *  5. IntersectionObserver reveal animations
 *  6. Mobile menu toggle
 *  7. Contact form validation → prefilled mailto
 *  8. Footer copyright year
 * ============================================================
 */

'use strict';

/* ============================================================
   THEME — initialise as early as possible to avoid FOUC
   ============================================================ */
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();


/* ============================================================
   MAIN — run after DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {

  /* ── 1. Load content data ── */
  let data = null;
  try {
    const res = await fetch('./content.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error('[Portfolio] Failed to load content.json:', err);
    // Fall back — page still works from static HTML; don't break anything
  }

  if (data) {
    populateLinks(data);
    populateAbout(data);
    populateStats(data);
    renderTimeline(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    applyResumeVisibility(data.resumeAvailable);
  }

  /* ── 2. Theme toggle ── */
  setupThemeToggle();

  /* ── 3. Sticky nav ── */
  setupStickyNav();

  /* ── 4. Mobile menu ── */
  setupMobileMenu();

  /* ── 5. Smooth scroll ── */
  setupSmoothScroll();

  /* ── 6. Reveal animations ── */
  setupRevealObserver();

  /* ── 7. Contact form ── */
  setupContactForm(data);

  /* ── 8. Footer year ── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});


/* ------------------------------------------------------------
   CONTENT POPULATION HELPERS
   ------------------------------------------------------------ */

/** Populate all dynamic href / text from content.json links */
/** Show or hide all résumé download buttons based on the flag in content.json */
function applyResumeVisibility(available) {
  // Selects every element that has a [download] attribute (all résumé buttons)
  document.querySelectorAll('[download]').forEach(el => {
    if (available === false) {
      el.style.display = 'none';          // hide the button completely
    } else {
      el.style.display = '';              // restore default display
    }
  });
}

function populateLinks(data) {
  const email    = data.email    || null;
  const github   = data.links?.github || '#';
  const linkedin = data.links?.linkedin || '#';

  // Hero social icons
  setHref('heroEmailLink',    email ? `mailto:${email}` : '#');
  setHref('heroGithubLink',   github);
  setHref('heroLinkedinLink', linkedin);

  // Contact section
  setHref('contactEmailLink',    email ? `mailto:${email}?subject=Hello%20Yaswanth` : '#');
  setHref('contactGithubLink',   github);
  setHref('contactLinkedinLink', linkedin);

  setText('contactEmailDisplay',    email    || 'TODO_your_email@example.com');
  setText('contactGithubDisplay',   github !== '#'
    ? github.replace('https://', '')
    : 'github.com/TODO_username');
  setText('contactLinkedinDisplay', linkedin !== '#'
    ? linkedin.replace('https://', '')
    : 'linkedin.com/in/TODO_handle');
}

function populateAbout(data) {
  setText('aboutText', data.about || '');
}

function populateStats(data) {
  const s = data.stats || {};
  setText('statFollowers',   formatNum(s.followers));
  setText('statConnections', s.connections || '500+');
  setText('statViews',       formatNum(s.profileViews7d));
  setText('statImpressions', formatNum(s.postImpressions7d));
  setText('statSearch',      formatNum(s.searchAppearances7d));
}


/* ------------------------------------------------------------
   RENDER TIMELINE
   ------------------------------------------------------------ */
function renderTimeline(experience) {
  const container = document.getElementById('experienceTimeline');
  if (!container || !Array.isArray(experience)) return;

  container.innerHTML = experience.map((job, i) => `
    <li class="timeline-item reveal" style="--reveal-delay: ${i * 0.12}s">
      <article class="timeline-card">
        <div class="timeline-card__header">
          <div class="timeline-card__meta">
            <h3 class="timeline-card__company">${escHtml(job.company)}</h3>
            <p class="timeline-card__role">${escHtml(job.role)}</p>
            <div class="timeline-card__info">
              <span>
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                ${escHtml(job.start)} – ${escHtml(job.end)}
                ${job.duration ? `<span class="text-subtle">(${escHtml(job.duration)})</span>` : ''}
              </span>
              <span>
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                ${escHtml(job.location)}
              </span>
            </div>
          </div>
          <span class="timeline-card__badge">${escHtml(job.type || 'Full-time')}</span>
        </div>

        ${Array.isArray(job.bullets) ? `
          <ul class="timeline-card__bullets">
            ${job.bullets.map(b => `<li>${escHtml(b)}</li>`).join('')}
          </ul>
        ` : ''}

        ${Array.isArray(job.skills) ? `
          <div class="timeline-card__skills" role="list" aria-label="Skills used at ${escHtml(job.company)}">
            ${job.skills.map(s => `<span class="skill-chip" role="listitem">${escHtml(s)}</span>`).join('')}
          </div>
        ` : ''}
      </article>
    </li>
  `).join('');

  // Re-run observer for freshly injected elements
  observeRevealElements();
}


/* ------------------------------------------------------------
   RENDER PROJECTS
   ------------------------------------------------------------ */
function renderProjects(projects) {
  const container = document.getElementById('projectsGrid');
  if (!container || !Array.isArray(projects)) return;

  container.innerHTML = projects.map((proj, i) => {
    const hasDemo = proj.links?.demo && proj.links.demo !== '';
    const hasCode = proj.links?.code && proj.links.code !== '';

    return `
    <article class="project-card reveal" role="listitem" style="--reveal-delay: ${i * 0.1}s"
      aria-label="${escHtml(proj.name)} project">
      <div class="project-card__header">
        <div>
          <h3 class="project-card__name">${escHtml(proj.name)}</h3>
          <p class="project-card__tagline">${escHtml(proj.tagline || '')}</p>
        </div>
        <div class="project-card__links">
          ${hasDemo ? `
            <a class="project-card__link" href="${escHtml(proj.links.demo)}" target="_blank"
              rel="noopener noreferrer" aria-label="Live demo for ${escHtml(proj.name)}">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          ` : `
            <span class="project-card__link project-card__link--disabled"
              aria-label="No live demo available" title="Demo not available">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </span>
          `}
          ${hasCode ? `
            <a class="project-card__link" href="${escHtml(proj.links.code)}" target="_blank"
              rel="noopener noreferrer" aria-label="Source code for ${escHtml(proj.name)}">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
                0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
                -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
                .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385
                1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405
                3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18
                .765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095
                .81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24
                12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          ` : `
            <span class="project-card__link project-card__link--disabled"
              aria-label="Source code not public" title="Code not public">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
          `}
        </div>
      </div>

      <p class="project-card__summary">${escHtml(proj.summary)}</p>

      ${Array.isArray(proj.highlights) ? `
        <ul class="project-card__highlights" aria-label="Key highlights">
          ${proj.highlights.slice(0, 4).map(h => `<li>${escHtml(h)}</li>`).join('')}
        </ul>
      ` : ''}

      ${Array.isArray(proj.tags) ? `
        <div class="project-card__tags" role="list" aria-label="Technologies used">
          ${proj.tags.map(t => `<span class="tag" role="listitem">${escHtml(t)}</span>`).join('')}
        </div>
      ` : ''}
    </article>
  `;
  }).join('');

  observeRevealElements();
}


/* ------------------------------------------------------------
   RENDER SKILLS
   ------------------------------------------------------------ */

/** Human-readable labels & icons for each skill group key */
const SKILL_GROUP_META = {
  genAI:    { label: 'GenAI & LLMs',            icon: '🤖' },
  agentic:  { label: 'Agentic Systems',          icon: '🕸️' },
  rag:      { label: 'Advanced RAG',             icon: '🔍' },
  llmops:   { label: 'LLMOps & Evaluation',      icon: '📊' },
  backend:  { label: 'Backend & Security',       icon: '⚙️'  },
  cloud:    { label: 'Cloud & DevOps',           icon: '☁️'  },
  data:     { label: 'Data Engineering',         icon: '🗄️' },
};

function renderSkills(skills) {
  const container = document.getElementById('skillsGrid');
  if (!container || !skills) return;

  const html = Object.entries(skills).map(([key, chips]) => {
    const meta = SKILL_GROUP_META[key] || { label: key, icon: '•' };
    return `
      <div class="skill-group reveal">
        <h3 class="skill-group__title">
          <span class="skill-group__icon" aria-hidden="true">${meta.icon}</span>
          ${escHtml(meta.label)}
        </h3>
        <div class="skill-group__chips" role="list" aria-label="${escHtml(meta.label)} skills">
          ${Array.isArray(chips)
            ? chips.map(c => `<span class="skill-chip" role="listitem">${escHtml(c)}</span>`).join('')
            : ''}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
  observeRevealElements();
}


/* ------------------------------------------------------------
   THEME TOGGLE
   ------------------------------------------------------------ */
function setupThemeToggle() {
  const toggles = document.querySelectorAll('#themeToggle, #themeToggleFooter');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      // Sync theme-color meta tag
      document.querySelector('meta[name="theme-color"][media*="dark"]')
        ?.setAttribute('content', next === 'dark' ? '#0B1220' : '#F7F9FC');
    });
  });
}


/* ------------------------------------------------------------
   STICKY NAV
   ------------------------------------------------------------ */
function setupStickyNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: '-80px 0px 0px 0px', threshold: 0 }
  );
  // Observe a sentinel just below the hero
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:100px;height:1px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}


/* ------------------------------------------------------------
   MOBILE MENU
   ------------------------------------------------------------ */
function setupMobileMenu() {
  const btn  = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  };

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    menu.hidden = isOpen;
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) close();
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) { close(); btn.focus(); }
  });
}


/* ------------------------------------------------------------
   SMOOTH SCROLL (respects reduced-motion)
   ------------------------------------------------------------ */
function setupSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? 'instant' : 'smooth', block: 'start' });
      // Update focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}


/* ------------------------------------------------------------
   INTERSECTION OBSERVER — REVEAL ANIMATIONS
   ------------------------------------------------------------ */
let revealObserver = null;

function setupRevealObserver() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Skip animation — make everything visible immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Apply optional stagger delay from --reveal-delay CSS custom property
          const delay = el.style.getPropertyValue('--reveal-delay') || '0s';
          el.style.transitionDelay = delay;
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  observeRevealElements();
}

function observeRevealElements() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
    revealObserver.observe(el);
  });
}


/* ------------------------------------------------------------
   CONTACT FORM → MAILTO
   ------------------------------------------------------------ */
function setupContactForm(data) {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const email = data?.email || '';

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate
    let valid = true;

    const name    = form.elements['name'];
    const emailF  = form.elements['email'];
    const subject = form.elements['subject'];
    const message = form.elements['message'];

    valid = validateField(name,    'errName',    'Please enter your name.')       && valid;
    valid = validateEmail(emailF,  'errEmail')                                      && valid;
    valid = validateField(message, 'errMessage', 'Please enter a message.')       && valid;

    if (!valid) return;

    // Build mailto
    const subjectLine   = subject.value.trim() || 'Hello from your portfolio';
    const body          = `Hi Yaswanth,\n\n${message.value.trim()}\n\nBest,\n${name.value.trim()}`;
    const mailtoRecipient = email || 'TODO_your_email@example.com';

    const href = `mailto:${encodeURIComponent(mailtoRecipient)}`
      + `?subject=${encodeURIComponent(subjectLine)}`
      + `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  });

  // Live clear errors
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const errId = `err${capitalize(input.name)}`;
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  });
}

function validateField(input, errId, message) {
  if (!input.value.trim()) {
    showError(input, errId, message);
    return false;
  }
  return true;
}

function validateEmail(input, errId) {
  const val = input.value.trim();
  if (!val) { showError(input, errId, 'Please enter your email address.'); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    showError(input, errId, 'Please enter a valid email address.'); return false;
  }
  return true;
}

function showError(input, errId, message) {
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  const errEl = document.getElementById(errId);
  if (errEl) errEl.textContent = message;
}


/* ------------------------------------------------------------
   UTILITY FUNCTIONS
   ------------------------------------------------------------ */

/** Set element text content by id, safely */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/** Set element href by id */
function setHref(id, href) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('href', href);
}

/** Format large numbers with locale commas */
function formatNum(n) {
  if (n == null) return '—';
  return Number(n).toLocaleString('en-US');
}

/** Capitalise first letter */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape HTML special characters to prevent XSS
 * (content.json is local, but good practice)
 */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
