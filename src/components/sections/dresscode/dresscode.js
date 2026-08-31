/**
 * ============================================================
 * DRESS CODE
 * Suzana & Juan
 *
 * SISTEMA
 *
 * 1. Selecionar card
 * 2. Selecionar cor
 * 3. Cor fica somente naquele card
 * 4. Selecionar outro card
 * 5. Escolher outra cor
 * ============================================================
 */


export function initDresscode() {

    const section =
        document.querySelector(".dresscode");


    if (!section) {

        console.warn(
            "Dresscode: section não encontrada."
        );

        return;

    }


    /* ========================================================
       ELEMENTOS
    ======================================================== */

    const cards =
        [...section.querySelectorAll(
            ".dresscode__card"
        )];


    const swatches =
        [...section.querySelectorAll(
            ".dresscode__swatch"
        )];


    const indicator =
        section.querySelector(
            ".dresscode__selection-indicator"
        );


    const hint =
        section.querySelector(
            ".dresscode__selection-hint p"
        );


    /* ========================================================
       ESTADO
    ======================================================== */

    let selectedCard = null;


    /*
     * Cada card possui seu próprio estado.
     */

    const cardState = new WeakMap();


    cards.forEach(card => {

        cardState.set(
            card,
            {
                color: null,
                colorName: null,
                colorRgb: null
            }
        );

    });


    /* ========================================================
       CRIAR CHUVA
    ======================================================== */

    createBackgroundRain(section);


    cards.forEach(card => {

        createCardRain(card);

    });


    /* ========================================================
       SELECIONAR CARD
    ======================================================== */

    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                selectCard(card);

            }
        );


        /*
         * Acessibilidade teclado.
         */

        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    selectCard(card);

                }

            }
        );

    });


    /* ========================================================
       SELECIONAR COR
    ======================================================== */

    swatches.forEach(swatch => {

        swatch.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                if (!selectedCard) {

                    showSelectCardMessage();

                    return;

                }


                applyColor(
                    selectedCard,
                    swatch
                );

            }
        );

    });


    /* ========================================================
       SELECT CARD
    ======================================================== */

    function selectCard(card) {

        selectedCard = card;


        /*
         * Remove seleção dos outros cards.
         */

        cards.forEach(currentCard => {

            currentCard.classList.remove(
                "is-selected"
            );

        });


        /*
         * Marca o escolhido.
         */

        card.classList.add(
            "is-selected"
        );


        const state =
            cardState.get(card);


        /*
         * Se já tem uma cor,
         * mostrar essa cor.
         */

        updateActiveSwatch(
            state.color
        );


        if (state.color) {

            updateHint(
                `${capitalize(state.colorName)} está aplicado em ${card.dataset.cardName}`
            );

        } else {

            updateHint(
                `Ahora elige el color para ${card.dataset.cardName}`
            );

        }


        /*
         * Indicador acompanha a cor.
         */

        if (
            indicator &&
            state.color
        ) {

            indicator.style.background =
                state.color;

            indicator.style.boxShadow =
                `0 0 12px ${state.color}`;

        }


        /*
         * Mobile:
         * leva suavemente para a paleta.
         */

        if (
            window.innerWidth <= 600
        ) {

            const palette =
                section.querySelector(
                    ".dresscode__palette-section"
                );


            if (palette) {

                setTimeout(() => {

                    palette.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }, 100);

            }

        }

    }


    /* ========================================================
       APPLY COLOR
    ======================================================== */

    function applyColor(
        card,
        swatch
    ) {

        if (!card || !swatch) {

            return;

        }


        const color =
            swatch.dataset.color;


        const colorRgb =
            swatch.dataset.colorRgb;


        const colorName =
            swatch.dataset.colorName;


        if (!color) {

            return;

        }


        /*
         * Salvar estado SOMENTE desse card.
         */

        const state =
            cardState.get(card);


        state.color =
            color;

        state.colorName =
            colorName;

        state.colorRgb =
            colorRgb;


        /* ====================================================
           CSS VARIABLES
        ==================================================== */

        card.style.setProperty(
            "--card-color",
            color
        );


        card.style.setProperty(
            "--card-color-rgb",
            colorRgb
        );


        /*
         * Calcular se a cor é clara ou escura.
         */

        const isLight =
            isLightColor(color);


        /*
         * Remover estado anterior.
         */

        card.classList.remove(
            "is-light",
            "is-dark"
        );


        /*
         * Adicionar estado correto.
         */

        card.classList.add(
            isLight
                ? "is-light"
                : "is-dark"
        );


        /*
         * Calcular uma cor de texto
         * adequada à cor escolhida.
         */

        const textColor =
            getReadableTextColor(
                color,
                isLight
            );


        card.style.setProperty(
            "--card-text",
            textColor
        );


        /*
         * Card agora possui cor.
         */

        card.classList.add(
            "has-color"
        );


        /*
         * Atualizar paleta.
         */

        updateActiveSwatch(
            color
        );


        /*
         * Indicador.
         */

        if (indicator) {

            indicator.style.background =
                color;

            indicator.style.boxShadow =
                `0 0 12px ${color}`;

        }


        /*
         * Mensagem.
         */

        updateHint(
            `${capitalize(colorName)} aplicado a ${card.dataset.cardName}`
        );


        /*
         * Pequena animação.
         */

        animateColorChange(
            card
        );

    }


    /* ========================================================
       ACTIVE SWATCH
    ======================================================== */

    function updateActiveSwatch(color) {

        swatches.forEach(swatch => {

            swatch.classList.remove(
                "is-active"
            );

        });


        if (!color) {

            return;

        }


        const active =
            swatches.find(
                swatch =>
                    swatch.dataset.color
                    .toLowerCase() ===
                    color.toLowerCase()
            );


        if (active) {

            active.classList.add(
                "is-active"
            );

        }

    }


    /* ========================================================
       ANIMAÇÃO
    ======================================================== */

    function animateColorChange(card) {

        card.animate(
            [
                {
                    transform:
                        "translateY(-9px) scale(1)"
                },

                {
                    transform:
                        "translateY(-9px) scale(1.018)"
                },

                {
                    transform:
                        "translateY(-9px) scale(1)"
                }
            ],
            {
                duration: 500,

                easing:
                    "cubic-bezier(.22,1,.36,1)"
            }
        );

    }


    /* ========================================================
       LIGHT COLOR
    ======================================================== */

    function isLightColor(hex) {

        const rgb =
            hexToRgb(hex);


        if (!rgb) {

            return false;

        }


        /*
         * Perceived luminance.
         */

        const luminance =
            (
                0.299 * rgb.r +
                0.587 * rgb.g +
                0.114 * rgb.b
            ) / 255;


        return luminance > 0.68;

    }


    /* ========================================================
       READABLE TEXT
    ======================================================== */

    function getReadableTextColor(
        color,
        isLight
    ) {

        if (isLight) {

            /*
             * Para cores claras:
             * texto escuro.
             */

            return darkenColor(
                color,
                0.55
            );

        }


        /*
         * Para cores escuras:
         * usamos a própria cor.
         */

        return color;

    }


    /* ========================================================
       DARKEN COLOR
    ======================================================== */

    function darkenColor(
        hex,
        amount
    ) {

        const rgb =
            hexToRgb(hex);


        if (!rgb) {

            return hex;

        }


        const r =
            Math.round(
                rgb.r * amount
            );


        const g =
            Math.round(
                rgb.g * amount
            );


        const b =
            Math.round(
                rgb.b * amount
            );


        return `rgb(${r}, ${g}, ${b})`;

    }


    /* ========================================================
       HEX TO RGB
    ======================================================== */

    function hexToRgb(hex) {

        if (!hex) {

            return null;

        }


        const clean =
            hex.replace("#", "");


        if (
            clean.length !== 6
        ) {

            return null;

        }


        return {

            r:
                parseInt(
                    clean.substring(0,2),
                    16
                ),

            g:
                parseInt(
                    clean.substring(2,4),
                    16
                ),

            b:
                parseInt(
                    clean.substring(4,6),
                    16
                )

        };

    }


    /* ========================================================
       MESSAGE
    ======================================================== */

    function showSelectCardMessage() {

        updateHint(
            "Primero selecciona Caballeros o Señoras"
        );


        if (!indicator) {

            return;

        }


        indicator.animate(
            [
                {
                    transform:
                        "scale(1)"
                },

                {
                    transform:
                        "scale(1.8)"
                },

                {
                    transform:
                        "scale(1)"
                }
            ],
            {
                duration: 450
            }
        );

    }


    /* ========================================================
       HINT
    ======================================================== */

    function updateHint(text) {

        if (!hint) {

            return;

        }


        hint.textContent =
            text;

    }


    /* ========================================================
       CAPITALIZE
    ======================================================== */

    function capitalize(text) {

        if (!text) {

            return "";

        }


        return (
            text.charAt(0).toUpperCase() +
            text.slice(1)
        );

    }


    /* ========================================================
       REVEAL
    ======================================================== */

    initReveal(section);


    /* ========================================================
       SECRET
    ======================================================== */

    initSecret(section);

}


