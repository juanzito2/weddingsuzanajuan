/* ============================================================
   GUESTS GALLERY — SUZANA & JUAN
   ============================================================

   GALERÍA PÚBLICA

   - Stories agrupadas por invitado
   - Fotos + vídeos
   - Búsqueda por invitado
   - Navegación entre recuerdos
   - Navegación entre invitados
   - Galería featured
   - Crop 1:1 solo en miniaturas
   - Lightbox con fotografía ORIGINAL
   - Preparado para Supabase

   ============================================================ */


/* ============================================================
   CONFIG
   ============================================================ */

const CONFIG = {

    featuredInitial:
        8,

    featuredStep:
        8,

    imageStoryDuration:
        6000,

    scrollAmount:
        360

};


/* ============================================================
   STATE
   ============================================================ */

const state = {

    guests: [],

    filteredGuests: [],

    featured: [],

    featuredVisible:
        CONFIG.featuredInitial,

    storyGuestIndex:
        0,

    storyMemoryIndex:
        0,

    featuredIndex:
        0,

    storyTimer:
        null,

    storyStartedAt:
        null,

    storyElapsed:
        0,

    storyAnimationFrame:
        null,

    storyPaused:
        false

};


/* ============================================================
   ELEMENTS
   ============================================================ */

let el = {};


/* ============================================================
   INIT
   ============================================================ */

export function initGuestsGallery() {

    const root =
        document.getElementById(
            "guest-gallery"
        );


    if (!root) {
        return;
    }


    cacheElements(root);

    registerEvents();

    loadGalleryData();

    console.log(
        "✓ Guest Gallery inicializada"
    );

}


/* ============================================================
   CACHE ELEMENTS
   ============================================================ */

function cacheElements(root) {

    el = {

        root,


        /* STORIES */

        guestSearch:
            root.querySelector(
                "[data-guest-search]"
            ),

        guestSearchClear:
            root.querySelector(
                "[data-guest-search-clear]"
            ),

        guestTotal:
            root.querySelector(
                "[data-guest-total]"
            ),

        storiesViewport:
            root.querySelector(
                "[data-stories-viewport]"
            ),

        storiesTrack:
            root.querySelector(
                "[data-stories-track]"
            ),

        storiesPrevious:
            root.querySelector(
                "[data-stories-previous]"
            ),

        storiesNext:
            root.querySelector(
                "[data-stories-next]"
            ),

        storiesProgress:
            root.querySelector(
                "[data-stories-progress]"
            ),

        storiesSearchEmpty:
            root.querySelector(
                "[data-stories-search-empty]"
            ),

        storiesEmpty:
            root.querySelector(
                "[data-stories-empty]"
            ),


        /* FEATURED */

        featuredGrid:
            root.querySelector(
                "[data-featured-grid]"
            ),

        featuredEmpty:
            root.querySelector(
                "[data-featured-empty]"
            ),

        featuredMoreWrapper:
            root.querySelector(
                "[data-featured-more-wrapper]"
            ),

        featuredMore:
            root.querySelector(
                "[data-featured-more]"
            ),


        /* STORY VIEWER */

        storyViewer:
            root.querySelector(
                "[data-story-viewer]"
            ),

        storyProgress:
            root.querySelector(
                "[data-story-progress]"
            ),

        storyAvatar:
            root.querySelector(
                "[data-story-avatar]"
            ),

        storyAvatarFallback:
            root.querySelector(
                "[data-story-avatar-fallback]"
            ),

        storyName:
            root.querySelector(
                "[data-story-name]"
            ),

        storyBio:
            root.querySelector(
                "[data-story-bio]"
            ),

        storyImage:
            root.querySelector(
                "[data-story-image]"
            ),

        storyVideo:
            root.querySelector(
                "[data-story-video]"
            ),

        storyLoading:
            root.querySelector(
                "[data-story-loading]"
            ),

        storyCounter:
            root.querySelector(
                "[data-story-counter]"
            ),

        storyPrevious:
            root.querySelector(
                "[data-story-previous]"
            ),

        storyNext:
            root.querySelector(
                "[data-story-next]"
            ),

        storyClose:
            root.querySelectorAll(
                "[data-story-close]"
            ),


        /* FEATURED LIGHTBOX */

        featuredLightbox:
            root.querySelector(
                "[data-featured-lightbox]"
            ),

        featuredLightboxImage:
            root.querySelector(
                "[data-featured-lightbox-image]"
            ),

        featuredLightboxAvatar:
            root.querySelector(
                "[data-featured-lightbox-avatar]"
            ),

        featuredLightboxAvatarFallback:
            root.querySelector(
                "[data-featured-lightbox-avatar-fallback]"
            ),

        featuredLightboxName:
            root.querySelector(
                "[data-featured-lightbox-name]"
            ),

        featuredLightboxCounter:
            root.querySelector(
                "[data-featured-lightbox-counter]"
            ),

        featuredPrevious:
            root.querySelector(
                "[data-featured-previous]"
            ),

        featuredNext:
            root.querySelector(
                "[data-featured-next]"
            ),

        featuredClose:
            root.querySelectorAll(
                "[data-featured-close]"
            )

    };

}


