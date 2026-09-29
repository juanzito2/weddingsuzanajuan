/* ============================================================
   ADMIN DASHBOARD — SUZANA & JUAN
   ============================================================ */

import {
    verifyAdminSession,
    logoutAdmin,
    getAdminData,
    calculateAdminStats,
    approveMemory,
    setMemoryFeatured,
    unpublishMemory,
    discardMemory
} from "./scripts/services/adminService.js";


/* ============================================================
   STATE
   ============================================================ */

const state = {
    guests: [],
    memories: [],

    view: "pending",
    search: "",

    selectedMemoryId: null,

    loading: false,
    actionRunning: false
};


/* ============================================================
   ELEMENTS
   ============================================================ */

const elements = {

    guard:
        document.querySelector(
            "[data-admin-guard]"
        ),

    app:
        document.querySelector(
            "[data-admin-app]"
        ),

    sidebar:
        document.querySelector(
            ".admin-sidebar"
        ),

    menu:
        document.querySelector(
            "[data-admin-menu]"
        ),

    logout:
        document.querySelector(
            "[data-admin-logout]"
        ),

    refresh:
        document.querySelector(
            "[data-admin-refresh]"
        ),

    search:
        document.querySelector(
            "[data-admin-search]"
        ),

    navItems:
        [
            ...document.querySelectorAll(
                "[data-admin-view]"
            )
        ],

    viewTitle:
        document.querySelector(
            "[data-view-title]"
        ),

    pendingNavCount:
        document.querySelector(
            "[data-pending-nav-count]"
        ),

    statPending:
        document.querySelector(
            "[data-stat-pending]"
        ),

    statApproved:
        document.querySelector(
            "[data-stat-approved]"
        ),

    statFeatured:
        document.querySelector(
            "[data-stat-featured]"
        ),

    statGuests:
        document.querySelector(
            "[data-stat-guests]"
        ),

    resultsCount:
        document.querySelector(
            "[data-results-count]"
        ),

    loading:
        document.querySelector(
            "[data-admin-loading]"
        ),

    error:
        document.querySelector(
            "[data-admin-error]"
        ),

    errorMessage:
        document.querySelector(
            "[data-admin-error-message]"
        ),

    retry:
        document.querySelector(
            "[data-admin-error-retry]"
        ),

    empty:
        document.querySelector(
            "[data-admin-empty]"
        ),

    emptyTitle:
        document.querySelector(
            "[data-empty-title]"
        ),

    emptyMessage:
        document.querySelector(
            "[data-empty-message]"
        ),

    memories:
        document.querySelector(
            "[data-admin-memories]"
        ),

    memoriesGrid:
        document.querySelector(
            "[data-admin-memories-grid]"
        ),

    guests:
        document.querySelector(
            "[data-admin-guests]"
        ),

    guestsGrid:
        document.querySelector(
            "[data-admin-guests-grid]"
        ),

    modal:
        document.querySelector(
            "[data-memory-modal]"
        ),

    modalClose:
        [
            ...document.querySelectorAll(
                "[data-close-memory-modal]"
            )
        ],

    modalStatus:
        document.querySelector(
            "[data-memory-status]"
        ),

    modalGuestName:
        document.querySelector(
            "[data-memory-guest-name]"
        ),

    modalDate:
        document.querySelector(
            "[data-memory-date]"
        ),

    modalAvatar:
        document.querySelector(
            "[data-memory-guest-avatar]"
        ),

    modalAvatarFallback:
        document.querySelector(
            "[data-memory-guest-fallback]"
        ),

    originalPreview:
        document.querySelector(
            "[data-original-preview]"
        ),

    publicPreviewContainer:
        document.querySelector(
            "[data-public-preview-container]"
        ),

    publicPreview:
        document.querySelector(
            "[data-public-preview]"
        ),

    openOriginal:
        document.querySelector(
            "[data-open-original]"
        ),

    featuredControl:
        document.querySelector(
            "[data-featured-control]"
        ),

    featured:
        document.querySelector(
            "[data-admin-featured]"
        ),

    approve:
        document.querySelector(
            "[data-admin-approve]"
        ),

    discard:
        document.querySelector(
            "[data-admin-discard]"
        ),

    lightbox:
        document.querySelector(
            "[data-admin-lightbox]"
        ),

    lightboxImage:
        document.querySelector(
            "[data-admin-lightbox-image]"
        ),

    lightboxVideo:
        document.querySelector(
            "[data-admin-lightbox-video]"
        ),

    lightboxClose:
        [
            ...document.querySelectorAll(
                "[data-close-admin-lightbox]"
            )
        ],

    confirm:
        document.querySelector(
            "[data-admin-confirm]"
        ),

    cancelConfirm:
        [
            ...document.querySelectorAll(
                "[data-cancel-admin-confirm]"
            )
        ],

    confirmDelete:
        document.querySelector(
            "[data-confirm-admin-delete]"
        ),

    toast:
        document.querySelector(
            "[data-admin-toast]"
        ),

    toastTitle:
        document.querySelector(
            "[data-admin-toast-title]"
        ),

    toastMessage:
        document.querySelector(
            "[data-admin-toast-message]"
        )
};


