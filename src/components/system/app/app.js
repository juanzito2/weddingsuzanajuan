/**
 * ============================================================
 * PUBLIC WEBSITE
 * ============================================================
 */

import { loadComponent } from "../../../scripts/core/componentLoader.js";

export async function loadWebsite(){

    await loadComponent(
        "app",
        "./src/components/app/app.html"
    );

    await loadComponent(
        "navbar-container",
        "./src/components/navbar/navbar.html"
    );

    await loadComponent(
        "hero-container",
        "./src/components/hero/hero.html"
    );

    await loadComponent(
        "story-container",
        "./src/components/story/story.html"
    );

    await loadComponent(
        "countdown-container",
        "./src/components/countdown/countdown.html"
    );

    await loadComponent(
        "information-container",
        "./src/components/information/information.html"
    );

    await loadComponent(
        "rsvp-container",
        "./src/components/rsvp/rsvp.html"
    );

    await loadComponent(
        "gallery-container",
        "./src/components/gallery/gallery.html"
    );

    await loadComponent(
        "footer-container",
        "./src/components/footer/footer.html"
    );

}