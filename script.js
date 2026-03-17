/* ═══════════════════════════════════════
   PROAD Events — script.js FINAL
   ═══════════════════════════════════════ */
const $ = id => document.getElementById(id);

/* ── Refs ── */
const nav         = $('nav');
const heroSection = document.querySelector('.hero-zoom');
const logoWrap    = $('logo-wrap');
const outlineSvg  = $('logo-outline');
const oPath       = $('o-outline-path');
const fillRect    = $('fill-rect');
const waveRect    = $('wave-rect');
const wavePath    = $('wave-path');
const badge       = $('events-badge');
const tagline     = $('tagline');
const scrollCue   = $('scroll-cue');
const smokeCanvas = $('smoke-canvas');
const smokeCtx    = smokeCanvas.getContext('2d');
const sCurt       = $('scene-curtain');
const cvL         = $('canvas-l');
const cvR         = $('canvas-r');
const cvS         = $('spotlight-canvas');
const cLel        = $('curtain-l');
const cRel        = $('curtain-r');
const stageC      = $('stage-content');
const scrUni      = $('screen-universe');
const whyT        = $('why-text');
const props       = document.querySelectorAll('.prop');
const bcard       = $('bcard');

const TOTAL_H = 160.47;
let waveT     = 0;
let curtT     = 0;
let snapDone   = false;
let snapDone2  = false; /* bloque définitivement le hero zoom après le 1er snap */
let sweepDone  = false;
let spx=50, spy=42, stx=50, sty=42, sph=0;
const particles = [];

/* ── NAV ── */
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));

/* ── Badge EVENTS via getBBox ── */
function positionBadge() {
  try {
    const bb       = oPath.getBBox();
    const svgRect  = outlineSvg.getBoundingClientRect();
    const wrapRect = logoWrap.getBoundingClientRect();
    const sx = svgRect.width  / 978.71;
    const sy = svgRect.height / 160.47;
    const px = (bb.x + bb.width  / 2) * sx + (svgRect.left - wrapRect.left);
    const py = (bb.y + bb.height / 2) * sy + (svgRect.top  - wrapRect.top);
    badge.style.left = px + 'px';
    badge.style.top  = py + 'px';
    logoWrap.style.setProperty('--o-cx', (px / wrapRect.width  * 100).toFixed(2) + '%');
    logoWrap.style.setProperty('--o-cy', (py / wrapRect.height * 100).toFixed(2) + '%');
  } catch(e) {}
}
window.addEventListener('load',   () => setTimeout(positionBadge, 150));
window.addEventListener('resize', () => { positionBadge(); resizeCanvases(); });

/* ── Smoke particles ── */
function spawnSmoke(W, H, fillY) {
  if (Math.random() > 0.4) return;
  const sx = W / 978.71;
  particles.push({
    x: (60 + Math.random() * 860) * sx,
    y: (fillY / TOTAL_H) * H,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -(0.3 + Math.random() * 0.6),
    r: 2 + Math.random() * 5,
    life: 1,
    decay: 0.009 + Math.random() * 0.011,
    col: Math.random() > 0.5 ? '255,255,255' : '43,64,252'
  });
}
function drawSmoke(W, H) {
  smokeCanvas.width  = W;
  smokeCanvas.height = H;
  smokeCtx.clearRect(0, 0, W, H);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x   += p.vx + Math.sin(waveT * 2 + i * 0.4) * 0.25;
    p.y   += p.vy; p.r += 0.05; p.life -= p.decay;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    const g = smokeCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0,   `rgba(${p.col},${(p.life*.32).toFixed(2)})`);
    g.addColorStop(0.5, `rgba(${p.col},${(p.life*.12).toFixed(2)})`);
    g.addColorStop(1,   `rgba(${p.col},0)`);
    smokeCtx.beginPath();
    smokeCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    smokeCtx.fillStyle = g; smokeCtx.fill();
  }
}

/* ── Hero progress ── */
function getHeroP() {
  const r = heroSection.getBoundingClientRect();
  const total = heroSection.offsetHeight - window.innerHeight;
  return total <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / total));
}

/* ── Curtain canvases ── */
function resizeCanvases() {
  const sticky = $('curtain-sticky');
  if (!sticky) return;
  const W = sticky.offsetWidth, H = sticky.offsetHeight;
  if (cvL) { cvL.width = cvR.width = Math.ceil(W / 2); cvL.height = cvR.height = H; }
  if (cvS) { cvS.width = W; cvS.height = H; }
}
window.addEventListener('load', () => resizeCanvases());