/* ============================================================
   LOAD DATA
   ============================================================ */

async function loadGalleryData() {

    /*
     * FUTURO:
     *
     * Aqui entra Supabase:
     *
     * guests
     * guest_memories
     *
     * Por enquanto usamos dados demo para
     * poder construir e testar toda a UI.
     */

    const demoData =
        createDemoData();


    setGalleryData(
        demoData.guests,
        demoData.memories
    );

}


/* ============================================================
   SET DATA
   ============================================================ */

function setGalleryData(
    guests,
    memories
) {

    const approvedMemories =
        memories.filter(
            memory =>
                memory.status ===
                "approved"
        );


    state.guests =
        guests
            .map(
                guest => {

                    const guestMemories =
                        approvedMemories
                            .filter(
                                memory =>
                                    memory.guestId ===
                                    guest.id
                            )
                            .sort(
                                sortByDate
                            );


                    return {

                        ...guest,

                        memories:
                            guestMemories

                    };

                }
            )
            .filter(
                guest =>
                    guest.memories.length >
                    0
            );


    state.filteredGuests =
        [...state.guests];


    /*
     * Featured:
     *
     * somente:
     * - approved
     * - featured
     * - image
     */

    state.featured =
        approvedMemories
            .filter(
                memory =>
                    memory.featured ===
                        true &&
                    memory.type ===
                        "image"
            )
            .map(
                memory => {

                    const guest =
                        guests.find(
                            item =>
                                item.id ===
                                memory.guestId
                        );


                    return {

                        ...memory,

                        guest:
                            guest || null

                    };

                }
            )
            .sort(
                sortByDate
            );


    state.featuredVisible =
        CONFIG.featuredInitial;


    renderStories();

    renderFeatured();

}


/* ============================================================
   REGISTER EVENTS
   ============================================================ */

function registerEvents() {

    /* SEARCH */

    el.guestSearch
        ?.addEventListener(
            "input",
            handleSearch
        );


    el.guestSearchClear
        ?.addEventListener(
            "click",
            clearSearch
        );


    /* STORIES CAROUSEL */

    el.storiesPrevious
        ?.addEventListener(
            "click",
            () => {

                scrollStories(
                    -CONFIG.scrollAmount
                );

            }
        );


    el.storiesNext
        ?.addEventListener(
            "click",
            () => {

                scrollStories(
                    CONFIG.scrollAmount
                );

            }
        );


    el.storiesViewport
        ?.addEventListener(
            "scroll",
            updateStoriesScrollUI,
            {
                passive: true
            }
        );


    el.storiesTrack
        ?.addEventListener(
            "click",
            handleStoryProfileClick
        );


    /* FEATURED */

    el.featuredGrid
        ?.addEventListener(
            "click",
            handleFeaturedClick
        );


    el.featuredMore
        ?.addEventListener(
            "click",
            showMoreFeatured
        );


    /* STORY VIEWER */

    el.storyClose.forEach(
        button => {

            button.addEventListener(
                "click",
                closeStoryViewer
            );

        }
    );


    el.storyPrevious
        ?.addEventListener(
            "click",
            previousStory
        );


    el.storyNext
        ?.addEventListener(
            "click",
            nextStory
        );


    el.storyVideo
        ?.addEventListener(
            "ended",
            nextStory
        );


    el.storyVideo
        ?.addEventListener(
            "loadedmetadata",
            startVideoProgress
        );


    el.storyImage
        ?.addEventListener(
            "load",
            hideStoryLoading
        );


    el.storyVideo
        ?.addEventListener(
            "canplay",
            hideStoryLoading
        );


    /* FEATURED LIGHTBOX */

    el.featuredClose.forEach(
        button => {

            button.addEventListener(
                "click",
                closeFeaturedLightbox
            );

        }
    );


    el.featuredPrevious
        ?.addEventListener(
            "click",
            previousFeatured
        );


    el.featuredNext
        ?.addEventListener(
            "click",
            nextFeatured
        );


    /* KEYBOARD */

    document.addEventListener(
        "keydown",
        handleKeyboard
    );


    /* RESIZE */

    window.addEventListener(
        "resize",
        updateStoriesScrollUI
    );

}


