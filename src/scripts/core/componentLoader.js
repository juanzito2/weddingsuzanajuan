/**
 * ============================================================
 * Component Loader
 * ------------------------------------------------------------
 * Carrega um componente HTML e o insere dentro de um elemento.
 * ============================================================
 */

export async function loadComponent(containerId, componentPath) {

    try {

        const response = await fetch(componentPath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar ${componentPath}`);
        }

        const html = await response.text();

        document
            .getElementById(containerId)
            .insertAdjacentHTML("beforeend", html);

    } catch (error) {

        console.error(error);

    }

}