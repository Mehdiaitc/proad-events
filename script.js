/* ═══════════════════════════════════════
   PROAD Events — script.js
   ═══════════════════════════════════════ */
const $ = id => document.getElementById(id);

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
const cvDust      = $('dust-canvas');
const dustCtx     = cvDust ? cvDust.getContext('2d') : null;
const cLel        = $('curtain-l');
const cRel        = $('curtain-r');
const stageC      = $('stage-content');
const scrUni      = $('screen-universe');
const whyT        = $('why-text');
const props       = document.querySelectorAll('.prop');
const bcard       = $('bcard');

const TOTAL_H = 160.47;
let waveT = 0, curtT = 0;
let spx=50, spy=50, stx=50, sty=50, sph=0;
let sweepDone  = false;
let zoomActive = false;
let zoomComplete = false;
const particles     = [];
const dustParticles = [];

/* ── NAV ── */
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), {passive:true});

/* ── Badge EVENTS ── */
function positionBadge() {
  try {
    const bb  = oPath.getBBox();
    const sr  = outlineSvg.getBoundingClientRect();
    const wr  = logoWrap.getBoundingClientRect();
    if (!sr.width) return;
    const sx = sr.width  / 978.71;
    const sy = sr.height / 160.47;
    const px = (bb.x + bb.width  / 2) * sx + (sr.left - wr.left);
    const py = (bb.y + bb.height / 2) * sy + (sr.top  - wr.top);
    badge.style.left = px + 'px';
    badge.style.top  = py + 'px';
    logoWrap.style.setProperty('--o-cx', (px / wr.width  * 100).toFixed(2) + '%');
    logoWrap.style.setProperty('--o-cy', (py / wr.height * 100).toFixed(2) + '%');
  } catch(e) {
    setTimeout(positionBadge, 200);
  }
}
if (document.fonts) {
  document.fonts.ready.then(() => setTimeout(positionBadge, 100));
} else {
  window.addEventListener('load', () => setTimeout(positionBadge, 300));
}
window.addEventListener('resize', positionBadge);

/* ── Smoke ── */
function spawnSmoke(W, H, fillY) {
  if (particles.length > 60 || Math.random() > 0.3) return;
  particles.push({
    x: (60 + Math.random() * 860) * (W / 978.71),
    y: (fillY / TOTAL_H) * H,
    vx: (Math.random()-.5)*.5, vy:-(Math.random()*.6+.1),
    r: 2+Math.random()*5, life:1,
    decay:.009+Math.random()*.011,
    col: Math.random()>.5 ? '255,255,255' : '43,64,252'
  });
}
function drawSmoke(W, H) {
  smokeCanvas.width = W; smokeCanvas.height = H;
  smokeCtx.clearRect(0,0,W,H);
  for (let i=particles.length-1; i>=0; i--) {
    const p=particles[i];
    p.x+=p.vx+Math.sin(waveT*2+i*.4)*.25; p.y+=p.vy;
    p.r+=.05; p.life-=p.decay;
    if (p.life<=0){particles.splice(i,1);continue;}
    const g=smokeCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
    g.addColorStop(0,  `rgba(${p.col},${(p.life*.32).toFixed(2)})`);
    g.addColorStop(.5, `rgba(${p.col},${(p.life*.12).toFixed(2)})`);
    g.addColorStop(1,  'rgba(0,0,0,0)');
    smokeCtx.beginPath(); smokeCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
    smokeCtx.fillStyle=g; smokeCtx.fill();
  }
}

/* ── Canvas resize ── */
function resizeCanvases() {
  const s = $('curtain-sticky');
  if (!s) return;
  const W = s.offsetWidth, H = s.offsetHeight;
  if (cvL) { cvL.width = Math.ceil(W/2); cvL.height = H; }
  if (cvR) { cvR.width = Math.ceil(W/2); cvR.height = H; }
  if (cvS) { cvS.width = W; cvS.height = H; }
  if (cvDust) { cvDust.width = W; cvDust.height = H; }
}
window.addEventListener('load', resizeCanvases);
window.addEventListener('resize', () => { positionBadge(); resizeCanvases(); updateStageRect(); });

