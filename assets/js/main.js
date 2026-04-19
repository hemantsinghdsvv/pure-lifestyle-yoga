/* ==========================================
   PURE LIFESTYLE YOGA — Global JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Mobile nav toggle ──
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === './') || href === currentPage) {
      link.classList.add('active');
    }
  });

  // ── Hero modal popup (homepage only) ──
  const modalOverlay = document.getElementById('bookingModal');
  if (modalOverlay) {
    // Show after 10–15s (random) if not dismissed this session
    const dismissed = sessionStorage.getItem('modalDismissed');
    if (!dismissed) {
      const delay = Math.floor(Math.random() * 5000) + 10000; // 10000–15000 ms
      setTimeout(() => openModal(), delay);
    }
    // Close btn
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal());
    });
    // Click outside
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal() {
    if (modalOverlay) { modalOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      sessionStorage.setItem('modalDismissed', 'true');
    }
  }
  // Open modal on CTA clicks
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  });

  // ── Booking form submit ──
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = bookingForm.querySelector('[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        bookingForm.innerHTML = `
          <div class="form-success" style="display:block">
            <div class="success-icon">🌿</div>
            <h4>You're Booked!</h4>
            <p>Thank you! We'll reach out within 24 hours to confirm your discovery session.</p>
          </div>`;
      }, 1200);
    });
  }

  // ── Contact form submit ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...'; btn.disabled = true;
      setTimeout(() => {
        contactForm.style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
      }, 1200);
    });
  }

  // ── Scroll animations (IntersectionObserver) ──
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  // ── Testimonials Slider ──
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.slider-dot');
  if (track && dots.length) {
    let current = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let cardWidth = () => {
      if (window.innerWidth <= 768) return 100;
      if (window.innerWidth <= 1024) return 50;
      return 33.333;
    };
    let perSlide = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    let maxSlide = () => Math.max(0, total - perSlide());

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxSlide()));
      const pct = current * (100 / total);
      track.style.transform = `translateX(-${pct}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-advance
    let autoTimer = setInterval(() => goTo((current + 1) > maxSlide() ? 0 : current + 1), 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => goTo((current + 1) > maxSlide() ? 0 : current + 1), 5000);
    });
    // Touch support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });
    window.addEventListener('resize', () => goTo(0));
    goTo(0);
  }

  // ── Membership filter tabs ──
  const filterTabs = document.querySelectorAll('.filter-tab');
  const membershipCategories = document.querySelectorAll('.membership-category');
  if (filterTabs.length && membershipCategories.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.filter;
        membershipCategories.forEach(cat => {
          if (target === 'all' || cat.dataset.category === target) {
            cat.classList.add('visible');
          } else {
            cat.classList.remove('visible');
          }
        });
      });
    });
    // Show all by default
    filterTabs[0]?.click();
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const topOffset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    });
  });

  // ── Number counter animation ──
  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 16);
  }
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObserver.observe(el));
  }

});
