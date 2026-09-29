/**
 * ============================================================
 * SUZANA & JUAN
 * OFFICIAL GALLERY — OBSERVER
 * ============================================================
 *
 * Responsável por:
 * - revelar elementos durante o scroll
 * - detectar cenas visíveis
 * - detectar capítulo ativo
 * - carregar imagens elegantemente
 * - pré-carregar fotografias próximas
 * - sincronizar o arquivo de capítulos
 *
 * Não controla animações/parallax.
 * Isso pertence ao gallery-motion.js
 * ============================================================
 */


export function createGalleryObserver(gallery) {

    if (!gallery) {
        return null;
    }


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const photos =
        Array.from(
            gallery.querySelectorAll(
                "[data-gallery-photo]"
            )
        );


    const scenes =
        Array.from(
            gallery.querySelectorAll(
                "[data-gallery-scene]"
            )
        );


    const chapters =
        Array.from(
            gallery.querySelectorAll(
                "[data-gallery-chapter]"
            )
        );


    const archiveItems =
        Array.from(
            gallery.querySelectorAll(
                "[data-chapter-target]"
            )
        );


    /* ========================================================
       REVEAL ELEMENTS
       ======================================================== */

    const revealSelectors = [

        ".gallery-cover__top",
        ".gallery-cover__heading",
        ".gallery-cover__bottom",

        ".gallery-chapter-heading__number",
        ".gallery-chapter-heading__content",
        ".gallery-chapter-heading__aside",

        ".gallery-opening-heading",
        ".gallery-opening-copy",

        ".gallery-sea-break__content",

        ".gallery-connection__intro",
        ".gallery-connection__signature",

        ".gallery-silence p",

        ".gallery-sky__header",
        ".gallery-sky__footer",

        ".gallery-chapter-end__eyebrow",
        ".gallery-chapter-end__seal",
        ".gallery-chapter-end h3",
        ".gallery-chapter-end__content > p",
        ".gallery-chapter-end__count",
        ".gallery-chapter-end__next",

        ".gallery-archive__header",
        ".gallery-archive-item",

        ".gallery-guests-transition__eyebrow",
        ".gallery-guests-transition h3",
        ".gallery-guests-transition p",
        ".gallery-guests-transition__button"

    ];


    const revealElements =
        revealSelectors.flatMap(
            selector =>
                Array.from(
                    gallery.querySelectorAll(
                        selector
                    )
                )
        );


    /* ========================================================
       STATE
       ======================================================== */

    let activeChapter =
        null;


    const observers =
        [];


    /* ========================================================
       JS ENABLED
       ======================================================== */

    gallery.classList.add(
        "gallery-js"
    );


    /* ========================================================
       IMAGE HELPERS
       ======================================================== */

    function getImage(
        photo
    ) {

        return photo?.querySelector(
            "img"
        ) ?? null;
    }


    function markLoaded(
        photo
    ) {

        if (!photo) {
            return;
        }


        photo.classList.remove(
            "is-loading"
        );


        photo.classList.add(
            "is-loaded"
        );
    }


    function markError(
        photo
    ) {

        if (!photo) {
            return;
        }


        photo.classList.remove(
            "is-loading"
        );


        photo.classList.add(
            "is-error"
        );
    }


    /* ========================================================
       PREPARE IMAGE
       ======================================================== */

    function preparePhoto(
        photo
    ) {

        if (
            !photo ||
            photo.dataset.galleryPrepared ===
                "true"
        ) {
            return;
        }


        const image =
            getImage(
                photo
            );


        if (!image) {
            return;
        }


        photo.dataset.galleryPrepared =
            "true";


        photo.classList.add(
            "is-loading"
        );


        /*
         * Se a imagem já veio do cache,
         * não esperamos outro evento load.
         */

        if (
            image.complete &&
            image.naturalWidth > 0
        ) {

            markLoaded(
                photo
            );

            return;
        }


        image.addEventListener(
            "load",
            () => {

                markLoaded(
                    photo
                );

            },
            {
                once: true
            }
        );


        image.addEventListener(
            "error",
            () => {

                markError(
                    photo
                );

            },
            {
                once: true
            }
        );


        /*
         * decode() evita mostrar a imagem
         * parcialmente decodificada.
         */

        if (
            typeof image.decode ===
            "function"
        ) {

            image
                .decode()
                .then(
                    () => {

                        if (
                            image.complete &&
                            image.naturalWidth > 0
                        ) {

                            markLoaded(
                                photo
                            );

                        }

                    }
                )
                .catch(
                    () => {

                        /*
                         * Não fazemos nada aqui.
                         *
                         * Alguns browsers rejeitam decode()
                         * mesmo quando load funciona normalmente.
                         */

                    }
                );
        }
    }


    /* ========================================================
       PRELOAD
       ======================================================== */

    function preloadPhoto(
        index
    ) {

        const photo =
            photos[index];


        if (!photo) {
            return;
        }


        const image =
            getImage(
                photo
            );


        if (!image) {
            return;
        }


        preparePhoto(
            photo
        );


        /*
         * O browser já conhece o src pelo HTML.
         * Criamos apenas uma imagem auxiliar
         * para estimular o preload quando necessário.
         */

        if (
            image.dataset.galleryPreloaded ===
            "true"
        ) {
            return;
        }


        image.dataset.galleryPreloaded =
            "true";


        const preloadImage =
            new Image();


        preloadImage.decoding =
            "async";


        preloadImage.src =
            image.currentSrc ||
            image.src;
    }


    function preloadNeighbours(
        index
    ) {

        preloadPhoto(
            index
        );


        preloadPhoto(
            index + 1
        );


        preloadPhoto(
            index - 1
        );
    }


    /* ========================================================
       INITIAL IMAGES
       ======================================================== */

    /*
     * Temos apenas 3 fotos.
     *
     * A primeira é prioritária.
     * A segunda é preparada logo depois.
     * A terceira fica lazy até se aproximar.
     */

    if (photos[0]) {

        const image =
            getImage(
                photos[0]
            );


        if (image) {

            image.loading =
                "eager";


            image.fetchPriority =
                "high";

        }


        preparePhoto(
            photos[0]
        );
    }


    if (photos[1]) {

        const image =
            getImage(
                photos[1]
            );


        if (image) {

            image.loading =
                "lazy";

        }


        preparePhoto(
            photos[1]
        );
    }


    /* ========================================================
       PHOTO OBSERVER
       ======================================================== */

    if (
        "IntersectionObserver"
        in window
    ) {

        const photoObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const photo =
                                entry.target;


                            const index =
                                photos.indexOf(
                                    photo
                                );


                            preparePhoto(
                                photo
                            );


                            preloadNeighbours(
                                index
                            );


                            photo.classList.add(
                                "is-near"
                            );


                            photoObserver.unobserve(
                                photo
                            );

                        }
                    );

                },

                {
                    root: null,

                    rootMargin:
                        "600px 0px",

                    threshold: 0
                }

            );


        photos.forEach(
            photo => {

                photoObserver.observe(
                    photo
                );

            }
        );


        observers.push(
            photoObserver
        );
    }
    else {

        photos.forEach(
            preparePhoto
        );

    }


    /* ========================================================
       REVEAL
       ======================================================== */

    revealElements.forEach(
        (
            element,
            index
        ) => {

            element.classList.add(
                "gallery-reveal"
            );


            /*
             * Pequena variação de delay.
             *
             * Nunca deixamos acumular delays enormes
             * conforme o usuário desce a página.
             */

            const delay =
                (
                    index %
                    3
                ) *
                70;


            element.style.setProperty(
                "--gallery-reveal-delay",
                `${delay}ms`
            );

        }
    );


    if (
        "IntersectionObserver"
        in window
    ) {

        const revealObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target
                                .classList
                                .add(
                                    "is-visible"
                                );


                            revealObserver
                                .unobserve(
                                    entry.target
                                );

                        }
                    );

                },

                {
                    root: null,

                    rootMargin:
                        "0px 0px -8% 0px",

                    threshold: 0.08
                }

            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );


        observers.push(
            revealObserver
        );
    }
    else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }


    /* ========================================================
       SCENE OBSERVER
       ======================================================== */

    if (
        "IntersectionObserver"
        in window
    ) {

        const sceneObserver =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            entry.target
                                .classList
                                .toggle(
                                    "is-active",
                                    entry.isIntersecting
                                );

                        }
                    );

                },

                {
                    root: null,

                    rootMargin:
                        "-20% 0px -20% 0px",

                    threshold: 0.01
                }

            );


        scenes.forEach(
            scene => {

                sceneObserver.observe(
                    scene
                );

            }
        );


        observers.push(
            sceneObserver
        );
    }


    /* ========================================================
       ARCHIVE SYNC
       ======================================================== */

    function updateArchive(
        chapter
    ) {

        if (!chapter) {
            return;
        }


        const chapterId =
            chapter.id;


        archiveItems.forEach(
            item => {

                const target =
                    item.dataset
                        .chapterTarget;


                item.classList.toggle(
                    "is-current",
                    target === chapterId
                );

            }
        );
    }


    /* ========================================================
       ACTIVE CHAPTER
       ======================================================== */

    function setActiveChapter(
        chapter
    ) {

        if (
            !chapter ||
            activeChapter === chapter
        ) {
            return;
        }


        if (activeChapter) {

            activeChapter
                .classList
                .remove(
                    "is-current-chapter"
                );

        }


        activeChapter =
            chapter;


        activeChapter
            .classList
            .add(
                "is-current-chapter"
            );


        updateArchive(
            activeChapter
        );


        gallery.dispatchEvent(
            new CustomEvent(
                "gallery:chapterchange",
                {
                    detail: {
                        chapter:
                            activeChapter
                                .dataset
                                .galleryChapter
                                ?? null,

                        element:
                            activeChapter
                    }
                }
            )
        );
    }


    /* ========================================================
       CHAPTER OBSERVER
       ======================================================== */

    if (
        chapters.length &&
        "IntersectionObserver"
        in window
    ) {

        const chapterObserver =
            new IntersectionObserver(

                entries => {

                    const visible =
                        entries
                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (
                                    a,
                                    b
                                ) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );


                    if (
                        !visible.length
                    ) {
                        return;
                    }


                    setActiveChapter(
                        visible[0]
                            .target
                    );

                },

                {
                    root: null,

                    rootMargin:
                        "-25% 0px -25% 0px",

                    threshold: [
                        0.05,
                        0.15,
                        0.3,
                        0.5
                    ]
                }

            );


        chapters.forEach(
            chapter => {

                chapterObserver.observe(
                    chapter
                );

            }
        );


        observers.push(
            chapterObserver
        );

    }
    else if (
        chapters[0]
    ) {

        setActiveChapter(
            chapters[0]
        );

    }


    /* ========================================================
       REFRESH
       ======================================================== */

    function refresh() {

        photos.forEach(
            photo => {

                const image =
                    getImage(
                        photo
                    );


                if (
                    image?.complete &&
                    image.naturalWidth > 0
                ) {

                    markLoaded(
                        photo
                    );

                }

            }
        );


        revealElements.forEach(
            element => {

                const rect =
                    element
                        .getBoundingClientRect();


                if (
                    rect.top <
                    window.innerHeight *
                    0.92
                ) {

                    element
                        .classList
                        .add(
                            "is-visible"
                        );

                }

            }
        );

    }


    /* ========================================================
       INITIAL REFRESH
       ======================================================== */

    requestAnimationFrame(
        refresh
    );


    /* ========================================================
       PUBLIC API
       ======================================================== */

    return {

        refresh,


        getActiveChapter() {

            return activeChapter;

        },


        preloadPhoto,


        preloadNeighbours,


        destroy() {

            observers.forEach(
                observer => {

                    observer.disconnect();

                }
            );


            gallery.classList.remove(
                "gallery-js"
            );


            revealElements.forEach(
                element => {

                    element.classList.remove(
                        "gallery-reveal",
                        "is-visible"
                    );


                    element.style
                        .removeProperty(
                            "--gallery-reveal-delay"
                        );

                }
            );


            photos.forEach(
                photo => {

                    photo.classList.remove(
                        "is-near"
                    );

                }
            );

        }

    };
}