/* ============================================================
   INIT
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initAdmin
);


async function initAdmin() {

    /*
     * Nada do dashboard é carregado antes
     * da verificação administrativa.
     */

    try {

        const auth =
            await verifyAdminSession();


        if (!auth.authorized) {

            window.location.replace(
                "./admin-login.html"
            );

            return;

        }


        bindEvents();


        elements.guard.hidden =
            true;


        elements.app.hidden =
            false;


        await loadAdminData();

    }
    catch (error) {

        console.error(
            "Admin authorization failed:",
            error
        );


        /*
         * Fail closed:
         *
         * se não conseguimos provar que é admin,
         * não mostramos o painel.
         */

        window.location.replace(
            "./admin-login.html"
        );

    }

}


/* ============================================================
   EVENTS
   ============================================================ */

function bindEvents() {

    elements.navItems.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    changeView(
                        button.dataset.adminView
                    );

                }
            );

        }
    );


    elements.search?.addEventListener(
        "input",
        event => {

            state.search =
                event.target.value
                    .trim()
                    .toLowerCase();

            renderCurrentView();

        }
    );


    elements.refresh?.addEventListener(
        "click",
        async () => {

            await loadAdminData();

        }
    );


    elements.retry?.addEventListener(
        "click",
        async () => {

            await loadAdminData();

        }
    );


    elements.logout?.addEventListener(
        "click",
        handleLogout
    );


    elements.menu?.addEventListener(
        "click",
        () => {

            elements.sidebar
                ?.classList
                .toggle(
                    "is-open"
                );

        }
    );


    elements.modalClose.forEach(
        button => {

            button.addEventListener(
                "click",
                closeMemoryModal
            );

        }
    );


    elements.openOriginal
        ?.addEventListener(
            "click",
            openOriginalLightbox
        );


    elements.lightboxClose.forEach(
        button => {

            button.addEventListener(
                "click",
                closeLightbox
            );

        }
    );


    elements.approve
        ?.addEventListener(
            "click",
            handleApprove
        );


    elements.featured
        ?.addEventListener(
            "change",
            handleFeaturedChange
        );


    elements.discard
        ?.addEventListener(
            "click",
            openDeleteConfirmation
        );


    elements.cancelConfirm.forEach(
        button => {

            button.addEventListener(
                "click",
                closeDeleteConfirmation
            );

        }
    );


    elements.confirmDelete
        ?.addEventListener(
            "click",
            handleDiscard
        );


    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* ============================================================
   LOAD DATA
   ============================================================ */

