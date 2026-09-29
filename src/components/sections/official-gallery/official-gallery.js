/**
 * ============================================================
 * SUZANA & JUAN
 * OFFICIAL GALLERY — CONTROLLER
 * ============================================================
 *
 * Responsabilidade deste arquivo:
 *
 * - inicializar a galeria
 * - conectar Lightbox
 * - conectar Motion
 * - conectar Observer
 * - controlar navegação interna
 * - controlar spotlight do mouse
 * - permitir expansão futura por capítulos
 *
 * NÃO controla:
 *
 * - animações de scroll       → gallery-motion.js
 * - loading/reveal            → gallery-observer.js
 * - visualização fullscreen   → gallery-lightbox.js
 *
 * ============================================================
 */


import {
    createGalleryLightbox
}
from "./lightbox/gallery-lightbox.js";


import {
    createGalleryMotion
}
from "./core/gallery-motion.js";


import {
    createGalleryObserver
}
from "./core/gallery-observer.js";


/* ============================================================
   INITIALIZE
   ============================================================ */

export function initOfficialGallery() {

    const gallery =
        document.getElementById(
            "official-gallery"
        );


    if (!gallery) {

        console.warn(
            "Official Gallery: elemento não encontrado."
        );

        return null;
    }


    /*
     * Evita inicialização duplicada caso main.js
     * seja executado novamente.
     */

    if (
        gallery.dataset.galleryInitialized ===
        "true"
    ) {

        return null;
    }


    gallery.dataset.galleryInitialized =
        "true";


    /* ========================================================
       MODULES
       ======================================================== */

    let lightbox =
        null;


    let motion =
        null;


    let observer =
        null;


    try {

        lightbox =
            createGalleryLightbox(
                gallery
            );

    }
    catch (error) {

        console.error(
            "Official Gallery: erro no lightbox.",
            error
        );

    }


    try {

        observer =
            createGalleryObserver(
                gallery
            );

    }
    catch (error) {

        console.error(
            "Official Gallery: erro no observer.",
            error
        );

    }


    try {

        motion =
            createGalleryMotion(
                gallery
            );

    }
    catch (error) {

        console.error(
            "Official Gallery: erro no motion.",
            error
        );

    }


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const exploreButton =
        gallery.querySelector(
            "[data-gallery-scroll]"
        );


    const chapterEndButtons =
        Array.from(
            gallery.querySelectorAll(
                "[data-next-chapter]"
            )
        );


    const archiveButtons =
        Array.from(
            gallery.querySelectorAll(
                "[data-chapter-target]"
            )
        );


    const photos =
        Array.from(
            gallery.querySelectorAll(
                "[data-gallery-photo]"
            )
        );


    /* ========================================================
       SCROLL
       ======================================================== */

    function scrollToElement(
        element,
        options = {}
    ) {

        if (!element) {
            return;
        }


        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        element.scrollIntoView({
            behavior:
                reducedMotion
                    ? "auto"
                    : "smooth",

            block:
                options.block ??
                "start"
        });
    }


    /* ========================================================
       EXPLORE
       ======================================================== */

    function handleExplore() {

        const firstChapter =
            gallery.querySelector(
                "[data-gallery-chapter]"
            );


        scrollToElement(
            firstChapter
        );
    }


    exploreButton?.addEventListener(
        "click",
        handleExplore
    );


    /* ========================================================
       ARCHIVE NAVIGATION
       ======================================================== */

    function handleArchiveClick(
        event
    ) {

        const button =
            event.currentTarget;


        const targetId =
            button.dataset
                .chapterTarget;


        if (!targetId) {
            return;
        }


        const target =
            document.getElementById(
                targetId
            );


        if (!target) {

            console.warn(
                `Official Gallery: capítulo "${targetId}" não encontrado.`
            );

            return;
        }


        scrollToElement(
            target
        );
    }


    archiveButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                handleArchiveClick
            );

        }
    );


    /* ========================================================
       CONTINUE ARCHIVE
       ======================================================== */

    function handleContinueArchive(
        event
    ) {

        const button =
            event.currentTarget;


        const currentChapter =
            button.closest(
                "[data-gallery-chapter]"
            );


        /*
         * Procura o próximo capítulo real.
         *
         * Quando adicionarmos o jardim,
         * o botão começará automaticamente
         * a navegar para ele.
         */

        if (currentChapter) {

            const chapters =
                Array.from(
                    gallery.querySelectorAll(
                        "[data-gallery-chapter]"
                    )
                );


            const currentIndex =
                chapters.indexOf(
                    currentChapter
                );


            const nextChapter =
                chapters[
                    currentIndex + 1
                ];


            if (nextChapter) {

                scrollToElement(
                    nextChapter
                );

                return;
            }
        }


        /*
         * Enquanto existe apenas o capítulo da praia,
         * continuamos para o arquivo.
         */

        const archive =
            gallery.querySelector(
                ".gallery-archive"
            );


        scrollToElement(
            archive
        );
    }


    chapterEndButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                handleContinueArchive
            );

        }
    );


    /* ========================================================
       PHOTO SPOTLIGHT
       ========================================================
       O círculo/gradiente acompanha levemente o mouse.
       Não interfere com o clique do lightbox.
       ======================================================== */

    function handlePhotoPointerMove(
        event
    ) {

        const photo =
            event.currentTarget;


        const rect =
            photo.getBoundingClientRect();


        const x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) *
            100;


        const y =
            (
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            100;


        photo.style.setProperty(
            "--gallery-mouse-x",
            `${x.toFixed(2)}%`
        );


        photo.style.setProperty(
            "--gallery-mouse-y",
            `${y.toFixed(2)}%`
        );
    }


    function handlePhotoPointerLeave(
        event
    ) {

        const photo =
            event.currentTarget;


        photo.style.setProperty(
            "--gallery-mouse-x",
            "50%"
        );


        photo.style.setProperty(
            "--gallery-mouse-y",
            "50%"
        );
    }


    /*
     * Spotlight somente em dispositivos
     * que realmente possuem hover.
     */

    const supportsHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );


    if (
        supportsHover.matches
    ) {

        photos.forEach(
            photo => {

                photo.addEventListener(
                    "pointermove",
                    handlePhotoPointerMove
                );


                photo.addEventListener(
                    "pointerleave",
                    handlePhotoPointerLeave
                );

            }
        );

    }


    /* ========================================================
       CHAPTER CHANGE
       ======================================================== */

    function handleChapterChange(
        event
    ) {

        const chapter =
            event.detail?.chapter;


        if (!chapter) {
            return;
        }


        gallery.dataset.activeChapter =
            chapter;
    }


    gallery.addEventListener(
        "gallery:chapterchange",
        handleChapterChange
    );


    /* ========================================================
       IMAGE REFRESH
       ======================================================== */

    function handleWindowLoad() {

        observer?.refresh?.();

        motion?.refresh?.();
    }


    window.addEventListener(
        "load",
        handleWindowLoad,
        {
            once: true
        }
    );


    /* ========================================================
       RESIZE
       ======================================================== */

    let resizeFrame =
        null;


    function handleResize() {

        if (resizeFrame) {

            cancelAnimationFrame(
                resizeFrame
            );

        }


        resizeFrame =
            requestAnimationFrame(
                () => {

                    resizeFrame =
                        null;


                    observer?.refresh?.();

                    motion?.refresh?.();

                }
            );
    }


    window.addEventListener(
        "resize",
        handleResize,
        {
            passive: true
        }
    );


    /* ========================================================
       DEBUG
       ======================================================== */

    console.log(
        "✓ Official Gallery inicializada",
        {
            photos:
                photos.length,

            chapters:
                gallery.querySelectorAll(
                    "[data-gallery-chapter]"
                ).length,

            lightbox:
                Boolean(
                    lightbox
                ),

            observer:
                Boolean(
                    observer
                ),

            motion:
                Boolean(
                    motion
                )
        }
    );


    /* ========================================================
       PUBLIC API
       ======================================================== */

    const api = {

        gallery,

        lightbox,

        observer,

        motion,


        refresh() {

            observer?.refresh?.();

            motion?.refresh?.();

        },


        destroy() {

            /* -----------------------------------------------
               EXPLORE
               ----------------------------------------------- */

            exploreButton
                ?.removeEventListener(
                    "click",
                    handleExplore
                );


            /* -----------------------------------------------
               ARCHIVE
               ----------------------------------------------- */

            archiveButtons.forEach(
                button => {

                    button.removeEventListener(
                        "click",
                        handleArchiveClick
                    );

                }
            );


            /* -----------------------------------------------
               CONTINUE
               ----------------------------------------------- */

            chapterEndButtons.forEach(
                button => {

                    button.removeEventListener(
                        "click",
                        handleContinueArchive
                    );

                }
            );


            /* -----------------------------------------------
               PHOTOS
               ----------------------------------------------- */

            photos.forEach(
                photo => {

                    photo.removeEventListener(
                        "pointermove",
                        handlePhotoPointerMove
                    );


                    photo.removeEventListener(
                        "pointerleave",
                        handlePhotoPointerLeave
                    );

                }
            );


            /* -----------------------------------------------
               GALLERY EVENTS
               ----------------------------------------------- */

            gallery.removeEventListener(
                "gallery:chapterchange",
                handleChapterChange
            );


            /* -----------------------------------------------
               WINDOW
               ----------------------------------------------- */

            window.removeEventListener(
                "resize",
                handleResize
            );


            window.removeEventListener(
                "load",
                handleWindowLoad
            );


            if (resizeFrame) {

                cancelAnimationFrame(
                    resizeFrame
                );


                resizeFrame =
                    null;
            }


            /* -----------------------------------------------
               MODULES
               ----------------------------------------------- */

            lightbox?.destroy?.();

            observer?.destroy?.();

            motion?.destroy?.();


            /* -----------------------------------------------
               RESET
               ----------------------------------------------- */

            delete gallery.dataset
                .galleryInitialized;


            delete gallery.dataset
                .activeChapter;


            console.log(
                "Official Gallery destruída."
            );
        }

    };


    return api;
}