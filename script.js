/* ═══════════════════════════════════════
   PROAD Events — script.js
   ═══════════════════════════════════════ */

const $ = id => document.getElementById(id);

const nav        = $('nav');
const liqRect    = $('liq-rect');
const badge      = $('events-badge');
const pWrap      = $('proad-wrap');
const pSvg       = $('proad-svg');
const tagline    = $('tagline');
const zoomOvl    = $('zoom-overlay');
const sceneHero  = $('scene-hero');
const sceneTruck = $('scene-truck');
const doorL      = $('door-l');
const doorR      = $('door-r');
const bals       = document.querySelectorAll('.balloon-wrap');
const bcard      = $('bcard');

let oCenter      = null;
let zoomDone     = false;
let balRisen     = false;

/* ─── NAV ─── */
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 50);
});

/* ─── Find O centre in SVG ─── */
function findO() {
  const ns = 'http://www.w3.org/2000/svg';
  const s  = document.createElementNS(ns, 'svg');
  s.setAttribute('viewBox', '0 0 780 160');
  s.style.cssText = 'position:absolute;visibility:hidden;width:780px;height:160px;left:-9999px;';
  document.body.appendChild(s);

  const t = document.createElementNS(ns, 'text');
  t.setAttribute('x', '50%'); t.setAttribute('y', '148');
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('font-family', "'Bebas Neue',sans-serif");
  t.setAttribute('font-size', '160'); t.setAttribute('letter-spacing', '14');
  t.textContent = 'PROAD'; s.appendChild(t);

  let fb, pb;
  try { fb = t.getBBox(); t.textContent = 'PR'; pb = t.getBBox(); }
  catch(e) { document.body.removeChild(s); return; }
  document.body.removeChild(s);

  const lw = fb.width / 5;
  const ox = pb.x + pb.width + lw * .5;
  const oy = 148 - 160 * .52;

  const sr = pSvg.getBoundingClientRect();
  const wr = pWrap.getBoundingClientRect();
  const sx = sr.width  / 780;
  const sy = sr.height / 160;

  oCenter = {
    x: ox * sx + (sr.left - wr.left),
    y: oy * sy + (sr.top  - wr.top),
    r: lw * sx * .38
  };

  badge.style.left = oCenter.x + 'px';
  badge.style.top  = oCenter.y + 'px';
}

window.addEventListener('load',   () => setTimeout(findO, 200));
window.addEventListener('resize', findO);

/* ─── HERO scroll ─── */
window.addEventListener('scroll', heroScroll, { passive: true });

function heroScroll() {
  const heroH = sceneHero.offsetHeight;

  /* Liquid fill: completes at 35% of hero scroll */
  const fillP = Math.min(scrollY / (heroH * .35), 1);
  liqRect.setAttribute('width', fillP * 780);

  /* EVENTS badge fades out */
  badge.style.opacity = Math.max(0, 1 - scrollY / 90);

  /* Tagline subtle parallax */
  tagline.style.transform = `translateY(${scrollY * .07}px)`;

  /* Zoom into O at 80% of hero scroll space */
  const zoomP = scrollY / (heroH * .8);
  if (zoomP >= 1 && !zoomDone) {
    zoomDone = true;
    doZoom();
  }
  if (zoomP < .85) zoomDone = false;
}