/* ============================================================
   RENDER STORIES
   ============================================================ */

function renderStories() {

    if (!el.storiesTrack) {
        return;
    }


    el.storiesTrack.innerHTML =
        "";


    const guests =
        state.filteredGuests;


    el.guestTotal.textContent =
        String(
            state.guests.length
        ).padStart(
            2,
            "0"
        );


    /*
     * Sem histórias no total.
     */

    if (
        state.guests.length ===
        0
    ) {

        el.storiesEmpty.hidden =
            false;


        el.storiesSearchEmpty.hidden =
            true;


        updateStoriesScrollUI();

        return;

    }


    el.storiesEmpty.hidden =
        true;


    /*
     * Pesquisa sem resultado.
     */

    if (
        guests.length ===
        0
    ) {

        el.storiesSearchEmpty.hidden =
            false;


        updateStoriesScrollUI();

        return;

    }


    el.storiesSearchEmpty.hidden =
        true;


    guests.forEach(
        guest => {

            el.storiesTrack.appendChild(
                createStoryProfile(
                    guest
                )
            );

        }
    );


    requestAnimationFrame(
        updateStoriesScrollUI
    );

}


/* ============================================================
   CREATE STORY PROFILE
   ============================================================ */

function createStoryProfile(
    guest
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "guest-story-profile";


    button.dataset.storyGuest =
        guest.id;


    button.setAttribute(
        "role",
        "listitem"
    );


    button.setAttribute(
        "aria-label",
        `Ver recuerdos de ${guest.name}`
    );


    /* RING */

    const ring =
        document.createElement(
            "span"
        );


    ring.className =
        "guest-story-profile__ring";


    /* AVATAR */

    const avatar =
        document.createElement(
            "span"
        );


    avatar.className =
        "guest-story-profile__avatar";


    if (
        guest.avatarUrl
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            guest.avatarUrl;


        image.alt =
            `Foto de ${guest.name}`;


        avatar.appendChild(
            image
        );

    } else {

        const fallback =
            document.createElement(
                "span"
            );


        fallback.className =
            "guest-story-profile__fallback";


        fallback.innerHTML =
            createSilhouette();


        avatar.appendChild(
            fallback
        );

    }


    ring.appendChild(
        avatar
    );


    /* COUNT */

    const count =
        document.createElement(
            "span"
        );


    count.className =
        "guest-story-profile__count";


    count.textContent =
        guest.memories.length;


    ring.appendChild(
        count
    );


    /* NAME */

    const name =
        document.createElement(
            "span"
        );


    name.className =
        "guest-story-profile__name";


    name.textContent =
        guest.name;


    button.append(
        ring,
        name
    );


    return button;

}


/* ============================================================
   SEARCH
   ============================================================ */

function handleSearch(event) {

    const value =
        normalizeText(
            event.target.value
        );


    el.guestSearchClear.hidden =
        value.length === 0;


    if (!value) {

        state.filteredGuests =
            [...state.guests];

    } else {

        state.filteredGuests =
            state.guests.filter(
                guest =>

                    normalizeText(
                        guest.name
                    )
                    .includes(
                        value
                    )

            );

    }


    renderStories();

}


/* ============================================================
   CLEAR SEARCH
   ============================================================ */

function clearSearch() {

    el.guestSearch.value =
        "";


    el.guestSearchClear.hidden =
        true;


    state.filteredGuests =
        [...state.guests];


    renderStories();


    el.guestSearch.focus();

}


/* ============================================================
   STORIES SCROLL
   ============================================================ */

function scrollStories(amount) {

    el.storiesViewport
        ?.scrollBy({

            left:
                amount,

            behavior:
                "smooth"

        });

}


/* ============================================================
   STORIES SCROLL UI
   ============================================================ */

function updateStoriesScrollUI() {

    if (
        !el.storiesViewport
    ) {
        return;
    }


    const viewport =
        el.storiesViewport;


    const maxScroll =
        Math.max(
            0,

            viewport.scrollWidth -
            viewport.clientWidth
        );


    const current =
        viewport.scrollLeft;


    /*
     * BUTTONS
     */

    if (
        el.storiesPrevious
    ) {

        el.storiesPrevious.disabled =
            current <= 5;

    }


    if (
        el.storiesNext
    ) {

        el.storiesNext.disabled =
            maxScroll <= 5 ||
            current >=
                maxScroll - 5;

    }


    /*
     * PROGRESS
     */

    if (
        el.storiesProgress
    ) {

        const progress =
            maxScroll <= 0
                ? 100
                : (
                    current /
                    maxScroll
                ) * 100;


        el.storiesProgress.style.width =
            `${Math.max(
                8,
                progress
            )}%`;

    }

}


