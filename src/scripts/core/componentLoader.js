/**
 * ============================================================
 * COMPONENT LOADER
 * ============================================================
 *
 * Carrega um componente HTML e insere no container informado.
 *
 * Retorna:
 *
 * true  → componente carregado
 * false → erro
 *
 * ============================================================
 */

export async function loadComponent(
    containerId,
    componentPath
) {

    try {

        const response =
            await fetch(componentPath);


        if (!response.ok) {

            throw new Error(
                `Erro HTTP ${response.status}: ${componentPath}`
            );

        }


        const html =
            await response.text();


        const container =
            document.getElementById(containerId);


        if (!container) {

            throw new Error(
                `Container "${containerId}" não encontrado.`
            );

        }


        container.innerHTML =
            html;


        console.log(
            `✓ Componente carregado: ${componentPath}`
        );


        return true;


    } catch (error) {

        console.error(
            "Erro no Component Loader:",
            error
        );


        return false;

    }

}