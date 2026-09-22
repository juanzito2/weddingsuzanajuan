/**
 * ============================================================
 * INFORMATION
 * Interações da seção de informações
 * ============================================================
 */

export function initInformation() {
    const section = document.querySelector(".information");

    if (!section) return;

    const cards = [
        ...section.querySelectorAll(".information-card")
    ];

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    /**
     * ========================================================
     * REVEAL
     * ========================================================
     */

    function initReveal() {
        if (reducedMotion) {
            cards.forEach((card) => {
                card.classList.add("is-visible");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const card = entry.target;

                    card.classList.add("is-visible");

                    observer.unobserve(card);
                });
            },
            {
                threshold: 0.18
            }
        );

        cards.forEach((card, index) => {
            card.style.setProperty(
                "--reveal-delay",
                `${index * 120}ms`
            );

            observer.observe(card);
        });
    }


    /**
     * ========================================================
     * SPOTLIGHT
     * ========================================================
     */

    function initSpotlight() {
        cards.forEach((card) => {

            card.addEventListener(
                "pointermove",
                (event) => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );
                }
            );
        });
    }


    /**
     * ========================================================
     * 3D TILT
     * ========================================================
     */

    function initTilt() {
        if (reducedMotion) return;

        cards.forEach((card) => {

            card.addEventListener(
                "pointermove",
                (event) => {

                    if (
                        event.pointerType === "touch"
                    ) {
                        return;
                    }

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const rotateY =
                        ((x - centerX) /
                            centerX) *
                        2.8;

                    const rotateX =
                        -(
                            (y - centerY) /
                            centerY
                        ) * 2.8;

                    card.style.setProperty(
                        "--rotate-x",
                        `${rotateX}deg`
                    );

                    card.style.setProperty(
                        "--rotate-y",
                        `${rotateY}deg`
                    );

                    card.classList.add(
                        "is-hovering"
                    );
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.setProperty(
                        "--rotate-x",
                        "0deg"
                    );

                    card.style.setProperty(
                        "--rotate-y",
                        "0deg"
                    );

                    card.classList.remove(
                        "is-hovering"
                    );
                }
            );
        });
    }


    /**
     * ========================================================
     * PARALLAX INTERNO
     * ========================================================
     */

    function initCardParallax() {
        if (reducedMotion) return;

        cards.forEach((card) => {

            const number =
                card.querySelector(
                    ".information-card__number"
                );

            const word =
                card.querySelector(
                    ".information-card__word"
                );

            card.addEventListener(
                "pointermove",
                (event) => {

                    if (
                        event.pointerType === "touch"
                    ) {
                        return;
                    }

                    const rect =
                        card.getBoundingClientRect();

                    const normalizedX =
                        (
                            event.clientX -
                            rect.left
                        ) /
                            rect.width -
                        0.5;

                    const normalizedY =
                        (
                            event.clientY -
                            rect.top
                        ) /
                            rect.height -
                        0.5;

                    if (number) {
                        number.style.transform =
                            `translate(
                                ${normalizedX * 12}px,
                                ${normalizedY * 12}px
                            )`;
                    }

                    if (word) {
                        word.style.transform =
                            `translate(
                                ${normalizedX * -15}px,
                                ${normalizedY * -8}px
                            )`;
                    }
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {

                    if (number) {
                        number.style.transform =
                            "";
                    }

                    if (word) {
                        word.style.transform =
                            "";
                    }
                }
            );
        });
    }


    /**
     * ========================================================
     * MAGNETIC LINK
     * ========================================================
     */

    function initMagneticLinks() {
        if (reducedMotion) return;

        const links =
            section.querySelectorAll(
                ".information-card__link"
            );

        links.forEach((link) => {

            link.addEventListener(
                "pointermove",
                (event) => {

                    if (
                        event.pointerType === "touch"
                    ) {
                        return;
                    }

                    const rect =
                        link.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    link.style.transform =
                        `translate(
                            ${x * 0.06}px,
                            ${y * 0.12}px
                        )`;
                }
            );

            link.addEventListener(
                "pointerleave",
                () => {

                    link.style.transform =
                        "translate(0, 0)";
                }
            );
        });
    }


    /**
     * ========================================================
     * PARKING COUNTER
     * ========================================================
     */

    function initParkingCounter() {
        const price =
            section.querySelector(
                ".information-card__highlight strong"
            );

        if (!price) return;

        const finalValue = 8;

        if (reducedMotion) {
            price.textContent =
                `${finalValue} €`;

            return;
        }

        let animated = false;

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting ||
                                animated
                            ) {
                                return;
                            }

                            animated = true;

                            animateNumber();

                            observer.disconnect();
                        }
                    );
                },
                {
                    threshold: 0.6
                }
            );

        observer.observe(price);

        function animateNumber() {
            const duration = 900;

            const start =
                performance.now();

            function frame(time) {
                const progress =
                    Math.min(
                        (time - start) /
                            duration,
                        1
                    );

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );

                const value =
                    Math.round(
                        eased * finalValue
                    );

                price.textContent =
                    `${value} €`;

                if (progress < 1) {
                    requestAnimationFrame(
                        frame
                    );
                }
            }

            requestAnimationFrame(frame);
        }
    }


    /**
     * ========================================================
     * SJ SEAL
     * ========================================================
     */

    function initSeal() {
        if (reducedMotion) return;

        const seal =
            section.querySelector(
                ".information-card__seal"
            );

        if (!seal) return;

        const card =
            seal.closest(
                ".information-card"
            );

        if (!card) return;

        card.addEventListener(
            "pointermove",
            (event) => {

                if (
                    event.pointerType === "touch"
                ) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    (
                        event.clientX -
                        rect.left -
                        rect.width / 2
                    ) /
                    rect.width;

                const y =
                    (
                        event.clientY -
                        rect.top -
                        rect.height / 2
                    ) /
                    rect.height;

                seal.style.transform =
                    `translate(
                        ${x * 10}px,
                        ${y * 10}px
                    )
                    rotate(
                        ${x * 5}deg
                    )`;
            }
        );

        card.addEventListener(
            "pointerleave",
            () => {

                seal.style.transform =
                    "";
            }
        );
    }


    /**
     * ========================================================
     * SECTION PARALLAX
     * ========================================================
     */

    function initSectionParallax() {
        if (reducedMotion) return;

        const glowOne =
            section.querySelector(
                ".information__glow--one"
            );

        const glowTwo =
            section.querySelector(
                ".information__glow--two"
            );

        let ticking = false;

        function update() {
            const rect =
                section.getBoundingClientRect();

            const viewportHeight =
                window.innerHeight;

            const progress =
                (
                    viewportHeight -
                    rect.top
                ) /
                (
                    viewportHeight +
                    rect.height
                );

            const movement =
                (progress - 0.5) * 80;

            if (glowOne) {
                glowOne.style.transform =
                    `translate3d(
                        0,
                        ${movement}px,
                        0
                    )`;
            }

            if (glowTwo) {
                glowTwo.style.transform =
                    `translate3d(
                        0,
                        ${-movement}px,
                        0
                    )`;
            }

            ticking = false;
        }

        window.addEventListener(
            "scroll",
            () => {

                if (ticking) return;

                ticking = true;

                requestAnimationFrame(
                    update
                );
            },
            {
                passive: true
            }
        );

        update();
    }


    /**
     * ========================================================
     * INITIALIZE
     * ========================================================
     */

    initReveal();
    initSpotlight();
    initTilt();
    initCardParallax();
    initMagneticLinks();
    initParkingCounter();
    initSeal();
    initSectionParallax();

    console.log(
        "✓ Information inicializado"
    );
}