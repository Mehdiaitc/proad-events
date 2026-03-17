/* ═══════════════════════════════════════
   PROAD Events — script.js
   ═══════════════════════════════════════ */
const $ = id => document.getElementById(id);

/* ── Refs ── */
const nav    = $('nav');
const wc     = document.querySelector('.word-container');
const tO     = document.querySelector('.target-o');
const lets   = document.querySelectorAll('.letter');
const badge  = $('events-badge');
const tline  = $('tagline');
const scue   = $('scroll-cue');
const sCurt  = $('scene-curtain');
const cLel   = $('curtain-l');
const cRel   = $('curtain-r');
const cvL    = $('canvas-l');
const cvR    = $('canvas-r');
const cvS    = $('spotlight-canvas');
const whyT   = $('why-text');
const stageC = $('stage-content');
const scrUni = $('screen-universe');
const props  = document.querySelectorAll('.prop');
const bcard  = $('bcard');

let snapDone  = false;
let sweepDone = false;
let balRisen  = false;
let t         = 0;
let spx=50, spy=42, stx=50, sty=42, sph=0;

/* ── NAV ── */
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

/* ── EVENTS badge inside O ── */
function posBadge() {
  if (!tO) return;
  const r = tO.getBoundingClientRect();
  const w = document.querySelector('.sticky-wrapper').getBoundingClientRect();
  badge.style.left = (r.left - w.left + r.width  / 2) + 'px';
  badge.style.top  = (r.top  - w.top  + r.height / 2) + 'px';
}
window.addEventListener('load',   () => setTimeout(posBadge, 120));
window.addEventListener('resize', () => { posBadge(); resize(); });

/* ══════════════════════════════════════
   HERO — zoom sniper dans le O
══════════════════════════════════════ */
window.addEventListener('scroll', heroScroll, { passive: true });

function heroScroll() {
  const s = scrollY;

  /* Lettres se remplissent une par une */
  lets.forEach((l, i) => {
    if (s > i * 120) l.classList.add('filled');
    else l.classList.remove('filled');
  });

  /* Fades */
  badge.style.opacity = Math.max(0, 1 - s / 80);
  tline.style.opacity = Math.max(0, 1 - s / 200);
  scue.style.opacity  = Math.max(0, 1 - s / 150);

  /* Zoom sniper dans le O */
  if (s > 400 && s < 3200) {
    const prog  = s - 400;
    const scale = 1 + Math.pow(prog / 260, 3.5);
    const rect  = tO.getBoundingClientRect();
    const ox    = (window.innerWidth  / 2) - (rect.left + rect.width  / 2);
    const oy    = (window.innerHeight / 2) - (rect.top  + rect.height / 2);
    wc.style.transform = `translate(${ox*(scale/2.5)}px,${oy*(scale/2.5)}px) scale(${scale})`;

    if (scale > 15) {
      const fade = Math.max(0, 1 - (scale - 15) / 10);
      wc.style.opacity = fade;
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

/* ── ROAD link ── */
if ($('road-link')) {
  $('road-link').addEventListener('click', () => sCurt.scrollIntoView({ behavior: 'smooth' }));
}

/* ══════════════════════════════════════
   CANVAS resize
══════════════════════════════════════ */
function resize() {
  const sticky = $('curtain-sticky');
  if (!sticky) return;
  const W = sticky.offsetWidth, H = sticky.offsetHeight;
  cvL.width = cvR.width = Math.ceil(W / 2);
  cvL.height = cvR.height = H;
  cvS.width = W; cvS.height = H;
}
window.addEventListener('load', () => { resize(); });

/* ══════════════════════════════════════
   CURTAIN CANVAS — satin vivant
══════════════════════════════════════ */
function drawCurtain(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const n = 8, fw = W / n;
  for (let i = 0; i < n; i++) {
    const ph = (i / n) * Math.PI * 2;
    const w1 = Math.sin(t * .7 + ph) * .14 + Math.cos(t * .38 + ph * 1.5) * .06;
    const li = .42 + .58 * Math.abs(Math.sin(t * .5 + ph));
    const r  = Math.round(0  + li * 18);
    const g  = Math.round(32 + li * 34);
    const b  = Math.round(185+ li * 70);
    const gd = ctx.createLinearGradient(i*fw, 0, (i+1)*fw, 0);
    gd.addColorStop(0,   `rgb(${r-16},${g-10},${b-48})`);
    gd.addColorStop(.25, `rgb(${r+20},${g+20},${b+42})`);
    gd.addColorStop(.55, `rgb(${r+6},${g+6},${b+14})`);
    gd.addColorStop(1,   `rgb(${r-10},${g-6},${b-32})`);
    ctx.beginPath();
    ctx.moveTo(i * fw, 0);
    for (let s = 0; s <= 60; s++) {
      const y  = (s / 60) * H;
      const wx = Math.sin(y * .014 + t * .65 + ph) * fw * (.12 + w1 * .38)
               + Math.sin(y * .027 + t * .37 + ph * 2) * fw * .045;
      ctx.lineTo(i * fw + fw * .5 + wx, y);
    }
    for (let s = 60; s >= 0; s--) ctx.lineTo((i + 1) * fw, (s / 60) * H);
    ctx.closePath(); ctx.fillStyle = gd; ctx.fill();
    const sh = ctx.createLinearGradient(i*fw, 0, i*fw + fw*.55, 0);
    sh.addColorStop(0,   'rgba(255,255,255,0)');
    sh.addColorStop(.4,  `rgba(255,255,255,${.032 + li * .05})`);
    sh.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = sh; ctx.fillRect(i * fw, 0, fw, H);
  }
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) {
    const y = H - 13 - Math.sin(x * .033 + t * 1.1) * 8 - Math.cos(x * .054 + t * .74) * 5;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H); ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,16,.6)'; ctx.fill();
}

/* ══════════════════════════════════════
   ORGANIC SPOTLIGHT
══════════════════════════════════════ */
function updateTarget() {
  sph += .009;
  stx = 50 + Math.sin(sph*.71)*30 + Math.sin(sph*1.37)*13 + Math.sin(sph*.23)*7;
  sty = 38 + Math.cos(sph*.53)*20 + Math.cos(sph*.97)*9  + Math.sin(sph*.41)*5;
}

function drawSpot(op) {
  op = isNaN(op) ? 0 : Math.max(0, Math.min(1, op));
  const ctx = cvS.getContext('2d');
  const W = cvS.width, H = cvS.height;
  ctx.clearRect(0, 0, W, H);
  if (op <= 0) return;
  const px = (spx / 100) * W, py = (spy / 100) * H;
  /* Big halo */
  const r1 = Math.min(W, H) * .24;
  const g1 = ctx.createRadialGradient(px, py, 0, px, py, r1);
  g1.addColorStop(0,   `rgba(220,232,255,${.22*op})`);
  g1.addColorStop(.35, `rgba(170,205,255,${.12*op})`);
  g1.addColorStop(.7,  `rgba(80,140,255,${.04*op})`);
  g1.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(px, py, r1, 0, Math.PI*2);
  ctx.fillStyle = g1; ctx.fill();
  /* Hot spot */
  const r2 = Math.min(W, H) * .065;
  const g2 = ctx.createRadialGradient(px, py, 0, px, py, r2);
  g2.addColorStop(0,   `rgba(255,255,255,${.58*op})`);
  g2.addColorStop(.5,  `rgba(220,235,255,${.26*op})`);
  g2.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(px, py, r2, 0, Math.PI*2);
  ctx.fillStyle = g2; ctx.fill();
  /* Cone */
  const cw = 190 * op;
  const cg = ctx.createLinearGradient(px, 28, px, py);
  cg.addColorStop(0,   `rgba(200,220,255,${.2*op})`);
  cg.addColorStop(.6,  `rgba(150,190,255,${.07*op})`);
  cg.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.moveTo(px-5, 28); ctx.lineTo(px-cw/2, py);
  ctx.lineTo(px+cw/2, py); ctx.lineTo(px+5, 28);
  ctx.closePath(); ctx.fillStyle = cg; ctx.fill();
}

/* ══════════════════════════════════════
   CURTAIN SCROLL
══════════════════════════════════════ */
function getCurtP() {
  const r = sCurt.getBoundingClientRect();
  const total = sCurt.offsetHeight - window.innerHeight;
  return total <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / total));
}