/* ── Draw curtain canvas ── */
function drawCurtain(cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const n = 8, fw = W / n;
  for (let i = 0; i < n; i++) {
    const ph = (i / n) * Math.PI * 2;
    const w1 = Math.sin(curtT*.7+ph)*.14 + Math.cos(curtT*.38+ph*1.5)*.06;
    const li = .42 + .58 * Math.abs(Math.sin(curtT*.5+ph));
    const r=Math.round(0+li*18), g=Math.round(32+li*34), b=Math.round(185+li*70);
    const gd = ctx.createLinearGradient(i*fw,0,(i+1)*fw,0);
    gd.addColorStop(0,  `rgb(${r-16},${g-10},${b-48})`);
    gd.addColorStop(.25,`rgb(${r+20},${g+20},${b+42})`);
    gd.addColorStop(.55,`rgb(${r+6},${g+6},${b+14})`);
    gd.addColorStop(1,  `rgb(${r-10},${g-6},${b-32})`);
    ctx.beginPath(); ctx.moveTo(i*fw, 0);
    for (let s=0; s<=60; s++) {
      const y=(s/60)*H;
      const wx=Math.sin(y*.014+curtT*.65+ph)*fw*(.12+w1*.38)+Math.sin(y*.027+curtT*.37+ph*2)*fw*.045;
      ctx.lineTo(i*fw+fw*.5+wx, y);
    }
    for (let s=60;s>=0;s--) ctx.lineTo((i+1)*fw,(s/60)*H);
    ctx.closePath(); ctx.fillStyle=gd; ctx.fill();
    const sh=ctx.createLinearGradient(i*fw,0,i*fw+fw*.55,0);
    sh.addColorStop(0,'rgba(255,255,255,0)');
    sh.addColorStop(.4,`rgba(255,255,255,${.032+li*.05})`);
    sh.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=sh; ctx.fillRect(i*fw,0,fw,H);
  }
  ctx.beginPath(); ctx.moveTo(0,H);
  for (let x=0;x<=W;x+=3) {
    const y=H-13-Math.sin(x*.033+curtT*1.1)*8-Math.cos(x*.054+curtT*.74)*5;
    ctx.lineTo(x,y);
  }
  ctx.lineTo(W,H); ctx.closePath();
  ctx.fillStyle='rgba(0,0,16,.6)'; ctx.fill();
}

