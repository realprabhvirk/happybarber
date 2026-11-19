/*
  Happy Barber, Ramgarh Sardaran.
  No contact form, no backend, no analytics, no cookies, no storage.
*/

// Runs first, from the head, so the page knows JS is on before it paints.
document.documentElement.classList.remove('no-js');

// One place for the WhatsApp number and the message wording.
const WA_NUMBER = '919877406519';
const WA_MESSAGE = (service) =>
  'Sat Sri Akal Happy, I want a ' + service + ' at your shop in Ramgarh Sardaran. Are you free today?';

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- WhatsApp links from data-service ---- */
  document.querySelectorAll('[data-service]').forEach((el) => {
    el.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_MESSAGE(el.dataset.service));
  });

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Mobile nav ---- */
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  const setNav = (open, returnFocus) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (!open && returnFocus) toggle.focus();
  };
  const navOpen = () => toggle && toggle.getAttribute('aria-expanded') === 'true';

  if (toggle && nav) {
    toggle.addEventListener('click', () => setNav(!navOpen(), false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOpen()) setNav(false, true);
    });
    document.addEventListener('click', (e) => {
      if (navOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) setNav(false, false);
    });
  }

  /* ---- Smooth scroll for same-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = id && document.getElementById(id);
      if (!target || reduceMotion.matches) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + id);
    });
  });

  /* ---- Sticky header: hide on scroll down, show on scroll up ---- */
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const busy = navOpen() || header.contains(document.activeElement);
      if (reduceMotion.matches || busy || y < 80 || y < lastY) {
        header.classList.remove('is-hidden');
      } else if (y > lastY + 4) {
        header.classList.add('is-hidden');
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  }
});