/* ============================================================
   STORY PROFILE CLICK
   ============================================================ */

function handleStoryProfileClick(
    event
) {

    const button =
        event.target.closest(
            "[data-story-guest]"
        );


    if (!button) {
        return;
    }


    const guestId =
        button.dataset
            .storyGuest;


    const index =
        state.guests.findIndex(
            guest =>
                guest.id ===
                guestId
        );


    if (
        index === -1
    ) {
        return;
    }


    openStoryViewer(
        index,
        0
    );

}


/* ============================================================
   OPEN STORY VIEWER
   ============================================================ */

function openStoryViewer(
    guestIndex,
    memoryIndex = 0
) {

    const guest =
        state.guests[
            guestIndex
        ];


    if (
        !guest ||
        !guest.memories.length
    ) {
        return;
    }


    state.storyGuestIndex =
        guestIndex;


    state.storyMemoryIndex =
        clamp(
            memoryIndex,
            0,
            guest.memories.length - 1
        );


    renderStory();


    openModal(
        el.storyViewer
    );

}


/* ============================================================
   RENDER STORY
   ============================================================ */

function renderStory() {

    stopStoryTimers();


    const guest =
        getCurrentStoryGuest();


    const memory =
        getCurrentStoryMemory();


    if (
        !guest ||
        !memory
    ) {

        closeStoryViewer();

        return;

    }


    /* PROFILE */

    el.storyName.textContent =
        guest.name;


    if (
        guest.bio
    ) {

        el.storyBio.textContent =
            guest.bio;


        el.storyBio.hidden =
            false;

    } else {

        el.storyBio.textContent =
            "";


        el.storyBio.hidden =
            true;

    }


    renderAvatar(
        guest,

        el.storyAvatar,

        el.storyAvatarFallback
    );


    /* COUNTER */

    el.storyCounter.textContent =
        `${state.storyMemoryIndex + 1} / ${guest.memories.length}`;


    /* PROGRESS */

    renderStoryProgress(
        guest.memories.length
    );


    /* RESET MEDIA */

    showStoryLoading();


    el.storyImage.hidden =
        true;


    el.storyVideo.hidden =
        true;


    el.storyVideo.pause();


    el.storyVideo.removeAttribute(
        "src"
    );


    el.storyImage.removeAttribute(
        "src"
    );


    /*
     * IMAGE
     */

    if (
        memory.type ===
        "image"
    ) {

        el.storyImage.src =
            memory.originalUrl;


        el.storyImage.alt =
            `Recuerdo compartido por ${guest.name}`;


        el.storyImage.hidden =
            false;


        startImageStoryTimer();

    }


    /*
     * VIDEO
     */

    if (
        memory.type ===
        "video"
    ) {

        el.storyVideo.src =
            memory.originalUrl;


        el.storyVideo.hidden =
            false;


        el.storyVideo.currentTime =
            0;


        const playPromise =
            el.storyVideo.play();


        if (
            playPromise &&
            typeof playPromise.catch ===
                "function"
        ) {

            playPromise.catch(
                () => {

                    /*
                     * Alguns navegadores bloqueiam
                     * autoplay com som.
                     *
                     * O usuário pode pressionar play.
                     */

                }
            );

        }

    }

}


/* ============================================================
   STORY PROGRESS DOM
   ============================================================ */

function renderStoryProgress(
    total
) {

    el.storyProgress.innerHTML =
        "";


    for (
        let index = 0;
        index < total;
        index++
    ) {

        const segment =
            document.createElement(
                "span"
            );


        segment.className =
            "story-viewer__progress-segment";


        if (
            index <
            state.storyMemoryIndex
        ) {

            segment.classList.add(
                "is-complete"
            );

        }


        if (
            index ===
            state.storyMemoryIndex
        ) {

            segment.classList.add(
                "is-active"
            );

        }


        const fill =
            document.createElement(
                "span"
            );


        segment.appendChild(
            fill
        );


        el.storyProgress.appendChild(
            segment
        );

    }

}


/* ============================================================
   IMAGE STORY TIMER
   ============================================================ */

function startImageStoryTimer() {

    state.storyStartedAt =
        performance.now();


    state.storyElapsed =
        0;


    const tick =
        now => {

            const elapsed =
                now -
                state.storyStartedAt;


            const progress =
                clamp(

                    elapsed /
                    CONFIG.imageStoryDuration,

                    0,
                    1

                );


            updateActiveStoryProgress(
                progress
            );


            if (
                progress >= 1
            ) {

                nextStory();

                return;

            }


            state.storyAnimationFrame =
                requestAnimationFrame(
                    tick
                );

        };


    state.storyAnimationFrame =
        requestAnimationFrame(
            tick
        );

}


