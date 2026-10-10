
/* =====================================================
   ROYAL MEMORIES 4.0 — ROYAL STORY EXPERIENCE
   ===================================================== */

export function initRoyalStoryExperience(root) {
    if (!root) return () => {};

    if (root.dataset.royalStoryExperienceReady === "true") {
        return () => {};
    }

    const modal = root.querySelector("[data-story-modal]");
    const media = modal?.querySelector(".rm-media");

    if (!modal || !media) return () => {};

    root.dataset.royalStoryExperienceReady = "true";

    const controller = new AbortController();
    const { signal } = controller;

    let pointerHeld = false;

    function isOpen() {
        return !modal.hidden &&
            modal.getAttribute("aria-hidden") !== "true";
    }

    function getVideo() {
        const video = modal.querySelector("[data-story-video]");
        return video && !video.hidden ? video : null;
    }

    function setPaused(paused) {
        if (!isOpen()) return;

        modal.classList.toggle("rm-story-held", paused);

        const video = getVideo();

        if (video) {
            if (paused) {
                video.pause();
            } else if (!document.hidden) {
                video.play().catch(() => {});
            }
        }

        modal.dispatchEvent(
            new CustomEvent("royalstory:pausechange", {
                detail: { paused },
                bubbles: true
            })
        );
    }

    media.addEventListener("pointerdown", event => {
        if (!isOpen()) return;

        if (event.button !== 0) return;
        if (event.target.closest("button, video")) return;

        pointerHeld = true;
        setPaused(true);
    }, { signal });

    function release() {
        if (!pointerHeld) return;

        pointerHeld = false;
        setPaused(document.hidden);
    }

    window.addEventListener("pointerup", release, { signal });
    window.addEventListener("pointercancel", release, { signal });

    document.addEventListener("visibilitychange", () => {
        if (!isOpen()) return;
        setPaused(document.hidden || pointerHeld);
    }, { signal });

    console.log("✓ Royal Story Experience inicializado");

    return function destroyRoyalStoryExperience() {
        controller.abort();
        pointerHeld = false;
        modal.classList.remove("rm-story-held");
        delete root.dataset.royalStoryExperienceReady;
    };
}
