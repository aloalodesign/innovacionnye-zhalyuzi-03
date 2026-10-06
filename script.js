/* Инновационные ЖАЛЮЗИ — VERSION 02 interactions */
(function () {
  'use strict';

  /* ---------- header fixed on scroll ---------- */
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var t = hero ? hero.offsetHeight - 80 : 300;
    header.classList.toggle('is-fixed', window.scrollY > t);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = document.getElementById('mmenu-close');

  function openMenu() {
    menu.hidden = false;
    void menu.offsetHeight;
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 320);
  }
  if (burger && menu) {
    burger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- services rail ---------- */
  var rail = document.getElementById('rail');
  var prev = document.getElementById('rail-prev');
  var next = document.getElementById('rail-next');
  if (rail && prev && next) {
    function railStep() {
      var card = rail.querySelector('.svc');
      return card ? card.getBoundingClientRect().width + 20 : 320;
    }
    function syncRail() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      prev.disabled = rail.scrollLeft <= 2;
      next.disabled = rail.scrollLeft >= max;
    }
    prev.addEventListener('click', function () {
      rail.scrollBy({ left: -railStep(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      rail.scrollBy({ left: railStep(), behavior: 'smooth' });
    });
    rail.addEventListener('scroll', syncRail, { passive: true });
    window.addEventListener('resize', syncRail);
    syncRail();
  }

  /* ---------- lead popup ---------- */
  var popup = document.getElementById('popup');
  var lastFocus = null;

  function openPopup() {
    if (!popup) return;
    lastFocus = document.activeElement;
    popup.hidden = false;
    void popup.offsetHeight;
    popup.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var first = popup.querySelector('input, button');
    if (first) first.focus();
  }
  function closePopup() {
    if (!popup || popup.hidden) return;
    popup.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (!popup.classList.contains('is-open')) popup.hidden = true;
    }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (popup) {
    document.querySelectorAll('[data-popup]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPopup();
      });
    });
    popup.querySelectorAll('[data-popup-close]').forEach(function (el) {
      el.addEventListener('click', closePopup);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });

    var popupForm = document.getElementById('popup-form');
    if (popupForm) {
      popupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var done = document.getElementById('popup-done');
        if (done) {
          done.hidden = false;
          popupForm.querySelectorAll('input, button[type="submit"]').forEach(function (f) { f.disabled = true; });
        }
      });
    }
  }

  /* ---------- calculator ---------- */
  var form = document.getElementById('calc-form');
  if (form) {
    var size = document.getElementById('area');
    var sizeOut = document.getElementById('area-out');
    var sumEl = document.getElementById('calc-sum');
    var noteEl = document.getElementById('calc-note');
    var doneEl = document.getElementById('calc-done');
    var chipBtns = form.querySelectorAll('[data-obj]');
    var NOTE = 'Пришлите размеры — свяжемся с вами и рассчитаем заказ. Изготовление — до 7 дней.';

    function update() {
      var n = parseInt(size.value, 10);
      if (sizeOut && !isNaN(n)) sizeOut.textContent = n;
      if (noteEl) {
        noteEl.textContent = (!isNaN(n) ? 'Указан размер: ' + n + ' см. ' : '') + NOTE;
      }
    }

    chipBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        chipBtns.forEach(function (x) { x.classList.remove('is-on'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('is-on');
        b.setAttribute('aria-checked', 'true');
        if (sumEl) sumEl.textContent = b.textContent;
        update();
      });
    });
    size.addEventListener('input', update);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (doneEl) doneEl.hidden = false;
    });
  }
})();
