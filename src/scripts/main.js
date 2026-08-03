import { loadComponent } from "./core/componentLoader.js";

import {
    finishLoading
}
from "../components/loading/loading.js";

document.addEventListener("DOMContentLoaded", async()=>{

    await loadComponent(

        "app",

        "./src/components/loading/loading.html"

    );

    setTimeout(()=>{

        finishLoading();

    },2200);

});