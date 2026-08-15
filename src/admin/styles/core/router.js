/**
 * ============================================================
 * ROUTER
 * ============================================================
 */

export function showScreen(id){

    document

        .querySelectorAll(".screen")

        .forEach(screen=>{

            screen.classList.remove("screen--active");

        });

    document

        .getElementById(id)

        .classList.add("screen--active");

}