/* ============================================================
   VIDEO STORY PROGRESS
   ============================================================ */

function startVideoProgress() {

    const memory =
        getCurrentStoryMemory();


    if (
        !memory ||
        memory.type !==
            "video"
    ) {
        return;
    }


    cancelAnimationFrame(
        state.storyAnimationFrame
    );


    const tick =
        () => {

            if (
                !el.storyVideo ||
                el.storyVideo.hidden
            ) {
                return;
            }


            const duration =
                el.storyVideo.duration;


            if (
                Number.isFinite(
                    duration
                ) &&
                duration > 0
            ) {

                updateActiveStoryProgress(

                    clamp(

                        el.storyVideo
                            .currentTime /
                        duration,

                        0,
                        1

                    )

                );

            }


            state.storyAnimationFrame =
                requestAnimationFrame(
                    tick
                );

        };


    state.storyAnimationFrame =
        requestAnimationFrame(
            tick
        );

}


/* ============================================================
   UPDATE ACTIVE PROGRESS
   ============================================================ */

function updateActiveStoryProgress(
    value
) {

    const active =
        el.storyProgress
            ?.querySelector(
                ".story-viewer__progress-segment.is-active"
            );


    if (!active) {
        return;
    }


    active.style.setProperty(
        "--story-progress",
        value
    );

}


/* ============================================================
   NEXT STORY
   ============================================================ */

function nextStory() {

    stopStoryTimers();


    const guest =
        getCurrentStoryGuest();


    if (!guest) {
        return;
    }


    /*
     * Próxima memória do mesmo convidado.
     */

    if (
        state.storyMemoryIndex <
        guest.memories.length - 1
    ) {

        state.storyMemoryIndex++;

        renderStory();

        return;

    }


    /*
     * Terminou convidado.
     * Vai para próximo convidado.
     */

    if (
        state.storyGuestIndex <
        state.guests.length - 1
    ) {

        state.storyGuestIndex++;

        state.storyMemoryIndex =
            0;


        renderStory();

        return;

    }


    /*
     * Terminou tudo.
     */

    closeStoryViewer();

}


/* ============================================================
   PREVIOUS STORY
   ============================================================ */

function previousStory() {

    stopStoryTimers();


    /*
     * Anterior do mesmo convidado.
     */

    if (
        state.storyMemoryIndex >
        0
    ) {

        state.storyMemoryIndex--;

        renderStory();

        return;

    }


    /*
     * Convidado anterior.
     */

    if (
        state.storyGuestIndex >
        0
    ) {

        state.storyGuestIndex--;


        const guest =
            getCurrentStoryGuest();


        state.storyMemoryIndex =
            Math.max(
                0,
                guest.memories.length - 1
            );


        renderStory();

    }

}


/* ============================================================
   CURRENT STORY
   ============================================================ */

function getCurrentStoryGuest() {

    return (
        state.guests[
            state.storyGuestIndex
        ] ||
        null
    );

}


function getCurrentStoryMemory() {

    const guest =
        getCurrentStoryGuest();


    if (!guest) {
        return null;
    }


    return (
        guest.memories[
            state.storyMemoryIndex
        ] ||
        null
    );

}


/* ============================================================
   STORY LOADING
   ============================================================ */

function showStoryLoading() {

    if (
        el.storyLoading
    ) {

        el.storyLoading.hidden =
            false;

    }

}


function hideStoryLoading() {

    if (
        el.storyLoading
    ) {

        el.storyLoading.hidden =
            true;

    }

}


/* ============================================================
   STOP STORY TIMERS
   ============================================================ */

function stopStoryTimers() {

    clearTimeout(
        state.storyTimer
    );


    cancelAnimationFrame(
        state.storyAnimationFrame
    );


    state.storyTimer =
        null;


    state.storyAnimationFrame =
        null;

}


/* ============================================================
   CLOSE STORY
   ============================================================ */

function closeStoryViewer() {

    stopStoryTimers();


    if (
        el.storyVideo
    ) {

        el.storyVideo.pause();

    }


    closeModal(
        el.storyViewer
    );

}


/* ============================================================
   RENDER FEATURED
   ============================================================ */

function renderFeatured() {

    if (
        !el.featuredGrid
    ) {
        return;
    }


    el.featuredGrid.innerHTML =
        "";


    /*
     * EMPTY
     */

    if (
        state.featured.length ===
        0
    ) {

        el.featuredEmpty.hidden =
            false;


        el.featuredMoreWrapper.hidden =
            true;


        return;

    }


    el.featuredEmpty.hidden =
        true;


    const visible =
        state.featured.slice(
            0,
            state.featuredVisible
        );


    visible.forEach(
        (memory, index) => {

            el.featuredGrid
                .appendChild(

                    createFeaturedCard(
                        memory,
                        index
                    )

                );

        }
    );


    el.featuredMoreWrapper.hidden =
        state.featuredVisible >=
        state.featured.length;

}


