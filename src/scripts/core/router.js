/**
 * ============================================================
 * ROUTER
 * ============================================================
 */

export function changeScreen(screenId){

    document

        .querySelectorAll(".screen")

        .forEach(screen=>{

            screen.classList.remove("screen--active");

        });

    const nextScreen = document.getElementById(screenId);

    if(nextScreen){

        nextScreen.classList.add("screen--active");

    }

}