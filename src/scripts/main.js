import { loadComponent } from "./core/componentLoader.js";

document.addEventListener("DOMContentLoaded", async () => {


console.log("✓ Aplicação iniciada");


const app =
    document.getElementById("app");


if (!app) {

    console.error(
        '❌ Container "app" não encontrado.'
    );

    return;

}


try {

    await loadComponent(
        "./src/components/system/loading/loading.html",
        "app"
    );


    const loading =
        document.getElementById(
            "loading-screen"
        );


    if (!loading) {

        console.error(
            "❌ Loading não encontrado."
        );

        return;

    }


    const loadingModule =
        await import(
            "../components/system/loading/loading.js"
        );


    if (
        typeof loadingModule.initLoading ===
        "function"
    ) {

        loadingModule.initLoading();

    }


    console.log(
        "⏳ Loading ativo..."
    );


    await new Promise(
        function (resolve) {

            setTimeout(
                resolve,
                4000
            );

        }
    );


    console.log(
        "✓ Tempo do Loading terminado"
    );


    await loadComponent(
        "./src/components/sections/hero/hero.html",
        "app"
    );


    const hero =
        document.getElementById("hero");


    if (hero) {

        const heroModule =
            await import(
                "../components/sections/hero/hero.js"
            );


        if (
            typeof heroModule.initHero ===
            "function"
        ) {

            heroModule.initHero();

        }

    }


    await loadComponent(
        "./src/components/sections/story/story.html",
        "app"
    );


    const story =
        document.getElementById("story");


    if (story) {

        const storyModule =
            await import(
                "../components/sections/story/story.js"
            );


        if (
            typeof storyModule.initStory ===
            "function"
        ) {

            storyModule.initStory();

        }

    }

    await loadComponent(
    "./src/components/sections/day/day.html",
    "app"
);

const day = document.getElementById("day");

if (day) {

    const dayModule = await import(
        "../components/sections/day/day.js"
    );

    if (
        typeof dayModule.initDay ===
        "function"
    ) {

        dayModule.initDay();

    }

    }

    await loadComponent(
        "./src/components/sections/dresscode/dresscode.html",
        "app"
    );


    const dresscode =
        document.getElementById(
            "dresscode"
        );


    if (dresscode) {

        const dresscodeModule =
            await import(
                "../components/sections/dresscode/dresscode.js"
            );


        if (
            typeof dresscodeModule.initDresscode ===
            "function"
        ) {

            dresscodeModule.initDresscode();

        }

    }


    console.log(
        "✓ Todas as sections carregadas"
    );


    if (
        typeof loadingModule.finishLoading ===
        "function"
    ) {

        loadingModule.finishLoading();

    }


} catch (error) {

    console.error(
        "❌ Erro ao iniciar aplicação:",
        error
    );


    const loading =
        document.getElementById(
            "loading-screen"
        );


    if (loading) {

        loading.remove();

    }

}


});
