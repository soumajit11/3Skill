/**
 * ═══════════════════════════════════════════════════════
 *  main.js — BingeBox Interactive Features
 * ═══════════════════════════════════════════════════════
 *
 *  Features:
 *  1.  Hero Carousel  — JS-driven auto-play, arrow & dot control,
 *                       pause-on-hover, keyboard navigation, touch/swipe
 *  2.  Theme Toggle   — localStorage persistence (replaces CSS-checkbox hack)
 *  3.  Navbar         — scroll-shrink, active-link highlight on scroll,
 *                       mobile hamburger toggle
 *  4.  Search         — live filter of visible cards as you type
 *  5.  Watchlist      — add/remove items stored in localStorage,
 *                       toast notifications, badge counter
 *  6.  Lazy Images    — IntersectionObserver fallback for data-src
 *  7.  Scroll Reveal  — fade-up strips when they enter the viewport
 *  8.  Card keyboard  — Enter / Space triggers play on focused cards
 * ═══════════════════════════════════════════════════════
 */

'use strict';

/* ─────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const LS = {
  get: (k, fallback = null) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? fallback; }
    catch { return fallback; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

/* ─────────────────────────────────────────────────────
   1.  HERO CAROUSEL
───────────────────────────────────────────────────── */
const Hero = (() => {
  const INTERVAL = 7000; // ms per slide
  let current = 0;
  let timer = null;
  let isHovered = false;
  let touchStartX = 0;

  const slides     = $$('.hero__slide');
  const dots       = $$('.hero__dots .dot');
  const radios     = $$('.slide-radio');          // keep in sync for CSS fallback
  const heroEl     = $('.hero');

  if (!slides.length) return;

  /* ── activate a specific slide ── */
  function goTo(idx) {
    current = (idx + slides.length) % slides.length;

    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      s.setAttribute('aria-hidden', i !== current);
    });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));

    // Keep hidden radio inputs in sync so CSS rules still apply
    if (radios[current]) radios[current].checked = true;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ── auto-play ── */
  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => { if (!isHovered) next(); }, INTERVAL);
  }

  /* ── arrow buttons (inside each slide) ── */
  heroEl.addEventListener('click', e => {
    const btn = e.target.closest('.arrow');
    if (!btn) return;
    btn.classList.contains('arrow--prev') ? prev() : next();
    startTimer(); // reset timer on manual navigation
  });

  /* ── dot clicks ── */
  heroEl.addEventListener('click', e => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    goTo(dots.indexOf(dot));
    startTimer();
  });

  /* ── pause on hover ── */
  heroEl.addEventListener('mouseenter', () => { isHovered = true; });
  heroEl.addEventListener('mouseleave', () => { isHovered = false; });

  /* ── keyboard (←  →  when hero is focused) ── */
  heroEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prev(); startTimer(); }
    if (e.key === 'ArrowRight') { next(); startTimer(); }
  });
  heroEl.setAttribute('tabindex', '-1'); // make focusable

  /* ── touch / swipe ── */
  heroEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  heroEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? next() : prev();
    startTimer();
  }, { passive: true });

  /* ── init ── */
  goTo(0);
  startTimer();

  return { goTo, next, prev };
})();


/* ─────────────────────────────────────────────────────
   2.  THEME TOGGLE  (localStorage persistence)
───────────────────────────────────────────────────── */
const Theme = (() => {
  const checkbox = $('#theme-toggle');
  const root     = document.documentElement;

  function apply(isDark) {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    // Mirror the checkbox state so the CSS icon rules still work
    if (checkbox) checkbox.checked = !isDark;
    LS.set('bb-theme', isDark ? 'dark' : 'light');
  }

  // Restore saved preference (default: dark)
  const saved = LS.get('bb-theme', 'dark');
  apply(saved === 'dark');

  if (checkbox) {
    checkbox.addEventListener('change', () => {
      // checkbox checked = light theme (sun icon)
      apply(!checkbox.checked);
    });
  }

  return { apply };
})();


/* ─────────────────────────────────────────────────────
   3.  NAVBAR
───────────────────────────────────────────────────── */
const Navbar = (() => {
  const navbar   = $('.navbar');
  const hamburger = $('.hamburger');
  const navMenu  = $('.navbar__nav');
  const navToggle = $('#nav-toggle');
  const navLinks = $$('.navbar__nav .nav-link');

  /* ── Scroll shrink ── */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('navbar--scrolled', y > 30);
    navbar.classList.toggle('navbar--hidden', y > lastScroll && y > 200);
    lastScroll = y;
  }, { passive: true });

  /* ── Active link on scroll ── */
  const sections = $$('section[id], main > *[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(l => {
        const href = l.getAttribute('href');
        l.classList.toggle('active', href === `#${id}`);
      });
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));

  /* ── Mobile hamburger (JS-driven, replaces checkbox hack) ── */
  function toggleMenu(open) {
    const isOpen = open ?? !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', isOpen);
    hamburger?.classList.toggle('is-open', isOpen);
    if (navToggle) navToggle.checked = isOpen; // keep CSS fallback in sync
    hamburger?.setAttribute('aria-expanded', isOpen);
  }

  hamburger?.addEventListener('click', () => toggleMenu());

  // Close menu on nav link click (mobile)
  navLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) toggleMenu(false);
  });
})();


