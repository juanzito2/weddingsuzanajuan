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


import {
    initDresscode
}
from "../components/sections/dresscode/dresscode.js";


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


        /**
         * ====================================================
         * LOADING
         * ====================================================
         */

        await loadComponent(
            "loading-container",
            "./src/components/system/loading/loading.html"
        );


        startLoading();


        /**
         * ====================================================
         * AGUARDA O LOADING
         * ====================================================
         */

        setTimeout(
            async () => {

                finishLoading();


                /**
                 * ============================================
                 * AGUARDA O FADE DO LOADING
                 * ============================================
                 */

                setTimeout(
                    async () => {


                        /**
                         * ====================================
                         * HERO
                         * ====================================
                         */

                        const heroLoaded =
                            await loadComponent(
                                "hero-container",
                                "./src/components/sections/hero/hero.html"
                            );


                        if (heroLoaded) {

                            initHero();

                        }


                        /**
                         * ====================================
                         * STORY
                         * ====================================
                         */

                        const storyLoaded =
                            await loadComponent(
                                "story-container",
                                "./src/components/sections/story/story.html"
                            );


                        if (storyLoaded) {

                            initStory();

                        }


                        /**
                         * ====================================
                         * DRESS CODE
                         * ====================================
                         */

                        const dresscodeLoaded =
                            await loadComponent(
                                "dresscode-container",
                                "./src/components/sections/dresscode/dresscode.html"
                            );


                        if (dresscodeLoaded) {

                            initDresscode();

                        }


                    },
                    850
                );

            },
            2200
        );

    }
);