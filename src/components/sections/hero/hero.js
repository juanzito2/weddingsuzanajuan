/** ROYAL CELESTIAL HERO · Suzana & Juan */
const WEDDING_DATE = "2027-01-09T16:20:00+01:00"; // Valencia, Spain
const HERO_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function initHero() {
  const hero = document.querySelector("#hero");
  if (!hero || hero.dataset.heroInitialized === "true") return;
  hero.dataset.heroInitialized = "true";
  const reduced = window.matchMedia(HERO_REDUCED_MOTION).matches;
  initCountdown(hero);
  initDiscoverButton(hero, reduced);
  initKineticNames(hero, reduced);
  initReveals(hero, reduced);
  if (!reduced) {
    initStars(hero);
    initMeteors(hero);
    initBursts(hero);
    initPointerParallax(hero);
  }
  hero.classList.add("hero--ready");
  console.log("✓ Royal Celestial Hero inicializado");
}

function initCountdown(hero) {
  const countdown = hero.querySelector("#hero-countdown");
  if (!countdown || countdown.dataset.initialized === "true") return;
  const parts = ["days", "hours", "minutes", "seconds"].map(key => hero.querySelector(`#countdown-${key}`));
  if (parts.some(element => !element)) return;
  countdown.dataset.initialized = "true";
  const target = new Date(WEDDING_DATE).getTime();
  const render = () => {
    const diff = Math.max(0, target - Date.now());
    const total = Math.floor(diff / 1000);
    const values = [Math.floor(total / 86400), Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60];
    values.forEach((value, index) => {
      const next = index === 0 ? String(value) : String(value).padStart(2, "0");
      if (parts[index].textContent !== next) parts[index].textContent = next;
    });
    if (diff === 0 && hero._heroCountdownInterval) {
      clearInterval(hero._heroCountdownInterval);
      hero._heroCountdownInterval = null;
    }
  };
  render();
  if (Date.now() < target) hero._heroCountdownInterval = window.setInterval(render, 1000);
}

function initDiscoverButton(hero, reduced) {
  const button = hero.querySelector("#hero-discover");
  if (!button) return;
  button.addEventListener("click", () => {
    const story = document.querySelector("#story");
    if (!story) return;
    story.scrollIntoView({behavior: reduced ? "auto" : "smooth", block: "start"});
  });
}

function initKineticNames(hero, reduced) {
  hero.querySelectorAll("[data-hero-letters]").forEach((element, wordIndex) => {
    const text = element.dataset.heroLetters || element.textContent.trim();
    element.textContent = "";
    Array.from(text).forEach((letter, index) => {
      const span = document.createElement("span");
      span.className = "hero__letter";
      span.textContent = letter;
      span.setAttribute("aria-hidden", "true");
      const direction = index % 2 === 0 ? 1 : -1;
      span.style.setProperty("--lx", `${direction * (45 + index * 10)}px`);
      span.style.setProperty("--ly", `${direction * (75 + index * 8)}px`);
      span.style.setProperty("--lr", `${direction * (55 + index * 13)}deg`);
      span.style.setProperty("--letter-delay", reduced ? "0ms" : `${380 + wordIndex * 210 + index * 100}ms`);
      span.style.setProperty("--float-delay", `${index * 170}ms`);
      element.append(span);
    });
  });
}

function initReveals(hero, reduced) {
  hero.querySelectorAll(".hero__reveal").forEach((element, index) => {
    element.style.setProperty("--reveal-delay", reduced ? "0ms" : `${120 + index * 125}ms`);
  });
}

// Seeded random makes the visual consistent and avoids layout flicker across visits.
function makeRandom(seed = 2027) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function initStars(hero) {
  const container = hero.querySelector("#hero-starfield");
  if (!container) return;
  const random = makeRandom(9027);
  const count = window.innerWidth < 700 ? 65 : 130;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = `hero__star${i % 17 === 0 ? " hero__star--cross" : ""}`;
    const size = i % 17 === 0 ? 4 : 1 + random() * 2.4;
    star.style.setProperty("--x", `${(random() * 100).toFixed(2)}%`);
    star.style.setProperty("--y", `${(random() * 100).toFixed(2)}%`);
    star.style.setProperty("--s", `${size.toFixed(2)}px`);
    star.style.setProperty("--o", `${(.3 + random() * .65).toFixed(2)}`);
    star.style.setProperty("--d", `${(1.7 + random() * 4).toFixed(2)}s`);
    star.style.setProperty("--delay", `${(-random() * 8).toFixed(2)}s`);
    fragment.append(star);
  }
  container.replaceChildren(fragment);
}

function initMeteors(hero) {
  const container = hero.querySelector("#hero-meteors");
  if (!container) return;
  const random = makeRandom(109);
  const fragment = document.createDocumentFragment();
  const count = window.innerWidth < 700 ? 3 : 6;
  for (let i = 0; i < count; i++) {
    const meteor = document.createElement("span");
    meteor.className = "hero__meteor";
    meteor.style.setProperty("--x", `${(random() * 90).toFixed(1)}%`);
    meteor.style.setProperty("--y", `${(random() * 65).toFixed(1)}%`);
    meteor.style.setProperty("--d", `${(6 + random() * 7).toFixed(1)}s`);
    meteor.style.setProperty("--delay", `${(-random() * 10).toFixed(1)}s`);
    fragment.append(meteor);
  }
  container.replaceChildren(fragment);
}

function initBursts(hero) {
  const container = hero.querySelector("#hero-bursts");
  if (!container) return;
  const random = makeRandom(271);
  const burst = () => {
    if (document.hidden || !hero.isConnected) return;
    const fragment = document.createDocumentFragment();
    const count = window.innerWidth < 700 ? 18 : 36;
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = "hero__burst";
      const angle = (Math.PI * 2 * i / count) + random() * .25;
      const distance = 100 + random() * (window.innerWidth < 700 ? 150 : 300);
      spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      spark.style.setProperty("--s", `${(2 + random() * 4).toFixed(1)}px`);
      fragment.append(spark);
    }
    container.replaceChildren(fragment);
  };
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      burst();
      observer.disconnect();
    }
  }, {threshold: .2});
  observer.observe(hero);
  const button = hero.querySelector("#hero-discover");
  if (button) button.addEventListener("pointerenter", burst);
}

function initPointerParallax(hero) {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const portal = hero.querySelector("#hero-portal");
  if (!portal) return;
  let raf = 0;
  hero.addEventListener("pointermove", event => {
    if (raf) return;
    const x = (event.clientX / window.innerWidth - .5) * 14;
    const y = (event.clientY / window.innerHeight - .5) * 14;
    raf = requestAnimationFrame(() => {
      portal.style.marginLeft = `${x}px`;
      portal.style.marginTop = `${y}px`;
      raf = 0;
    });
  }, {passive: true});
  hero.addEventListener("pointerleave", () => {
    portal.style.marginLeft = "0";
    portal.style.marginTop = "0";
  });
}
