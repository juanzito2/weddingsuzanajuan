
/**
 * ============================================================
 * MAIN — SUZANA & JUAN
 * ============================================================
 */

import { loadComponent } from "./core/componentLoader.js";

import { galleryConfig } from "../config/gallery.config.js";


document.addEventListener("DOMContentLoaded", async () => {

    console.log("✓ Aplicação iniciada");

    const app = document.getElementById("app");

    if (!app) {
        console.error('❌ Container "app" não encontrado.');
        return;
    }

    try {

        /* ============================================================
           LOADING
           ============================================================ */

        await loadComponent(
            "./src/components/system/loading/loading.html",
            "app"
        );

        const loading = document.getElementById("loading-screen");

        if (!loading) {
            console.error("❌ Loading não encontrado.");
            return;
        }

        const loadingModule = await import(
            "../components/system/loading/loading.js"
        );

        if (typeof loadingModule.initLoading === "function") {
            loadingModule.initLoading();
        }

        console.log("⏳ Loading ativo...");

        await new Promise((resolve) => {
            setTimeout(resolve, 4000);
        });

        console.log("✓ Tempo do Loading terminado");


        /* ============================================================
           HERO
           ============================================================ */

        await loadComponent(
            "./src/components/sections/hero/hero.html",
            "app"
        );

        const hero = document.getElementById("hero");

        if (hero) {
            const heroModule = await import(
                "../components/sections/hero/hero.js"
            );

            if (typeof heroModule.initHero === "function") {
                heroModule.initHero();
            }
        }


        


        /* ============================================================
           DAY
           ============================================================ */

        await loadComponent(
            "./src/components/sections/day/day.html",
            "app"
        );

        const day = document.getElementById("day");

        if (day) {
            const dayModule = await import(
                "../components/sections/day/day.js"
            );

            if (typeof dayModule.initDay === "function") {
                dayModule.initDay();
            }
        }


        /* ============================================================
           DRESS CODE
           ============================================================ */

        await loadComponent(
            "./src/components/sections/dresscode/dresscode.html",
            "app"
        );

        const dresscode = document.getElementById("dresscode");

        if (dresscode) {
            const dresscodeModule = await import(
                "../components/sections/dresscode/dresscode.js"
            );

            if (typeof dresscodeModule.initDresscode === "function") {
                dresscodeModule.initDresscode();
            }
        }


        /* ============================================================
           INFORMATION
           ============================================================ */

        await loadComponent(
            "./src/components/sections/information/information.html",
            "app"
        );

        const information = document.getElementById("information");

        if (information) {
            const informationModule = await import(
                "../components/sections/information/information.js"
            );

            if (typeof informationModule.initInformation === "function") {
                informationModule.initInformation();
            }
        }


        /* ============================================================
           OFFICIAL GALLERY
           ============================================================ */

        if (galleryConfig.officialGalleryVisible) {

            await loadComponent(
                "./src/components/sections/official-gallery/official-gallery.html",
                "app"
            );

            const officialGallery = document.getElementById(
                "official-gallery"
            );

            if (officialGallery) {

                const officialGalleryModule = await import(
                    "../components/sections/official-gallery/official-gallery.js"
                );

                if (
                    typeof officialGalleryModule.initOfficialGallery ===
                    "function"
                ) {
                    officialGalleryModule.initOfficialGallery();
                }
            }

            console.log("✓ Galeria oficial carregada");

        } else {

            console.log("🔒 Galeria oficial oculta");

        }



        /* ============================================================
           GUEST GALLERY — ROYAL MEMORIES 2.0
           ============================================================ */

        if (galleryConfig.guestsGalleryVisible) {

            await loadComponent(
                "./src/components/sections/guests-gallery/guests-gallery.html",
                "app"
            );

            const guestsGallery = document.getElementById("guest-gallery");

            if (!guestsGallery) {
                throw new Error(
                    "Royal Memories: HTML da galeria não encontrado."
                );
            }

            const guestsGalleryModule = await import(
                "../components/sections/guests-gallery/guests-gallery.js"
            );

            if (typeof guestsGalleryModule.initGuestsGallery !== "function") {
                throw new Error(
                    "Royal Memories: initGuestsGallery não encontrada."
                );
            }

            guestsGalleryModule.initGuestsGallery(guestsGallery);

            console.log("✓ Royal Memories 2.0 inicializada");

        } else {

            console.log("🔒 Royal Memories oculta");

        }


        /* ============================================================
           ROYAL FINALE & FOOTER
           ============================================================ */

        await loadComponent(
            "./src/components/sections/finale/finale.html",
            "app"
        );

        const finale = document.getElementById("finale");

        if (!finale) {
            throw new Error("Royal Finale: HTML não encontrado.");
        }

        const finaleModule = await import(
            "../components/sections/finale/finale.js"
        );

        if (typeof finaleModule.initFinale === "function") {
            finaleModule.initFinale();
        }

        console.log("✓ Royal Finale e Footer carregados");




        /* ============================================================
           APPLICATION READY
           ============================================================ */

        console.log("✓ Todas as sections carregadas");

        if (typeof loadingModule.finishLoading === "function") {
            loadingModule.finishLoading();
        }

    } catch (error) {

        console.error(
            "❌ Erro ao iniciar aplicação:",
            error
        );

        const loading = document.getElementById(
            "loading-screen"
        );

        if (loading) {
            loading.remove();
        }
    }

});
