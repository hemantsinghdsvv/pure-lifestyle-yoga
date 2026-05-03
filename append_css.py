css = '''
/* =============================================
   HERO SLIDER
   ============================================= */
.hero-slider {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  background-color: var(--charcoal-deep);
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.2s ease-in-out, transform 1.2s ease-in-out;
  transform: scale(1.05);
  z-index: 1;
  pointer-events: none;
}

.hero-slide.active {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
  pointer-events: auto;
}

.hero-slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.hero-slide-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.4) 60%, transparent 100%);
  z-index: 2;
}

.hero-slide .container {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 3;
}

.hero-slide-content {
  max-width: 650px;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
  transition-delay: 0.5s;
}

.hero-slide.active .hero-slide-content {
  opacity: 1;
  transform: translateY(0);
}

.hero-slider-nav {
  position: absolute;
  bottom: 40px;
  right: 5%;
  z-index: 10;
  display: flex;
  gap: 12px;
}

.hero-slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--white);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.hero-slider-dot.active {
  background: var(--white);
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .hero-slider { height: 90vh; min-height: 600px; }
  .hero-slide-bg::after {
    background: linear-gradient(to top, rgba(17,17,17,0.9) 0%, rgba(17,17,17,0.5) 100%);
  }
  .hero-slide-content { text-align: left; margin: 0 auto; padding-top: 5rem; }
  .hero-slider-nav { right: 1.25rem; bottom: 120px; }
}
'''

with open('assets/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)