/* ============================================================
   FEATURED CARD
   ============================================================ */

function createFeaturedCard(
    memory,
    index
) {

    const guest =
        memory.guest;


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "guest-featured-card";


    button.dataset.featuredIndex =
        index;


    button.setAttribute(
        "aria-label",
        guest
            ? `Abrir fotografía de ${guest.name}`
            : "Abrir fotografía"
    );


    /*
     * IMAGE
     */

    const image =
        document.createElement(
            "img"
        );


    image.src =
        memory.originalUrl;


    image.alt =
        guest
            ? `Fotografía compartida por ${guest.name}`
            : "Fotografía de invitado";


    image.loading =
        "lazy";


    applyCrop(
        image,
        memory.crop
    );


    button.appendChild(
        image
    );


    /*
     * INFO
     */

    const info =
        document.createElement(
            "span"
        );


    info.className =
        "guest-featured-card__info";


    /*
     * GUEST
     */

    const guestBox =
        document.createElement(
            "span"
        );


    guestBox.className =
        "guest-featured-card__guest";


    const avatar =
        document.createElement(
            "span"
        );


    avatar.className =
        "guest-featured-card__avatar";


    if (
        guest?.avatarUrl
    ) {

        const avatarImage =
            document.createElement(
                "img"
            );


        avatarImage.src =
            guest.avatarUrl;


        avatarImage.alt =
            "";


        avatar.appendChild(
            avatarImage
        );

    } else {

        const fallback =
            document.createElement(
                "span"
            );


        fallback.className =
            "guest-featured-card__avatar-fallback";


        fallback.textContent =
            getInitials(
                guest?.name
            );


        avatar.appendChild(
            fallback
        );

    }


    const name =
        document.createElement(
            "span"
        );


    name.className =
        "guest-featured-card__name";


    name.textContent =
        guest?.name ||
        "Invitado";


    guestBox.append(
        avatar,
        name
    );


    /*
     * OPEN ICON
     */

    const open =
        document.createElement(
            "span"
        );


    open.className =
        "guest-featured-card__open";


    open.innerHTML = `
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M8 16 16 8"></path>
            <path d="M9 8h7v7"></path>
        </svg>
    `;


    info.append(
        guestBox,
        open
    );


    button.appendChild(
        info
    );


    return button;

}


/* ============================================================
   APPLY CROP
   ============================================================ */

function applyCrop(
    image,
    crop
) {

    if (!crop) {

        image.style.objectFit =
            "cover";


        image.style.objectPosition =
            "50% 50%";


        return;

    }


    /*
     * IMPORTANTE:
     *
     * Isso só afeta a miniatura quadrada.
     *
     * originalUrl continua intacto.
     */

    const x =
        clamp(
            50 +
            (
                crop.x || 0
            ) *
            100,
            0,
            100
        );


    const y =
        clamp(
            50 +
            (
                crop.y || 0
            ) *
            100,
            0,
            100
        );


    image.style.objectFit =
        "cover";


    image.style.objectPosition =
        `${x}% ${y}%`;


    image.style.transform =
        `scale(${crop.zoom || 1})`;

}


/* ============================================================
   FEATURED CLICK
   ============================================================ */

function handleFeaturedClick(
    event
) {

    const card =
        event.target.closest(
            "[data-featured-index]"
        );


    if (!card) {
        return;
    }


    const index =
        Number(
            card.dataset
                .featuredIndex
        );


    if (
        !Number.isInteger(
            index
        )
    ) {
        return;
    }


    openFeaturedLightbox(
        index
    );

}


/* ============================================================
   SHOW MORE FEATURED
   ============================================================ */

function showMoreFeatured() {

    state.featuredVisible =
        Math.min(

            state.featured.length,

            state.featuredVisible +
            CONFIG.featuredStep

        );


    renderFeatured();

}


/* ============================================================
   OPEN FEATURED LIGHTBOX
   ============================================================ */

function openFeaturedLightbox(
    index
) {

    if (
        !state.featured.length
    ) {
        return;
    }


    state.featuredIndex =
        clamp(
            index,
            0,
            state.featured.length - 1
        );


    renderFeaturedLightbox();


    openModal(
        el.featuredLightbox
    );

}


/* ============================================================
   RENDER FEATURED LIGHTBOX
   ============================================================ */

