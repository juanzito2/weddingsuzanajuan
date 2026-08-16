/**
 * ============================================================
 * MAIN
 * Suzana & Juan
 * ============================================================
 */

import {
    loadComponent
}
from "./core/componentLoader.js";


import {
    startLoading,
    finishLoading
}
from "../components/system/loading/loading.js";


import {
    initHero
}
from "../components/sections/hero/hero.js";


import {
    initStory
}
from "../components/sections/story/story.js";


/**
 * ============================================================
 * APPLICATION
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    async () => {


        console.log(
            "✓ Aplicação iniciada"
        );


        /* ====================================================
           LOADING
        ==================================================== */

        await loadComponent(
            "loading-container",
            "./src/components/system/loading/loading.html"
        );


        startLoading();


        /* ====================================================
           TEMPO DO LOADING
        ==================================================== */

        setTimeout(
            async () => {


                /* ============================================
                   FINALIZA LOADING
                ============================================ */

                finishLoading();


                /* ============================================
                   AGUARDA O FADE
                ============================================ */

                setTimeout(
                    async () => {


                        /* ====================================
                           HERO
                        ==================================== */

                        const hero =
                            await loadComponent(
                                "hero-container",
                                "./src/components/sections/hero/hero.html"
                            );


                        if (hero) {

                            initHero();

                        }


                        /* ====================================
                           STORY
                        ==================================== */

                        const story =
                            await loadComponent(
                                "story-container",
                                "./src/components/sections/story/story.html"
                            );


                        if (story) {

                            initStory();

                        }


                    },
                    850
                );


            },
            2200
        );


    }
);