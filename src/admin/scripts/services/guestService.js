/* ============================================================
   GUEST SERVICE — SUZANA & JUAN
   ============================================================

   Responsável por:

   - criar convidado
   - buscar convidado
   - editar perfil
   - buscar memórias
   - enviar arquivos
   - criar registros pending
   - excluir memórias pending
   - gerar URLs temporárias
   - controlar limite de 10 memórias

   ============================================================ */

import {
    supabase,
    SUPABASE_STORAGE_BUCKET
} from "./supabaseClient.js";


/* ============================================================
   CONFIG
   ============================================================ */

const MAX_MEMORIES = 10;

const SIGNED_URL_DURATION = 60 * 60; // 1 hora


/* ============================================================
   AUTH — IDENTIDADE DO CONVIDADO
   ============================================================ */

export async function ensureGuestSession() {

    /*
     * Primeiro verificamos se este navegador
     * já possui uma sessão Supabase.
     */

    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession();


    if (sessionError) {
        console.error(
            "Error comprobando sesión:",
            sessionError
        );

        throw sessionError;
    }


    /*
     * Se já existe sessão, reutilizamos.
     */

    if (sessionData?.session?.user) {

        return sessionData.session.user;

    }


    /*
     * Caso contrário, criamos silenciosamente
     * um usuário anônimo.
     */

    const {
        data,
        error
    } = await supabase.auth.signInAnonymously();


    if (error) {

        console.error(
            "Error creando sesión anónima:",
            error
        );

        throw error;
    }


    if (!data?.user) {

        throw new Error(
            "No se pudo iniciar la sesión del invitado."
        );

    }


    return data.user;
}


/* ============================================================
   CREATE GUEST
   ============================================================ */