/* ── Curtain draw ── */
let lastCurtainDraw = 0;
function drawCurtain(cv, isRight) {
  const now = performance.now();
  if (isRight) { if (now - lastCurtainDraw < 33) return; lastCurtainDraw = now; }
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  if (!W||!H) return;
  ctx.clearRect(0,0,W,H);
  const n=8, fw=W/n;
  for (let i=0; i<n; i++) {
    const ph=(i/n)*Math.PI*2;
    const w1=Math.sin(curtT*.7+ph)*.14+Math.cos(curtT*.38+ph*1.5)*.06;
    const li=.42+.58*Math.abs(Math.sin(curtT*.5+ph));
    const r=Math.round(li*18), g=Math.round(32+li*34), b=Math.round(185+li*70);
    const gd=ctx.createLinearGradient(i*fw,0,(i+1)*fw,0);
    gd.addColorStop(0,  `rgb(${r-16},${g-10},${b-48})`);
    gd.addColorStop(.25,`rgb(${r+20},${g+20},${b+42})`);
    gd.addColorStop(.55,`rgb(${r+6},${g+6},${b+14})`);
    gd.addColorStop(1,  `rgb(${r-10},${g-6},${b-32})`);
    ctx.beginPath(); ctx.moveTo(i*fw,0);
    for (let s=0;s<=60;s++){
      const y=(s/60)*H;
      const wx=Math.sin(y*.014+curtT*.65+ph)*fw*(.12+w1*.38)
              +Math.sin(y*.027+curtT*.37+ph*2)*fw*.045;
      ctx.lineTo(i*fw+fw*.5+wx,y);
    }
    for (let s=60;s>=0;s--) ctx.lineTo((i+1)*fw,(s/60)*H);
    ctx.closePath(); ctx.fillStyle=gd; ctx.fill();
    const sh=ctx.createLinearGradient(i*fw,0,i*fw+fw*.55,0);
    sh.addColorStop(0,'rgba(255,255,255,0)');
    sh.addColorStop(.4,`rgba(255,255,255,${(.032+li*.05).toFixed(3)})`);
    sh.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=sh; ctx.fillRect(i*fw,0,fw,H);
  }
  ctx.beginPath(); ctx.moveTo(0,H);
  for (let x=0;x<=W;x+=3){
    const y=H-13-Math.sin(x*.033+curtT*1.1)*8-Math.cos(x*.054+curtT*.74)*5;
    ctx.lineTo(x,y);
  }
  ctx.lineTo(W,H); ctx.closePath();
  ctx.fillStyle='rgba(0,0,16,.6)'; ctx.fill();
}

/* ── Spotlight WHY PROAD — lumière de face ──
   Mouvement horizontal doux, centré verticalement,
   lumière qui s'élargit depuis le centre comme un projecteur frontal */
function updateSpotTarget(){
  sph += .007;
  stx = 50 + Math.sin(sph*.53)*28 + Math.sin(sph*1.17)*10 + Math.sin(sph*.29)*5;
  sty = 50 + Math.cos(sph*.41)*8  + Math.sin(sph*.73)*4;
}

function drawSpot(op){
  op = isNaN(op) ? 0 : Math.max(0, Math.min(1, op));
  const ctx = cvS.getContext('2d'), W = cvS.width, H = cvS.height;
  ctx.clearRect(0,0,W,H);
  if(op <= 0) return;

  const px = (spx/100)*W;
  const py = (spy/100)*H;

  /* Halo principal large — lumière frontale */
  const r1 = Math.min(W,H) * .40;
  const g1 = ctx.createRadialGradient(px, py, 0, px, py, r1);
  g1.addColorStop(0,   `rgba(255,255,255,${(.20*op).toFixed(2)})`);
  g1.addColorStop(.12, `rgba(220,235,255,${(.15*op).toFixed(2)})`);
  g1.addColorStop(.38, `rgba(100,155,255,${(.06*op).toFixed(2)})`);
  g1.addColorStop(.72, `rgba(43,64,252,${(.022*op).toFixed(3)})`);
  g1.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(px, py, r1, 0, Math.PI*2);
  ctx.fillStyle = g1; ctx.fill();

  /* Point chaud central */
  const r2 = Math.min(W,H) * .06;
  const g2 = ctx.createRadialGradient(px, py, 0, px, py, r2);
  g2.addColorStop(0,  `rgba(255,255,255,${(.80*op).toFixed(2)})`);
  g2.addColorStop(.4, `rgba(230,240,255,${(.38*op).toFixed(2)})`);
  g2.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(px, py, r2, 0, Math.PI*2);
  ctx.fillStyle = g2; ctx.fill();

  /* Anneau de diffusion */
  const r3 = Math.min(W,H) * .20;
  const g3 = ctx.createRadialGradient(px, py, r3*.55, px, py, r3);
  g3.addColorStop(0,  'rgba(0,0,0,0)');
  g3.addColorStop(.5, `rgba(43,64,252,${(.038*op).toFixed(3)})`);
  g3.addColorStop(1,  'rgba(0,0,0,0)');
  ctx.beginPath(); ctx.arc(px, py, r3, 0, Math.PI*2);
  ctx.fillStyle = g3; ctx.fill();
}

