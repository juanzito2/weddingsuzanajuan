/**
 * ============================================================
 * OFFICIAL GALLERY
 * Suzana & Juan
 * ============================================================
 */

export function initOfficialGallery() {

    const gallery =
        document.querySelector(".official-gallery");

    if (!gallery) {
        console.warn(
            "Official Gallery não encontrada."
        );

        return;
    }


    if (gallery.dataset.initialized === "true") {
        return;
    }


    gallery.dataset.initialized = "true";


    initReveal(gallery);
    initLightbox(gallery);


    console.log(
        "✓ Official Gallery inicializada"
    );
}


/**
 * ============================================================
 * REVEAL
 * ============================================================
 */

function initReveal(gallery) {

    const elements =
        gallery.querySelectorAll(".og-reveal");


    if (!elements.length) {
        return;
    }


    const reduceMotion =
        window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        reduceMotion ||
        !("IntersectionObserver" in window)
    ) {

        elements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "is-visible"
                    );


                    observer.unobserve(
                        entry.target
                    );
                });

            },
            {
                threshold: 0.1,
                rootMargin:
                    "0px 0px -8% 0px"
            }
        );


    elements.forEach((element) => {
        observer.observe(element);
    });
}


/**
 * ============================================================
 * LIGHTBOX
 * ============================================================
 */

function initLightbox(gallery) {

    const photos =
        Array.from(
            gallery.querySelectorAll(
                ".og-photo[data-gallery-index]"
            )
        );


    const lightbox =
        gallery.querySelector(".og-lightbox");


    const image =
        gallery.querySelector(
            ".og-lightbox__image"
        );


    const current =
        gallery.querySelector(
            ".og-lightbox__current"
        );


    const close =
        gallery.querySelector(
            ".og-lightbox__close"
        );


    const previous =
        gallery.querySelector(
            ".og-lightbox__nav--prev"
        );


    const next =
        gallery.querySelector(
            ".og-lightbox__nav--next"
        );


    if (
        !photos.length ||
        !lightbox ||
        !image ||
        !current ||
        !close ||
        !previous ||
        !next
    ) {

        console.warn(
            "Lightbox da Official Gallery incompleto."
        );

        return;
    }


    let currentIndex = 0;

    let previousFocus = null;

    let touchStartX = 0;


    /**
     * --------------------------------------------------------
     * FORMATA 1 → 01
     * --------------------------------------------------------
     */

    const formatNumber =
        (number) =>
            String(number).padStart(2, "0");


    /**
     * --------------------------------------------------------
     * MOSTRAR FOTO
     * --------------------------------------------------------
     */

    function show(index) {

        if (index < 0) {
            index = photos.length - 1;
        }


        if (index >= photos.length) {
            index = 0;
        }


        currentIndex = index;


        const source =
            photos[currentIndex]
                .querySelector("img");


        if (!source) {
            return;
        }


        image.classList.add(
            "is-changing"
        );


        window.setTimeout(() => {

            image.src =
                source.currentSrc ||
                source.src;


            image.alt =
                source.alt ||
                "Fotografia da nossa história";


            current.textContent =
                formatNumber(
                    currentIndex + 1
                );


            requestAnimationFrame(() => {

                image.classList.remove(
                    "is-changing"
                );

            });

        }, 110);
    }


    /**
     * --------------------------------------------------------
     * ABRIR
     * --------------------------------------------------------
     */

    function open(index) {

        previousFocus =
            document.activeElement;


        show(index);


        lightbox.classList.add(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "og-lightbox-open"
        );


        requestAnimationFrame(() => {
            close.focus();
        });
    }


    /**
     * --------------------------------------------------------
     * FECHAR
     * --------------------------------------------------------
     */

    function closeLightbox() {

        lightbox.classList.remove(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "og-lightbox-open"
        );


        if (
            previousFocus &&
            typeof previousFocus.focus ===
                "function"
        ) {
            previousFocus.focus();
        }
    }


    /**
     * --------------------------------------------------------
     * NAVEGAÇÃO
     * --------------------------------------------------------
     */

    function showPrevious() {
        show(currentIndex - 1);
    }


    function showNext() {
        show(currentIndex + 1);
    }


    /**
     * --------------------------------------------------------
     * FOTOS
     * --------------------------------------------------------
     */

    photos.forEach(
        (photo, index) => {

            photo.addEventListener(
                "click",
                () => open(index)
            );

        }
    );


    /**
     * --------------------------------------------------------
     * CONTROLES
     * --------------------------------------------------------
     */

    close.addEventListener(
        "click",
        closeLightbox
    );


    previous.addEventListener(
        "click",
        showPrevious
    );


    next.addEventListener(
        "click",
        showNext
    );


    /**
     * --------------------------------------------------------
     * FUNDO
     * --------------------------------------------------------
     */

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target === lightbox
            ) {
                closeLightbox();
            }

        }
    );


    /**
     * --------------------------------------------------------
     * TECLADO
     * --------------------------------------------------------
     */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }


            if (event.key === "Escape") {

                closeLightbox();

                return;
            }


            if (event.key === "ArrowLeft") {

                event.preventDefault();

                showPrevious();

                return;
            }


            if (event.key === "ArrowRight") {

                event.preventDefault();

                showNext();
            }

        }
    );


    /**
     * --------------------------------------------------------
     * SWIPE MOBILE
     * --------------------------------------------------------
     */

    lightbox.addEventListener(
        "touchstart",
        (event) => {

            if (
                !event.changedTouches.length
            ) {
                return;
            }


            touchStartX =
                event.changedTouches[0]
                    .clientX;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            if (
                !event.changedTouches.length
            ) {
                return;
            }


            const touchEndX =
                event.changedTouches[0]
                    .clientX;


            const difference =
                touchStartX -
                touchEndX;


            if (
                Math.abs(difference) < 55
            ) {
                return;
            }


            if (difference > 0) {

                showNext();

            } else {

                showPrevious();

            }

        },
        {
            passive: true
        }
    );
}