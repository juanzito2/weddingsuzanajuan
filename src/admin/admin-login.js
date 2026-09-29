/* ============================================================
   ADMIN LOGIN — SUZANA & JUAN
   ============================================================ */

import {
    supabase
} from "../scripts/services/supabaseClient.js";


/* ============================================================
   ELEMENTS
   ============================================================ */

const form =
    document.querySelector(
        "[data-admin-login-form]"
    );

const emailInput =
    document.querySelector(
        "[data-admin-email]"
    );

const passwordInput =
    document.querySelector(
        "[data-admin-password]"
    );

const passwordToggle =
    document.querySelector(
        "[data-password-toggle]"
    );

const message =
    document.querySelector(
        "[data-admin-message]"
    );

const submitButton =
    document.querySelector(
        "[data-admin-submit]"
    );

const submitText =
    document.querySelector(
        "[data-submit-text]"
    );

const submitSpinner =
    document.querySelector(
        "[data-submit-spinner]"
    );


/* ============================================================
   STATE
   ============================================================ */

let submitting = false;


/* ============================================================
   INIT
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initAdminLogin
);


async function initAdminLogin() {

    if (
        !form ||
        !emailInput ||
        !passwordInput
    ) {

        console.error(
            "Admin login: elementos necessários não encontrados."
        );

        return;
    }


    bindEvents();


    /*
     * Se já existe uma sessão válida de administrador,
     * não mostramos novamente a tela de login.
     */

    await redirectExistingAdmin();

}


/* ============================================================
   EVENTS
   ============================================================ */

function bindEvents() {

    form.addEventListener(
        "submit",
        handleLogin
    );


    passwordToggle?.addEventListener(
        "click",
        togglePasswordVisibility
    );


    emailInput.addEventListener(
        "input",
        clearMessage
    );


    passwordInput.addEventListener(
        "input",
        clearMessage
    );

}


/* ============================================================
   EXISTING SESSION
   ============================================================ */

async function redirectExistingAdmin() {

    try {

        const {
            data,
            error
        } =
            await supabase.auth
                .getSession();


        if (error) {
            throw error;
        }


        const session =
            data?.session;


        if (!session?.user) {
            return;
        }


        /*
         * Pode existir uma sessão anônima porque o mesmo
         * navegador visitou a área dos convidados.
         *
         * Portanto, existir sessão NÃO significa ser admin.
         */

        const isAdmin =
            await verifyAdmin();


        if (isAdmin) {

            redirectToDashboard();

            return;
        }


        /*
         * Uma sessão existente que não seja administrativa
         * não deve permanecer ativa nesta página.
         */

        await supabase.auth.signOut();

    }
    catch (error) {

        console.error(
            "Error verificando sesión existente:",
            error
        );


        /*
         * Não mostramos detalhes técnicos ao usuário.
         */

        try {

            await supabase.auth.signOut();

        }
        catch {
            // Nada a fazer.
        }

    }

}


/* ============================================================
   LOGIN
   ============================================================ */

async function handleLogin(event) {

    event.preventDefault();


    if (submitting) {
        return;
    }


    clearMessage();


    const email =
        emailInput.value
            .trim();


    const password =
        passwordInput.value;


    if (
        !email ||
        !password
    ) {

        showMessage(
            "Introduce tu correo electrónico y contraseña."
        );

        return;
    }


    if (
        !emailInput.validity.valid
    ) {

        showMessage(
            "Introduce un correo electrónico válido."
        );

        return;
    }


    setLoading(true);


    try {

        /*
         * 1. LOGIN REAL NO SUPABASE AUTH
         */

        const {
            data,
            error
        } =
            await supabase.auth
                .signInWithPassword({
                    email,
                    password
                });


        if (
            error ||
            !data?.user
        ) {

            /*
             * Mensagem genérica.
             *
             * Não informamos se foi email,
             * senha ou conta inexistente.
             */

            throw new Error(
                "INVALID_LOGIN"
            );

        }


        /*
         * 2. VERIFICAÇÃO DE ADMIN
         *
         * Login válido não significa que
         * o usuário possui acesso administrativo.
         */

        const isAdmin =
            await verifyAdmin();


        if (!isAdmin) {

            /*
             * Encerra imediatamente uma sessão
             * autenticada sem autorização admin.
             */

            await supabase.auth
                .signOut();


            throw new Error(
                "NOT_ADMIN"
            );

        }


        /*
         * 3. ADMIN AUTORIZADO
         */

        redirectToDashboard();

    }
    catch (error) {

        console.error(
            "Admin login rejected:",
            error
        );


        /*
         * Tentamos garantir que uma tentativa
         * não autorizada não deixe sessão ativa.
         */

        try {

            const {
                data
            } =
                await supabase.auth
                    .getSession();


            if (
                data?.session
            ) {

                const stillAdmin =
                    await verifyAdmin()
                        .catch(
                            () => false
                        );


                if (!stillAdmin) {

                    await supabase.auth
                        .signOut();

                }

            }

        }
        catch {
            // Evitamos expor detalhes internos.
        }


        showMessage(
            "No se ha podido autorizar el acceso. Comprueba tus credenciales."
        );


        passwordInput.value =
            "";


        passwordInput.focus();

    }
    finally {

        setLoading(false);

    }

}


/* ============================================================
   VERIFY ADMIN
   ============================================================ */

async function verifyAdmin() {

    /*
     * public.is_admin() executa no servidor.
     *
     * Não existe:
     *
     * const admin = true
     *
     * nem email administrativo salvo no JS.
     */

    const {
        data,
        error
    } =
        await supabase.rpc(
            "is_admin"
        );


    if (error) {

        console.error(
            "Error verificando permisos administrativos:",
            error
        );

        return false;
    }


    return data === true;

}


/* ============================================================
   PASSWORD VISIBILITY
   ============================================================ */

function togglePasswordVisibility() {

    const showing =
        passwordInput.type ===
        "text";


    passwordInput.type =
        showing
            ? "password"
            : "text";


    passwordToggle.setAttribute(
        "aria-label",
        showing
            ? "Mostrar contraseña"
            : "Ocultar contraseña"
    );

}


/* ============================================================
   LOADING
   ============================================================ */

function setLoading(value) {

    submitting =
        Boolean(value);


    submitButton.disabled =
        submitting;


    emailInput.disabled =
        submitting;


    passwordInput.disabled =
        submitting;


    if (passwordToggle) {

        passwordToggle.disabled =
            submitting;

    }


    if (submitText) {

        submitText.textContent =
            submitting
                ? "Verificando"
                : "Acceder";

    }


    if (submitSpinner) {

        submitSpinner.hidden =
            !submitting;

    }

}


/* ============================================================
   MESSAGE
   ============================================================ */

function showMessage(text) {

    if (!message) {
        return;
    }


    message.textContent =
        text;


    message.hidden =
        false;

}


function clearMessage() {

    if (!message) {
        return;
    }


    message.textContent =
        "";


    message.hidden =
        true;

}


/* ============================================================
   REDIRECT
   ============================================================ */

function redirectToDashboard() {

    /*
     * replace() evita deixar o login
     * imediatamente atrás no histórico.
     */

    window.location.replace(
        "./admin.html"
    );

}