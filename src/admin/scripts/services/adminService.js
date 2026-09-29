/* ============================================================
   ADMIN SERVICE — SUZANA & JUAN
   ============================================================ */

import {
    supabase,
    SUPABASE_STORAGE_BUCKET
} from "./supabaseClient.js";


const SIGNED_URL_DURATION = 60 * 60;


/* ============================================================
   AUTH — VERIFY ADMIN
   ============================================================ */

export async function verifyAdminSession() {

    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession();


    if (sessionError) {
        throw sessionError;
    }


    const session =
        sessionData?.session;


    if (!session?.user) {

        return {
            authorized: false,
            user: null
        };

    }


    /*
     * Sessões anônimas nunca são consideradas
     * administrativas.
     */

    if (
        session.user.is_anonymous === true
    ) {

        return {
            authorized: false,
            user: session.user
        };

    }


    const {
        data: isAdmin,
        error: adminError
    } = await supabase.rpc(
        "is_admin"
    );


    if (adminError) {
        throw adminError;
    }


    return {

        authorized:
            isAdmin === true,

        user:
            session.user

    };

}


/* ============================================================
   LOGOUT
   ============================================================ */

export async function logoutAdmin() {

    const {
        error
    } = await supabase.auth.signOut();


    if (error) {
        throw error;
    }

}


/* ============================================================
   GET ALL GUESTS
   ============================================================ */

export async function getAdminGuests() {

    const {
        data,
        error
    } = await supabase
        .from("guests")
        .select(`
            id,
            name,
            bio,
            avatar_path,
            created_at,
            updated_at
        `)
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {
        throw error;
    }


    return await Promise.all(

        (data || []).map(
            async guest => ({

                id:
                    guest.id,

                name:
                    guest.name,

                bio:
                    guest.bio || "",

                avatarPath:
                    guest.avatar_path,

                avatarUrl:
                    await createSignedFileUrl(
                        guest.avatar_path
                    ),

                createdAt:
                    guest.created_at,

                updatedAt:
                    guest.updated_at

            })
        )

    );

}


/* ============================================================
   GET ALL MEMORIES
   ============================================================ */

export async function getAdminMemories() {

    const {
        data,
        error
    } = await supabase
        .from("guest_memories")
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
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {
        throw error;
    }


    return await Promise.all(

        (data || []).map(
            async row => {

                const memory =
                    mapMemory(row);


                memory.originalUrl =
                    await createSignedFileUrl(
                        row.storage_path
                    );


                return memory;

            }
        )

    );

}


/* ============================================================
   GET ADMIN DATA
   ============================================================ */

export async function getAdminData() {

    /*
     * Fazemos as duas consultas em paralelo.
     */

    const [
        guests,
        memories
    ] = await Promise.all([

        getAdminGuests(),

        getAdminMemories()

    ]);


    /*
     * Associamos o perfil do convidado
     * às memórias somente no frontend.
     */

    const guestMap =
        new Map(
            guests.map(
                guest => [
                    guest.id,
                    guest
                ]
            )
        );


    const hydratedMemories =
        memories.map(
            memory => ({

                ...memory,

                guest:
                    guestMap.get(
                        memory.guestId
                    ) || null

            })
        );


    return {

        guests,

        memories:
            hydratedMemories

    };

}


/* ============================================================
   APPROVE MEMORY
   ============================================================ */

export async function approveMemory(
    memoryId,
    {
        featured = false,
        crop = null
    } = {}
) {

    if (!memoryId) {
        throw new Error(
            "Recuerdo no válido."
        );
    }


    const update = {

        status:
            "approved",

        featured:
            Boolean(featured)

    };


    if (crop) {

        update.crop_x =
            normalizeCropValue(
                crop.x,
                50
            );

        update.crop_y =
            normalizeCropValue(
                crop.y,
                50
            );

        update.crop_zoom =
            normalizeZoom(
                crop.zoom
            );

    }


    const {
        data,
        error
    } = await supabase
        .from("guest_memories")
        .update(update)
        .eq(
            "id",
            memoryId
        )
        .select()
        .single();


    if (error) {
        throw error;
    }


    return mapMemory(data);

}


/* ============================================================
   UPDATE CROP
   ============================================================ */

export async function updateAdminMemoryCrop(
    memoryId,
    crop
) {

    if (!memoryId) {
        throw new Error(
            "Recuerdo no válido."
        );
    }


    const {
        data,
        error
    } = await supabase
        .from("guest_memories")
        .update({

            crop_x:
                normalizeCropValue(
                    crop?.x,
                    50
                ),

            crop_y:
                normalizeCropValue(
                    crop?.y,
                    50
                ),

            crop_zoom:
                normalizeZoom(
                    crop?.zoom
                )

        })
        .eq(
            "id",
            memoryId
        )
        .select()
        .single();


    if (error) {
        throw error;
    }


    return mapMemory(data);

}


/* ============================================================
   SET FEATURED
   ============================================================ */

