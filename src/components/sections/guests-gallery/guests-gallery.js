
/**
 * Royal Memories 2.0 — demo local, sem backend.
 * initGuestsGallery aceita o elemento raiz ou funciona sem argumentos.
 * destroyGuestsGallery remove eventos e timers antes de reinicializar.
 */
import { demoGuests, demoPhotos } from "./modules/demo-data.js";
import { makeStars, observeReveals } from "./modules/effects.js";
import { startStarflight } from "./modules/starflight.js";
import { initGuestExperience } from "./modules/guest-experience.js";
import { initRoyalStoryExperience } from "./modules/royal-story-experience.js";
import { royalMemoriesConfig } from "../../../config/royal-memories.config.js";




let dispose = null;
export function destroyGuestsGallery() { if (dispose) { dispose(); dispose = null; } }
export function initGuestsGallery(root = document.getElementById("guest-gallery"), options = {}) {
  destroyGuestsGallery();
  if (!root) return;

  const isDemoMode = royalMemoriesConfig.demoMode === true;

  const guests = (
    isDemoMode
      ? (options.guests ?? demoGuests)
      : (options.guests ?? [])
  ).filter(guest => guest.approved === true || isDemoMode && guest.approved !== false);

  const photos = (
    isDemoMode
      ? (options.photos ?? demoPhotos)
      : (options.photos ?? [])
  ).filter(photo => photo.approved === true || isDemoMode && photo.approved !== false);

  const $ = selector => root.querySelector(selector);
  const el = { stories: $("[data-stories]"), photos: $("[data-photos]"), search: $("[data-search]"), storyModal: $("[data-story-modal]"), photoModal: $("[data-photo-modal]") };
  const required = ["[data-story-modal]", "[data-story-image]", "[data-story-video]", "[data-story-name]", "[data-photo-modal]", "[data-photo-image]", "[data-photo-name]"];
  const missing = required.filter(s => !$(s)); if (missing.length) { console.error("Royal Memories: faltam elementos HTML", missing); return; }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cleanup = [];

  let activeGuest = null;
  let storyIndex = 0;
  let photoIndex = 0;
  let storyTimer = null;
  let started = 0;
  let elapsed = 0;
  let previousFocus = null;
  let storyPauseController = null;

  const on = (node, event, handler) => { node.addEventListener(event, handler); cleanup.push(() => node.removeEventListener(event, handler)); };

  const clearStoryTimer = () => {
    if (storyTimer !== null) {
      clearInterval(storyTimer);
      storyTimer = null;
    }

    if (storyPauseController !== null) {
      storyPauseController.abort();
      storyPauseController = null;
    }
  };


  function updateVideoProgress() {
    const video = $("[data-story-video]");
    const bar = $("[data-progress]");

    if (!video || !bar || video.hidden) return;

    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      bar.style.width = "0%";
      updateStorySegments(0);
      return;
    }

    const progress = Math.min(
      100,
      (video.currentTime / video.duration) * 100
    );

    bar.style.width = `${progress}%`;
    updateStorySegments(progress);
  }


  const escape = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = s => String(s).trim().split(/\s+/).slice(0, 2).map(v => v[0] ?? "").join("").toUpperCase();
  function renderStories(term = "") {
    const normalized = term.trim().toLocaleLowerCase("es");
    const filtered = guests.filter(g => g.name.toLocaleLowerCase("es").includes(normalized) && g.stories?.length);
    el.stories.innerHTML = filtered.map(g => `<button class="rm-story" type="button" data-guest="${escape(g.id)}" aria-label="Ver historias de ${escape(g.name)}"><span class="rm-ring"><span class="rm-avatar">${g.avatar ? `<img src="${escape(g.avatar)}" alt="" loading="lazy">` : escape(initials(g.name))}</span></span><strong>${escape(g.name)}</strong><small>${g.stories.length} ${g.stories.length === 1 ? "historia" : "historias"}</small></button>`).join("");
    $("[data-story-count]").textContent = `${filtered.length} ${filtered.length === 1 ? "invitado" : "invitados"}`;
    $("[data-no-stories]").hidden = filtered.length > 0;
  }
  function renderPhotos() {
    el.photos.innerHTML = photos.map((p, i) => `<button type="button" class="rm-tile" data-photo-index="${i}" aria-label="Abrir fotografía de ${escape(p.name)}"><img src="${escape(p.src)}" alt="${escape(p.alt ?? "Recuerdo de boda")}" loading="lazy"><span>${escape(p.name)}</span></button>`).join("");
    $("[data-photo-count]").textContent = `${photos.length} ${photos.length === 1 ? "fotografía" : "fotografías"}`;
    $("[data-no-photos]").hidden = photos.length > 0;
  }
  function modalOpen(node) { previousFocus = document.activeElement; node.hidden = false; node.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; node.querySelector("button")?.focus(); }
  function modalClose(node) { node.hidden = true; node.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; previousFocus?.focus?.(); previousFocus = null; }

  function closeStory() {
    clearStoryTimer();

    const video = $("[data-story-video]");
    const modal = el.storyModal;
    const bar = $("[data-progress]");
    const segments = $("[data-progress-segments]");

    video.pause();

    modal.classList.remove("rm-story-held");

    if (bar) {
      bar.style.width = "0%";
    }

    if (segments) {
      segments.replaceChildren();
    }

    modalClose(modal);

    activeGuest = null;
    storyIndex = 0;
    elapsed = 0;
    started = 0;
  }

  function closePhoto() { modalClose(el.photoModal); }


  function renderStorySegments() {
    const container = $("[data-progress-segments]");

    if (!container || !activeGuest) return;

    container.replaceChildren();

    activeGuest.stories.forEach((_, index) => {
      const segment = document.createElement("span");
      const fill = document.createElement("span");

      segment.className = "rm-progress-segment";
      fill.className = "rm-progress-segment-fill";

      if (index < storyIndex) {
        fill.style.width = "100%";
      } else {
        fill.style.width = "0%";
      }

      if (index === storyIndex) {
        segment.classList.add("is-active");
      }

      segment.appendChild(fill);
      container.appendChild(segment);
    });
  }

  function updateStorySegments(percent) {
    const container = $("[data-progress-segments]");

    if (!container) return;

    const segments = container.querySelectorAll(
      ".rm-progress-segment-fill"
    );

    const progress = Math.max(
      0,
      Math.min(100, Number(percent) || 0)
    );

    segments.forEach((fill, index) => {
      fill.style.width =
        index < storyIndex
          ? "100%"
          : index === storyIndex
            ? `${progress}%`
            : "0%";
    });
  }

  function storyRender() {
    if (!activeGuest) return;

    const item = activeGuest.stories[storyIndex];
    const isVideo = item.type === "video";

    const img = $("[data-story-image]");
    const video = $("[data-story-video]");
    const bar = $("[data-progress]");

    clearStoryTimer();

    video.pause();
    video.removeAttribute("src");
    video.load();

    img.hidden = isVideo;
    video.hidden = !isVideo;

    if (isVideo) {
      video.src = item.src;
      video.load();

      if (!document.hidden) {
        video.play().catch(() => { });
      }
    } else {
      img.src = item.src;
      img.alt = item.alt ||
        `Historia de ${activeGuest.name}`;

      img.getAnimations().forEach(animation => animation.cancel());
      if (!reduced) {
        img.animate(
          [
            {
              opacity: 0.3,
              transform: "scale(1.045)",
              filter: "blur(6px)"
            },
            {
              opacity: 1,
              transform: "scale(1)",
              filter: "blur(0)"
            }
          ],
          {
            duration: 420,
            easing: "ease-out"
          }
        );
      }
    }

    $("[data-story-name]").textContent =
      activeGuest.name;

    $("[data-story-position]").textContent =
      `${storyIndex + 1} / ${activeGuest.stories.length}`;

    bar.style.width = "0%";
    renderStorySegments();

    elapsed = 0;
    started = performance.now();

    if (!isVideo && !reduced) {
      const duration = 6000;

      let paused = document.hidden;
      let pausedAt = paused ? performance.now() : 0;

      const modal = el.storyModal;

      // Impede que os eventos se acumulem ao mudar de story.
      if (storyPauseController) {
        storyPauseController.abort();
      }

      storyPauseController = new AbortController();

      modal.addEventListener(
        "royalstory:pausechange",
        event => {
          const shouldPause = event.detail.paused;

          if (shouldPause && !paused) {
            paused = true;
            pausedAt = performance.now();
          } else if (!shouldPause && paused) {
            started += performance.now() - pausedAt;
            paused = false;
          }
        },
        {
          signal: storyPauseController.signal
        }
      );

      storyTimer = setInterval(() => {
        if (modal.hidden || paused || document.hidden) return;

        elapsed = performance.now() - started;

        bar.style.width =
          `${Math.min(100, elapsed / duration * 100)}%`;
        updateStorySegments(elapsed / duration * 100);
        if (elapsed >= duration) {
          clearStoryTimer();
          stepStory(1);
        }
      }, 90);
    }
  }

  function stepStory(delta) { if (!activeGuest) return; const next = storyIndex + delta; if (next < 0 || next >= activeGuest.stories.length) { closeStory(); return; } storyIndex = next; storyRender(); }
  function openStory(id) { activeGuest = guests.find(g => String(g.id) === String(id)); if (!activeGuest) return; storyIndex = 0; modalOpen(el.storyModal); storyRender(); }

  function photoRender() {
    if (!photos.length) return;

    const p = photos[photoIndex];
    const image = $("[data-photo-image]");

    image.src = p.src;
    image.alt = p.alt || `Fotografía de ${p.name}`;

    $("[data-photo-name]").textContent = p.name;

    $("[data-photo-position]").textContent =
      `${photoIndex + 1} / ${photos.length}`;

    image.getAnimations().forEach(animation => animation.cancel());

    if (!reduced) {
      image.animate(
        [
          {
            opacity: 0.35,
            transform: "scale(1.035)",
            filter: "blur(7px)"
          },
          {
            opacity: 1,
            transform: "scale(1)",
            filter: "blur(0)"
          }
        ],
        {
          duration: 480,
          easing: "ease-out"
        }
      );
    }
  }

  function openPhoto(index) { if (!photos.length) return; photoIndex = index; modalOpen(el.photoModal); photoRender(); }
  function stepPhoto(delta) { photoIndex = (photoIndex + delta + photos.length) % photos.length; photoRender(); }
  on(el.search, "input", () => renderStories(el.search.value));
  on(el.stories, "click", e => { const b = e.target.closest("[data-guest]"); if (b) openStory(b.dataset.guest); });
  on(el.photos, "click", e => { const b = e.target.closest("[data-photo-index]"); if (b) openPhoto(Number(b.dataset.photoIndex)); });
  root.querySelectorAll("[data-close-story]").forEach(n => on(n, "click", closeStory));
  root.querySelectorAll("[data-close-photo]").forEach(n => on(n, "click", closePhoto));
  on($("[data-prev-story]"), "click", () => stepStory(-1)); on($("[data-next-story]"), "click", () => stepStory(1));
  on($("[data-prev-photo]"), "click", () => stepPhoto(-1)); on($("[data-next-photo]"), "click", () => stepPhoto(1));
  on($("[data-story-video]"), "ended", () => stepStory(1));

  on(
    $("[data-story-video]"),
    "timeupdate",
    updateVideoProgress
  );

  on(
    $("[data-story-video]"),
    "loadedmetadata",
    updateVideoProgress
  );

  const keyboard = e => { if (e.key === "Escape") { if (!el.storyModal.hidden) closeStory(); else if (!el.photoModal.hidden) closePhoto(); } if (e.key === "ArrowRight") { if (!el.storyModal.hidden) stepStory(1); else if (!el.photoModal.hidden) stepPhoto(1); } if (e.key === "ArrowLeft") { if (!el.storyModal.hidden) stepStory(-1); else if (!el.photoModal.hidden) stepPhoto(-1); } if (e.key === "Tab") { const modal = !el.storyModal.hidden ? el.storyModal : !el.photoModal.hidden ? el.photoModal : null; if (!modal) return; const focusable = [...modal.querySelectorAll("button:not([disabled])")]; const i = focusable.indexOf(document.activeElement); if (e.shiftKey && i === 0) { e.preventDefault(); focusable.at(-1)?.focus(); } else if (!e.shiftKey && i === focusable.length - 1) { e.preventDefault(); focusable[0]?.focus(); } } };
  on(document, "keydown", keyboard);
  const undoStars = makeStars($("[data-stars]"), reduced);
  const undoFlight = startStarflight(root, $("[data-starflight]"), reduced);
  const undoReveal = observeReveals(root, reduced);
  renderStories(); renderPhotos();
  const destroyGuestExperience = initGuestExperience(root);
  const destroyRoyalStoryExperience = initRoyalStoryExperience(root);


  dispose = () => {
    clearStoryTimer();

    $("[data-story-video]").pause();

    destroyGuestExperience();
    destroyRoyalStoryExperience();

    document.body.style.overflow = "";

    cleanup.forEach(fn => fn());

    undoStars();
    undoReveal();
    undoFlight();
  };

  return dispose;

}

export default initGuestsGallery;
