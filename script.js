/* ═══════════════════════════════════════
   PROAD Events — script.js
   ═══════════════════════════════════════ */

const $ = id => document.getElementById(id);

const nav    = $('nav');
const wc     = document.querySelector('.word-container');
const tO     = document.querySelector('.target-o');
const lets   = document.querySelectorAll('.letter');
const badge  = $('events-badge');
const tline  = $('tagline');
const scue   = $('scroll-cue');
const sTruck = $('scene-truck');
const dL     = $('door-l');
const dR     = $('door-r');
const bals   = document.querySelectorAll('.balloon-wrap');
const bcard  = $('bcard');

let balRisen = false;
let snapDone = false;

/* ── NAV ── */
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

/* ── EVENTS badge inside O ── */
function posBadge() {
  const r = tO.getBoundingClientRect();
  const w = document.querySelector('.sticky-wrapper').getBoundingClientRect();
  badge.style.left = (r.left - w.left + r.width  / 2) + 'px';
  badge.style.top  = (r.top  - w.top  + r.height / 2) + 'px';
}
window.addEventListener('load',   () => setTimeout(posBadge, 100));
window.addEventListener('resize', posBadge);

/* ══════════════════════════════════════
   HERO — zoom sniper dans le O
══════════════════════════════════════ */
window.addEventListener('scroll', heroScroll, { passive: true });

function heroScroll() {
  const s = scrollY;

  /* 1. Remplissage bleu lettre par lettre */
  lets.forEach((l, i) => {
    if (s > i * 120) l.classList.add('filled');
    else l.classList.remove('filled');
  });

  /* 2. Fade badge / tagline / scroll cue */
  badge.style.opacity = Math.max(0, 1 - s / 80);
  tline.style.opacity = Math.max(0, 1 - s / 200);
  scue.style.opacity  = Math.max(0, 1 - s / 150);

  /* 3. Zoom sniper dans le O */
  if (s > 400 && s < 3200) {
    const prog  = s - 400;
    const scale = 1 + Math.pow(prog / 260, 3.5);

    const rect   = tO.getBoundingClientRect();
    const offsetX = (window.innerWidth  / 2) - (rect.left + rect.width  / 2);
    const offsetY = (window.innerHeight / 2) - (rect.top  + rect.height / 2);

    wc.style.transform = `translate(${offsetX*(scale/2.5)}px, ${offsetY*(scale/2.5)}px) scale(${scale})`;

    if (scale > 15) {
      const fade = Math.max(0, 1 - (scale - 15) / 10);
      wc.style.opacity = fade;

      /* Snap vers ADN une fois complètement fondu */
      if (fade === 0 && !snapDone) {
        snapDone = true;
        setTimeout(() => {
          $('scene-adn').scrollIntoView({ behavior: 'instant' });
          wc.style.transform = '';
          wc.style.opacity   = '1';
          lets.forEach(l => l.classList.add('filled'));
          setTimeout(() => { snapDone = false; }, 1000);
        }, 80);
      }
    } else {
      wc.style.opacity = '1';
    }

  } else if (s <= 400) {
    wc.style.transform = '';
    wc.style.opacity   = '1';
  }
}

/* ── ROAD link → scroll vers le camion ── */
$('road-link').addEventListener('click', () => {
  sTruck.scrollIntoView({ behavior: 'smooth' });
});

/* ══════════════════════════════════════
   TRUCK scroll
══════════════════════════════════════ */
window.addEventListener('scroll', truckScroll, { passive: true });

function truckScroll() {
  const r     = sTruck.getBoundingClientRect();
  const total = sTruck.offsetHeight - window.innerHeight;
  const p     = Math.max(0, Math.min(1, -r.top / total));

  /* Graffiti apparaît depuis le centre */
  rH($('gw-l'), p, .02, .18);
  rH($('gw-r'), p, .02, .18);
  rH($('gp-l'), p, .20, .38);
  rH($('gp-r'), p, .20, .38);

  /* Ouverture des portes */
  const dp = Math.max(0, Math.min(1, (p - .38) / .26));
  dL.style.transform = `perspective(1100px) rotateY(-${dp * 82}deg)`;
  dR.style.transform = `perspective(1100px) rotateY(${dp * 82}deg)`;

  /* Graffiti voyage avec les portes */
  const sh = dp * 240;
  ['gw-l', 'gp-l'].forEach(id => $(id).style.transform = `translateX(-${sh}px)`);
  ['gw-r', 'gp-r'].forEach(id => $(id).style.transform = `translateX(${sh}px)`);

  /* Fade graffiti en s'ouvrant */
  const go = Math.max(0, 1 - (dp - .4) / .35);
  ['gw-l','gw-r','gp-l','gp-r'].forEach(id => {
    const el = $(id);
    if (parseFloat(el.style.opacity || 1) > 0) el.style.opacity = go;
  });

  /* Ballons montent une fois les portes ouvertes */
  if (dp > .78 && !balRisen) {
    balRisen = true;
    bals.forEach((b, i) => setTimeout(() => b.classList.add('risen'), i * 160));
  }
  if (dp < .55 && balRisen) {
    balRisen = false;
    bals.forEach(b => b.classList.remove('risen'));
  }
}

/* Révèle une moitié de graffiti de largeur 0 → pleine */
function rH(el, p, s, e) {
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

/* ── Balloon card ── */
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

/* ── Reveal on scroll ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(r => io.observe(r));
