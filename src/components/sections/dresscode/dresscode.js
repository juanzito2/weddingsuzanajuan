/**
 * ============================================================
 * DRESS CODE
 * Suzana & Juan
 * ============================================================
 */

export function initDresscode() {

    const dresscode =
        document.querySelector("#dresscode");


    if (!dresscode) {

        console.warn(
            "Dress Code não encontrado."
        );

        return;

    }


    console.log(
        "✓ Dress Code inicializado"
    );


    /**
     * ========================================================
     * ELEMENTOS
     * ========================================================
     */

    const elements = [

        dresscode.querySelector(
            ".dresscode__heading"
        ),

        dresscode.querySelector(
            ".dresscode__card--ladies"
        ),

        dresscode.querySelector(
            ".dresscode__card--gentlemen"
        ),

        dresscode.querySelector(
            ".dresscode__note"
        ),

        dresscode.querySelector(
            ".dresscode__signature"
        )

    ];


    /**
     * ========================================================
     * ESTADO INICIAL
     * ========================================================
     */

    elements.forEach(
        (element, index) => {

            if (!element) {

                return;

            }


            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(30px)";


            element.style.transition =
                "opacity .8s ease, transform .8s ease";


            element.dataset.dresscodeDelay =
                index * 150;

        }
    );


    /**
     * ========================================================
     * OBSERVER
     * ========================================================
     */

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        const visibleElements =
                            dresscode.querySelectorAll(
                                ".dresscode__heading, " +
                                ".dresscode__card--ladies, " +
                                ".dresscode__card--gentlemen, " +
                                ".dresscode__note, " +
                                ".dresscode__signature"
                            );


                        visibleElements.forEach(
                            element => {

                                const delay =
                                    element.dataset
                                        .dresscodeDelay || 0;


                                setTimeout(
                                    () => {

                                        element.style.opacity =
                                            "1";


                                        element.style.transform =
                                            "translateY(0)";

                                    },
                                    Number(delay)
                                );

                            }
                        );


                        observer.unobserve(
                            dresscode
                        );

                    }
                );

            },

            {
                threshold: 0.15
            }

        );


    observer.observe(
        dresscode
    );

}