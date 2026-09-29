/* ============================================================
   SUPABASE CLIENT — SUZANA & JUAN
   ============================================================ */

import {
    createClient
} from "https://esm.sh/@supabase/supabase-js@2";


/* ============================================================
   CONFIG
   ============================================================ */

const SUPABASE_URL =
    "https://gxcphuaxtpgyjcajevxi.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_rJNzOEHjNxv3ln7LZjXN2g_zjTH_y73";


/* ============================================================
   CLIENT
   ============================================================ */

export const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


/* ============================================================
   STORAGE
   ============================================================ */

export const SUPABASE_STORAGE_BUCKET =
    "guest-media";