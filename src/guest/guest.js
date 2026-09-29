/* ============================================================
   GUEST EXPERIENCE — SUZANA & JUAN
   ============================================================

   FRONTEND LOCAL

   - Perfil persistente
   - Avatar persistente
   - Editar nome e bio
   - Trocar foto de perfil
   - Máximo 10 recuerdos
   - Fotos + vídeos
   - Vídeos até 10 segundos
   - Editor de enquadramento 1:1
   - Drag mouse/touch
   - Zoom
   - Crop salvo como dados
   - Original preservado
   - Lightbox original
   - Pending / Approved
   - Exclusão somente Pending

   FUTURO:
   - Supabase Storage
   - Database
   - Admin
   - Guest Gallery pública
   ============================================================ */


/* ============================================================
   CONFIG
   ============================================================ */

const CONFIG = {

    maxMemories: 10,

    maxVideoDuration: 10,

    maxBioLength: 80,

    profileKey:
        "sj_guest_profile",

    memoriesKey:
        "sj_guest_memories"

};


/* ============================================================
   STATE
   ============================================================ */

const state = {

    profile: null,

    memories: [],

    selection: [],

    avatarUrl: null,

    crop: {

        memoryId: null,

        zoom: 1,

        x: 0,

        y: 0,

        dragging: false,

        pointerId: null,

        startPointerX: 0,

        startPointerY: 0,

        startX: 0,

        startY: 0,

        baseWidth: 0,

        baseHeight: 0

    },

    deleteId: null,

    toastTimer: null

};


/* ============================================================
   ELEMENTS
   ============================================================ */

const el = {

    /* STATES */

    loading:
        document.querySelector(
            "[data-state-loading]"
        ),

    profileState:
        document.querySelector(
            "[data-state-profile]"
        ),

    dashboard:
        document.querySelector(
            "[data-state-dashboard]"
        ),


    /* CREATE PROFILE */

    profileForm:
        document.querySelector(
            "[data-profile-form]"
        ),

    profileName:
        document.querySelector(
            "[data-profile-name]"
        ),

    profileBio:
        document.querySelector(
            "[data-profile-bio]"
        ),

    nameError:
        document.querySelector(
            "[data-name-error]"
        ),

    bioCounter:
        document.querySelector(
            "[data-bio-counter]"
        ),


    /* FIRST AVATAR */

    avatarInput:
        document.querySelector(
            "[data-avatar-input]"
        ),

    avatarImage:
        document.querySelector(
            "[data-avatar-image]"
        ),

    avatarFallback:
        document.querySelector(
            "[data-avatar-fallback]"
        ),


    /* DASHBOARD PROFILE */

    dashboardAvatar:
        document.querySelector(
            "[data-dashboard-avatar]"
        ),

    dashboardAvatarFallback:
        document.querySelector(
            "[data-dashboard-avatar-fallback]"
        ),

    dashboardAvatarInput:
        document.querySelector(
            "[data-dashboard-avatar-input]"
        ),

    dashboardName:
        document.querySelector(
            "[data-dashboard-name]"
        ),

    dashboardBio:
        document.querySelector(
            "[data-dashboard-bio]"
        ),


    /* PROFILE EDITOR */

    editProfileButton:
        document.querySelector(
            "[data-edit-profile]"
        ),

    profileEditor:
        document.querySelector(
            "[data-profile-editor]"
        ),

    editProfileName:
        document.querySelector(
            "[data-edit-profile-name]"
        ),

    editProfileBio:
        document.querySelector(
            "[data-edit-profile-bio]"
        ),

    editBioCounter:
        document.querySelector(
            "[data-edit-bio-counter]"
        ),

    saveProfileEdit:
        document.querySelector(
            "[data-save-profile-edit]"
        ),

    cancelProfileEdit:
        document.querySelectorAll(
            "[data-cancel-profile-edit]"
        ),


    /* LIMIT */

    memoryTotal:
        document.querySelector(
            "[data-memory-total]"
        ),

    memoryLimitBar:
        document.querySelector(
            "[data-memory-limit-bar]"
        ),

    limitMessage:
        document.querySelector(
            "[data-limit-message]"
        ),


    /* UPLOAD */

    memoryInput:
        document.querySelector(
            "[data-memory-input]"
        ),

    uploadDropzone:
        document.querySelector(
            "[data-upload-dropzone]"
        ),

    uploadAvailability:
        document.querySelector(
            "[data-upload-availability]"
        ),


    /* SELECTION */

    selection:
        document.querySelector(
            "[data-selection]"
        ),

    selectionGrid:
        document.querySelector(
            "[data-selection-grid]"
        ),

    clearSelection:
        document.querySelector(
            "[data-clear-selection]"
        ),

    sendMemories:
        document.querySelector(
            "[data-send-memories]"
        ),


    /* MEMORIES */

    memoriesEmpty:
        document.querySelector(
            "[data-memories-empty]"
        ),

    memoriesGrid:
        document.querySelector(
            "[data-memories-grid]"
        ),

    pendingCount:
        document.querySelector(
            "[data-pending-count]"
        ),

    approvedCount:
        document.querySelector(
            "[data-approved-count]"
        ),


    /* CROP */

    cropModal:
        document.querySelector(
            "[data-crop-modal]"
        ),

    cropStage:
        document.querySelector(
            "[data-crop-stage]"
        ),

    cropImage:
        document.querySelector(
            "[data-crop-image]"
        ),

    cropZoom:
        document.querySelector(
            "[data-crop-zoom]"
        ),

    closeCrop:
        document.querySelectorAll(
            "[data-close-crop]"
        ),

    confirmCrop:
        document.querySelector(
            "[data-confirm-crop]"
        ),


    /* LIGHTBOX */

    lightbox:
        document.querySelector(
            "[data-lightbox]"
        ),

    lightboxImage:
        document.querySelector(
            "[data-lightbox-image]"
        ),

    lightboxVideo:
        document.querySelector(
            "[data-lightbox-video]"
        ),

    lightboxOwner:
        document.querySelector(
            "[data-lightbox-owner]"
        ),

    closeLightbox:
        document.querySelectorAll(
            "[data-close-lightbox]"
        ),


    /* DELETE */

    deleteModal:
        document.querySelector(
            "[data-delete-modal]"
        ),

    cancelDelete:
        document.querySelectorAll(
            "[data-cancel-delete]"
        ),

    confirmDelete:
        document.querySelector(
            "[data-confirm-delete]"
        ),


    /* TOAST */

    toast:
        document.querySelector(
            "[data-toast]"
        ),

    toastTitle:
        document.querySelector(
            "[data-toast-title]"
        ),

    toastMessage:
        document.querySelector(
            "[data-toast-message]"
        )

};


