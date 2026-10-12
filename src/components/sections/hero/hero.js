/**
 * ============================================================
 * HERO
 * ============================================================
 *
 * Responsabilidades:
 *
 * 1. Inicializar a contagem regressiva.
 * 2. Atualizar dias, horas, minutos e segundos.
 * 3. Controlar o botão "Descubrir nuestra historia".
 *
 * ============================================================
 */


/**
 * ============================================================
 * CONFIGURAÇÃO
 * ============================================================
 */

const WEDDING_DATE =
    "2027-01-09T16:00:00";


/**
 * ============================================================
 * INIT HERO
 * ============================================================
 */

export function initHero() {

    console.log(
        "hero.js: init hero iniciado"
    );


    initCountdown();

    initDiscoverButton();


    console.log(
        "✓ Hero inicializado"
    );

}


/**
 * ============================================================
 * COUNTDOWN
 * ============================================================
 */

function initCountdown() {

    const daysElement =
        document.getElementById(
            "countdown-days"
        );


    const hoursElement =
        document.getElementById(
            "countdown-hours"
        );


    const minutesElement =
        document.getElementById(
            "countdown-minutes"
        );


    const secondsElement =
        document.getElementById(
            "countdown-seconds"
        );


    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {

        console.warn(
            "Elementos da contagem regressiva não encontrados."
        );

        return;

    }


    /**
     * --------------------------------------------------------
     * UPDATE
     * --------------------------------------------------------
     */

    function updateCountdown() {

        const target =
            new Date(
                WEDDING_DATE
            ).getTime();


        const now =
            Date.now();


        const difference =
            target - now;


        /*
         * Caso a data tenha chegado.
         */

        if (difference <= 0) {

            daysElement.textContent =
                "000";

            hoursElement.textContent =
                "00";

            minutesElement.textContent =
                "00";

            secondsElement.textContent =
                "00";

            return;

        }


        /*
         * Conversão.
         */

        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        /*
         * Atualiza HTML.
         */

        daysElement.textContent = String(days);


        hoursElement.textContent =
            String(hours)
                .padStart(2, "0");


        minutesElement.textContent =
            String(minutes)
                .padStart(2, "0");


        secondsElement.textContent =
            String(seconds)
                .padStart(2, "0");

    }


    /*
     * Primeira atualização imediata.
     */

    updateCountdown();


    /*
     * Atualiza a cada segundo.
     */

    const countdownInterval =
        setInterval(
            updateCountdown,
            1000
        );


    /*
     * Guarda o intervalo no elemento
     * para evitar inicializações duplicadas.
     */

    const countdown =
        document.getElementById(
            "hero-countdown"
        );


    if (countdown) {

        countdown.dataset.initialized =
            "true";

    }

}


/**
 * ============================================================
 * DISCOVER BUTTON
 * ============================================================
 */

function initDiscoverButton() {

    const button =
        document.querySelector("#hero-discover");

    if (!button) {

        console.warn(
            "Botão #hero-discover não encontrado."
        );

        return;

    }


    button.addEventListener(
        "click",
        () => {

            const story =
                document.querySelector("#story");


            if (!story) {

                console.warn(
                    "Seção #story não encontrada."
                );

                return;

            }


            story.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }
    );


    console.log(
        "✓ Botão do Hero inicializado"
    );

}