async function loadAdminData() {

    if (state.loading) {
        return;
    }


    state.loading = true;

    showLoading();


    try {

        /*
         * Revalidamos a autorização antes
         * de solicitar dados administrativos.
         */

        const auth =
            await verifyAdminSession();


        if (!auth.authorized) {

            window.location.replace(
                "./admin-login.html"
            );

            return;

        }


        const data =
            await getAdminData();


        state.guests =
            data.guests || [];


        state.memories =
            data.memories || [];


        renderStats();

        renderCurrentView();

    }
    catch (error) {

        console.error(
            "Admin data load failed:",
            error
        );


        showError(
            "No se pudieron cargar los datos administrativos."
        );

    }
    finally {

        state.loading =
            false;

    }

}


/* ============================================================
   CHANGE VIEW
   ============================================================ */

function changeView(view) {

    if (
        ![
            "pending",
            "approved",
            "featured",
            "guests"
        ].includes(view)
    ) {
        return;
    }


    state.view =
        view;


    elements.navItems.forEach(
        button => {

            button.classList.toggle(
                "is-active",
                button.dataset.adminView ===
                    view
            );

        }
    );


    elements.sidebar
        ?.classList
        .remove(
            "is-open"
        );


    updateViewTitle();

    renderCurrentView();

}


/* ============================================================
   VIEW TITLE
   ============================================================ */

function updateViewTitle() {

    const titles = {

        pending:
            "Recuerdos pendientes",

        approved:
            "Recuerdos publicados",

        featured:
            "Fotografías destacadas",

        guests:
            "Invitados"

    };


    if (elements.viewTitle) {

        elements.viewTitle.textContent =
            titles[state.view] ||
            "Administración";

    }

}


/* ============================================================
   STATS
   ============================================================ */

function renderStats() {

    const stats =
        calculateAdminStats(
            state.guests,
            state.memories
        );


    setText(
        elements.statPending,
        stats.pending
    );


    setText(
        elements.statApproved,
        stats.approved
    );


    setText(
        elements.statFeatured,
        stats.featured
    );


    setText(
        elements.statGuests,
        stats.guests
    );


    setText(
        elements.pendingNavCount,
        stats.pending
    );

}


/* ============================================================
   RENDER CURRENT VIEW
   ============================================================ */

function renderCurrentView() {

    hideContentStates();


    if (
        state.view ===
        "guests"
    ) {

        renderGuests();

        return;

    }


    renderMemories();

}


/* ============================================================
   FILTER MEMORIES
   ============================================================ */

function getFilteredMemories() {

    let memories =
        [...state.memories];


    if (
        state.view ===
        "pending"
    ) {

        memories =
            memories.filter(
                memory =>
                    memory.status ===
                    "pending"
            );

    }


    if (
        state.view ===
        "approved"
    ) {

        memories =
            memories.filter(
                memory =>
                    memory.status ===
                    "approved"
            );

    }


    if (
        state.view ===
        "featured"
    ) {

        memories =
            memories.filter(
                memory =>
                    memory.status ===
                        "approved" &&
                    memory.featured ===
                        true
            );

    }


    if (state.search) {

        memories =
            memories.filter(
                memory => {

                    const guestName =
                        memory.guest
                            ?.name
                            ?.toLowerCase() ||
                        "";


                    const fileName =
                        memory.fileName
                            ?.toLowerCase() ||
                        "";


                    return (
                        guestName.includes(
                            state.search
                        ) ||
                        fileName.includes(
                            state.search
                        )
                    );

                }
            );

    }


    return memories;

}


/* ============================================================
   RENDER MEMORIES
   ============================================================ */

function renderMemories() {

    const memories =
        getFilteredMemories();


    setResultsCount(
        memories.length
    );


    if (
        memories.length ===
        0
    ) {

        showEmptyForCurrentView();

        return;

    }


    elements.memoriesGrid.innerHTML =
        memories
            .map(
                createMemoryCardHTML
            )
            .join("");


    elements.memories.hidden =
        false;


    bindMemoryCards();

}


