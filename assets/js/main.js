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
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = bookingForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Submitting…';
      btn.disabled = true;

      const data = {
        name: bookingForm.querySelector('[name="name"]')?.value || '',
        phone: bookingForm.querySelector('[name="phone"]')?.value || '',
        email: bookingForm.querySelector('[name="email"]')?.value || '',
        address: bookingForm.querySelector('[name="address"]')?.value || '',
        session: bookingForm.querySelector('[name="session"]')?.value || '',
        preferred_datetime: bookingForm.querySelector('[name="preferred_datetime"]')?.value || '',
        goal: bookingForm.querySelector('[name="goal"]')?.value || '',
      };

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          bookingForm.innerHTML = `
            <div class="form-success" style="display:block;text-align:center;padding:1rem 0">
              <div class="success-icon" style="font-size:2.5rem;margin-bottom:1rem">🌿</div>
              <h4 style="margin-bottom:0.5rem">Request Received!</h4>
              <p style="margin-bottom:1rem">We'll reach out within 24 hours to confirm your discovery session.</p>
              <div style="background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.4);border-radius:10px;padding:12px 20px;display:inline-block">
                <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--gold,#D4AF37);margin-bottom:4px">Your Reference</div>
                <div style="font-size:20px;font-weight:700;font-family:monospace;color:var(--charcoal-deep,#1a1a1a)">#${json.ref}</div>
              </div>
              <p style="margin-top:1rem;font-size:0.85rem;color:#888">A confirmation has been sent to your email.</p>
            </div>`;
        } else {
          btn.textContent = originalText;
          btn.disabled = false;
          alert(json.message || 'Something went wrong. Please try again.');
        }
      } catch (err) {
        // Fallback if server is offline
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Unable to connect. Please WhatsApp us at +91 93103 79955.');
      }
    });
  }

  // ── Contact form submit ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending Message...'; btn.disabled = true;

      const formData = {
        name: contactForm.name.value,
        phone: contactForm.phone.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
        preferred_datetime: contactForm.preferred_datetime.value,
        goal: contactForm.goal.value
      };

      try {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
          const successEl = document.getElementById('contactSuccess');
          const wrapEl = document.getElementById('contactFormWrap');
          
          if (wrapEl) wrapEl.style.display = 'none';
          if (successEl) {
            successEl.style.display = 'block';
            successEl.innerHTML = `
              <div class="success-icon" style="font-size:3rem; margin-bottom:1rem; text-align:center;">🌿</div>
              <h3 style="text-align:center; margin-bottom:1rem;">Message Sent!</h3>
              <p style="text-align:center; color:var(--text-muted); margin-bottom:1.5rem;">
                Thank you for reaching out, ${formData.name.split(' ')[0]}. We've received your enquiry and will respond within 24 hours.
              </p>
              <div style="background:var(--cream); border:1px solid var(--gold-pale); border-radius:var(--radius-md); padding:1rem; text-align:center; margin-bottom:1.5rem;">
                <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--gold); margin-bottom:4px;">Reference Number</div>
                <div style="font-size:1.2rem; font-weight:700; font-family:monospace;">#${result.ref}</div>
              </div>
              <a href="index.html" class="btn btn-primary" style="width:100%; justify-content:center;">Return Home</a>
            `;
          }
        } else {
          alert(result.message || 'Something went wrong. Please try again.');
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        alert('Unable to send message. Please WhatsApp us for immediate assistance.');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  // ── Partnership form submit ──
  const partnerForm = document.getElementById('partnerForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = partnerForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Processing Request...'; btn.disabled = true;

      const formData = {
        name: partnerForm.name.value,
        phone: 'N/A', 
        email: partnerForm.email.value,
        subject: `[Partnership] ${partnerForm.type.value} from ${partnerForm.org.value}`,
        message: `Organisation: ${partnerForm.org.value}\nPartnership Type: ${partnerForm.type.value}`,
        preferred_datetime: partnerForm.preferred_datetime.value,
        goal: partnerForm.goal.value
      };

      try {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
          const successEl = document.getElementById('partnerSuccess');
          const wrapEl = document.getElementById('partnerFormWrap');
          if (wrapEl) wrapEl.style.display = 'none';
          if (successEl) {
            successEl.style.display = 'block';
            const refEl = document.getElementById('partnerRef');
            if (refEl) refEl.textContent = `#${result.ref}`;
          }
        } else {
          alert(result.message || 'Something went wrong. Please try again.');
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        alert('Unable to send request. Please WhatsApp us at +91 93103 79955.');
        btn.textContent = originalText;
        btn.disabled = false;
      }
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

  // ── Hero Slider Logic ──
  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dots = heroSlider.querySelectorAll('.hero-slider-dot');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let sliderTimer;

    function goToSlide(index) {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      currentSlide = (index + totalSlides) % totalSlides;
      
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(sliderTimer);
        goToSlide(index);
        sliderTimer = setInterval(nextSlide, 6000);
      });
    });

    sliderTimer = setInterval(nextSlide, 6000);
  }

});