/* ── Organic spotlight ── */
function updateSpotTarget() {
  sph+=.009;
  stx=50+Math.sin(sph*.71)*30+Math.sin(sph*1.37)*13+Math.sin(sph*.23)*7;
  sty=38+Math.cos(sph*.53)*20+Math.cos(sph*.97)*9+Math.sin(sph*.41)*5;
}
function drawSpot(op) {
  op=isNaN(op)?0:Math.max(0,Math.min(1,op));
  const ctx=cvS.getContext('2d');
  const W=cvS.width,H=cvS.height;
  ctx.clearRect(0,0,W,H);
  if(op<=0) return;
  const px=(spx/100)*W, py=(spy/100)*H;
  const r1=Math.min(W,H)*.24;
  const g1=ctx.createRadialGradient(px,py,0,px,py,r1);
  g1.addColorStop(0,  `rgba(220,232,255,${.22*op})`);
  g1.addColorStop(.35,`rgba(170,205,255,${.12*op})`);
  g1.addColorStop(.7, `rgba(80,140,255,${.04*op})`);
  g1.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath();ctx.arc(px,py,r1,0,Math.PI*2);ctx.fillStyle=g1;ctx.fill();
  const r2=Math.min(W,H)*.065;
  const g2=ctx.createRadialGradient(px,py,0,px,py,r2);
  g2.addColorStop(0,  `rgba(255,255,255,${.58*op})`);
  g2.addColorStop(.5, `rgba(220,235,255,${.26*op})`);
  g2.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath();ctx.arc(px,py,r2,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
  const cw=190*op;
  const cg=ctx.createLinearGradient(px,28,px,py);
  cg.addColorStop(0,  `rgba(200,220,255,${.2*op})`);
  cg.addColorStop(.6, `rgba(150,190,255,${.07*op})`);
  cg.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath();ctx.moveTo(px-5,28);ctx.lineTo(px-cw/2,py);ctx.lineTo(px+cw/2,py);ctx.lineTo(px+5,28);ctx.closePath();ctx.fillStyle=cg;ctx.fill();
}

/* ── Curtain progress ── */
function getCurtP() {
  const r=sCurt.getBoundingClientRect();
  const total=sCurt.offsetHeight-window.innerHeight;
  return total<=0?0:Math.max(0,Math.min(1,-r.top/total));
}

/* ── ADN links ── */
document.addEventListener('DOMContentLoaded', () => {
  const rl=$('road-link'), pl=$('prod-link');
  if(rl) rl.addEventListener('click',e=>{e.preventDefault();sCurt.scrollIntoView({behavior:'smooth'});});
  if(pl) pl.addEventListener('click',e=>{e.preventDefault();sCurt.scrollIntoView({behavior:'smooth'});});
});

/* ═══════════════════════════
   MAIN LOOP
═══════════════════════════ */
props.forEach(p => { p.style.opacity='0'; });

function loop() {
  waveT  += 0.04;
  curtT  += 0.014;

  /* ── HERO: fill + zoom ── */
  /* Une fois le snap effectué, on ne recalcule plus le hero */
  if (snapDone2) {
    logoWrap.style.transform = '';
    logoWrap.style.opacity   = '1';
  } else {
  const hp    = getHeroP();
  const fillP = Math.min(hp / 0.45, 1);
  const fillH = fillP * TOTAL_H;
  const fillY = TOTAL_H - fillH;

  fillRect.setAttribute('y',      fillY);
  fillRect.setAttribute('height', fillH);
  waveRect.setAttribute('y',      fillY - 4);
  waveRect.setAttribute('height', 8);

  if (fillH > 2 && fillH < TOTAL_H - 2) {
    let d = `M 0 ${fillY}`;
    for (let x=0;x<=978.71;x+=10) {
      const wy=fillY+Math.sin(x*.026+waveT)*2.5+Math.sin(x*.042+waveT*1.3)*1.4;
      d+=` L ${x} ${wy}`;
    }
    d+=` L 978.71 ${fillY+8} L 0 ${fillY+8} Z`;
    wavePath.setAttribute('d', d);
  } else { wavePath.setAttribute('d',''); }

  outlineSvg.style.opacity = Math.max(0.12, 1-fillP*.88);

  /* Smoke */
  const W=logoWrap.offsetWidth, H=logoWrap.offsetHeight;
  if(fillH>3&&fillH<TOTAL_H-2){
    smokeCanvas.style.opacity='1';
    spawnSmoke(W,H,fillY);
  } else { smokeCanvas.style.opacity='0'; }
  drawSmoke(W,H);

  /* Zoom into O */
  const zoomP = Math.max(0, Math.min((hp-0.50)/0.35,1));
  if(zoomP>0){
    const scale   = 1+Math.pow(zoomP,2.8)*18;
    const fadeOut = Math.max(0,1-(scale-12)/6);
    logoWrap.style.transform = `scale(${scale})`;
    logoWrap.style.opacity   = fadeOut;
    badge.style.opacity      = Math.max(0,1-zoomP*3);
    tagline.style.opacity    = Math.max(0,1-zoomP*2);
    scrollCue.style.opacity  = '0';
    smokeCanvas.style.opacity= '0';
    if(fadeOut===0&&!snapDone){
        snapDone=true;
        setTimeout(()=>{
          $('scene-adn').scrollIntoView({behavior:'instant'});
          logoWrap.style.transform='';
          logoWrap.style.opacity='1';
          snapDone2=true; /* bloque définitivement le zoom */
          setTimeout(()=>{snapDone=false;},1000);
        },80);
      }
    } else {
      logoWrap.style.transform='';
      logoWrap.style.opacity='1';
      badge.style.opacity    = Math.max(0,1-fillP*2);
      tagline.style.opacity  = Math.max(0,1-fillP*1.5);
      tagline.style.transform= `translateY(${fillP*20}px)`;
      scrollCue.style.opacity= Math.max(0,1-fillP*3);
    }
  } /* fin du bloc snapDone2 */

  /* ── CURTAIN ── */
  updateSpotTarget();
  spx+=(stx-spx)*.032; spy+=(sty-spy)*.032;

  const cp    = getCurtP();
  const openP = Math.max(0,Math.min((cp-.25)/.75,1));

  if(cvL&&cvR){ drawCurtain(cvL); drawCurtain(cvR); }

  cLel.style.transform=`translateX(-${openP*108}%)`;
  cRel.style.transform=`translateX(${openP*108}%)`;

  const sOp=Math.max(0,1-openP*2.5);
  if(cvS) drawSpot(sOp);
  whyT.style.left   =(spx/100)*window.innerWidth+'px';
  whyT.style.top    =(spy/100)*window.innerHeight+'px';
  whyT.style.opacity=sOp;

  if(openP>.25){
    stageC.classList.add('visible');
    if(!sweepDone&&openP>.48){
      sweepDone=true;
      scrUni.classList.add('sweep');
      setTimeout(()=>{scrUni.classList.remove('sweep');scrUni.classList.add('done');},1300);
    }
  } else {
    stageC.classList.remove('visible');
    sweepDone=false;
    scrUni.classList.remove('sweep','done');
  }

  props.forEach((pr,i)=>{
    const pp=Math.max(0,Math.min((openP-.28-i*.06)/.28,1));
    pr.style.opacity=pp;
  });

  requestAnimationFrame(loop);
}
loop();

/* ── Prop click → card ── */
props.forEach(prop=>prop.addEventListener('click',e=>{
  e.stopPropagation();
  $('bc-l').textContent=prop.dataset.l||'';
  $('bc-w').textContent=prop.dataset.w||'';
  $('bc-d').textContent=prop.dataset.d||'';
  bcard.classList.add('open');
  document.body.style.overflow='hidden';
}));
function closeCard(){bcard.classList.remove('open');document.body.style.overflow='';}
bcard.addEventListener('click',e=>{if(e.target===bcard)closeCard();});

/* ── Reveal ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(r=>io.observe(r));
