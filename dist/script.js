"use strict";
document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-button'),nav=document.getElementById('navigation');
function closeMenu(restore=false){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');if(restore)menu.focus();}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open'))closeMenu(true);});
const email=document.querySelector('[data-email]'),context=document.getElementById('consult-context');
document.querySelectorAll('[data-consult]').forEach(link=>link.addEventListener('click',()=>{
 const topic=link.dataset.consult;context.textContent='咨询方向：'+topic;
 email.href='mailto:contact@huayangzhikan.com?subject='+encodeURIComponent('华阳智瞰咨询｜'+topic);
}));
const dialog=document.getElementById('qr-dialog'),qrLink=document.querySelector('[data-qr]');
if(typeof dialog.showModal==='function'){
 qrLink.addEventListener('click',e=>{e.preventDefault();dialog.showModal();});
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const box=dialog.getBoundingClientRect();if(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom)dialog.close();}});
}
// Both folders can be previewed from one local server or directly from disk.
if(['localhost','127.0.0.1',''].includes(location.hostname)){
 const base=location.pathname.match(/^(.*\/)HYZK-(?:AIGC|GEO)(?:\/|$)/);
 if(base)document.querySelectorAll('[data-business]').forEach(link=>{link.href=base[1]+'HYZK-'+link.dataset.business+'/index.html';});
}
let queued=false;
function updateProgress(){queued=false;const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',String(max>0?Math.min(1,Math.max(0,scrollY/max)):0));}
function schedule(){if(!queued){queued=true;requestAnimationFrame(updateProgress);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{if(innerWidth>760)closeMenu();schedule();});addEventListener('load',updateProgress);updateProgress();

// Progressive motion: content remains visible without JavaScript or observers.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const entranceAnimations=new Set();
const entranceTargets=document.querySelectorAll('.section-head,.comparison-wrap,.version-value,.why-grid article,#services .card,.aigc-timeline li,.steps:not(.aigc-timeline) li,.application,.industry-grid,.about-layout>div,.faq-intro,.faq-list details,.contact-card,.role-grid article,.skills-title,.skill-card,.review-gate,.build-grid article');
let entranceObserver;
if('IntersectionObserver' in window&&typeof Element.prototype.animate==='function'){
 entranceObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   entranceObserver.unobserve(entry.target);
   if(motionPreference.matches)continue;
   const siblings=Array.from(entry.target.parentElement.children);
   const delay=Math.min(siblings.indexOf(entry.target)%3,2)*65;
   const animation=entry.target.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,delay,easing:'cubic-bezier(.22,1,.36,1)'});
   entranceAnimations.add(animation);
   animation.finished.then(()=>entranceAnimations.delete(animation),()=>entranceAnimations.delete(animation));
  }
 },{threshold:.04,rootMargin:'0px 0px -12px 0px'});
 entranceTargets.forEach(target=>entranceObserver.observe(target));
}
function syncMotion(){
 document.documentElement.toggleAttribute('data-page-paused',document.hidden);
 for(const animation of entranceAnimations){if(motionPreference.matches)animation.cancel();else if(document.hidden)animation.pause();else animation.play();}
}
motionPreference.addEventListener('change',syncMotion);document.addEventListener('visibilitychange',syncMotion);syncMotion();
document.querySelectorAll('.faq-list details').forEach(details=>details.addEventListener('toggle',()=>{
 if(details.open&&!motionPreference.matches&&typeof details.querySelector('p')?.animate==='function')details.querySelector('p').animate([{opacity:0,transform:'translateY(-5px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
}));


// Local demonstration only: no files are uploaded and no real Agent task runs.
const demo=document.getElementById('agent-demo');
if(demo){
 const typing=document.getElementById('demo-typing');
 const run=document.getElementById('demo-run');
 const prompt='根据我提供的资料生成品牌事实库';
 let userPaused=false,inView=true,elapsed=0,last=0,frame=0;
 function setData(key,value){if(demo.dataset[key]!==String(value))demo.dataset[key]=String(value);}
 function renderDemo(ms){
  const stage=ms<2400?'skill':ms<7400?'input':ms<11400?'running':'result';
  const phase=ms<500?'idle':ms<1700?'select':ms<2400?'selected':ms<4700?'typing':ms<6200?'drag':ms<6750?'attached':ms<7400?'click':ms<11400?'running':'done';
  if(phase==='drag'&&demo.dataset.phase!=='drag'){
   const source=demo.querySelector('.material-drag').getBoundingClientRect(),target=demo.querySelector('.fact-attachment').getBoundingClientRect();
   demo.style.setProperty('--drag-x',(target.left-source.left)+'px');
   demo.style.setProperty('--drag-y',(target.top+(target.height-source.height)/2-source.top)+'px');
  }
  setData('stage',stage);setData('phase',phase);setData('selected',ms>=1250);setData('attached',ms>=6100);
  const text=ms<2400?'':prompt.slice(0,Math.max(0,Math.floor((ms-2400)/95)));
  if(typing.textContent!==text)typing.textContent=text;
  setData('runStep',ms<8700?1:ms<10100?2:3);
  demo.style.setProperty('--run-progress',Math.max(0,Math.min(100,(ms-7400)/40))+'%');
  run.disabled=ms<6200||stage==='running';run.textContent=stage==='running'?'运行中':'运行';
 }
 function tick(now){if(last)elapsed=(elapsed+now-last)%15500;last=now;renderDemo(elapsed);frame=requestAnimationFrame(tick);}
 function updateDemo(){
  cancelAnimationFrame(frame);frame=0;last=0;setData('paused',userPaused||document.hidden||!inView);
  if(motionPreference.matches){renderDemo(12000);run.disabled=true;return;}
  if(!userPaused&&!document.hidden&&inView)frame=requestAnimationFrame(tick);
 }
 run.addEventListener('click',()=>{elapsed=7400;userPaused=false;renderDemo(elapsed);updateDemo();});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;updateDemo();},{threshold:.05}).observe(demo);
 document.addEventListener('visibilitychange',updateDemo);motionPreference.addEventListener('change',updateDemo);renderDemo(0);updateDemo();
}