/* ── Dust trail ── */
let stageRect = null;
let lastMouseX=-999, lastMouseY=-999, lastDustSpawn=0;

function updateStageRect(){
  const s=$('curtain-sticky');
  if(s) stageRect=s.getBoundingClientRect();
}
window.addEventListener('load', ()=>setTimeout(updateStageRect,300));
window.addEventListener('scroll', updateStageRect, {passive:true});

document.addEventListener('mousemove', e=>{
  if(!stageRect) return;
  if(e.clientY<stageRect.top||e.clientY>stageRect.bottom) return;
  if(e.clientX<stageRect.left||e.clientX>stageRect.right) return;
  const mx=e.clientX-stageRect.left;
  const my=e.clientY-stageRect.top;
  const now=performance.now();
  if(now-lastDustSpawn<14) return;
  lastDustSpawn=now;
  const dx=mx-lastMouseX, dy=my-lastMouseY;
  const dist=Math.sqrt(dx*dx+dy*dy);
  if(dist>3 && dustParticles.length<160){
    const n=Math.min(Math.floor(dist/5),7);
    for(let i=0;i<n;i++){
      const t=i/n;
      dustParticles.push({
        x:lastMouseX+dx*t+(Math.random()-.5)*6,
        y:lastMouseY+dy*t+(Math.random()-.5)*6,
        vx:(Math.random()-.5)*.9,
        vy:-(Math.random()*.8+.2),
        r:.5+Math.random()*2,
        life:1, decay:.016+Math.random()*.02,
        hue:200+Math.random()*60
      });
    }
    lastMouseX=mx; lastMouseY=my;
  }
});

function drawDust(){
  if(!dustCtx||!cvDust.width||!cvDust.height) return;
  dustCtx.clearRect(0,0,cvDust.width,cvDust.height);
  for(let i=dustParticles.length-1;i>=0;i--){
    const p=dustParticles[i];
    p.x+=p.vx; p.y+=p.vy;
    p.vx*=.94; p.vy*=.94;
    p.r+=.025; p.life-=p.decay;
    if(p.life<=0){dustParticles.splice(i,1);continue;}
    const g=dustCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3);
    g.addColorStop(0,  `hsla(${p.hue},100%,80%,${(p.life*.9).toFixed(2)})`);
    g.addColorStop(.4, `hsla(${p.hue},100%,65%,${(p.life*.35).toFixed(2)})`);
    g.addColorStop(1,  `hsla(${p.hue},100%,50%,0)`);
    dustCtx.beginPath();
    dustCtx.arc(p.x,p.y,p.r*3,0,Math.PI*2);
    dustCtx.fillStyle=g; dustCtx.fill();
  }
}

/* ── Progress ── */
function getHeroP(){
  const r=heroSection.getBoundingClientRect();
  const t=heroSection.offsetHeight-window.innerHeight;
  return t<=0?0:Math.max(0,Math.min(1,-r.top/t));
}
function getCurtP(){
  const r=sCurt.getBoundingClientRect();
  const t=sCurt.offsetHeight-window.innerHeight;
  return t<=0?0:Math.max(0,Math.min(1,-r.top/t));
}

/* ── Zoom overlay ── */
const zoomOverlay=document.createElement('div');
zoomOverlay.style.cssText='position:fixed;inset:0;background:#060608;z-index:250;pointer-events:none;opacity:0;';
document.body.appendChild(zoomOverlay);

function triggerZoom(){
  zoomOverlay.style.transition='opacity .5s ease';
  zoomOverlay.style.opacity='1';
  zoomOverlay.style.pointerEvents='all';
  setTimeout(()=>{
    $('scene-adn').scrollIntoView({behavior:'instant'});
    logoWrap.style.transform='';
    logoWrap.style.opacity='1';
    zoomOverlay.style.transition='opacity .6s ease';
    zoomOverlay.style.opacity='0';
    setTimeout(()=>{
      zoomOverlay.style.pointerEvents='none';
      zoomComplete=true;
      const unwatch = ()=>{
        if(getHeroP() < 0.52){
          zoomComplete = false;
          zoomActive   = false;
          window.removeEventListener('scroll', unwatch);
        }
      };
      window.addEventListener('scroll', unwatch, {passive:true});
    },650);
  },520);
}