/* ============================================================
   INIT
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    init
);


function init() {

    loadLocalData();

    registerEvents();

    updateBioCounter();


    setTimeout(() => {

        hideStates();


        if (state.profile) {

            el.dashboard.hidden =
                false;

            renderDashboard();

        } else {

            el.profileState.hidden =
                false;

        }

    }, 550);


    console.log(
        "✓ Guest Experience inicializada"
    );

}


/* ============================================================
   LOCAL STORAGE
   ============================================================ */

function loadLocalData() {

    try {

        const profile =
            localStorage.getItem(
                CONFIG.profileKey
            );


        const memories =
            localStorage.getItem(
                CONFIG.memoriesKey
            );


        if (profile) {

            state.profile =
                JSON.parse(profile);


            state.avatarUrl =
                state.profile.avatarUrl ||
                null;

        }


        if (memories) {

            state.memories =
                JSON.parse(memories);

        }

    } catch (error) {

        console.error(
            "Error cargando datos locales:",
            error
        );

    }

}


/* ============================================================
   SAVE PROFILE
   ============================================================ */

function saveProfile() {

    if (!state.profile) {
        return;
    }


    try {

        localStorage.setItem(
            CONFIG.profileKey,
            JSON.stringify(
                state.profile
            )
        );

    } catch (error) {

        console.error(
            "No se pudo guardar el perfil:",
            error
        );


        showToast(
            "No pudimos guardar el perfil",
            "Prueba con una fotografía de perfil más pequeña."
        );

    }

}


/* ============================================================
   SAVE MEMORIES
   ============================================================ */

function saveMemories() {

    /*
     * Nesta fase NÃO salvamos os arquivos
     * reais das lembranças no localStorage.
     *
     * Quando conectarmos Supabase:
     *
     * originalUrl = URL do Storage
     *
     * e tudo persistirá corretamente.
     */

    const safeMemories =
        state.memories.map(
            memory => ({

                id:
                    memory.id,

                type:
                    memory.type,

                name:
                    memory.name,

                status:
                    memory.status,

                featured:
                    memory.featured || false,

                duration:
                    memory.duration || null,

                crop:
                    memory.crop || null,

                createdAt:
                    memory.createdAt,

                /*
                 * blob funciona somente
                 * durante a sessão atual.
                 */
                originalUrl:
                    memory.originalUrl || null

            })
        );


    try {

        localStorage.setItem(
            CONFIG.memoriesKey,
            JSON.stringify(
                safeMemories
            )
        );

    } catch (error) {

        console.error(
            "No se pudieron guardar los recuerdos:",
            error
        );

    }

}


/* ============================================================
   REGISTER EVENTS
   ============================================================ */

function registerEvents() {

    /* CREATE PROFILE */

    el.profileForm?.addEventListener(
        "submit",
        createProfile
    );


    el.profileBio?.addEventListener(
        "input",
        updateBioCounter
    );


    el.avatarInput?.addEventListener(
        "change",
        handleAvatar
    );


    /* EDIT PROFILE */

    el.editProfileButton?.addEventListener(
        "click",
        openProfileEditor
    );


    el.editProfileBio?.addEventListener(
        "input",
        updateEditBioCounter
    );


    el.saveProfileEdit?.addEventListener(
        "click",
        saveProfileChanges
    );


    el.cancelProfileEdit.forEach(
        button => {

            button.addEventListener(
                "click",
                closeProfileEditor
            );

        }
    );


    el.dashboardAvatarInput?.addEventListener(
        "change",
        changeProfileAvatar
    );


    /* UPLOAD */

    el.memoryInput?.addEventListener(
        "change",
        handleFiles
    );


    el.clearSelection?.addEventListener(
        "click",
        clearSelection
    );


    el.sendMemories?.addEventListener(
        "click",
        sendMemories
    );


    /* SELECTION */

    el.selectionGrid?.addEventListener(
        "click",
        handleSelectionClick
    );


    /* MEMORIES */

    el.memoriesGrid?.addEventListener(
        "click",
        handleMemoryClick
    );


    /* CROP */

    el.closeCrop.forEach(
        button => {

            button.addEventListener(
                "click",
                closeCrop
            );

        }
    );


    el.confirmCrop?.addEventListener(
        "click",
        confirmCrop
    );


    el.cropZoom?.addEventListener(
        "input",
        handleZoom
    );


    el.cropStage?.addEventListener(
        "pointerdown",
        startCropDrag
    );


    el.cropStage?.addEventListener(
        "pointermove",
        moveCrop
    );


    el.cropStage?.addEventListener(
        "pointerup",
        stopCropDrag
    );


    el.cropStage?.addEventListener(
        "pointercancel",
        stopCropDrag
    );


    /* LIGHTBOX */

    el.closeLightbox.forEach(
        button => {

            button.addEventListener(
                "click",
                closeLightbox
            );

        }
    );


    /* DELETE */

    el.cancelDelete.forEach(
        button => {

            button.addEventListener(
                "click",
                closeDeleteModal
            );

        }
    );


    el.confirmDelete?.addEventListener(
        "click",
        deleteMemory
    );


    /* KEYBOARD */

    document.addEventListener(
        "keydown",
        handleKeyboard
    );

}


