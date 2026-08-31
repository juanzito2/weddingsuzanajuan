let loadingScreen = null;

let loadingStartTime = 0;

const MINIMUM_LOADING_TIME = 4000;

export function initLoading() {


loadingScreen =
    document.getElementById(
        "loading-screen"
    );


if (!loadingScreen) {

    console.warn(
        "Loading não encontrado."
    );

    return;

}


loadingStartTime =
    Date.now();


loadingScreen.style.opacity = "1";

loadingScreen.style.visibility =
    "visible";

loadingScreen.style.pointerEvents =
    "auto";


console.log(
    "✓ Loading inicializado"
);


}

export function startLoading() {


initLoading();


}

export function finishLoading() {


console.log(
    "finishLoading foi chamado"
);


if (!loadingScreen) {

    loadingScreen =
        document.getElementById(
            "loading-screen"
        );

}


if (!loadingScreen) {

    console.warn(
        "Loading não encontrado."
    );

    return;

}


const elapsedTime =
    Date.now() - loadingStartTime;


const remainingTime =
    Math.max(
        0,
        MINIMUM_LOADING_TIME -
        elapsedTime
    );


console.log(
    "Tempo decorrido:",
    elapsedTime,
    "ms"
);


console.log(
    "Tempo restante:",
    remainingTime,
    "ms"
);


setTimeout(
    function () {


        if (!loadingScreen) {

            return;

        }


        loadingScreen.style.transition =
            "opacity 1.5s ease";


        loadingScreen.style.opacity =
            "0";


        loadingScreen.style.pointerEvents =
            "none";


        setTimeout(
            function () {


                if (loadingScreen) {

                    loadingScreen.style.visibility =
                        "hidden";


                    loadingScreen.remove();

                    loadingScreen = null;


                    console.log(
                        "✓ Loading removido"
                    );

                }


            },
            1500
        );


    },
    remainingTime
);


}
