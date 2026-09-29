/**
 * ============================================================
 * SUZANA & JUAN
 * OFFICIAL GALLERY — LIGHTBOX
 * ============================================================
 *
 * Compatível com o official-gallery.html atual.
 *
 * Recursos:
 * - abre qualquer [data-gallery-photo]
 * - contador automático
 * - anterior / seguinte
 * - loop infinito
 * - barra de progresso
 * - preload das imagens vizinhas
 * - teclado
 * - ESC
 * - swipe mobile
 * - clique no fundo para fechar
 * - focus trap
 * - restauração de foco
 * - bloqueio de scroll
 * - loading/error state
 * - destroy completo
 * ============================================================
 */


export function createGalleryLightbox(gallery) {

    if (!gallery) {
        return null;
    }


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const lightbox =
        gallery.querySelector(
            ".gallery-lightbox"
        );


    if (!lightbox) {

        console.warn(
            "Gallery Lightbox: .gallery-lightbox não encontrado."
        );

        return null;
    }


    const stage =
        lightbox.querySelector(
            ".gallery-lightbox__stage"
        );


    const imageWrapper =
        lightbox.querySelector(
            ".gallery-lightbox__image-wrapper"
        );


    const image =
        lightbox.querySelector(
            ".gallery-lightbox__image"
        );


    const closeButton =
        lightbox.querySelector(
            ".gallery-lightbox__close"
        );


    const previousButton =
        lightbox.querySelector(
            ".gallery-lightbox__nav--prev"
        );


    const nextButton =
        lightbox.querySelector(
            ".gallery-lightbox__nav--next"
        );


    const currentCounter =
        lightbox.querySelector(
            ".gallery-lightbox__current"
        );


    const totalCounter =
        lightbox.querySelector(
            ".gallery-lightbox__total"
        );


    const progressBar =
        lightbox.querySelector(
            ".gallery-lightbox__progress-bar"
        );


    /* ========================================================
       GALLERY PHOTOS
       ======================================================== */

    const photoButtons =
        Array.from(
            gallery.querySelectorAll(
                "[data-gallery-photo]"
            )
        )
        .sort(
            (a, b) => {

                const indexA =
                    Number(
                        a.dataset.galleryPhoto
                    );


                const indexB =
                    Number(
                        b.dataset.galleryPhoto
                    );


                return indexA - indexB;
            }
        );


    const photos =
        photoButtons
            .map(
                button => {

                    const sourceImage =
                        button.querySelector(
                            "img"
                        );


                    if (!sourceImage) {
                        return null;
                    }


                    return {

                        button,

                        sourceImage,

                        src:
                            sourceImage.currentSrc ||
                            sourceImage.src,

                        alt:
                            sourceImage.alt ||
                            ""

                    };

                }
            )
            .filter(Boolean);


    if (
        !image ||
        photos.length === 0
    ) {

        console.warn(
            "Gallery Lightbox: nenhuma fotografia encontrada."
        );

        return null;
    }


    /* ========================================================
       STATE
       ======================================================== */

    let currentIndex = 0;

    let opened = false;

    let destroyed = false;

    let previousFocusedElement = null;

    let closeTimer = null;

    let imageRequestId = 0;


    /* ========================================================
       SWIPE STATE
       ======================================================== */

    let touchStartX = 0;

    let touchStartY = 0;

    let touchCurrentX = 0;

    let touchCurrentY = 0;

    let touching = false;


    const SWIPE_THRESHOLD = 55;


    /* ========================================================
       UTILS
       ======================================================== */

    function formatNumber(number) {

        return String(number)
            .padStart(
                2,
                "0"
            );
    }


    function normalizeIndex(index) {

        if (
            photos.length === 0
        ) {
            return 0;
        }


        return (
            (
                index %
                photos.length
            ) +
            photos.length
        ) %
        photos.length;
    }


    function getPhoto(index) {

        return photos[
            normalizeIndex(index)
        ];
    }


    /* ========================================================
       COUNTER
       ======================================================== */

    function updateCounter() {

        if (currentCounter) {

            currentCounter.textContent =
                formatNumber(
                    currentIndex + 1
                );
        }


        if (totalCounter) {

            totalCounter.textContent =
                formatNumber(
                    photos.length
                );
        }
    }


    /* ========================================================
       PROGRESS
       ======================================================== */

    function updateProgress() {

        if (!progressBar) {
            return;
        }


        const percentage =
            (
                (
                    currentIndex + 1
                ) /
                photos.length
            ) *
            100;


        progressBar.style.width =
            `${percentage}%`;
    }


    /* ========================================================
       PRELOAD
       ======================================================== */

    function preload(index) {

        if (
            photos.length <= 1
        ) {
            return;
        }


        const photo =
            getPhoto(index);


        if (!photo?.src) {
            return;
        }


        const preloadImage =
            new Image();


        preloadImage.decoding =
            "async";


        preloadImage.src =
            photo.src;
    }


    function preloadNeighbours() {

        preload(
            currentIndex - 1
        );


        preload(
            currentIndex + 1
        );
    }


    /* ========================================================
       LOADING STATE
       ======================================================== */

    function setLoading(value) {

        lightbox.classList.toggle(
            "is-loading",
            value
        );


        imageWrapper
            ?.classList
            .toggle(
                "is-loading",
                value
            );
    }


    function setError(value) {

        lightbox.classList.toggle(
            "has-error",
            value
        );


        imageWrapper
            ?.classList
            .toggle(
                "has-error",
                value
            );
    }


    /* ========================================================
       SHOW PHOTO
       ======================================================== */

    function showPhoto(
        index,
        {
            animate = true
        } = {}
    ) {

        if (
            destroyed ||
            photos.length === 0
        ) {
            return;
        }


        currentIndex =
            normalizeIndex(index);


        const photo =
            photos[currentIndex];


        if (!photo) {
            return;
        }


        const requestId =
            ++imageRequestId;


        updateCounter();

        updateProgress();

        setError(false);

        setLoading(true);


        if (
            animate &&
            imageWrapper
        ) {

            imageWrapper.classList.add(
                "is-changing"
            );
        }


        const loader =
            new Image();


        loader.decoding =
            "async";


        loader.src =
            photo.src;


        const applyImage =
            () => {

                if (
                    destroyed ||
                    requestId !== imageRequestId
                ) {
                    return;
                }


                image.src =
                    photo.src;


                image.alt =
                    photo.alt;


                setLoading(false);

                setError(false);


                requestAnimationFrame(
                    () => {

                        if (
                            requestId !==
                            imageRequestId
                        ) {
                            return;
                        }


                        imageWrapper
                            ?.classList
                            .remove(
                                "is-changing"
                            );

                    }
                );


                preloadNeighbours();
            };


        if (
            loader.complete &&
            loader.naturalWidth > 0
        ) {

            applyImage();

            return;
        }


        loader.addEventListener(
            "load",
            applyImage,
            {
                once: true
            }
        );


        loader.addEventListener(
            "error",
            () => {

                if (
                    destroyed ||
                    requestId !== imageRequestId
                ) {
                    return;
                }


                setLoading(false);

                setError(true);


                imageWrapper
                    ?.classList
                    .remove(
                        "is-changing"
                    );


                console.error(
                    "Gallery Lightbox: erro ao carregar",
                    photo.src
                );

            },
            {
                once: true
            }
        );
    }


    /* ========================================================
       BODY SCROLL
       ======================================================== */

    function lockScroll() {

        document.documentElement
            .classList
            .add(
                "gallery-lightbox-open"
            );


        document.body
            .classList
            .add(
                "gallery-lightbox-open"
            );
    }


    function unlockScroll() {

        document.documentElement
            .classList
            .remove(
                "gallery-lightbox-open"
            );


        document.body
            .classList
            .remove(
                "gallery-lightbox-open"
            );
    }


    /* ========================================================
       OPEN
       ======================================================== */

    function open(index = 0) {

        if (
            destroyed ||
            photos.length === 0
        ) {
            return;
        }


        if (closeTimer) {

            clearTimeout(
                closeTimer
            );


            closeTimer = null;
        }


        previousFocusedElement =
            document.activeElement;


        opened = true;


        lightbox.hidden =
            false;


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        lightbox.classList.add(
            "is-open"
        );


        lockScroll();


        showPhoto(
            index,
            {
                animate: false
            }
        );


        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        if (!opened) {
                            return;
                        }


                        lightbox.classList.add(
                            "is-visible"
                        );


                        closeButton
                            ?.focus({
                                preventScroll: true
                            });

                    }
                );

            }
        );
    }


    /* ========================================================
       CLOSE
       ======================================================== */

    function close() {

        if (
            destroyed ||
            !opened
        ) {
            return;
        }


        opened = false;


        imageRequestId++;


        lightbox.classList.remove(
            "is-visible"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        unlockScroll();


        closeTimer =
            window.setTimeout(
                () => {

                    closeTimer = null;


                    if (opened) {
                        return;
                    }


                    lightbox.classList.remove(
                        "is-open",
                        "is-loading",
                        "has-error"
                    );


                    imageWrapper
                        ?.classList
                        .remove(
                            "is-loading",
                            "is-changing",
                            "has-error"
                        );


                    lightbox.hidden =
                        true;

                },
                400
            );


        const focusTarget =
            previousFocusedElement;


        previousFocusedElement =
            null;


        window.setTimeout(
            () => {

                if (
                    focusTarget &&
                    typeof focusTarget.focus ===
                        "function"
                ) {

                    focusTarget.focus({
                        preventScroll: true
                    });

                }

            },
            30
        );
    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    function next() {

        if (
            destroyed ||
            photos.length <= 1
        ) {
            return;
        }


        showPhoto(
            currentIndex + 1
        );
    }


    function previous() {

        if (
            destroyed ||
            photos.length <= 1
        ) {
            return;
        }


        showPhoto(
            currentIndex - 1
        );
    }


    /* ========================================================
       PHOTO CLICK
       ======================================================== */

    function handlePhotoClick(event) {

        const button =
            event.currentTarget;


        const index =
            photos.findIndex(
                photo =>
                    photo.button ===
                    button
            );


        if (
            index === -1
        ) {
            return;
        }


        open(index);
    }


    /* ========================================================
       BUTTON EVENTS
       ======================================================== */

    function handleCloseClick(event) {

        event.preventDefault();

        event.stopPropagation();

        close();
    }


    function handlePreviousClick(event) {

        event.preventDefault();

        event.stopPropagation();

        previous();
    }


    function handleNextClick(event) {

        event.preventDefault();

        event.stopPropagation();

        next();
    }


    /* ========================================================
       BACKDROP CLICK
       ======================================================== */

    function handleBackdropClick(event) {

        if (!opened) {
            return;
        }


        /*
         * Fechamos quando o clique acontece:
         *
         * - no fundo principal
         * - no stage fora da imagem
         *
         * Nunca fechamos ao clicar na própria imagem.
         */

        const clickedImage =
            event.target.closest(
                ".gallery-lightbox__image-wrapper"
            );


        const clickedControl =
            event.target.closest(
                "button"
            );


        if (
            clickedImage ||
            clickedControl
        ) {
            return;
        }


        if (
            event.target === lightbox ||
            event.target === stage
        ) {

            close();
        }
    }


    /* ========================================================
       FOCUS TRAP
       ======================================================== */

    function getFocusableElements() {

        return Array.from(
            lightbox.querySelectorAll(
                [
                    "button:not([disabled])",
                    "a[href]",
                    "[tabindex]:not([tabindex='-1'])"
                ].join(",")
            )
        )
        .filter(
            element => {

                return (
                    !element.hidden &&
                    element.getAttribute(
                        "aria-hidden"
                    ) !==
                        "true" &&
                    element.offsetParent !==
                        null
                );

            }
        );
    }


    function handleFocusTrap(event) {

        if (
            event.key !== "Tab" ||
            !opened
        ) {
            return;
        }


        const focusable =
            getFocusableElements();


        if (
            focusable.length === 0
        ) {

            event.preventDefault();

            return;
        }


        const first =
            focusable[0];


        const last =
            focusable[
                focusable.length - 1
            ];


        if (
            event.shiftKey &&
            document.activeElement === first
        ) {

            event.preventDefault();

            last.focus();

            return;
        }


        if (
            !event.shiftKey &&
            document.activeElement === last
        ) {

            event.preventDefault();

            first.focus();
        }
    }


    /* ========================================================
       KEYBOARD
       ======================================================== */

    function handleKeyDown(event) {

        if (!opened) {
            return;
        }


        switch (event.key) {

            case "Escape":

                event.preventDefault();

                close();

                break;


            case "ArrowRight":

                event.preventDefault();

                next();

                break;


            case "ArrowLeft":

                event.preventDefault();

                previous();

                break;


            case "Tab":

                handleFocusTrap(
                    event
                );

                break;
        }
    }


    /* ========================================================
       TOUCH / SWIPE
       ======================================================== */

    function handleTouchStart(event) {

        if (
            !opened ||
            event.touches.length !== 1
        ) {
            return;
        }


        const touch =
            event.touches[0];


        touchStartX =
            touch.clientX;


        touchStartY =
            touch.clientY;


        touchCurrentX =
            touchStartX;


        touchCurrentY =
            touchStartY;


        touching = true;
    }


    function handleTouchMove(event) {

        if (
            !touching ||
            event.touches.length !== 1
        ) {
            return;
        }


        const touch =
            event.touches[0];


        touchCurrentX =
            touch.clientX;


        touchCurrentY =
            touch.clientY;
    }


    function handleTouchEnd() {

        if (!touching) {
            return;
        }


        touching = false;


        const deltaX =
            touchCurrentX -
            touchStartX;


        const deltaY =
            touchCurrentY -
            touchStartY;


        const horizontal =
            Math.abs(
                deltaX
            );


        const vertical =
            Math.abs(
                deltaY
            );


        /*
         * Ignora movimentos pequenos ou predominantemente
         * verticais.
         */

        if (
            horizontal <
            SWIPE_THRESHOLD
        ) {
            return;
        }


        if (
            horizontal <= vertical
        ) {
            return;
        }


        if (
            deltaX < 0
        ) {

            next();

        }
        else {

            previous();

        }
    }


    function handleTouchCancel() {

        touching = false;
    }


    /* ========================================================
       ACCESSIBILITY / INITIAL DOM STATE
       ======================================================== */

    lightbox.setAttribute(
        "role",
        "dialog"
    );


    lightbox.setAttribute(
        "aria-modal",
        "true"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Seu HTML não possui hidden originalmente.
     * Colocamos via JS para impedir que o visor fique
     * acessível quando fechado.
     */

    lightbox.hidden =
        true;


    updateCounter();

    updateProgress();


    /* ========================================================
       SINGLE PHOTO
       ======================================================== */

    if (
        photos.length <= 1
    ) {

        if (previousButton) {

            previousButton.hidden =
                true;
        }


        if (nextButton) {

            nextButton.hidden =
                true;
        }
    }


    /* ========================================================
       REGISTER EVENTS
       ======================================================== */

    photoButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                handlePhotoClick
            );

        }
    );


    closeButton
        ?.addEventListener(
            "click",
            handleCloseClick
        );


    previousButton
        ?.addEventListener(
            "click",
            handlePreviousClick
        );


    nextButton
        ?.addEventListener(
            "click",
            handleNextClick
        );


    lightbox.addEventListener(
        "click",
        handleBackdropClick
    );


    document.addEventListener(
        "keydown",
        handleKeyDown
    );


    imageWrapper
        ?.addEventListener(
            "touchstart",
            handleTouchStart,
            {
                passive: true
            }
        );


    imageWrapper
        ?.addEventListener(
            "touchmove",
            handleTouchMove,
            {
                passive: true
            }
        );


    imageWrapper
        ?.addEventListener(
            "touchend",
            handleTouchEnd,
            {
                passive: true
            }
        );


    imageWrapper
        ?.addEventListener(
            "touchcancel",
            handleTouchCancel,
            {
                passive: true
            }
        );


    /* ========================================================
       DESTROY
       ======================================================== */

    function destroy() {

        if (destroyed) {
            return;
        }


        destroyed = true;

        opened = false;

        imageRequestId++;


        if (closeTimer) {

            clearTimeout(
                closeTimer
            );


            closeTimer = null;
        }


        /* ----------------------------------------------------
           PHOTO BUTTONS
           ---------------------------------------------------- */

        photoButtons.forEach(
            button => {

                button.removeEventListener(
                    "click",
                    handlePhotoClick
                );

            }
        );


        /* ----------------------------------------------------
           CONTROLS
           ---------------------------------------------------- */

        closeButton
            ?.removeEventListener(
                "click",
                handleCloseClick
            );


        previousButton
            ?.removeEventListener(
                "click",
                handlePreviousClick
            );


        nextButton
            ?.removeEventListener(
                "click",
                handleNextClick
            );


        /* ----------------------------------------------------
           LIGHTBOX
           ---------------------------------------------------- */

        lightbox.removeEventListener(
            "click",
            handleBackdropClick
        );


        /* ----------------------------------------------------
           KEYBOARD
           ---------------------------------------------------- */

        document.removeEventListener(
            "keydown",
            handleKeyDown
        );


        /* ----------------------------------------------------
           TOUCH
           ---------------------------------------------------- */

        imageWrapper
            ?.removeEventListener(
                "touchstart",
                handleTouchStart
            );


        imageWrapper
            ?.removeEventListener(
                "touchmove",
                handleTouchMove
            );


        imageWrapper
            ?.removeEventListener(
                "touchend",
                handleTouchEnd
            );


        imageWrapper
            ?.removeEventListener(
                "touchcancel",
                handleTouchCancel
            );


        /* ----------------------------------------------------
           SCROLL
           ---------------------------------------------------- */

        unlockScroll();


        /* ----------------------------------------------------
           DOM RESET
           ---------------------------------------------------- */

        lightbox.classList.remove(
            "is-open",
            "is-visible",
            "is-loading",
            "has-error"
        );


        imageWrapper
            ?.classList
            .remove(
                "is-loading",
                "is-changing",
                "has-error"
            );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        lightbox.hidden =
            true;


        image.removeAttribute(
            "src"
        );


        image.alt =
            "";


        progressBar
            ?.style
            .removeProperty(
                "width"
            );


        console.log(
            "✓ Gallery Lightbox destruído"
        );
    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    return {

        open,

        close,

        next,

        previous,

        destroy,


        getCurrentIndex() {

            return currentIndex;
        },


        getTotal() {

            return photos.length;
        },


        isOpen() {

            return opened;
        }

    };
}