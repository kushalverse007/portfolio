/* === MOBILE MENU === */
function toggleMenu(){
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMenu(){
  document.getElementById('mobileMenu').classList.remove('open');
}

/* === CYCLING ROLE TEXT === */
const roles=['Web Developer','App Developer','AI Enthusiast','Creative Coder','Problem Solver'];
let ri=0,ci=0,del=false,el=document.getElementById('roleCycle');
function typeRole(){
  const w=roles[ri];
  el.textContent=del?w.substring(0,ci--):w.substring(0,ci++);
  if(!del&&ci>w.length){setTimeout(()=>{del=true;},1400);setTimeout(typeRole,100);return;}
  if(del&&ci<0){del=false;ri=(ri+1)%roles.length;ci=0;}
  setTimeout(typeRole,del?55:85);
}
typeRole();

/* === COUNTER ANIMATION === */
let counted=false;
function runCounters(){
  if(counted)return;counted=true;
  document.querySelectorAll('.counter').forEach(c=>{
    const t=+c.dataset.target;let n=0;
    const s=Math.ceil(t/25);
    const iv=setInterval(()=>{n=Math.min(n+s,t);c.textContent=n;if(n>=t)clearInterval(iv);},60);
  });
}

/* === FADE IN ON SCROLL + SKILL BARS === */
let skillsDone=false;
const fades=document.querySelectorAll('.fade-in');
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      if(!skillsDone&&e.target.closest('#skills')){
        skillsDone=true;
        document.querySelectorAll('.sbar-fill').forEach(f=>{f.style.width=f.dataset.pct+'%';});
      }
    }
  });
},{threshold:0.12});
fades.forEach(f=>obs.observe(f));

const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)runCounters();});
},{threshold:0.5});
const statsEl=document.querySelector('.stats-bar');
if(statsEl)statsObs.observe(statsEl);

/* === COLOUR THEME SWITCHER === */
function switchTheme(el,color,bg,textColor){
  document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
  el.classList.add('active');
  const p=document.getElementById('themePreview');
  p.style.background=bg;p.style.color=textColor;
  p.textContent='Accent: '+color;
}

/* === TYPING SPEED TEST === */
let typeStart=null;
function calcTyping(){
  const v=document.getElementById('typeInput').value;
  if(!typeStart&&v.length)typeStart=Date.now();
  if(!v.length){typeStart=null;}
  const words=v.trim()?v.trim().split(/\s+/).length:0;
  const mins=typeStart?((Date.now()-typeStart)/60000):0;
  const wpm=mins>0?Math.round(words/mins):0;
  document.getElementById('wpmStat').textContent=(mins>0?wpm:0)+' WPM';
  document.getElementById('charStat').textContent=v.length+' chars';
  document.getElementById('wordStat').textContent=words+' words';
}

/* === MOOD PICKER === */
function setMood(btn,bg,color,msg){
  document.querySelectorAll('.mood-btn').forEach(b=>{b.style.background='white';b.style.color=b.dataset.origColor||b.style.color;});
  btn.style.background=color;btn.style.color='white';
  const r=document.getElementById('moodResult');
  r.style.display='block';r.style.background=bg;r.style.color=color;r.textContent=msg;
}

/* === CALCULATOR === */
let calcExpr='';
function calcInput(v){
  const d=document.getElementById('calcDisplay');
  if(v==='C'){calcExpr='';d.textContent='0';return;}
  if(v==='⌫'){calcExpr=calcExpr.slice(0,-1);d.textContent=calcExpr||'0';return;}
  if(v==='='){
    try{
      const r=Function('"use strict";return ('+calcExpr+')')();
      d.textContent=parseFloat(r.toFixed(8));
      calcExpr=String(parseFloat(r.toFixed(8)));
    }catch{d.textContent='Error';calcExpr='';}
    return;
  }
  if(v==='%'){calcExpr+='/100';d.textContent=calcExpr;return;}
  calcExpr+=v;d.textContent=calcExpr;
}

/* === CONTACT FORM === */
function submitForm(btn){
  btn.textContent='Sending...';btn.style.opacity='0.7';
  setTimeout(()=>{
    btn.textContent='Message Sent! 🎉';
    btn.style.background='var(--c5)';btn.style.opacity='1';
    btn.style.boxShadow='3px 3px 0 #065F46';
    launchConfetti();
    setTimeout(()=>{
      btn.textContent='Send Message 🚀';
      btn.style.background='';btn.style.boxShadow='';
    },3000);
  },1500);
}

/* === CONFETTI === */
function launchConfetti(){
  const canvas=document.getElementById('confetti-canvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  const pieces=[];
  const colors=['#FF6B00','#FFB800','#00C2FF','#7C3AED','#10B981','#EF4444','#F97316'];
  for(let i=0;i<160;i++){
    pieces.push({
      x:Math.random()*canvas.width,y:-20,
      vx:(Math.random()-0.5)*6,vy:Math.random()*5+2,
      r:Math.random()*7+3,
      color:colors[Math.floor(Math.random()*colors.length)],
      rot:Math.random()*360,rv:(Math.random()-0.5)*8,
      shape:['circle','rect','triangle'][Math.floor(Math.random()*3)]
    });
  }
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.rot+=p.rv;p.vy+=0.07;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color;
      if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}
      else if(p.shape==='rect'){ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);}
      else{ctx.beginPath();ctx.moveTo(0,-p.r);ctx.lineTo(p.r,p.r);ctx.lineTo(-p.r,p.r);ctx.closePath();ctx.fill();}
      ctx.restore();
    });
    frame++;
    if(frame<220)requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}
