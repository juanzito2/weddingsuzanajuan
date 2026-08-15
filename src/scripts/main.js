/**
 * ============================================================
 * MAIN
 * ============================================================
 */

import { loadComponent }
from "./core/componentLoader.js";

import {
    startLoading,
    finishLoading
}
from "../components/system/loading/loading.js";

import { initHero }
from "../components/sections/hero/hero.js";


/**
 * ============================================================
 * APPLICATION
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // ------------------------------------------------------
        // LOADING
        // ------------------------------------------------------

        await loadComponent(
            "app",
            "./src/components/system/loading/loading.html"
        );

        startLoading();


        // ------------------------------------------------------
        // WAIT FOR LOADING
        // ------------------------------------------------------

        setTimeout(async () => {

            finishLoading();


            // --------------------------------------------------
            // WAIT FOR LOADING FADE
            // --------------------------------------------------

            setTimeout(async () => {

                // ----------------------------------------------
                // LOAD HERO
                // ----------------------------------------------

                await loadComponent(
                    "app",
                    "./src/components/sections/hero/hero.html"
                );


                // ----------------------------------------------
                // INITIALIZE HERO
                // ----------------------------------------------

                initHero();

            }, 850);

        }, 2200);

    }
);