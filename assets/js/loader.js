/**
 * Pure Lifestyle Yoga — Logo Breathing Loader
 * Brand logo pulses with breathe in (blue) / breathe out (purple) animation.
 */
(function () {
  const MIN_DISPLAY = 4500;
  const start = Date.now();

  const css = `
  #pureLoader {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: #0d0b08;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
                 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: opacity 0.9s cubic-bezier(0.4,0,0.2,1),
                visibility 0.9s cubic-bezier(0.4,0,0.2,1);
  }
  #pureLoader.pl-out { opacity:0; visibility:hidden; pointer-events:none; }

  /* ── Logo scene ── */
  .pl-scene {
    position: relative;
    width: 220px;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Ripple rings */
  .pl-ripple {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid transparent;
    animation: plRipple 4.5s ease-out infinite;
    pointer-events: none;
  }
  .pl-ripple-2 { animation-delay: 0.5s; }
  .pl-ripple-3 { animation-delay: 1s;   }

  @keyframes plRipple {
    0%   { transform:scale(0.5);  border-color:rgba(100,200,255,0.8); opacity:1; }
    40%  { transform:scale(1.15); border-color:rgba(100,200,255,0);   opacity:0; }
    41%  { transform:scale(0.5);  border-color:rgba(200,140,255,0);   opacity:0; }
    55%  { transform:scale(0.5);  border-color:rgba(200,140,255,0.7); opacity:1; }
    100% { transform:scale(1.15); border-color:rgba(200,140,255,0);   opacity:0; }
  }

  /* Glow orb behind logo */
  .pl-orb-blue {
    position: absolute;
    inset: 5%;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(100,200,255,0.55) 0%,
      rgba(40,130,220,0.2) 50%,
      transparent 75%
    );
    filter: blur(18px);
    animation: plOrbBlue 4.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite;
  }
  @keyframes plOrbBlue {
    0%     { transform:scale(0.4); opacity:1; }
    42%    { transform:scale(1.2); opacity:1; }
    55%    { transform:scale(1.2); opacity:0; }
    100%   { transform:scale(0.4); opacity:1; }
  }

  .pl-orb-purple {
    position: absolute;
    inset: 5%;
    border-radius: 50%;
    background: radial-gradient(circle,
      rgba(210,150,255,0.55) 0%,
      rgba(130,50,210,0.2) 50%,
      transparent 75%
    );
    filter: blur(18px);
    animation: plOrbPurple 4.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite;
    opacity: 0;
  }
  @keyframes plOrbPurple {
    0%,45% { transform:scale(1.2); opacity:0;   }
    57%    { transform:scale(1.2); opacity:1;   }
    95%    { transform:scale(0.4); opacity:0.8; }
    100%   { transform:scale(0.4); opacity:0;   }
  }

  /* Logo */
  .pl-logo {
    position: relative;
    z-index: 5;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    animation: plLogoBreathe 4.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite;
    box-shadow: 0 0 0 3px rgba(184,151,58,0.25),
                0 8px 32px rgba(0,0,0,0.7);
    will-change: transform;
  }
  @keyframes plLogoBreathe {
    0%,100% { transform:scale(0.92); }
    42%,58% { transform:scale(1.08); }
  }

  /* Brand name */
  .pl-brand {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(210,190,145,0.55);
    text-align: center;
    position: relative;
    z-index: 6;
    margin-top: -1rem;
  }

  /* Breath text + progress bar */
  .pl-breath-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
    width: 180px;
  }
  .pl-breath-label {
    font-size: 0.66rem;
    font-weight: 400;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(220,200,155,0.5);
    transition: opacity 0.6s ease;
    min-height: 1em;
  }
  .pl-bar-track {
    width: 100%;
    height: 2px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
  }
  .pl-bar-fill {
    height: 100%;
    border-radius: 2px;
    width: 0%;
    animation: plBar 4.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite;
  }
  @keyframes plBar {
    0%     { width:0%;   background:#64C8FF; }
    42%    { width:100%; background:#64C8FF; }
    43%    { width:100%; background:#C87FFF; }
    100%   { width:0%;   background:#C87FFF; }
  }
  `;

  const html = `
    <div class="pl-scene">
      <div class="pl-ripple"></div>
      <div class="pl-ripple pl-ripple-2"></div>
      <div class="pl-ripple pl-ripple-3"></div>
      <div class="pl-orb-blue"></div>
      <div class="pl-orb-purple"></div>
      <img class="pl-logo" src="assets/images/logo.jpeg" alt="Pure Lifestyle Yoga" draggable="false"/>
    </div>
    <div class="pl-brand">Pure Lifestyle Yoga</div>
    <div class="pl-breath-wrap">
      <span class="pl-breath-label" id="plLabel">Breathe In</span>
      <div class="pl-bar-track"><div class="pl-bar-fill"></div></div>
    </div>
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'pureLoaderCSS';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const loader = document.createElement('div');
  loader.id = 'pureLoader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'Loading');
  loader.innerHTML = html;

  function mount() { document.body.insertBefore(loader, document.body.firstChild); }
  if (document.body) { mount(); }
  else { document.addEventListener('DOMContentLoaded', mount); }

  /* Sync text with 4.5s cycle */
  const label = loader.querySelector('#plLabel');
  let phase = 'in';
  const cycle = setInterval(() => {
    if (!label) return;
    label.style.opacity = '0';
    setTimeout(() => {
      phase = phase === 'in' ? 'out' : 'in';
      label.textContent = phase === 'in' ? 'Breathe In' : 'Breathe Out';
      label.style.opacity = '1';
    }, 600);
  }, 2250);

  function dismiss() {
    const elapsed = Date.now() - start;
    const delay = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(() => {
      loader.classList.add('pl-out');
      clearInterval(cycle);
      setTimeout(() => { loader.remove(); styleEl.remove(); }, 950);
    }, delay);
  }
  if (document.readyState === 'complete') { dismiss(); }
  else { window.addEventListener('load', dismiss); }
})();
