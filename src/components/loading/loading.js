/**
 * ============================================================
 * Loading Component
 * ============================================================
 */

export function startLoading() {

    console.log("Loading iniciado.");

}

export function finishLoading() {

    const loading = document.getElementById("loading-screen");

    if(!loading) return;

    loading.style.transition =
        "opacity .8s ease";

    loading.style.opacity = 0;

    setTimeout(()=>{

        loading.remove();

    },800);

}