export async function setMemoryFeatured(
    memoryId,
    featured
) {

    if (!memoryId) {
        throw new Error(
            "Recuerdo no válido."
        );
    }


    /*
     * O trigger SQL impede:
     *
     * - featured em pending
     * - featured em vídeo
     */

    const {
        data,
        error
    } = await supabase
        .from("guest_memories")
        .update({
            featured:
                Boolean(featured)
        })
        .eq(
            "id",
            memoryId
        )
        .eq(
            "status",
            "approved"
        )
        .eq(
            "type",
            "image"
        )
        .select()
        .maybeSingle();


    if (error) {
        throw error;
    }


    if (!data) {

        throw new Error(
            "Solo las fotografías publicadas pueden destacarse."
        );

    }


    return mapMemory(data);

}


/* ============================================================
   UNPUBLISH MEMORY
   ============================================================ */

export async function unpublishMemory(
    memoryId
) {

    if (!memoryId) {
        throw new Error(
            "Recuerdo no válido."
        );
    }


    /*
     * approved -> pending
     *
     * Nosso trigger automaticamente:
     *
     * approved_at = null
     * featured = false
     */

    const {
        data,
        error
    } = await supabase
        .from("guest_memories")
        .update({
            status:
                "pending",

            featured:
                false
        })
        .eq(
            "id",
            memoryId
        )
        .select()
        .single();


    if (error) {
        throw error;
    }


    return mapMemory(data);

}


/* ============================================================
   DISCARD MEMORY
   ============================================================ */

export async function discardMemory(
    memoryId
) {

    if (!memoryId) {
        throw new Error(
            "Recuerdo no válido."
        );
    }


    /*
     * 1. Buscamos o caminho real.
     */

    const {
        data: memory,
        error: findError
    } = await supabase
        .from("guest_memories")
        .select(`
            id,
            storage_path
        `)
        .eq(
            "id",
            memoryId
        )
        .maybeSingle();


    if (findError) {
        throw findError;
    }


    if (!memory) {

        throw new Error(
            "El recuerdo ya no existe."
        );

    }


    /*
     * 2. Eliminamos o arquivo físico.
     *
     * Se Storage falhar, NÃO apagamos
     * o registro do banco.
     */

    const {
        error: storageError
    } = await supabase
        .storage
        .from(
            SUPABASE_STORAGE_BUCKET
        )
        .remove([
            memory.storage_path
        ]);


    if (storageError) {

        console.error(
            "Admin storage deletion failed:",
            storageError
        );

        throw new Error(
            "No se pudo eliminar el archivo original."
        );

    }


    /*
     * 3. Eliminamos o registro.
     */

    const {
        error: databaseError
    } = await supabase
        .from("guest_memories")
        .delete()
        .eq(
            "id",
            memoryId
        );


    if (databaseError) {

        /*
         * Situação rara:
         *
         * o arquivo foi apagado,
         * mas a linha não.
         *
         * Registramos claramente para
         * poder detectar o problema.
         */

        console.error(
            "CRITICAL: Storage deleted but database row remained:",
            {
                memoryId,
                storagePath:
                    memory.storage_path,
                databaseError
            }
        );


        throw new Error(
            "El archivo fue eliminado, pero no se pudo finalizar el registro. Actualiza el panel."
        );

    }


    return true;

}


/* ============================================================
   STATISTICS
   ============================================================ */

export function calculateAdminStats(
    guests,
    memories
) {

    const safeGuests =
        Array.isArray(guests)
            ? guests
            : [];


    const safeMemories =
        Array.isArray(memories)
            ? memories
            : [];


    return {

        guests:
            safeGuests.length,

        pending:
            safeMemories.filter(
                memory =>
                    memory.status ===
                    "pending"
            ).length,

        approved:
            safeMemories.filter(
                memory =>
                    memory.status ===
                    "approved"
            ).length,

        featured:
            safeMemories.filter(
                memory =>
                    memory.status ===
                    "approved" &&
                    memory.featured ===
                    true
            ).length

    };

}


/* ============================================================
   SIGNED STORAGE URL
   ============================================================ */

export async function createSignedFileUrl(
    storagePath
) {

    if (!storagePath) {
        return null;
    }


    const {
        data,
        error
    } = await supabase
        .storage
        .from(
            SUPABASE_STORAGE_BUCKET
        )
        .createSignedUrl(
            storagePath,
            SIGNED_URL_DURATION
        );


    if (error) {

        console.warn(
            "Signed URL failed:",
            storagePath,
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
            row.file_name || "",

        mimeType:
            row.mime_type || "",

        duration:
            row.duration === null ||
            row.duration === undefined
                ? null
                : Number(
                    row.duration
                ),

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
   CROP HELPERS
   ============================================================ */

function normalizeCropValue(
    value,
    fallback
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return fallback;

    }


    return Math.min(
        100,
        Math.max(
            0,
            number
        )
    );

}


function normalizeZoom(
    value
) {

    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {

        return 1;

    }


    return Math.min(
        3,
        Math.max(
            1,
            number
        )
    );

}