export async function createGuest({
    name,
    bio = ""
}) {

    const user =
        await ensureGuestSession();


    const cleanName =
        String(name || "")
            .trim();


    const cleanBio =
        String(bio || "")
            .trim()
            .slice(0, 80);


    if (!cleanName) {

        throw new Error(
            "El nombre es obligatorio."
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from("guests")
            .insert({

                /*
                 * IMPORTANTE:
                 *
                 * guests.id === auth.users.id
                 */

                id:
                    user.id,

                name:
                    cleanName,

                bio:
                    cleanBio || null

            })
            .select()
            .single();


    if (error) {

        console.error(
            "Error creando invitado:",
            error
        );

        throw error;

    }


    return mapGuest(data);
}

/* ============================================================
   GET GUEST
   ============================================================ */

export async function getGuest(
    guestId
) {

    if (!guestId) {
        return null;
    }


    const {
        data,
        error
    } =
        await supabase
            .from("guests")
            .select(`
                id,
                name,
                bio,
                avatar_path,
                created_at,
                updated_at
            `)
            .eq(
                "id",
                guestId
            )
            .maybeSingle();


    if (error) {

        console.error(
            "Error obteniendo invitado:",
            error
        );

        throw error;

    }


    if (!data) {
        return null;
    }


    const guest =
        mapGuest(data);


    guest.avatarUrl =
        await getSignedFileUrl(
            data.avatar_path
        );


    return guest;

}


/* ============================================================
   UPDATE GUEST
   ============================================================ */

export async function updateGuest(
    guestId,
    {
        name,
        bio
    }
) {

    if (!guestId) {

        throw new Error(
            "Invitado no válido."
        );

    }


    const cleanName =
        String(name || "").trim();


    const cleanBio =
        String(bio || "")
            .trim()
            .slice(0, 80);


    if (!cleanName) {

        throw new Error(
            "El nombre es obligatorio."
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from("guests")
            .update({
                name: cleanName,
                bio: cleanBio || null
            })
            .eq(
                "id",
                guestId
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Error actualizando invitado:",
            error
        );

        throw error;

    }


    return mapGuest(data);

}


/* ============================================================
   UPLOAD AVATAR
   ============================================================ */

export async function uploadGuestAvatar(
    guestId,
    file
) {

    if (
        !guestId ||
        !file
    ) {

        throw new Error(
            "No se pudo guardar la fotografía de perfil."
        );

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        throw new Error(
            "La fotografía de perfil debe ser una imagen."
        );

    }


    const extension =
        getFileExtension(file) ||
        "jpg";


    const path =
        `guests/${guestId}/avatar/avatar-${Date.now()}.${extension}`;


    /*
     * Buscamos avatar anterior.
     */

    const {
        data: currentGuest,
        error: guestError
    } =
        await supabase
            .from("guests")
            .select(
                "avatar_path"
            )
            .eq(
                "id",
                guestId
            )
            .single();


    if (guestError) {

        throw guestError;

    }


    /*
     * Subimos nuevo avatar.
     */

    const {
        error: uploadError
    } =
        await supabase
            .storage
            .from(
                SUPABASE_STORAGE_BUCKET
            )
            .upload(
                path,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type
                }
            );


    if (uploadError) {

        console.error(
            "Error subiendo avatar:",
            uploadError
        );

        throw uploadError;

    }


    /*
     * Actualizamos perfil.
     */

    const {
        error: updateError
    } =
        await supabase
            .from("guests")
            .update({
                avatar_path: path
            })
            .eq(
                "id",
                guestId
            );


    if (updateError) {

        /*
         * Rollback:
         * se elimina el archivo nuevo.
         */

        await removeStorageFile(
            path
        );


        throw updateError;

    }


    /*
     * Eliminamos avatar anterior
     * después de guardar correctamente
     * el nuevo.
     */

    if (
        currentGuest?.avatar_path &&
        currentGuest.avatar_path !==
            path
    ) {

        await removeStorageFile(
            currentGuest.avatar_path
        );

    }


    return {
        path,

        url:
            await getSignedFileUrl(
                path
            )
    };

}


/* ============================================================
   GET MEMORIES
   ============================================================ */

export async function getGuestMemories(
    guestId
) {

    if (!guestId) {
        return [];
    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "guest_memories"
            )
            .select(`
                id,
                guest_id,
                type,
                storage_path,
                file_name,
                mime_type,
                duration,
                crop_x,
                crop_y,
                crop_zoom,
                status,
                featured,
                created_at,
                approved_at
            `)
            .eq(
                "guest_id",
                guestId
            )
            .order(
                "created_at",
                {
                    ascending:
                        false
                }
            );


    if (error) {

        console.error(
            "Error obteniendo recuerdos:",
            error
        );

        throw error;

    }


    const memories =
        await Promise.all(

            (data || [])
                .map(
                    async row => {

                        const memory =
                            mapMemory(row);


                        memory.originalUrl =
                            await getSignedFileUrl(
                                row.storage_path
                            );


                        return memory;

                    }
                )

        );


    return memories;

}


/* ============================================================
   COUNT MEMORIES
   ============================================================ */

export async function getGuestMemoryCount(
    guestId
) {

    if (!guestId) {
        return 0;
    }


    const {
        count,
        error
    } =
        await supabase
            .from(
                "guest_memories"
            )
            .select(
                "*",
                {
                    count:
                        "exact",

                    head:
                        true
                }
            )
            .eq(
                "guest_id",
                guestId
            );


    if (error) {

        throw error;

    }


    return count || 0;

}


/* ============================================================
   AVAILABLE SLOTS
   ============================================================ */

export async function getAvailableMemorySlots(
    guestId
) {

    const count =
        await getGuestMemoryCount(
            guestId
        );


    return Math.max(
        0,
        MAX_MEMORIES - count
    );

}


/* ============================================================
   UPLOAD MEMORY
   ============================================================ */

export async function uploadGuestMemory(
    guestId,
    {
        file,
        type,
        duration = null,
        crop = null
    }
) {

    if (
        !guestId ||
        !file
    ) {

        throw new Error(
            "Archivo no válido."
        );

    }


    /*
     * Verificamos límite antes
     * de subir al Storage.
     *
     * El trigger SQL vuelve a
     * verificarlo en el servidor.
     */

    const count =
        await getGuestMemoryCount(
            guestId
        );


    if (
        count >=
        MAX_MEMORIES
    ) {

        throw new Error(
            "Has alcanzado el límite de 10 recuerdos."
        );

    }


    validateMemoryFile(
        file,
        type,
        duration
    );


    const memoryId =
        crypto.randomUUID();


    const extension =
        getFileExtension(
            file
        );


    const storagePath =
        `guests/${guestId}/memories/${memoryId}.${extension}`;


    /*
     * 1. Storage
     */

    const {
        error: uploadError
    } =
        await supabase
            .storage
            .from(
                SUPABASE_STORAGE_BUCKET
            )
            .upload(
                storagePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type
                }
            );


    if (uploadError) {

        console.error(
            "Error subiendo recuerdo:",
            uploadError
        );

        throw uploadError;

    }


    /*
     * Crop padrão.
     *
     * O original nunca é alterado.
     */

    const cropData = {

        x:
            Number.isFinite(
                crop?.x
            )
                ? crop.x
                : 50,

        y:
            Number.isFinite(
                crop?.y
            )
                ? crop.y
                : 50,

        zoom:
            Number.isFinite(
                crop?.zoom
            )
                ? crop.zoom
                : 1

    };


    /*
     * 2. Database
     */

    const {
        data,
        error: insertError
    } =
        await supabase
            .from(
                "guest_memories"
            )
            .insert({

                id:
                    memoryId,

                guest_id:
                    guestId,

                type,

                storage_path:
                    storagePath,

                file_name:
                    file.name,

                mime_type:
                    file.type,

                duration:
                    type ===
                    "video"
                        ? duration
                        : null,

                crop_x:
                    cropData.x,

                crop_y:
                    cropData.y,

                crop_zoom:
                    cropData.zoom,

                status:
                    "pending",

                featured:
                    false

            })
            .select()
            .single();


    /*
     * Se banco falhar:
     * apagamos arquivo do Storage.
     */

    if (insertError) {

        await removeStorageFile(
            storagePath
        );


        console.error(
            "Error creando recuerdo:",
            insertError
        );


        if (
            String(
                insertError.message
            )
            .includes(
                "GUEST_MEMORY_LIMIT_REACHED"
            )
        ) {

            throw new Error(
                "Has alcanzado el límite de 10 recuerdos."
            );

        }


        throw insertError;

    }


    const memory =
        mapMemory(data);


    memory.originalUrl =
        await getSignedFileUrl(
            storagePath
        );


    return memory;

}


/* ============================================================
   UPDATE CROP
   ============================================================ */

export async function updateMemoryCrop(
    guestId,
    memoryId,
    crop
) {

    if (
        !guestId ||
        !memoryId
    ) {

        throw new Error(
            "Recuerdo no válido."
        );

    }


    const {
        data,
        error
    } =
        await supabase
            .from(
                "guest_memories"
            )
            .update({

                crop_x:
                    crop?.x ?? 50,

                crop_y:
                    crop?.y ?? 50,

                crop_zoom:
                    crop?.zoom ?? 1

            })
            .eq(
                "id",
                memoryId
            )
            .eq(
                "guest_id",
                guestId
            )
            .eq(
                "status",
                "pending"
            )
            .select()
            .single();


    if (error) {

        console.error(
            "Error guardando encuadre:",
            error
        );

        throw error;

    }


    return mapMemory(data);

}


/* ============================================================
   DELETE PENDING MEMORY
   ============================================================ */

export async function deletePendingMemory(
    guestId,
    memoryId
) {

    if (
        !guestId ||
        !memoryId
    ) {

        throw new Error(
            "Recuerdo no válido."
        );

    }


    /*
     * Primeiro buscamos o registro.
     *
     * Somente pending.
     */

    const {
        data: memory,
        error: findError
    } =
        await supabase
            .from(
                "guest_memories"
            )
            .select(`
                id,
                storage_path,
                status
            `)
            .eq(
                "id",
                memoryId
            )
            .eq(
                "guest_id",
                guestId
            )
            .eq(
                "status",
                "pending"
            )
            .maybeSingle();


    if (findError) {

        throw findError;

    }


    if (!memory) {

        throw new Error(
            "Este recuerdo ya no puede eliminarse."
        );

    }


    /*
     * Primeiro removemos Storage.
     */

    const {
        error: storageError
    } =
        await supabase
            .storage
            .from(
                SUPABASE_STORAGE_BUCKET
            )
            .remove([
                memory.storage_path
            ]);


    if (storageError) {

        console.error(
            "Error eliminando archivo:",
            storageError
        );

        throw storageError;

    }


    /*
     * Depois removemos DB.
     */

    const {
        error: deleteError
    } =
        await supabase
            .from(
                "guest_memories"
            )
            .delete()
            .eq(
                "id",
                memoryId
            )
            .eq(
                "guest_id",
                guestId
            )
            .eq(
                "status",
                "pending"
            );


    if (deleteError) {

        console.error(
            "Error eliminando recuerdo:",
            deleteError
        );

        throw deleteError;

    }


    return true;

}


/* ============================================================
   SIGNED FILE URL
   ============================================================ */

export async function getSignedFileUrl(
    path
) {

    if (!path) {
        return null;
    }


    const {
        data,
        error
    } =
        await supabase
            .storage
            .from(
                SUPABASE_STORAGE_BUCKET
            )
            .createSignedUrl(
                path,
                SIGNED_URL_DURATION
            );


    if (error) {

        console.warn(
            "No se pudo crear URL temporal:",
            path,
            error
        );

        return null;

    }


    return (
        data?.signedUrl ||
        null
    );

}


/* ============================================================
   REMOVE STORAGE FILE
   ============================================================ */

async function removeStorageFile(
    path
) {

    if (!path) {
        return;
    }


    const {
        error
    } =
        await supabase
            .storage
            .from(
                SUPABASE_STORAGE_BUCKET
            )
            .remove([
                path
            ]);


    if (error) {

        console.warn(
            "No se pudo eliminar archivo:",
            path,
            error
        );

    }

}


/* ============================================================
   VALIDATE MEMORY FILE
   ============================================================ */

function validateMemoryFile(
    file,
    type,
    duration
) {

    const allowedImages = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    const allowedVideos = [
        "video/mp4",
        "video/webm"
    ];


    if (
        type ===
        "image"
    ) {

        if (
            !allowedImages.includes(
                file.type
            )
        ) {

            throw new Error(
                "Formato de imagen no compatible."
            );

        }


        return;

    }


    if (
        type ===
        "video"
    ) {

        if (
            !allowedVideos.includes(
                file.type
            )
        ) {

            throw new Error(
                "Formato de vídeo no compatible."
            );

        }


        if (
            Number(duration) >
            10.15
        ) {

            throw new Error(
                "Este vídeo dura más de 10 segundos. Elige un fragmento más corto para compartirlo."
            );

        }


        return;

    }


    throw new Error(
        "Tipo de archivo no compatible."
    );

}


/* ============================================================
   MAP GUEST
   ============================================================ */

function mapGuest(row) {

    if (!row) {
        return null;
    }


    return {

        id:
            row.id,

        name:
            row.name,

        bio:
            row.bio || "",

        avatarPath:
            row.avatar_path || null,

        avatarUrl:
            null,

        createdAt:
            row.created_at,

        updatedAt:
            row.updated_at

    };

}


/* ============================================================
   MAP MEMORY
   ============================================================ */

function mapMemory(row) {

    return {

        id:
            row.id,

        guestId:
            row.guest_id,

        type:
            row.type,

        storagePath:
            row.storage_path,

        fileName:
            row.file_name,

        mimeType:
            row.mime_type,

        duration:
            row.duration,

        crop: {

            x:
                Number(
                    row.crop_x ??
                    50
                ),

            y:
                Number(
                    row.crop_y ??
                    50
                ),

            zoom:
                Number(
                    row.crop_zoom ??
                    1
                )

        },

        status:
            row.status,

        featured:
            Boolean(
                row.featured
            ),

        originalUrl:
            null,

        createdAt:
            row.created_at,

        approvedAt:
            row.approved_at

    };

}


/* ============================================================
   FILE EXTENSION
   ============================================================ */

function getFileExtension(
    file
) {

    const fileName =
        String(
            file?.name ||
            ""
        );


    const extension =
        fileName
            .split(".")
            .pop()
            ?.toLowerCase();


    if (
        extension &&
        extension !== fileName
    ) {

        return sanitizeExtension(
            extension
        );

    }


    const mimeMap = {

        "image/jpeg":
            "jpg",

        "image/png":
            "png",

        "image/webp":
            "webp",

        "video/mp4":
            "mp4",

        "video/webm":
            "webm"

    };


    return (
        mimeMap[
            file?.type
        ] ||
        "bin"
    );

}


/* ============================================================
   SANITIZE EXTENSION
   ============================================================ */

function sanitizeExtension(
    extension
) {

    return String(
        extension
    )
        .replace(
            /[^a-z0-9]/g,
            ""
        )
        .slice(
            0,
            8
        );

}


/* ============================================================
   EXPORT CONFIG
   ============================================================ */

export {
    MAX_MEMORIES
};