/* ── ADN links ── */
document.addEventListener('DOMContentLoaded',()=>{
  const rl=$('road-link'), pl=$('prod-link');
  if(rl) rl.addEventListener('click',e=>{e.preventDefault();sCurt.scrollIntoView({behavior:'smooth'});});
  if(pl) pl.addEventListener('click',e=>{e.preventDefault();sCurt.scrollIntoView({behavior:'smooth'});});
});

/* ═══ MAIN LOOP ═══ */
props.forEach(p=>{p.style.opacity='0';});

function loop(){
  waveT+=.04; curtT+=.014;

  /* ── HERO fill ── */
  const hp=getHeroP();
  const fillP=Math.min(hp/.45,1);
  const fillH=fillP*TOTAL_H;
  const fillY=TOTAL_H-fillH;

  fillRect.setAttribute('y',fillY);
  fillRect.setAttribute('height',fillH);
  waveRect.setAttribute('y',fillY-4);
  waveRect.setAttribute('height',8);

  if(fillH>2&&fillH<TOTAL_H-2){
    let d=`M 0 ${fillY}`;
    for(let x=0;x<=978.71;x+=10){
      const wy=fillY+Math.sin(x*.026+waveT)*2.5+Math.sin(x*.042+waveT*1.3)*1.4;
      d+=` L ${x} ${wy}`;
    }
    d+=` L 978.71 ${fillY+8} L 0 ${fillY+8} Z`;
    wavePath.setAttribute('d',d);
  } else { wavePath.setAttribute('d',''); }

  outlineSvg.style.opacity=Math.max(0.12,1-fillP*.88);

  const LW=logoWrap.offsetWidth, LH=logoWrap.offsetHeight;
  if(fillH>3&&fillH<TOTAL_H-2){
    smokeCanvas.style.opacity='1';
    spawnSmoke(LW,LH,fillY);
  } else { smokeCanvas.style.opacity='0'; }
  drawSmoke(LW,LH);

  /* ── HERO zoom ── */
  if(!zoomComplete){
    const zP=Math.max(0,Math.min((hp-.55)/.30,1));
    if(zP>0){
      const scale=1+Math.pow(zP,2.5)*14;
      const fadeOut=Math.max(0,1-(scale-10)/5);
      logoWrap.style.transform=`scale(${scale})`;
      logoWrap.style.opacity=fadeOut;
      badge.style.opacity=Math.max(0,1-zP*3);
      tagline.style.opacity=Math.max(0,1-zP*2);
      scrollCue.style.opacity='0';
      smokeCanvas.style.opacity='0';
      if(fadeOut===0&&!zoomActive){
        zoomActive=true;
        triggerZoom();
      }
    } else {
      logoWrap.style.transform='';
      logoWrap.style.opacity='1';
      badge.style.opacity=Math.max(0,1-fillP*2);
      tagline.style.opacity=Math.max(0,1-fillP*1.5);
      tagline.style.transform=`translateY(${fillP*20}px)`;
      scrollCue.style.opacity=Math.max(0,1-fillP*3);
    }
  }

  /* ── CURTAIN ──
     Déclenchement à 10% du scroll (au lieu de 25%)
     → les projecteurs et WHY PROAD restent visibles plus tôt */
  updateSpotTarget();
  spx+=(stx-spx)*.028; spy+=(sty-spy)*.028;

  const cp=getCurtP();
  const openP=Math.max(0,Math.min((cp-.10)/.75,1));

  if(cvL&&cvR){ drawCurtain(cvL,false); drawCurtain(cvR,true); }
  cLel.style.transform=`translateX(-${openP*108}%)`;
  cRel.style.transform=`translateX(${openP*108}%)`;

  const sOp=Math.max(0,1-openP*2.85);
  if(cvS) drawSpot(sOp);
  whyT.style.left=(spx/100)*window.innerWidth+'px';
  whyT.style.top=(spy/100)*window.innerHeight+'px';
  whyT.style.opacity=sOp;

  if(openP>.20){
    stageC.classList.add('visible');
    if(!sweepDone&&openP>.42){
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
    const pp=Math.max(0,Math.min((openP-.22-i*.06)/.28,1));
    pr.style.opacity=pp;
  });

  drawDust();
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

/* ── Contact form ── */
function handleSubmit(e){
  e.preventDefault();
  const form=e.target;
  const btn=form.querySelector('.form-submit');
  btn.textContent='ENVOI EN COURS…';
  btn.disabled=true;
  setTimeout(()=>{
    form.reset();
    btn.textContent='ENVOYER MA DEMANDE';
    btn.disabled=false;
    const msg=$('form-success');
    if(msg){msg.style.display='flex';setTimeout(()=>{msg.style.display='none';},5000);}
  },1200);
  return false;
}

/* ── Reveal ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(r=>io.observe(r));
