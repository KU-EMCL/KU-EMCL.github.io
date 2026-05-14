/* =============================================
   EMCL Lab - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ── Hero Slider ──────────────────────────────
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let timer;

  function showSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[idx]) slides[idx].classList.add('active');
    if (dots[idx])   dots[idx].classList.add('active');
    current = idx;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function startTimer() {
    timer = setInterval(nextSlide, 4000);
  }

  if (slides.length > 0) {
    showSlide(0);
    startTimer();

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        showSlide(i);
        startTimer();
      });
    });
  }

  // ── Mobile Nav Toggle ────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const gnbNav    = document.querySelector('#gnb nav');

  if (navToggle && gnbNav) {
    navToggle.addEventListener('click', () => {
      gnbNav.classList.toggle('open');
    });
  }

  // ── Active Nav Link ──────────────────────────
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#gnb a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ── Smooth scroll for anchor links ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
