"use strict";
document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-button'),nav=document.getElementById('navigation');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.nav-wrap'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menu.focus();}});
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches;
function applyMotion(){document.documentElement.dataset.motion=paused||document.hidden?'off':'on';}
preference.addEventListener('change',e=>{paused=e.matches;applyMotion();});
document.addEventListener('visibilitychange',applyMotion);applyMotion();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.dataset.reveal='shown';observer.unobserve(e.target);}},{threshold:.08});document.querySelectorAll('.section-head,.upgrade-card,.workflow-steps li,.content-strip,.contact-card').forEach(e=>{e.dataset.reveal='pending';observer.observe(e);});}
const links=[...nav.querySelectorAll('a')],sections=[...document.querySelectorAll('main section[id]')];let queued=false;
function update(){queued=false;const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--progress',String(max>0?Math.min(1,Math.max(0,scrollY/max)):0));let current=null;for(const s of sections)if(s.getBoundingClientRect().top<=100)current=s.id;for(const a of links){if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}}
function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{if(innerWidth>640)closeMenu();schedule();});addEventListener('load',update);update();
