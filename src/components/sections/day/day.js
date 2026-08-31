/**
 * ============================================================
 * NOSSO GRANDE DIA
 * Suzana & Juan
 * ============================================================
 */

export function initDay() {

    const day = document.querySelector("#day");

    if (!day) return;

    console.log("✓ Nosso Grande Dia inicializado");


    const events =
        day.querySelectorAll(".day__event");

    const seal =
        day.querySelector(".day__seal");

    const secretMessage =
        day.querySelector(".day__secret-message");


    /* ========================================================
       ENTRADA
    ======================================================== */

    events.forEach((event, index) => {

        event.style.opacity = "0";

        event.style.transform =
            "translateY(35px)";

        event.style.transition =
            "opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1)";

        event.dataset.delay =
            index * 120;

    });


    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;


                    events.forEach(event => {

                        const delay =
                            Number(
                                event.dataset.delay || 0
                            );


                        setTimeout(() => {

                            event.style.opacity = "1";

                            event.style.transform =
                                "translateY(0)";

                        }, delay);

                    });


                    observer.unobserve(day);

                });

            },

            {
                threshold: .08
            }

        );


    observer.observe(day);


    /* ========================================================
       PROGRESSO DA TIMELINE
    ======================================================== */

    const updateProgress = () => {

        const rect =
            day.getBoundingClientRect();

        const height =
            day.offsetHeight;

        const viewport =
            window.innerHeight;


        const progress =
            Math.min(
                Math.max(
                    (viewport - rect.top) /
                    (height + viewport),
                    0
                ),
                1
            );


        const line =
            day.querySelector(
                ".day__timeline-line"
            );


        if (line) {

            line.style.setProperty(
                "--timeline-progress",
                `${progress * 100}%`
            );

        }

    };


    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );


    updateProgress();


    /* ========================================================
       HOVER DOS EVENTOS
    ======================================================== */

    events.forEach(event => {

        event.addEventListener(
            "mouseenter",
            () => {

                events.forEach(other => {

                    if (other !== event) {

                        other.style.opacity =
                            ".38";

                    }

                });

            }
        );


        event.addEventListener(
            "mouseleave",
            () => {

                events.forEach(other => {

                    other.style.opacity =
                        "1";

                });

            }
        );

    });


    /* ========================================================
       EASTER EGG 1
       3 CLIQUES NO SJ
    ======================================================== */

    if (seal) {

        let clicks = 0;

        let timer;


        seal.addEventListener(
            "click",
            () => {

                clicks++;


                seal.style.transform =
                    "translateX(-50%) scale(.94)";


                setTimeout(() => {

                    seal.style.transform =
                        "translateX(-50%) scale(1)";

                }, 180);


                clearTimeout(timer);


                timer =
                    setTimeout(() => {

                        clicks = 0;

                    }, 1300);


                if (clicks === 3) {

                    clicks = 0;

                    activateSecret();

                }

            }
        );

    }


    /* ========================================================
       EASTER EGG 2
       HORÁRIO 22:30
    ======================================================== */

    const secretTime =
        day.querySelector(
            ".day__event-time--secret"
        );


    if (secretTime) {

        let secretClicks = 0;

        secretTime.addEventListener(
            "click",
            () => {

                secretClicks++;


                if (secretClicks >= 3) {

                    secretClicks = 0;

                    showLoveMessage();

                }

            }
        );

    }


    /* ========================================================
       SECRET MODE
    ======================================================== */

    function activateSecret() {

        day.classList.add(
            "day--secret"
        );


        createParticles();


        setTimeout(() => {

            day.classList.remove(
                "day--secret"
            );

        }, 5000);

    }


    /* ========================================================
       MENSAGEM 13
    ======================================================== */

    function showLoveMessage() {

        if (!secretMessage) return;


        const span =
            secretMessage.querySelector("span");

        const paragraph =
            secretMessage.querySelector("p");


        span.textContent =
            "13 ♥";


        paragraph.textContent =
            "El amor nunca deja de ser.";


        secretMessage.style.opacity =
            "1";


        setTimeout(() => {

            secretMessage.style.opacity =
                "0";

        }, 3500);

    }


    /* ========================================================
       PARTÍCULAS
    ======================================================== */

    function createParticles() {

        const container =
            document.createElement("div");


        container.className =
            "day__particles";


        for (let i = 0; i < 24; i++) {

            const particle =
                document.createElement("span");


            particle.textContent =
                i % 3 === 0
                    ? "✦"
                    : "·";


            particle.style.left =
                `${50 + (Math.random() * 40 - 20)}%`;


            particle.style.top =
                `${50 + (Math.random() * 20 - 10)}%`;


            particle.style.setProperty(
                "--x",
                `${Math.random() * 400 - 200}px`
            );


            particle.style.setProperty(
                "--y",
                `${Math.random() * -350 - 50}px`
            );


            container.appendChild(
                particle
            );

        }


        day.appendChild(container);


        setTimeout(() => {

            container.remove();

        }, 2500);

    }

}