/* ─── Zoom into O → snap to ADN ─── */
function doZoom() {
  if (!oCenter) return;

  const wr = pWrap.getBoundingClientRect();
  const cx = wr.left + oCenter.x;
  const cy = wr.top  + oCenter.y;
  const px = (cx / window.innerWidth  * 100).toFixed(1) + '%';
  const py = (cy / window.innerHeight * 100).toFixed(1) + '%';

  /* Start closed */
  zoomOvl.style.transition = 'none';
  zoomOvl.style.clipPath   = `circle(0% at ${px} ${py})`;
  zoomOvl.style.pointerEvents = 'all';

  /* Expand to full screen */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    zoomOvl.style.transition = 'clip-path .85s cubic-bezier(.4,0,.2,1)';
    zoomOvl.style.clipPath   = `circle(150% at ${px} ${py})`;
  }));

  /* Snap to ADN section, then collapse overlay */
  setTimeout(() => {
    $('scene-adn').scrollIntoView({ behavior: 'instant' });
    zoomOvl.style.transition   = 'clip-path .5s ease';
    zoomOvl.style.clipPath     = 'circle(0% at 50% 50%)';
    zoomOvl.style.pointerEvents = 'none';
  }, 880);
}

/* ─── ROAD link → scroll to truck ─── */
$('road-link').addEventListener('click', () => {
  sceneTruck.scrollIntoView({ behavior: 'smooth' });
});

/* ─── TRUCK scroll ─── */
window.addEventListener('scroll', truckScroll, { passive: true });

function truckScroll() {
  const r     = sceneTruck.getBoundingClientRect();
  const total = sceneTruck.offsetHeight - window.innerHeight;
  const p     = Math.max(0, Math.min(1, -r.top / total));

  /* Phase 1 — WHY appears (0 → 0.18) */
  revealHalf($('gw-l'), p, .02, .18);
  revealHalf($('gw-r'), p, .02, .18);

  /* Phase 2 — PROAD? appears (0.20 → 0.38) */
  revealHalf($('gp-l'), p, .20, .38);
  revealHalf($('gp-r'), p, .20, .38);

  /* Phase 3 — doors open (0.38 → 0.64) */
  const dp = Math.max(0, Math.min(1, (p - .38) / .26));
  doorL.style.transform = `perspective(1000px) rotateY(-${dp * 80}deg)`;
  doorR.style.transform = `perspective(1000px) rotateY(${dp * 80}deg)`;

  /* Graffiti halves travel with doors */
  const sh = dp * 220;
  ['gw-l', 'gp-l'].forEach(id => $(id).style.transform = `translateX(-${sh}px)`);
  ['gw-r', 'gp-r'].forEach(id => $(id).style.transform = `translateX(${sh}px)`);

  /* Fade graffiti as doors fully open */
  const go = Math.max(0, 1 - (dp - .4) / .35);
  ['gw-l','gw-r','gp-l','gp-r'].forEach(id => {
    const el = $(id);
    if (parseFloat(el.style.opacity || 1) > 0) el.style.opacity = go;
  });

  /* Phase 4 — balloons rise (dp > 0.78) */
  if (dp > .78 && !balRisen) {
    balRisen = true;
    bals.forEach((b, i) => setTimeout(() => b.classList.add('risen'), i * 150));
  }
  if (dp < .55 && balRisen) {
    balRisen = false;
    bals.forEach(b => b.classList.remove('risen'));
  }
}

/* Grow a graffiti half from 0 to full width */
function revealHalf(el, p, s, e) {
  const t = Math.max(0, Math.min(1, (p - s) / (e - s)));
  if (!el._fw) {
    el.style.opacity = '1';
    el.style.width   = 'auto';
    el._fw = el.scrollWidth;
    el.style.width   = '0';
  }
  el.style.opacity = t > 0 ? '1' : '0';
  el.style.width   = (t * el._fw) + 'px';
}

/* ─── Balloon card ─── */
bals.forEach(b => b.addEventListener('click', () => {
  $('bc-l').textContent = b.dataset.l;
  $('bc-w').textContent = b.dataset.w;
  $('bc-d').textContent = b.dataset.d;
  bcard.classList.add('open');
  document.body.style.overflow = 'hidden';
}));

function closeCard() {
  bcard.classList.remove('open');
  document.body.style.overflow = '';
}
bcard.addEventListener('click', e => { if (e.target === bcard) closeCard(); });

/* ─── Reveal on scroll ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(r => io.observe(r));