/* ============================================================
   MEMORY CARD
   ============================================================ */

function createMemoryCardHTML(
    memory
) {

    const guestName =
        escapeHTML(
            memory.guest?.name ||
            "Invitado"
        );


    const statusText =
        memory.status ===
        "approved"
            ? "Publicado"
            : "Pendiente";


    const statusClass =
        memory.status ===
        "approved"
            ? "admin-memory-card__status--approved"
            : "";


    const date =
        formatDate(
            memory.createdAt
        );


    const media =
        createCardMediaHTML(
            memory
        );


    const videoLabel =
        memory.type ===
        "video"
            ? `
                <span
                    class="admin-memory-card__video"
                >
                    Vídeo
                </span>
            `
            : "";


    return `
        <article
            class="admin-memory-card"
            data-memory-card="${escapeAttribute(memory.id)}"
        >

            <div
                class="admin-memory-card__media"
            >

                ${media}

                <span
                    class="
                        admin-memory-card__status
                        ${statusClass}
                    "
                >
                    ${statusText}
                </span>

                ${videoLabel}

            </div>


            <div
                class="admin-memory-card__body"
            >

                <strong>
                    ${guestName}
                </strong>

                <small>
                    ${escapeHTML(date)}
                </small>


                <button
                    class="admin-memory-card__open"
                    type="button"
                    data-open-memory="${escapeAttribute(memory.id)}"
                >
                    Revisar
                </button>

            </div>

        </article>
    `;

}


/* ============================================================
   CARD MEDIA
   ============================================================ */

function createCardMediaHTML(
    memory
) {

    if (!memory.originalUrl) {

        return `
            <div
                style="
                    width:100%;
                    height:100%;
                    display:grid;
                    place-items:center;
                    font-family:'Cormorant Garamond',serif;
                    color:#8c7e8e;
                "
            >
                Sin vista previa
            </div>
        `;

    }


    const url =
        escapeAttribute(
            memory.originalUrl
        );


    if (
        memory.type ===
        "video"
    ) {

        return `
            <video
                src="${url}"
                preload="metadata"
                muted
                playsinline
            ></video>
        `;

    }


    return `
        <img
            src="${url}"
            alt=""
            loading="lazy"
            style="
                object-position:
                    ${memory.crop.x}%
                    ${memory.crop.y}%;

                transform:
                    scale(
                        ${memory.crop.zoom}
                    );
            "
        >
    `;

}


/* ============================================================
   BIND MEMORY CARDS
   ============================================================ */

function bindMemoryCards() {

    document
        .querySelectorAll(
            "[data-open-memory]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openMemoryModal(
                            button.dataset
                                .openMemory
                        );

                    }
                );

            }
        );

}


/* ============================================================
   GUESTS
   ============================================================ */

function renderGuests() {

    let guests =
        [...state.guests];


    if (state.search) {

        guests =
            guests.filter(
                guest => {

                    return (
                        guest.name
                            ?.toLowerCase()
                            .includes(
                                state.search
                            ) ||
                        guest.bio
                            ?.toLowerCase()
                            .includes(
                                state.search
                            )
                    );

                }
            );

    }


    setResultsCount(
        guests.length
    );


    if (
        guests.length ===
        0
    ) {

        showEmpty(
            "No hay invitados",
            state.search
                ? "No se encontraron invitados con esta búsqueda."
                : "Todavía no se ha creado ningún perfil."
        );

        return;

    }


    elements.guestsGrid.innerHTML =
        guests
            .map(
                guest => {

                    const memoriesCount =
                        state.memories.filter(
                            memory =>
                                memory.guestId ===
                                guest.id
                        ).length;


                    const avatar =
                        guest.avatarUrl
                            ? `
                                <img
                                    src="${escapeAttribute(guest.avatarUrl)}"
                                    alt=""
                                >
                            `
                            : `
                                <span>
                                    ${escapeHTML(getInitials(guest.name))}
                                </span>
                            `;


                    return `
                        <article
                            class="admin-guest-card"
                        >

                            <div
                                class="admin-guest-card__avatar"
                            >
                                ${avatar}
                            </div>

                            <div
                                class="admin-guest-card__info"
                            >

                                <strong>
                                    ${escapeHTML(guest.name)}
                                </strong>

                                <span>
                                    ${memoriesCount}
                                    ${
                                        memoriesCount === 1
                                            ? " recuerdo"
                                            : " recuerdos"
                                    }
                                </span>

                            </div>

                        </article>
                    `;

                }
            )
            .join("");


    elements.guests.hidden =
        false;

}