/* ─────────────────────────────────────────────────────
   4.  LIVE SEARCH
───────────────────────────────────────────────────── */
const Search = (() => {
  const input = $('.search-input');
  if (!input) return;

  let debounce;

  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      filterCards(q);
    }, 150);
  });

  // Press Esc to clear
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.value = ''; filterCards(''); input.blur(); }
  });

  function filterCards(q) {
    const cards = $$('.card');
    let matchCount = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const matches = !q || text.includes(q);
      card.style.display = matches ? '' : 'none';
      card.style.opacity = matches ? '' : '0';
      if (matches) matchCount++;
    });

    // Show/hide no-results message per strip
    $$('.content-strip').forEach(strip => {
      const visible = $$('.card', strip).filter(c => c.style.display !== 'none');
      let msg = $('.no-results', strip);
      if (!visible.length && q) {
        if (!msg) {
          msg = document.createElement('p');
          msg.className = 'no-results';
          msg.textContent = `No results for "${q}"`;
          $('.cards-row', strip)?.after(msg);
        }
        msg.hidden = false;
      } else if (msg) {
        msg.hidden = true;
      }
    });
  }
})();


/* ─────────────────────────────────────────────────────
   5.  WATCHLIST  (localStorage + toast + badge)
───────────────────────────────────────────────────── */
const Watchlist = (() => {
  let list = LS.get('bb-watchlist', []);

  /* ── Toast ── */
  let toastTimer;
  function showToast(msg, type = 'add') {
    let toast = $('#bb-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bb-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `bb-toast bb-toast--${type} is-visible`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  /* ── Badge on profile button ── */
  function updateBadge() {
    let badge = $('.watchlist-badge');
    if (!list.length) { badge?.remove(); return; }
    const profileBtn = $('.profile-btn');
    if (!profileBtn) return;
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'watchlist-badge';
      profileBtn.appendChild(badge);
    }
    badge.textContent = list.length;
  }

  /* ── Toggle a title in/out of watchlist ── */
  function toggle(title, btn) {
    const idx = list.indexOf(title);
    if (idx === -1) {
      list.push(title);
      btn.classList.add('in-watchlist');
      btn.textContent = '✓ Watchlist';
      showToast(`"${title}" added to Watchlist`, 'add');
    } else {
      list.splice(idx, 1);
      btn.classList.remove('in-watchlist');
      btn.textContent = '+ Watchlist';
      showToast(`"${title}" removed from Watchlist`, 'remove');
    }
    LS.set('bb-watchlist', list);
    updateBadge();
  }

  /* ── Wire up hero watchlist buttons ── */
  function initHeroButtons() {
    $$('.hero__actions .btn--ghost').forEach(btn => {
      const slide = btn.closest('.hero__slide');
      const title = $('.hero__title', slide)?.textContent?.trim() ?? 'Unknown';
      if (list.includes(title)) {
        btn.classList.add('in-watchlist');
        btn.textContent = '✓ Watchlist';
      }
      btn.addEventListener('click', () => toggle(title, btn));
    });
  }

  /* ── Wire up card watchlist buttons (delegated) ── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.card__watchlist');
    if (!btn) return;
    const card = btn.closest('.card');
    const title = $('.card__title', card)?.textContent?.trim() ?? 'Unknown';
    toggle(title, btn);
  });

  initHeroButtons();
  updateBadge();
  return { list, toggle };
})();


/* ─────────────────────────────────────────────────────
   6.  LAZY IMAGE LOADING  (data-src fallback)
───────────────────────────────────────────────────── */
const LazyLoad = (() => {
  const imgs = $$('img[data-src]');
  if (!imgs.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const src = img.dataset.src;
      if (src) {
        // Try local src first; if it 404s, swap in the data-src
        img.addEventListener('error', () => {
          if (img.src !== src) img.src = src;
        }, { once: true });
        // If the current src already failed (broken), load fallback now
        if (!img.complete || img.naturalWidth === 0) img.src = src;
      }
      obs.unobserve(img);
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
})();


/* ─────────────────────────────────────────────────────
   7.  SCROLL REVEAL  (fade-up strips)
───────────────────────────────────────────────────── */
const ScrollReveal = (() => {
  const targets = $$('.content-strip, .footer');
  if (!targets.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  targets.forEach(t => {
    t.classList.add('reveal-pending');
    io.observe(t);
  });
})();


/* ─────────────────────────────────────────────────────
   8.  CARD KEYBOARD NAVIGATION
───────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const card = document.activeElement?.closest('.card');
  if (!card) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const title = $('.card__title', card)?.textContent ?? 'this title';
    showPlayModal(title);
  }
});


/* ─────────────────────────────────────────────────────
   PLAY MODAL  (lightweight, no library needed)
───────────────────────────────────────────────────── */
function showPlayModal(title) {
  // Remove any existing
  $('#bb-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'bb-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', `Play ${title}`);
  modal.innerHTML = `
    <div class="modal__backdrop"></div>
    <div class="modal__box">
      <button class="modal__close" aria-label="Close">&times;</button>
      <div class="modal__icon">▶</div>
      <h2 class="modal__title">${title}</h2>
      <p class="modal__sub">This is a portfolio demo — no actual video is available.</p>
      <button class="modal__play-btn btn btn--primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
        Play Now
      </button>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));

  function close() {
    modal.classList.remove('is-open');
    modal.addEventListener('transitionend', () => modal.remove(), { once: true });
  }

  modal.querySelector('.modal__close').addEventListener('click', close);
  modal.querySelector('.modal__backdrop').addEventListener('click', close);
  modal.querySelector('.modal__play-btn').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
}

/* Wire play buttons on cards */
document.addEventListener('click', e => {
  const btn = e.target.closest('.card__play');
  if (!btn) return;
  const card = btn.closest('.card');
  const title = $('.card__title', card)?.textContent?.trim() ?? 'this title';
  showPlayModal(title);
});

/* Wire hero play buttons */
document.addEventListener('click', e => {
  const btn = e.target.closest('.hero__actions .btn--primary');
  if (!btn) return;
  const slide = btn.closest('.hero__slide');
  const title = $('.hero__title', slide)?.textContent?.trim() ?? 'this title';
  showPlayModal(title);
});
