import { loadComponent } from "./core/componentLoader.js";

document.addEventListener("DOMContentLoaded", async () => {

    console.log("Wedding Site iniciado.");

    await loadComponent(
        "app",
        "./src/components/loading/loading.html"
    );

});