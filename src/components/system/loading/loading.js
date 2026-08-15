/**
 * ============================================================
 * LOADING COMPONENT
 * ============================================================
 */

let loadingScreen = null;

/**
 * ------------------------------------------------------------
 * Inicializa o Loading
 * ------------------------------------------------------------
 */

export function startLoading() {

    loadingScreen = document.getElementById("loading-screen");

    if (!loadingScreen) {

        console.warn("Loading não encontrado.");

        return;

    }

    loadingScreen.style.opacity = "1";
    loadingScreen.style.visibility = "visible";

}

/**
 * ------------------------------------------------------------
 * Finaliza o Loading
 * ------------------------------------------------------------
 */

export function finishLoading() {

    console.log("finishLoading foi chamado");

    if (!loadingScreen) return;

    loadingScreen.style.transition = "opacity .8s ease";
    loadingScreen.style.opacity = "0";

    setTimeout(() => {

        loadingScreen.remove();

    }, 800);

}