function renderFeaturedLightbox() {

    const memory =
        state.featured[
            state.featuredIndex
        ];


    if (!memory) {
        return;
    }


    const guest =
        memory.guest;


    /*
     * ORIGINAL
     *
     * Sem crop.
     * Sem scale.
     * Sem object-position.
     */

    el.featuredLightboxImage.src =
        memory.originalUrl;


    el.featuredLightboxImage.alt =
        guest
            ? `Fotografía original compartida por ${guest.name}`
            : "Fotografía original de invitado";


    el.featuredLightboxName.textContent =
        guest?.name ||
        "Invitado";


    renderAvatar(
        guest,

        el.featuredLightboxAvatar,

        el.featuredLightboxAvatarFallback,

        true
    );


    el.featuredLightboxCounter.textContent =
        `${String(
            state.featuredIndex + 1
        ).padStart(
            2,
            "0"
        )} / ${String(
            state.featured.length
        ).padStart(
            2,
            "0"
        )}`;


    /*
     * Navegação circular.
     *
     * Sempre disponível se houver
     * mais de uma foto.
     */

    const multiple =
        state.featured.length > 1;


    el.featuredPrevious.hidden =
        !multiple;


    el.featuredNext.hidden =
        !multiple;

}


/* ============================================================
   NEXT FEATURED
   ============================================================ */

function nextFeatured() {

    if (
        state.featured.length <=
        1
    ) {
        return;
    }


    state.featuredIndex =
        (
            state.featuredIndex +
            1
        ) %
        state.featured.length;


    renderFeaturedLightbox();

}


/* ============================================================
   PREVIOUS FEATURED
   ============================================================ */

function previousFeatured() {

    if (
        state.featured.length <=
        1
    ) {
        return;
    }


    state.featuredIndex =
        (
            state.featuredIndex -
            1 +
            state.featured.length
        ) %
        state.featured.length;


    renderFeaturedLightbox();

}


/* ============================================================
   CLOSE FEATURED LIGHTBOX
   ============================================================ */

function closeFeaturedLightbox() {

    closeModal(
        el.featuredLightbox
    );

}


/* ============================================================
   AVATAR RENDERER
   ============================================================ */

function renderAvatar(
    guest,
    image,
    fallback,
    initialsFallback = false
) {

    if (
        !image ||
        !fallback
    ) {
        return;
    }


    if (
        guest?.avatarUrl
    ) {

        image.src =
            guest.avatarUrl;


        image.alt =
            guest.name
                ? `Foto de ${guest.name}`
                : "";


        image.hidden =
            false;


        fallback.hidden =
            true;


        return;

    }


    image.removeAttribute(
        "src"
    );


    image.hidden =
        true;


    fallback.hidden =
        false;


    if (
        initialsFallback
    ) {

        const span =
            fallback.querySelector(
                "span"
            );


        if (span) {

            span.textContent =
                getInitials(
                    guest?.name
                );

        }

    }

}


/* ============================================================
   MODALS
   ============================================================ */

function openModal(modal) {

    if (!modal) {
        return;
    }


    modal.hidden =
        false;


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body
        .classList
        .add(
            "guest-gallery-modal-open"
        );


    requestAnimationFrame(
        () => {

            modal.classList.add(
                "is-open"
            );


            requestAnimationFrame(
                () => {

                    modal.classList.add(
                        "is-visible"
                    );

                }
            );

        }
    );

}


/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeModal(modal) {

    if (
        !modal ||
        modal.hidden
    ) {
        return;
    }


    modal.classList.remove(
        "is-visible"
    );


    setTimeout(
        () => {

            modal.classList.remove(
                "is-open"
            );


            modal.hidden =
                true;


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            updateBodyModalState();

        },
        400
    );

}


/* ============================================================
   BODY MODAL STATE
   ============================================================ */

function updateBodyModalState() {

    const open =
        el.root.querySelector(
            ".story-viewer.is-open, .featured-lightbox.is-open"
        );


    if (!open) {

        document.body
            .classList
            .remove(
                "guest-gallery-modal-open"
            );

    }

}


/* ============================================================
   KEYBOARD
   ============================================================ */

function handleKeyboard(event) {

    /*
     * STORY VIEWER
     */

    if (
        el.storyViewer &&
        !el.storyViewer.hidden
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeStoryViewer();

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextStory();

            return;

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousStory();

            return;

        }

    }


    /*
     * FEATURED LIGHTBOX
     */

    if (
        el.featuredLightbox &&
        !el.featuredLightbox.hidden
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeFeaturedLightbox();

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextFeatured();

            return;

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousFeatured();

        }

    }

}


/* ============================================================
   HELPERS
   ============================================================ */

function clamp(
    value,
    min,
    max
) {

    return Math.min(

        Math.max(
            value,
            min
        ),

        max

    );

}