/* ============================================================
   CREATE PROFILE
   ============================================================ */

function createProfile(event) {

    event.preventDefault();


    const name =
        el.profileName
            .value
            .trim();


    const bio =
        el.profileBio
            .value
            .trim();


    if (!name) {

        el.nameError.hidden =
            false;

        el.profileName.focus();

        return;

    }


    el.nameError.hidden =
        true;


    state.profile = {

        id:
            createId(),

        name,

        bio,

        avatarUrl:
            state.avatarUrl,

        createdAt:
            new Date()
                .toISOString()

    };


    saveProfile();


    hideStates();


    el.dashboard.hidden =
        false;


    renderDashboard();


    showToast(
        `Bienvenido, ${name}`,
        "Tu espacio está preparado para guardar tus recuerdos."
    );

}


/* ============================================================
   CREATE PROFILE BIO COUNTER
   ============================================================ */

function updateBioCounter() {

    if (
        !el.profileBio ||
        !el.bioCounter
    ) {
        return;
    }


    el.bioCounter.textContent =
        `${el.profileBio.value.length} / ${CONFIG.maxBioLength}`;

}


/* ============================================================
   INITIAL PROFILE AVATAR
   ============================================================ */

async function handleAvatar(event) {

    const file =
        event.target.files?.[0];


    event.target.value = "";


    if (!file) {
        return;
    }


    if (
        !isValidProfileImage(file)
    ) {

        showToast(
            "Archivo no compatible",
            "Selecciona una fotografía JPG, PNG o WEBP."
        );

        return;

    }


    try {

        state.avatarUrl =
            await imageFileToPersistentData(
                file
            );


        el.avatarImage.src =
            state.avatarUrl;


        el.avatarImage.hidden =
            false;


        el.avatarFallback.hidden =
            true;

    } catch (error) {

        console.error(error);


        showToast(
            "No pudimos preparar la fotografía",
            "Prueba con otra imagen."
        );

    }

}


/* ============================================================
   PROFILE IMAGE VALIDATION
   ============================================================ */

function isValidProfileImage(file) {

    return [
        "image/jpeg",
        "image/png",
        "image/webp"
    ].includes(
        file.type
    );

}


/* ============================================================
   PERSISTENT PROFILE IMAGE
   ============================================================ */

function imageFileToPersistentData(file) {

    /*
     * Avatar temporariamente persistente
     * em localStorage.
     *
     * Redimensionamos para 320x320 para
     * não salvar uma foto de vários MB.
     *
     * Futuramente:
     *
     * Supabase Storage
     *      ↓
     * avatar_url
     */

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "No se pudo leer la imagen."
                        )
                    );

                };


            reader.onload =
                () => {

                    const image =
                        new Image();


                    image.onerror =
                        () => {

                            reject(
                                new Error(
                                    "No se pudo procesar la imagen."
                                )
                            );

                        };


                    image.onload =
                        () => {

                            const size =
                                320;


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                size;

                            canvas.height =
                                size;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            if (!context) {

                                reject(
                                    new Error(
                                        "Canvas no disponible."
                                    )
                                );

                                return;

                            }


                            /*
                             * Recorte central apenas para
                             * o AVATAR.
                             *
                             * Isso não tem relação com o crop
                             * das fotos da galeria.
                             */

                            const sourceSize =
                                Math.min(
                                    image.naturalWidth,
                                    image.naturalHeight
                                );


                            const sourceX =
                                (
                                    image.naturalWidth -
                                    sourceSize
                                ) / 2;


                            const sourceY =
                                (
                                    image.naturalHeight -
                                    sourceSize
                                ) / 2;


                            context.drawImage(
                                image,

                                sourceX,
                                sourceY,

                                sourceSize,
                                sourceSize,

                                0,
                                0,

                                size,
                                size
                            );


                            /*
                             * JPEG é usado aqui para máxima
                             * compatibilidade no navegador.
                             */

                            const result =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.82
                                );


                            resolve(
                                result
                            );

                        };


                    image.src =
                        reader.result;

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* ============================================================
   HIDE STATES
   ============================================================ */

function hideStates() {

    if (el.loading) {

        el.loading.hidden =
            true;

    }


    if (el.profileState) {

        el.profileState.hidden =
            true;

    }


    if (el.dashboard) {

        el.dashboard.hidden =
            true;

    }

}


/* ============================================================
   DASHBOARD
   ============================================================ */

function renderDashboard() {

    renderProfile();

    renderSelection();

    renderMemories();

    updateLimit();

}


/* ============================================================
   RENDER PROFILE
   ============================================================ */

function renderProfile() {

    if (!state.profile) {
        return;
    }


    /* NAME */

    el.dashboardName.textContent =
        state.profile.name;


    /* BIO */

    if (
        state.profile.bio
    ) {

        el.dashboardBio.textContent =
            state.profile.bio;


        el.dashboardBio.hidden =
            false;

    } else {

        el.dashboardBio.textContent =
            "";


        el.dashboardBio.hidden =
            true;

    }


    /* AVATAR */

    if (
        state.profile.avatarUrl
    ) {

        el.dashboardAvatar.src =
            state.profile.avatarUrl;


        el.dashboardAvatar.alt =
            `Foto de ${state.profile.name}`;


        el.dashboardAvatar.hidden =
            false;


        el.dashboardAvatarFallback.hidden =
            true;

    } else {

        el.dashboardAvatar.removeAttribute(
            "src"
        );


        el.dashboardAvatar.hidden =
            true;


        el.dashboardAvatarFallback.hidden =
            false;

    }

}


/* ============================================================
   OPEN PROFILE EDITOR
   ============================================================ */

function openProfileEditor() {

    if (
        !state.profile ||
        !el.profileEditor
    ) {
        return;
    }


    el.editProfileName.value =
        state.profile.name || "";


    el.editProfileBio.value =
        state.profile.bio || "";


    updateEditBioCounter();


    el.profileEditor.hidden =
        false;


    requestAnimationFrame(
        () => {

            el.editProfileName.focus();

        }
    );

}


