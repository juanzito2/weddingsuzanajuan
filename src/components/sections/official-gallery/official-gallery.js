import {initReflections} from './effects/reflections.js';
import {initGalleryLightbox} from './lightbox/lightbox.js';
export function initOfficialGallery(){const root=document.getElementById('official-gallery');if(!root||root.dataset.initialized==='true')return;root.dataset.initialized='true';const reveal=[...root.querySelectorAll('.og-reveal')];if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion:reduce)').matches){reveal.forEach(el=>el.classList.add('is-visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});reveal.forEach(el=>observer.observe(el))}const stars=root.querySelector('.og-stars');for(let i=0;i<32;i++){const s=document.createElement('span');s.className='og-star';s.style.left=`${(i*73.7)%100}%`;s.style.top=`${(i*39.13+7)%100}%`;s.style.animationDelay=`-${(i%7)*.6}s`;stars.append(s)}// V6: estrelas concentradas nas margens para preencher o espaço vazio.
const sideStars=root.querySelector('[data-og-side-stars]');
const isMobileSide=window.matchMedia('(max-width:700px)').matches;
const prefersLessMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
if(sideStars){
  const count=isMobileSide?64:180;
  const fraction=n=>{const x=Math.sin(n*92.731+14.81)*43758.5453;return x-Math.floor(x)};
  for(let i=0;i<count;i++){
    const star=document.createElement('span');
    const right=i%2===1;
    const edge=fraction(i+12);
    const x=right? 85+edge*14.5 : .5+edge*14.5;
    const y=fraction(i+601)*100;
    const size=i%19===0?5.5:i%7===0?3.5:1+fraction(i+93)*1.8;
    star.className='og-side-star'+(i%19===0?' og-side-star--cross':'');
    star.style.setProperty('--side-x',`${x}%`);
    star.style.setProperty('--side-y',`${y}%`);
    star.style.setProperty('--side-size',`${size}px`);
    star.style.setProperty('--side-opacity',`${.32+fraction(i+223)*.5}`);
    star.style.setProperty('--side-duration',`${3+fraction(i+117)*6}s`);
    star.style.setProperty('--side-delay',`${-fraction(i+311)*8}s`);
    if(prefersLessMotion)star.style.animation='none';
    sideStars.append(star);
  }
}
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;const mobile=window.matchMedia('(max-width:700px)').matches;const dust=root.querySelector('[data-og-dust]');const meteors=root.querySelector('[data-og-meteors]');if(!reduced){for(let i=0;i<(mobile?65:150);i++){const s=document.createElement('span');const f=n=>((Math.sin(n*127.1)*43758.5453)%1+1)%1;s.style.setProperty('--x',`${f(i+1)*100}%`);s.style.setProperty('--y',`${f(i+17)*100}%`);s.style.setProperty('--s',`${1+f(i+31)*2.8}px`);s.style.setProperty('--t',`${2+f(i+43)*6}s`);s.style.setProperty('--d',`${-f(i+51)*9}s`);s.style.setProperty('--c',i%3?'#fff6dd':'#c9b9f5');dust?.append(s)}for(let i=0;i<(mobile?5:12);i++){const m=document.createElement('span');m.className='og-meteor';m.style.setProperty('--x',`${(i*19.3+11)%100}%`);m.style.setProperty('--y',`${(i*11.7+4)%95}%`);m.style.setProperty('--w',`${65+i%5*17}px`);m.style.setProperty('--t',`${9+i%5*2}s`);m.style.setProperty('--d',`${-i*2.7}s`);meteors?.append(m)}}// All Stars V4: constelações e cristais leves no fundo, sem cobrir fotografias.
const constellations=root.querySelector('[data-og-constellations]');
const crystals=root.querySelector('[data-og-crystals]');
if(!reduced){
 const patterns=[[[7,17],[43,7],[69,38],[92,13]],[[12,65],[38,19],[67,46],[90,11]],[[8,8],[26,52],[55,26],[82,73]],[[10,40],[38,10],[70,16],[93,70]]];
 for(let i=0;i<(mobile?10:24);i++){
  const pts=patterns[i%patterns.length];
  const shape=document.createElement('span');shape.className='og-constellation';
  shape.style.setProperty('--x',`${(i*43.37+5)%93}%`);
  shape.style.setProperty('--y',`${(i*31.17+4)%96}%`);
  shape.style.setProperty('--w',`${mobile?65:90+(i%4)*22}px`);
  shape.style.setProperty('--h',`${mobile?45:65+(i%3)*17}px`);
  shape.style.setProperty('--duration',`${9+i%7*2}s`);
  shape.style.setProperty('--delay',`${-i*.8}s`);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 80');svg.setAttribute('aria-hidden','true');
  const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.setAttribute('d','M'+pts.map(p=>p.join(' ')).join(' L'));svg.append(line);
  for(const pt of pts){const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',pt[0]);dot.setAttribute('cy',pt[1]);dot.setAttribute('r','1.8');svg.append(dot)}
  shape.append(svg);constellations?.append(shape);
 }
 for(let i=0;i<(mobile?18:55);i++){
  const crystal=document.createElement('span');crystal.className='og-crystal';
  crystal.style.setProperty('--x',`${(i*47.91+12)%97}%`);
  crystal.style.setProperty('--y',`${(i*29.13+7)%98}%`);
  crystal.style.setProperty('--s',`${4+i%5*2}px`);
  crystal.style.setProperty('--t',`${5+i%6*2}s`);
  crystal.style.setProperty('--delay',`${-i*.47}s`);
  crystals?.append(crystal);
 }
}
initReflections(root);initGalleryLightbox(root);root.querySelectorAll('.og-photo img').forEach(img=>img.addEventListener('error',()=>console.warn('Imagem não encontrada:',img.src)));console.log('✓ Official Gallery Glass Deluxe inicializada')}