/* ============================================================
   NORMALIZE SEARCH
   ============================================================ */

function normalizeText(value) {

    return String(
        value || ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* ============================================================
   INITIALS
   ============================================================ */

function getInitials(name) {

    if (!name) {
        return "SJ";
    }


    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(
            word =>
                word[0]
                    ?.toUpperCase() ||
                ""
        )
        .join("");

}


/* ============================================================
   SORT DATE
   ============================================================ */

function sortByDate(
    a,
    b
) {

    return (
        new Date(
            a.createdAt
        ).getTime() -

        new Date(
            b.createdAt
        ).getTime()
    );

}


/* ============================================================
   SILHOUETTE
   ============================================================ */

function createSilhouette() {

    return `
        <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
        >
            <circle
                cx="32"
                cy="23"
                r="11"
            ></circle>

            <path
                d="
                    M12 56
                    C14 43
                    22 37
                    32 37
                    C42 37
                    50 43
                    52 56
                "
            ></path>
        </svg>
    `;

}


/* ============================================================
   DEMO DATA
   ============================================================ */

function createDemoData() {

    /*
     * Estes dados existem SOMENTE para
     * vermos a interface funcionando
     * antes do Supabase.
     *
     * As imagens usam caminhos do próprio
     * projeto.
     *
     * IMPORTANTE:
     *
     * Troque os caminhos abaixo caso suas
     * fotos estejam em outra pasta.
     */


    const guests = [

        {
            id:
                "guest-demo-1",

            name:
                "María",

            bio:
                "Amiga de los novios",

            avatarUrl:
                null
        },


        {
            id:
                "guest-demo-2",

            name:
                "Daniel",

            bio:
                "Un día para recordar",

            avatarUrl:
                null
        },


        {
            id:
                "guest-demo-3",

            name:
                "Laura",

            bio:
                "",

            avatarUrl:
                null
        },


        {
            id:
                "guest-demo-4",

            name:
                "José",

            bio:
                "Familia",

            avatarUrl:
                null
        }

    ];


    /*
     * Para o protótipo usamos imagens
     * remotas apenas como placeholder
     * visual.
     *
     * Quando Supabase entrar, originalUrl
     * será a URL real do Storage.
     */

    const memories = [

        {
            id:
                "memory-demo-1",

            guestId:
                "guest-demo-1",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0,
                y: 0,
                zoom: 1
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T16:10:00"
        },


        {
            id:
                "memory-demo-2",

            guestId:
                "guest-demo-1",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0.05,
                y: 0,
                zoom: 1.05
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T17:20:00"
        },


        {
            id:
                "memory-demo-3",

            guestId:
                "guest-demo-1",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: -0.04,
                y: 0.02,
                zoom: 1.08
            },

            status:
                "approved",

            featured:
                false,

            createdAt:
                "2027-01-09T18:10:00"
        },


        {
            id:
                "memory-demo-4",

            guestId:
                "guest-demo-2",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0,
                y: -0.04,
                zoom: 1.06
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T18:30:00"
        },


        {
            id:
                "memory-demo-5",

            guestId:
                "guest-demo-2",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0,
                y: 0,
                zoom: 1
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T19:15:00"
        },


        {
            id:
                "memory-demo-6",

            guestId:
                "guest-demo-3",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0.04,
                y: 0,
                zoom: 1.1
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T19:45:00"
        },


        {
            id:
                "memory-demo-7",

            guestId:
                "guest-demo-3",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0,
                y: 0.03,
                zoom: 1
            },

            status:
                "approved",

            featured:
                false,

            createdAt:
                "2027-01-09T20:15:00"
        },


        {
            id:
                "memory-demo-8",

            guestId:
                "guest-demo-4",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: -0.03,
                y: 0,
                zoom: 1.04
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T20:40:00"
        },


        {
            id:
                "memory-demo-9",

            guestId:
                "guest-demo-4",

            type:
                "image",

            originalUrl:
                "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=85",

            crop: {
                x: 0,
                y: 0,
                zoom: 1
            },

            status:
                "approved",

            featured:
                true,

            createdAt:
                "2027-01-09T21:10:00"
        }

    ];


    return {

        guests,

        memories

    };

}


/* ============================================================
   DEVELOPMENT API
   ============================================================ */

/*
 * Isto facilita a conexão com Supabase
 * no próximo passo.
 *
 * Exemplo:
 *
 * window.weddingGuestsGallery.setData(
 *     guests,
 *     memories
 * );
 */

window.weddingGuestsGallery = {

    setData(
        guests,
        memories
    ) {

        setGalleryData(
            guests,
            memories
        );

    },


    getState() {

        return {

            guests:
                state.guests,

            featured:
                state.featured

        };

    }

};