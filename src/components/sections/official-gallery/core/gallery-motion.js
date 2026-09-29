/**
 * ============================================================
 * SUZANA & JUAN
 * OFFICIAL GALLERY — MOTION
 * Chapter 01: Junto al mar
 * ============================================================
 *
 * 01 → horizontal / entrada
 * 02 → horizontal / conexão
 * 03 → vertical / céu / encerramento
 *
 * Princípios:
 * - movimento sutil
 * - sem scroll-jacking
 * - requestAnimationFrame
 * - mobile simplificado
 * - respeita prefers-reduced-motion
 * ============================================================
 */


export function createGalleryMotion(gallery) {

    if (!gallery) {
        return null;
    }


    /* ========================================================
       MEDIA
       ======================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    const mobile =
        window.matchMedia(
            "(max-width: 640px)"
        );


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const cover =
        gallery.querySelector(
            ".gallery-cover"
        );


    const coverTitle =
        gallery.querySelector(
            ".gallery-cover__title"
        );


    const coverGhost =
        gallery.querySelector(
            ".gallery-cover__ghost"
        );


    /* --------------------------------------------------------
       PHOTO 01
       -------------------------------------------------------- */

    const opening =
        gallery.querySelector(
            ".gallery-scene--opening"
        );


    const openingPhoto =
        gallery.querySelector(
            ".gallery-photo--opening"
        );


    const openingNumber =
        gallery.querySelector(
            ".gallery-scene__background-number"
        );


    const openingCopy =
        gallery.querySelector(
            ".gallery-opening-copy"
        );


    /* --------------------------------------------------------
       SEA BREAK
       -------------------------------------------------------- */

    const seaBreak =
        gallery.querySelector(
            ".gallery-sea-break"
        );


    const seaWord =
        gallery.querySelector(
            ".gallery-sea-break__word"
        );


    /* --------------------------------------------------------
       PHOTO 02
       -------------------------------------------------------- */

    const connection =
        gallery.querySelector(
            ".gallery-scene--connection"
        );


    const connectionPhoto =
        gallery.querySelector(
            ".gallery-photo--connection"
        );


    const connectionIntro =
        gallery.querySelector(
            ".gallery-connection__intro"
        );


    const connectionSignature =
        gallery.querySelector(
            ".gallery-connection__signature"
        );


    /* --------------------------------------------------------
       PHOTO 03
       -------------------------------------------------------- */

    const sky =
        gallery.querySelector(
            ".gallery-scene--sky"
        );


    const skyPhoto =
        gallery.querySelector(
            ".gallery-photo--sky"
        );


    const skyCopy =
        gallery.querySelector(
            ".gallery-sky__copy"
        );


    const skyHeader =
        gallery.querySelector(
            ".gallery-sky__header"
        );


    /* --------------------------------------------------------
       CHAPTER END
       -------------------------------------------------------- */

    const chapterEnd =
        gallery.querySelector(
            ".gallery-chapter-end"
        );


    const chapterSeal =
        gallery.querySelector(
            ".gallery-chapter-end__seal"
        );


    const chapterBackground =
        gallery.querySelector(
            ".gallery-chapter-end__background"
        );


    /* ========================================================
       STATE
       ======================================================== */

    let ticking =
        false;


    let viewportHeight =
        window.innerHeight;


    /* ========================================================
       UTILS
       ======================================================== */

    function clamp(
        value,
        min = 0,
        max = 1
    ) {

        return Math.min(
            Math.max(
                value,
                min
            ),
            max
        );
    }


    function lerp(
        start,
        end,
        progress
    ) {

        return (
            start +
            (
                end -
                start
            ) *
            progress
        );
    }


    function progress(
        element
    ) {

        if (!element) {
            return 0;
        }


        const rect =
            element.getBoundingClientRect();


        const distance =
            viewportHeight +
            rect.height;


        return clamp(
            (
                viewportHeight -
                rect.top
            ) /
            Math.max(
                distance,
                1
            )
        );
    }


    function centered(
        element
    ) {

        if (!element) {
            return 0;
        }


        const rect =
            element.getBoundingClientRect();


        const elementCenter =
            rect.top +
            rect.height / 2;


        const screenCenter =
            viewportHeight / 2;


        return clamp(
            (
                elementCenter -
                screenCenter
            ) /
            viewportHeight,
            -1,
            1
        );
    }


    function nearby(
        element,
        margin = 400
    ) {

        if (!element) {
            return false;
        }


        const rect =
            element.getBoundingClientRect();


        return (
            rect.bottom >
                -margin &&

            rect.top <
                viewportHeight +
                margin
        );
    }


    function variable(
        element,
        name,
        value
    ) {

        if (!element) {
            return;
        }


        element.style.setProperty(
            name,
            value
        );
    }


    /* ========================================================
       COVER
       ======================================================== */

    function animateCover() {

        if (
            !cover ||
            !nearby(cover)
        ) {
            return;
        }


        const value =
            progress(
                cover
            );


        if (coverTitle) {

            const y =
                lerp(
                    18,
                    -16,
                    value
                );


            variable(
                coverTitle,
                "--cover-motion-y",
                `${y.toFixed(2)}px`
            );
        }


        if (coverGhost) {

            const y =
                lerp(
                    -18,
                    32,
                    value
                );


            variable(
                coverGhost,
                "--cover-ghost-y",
                `${y.toFixed(2)}px`
            );
        }
    }


    /* ========================================================
       PHOTO 01
       HORIZONTAL / OPENING
       ======================================================== */

    function animateOpening() {

        if (
            !opening ||
            !nearby(
                opening,
                500
            )
        ) {
            return;
        }


        const value =
            progress(
                opening
            );


        const center =
            centered(
                opening
            );


        if (openingPhoto) {

            /*
             * Quase imperceptível.
             *
             * A fotografia continua parecendo
             * fotografia e não um banner animado.
             */

            const scale =
                lerp(
                    0.992,
                    1.012,
                    value
                );


            const y =
                center *
                -18;


            variable(
                openingPhoto,
                "--motion-scale",
                scale.toFixed(4)
            );


            variable(
                openingPhoto,
                "--motion-y",
                `${y.toFixed(2)}px`
            );
        }


        if (openingNumber) {

            variable(
                openingNumber,
                "--motion-y",
                `${(
                    center *
                    50
                ).toFixed(2)}px`
            );
        }


        if (openingCopy) {

            variable(
                openingCopy,
                "--motion-y",
                `${(
                    center *
                    12
                ).toFixed(2)}px`
            );
        }
    }


    /* ========================================================
       SEA BREAK
       ======================================================== */

    function animateSeaBreak() {

        if (
            !seaBreak ||
            !seaWord ||
            !nearby(seaBreak)
        ) {
            return;
        }


        const center =
            centered(
                seaBreak
            );


        variable(
            seaWord,
            "--sea-word-x",
            `${(
                center *
                35
            ).toFixed(2)}px`
        );
    }


    /* ========================================================
       PHOTO 02
       CONNECTION
       ======================================================== */

    function animateConnection() {

        if (
            !connection ||
            !nearby(
                connection,
                500
            )
        ) {
            return;
        }


        const center =
            centered(
                connection
            );


        if (connectionPhoto) {

            /*
             * Foto e texto movem em velocidades
             * ligeiramente diferentes.
             */

            variable(
                connectionPhoto,
                "--motion-y",
                `${(
                    center *
                    -20
                ).toFixed(2)}px`
            );
        }


        if (connectionIntro) {

            variable(
                connectionIntro,
                "--connection-copy-y",
                `${(
                    center *
                    13
                ).toFixed(2)}px`
            );
        }


        if (connectionSignature) {

            variable(
                connectionSignature,
                "--connection-signature-x",
                `${(
                    center *
                    -12
                ).toFixed(2)}px`
            );
        }
    }


    /* ========================================================
       PHOTO 03
       SKY
       ======================================================== */

    function animateSky() {

        if (
            !sky ||
            !nearby(
                sky,
                600
            )
        ) {
            return;
        }


        const value =
            progress(
                sky
            );


        const center =
            centered(
                sky
            );


        if (skyPhoto) {

            /*
             * Movimento menor que as outras.
             *
             * Como temos texto sobre o céu,
             * não queremos deslocar demais
             * a composição.
             */

            const scale =
                lerp(
                    0.995,
                    1.008,
                    value
                );


            variable(
                skyPhoto,
                "--motion-scale",
                scale.toFixed(4)
            );


            variable(
                skyPhoto,
                "--motion-y",
                `${(
                    center *
                    -9
                ).toFixed(2)}px`
            );
        }


        if (skyCopy) {

            variable(
                skyCopy,
                "--sky-copy-y",
                `${(
                    center *
                    13
                ).toFixed(2)}px`
            );
        }


        if (skyHeader) {

            variable(
                skyHeader,
                "--sky-header-y",
                `${(
                    center *
                    7
                ).toFixed(2)}px`
            );
        }
    }


    /* ========================================================
       CHAPTER END
       ======================================================== */

    function animateChapterEnd() {

        if (
            !chapterEnd ||
            !nearby(
                chapterEnd,
                500
            )
        ) {
            return;
        }


        const value =
            progress(
                chapterEnd
            );


        const center =
            centered(
                chapterEnd
            );


        if (chapterSeal) {

            const rotation =
                lerp(
                    -3,
                    3,
                    value
                );


            variable(
                chapterSeal,
                "--seal-rotation",
                `${rotation.toFixed(2)}deg`
            );
        }


        if (chapterBackground) {

            variable(
                chapterBackground,
                "--chapter-background-y",
                `${(
                    center *
                    25
                ).toFixed(2)}px`
            );
        }
    }


    /* ========================================================
       DESKTOP
       ======================================================== */

    function renderDesktop() {

        animateCover();

        animateOpening();

        animateSeaBreak();

        animateConnection();

        animateSky();

        animateChapterEnd();
    }


    /* ========================================================
       MOBILE
       ======================================================== */

    function renderMobile() {

        variable(
    openingPhoto,
    "--motion-y",
    "0px"
);

variable(
    openingPhoto,
    "--motion-scale",
    "1"
);

variable(
    connectionPhoto,
    "--motion-y",
    "0px"
);

variable(
    connectionIntro,
    "--connection-copy-y",
    "0px"
);

variable(
    connectionSignature,
    "--connection-signature-x",
    "0px"
);

variable(
    skyPhoto,
    "--motion-y",
    "0px"
);

variable(
    skyPhoto,
    "--motion-scale",
    "1"
);

variable(
    skyCopy,
    "--sky-copy-y",
    "0px"
);

variable(
    skyHeader,
    "--sky-header-y",
    "0px"
);

        /*
         * No celular mantemos somente profundidade
         * tipográfica muito leve.
         */

        if (
            opening &&
            nearby(opening)
        ) {

            const center =
                centered(
                    opening
                );


            variable(
                openingNumber,
                "--motion-y",
                `${(
                    center *
                    13
                ).toFixed(2)}px`
            );
        }


        if (
            seaBreak &&
            nearby(seaBreak)
        ) {

            const center =
                centered(
                    seaBreak
                );


            variable(
                seaWord,
                "--sea-word-x",
                `${(
                    center *
                    10
                ).toFixed(2)}px`
            );
        }
    }


    /* ========================================================
       RESET
       ======================================================== */

    function reset() {

        const properties = [

            [
                coverTitle,
                "--cover-motion-y"
            ],

            [
                coverGhost,
                "--cover-ghost-y"
            ],

            [
                openingPhoto,
                "--motion-y"
            ],

            [
                openingPhoto,
                "--motion-scale"
            ],

            [
                openingNumber,
                "--motion-y"
            ],

            [
                openingCopy,
                "--motion-y"
            ],

            [
                seaWord,
                "--sea-word-x"
            ],

            [
                connectionPhoto,
                "--motion-y"
            ],

            [
                connectionIntro,
                "--connection-copy-y"
            ],

            [
                connectionSignature,
                "--connection-signature-x"
            ],

            [
                skyPhoto,
                "--motion-y"
            ],

            [
                skyPhoto,
                "--motion-scale"
            ],

            [
                skyCopy,
                "--sky-copy-y"
            ],

            [
                skyHeader,
                "--sky-header-y"
            ],

            [
                chapterSeal,
                "--seal-rotation"
            ],

            [
                chapterBackground,
                "--chapter-background-y"
            ]

        ];


        properties.forEach(
            ([
                element,
                property
            ]) => {

                element
                    ?.style
                    .removeProperty(
                        property
                    );

            }
        );
    }


    /* ========================================================
       RENDER
       ======================================================== */

    function render() {

        ticking =
            false;


        if (
            reducedMotion.matches
        ) {

            reset();

            return;
        }


        if (
            mobile.matches
        ) {

            renderMobile();

            return;
        }


        renderDesktop();
    }


    function requestRender() {

        if (ticking) {
            return;
        }


        ticking =
            true;


        requestAnimationFrame(
            render
        );
    }


    /* ========================================================
       REFRESH
       ======================================================== */

    function refresh() {

        viewportHeight =
            window.innerHeight;


        requestRender();
    }


    /* ========================================================
       MEDIA
       ======================================================== */

    function handleMediaChange() {

        reset();

        refresh();
    }


    /* ========================================================
       EVENTS
       ======================================================== */

    window.addEventListener(
        "scroll",
        requestRender,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        refresh,
        {
            passive: true
        }
    );


    reducedMotion.addEventListener?.(
        "change",
        handleMediaChange
    );


    mobile.addEventListener?.(
        "change",
        handleMediaChange
    );


    /* ========================================================
       START
       ======================================================== */

    refresh();


    /* ========================================================
       API
       ======================================================== */

    return {

        refresh,


        destroy() {

            window.removeEventListener(
                "scroll",
                requestRender
            );


            window.removeEventListener(
                "resize",
                refresh
            );


            reducedMotion
                .removeEventListener?.(
                    "change",
                    handleMediaChange
                );


            mobile
                .removeEventListener?.(
                    "change",
                    handleMediaChange
                );


            reset();
        }

    };
}