/* ============================================================
   CLOSE PROFILE EDITOR
   ============================================================ */

function closeProfileEditor() {

    if (!el.profileEditor) {
        return;
    }


    el.profileEditor.hidden =
        true;

}


/* ============================================================
   EDIT BIO COUNTER
   ============================================================ */

function updateEditBioCounter() {

    if (
        !el.editProfileBio ||
        !el.editBioCounter
    ) {
        return;
    }


    const length =
        el.editProfileBio
            .value
            .length;


    el.editBioCounter.textContent =
        `${length} / ${CONFIG.maxBioLength}`;

}


/* ============================================================
   SAVE PROFILE CHANGES
   ============================================================ */

function saveProfileChanges() {

    if (!state.profile) {
        return;
    }


    const name =
        el.editProfileName
            .value
            .trim();


    const bio =
        el.editProfileBio
            .value
            .trim();


    if (!name) {

        showToast(
            "Falta tu nombre",
            "Escribe tu nombre antes de guardar."
        );


        el.editProfileName.focus();

        return;

    }


    state.profile.name =
        name;


    state.profile.bio =
        bio;


    saveProfile();

    renderProfile();

    closeProfileEditor();


    showToast(
        "Perfil actualizado",
        "Tus cambios se han guardado correctamente."
    );

}


/* ============================================================
   CHANGE DASHBOARD AVATAR
   ============================================================ */

async function changeProfileAvatar(
    event
) {

    const file =
        event.target.files?.[0];


    event.target.value = "";


    if (!file) {
        return;
    }


    if (
        !isValidProfileImage(file)
    ) {

        showToast(
            "Archivo no compatible",
            "Selecciona una fotografía JPG, PNG o WEBP."
        );

        return;

    }


    try {

        const persistentImage =
            await imageFileToPersistentData(
                file
            );


        state.profile.avatarUrl =
            persistentImage;


        state.avatarUrl =
            persistentImage;


        saveProfile();

        renderProfile();


        showToast(
            "Fotografía actualizada",
            "Tu nueva fotografía de perfil se ha guardado."
        );

    } catch (error) {

        console.error(error);


        showToast(
            "No pudimos guardar la fotografía",
            "Prueba con otra imagen."
        );

    }

}


/* ============================================================
   HANDLE MEMORY FILES
   ============================================================ */

async function handleFiles(event) {

    const files =
        Array.from(
            event.target.files || []
        );


    event.target.value = "";


    if (!files.length) {
        return;
    }


    const available =
        getAvailableSlots();


    if (
        available <= 0
    ) {

        showLimitToast();

        return;

    }


    const candidates =
        files.slice(
            0,
            available
        );


    if (
        files.length >
        available
    ) {

        showToast(
            "Límite de recuerdos",

            `Solo tienes ${available} ${
                available === 1
                    ? "espacio disponible"
                    : "espacios disponibles"
            }.`
        );

    }


    for (
        const file
        of candidates
    ) {

        const memory =
            await prepareFile(
                file
            );


        if (memory) {

            state.selection.push(
                memory
            );

        }

    }


    renderSelection();

    updateLimit();

}


/* ============================================================
   PREPARE MEMORY FILE
   ============================================================ */

async function prepareFile(file) {

    const type =
        getFileType(
            file
        );


    if (!type) {

        showToast(
            "Archivo no compatible",
            "Puedes compartir fotografías JPG, PNG, WEBP o vídeos MP4/WebM."
        );

        return null;

    }


    /* VIDEO */

    if (
        type === "video"
    ) {

        const duration =
            await getVideoDuration(
                file
            );


        if (
            !Number.isFinite(
                duration
            )
        ) {

            showToast(
                "No pudimos leer el vídeo",
                "Prueba con otro archivo."
            );

            return null;

        }


        if (
            duration >
            CONFIG.maxVideoDuration +
            0.15
        ) {

            showToast(
                "Vídeo demasiado largo",
                "Los vídeos pueden durar un máximo de 10 segundos."
            );

            return null;

        }


        return {

            id:
                createId(),

            file,

            type:
                "video",

            name:
                file.name,

            originalUrl:
                URL.createObjectURL(
                    file
                ),

            duration,

            crop:
                null

        };

    }


    /* IMAGE */

    return {

        id:
            createId(),

        file,

        type:
            "image",

        name:
            file.name,

        originalUrl:
            URL.createObjectURL(
                file
            ),

        crop: {

            x: 0,

            y: 0,

            zoom: 1

        }

    };

}


/* ============================================================
   MEMORY FILE TYPE
   ============================================================ */

function getFileType(file) {

    if (
        [
            "image/jpeg",
            "image/png",
            "image/webp"
        ].includes(
            file.type
        )
    ) {

        return "image";

    }


    if (
        [
            "video/mp4",
            "video/webm"
        ].includes(
            file.type
        )
    ) {

        return "video";

    }


    return null;

}


/* ============================================================
   VIDEO DURATION
   ============================================================ */

function getVideoDuration(file) {

    return new Promise(
        resolve => {

            const video =
                document.createElement(
                    "video"
                );


            const url =
                URL.createObjectURL(
                    file
                );


            video.preload =
                "metadata";


            video.onloadedmetadata =
                () => {

                    const duration =
                        video.duration;


                    URL.revokeObjectURL(
                        url
                    );


                    resolve(
                        duration
                    );

                };


            video.onerror =
                () => {

                    URL.revokeObjectURL(
                        url
                    );


                    resolve(
                        Infinity
                    );

                };


            video.src =
                url;

        }
    );

}


/* ============================================================
   RENDER SELECTION
   ============================================================ */