/* ============================================================
   OPEN MEMORY MODAL
   ============================================================ */

function openMemoryModal(
    memoryId
) {

    const memory =
        getMemory(
            memoryId
        );


    if (!memory) {
        return;
    }


    state.selectedMemoryId =
        memory.id;


    renderModal(
        memory
    );


    elements.modal.hidden =
        false;


    document.body.style.overflow =
        "hidden";

}


/* ============================================================
   RENDER MODAL
   ============================================================ */

function renderModal(
    memory
) {

    const guest =
        memory.guest;


    setText(
        elements.modalStatus,
        memory.status ===
            "approved"
            ? "Publicado"
            : "Pendiente"
    );


    setText(
        elements.modalGuestName,
        guest?.name ||
        "Invitado"
    );


    setText(
        elements.modalDate,
        formatDate(
            memory.createdAt
        )
    );


    renderModalAvatar(
        guest
    );


    renderOriginalPreview(
        memory
    );


    renderPublicPreview(
        memory
    );


    /*
     * Vídeos nunca podem ser featured.
     */

    if (
        elements.featuredControl
    ) {

        elements.featuredControl.hidden =
            memory.type !==
            "image";

    }


    if (
        elements.featured
    ) {

        elements.featured.checked =
            memory.featured ===
            true;

    }


    /*
     * Botão principal muda conforme status.
     */

    if (
        elements.approve
    ) {

        elements.approve.textContent =
            memory.status ===
            "approved"
                ? "Retirar publicación"
                : "Aprobar";

    }

}


/* ============================================================
   MODAL AVATAR
   ============================================================ */

function renderModalAvatar(
    guest
) {

    if (!elements.modalAvatar) {
        return;
    }


    elements.modalAvatar
        .querySelectorAll("img")
        .forEach(
            image =>
                image.remove()
        );


    if (
        guest?.avatarUrl
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            guest.avatarUrl;


        image.alt =
            "";


        elements.modalAvatar
            .appendChild(
                image
            );


        if (
            elements.modalAvatarFallback
        ) {

            elements.modalAvatarFallback.hidden =
                true;

        }

    }
    else {

        if (
            elements.modalAvatarFallback
        ) {

            elements.modalAvatarFallback.hidden =
                false;


            elements.modalAvatarFallback.textContent =
                getInitials(
                    guest?.name
                );

        }

    }

}


/* ============================================================
   ORIGINAL PREVIEW
   ============================================================ */

