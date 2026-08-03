/**
 * ===========================================================
 * Loading Screen
 * ===========================================================
 */

export function hideLoading() {

    const loading = document.getElementById("loading-screen");

    if (!loading) return;

    loading.classList.add("hidden");

    setTimeout(() => {

        loading.remove();

    }, 900);

}