function renderSelection() {

    if (
        !el.selection ||
        !el.selectionGrid
    ) {
        return;
    }


    el.selectionGrid.innerHTML =
        "";


    if (
        !state.selection.length
    ) {

        el.selection.hidden =
            true;

        return;

    }


    el.selection.hidden =
        false;


    state.selection.forEach(
        memory => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "guest-selection-card";


            card.dataset.selectionId =
                memory.id;


            /* IMAGE */

            if (
                memory.type ===
                "image"
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    memory.originalUrl;


                image.alt =
                    "Fotografía seleccionada";


                applyCropPreview(
                    image,
                    memory.crop
                );


                card.appendChild(
                    image
                );

            }


            /* VIDEO */

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


                video.muted =
                    true;


                video.playsInline =
                    true;


                video.preload =
                    "metadata";


                card.appendChild(
                    video
                );


                const badge =
                    document.createElement(
                        "span"
                    );


                badge.className =
                    "guest-selection-card__video";


                badge.textContent =
                    `${formatDuration(
                        memory.duration
                    )} · Vídeo`;


                card.appendChild(
                    badge
                );

            }


            /* REMOVE */

            const remove =
                document.createElement(
                    "button"
                );


            remove.type =
                "button";


            remove.className =
                "guest-selection-card__remove";


            remove.dataset.removeSelection =
                memory.id;


            remove.setAttribute(
                "aria-label",
                "Quitar recuerdo"
            );


            remove.textContent =
                "×";


            card.appendChild(
                remove
            );


            /* OVERLAY */

            const overlay =
                document.createElement(
                    "div"
                );


            overlay.className =
                "guest-selection-card__overlay";


            /* CROP BUTTON */

            if (
                memory.type ===
                "image"
            ) {

                const adjust =
                    document.createElement(
                        "button"
                    );


                adjust.type =
                    "button";


                adjust.className =
                    "guest-selection-card__action";


                adjust.dataset.crop =
                    memory.id;


                adjust.textContent =
                    "Ajustar";


                overlay.appendChild(
                    adjust
                );

            }


            /* ORIGINAL */

            const original =
                document.createElement(
                    "button"
                );


            original.type =
                "button";


            original.className =
                "guest-selection-card__action";


            original.dataset.previewOriginal =
                memory.id;


            original.textContent =
                "Original";


            overlay.appendChild(
                original
            );


            card.appendChild(
                overlay
            );


            el.selectionGrid.appendChild(
                card
            );

        }
    );

}


/* ============================================================
   SELECTION CLICK
   ============================================================ */

function handleSelectionClick(event) {

    /* REMOVE */

    const remove =
        event.target.closest(
            "[data-remove-selection]"
        );


    if (remove) {

        removeFromSelection(
            remove.dataset
                .removeSelection
        );

        return;

    }


    /* CROP */

    const crop =
        event.target.closest(
            "[data-crop]"
        );


    if (crop) {

        openCrop(
            crop.dataset.crop
        );

        return;

    }


    /* ORIGINAL */

    const original =
        event.target.closest(
            "[data-preview-original]"
        );


    if (original) {

        const memory =
            state.selection.find(
                item =>
                    item.id ===
                    original.dataset
                        .previewOriginal
            );


        if (memory) {

            openLightbox(
                memory
            );

        }

    }

}


/* ============================================================
   REMOVE SELECTION
   ============================================================ */

function removeFromSelection(id) {

    const memory =
        state.selection.find(
            item =>
                item.id === id
        );


    if (!memory) {
        return;
    }


    revokeBlob(
        memory.originalUrl
    );


    state.selection =
        state.selection.filter(
            item =>
                item.id !== id
        );


    renderSelection();

    updateLimit();

}


/* ============================================================
   CLEAR SELECTION
   ============================================================ */

function clearSelection() {

    state.selection.forEach(
        memory => {

            revokeBlob(
                memory.originalUrl
            );

        }
    );


    state.selection = [];


    renderSelection();

    updateLimit();

}


/* ============================================================
   CROP OPEN
   ============================================================ */

function openCrop(id) {

    const memory =
        state.selection.find(
            item =>
                item.id === id
        );


    if (
        !memory ||
        memory.type !== "image"
    ) {
        return;
    }


    state.crop.memoryId =
        id;


    state.crop.zoom =
        memory.crop?.zoom || 1;


    /*
     * crop.x/y estão normalizados.
     * Aqui voltamos para pixels depois
     * de conhecer o tamanho do stage.
     */

    state.crop.x = 0;

    state.crop.y = 0;

    state.crop.dragging =
        false;


    el.cropZoom.value =
        state.crop.zoom;


    el.cropImage.onload =
        () => {

            initializeCropImage(
                memory
            );

        };


    el.cropImage.src =
        memory.originalUrl;


    openModal(
        el.cropModal
    );

}


/* ============================================================
   INITIALIZE CROP
   ============================================================ */

function initializeCropImage(
    memory
) {

    const stageSize =
        el.cropStage
            .getBoundingClientRect()
            .width;


    const naturalWidth =
        el.cropImage
            .naturalWidth;


    const naturalHeight =
        el.cropImage
            .naturalHeight;


    if (
        !stageSize ||
        !naturalWidth ||
        !naturalHeight
    ) {
        return;
    }


    const coverScale =
        Math.max(

            stageSize /
            naturalWidth,

            stageSize /
            naturalHeight

        );


    state.crop.baseWidth =
        naturalWidth *
        coverScale;


    state.crop.baseHeight =
        naturalHeight *
        coverScale;


    /*
     * Recupera posição normalizada.
     */

    state.crop.x =
        (
            memory.crop?.x || 0
        ) *
        stageSize;


    state.crop.y =
        (
            memory.crop?.y || 0
        ) *
        stageSize;


    clampCropPosition();

    updateCropTransform();

}


/* ============================================================
   CROP ZOOM
   ============================================================ */

function handleZoom(event) {

    state.crop.zoom =
        Number(
            event.target.value
        );


    clampCropPosition();

    updateCropTransform();

}


/* ============================================================
   CROP DRAG START
   ============================================================ */