/* ══════════════════════════════════════
   MAIN LOOP
══════════════════════════════════════ */
props.forEach(p => { p.style.opacity = '0'; });

function loop() {
  t += .014;
  updateTarget();
  spx += (stx - spx) * .032;
  spy += (sty - spy) * .032;

  const p     = getCurtP();
  const openP = Math.max(0, Math.min((p - .38) / .62, 1));

  /* Draw curtains */
  drawCurtain(cvL);
  drawCurtain(cvR);

  /* Slide curtains */
  cLel.style.transform = `translateX(-${openP * 108}%)`;
  cRel.style.transform = `translateX(${openP * 108}%)`;

  /* Spotlight + WHY text */
  const sOp = Math.max(0, 1 - openP * 2.5);
  drawSpot(sOp);
  const wx = (spx / 100) * window.innerWidth;
  const wy = (spy / 100) * window.innerHeight;
  whyT.style.left    = wx + 'px';
  whyT.style.top     = wy + 'px';
  whyT.style.opacity = sOp;

  /* Stage visible */
  if (openP > .25) {
    stageC.classList.add('visible');
    if (!sweepDone && openP > .48) {
      sweepDone = true;
      scrUni.classList.add('sweep');
      setTimeout(() => { scrUni.classList.remove('sweep'); scrUni.classList.add('done'); }, 1300);
    }
  } else {
    stageC.classList.remove('visible');
    sweepDone = false;
    scrUni.classList.remove('sweep', 'done');
  }

  /* Props stagger in */
  props.forEach((pr, i) => {
    const pp = Math.max(0, Math.min((openP - .28 - i * .06) / .28, 1));
    pr.style.opacity = pp;
  });

  requestAnimationFrame(loop);
}
loop();

/* ── Balloon card ── */
props.forEach(b => b.addEventListener('click', () => {
  $('bc-l').textContent = b.dataset.l || '';
  $('bc-w').textContent = b.dataset.w || '';
  $('bc-d').textContent = b.dataset.d || '';
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
