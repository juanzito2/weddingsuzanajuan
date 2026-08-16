/**
 * ============================================================
 * STORY
 * Suzana & Juan
 * ============================================================
 */

export function initStory() {

    const story = document.querySelector("#story");

    if (!story) {

        console.warn(
            "Story não encontrado."
        );

        return;

    }


    console.log(
        "✓ Story inicializado"
    );


    /* ========================================================
       ANIMAÇÃO DE ENTRADA
    ======================================================== */

    const elements = [

        story.querySelector(".story__heading"),

        story.querySelector(".story__visual"),

        story.querySelector(".story__body")

    ];


    elements.forEach((element, index) => {

        if (!element) return;


        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";


        element.style.transition =
            "opacity .8s ease, transform .8s ease";


        element.dataset.storyDelay =
            index * 180;

    });


    /* ========================================================
       OBSERVER
    ======================================================== */

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {

                        return;

                    }


                    const visibleElements =
                        story.querySelectorAll(

                            ".story__heading, " +
                            ".story__visual, " +
                            ".story__body"

                        );


                    visibleElements.forEach(element => {

                        const delay =
                            element.dataset.storyDelay || 0;


                        setTimeout(() => {

                            element.style.opacity =
                                "1";


                            element.style.transform =
                                "translateY(0)";


                        }, Number(delay));

                    });


                    observer.unobserve(
                        story
                    );

                });

            },

            {

                threshold: 0.15

            }

        );


    observer.observe(
        story
    );

}