function startCropDrag(event) {

    if (
        !state.crop.memoryId
    ) {
        return;
    }


    state.crop.dragging =
        true;


    state.crop.pointerId =
        event.pointerId;


    state.crop.startPointerX =
        event.clientX;


    state.crop.startPointerY =
        event.clientY;


    state.crop.startX =
        state.crop.x;


    state.crop.startY =
        state.crop.y;


    el.cropStage
        .setPointerCapture(
            event.pointerId
        );

}


/* ============================================================
   CROP DRAG MOVE
   ============================================================ */

function moveCrop(event) {

    if (
        !state.crop.dragging ||
        event.pointerId !==
            state.crop.pointerId
    ) {
        return;
    }


    const deltaX =
        event.clientX -
        state.crop.startPointerX;


    const deltaY =
        event.clientY -
        state.crop.startPointerY;


    state.crop.x =
        state.crop.startX +
        deltaX;


    state.crop.y =
        state.crop.startY +
        deltaY;


    clampCropPosition();

    updateCropTransform();

}


/* ============================================================
   CROP DRAG STOP
   ============================================================ */

function stopCropDrag(event) {

    if (
        event.pointerId !==
        state.crop.pointerId
    ) {
        return;
    }


    state.crop.dragging =
        false;


    try {

        el.cropStage
            .releasePointerCapture(
                event.pointerId
            );

    } catch {
        /* ignore */
    }


    state.crop.pointerId =
        null;

}


/* ============================================================
   CLAMP CROP
   ============================================================ */

function clampCropPosition() {

    const stageSize =
        el.cropStage
            .getBoundingClientRect()
            .width;


    if (!stageSize) {
        return;
    }


    const width =
        state.crop.baseWidth *
        state.crop.zoom;


    const height =
        state.crop.baseHeight *
        state.crop.zoom;


    const maxX =
        Math.max(
            0,
            (
                width -
                stageSize
            ) / 2
        );


    const maxY =
        Math.max(
            0,
            (
                height -
                stageSize
            ) / 2
        );


    state.crop.x =
        clamp(
            state.crop.x,
            -maxX,
            maxX
        );


    state.crop.y =
        clamp(
            state.crop.y,
            -maxY,
            maxY
        );

}


/* ============================================================
   UPDATE CROP TRANSFORM
   ============================================================ */

function updateCropTransform() {

    el.cropImage.style.width =
        `${state.crop.baseWidth}px`;


    el.cropImage.style.height =
        `${state.crop.baseHeight}px`;


    el.cropImage.style.transform = `
        translate(
            calc(-50% + ${state.crop.x}px),
            calc(-50% + ${state.crop.y}px)
        )
        scale(${state.crop.zoom})
    `;

}


/* ============================================================
   CONFIRM CROP
   ============================================================ */

function confirmCrop() {

    const memory =
        state.selection.find(
            item =>
                item.id ===
                state.crop.memoryId
        );


    if (!memory) {

        closeCrop();

        return;

    }


    const stageSize =
        el.cropStage
            .getBoundingClientRect()
            .width;


    memory.crop = {

        x:
            stageSize
                ? state.crop.x /
                  stageSize
                : 0,

        y:
            stageSize
                ? state.crop.y /
                  stageSize
                : 0,

        zoom:
            state.crop.zoom

    };


    closeCrop();

    renderSelection();


    showToast(
        "Encuadre guardado",
        "Así se mostrará esta fotografía en la galería."
    );

}


/* ============================================================
   APPLY CROP PREVIEW
   ============================================================ */

function applyCropPreview(
    image,
    crop
) {

    if (!crop) {
        return;
    }


    image.style.objectFit =
        "cover";


    /*
     * Como preview visual usamos
     * object-position + zoom.
     *
     * O crop definitivo continua sendo
     * salvo separadamente.
     */

    const positionX =
        clamp(
            50 +
            (
                crop.x || 0
            ) *
            100,

            0,
            100
        );


    const positionY =
        clamp(
            50 +
            (
                crop.y || 0
            ) *
            100,

            0,
            100
        );


    image.style.objectPosition =
        `${positionX}% ${positionY}%`;


    image.style.transform =
        `scale(${crop.zoom || 1})`;

}


/* ============================================================
   CLOSE CROP
   ============================================================ */

function closeCrop() {

    closeModal(
        el.cropModal
    );


    state.crop.memoryId =
        null;


    state.crop.dragging =
        false;

}


/* ============================================================
   SEND MEMORIES
   ============================================================ */

function sendMemories() {

    if (
        !state.selection.length
    ) {
        return;
    }


    const available =
        CONFIG.maxMemories -
        state.memories.length;


    if (
        available <= 0
    ) {

        showLimitToast();

        return;

    }


    const toSend =
        state.selection.slice(
            0,
            available
        );


    const now =
        new Date()
            .toISOString();


    toSend.forEach(
        memory => {

            state.memories.push({

                id:
                    memory.id,

                type:
                    memory.type,

                name:
                    memory.name,

                originalUrl:
                    memory.originalUrl,

                duration:
                    memory.duration ||
                    null,

                crop:
                    memory.crop ||
                    null,

                status:
                    "pending",

                featured:
                    false,

                createdAt:
                    now

            });

        }
    );


    state.selection = [];


    saveMemories();

    renderSelection();

    renderMemories();

    updateLimit();


    showToast(
        "Recuerdos recibidos",
        "Tus recuerdos están en proceso de aprobación. Cuando sean aprobados podrán aparecer en la galería de la boda."
    );

}


/* ============================================================
   RENDER MEMORIES
   ============================================================ */

function renderMemories() {

    if (
        !el.memoriesGrid ||
        !el.memoriesEmpty
    ) {
        return;
    }


    el.memoriesGrid.innerHTML =
        "";


    const hasMemories =
        state.memories.length > 0;


    el.memoriesEmpty.hidden =
        hasMemories;


    el.memoriesGrid.hidden =
        !hasMemories;


    let pending = 0;

    let approved = 0;


    state.memories.forEach(
        memory => {

            if (
                memory.status ===
                "pending"
            ) {

                pending++;

            }


            if (
                memory.status ===
                "approved"
            ) {

                approved++;

            }


            const card =
                createMemoryCard(
                    memory
                );


            el.memoriesGrid.appendChild(
                card
            );

        }
    );


    el.pendingCount.textContent =
        pending;


    el.approvedCount.textContent =
        approved;

}