function renderOriginalPreview(
    memory
) {

    if (
        !elements.originalPreview
    ) {
        return;
    }


    elements.originalPreview.innerHTML =
        "";


    if (!memory.originalUrl) {

        elements.originalPreview.textContent =
            "Vista previa no disponible.";

        return;

    }


    if (
        memory.type ===
        "video"
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            memory.originalUrl;


        video.controls =
            true;


        video.playsInline =
            true;


        video.preload =
            "metadata";


        elements.originalPreview
            .appendChild(
                video
            );

        return;

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        memory.originalUrl;


    image.alt =
        "";


    elements.originalPreview
        .appendChild(
            image
        );

}


/* ============================================================
   PUBLIC PREVIEW
   ============================================================ */

function renderPublicPreview(
    memory
) {

    if (
        !elements.publicPreview
    ) {
        return;
    }


    elements.publicPreview.innerHTML =
        "";


    /*
     * Vídeos ficam somente em Stories.
     * Não existe recorte quadrado.
     */

    if (
        memory.type ===
        "video"
    ) {

        if (
            elements.publicPreviewContainer
        ) {

            elements.publicPreviewContainer.hidden =
                true;

        }


        return;

    }


    if (
        elements.publicPreviewContainer
    ) {

        elements.publicPreviewContainer.hidden =
            false;

    }


    if (!memory.originalUrl) {

        elements.publicPreview.textContent =
            "Vista previa no disponible.";

        return;

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        memory.originalUrl;


    image.alt =
        "";


    image.style.objectPosition =
        `${memory.crop.x}% ${memory.crop.y}%`;


    image.style.transform =
        `scale(${memory.crop.zoom})`;


    elements.publicPreview
        .appendChild(
            image
        );

}


/* ============================================================
   APPROVE / UNPUBLISH
   ============================================================ */

async function handleApprove() {

    if (state.actionRunning) {
        return;
    }


    const memory =
        getSelectedMemory();


    if (!memory) {
        return;
    }


    state.actionRunning =
        true;


    setModalActionsDisabled(
        true
    );


    try {

        if (
            memory.status ===
            "approved"
        ) {

            await unpublishMemory(
                memory.id
            );


            showToast(
                "Publicación retirada",
                "El recuerdo ha vuelto a revisión."
            );

        }
        else {

            const featured =
                memory.type ===
                    "image" &&
                elements.featured
                    ?.checked ===
                    true;


            await approveMemory(
                memory.id,
                {
                    featured,

                    crop:
                        memory.crop
                }
            );


            showToast(
                "Recuerdo aprobado",
                featured
                    ? "La fotografía también ha sido destacada."
                    : "El recuerdo ya puede aparecer en la boda."
            );

        }


        closeMemoryModal();


        await loadAdminData();

    }
    catch (error) {

        console.error(
            "Memory approval failed:",
            error
        );


        showToast(
            "No se pudo guardar",
            "Comprueba la conexión e inténtalo de nuevo."
        );

    }
    finally {

        state.actionRunning =
            false;


        setModalActionsDisabled(
            false
        );

    }

}


/* ============================================================
   FEATURED
   ============================================================ */

async function handleFeaturedChange() {

    if (state.actionRunning) {
        return;
    }


    const memory =
        getSelectedMemory();


    if (
        !memory ||
        memory.type !==
            "image"
    ) {
        return;
    }


    /*
     * Em pending, a seleção será aplicada
     * quando clicar em Aprobar.
     */

    if (
        memory.status ===
        "pending"
    ) {
        return;
    }


    state.actionRunning =
        true;


    try {

        await setMemoryFeatured(
            memory.id,
            elements.featured.checked
        );


        showToast(
            elements.featured.checked
                ? "Fotografía destacada"
                : "Destacado retirado",

            elements.featured.checked
                ? "La fotografía aparecerá en la galería destacada."
                : "La fotografía seguirá publicada en Stories."
        );


        await loadAdminData();


        const updated =
            getMemory(
                memory.id
            );


        if (updated) {

            state.selectedMemoryId =
                updated.id;

            renderModal(
                updated
            );

        }

    }
    catch (error) {

        console.error(
            "Featured update failed:",
            error
        );


        elements.featured.checked =
            memory.featured;


        showToast(
            "No se pudo guardar",
            "El cambio no ha sido aplicado."
        );

    }
    finally {

        state.actionRunning =
            false;

    }

}


/* ============================================================
   DELETE CONFIRMATION
   ============================================================ */

function openDeleteConfirmation() {

    if (
        !getSelectedMemory()
    ) {
        return;
    }


    elements.confirm.hidden =
        false;

}


function closeDeleteConfirmation() {

    elements.confirm.hidden =
        true;

}


/* ============================================================
   DISCARD
   ============================================================ */

async function handleDiscard() {

    if (state.actionRunning) {
        return;
    }


    const memory =
        getSelectedMemory();


    if (!memory) {
        return;
    }


    state.actionRunning =
        true;


    elements.confirmDelete.disabled =
        true;


    try {

        await discardMemory(
            memory.id
        );


        closeDeleteConfirmation();

        closeMemoryModal();


        showToast(
            "Recuerdo eliminado",
            "El archivo ha sido descartado definitivamente."
        );


        await loadAdminData();

    }
    catch (error) {

        console.error(
            "Memory deletion failed:",
            error
        );


        showToast(
            "No se pudo eliminar",
            error?.message ||
            "Inténtalo de nuevo."
        );

    }
    finally {

        state.actionRunning =
            false;


        elements.confirmDelete.disabled =
            false;

    }

}


/* ============================================================
   ORIGINAL LIGHTBOX
   ============================================================ */

function openOriginalLightbox() {

    const memory =
        getSelectedMemory();


    if (
        !memory ||
        !memory.originalUrl
    ) {
        return;
    }


    elements.lightboxImage.hidden =
        true;


    elements.lightboxVideo.hidden =
        true;


    elements.lightboxImage.removeAttribute(
        "src"
    );


    elements.lightboxVideo.pause();

    elements.lightboxVideo.removeAttribute(
        "src"
    );


    if (
        memory.type ===
        "video"
    ) {

        elements.lightboxVideo.src =
            memory.originalUrl;


        elements.lightboxVideo.hidden =
            false;

    }
    else {

        elements.lightboxImage.src =
            memory.originalUrl;


        elements.lightboxImage.alt =
            `Recuerdo de ${
                memory.guest?.name ||
                "invitado"
            }`;


        elements.lightboxImage.hidden =
            false;

    }


    elements.lightbox.hidden =
        false;

}


/* ============================================================
   CLOSE LIGHTBOX
   ============================================================ */

function closeLightbox() {

    if (
        !elements.lightbox
    ) {
        return;
    }


    elements.lightbox.hidden =
        true;


    if (
        elements.lightboxVideo
    ) {

        elements.lightboxVideo.pause();

        elements.lightboxVideo.removeAttribute(
            "src"
        );

        elements.lightboxVideo.load();

    }


    if (
        elements.lightboxImage
    ) {

        elements.lightboxImage.removeAttribute(
            "src"
        );

    }

}


/* ============================================================
   CLOSE MODAL
   ============================================================ */

function closeMemoryModal() {

    closeLightbox();

    closeDeleteConfirmation();


    elements.modal.hidden =
        true;


    state.selectedMemoryId =
        null;


    document.body.style.overflow =
        "";

}


/* ============================================================
   LOGOUT
   ============================================================ */

async function handleLogout() {

    if (state.actionRunning) {
        return;
    }


    state.actionRunning =
        true;


    try {

        await logoutAdmin();

    }
    catch (error) {

        console.error(
            "Admin logout failed:",
            error
        );

    }
    finally {

        /*
         * Mesmo se houver erro de rede,
         * não continuamos exibindo o painel.
         */

        state.guests = [];

        state.memories = [];


        window.location.replace(
            "./admin-login.html"
        );

    }

}


/* ============================================================
   CONTENT STATES
   ============================================================ */

function hideContentStates() {

    elements.loading.hidden =
        true;

    elements.error.hidden =
        true;

    elements.empty.hidden =
        true;

    elements.memories.hidden =
        true;

    elements.guests.hidden =
        true;

}


function showLoading() {

    hideContentStates();


    elements.loading.hidden =
        false;

}


function showError(
    message
) {

    hideContentStates();


    if (
        elements.errorMessage
    ) {

        elements.errorMessage.textContent =
            message;

    }


    elements.error.hidden =
        false;

}


function showEmptyForCurrentView() {

    const content = {

        pending: {
            title:
                "Todo está al día",

            message:
                state.search
                    ? "No hay recuerdos pendientes que coincidan con esta búsqueda."
                    : "No hay recuerdos pendientes de revisión."
        },

        approved: {
            title:
                "No hay publicaciones",

            message:
                state.search
                    ? "No hay recuerdos publicados que coincidan con esta búsqueda."
                    : "Todavía no se ha publicado ningún recuerdo."
        },

        featured: {
            title:
                "Sin destacados",

            message:
                state.search
                    ? "No hay fotografías destacadas que coincidan con esta búsqueda."
                    : "Todavía no has seleccionado fotografías para la galería destacada."
        }

    };


    const current =
        content[state.view];


    showEmpty(
        current?.title ||
            "Sin resultados",

        current?.message ||
            "No hay resultados."
    );

}


function showEmpty(
    title,
    message
) {

    hideContentStates();


    setText(
        elements.emptyTitle,
        title
    );


    setText(
        elements.emptyMessage,
        message
    );


    elements.empty.hidden =
        false;

}


/* ============================================================
   RESULTS COUNT
   ============================================================ */

function setResultsCount(
    count
) {

    if (
        !elements.resultsCount
    ) {
        return;
    }


    elements.resultsCount.textContent =
        `${count} ${
            count === 1
                ? "resultado"
                : "resultados"
        }`;

}


/* ============================================================
   MODAL ACTION STATE
   ============================================================ */

function setModalActionsDisabled(
    disabled
) {

    if (elements.approve) {
        elements.approve.disabled =
            disabled;
    }


    if (elements.discard) {
        elements.discard.disabled =
            disabled;
    }


    if (elements.featured) {
        elements.featured.disabled =
            disabled;
    }

}


/* ============================================================
   KEYBOARD
   ============================================================ */

function handleKeyboard(
    event
) {

    if (
        event.key !==
        "Escape"
    ) {
        return;
    }


    if (
        elements.confirm &&
        !elements.confirm.hidden
    ) {

        closeDeleteConfirmation();

        return;

    }


    if (
        elements.lightbox &&
        !elements.lightbox.hidden
    ) {

        closeLightbox();

        return;

    }


    if (
        elements.modal &&
        !elements.modal.hidden
    ) {

        closeMemoryModal();

    }

}


/* ============================================================
   GET MEMORY
   ============================================================ */

function getMemory(
    memoryId
) {

    return (
        state.memories.find(
            memory =>
                memory.id ===
                memoryId
        ) ||
        null
    );

}


function getSelectedMemory() {

    if (
        !state.selectedMemoryId
    ) {
        return null;
    }


    return getMemory(
        state.selectedMemoryId
    );

}


/* ============================================================
   DATE
   ============================================================ */

function formatDate(
    value
) {

    if (!value) {
        return "";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }


    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day:
                "2-digit",

            month:
                "short",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    ).format(
        date
    );

}


/* ============================================================
   INITIALS
   ============================================================ */

function getInitials(
    name
) {

    if (!name) {
        return "SJ";
    }


    const parts =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        parts.length ===
        0
    ) {
        return "SJ";
    }


    return parts
        .slice(0, 2)
        .map(
            part =>
                part[0]
                    ?.toUpperCase()
        )
        .join("");

}


/* ============================================================
   SAFE HTML
   ============================================================ */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* ============================================================
   TEXT
   ============================================================ */

function setText(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        String(
            value ?? ""
        );

}


/* ============================================================
   TOAST
   ============================================================ */

let toastTimer =
    null;


function showToast(
    title,
    message
) {

    if (
        !elements.toast
    ) {
        return;
    }


    clearTimeout(
        toastTimer
    );


    setText(
        elements.toastTitle,
        title
    );


    setText(
        elements.toastMessage,
        message
    );


    elements.toast.hidden =
        false;


    toastTimer =
        setTimeout(
            () => {

                elements.toast.hidden =
                    true;

            },
            4200
        );

}