/** STORY — Royal Celestial Experience v2 | Suzana & Juan */
export function initStory() {
  const root = document.querySelector('#story');
  if (!root || root.dataset.storyInitialized === 'true') return;
  const pages = [...root.querySelectorAll('[data-story-page]')];
  const tabs = [...root.querySelectorAll('[data-story-go]')];
  const prev = root.querySelector('[data-story-prev]');
  const next = root.querySelector('[data-story-next]');
  const book = root.querySelector('[data-story-book]');
  const stars = root.querySelector('[data-story-stars]');
  const meteors = root.querySelector('[data-story-meteors]');
  const burst = root.querySelector('[data-story-burst]');
  const announce = root.querySelector('[data-story-announcement]');
  const experience = root.querySelector('[data-story-experience]');
  const playButton = root.querySelector('[data-story-play]');
  const autoLabel = root.querySelector('[data-story-auto-label]');
  const progress = root.querySelector('[data-story-progress]');
  if (pages.length !== 2 || !book || !experience) return;
  root.dataset.storyInitialized = 'true';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL = 16000; // 16 segundos para ler cada capítulo.
  root.style.setProperty('--story-interval', `${INTERVAL}ms`);
  let active = 0, turning = false, autoEnabled = !reduceMotion.matches;
  let visible = false, autoTimer = null, turnTimer = null, burstTimer = null;

  // Agrupa as letras por palavra para nunca partir «Dios» ou outras palavras.
  pages.forEach(page => {
    const title = page.querySelector('[data-story-kinetic]');
    if (!title) return;
    const original = title.textContent.trim();
    title.setAttribute('aria-label', original);
    title.replaceChildren();
    let letterIndex = 0;
    original.split(/\s+/).forEach(word => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'story__kinetic-word';
      wordSpan.setAttribute('aria-hidden', 'true');
      [...word].forEach(character => {
        const letter = document.createElement('span');
        letter.className = 'story__kinetic-letter';
        letter.style.setProperty('--letter-delay', `${Math.min(letterIndex++ * 23, 520)}ms`);
        letter.textContent = character;
        wordSpan.append(letter);
      });
      title.append(wordSpan);
      title.append(document.createTextNode(' '));
    });
    page.querySelectorAll('.story__page-copy > *').forEach((element, index) => {
      element.style.setProperty('--stagger', `${Math.min(index * 60, 360)}ms`);
    });
  });

  if (!reduceMotion.matches) {
    const mobile = window.matchMedia('(max-width: 600px)').matches;
    if (stars) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < (mobile ? 85 : 175); i++) {
        const star = document.createElement('span');
        star.className = 'story__star';
        const size = .6 + Math.random() * 2.9;
        star.style.cssText = `--x:${(Math.random()*100).toFixed(2)}%;--y:${(Math.random()*100).toFixed(2)}%;--size:${size.toFixed(2)}px;--opacity:${(.25+Math.random()*.7).toFixed(2)};--duration:${(1.4+Math.random()*4).toFixed(2)}s;--delay:${(-Math.random()*9).toFixed(2)}s`;
        fragment.append(star);
      }
      stars.append(fragment);
    }
    if (meteors) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < (mobile ? 7 : 15); i++) {
        const meteor = document.createElement('span');
        meteor.className = 'story__meteor';
        meteor.style.cssText = `--mx:${(Math.random()*90-20).toFixed(1)}%;--my:${(Math.random()*65).toFixed(1)}%;--ml:${(50+Math.random()*120).toFixed(1)}px;--md:${(4+Math.random()*7).toFixed(1)}s;--delay:${(-Math.random()*15).toFixed(1)}s`;
        fragment.append(meteor);
      }
      meteors.append(fragment);
    }
  }

  function explode() {
    if (!burst || reduceMotion.matches) return;
    clearTimeout(burstTimer);
    burst.replaceChildren();
    const fragment = document.createDocumentFragment();
    const mobile = window.matchMedia('(max-width: 600px)').matches;
    for (let i = 0; i < (mobile ? 45 : 100); i++) {
      const spark = document.createElement('span');
      spark.className = 'story__spark';
      const angle = Math.random()*Math.PI*2;
      const distance = 110+Math.random()*(mobile ? 230 : 510);
      spark.style.setProperty('--dx', `${(Math.cos(angle)*distance).toFixed(1)}px`);
      spark.style.setProperty('--dy', `${(Math.sin(angle)*distance).toFixed(1)}px`);
      spark.style.setProperty('--spark-size', `${(2+Math.random()*5).toFixed(1)}px`);
      fragment.append(spark);
    }
    burst.append(fragment);
    burstTimer = setTimeout(() => burst.replaceChildren(), 1400);
  }

  function updateNavigation() {
    tabs.forEach((tab,index) => {
      const selected = index === active;
      tab.classList.toggle('is-active', selected);
      if (selected) tab.setAttribute('aria-current','step');
      else tab.removeAttribute('aria-current');
      tab.disabled = turning;
    });
    if (prev) prev.disabled = turning; // permite voltar do I para o II
    if (next) next.disabled = turning;
  }

  function resetProgress() {
    if (!progress) return;
    progress.style.animation = 'none';
    void progress.offsetWidth;
    progress.style.animation = '';
  }

  function clearAuto() {
    clearTimeout(autoTimer);
    autoTimer = null;
    root.classList.remove('is-auto-running');
  }

  function scheduleAuto() {
    clearAuto();
    if (!autoEnabled || !visible || turning || document.hidden || reduceMotion.matches) return;
    resetProgress();
    root.classList.add('is-auto-running');
    autoTimer = setTimeout(() => goTo((active+1)%pages.length), INTERVAL);
  }

  function finish(target) {
    pages.forEach((page,index) => {
      const selected = index === target;
      page.classList.toggle('story__page--active', selected);
      page.classList.remove('is-entering','is-leaving');
      page.setAttribute('aria-hidden', String(!selected));
      page.inert = !selected;
    });
    book.classList.remove('is-turning');
    active = target;
    turning = false;
    updateNavigation();
    if (announce) announce.textContent = `Capítulo ${target+1}: ${pages[target].querySelector('.story__chapter-title')?.getAttribute('aria-label')||''}`;
    scheduleAuto();
  }

  function goTo(target) {
    if (turning || target === active || target < 0 || target >= pages.length) return;
    clearAuto();
    const from = active;
    turning = true;
    active = target;
    updateNavigation();
    root.classList.toggle('story--chapter-one',target===0);
    root.classList.toggle('story--chapter-two',target===1);
    if (reduceMotion.matches) { finish(target); return; }
    pages[from].classList.add('is-leaving');
    pages[target].classList.add('is-entering');
    pages[target].inert = false;
    pages[target].setAttribute('aria-hidden','false');
    book.classList.remove('is-turning');
    void book.offsetWidth;
    book.classList.add('is-turning');
    explode();
    clearTimeout(turnTimer);
    turnTimer = setTimeout(() => finish(target), 1350);
  }

  tabs.forEach((tab,index) => tab.addEventListener('click',()=>goTo(index)));
  prev?.addEventListener('click',()=>goTo((active+pages.length-1)%pages.length));
  next?.addEventListener('click',()=>goTo((active+1)%pages.length));

  let touchStartX = 0, touchStartY = 0;
  experience.addEventListener('touchstart',event=>{
    touchStartX=event.changedTouches[0].screenX;
    touchStartY=event.changedTouches[0].screenY;
  },{passive:true});
  experience.addEventListener('touchend',event=>{
    const dx=event.changedTouches[0].screenX-touchStartX;
    const dy=event.changedTouches[0].screenY-touchStartY;
    if (Math.abs(dx)>65 && Math.abs(dx)>Math.abs(dy)*1.3) goTo((active+(dx<0?1:-1)+pages.length)%pages.length);
  },{passive:true});
  root.addEventListener('keydown',event=>{
    if (!root.contains(document.activeElement)) return;
    if (event.key==='ArrowRight') {event.preventDefault();goTo((active+1)%pages.length);}
    if (event.key==='ArrowLeft') {event.preventDefault();goTo((active+pages.length-1)%pages.length);}
  });

  function updatePlayButton() {
    if (playButton) {
      playButton.textContent = autoEnabled ? '❚❚' : '▶';
      playButton.setAttribute('aria-label',autoEnabled?'Pausar cambio automático':'Reanudar cambio automático');
      playButton.setAttribute('aria-pressed',String(autoEnabled));
    }
    if (autoLabel) autoLabel.textContent=autoEnabled?'CAMBIO AUTOMÁTICO':'EN PAUSA';
  }
  playButton?.addEventListener('click',()=>{
    autoEnabled=!autoEnabled;
    updatePlayButton();
    if (autoEnabled) scheduleAuto(); else clearAuto();
  });

  const visibilityObserver = new IntersectionObserver(entries=>{
    visible=entries[0]?.isIntersecting??false;
    if (visible) scheduleAuto(); else clearAuto();
  },{threshold:.12});
  visibilityObserver.observe(root);
  document.addEventListener('visibilitychange',()=>{
    if (document.hidden) clearAuto(); else scheduleAuto();
  });
  pages.forEach((page,index)=>{page.inert=index!==active;});
  updateNavigation();
  updatePlayButton();
  console.log('✓ Story Royal Celestial v2 inicializado');
}