/* ============================================================
   CREATE MEMORY CARD
   ============================================================ */

function createMemoryCard(memory) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "guest-memory";


    article.dataset.memoryId =
        memory.id;


    /* IMAGE */

    if (
        memory.type === "image" &&
        hasUsableUrl(
            memory.originalUrl
        )
    ) {

        const image =
            document.createElement(
                "img"
            );


        image.src =
            memory.originalUrl;


        image.alt =
            "Recuerdo compartido";


        applyCropPreview(
            image,
            memory.crop
        );


        article.appendChild(
            image
        );

    }


    /* VIDEO */

    else if (
        memory.type === "video" &&
        hasUsableUrl(
            memory.originalUrl
        )
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            memory.originalUrl;


        video.muted =
            true;


        video.playsInline =
            true;


        video.preload =
            "metadata";


        article.appendChild(
            video
        );


        const play =
            document.createElement(
                "span"
            );


        play.className =
            "guest-memory__play";


        play.innerHTML = `
            <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path d="M9 7l8 5-8 5Z"></path>
            </svg>
        `;


        article.appendChild(
            play
        );

    }


    /* FALLBACK */

    else {

        const fallback =
            document.createElement(
                "div"
            );


        fallback.className =
            "guest-memory__fallback";


        fallback.innerHTML = `
            <span>SJ</span>
        `;


        article.appendChild(
            fallback
        );

    }


    /* STATUS */

    const status =
        document.createElement(
            "span"
        );


    status.className =
        `guest-memory__status guest-memory__status--${memory.status}`;


    status.textContent =
        memory.status ===
        "approved"
            ? "Publicado"
            : "Pendiente";


    article.appendChild(
        status
    );


    /*
     * EXCLUSÃO SOMENTE PENDING
     */

    if (
        memory.status ===
        "pending"
    ) {

        const remove =
            document.createElement(
                "button"
            );


        remove.type =
            "button";


        remove.className =
            "guest-memory__delete";


        remove.dataset.deleteMemory =
            memory.id;


        remove.setAttribute(
            "aria-label",
            "Eliminar recuerdo pendiente"
        );


        remove.textContent =
            "×";


        article.appendChild(
            remove
        );

    }


    return article;

}


/* ============================================================
   MEMORY CLICK
   ============================================================ */

function handleMemoryClick(event) {

    const deleteButton =
        event.target.closest(
            "[data-delete-memory]"
        );


    if (deleteButton) {

        event.stopPropagation();


        requestDelete(
            deleteButton.dataset
                .deleteMemory
        );


        return;

    }


    const card =
        event.target.closest(
            "[data-memory-id]"
        );


    if (!card) {
        return;
    }


    const memory =
        state.memories.find(
            item =>
                item.id ===
                card.dataset.memoryId
        );


    if (!memory) {
        return;
    }


    openLightbox(
        memory
    );

}


/* ============================================================
   REQUEST DELETE
   ============================================================ */

function requestDelete(id) {

    const memory =
        state.memories.find(
            item =>
                item.id === id
        );


    if (!memory) {
        return;
    }


    /*
     * REGRA:
     *
     * Approved não pode ser eliminado
     * pelo convidado.
     */

    if (
        memory.status !==
        "pending"
    ) {

        showToast(
            "Recuerdo publicado",
            "Los recuerdos aprobados ya no pueden eliminarse desde tu espacio."
        );

        return;

    }


    state.deleteId =
        id;


    openModal(
        el.deleteModal
    );

}


/* ============================================================
   DELETE MEMORY
   ============================================================ */

function deleteMemory() {

    const memory =
        state.memories.find(
            item =>
                item.id ===
                state.deleteId
        );


    if (!memory) {

        closeDeleteModal();

        return;

    }


    if (
        memory.status !==
        "pending"
    ) {

        closeDeleteModal();

        return;

    }


    /*
     * Futuro Supabase:
     *
     * 1. DELETE Storage
     * 2. DELETE DB row
     */


    revokeBlob(
        memory.originalUrl
    );


    state.memories =
        state.memories.filter(
            item =>
                item.id !==
                state.deleteId
        );


    saveMemories();


    closeDeleteModal();


    renderMemories();

    updateLimit();


    showToast(
        "Recuerdo eliminado",
        "Se ha liberado un espacio para que puedas compartir otro recuerdo."
    );

}


/* ============================================================
   CLOSE DELETE
   ============================================================ */

function closeDeleteModal() {

    closeModal(
        el.deleteModal
    );


    state.deleteId =
        null;

}


/* ============================================================
   LIGHTBOX
   ============================================================ */

function openLightbox(memory) {

    if (
        !hasUsableUrl(
            memory.originalUrl
        )
    ) {

        showToast(
            "Vista no disponible",
            "Este archivo pertenece a una sesión anterior. Cuando conectemos el almacenamiento estará disponible permanentemente."
        );

        return;

    }


    /*
     * ORIGINAL.
     *
     * Nunca aplicamos crop aqui.
     */


    el.lightboxImage.hidden =
        true;


    el.lightboxVideo.hidden =
        true;


    el.lightboxVideo.pause();


    el.lightboxVideo.removeAttribute(
        "src"
    );


    if (
        memory.type ===
        "image"
    ) {

        el.lightboxImage.src =
            memory.originalUrl;


        el.lightboxImage.hidden =
            false;

    }


    if (
        memory.type ===
        "video"
    ) {

        el.lightboxVideo.src =
            memory.originalUrl;


        el.lightboxVideo.hidden =
            false;

    }


    el.lightboxOwner.textContent =
        state.profile?.name ||
        "Invitado";


    openModal(
        el.lightbox
    );

}