/* ============================================================
   BACKGROUND RAIN
============================================================ */

function createBackgroundRain(section) {

    const rain =
        section.querySelector(
            ".dresscode__rain"
        );


    if (!rain) {

        return;

    }


    /*
     * Evitar duplicação.
     */

    if (rain.children.length) {

        return;

    }


    const amount =
        window.innerWidth <= 600
            ? 30
            : 55;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "dresscode__particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        const duration =
            4 +
            Math.random() * 5;


        particle.style.setProperty(
            "--rain-duration",
            `${duration}s`
        );


        particle.style.setProperty(
            "--rain-delay",
            `${-(Math.random() * duration)}s`
        );


        particle.style.setProperty(
            "--rain-drift",
            `${-20 + Math.random() * 40}px`
        );


        if (i % 3 === 0) {

            particle.classList.add(
                "dresscode__particle--small"
            );

        }


        if (i % 3 === 1) {

            particle.classList.add(
                "dresscode__particle--medium"
            );

        }


        if (i % 3 === 2) {

            particle.classList.add(
                "dresscode__particle--soft"
            );

        }


        rain.appendChild(
            particle
        );

    }

}


/* ============================================================
   CARD RAIN
============================================================ */

function createCardRain(card) {

    const rain =
        card.querySelector(
            ".dresscode__card-rain"
        );


    if (!rain) {

        return;

    }


    if (rain.children.length) {

        return;

    }


    const amount =
        window.innerWidth <= 600
            ? 18
            : 28;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "dresscode__card-particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        const duration =
            2.5 +
            Math.random() * 3;


        particle.style.setProperty(
            "--card-rain-duration",
            `${duration}s`
        );


        particle.style.setProperty(
            "--card-rain-delay",
            `${-(Math.random() * duration)}s`
        );


        particle.style.setProperty(
            "--card-rain-drift",
            `${-18 + Math.random() * 36}px`
        );


        rain.appendChild(
            particle
        );

    }

}


/* ============================================================
   REVEAL
============================================================ */

function initReveal(section) {

    const elements =
        section.querySelectorAll(
            ".dresscode-reveal"
        );


    if (!elements.length) {

        return;

    }


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element =>
                element.classList.add(
                    "is-visible"
                )
        );

        return;

    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: .12
            }
        );


    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );

}


/* ============================================================
   EASTER EGG
============================================================ */

function initSecret(section) {

    const message =
        section.querySelector(
            ".dresscode__secret-message"
        );


    const emblem =
        section.querySelector(
            ".dresscode__emblem"
        );


    if (!message || !emblem) {

        return;

    }


    let clicks = 0;


    emblem.addEventListener(
        "click",
        () => {

            clicks++;


            if (clicks >= 5) {

                message.classList.add(
                    "is-visible"
                );


                clicks = 0;

            }

        }
    );


    message.addEventListener(
        "click",
        () => {

            message.classList.remove(
                "is-visible"
            );

        }
    );

}