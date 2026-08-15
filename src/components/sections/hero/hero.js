/**
 * ============================================================
 * HERO
 * ------------------------------------------------------------
 * Interações visuais e comportamento do Hero.
 * ============================================================
 */

export function initHero() {
    console.log("init hero iniciado");
    const hero = document.querySelector(".hero");

    if (!hero) return;


    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const monogram = hero.querySelector(".hero__monogram");

    const decorations = hero.querySelectorAll(
        ".hero__decoration"
    );

    const discoverButton = hero.querySelector(
        ".hero__button"
    );

    const countdown = hero.querySelector(
        "#hero-countdown"
    );


    /* =========================================================
       ENTRADA DO HERO
    ========================================================= */

    requestAnimationFrame(() => {

        hero.classList.add("hero--visible");

    });


    /* =========================================================
       COUNTDOWN
       09 DE JANEIRO DE 2027
    ========================================================= */

    function updateCountdown() {

        if (!countdown) return;


        const weddingDate = new Date(
            "2027-01-09T16:00:00+01:00"
        ).getTime();

        const now = Date.now();

        const difference = weddingDate - now;


        const items = countdown.querySelectorAll(
            ".countdown__item span"
        );


        if (difference <= 0) {

            items[0].textContent = "000";
            items[1].textContent = "00";
            items[2].textContent = "00";
            items[3].textContent = "00";

            return;

        }


        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );


        items[0].textContent =
            String(days).padStart(3, "0");

        items[1].textContent =
            String(hours).padStart(2, "0");

        items[2].textContent =
            String(minutes).padStart(2, "0");

        items[3].textContent =
            String(seconds).padStart(2, "0");

    }


    updateCountdown();

    setInterval(updateCountdown, 1000);


    /* =========================================================
       MOVIMENTO DAS DECORAÇÕES
       ---------------------------------------------------------
       Efeito Parallax muito suave.
    ========================================================= */

    if (window.matchMedia("(pointer: fine)").matches) {

        hero.addEventListener("mousemove", (event) => {

            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;


            decorations.forEach((element, index) => {

                const intensity =
                    8 + (index * 2);

                const moveX =
                    x * intensity;

                const moveY =
                    y * intensity;


                element.style.transform =
                    `translate3d(${moveX}px, ${moveY}px, 0)`;

            });


            /* =================================================
               MONOGRAMA
            ================================================= */

            if (monogram) {

                monogram.style.transform =
                    `translate3d(${x * 6}px, ${y * 6}px, 0)`;

            }

        });


        hero.addEventListener("mouseleave", () => {

            decorations.forEach((element) => {

                element.style.transform =
                    "";

            });


            if (monogram) {

                monogram.style.transform = "";

            }

        });

    }


    /* =========================================================
       BOTÃO DISCOVER
    ========================================================= */

    if (discoverButton) {

        discoverButton.addEventListener(
            "click",
            () => {

                const nextSection =
                    document.querySelector(
                        "#story, #historia, #information, main > section:nth-of-type(2)"
                    );


                if (nextSection) {

                    nextSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }


    /* =========================================================
       HOVER DO MONOGRAMA
    ========================================================= */

    if (monogram) {

        monogram.addEventListener(
            "mouseenter",
            () => {

                monogram.classList.add(
                    "hero__monogram--active"
                );

            }
        );


        monogram.addEventListener(
            "mouseleave",
            () => {

                monogram.classList.remove(
                    "hero__monogram--active"
                );

            }
        );

    }

}