/* ============================================================
   CLOSE LIGHTBOX
   ============================================================ */

function closeLightbox() {

    el.lightboxVideo.pause();


    closeModal(
        el.lightbox
    );

}


/* ============================================================
   UPDATE LIMIT
   ============================================================ */

function updateLimit() {

    const stored =
        state.memories.length;


    const selected =
        state.selection.length;


    const total =
        stored +
        selected;


    const remaining =
        Math.max(
            0,

            CONFIG.maxMemories -
            total
        );


    /* MAIN NUMBER */

    el.memoryTotal.textContent =
        String(
            stored
        ).padStart(
            2,
            "0"
        );


    /* BAR */

    const percentage =
        Math.min(
            100,

            (
                stored /
                CONFIG.maxMemories
            ) *
            100
        );


    el.memoryLimitBar.style.width =
        `${percentage}%`;


    /* LIMIT */

    if (
        remaining === 0
    ) {

        el.limitMessage.textContent =
            "Has alcanzado el límite. Si tienes recuerdos pendientes, puedes eliminar uno para compartir otro.";


        el.uploadAvailability.textContent =
            "Límite de 10 recuerdos alcanzado";


        el.uploadDropzone.classList.add(
            "is-disabled"
        );


        el.memoryInput.disabled =
            true;

    } else {

        el.limitMessage.textContent =
            "Puedes compartir hasta 10 recuerdos.";


        el.uploadAvailability.textContent =
            `${remaining} ${
                remaining === 1
                    ? "espacio disponible"
                    : "espacios disponibles"
            }`;


        el.uploadDropzone.classList.remove(
            "is-disabled"
        );


        el.memoryInput.disabled =
            false;

    }

}


/* ============================================================
   AVAILABLE SLOTS
   ============================================================ */

function getAvailableSlots() {

    return Math.max(

        0,

        CONFIG.maxMemories -
        state.memories.length -
        state.selection.length

    );

}


/* ============================================================
   LIMIT TOAST
   ============================================================ */

function showLimitToast() {

    showToast(
        "Límite alcanzado",
        "Ya tienes 10 recuerdos. Puedes eliminar uno de los pendientes para compartir otro."
    );

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
            "guest-modal-open"
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


function closeModal(modal) {

    if (!modal) {
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


            const openModal =
                document.querySelector(
                    ".guest-modal.is-open"
                );


            if (!openModal) {

                document.body
                    .classList
                    .remove(
                        "guest-modal-open"
                    );

            }

        },

        350
    );

}


/* ============================================================
   TOAST
   ============================================================ */

function showToast(
    title,
    message
) {

    if (!el.toast) {
        return;
    }


    clearTimeout(
        state.toastTimer
    );


    el.toastTitle.textContent =
        title;


    el.toastMessage.textContent =
        message;


    el.toast.hidden =
        false;


    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    el.toast.classList.add(
                        "is-visible"
                    );

                }
            );

        }
    );


    state.toastTimer =
        setTimeout(
            () => {

                el.toast.classList.remove(
                    "is-visible"
                );


                setTimeout(
                    () => {

                        el.toast.hidden =
                            true;

                    },

                    350
                );

            },

            5000
        );

}


/* ============================================================
   KEYBOARD
   ============================================================ */

function handleKeyboard(event) {

    if (
        event.key !==
        "Escape"
    ) {
        return;
    }


    if (
        el.cropModal &&
        !el.cropModal.hidden
    ) {

        closeCrop();

        return;

    }


    if (
        el.deleteModal &&
        !el.deleteModal.hidden
    ) {

        closeDeleteModal();

        return;

    }


    if (
        el.lightbox &&
        !el.lightbox.hidden
    ) {

        closeLightbox();

        return;

    }


    if (
        el.profileEditor &&
        !el.profileEditor.hidden
    ) {

        closeProfileEditor();

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


function formatDuration(seconds) {

    const safe =
        Math.max(
            0,
            Math.round(
                seconds || 0
            )
        );


    return `0:${String(
        safe
    ).padStart(
        2,
        "0"
    )}`;

}


function createId() {

    if (
        window.crypto &&
        typeof crypto.randomUUID ===
            "function"
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now()
            .toString(36) +

        Math.random()
            .toString(36)
            .slice(2)
    );

}


function revokeBlob(url) {

    if (
        typeof url ===
            "string" &&

        url.startsWith(
            "blob:"
        )
    ) {

        try {

            URL.revokeObjectURL(
                url
            );

        } catch {
            /* ignore */
        }

    }

}


function hasUsableUrl(url) {

    return (
        typeof url ===
            "string" &&

        url.length > 0
    );

}


/* ============================================================
   DEVELOPMENT TOOLS
   ============================================================ */

window.weddingGuestDev = {

    approveFirstPending() {

        const memory =
            state.memories.find(
                item =>
                    item.status ===
                    "pending"
            );


        if (!memory) {

            console.log(
                "No hay recuerdos pendientes."
            );

            return;

        }


        memory.status =
            "approved";


        saveMemories();

        renderMemories();

        updateLimit();


        console.log(
            "✓ Recuerdo aprobado:",
            memory
        );

    },


    approve(id) {

        const memory =
            state.memories.find(
                item =>
                    item.id === id
            );


        if (!memory) {
            return;
        }


        memory.status =
            "approved";


        saveMemories();

        renderMemories();

        updateLimit();

    },


    feature(id) {

        const memory =
            state.memories.find(
                item =>
                    item.id === id
            );


        if (
            !memory ||
            memory.type !==
                "image"
        ) {
            return;
        }


        memory.featured =
            true;


        saveMemories();


        console.log(
            "✓ Foto featured:",
            memory
        );

    },


    state() {

        console.log({

            profile:
                state.profile,

            memories:
                state.memories,

            selection:
                state.selection

        });

    },


    reset() {

        localStorage.removeItem(
            CONFIG.profileKey
        );


        localStorage.removeItem(
            CONFIG.memoriesKey
        );


        location.reload();

    }

};