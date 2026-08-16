/**
 * ============================================================
 * COMPONENT LOADER
 * ============================================================
 *
 * Responsável por:
 *
 * 1. Buscar um arquivo HTML
 * 2. Encontrar o container
 * 3. Inserir o componente
 * 4. Informar erros no console
 *
 * ============================================================
 */

export async function loadComponent(
    containerId,
    componentPath
) {

    try {


        /* ====================================================
           BUSCAR COMPONENTE
        ==================================================== */

        const response =
            await fetch(componentPath);


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status} ao carregar ${componentPath}`
            );

        }


        /* ====================================================
           CONVERTER RESPOSTA PARA HTML
        ==================================================== */

        const html =
            await response.text();


        /* ====================================================
           PROCURAR CONTAINER
        ==================================================== */

        const container =
            document.getElementById(containerId);


        if (!container) {

            throw new Error(
                `Container "${containerId}" não encontrado.`
            );

        }


        /* ====================================================
           INSERIR COMPONENTE
        ==================================================== */

        container.innerHTML =
            html;


        /* ====================================================
           LOG
        ==================================================== */

        console.log(
            `✓ Componente carregado: ${componentPath}`
        );


        /* ====================================================
           RETORNAR CONTAINER
        ==================================================== */

        return container;


    } catch (error) {


        console.error(
            "Erro no Component Loader:",
            error
        );


        return null;

    }

}