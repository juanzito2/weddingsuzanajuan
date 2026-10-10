
/* ==================================================
   ROYAL MEMORIES 4.0 — GUEST EXPERIENCE
   ================================================== */

export function initGuestExperience(root) {
    if (!root) return () => {};

    if (root.dataset.guestExperienceReady === "true") {
        return () => {};
    }

    root.dataset.guestExperienceReady = "true";

    const controller = new AbortController();
    const { signal } = controller;

    const MIN_DISTANCE = 55;
    const MAX_VERTICAL_DRIFT = 85;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let tracking = false;

    function getActiveModal() {
        return [...root.querySelectorAll(".rm-modal")]
            .find(modal =>
                !modal.hidden &&
                modal.getAttribute("aria-hidden") !== "true"
            );
    }

    function navigate(direction) {
        const modal = getActiveModal();
        if (!modal) return;

        const selector = direction === "next"
            ? ".rm-next"
            : ".rm-prev";

        const button = modal.querySelector(selector);

        if (button && !button.disabled) {
            button.click();
        }
    }

    root.addEventListener("touchstart", event => {
        tracking = false;

        const modal = getActiveModal();

        if (!modal || event.touches.length !== 1) return;

        // Não interferir em controlos interativos.
        if (event.target.closest(
            "button, input, textarea, select, video"
        )) {
            return;
        }

        const touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        tracking = true;
    }, { passive: true, signal });

    root.addEventListener("touchend", event => {
        if (!tracking) return;
        tracking = false;

        if (!getActiveModal()) return;
        if (event.changedTouches.length !== 1) return;

        const touch = event.changedTouches[0];

        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const duration = Date.now() - touchStartTime;

        if (duration > 900) return;
        if (Math.abs(deltaX) < MIN_DISTANCE) return;
        if (Math.abs(deltaY) > MAX_VERTICAL_DRIFT) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

        navigate(deltaX < 0 ? "next" : "previous");
    }, { passive: true, signal });

    root.addEventListener("touchcancel", () => {
        tracking = false;
    }, { passive: true, signal });

    root.querySelectorAll(".rm-prev").forEach(button => {
        if (!button.hasAttribute("aria-label")) {
            button.setAttribute(
                "aria-label",
                "Ver elemento anterior"
            );
        }
    });

    root.querySelectorAll(".rm-next").forEach(button => {
        if (!button.hasAttribute("aria-label")) {
            button.setAttribute(
                "aria-label",
                "Ver próximo elemento"
            );
        }
    });

    console.log("✓ Royal Memories — Guest Experience ativo");

    return function destroyGuestExperience() {
        controller.abort();
        tracking = false;
        delete root.dataset.guestExperienceReady;
    };
}
