// ─── NAV scroll ───
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── LIQUID fill + O positioning ───
const liquidRect = document.getElementById('liquid-rect');
const svgEl      = document.getElementById('proad-svg');
const badge      = document.getElementById('events-badge');
const logoWrap   = document.getElementById('proad-logo');

let oCenter = null;
let filled  = false;

function findOCenter() {
  const ns = 'http://www.w3.org/2000/svg';
  const tmpSvg = document.createElementNS(ns, 'svg');
  tmpSvg.setAttribute('viewBox', '0 0 700 160');
  tmpSvg.style.cssText = 'position:absolute;visibility:hidden;width:700px;height:160px;';
  document.body.appendChild(tmpSvg);

  const txt = document.createElementNS(ns, 'text');
  txt.setAttribute('x', '50%');
  txt.setAttribute('y', '148');
  txt.setAttribute('text-anchor', 'middle');
  txt.setAttribute('font-family', "'Bebas Neue',sans-serif");
  txt.setAttribute('font-size', '160');
  txt.setAttribute('letter-spacing', '18');
  txt.textContent = 'PROAD';
  tmpSvg.appendChild(txt);

  let fullBox, prBox;
  try {
    fullBox = txt.getBBox();
    txt.textContent = 'PR';
    prBox = txt.getBBox();
  } catch(e) {
    document.body.removeChild(tmpSvg);
    return;
  }
  document.body.removeChild(tmpSvg);

  const letterW = fullBox.width / 5;
  const oX_vb   = prBox.x + prBox.width + letterW * 0.5;
  const oY_vb   = 148 - 160 * 0.55;

  const rect    = svgEl.getBoundingClientRect();
  const scaleX  = rect.width  / 700;
  const scaleY  = rect.height / 160;
  const wrapRect = logoWrap.getBoundingClientRect();

  const px = (oX_vb * scaleX) + (rect.left - wrapRect.left);
  const py = (oY_vb * scaleY) + (rect.top  - wrapRect.top);
  const r  = letterW * scaleX * 0.38;

  oCenter = { x: px, y: py, r };

  // Position EVENTS inside O
  badge.style.left = px + 'px';
  badge.style.top  = py + 'px';

  // O click zone
  let zone = document.getElementById('o-zone');
  if (!zone) {
    zone = document.createElement('div');
    zone.id = 'o-zone';
    zone.title = "Découvrir l'ADN PROAD";
    zone.addEventListener('click', triggerOZoom);
    logoWrap.appendChild(zone);
  }
  zone.style.cssText = `
    position: absolute;
    left: ${px - r}px;
    top:  ${py - r}px;
    width:  ${r * 2}px;
    height: ${r * 2}px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 20;
  `;
}

window.addEventListener('load',   () => setTimeout(findOCenter, 150));
window.addEventListener('resize', findOCenter);

// ─── Scroll-driven liquid fill ───
function onScroll() {
  const heroH    = document.getElementById('hero').offsetHeight;
  const scrollY  = window.scrollY;
  const progress = Math.min(scrollY / (heroH * 0.4), 1);

  // Liquid fill left → right
  liquidRect.setAttribute('width', progress * 700);

  // EVENTS badge fades out
  badge.style.opacity = Math.max(0, 1 - scrollY / 100);

  // Tagline parallax
  document.getElementById('tagline').style.transform =
    `translateY(${scrollY * 0.08}px)`;

  // Once fully filled: hint the O is clickable
  if (progress >= 1 && !filled) {
    filled = true;
    const zone = document.getElementById('o-zone');
    if (zone) zone.style.boxShadow = '0 0 0 2px rgba(26,71,255,.35)';
  }
}
window.addEventListener('scroll', onScroll, { passive: true });

// ─── Zoom into O ───
function triggerOZoom() {
  if (!oCenter) return;

  const wrapRect  = logoWrap.getBoundingClientRect();
  const screenX   = wrapRect.left + oCenter.x;
  const screenY   = wrapRect.top  + oCenter.y;

  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${screenX}px;
    top:  ${screenY}px;
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #080808;
    transform: translate(-50%,-50%) scale(1);
    z-index: 190;
    pointer-events: none;
    transition: transform .65s cubic-bezier(.4,0,.2,1), opacity .65s;
  `;
  document.body.appendChild(ripple);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ripple.style.transform = 'translate(-50%,-50%) scale(800)';
    });
  });

  setTimeout(() => {
    document.getElementById('o-overlay').classList.add('visible');
    document.body.style.overflow = 'hidden';
    ripple.remove();
  }, 550);
}

// ─── Close overlay ───
function closeOverlay() {
  document.getElementById('o-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}
document.getElementById('o-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeOverlay();
});

// ─── Reveal on scroll ───
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => io.observe(r));
