/**
 * ============================================================
 * COMPONENT LOADER
 * ------------------------------------------------------------
 * Carrega um componente HTML, seu CSS e o insere no container.
 *
 * Estrutura esperada:
 *
 * componente/
 * ├── componente.html
 * ├── componente.css
 * └── componente.js
 *
 * Exemplo:
 *
 * hero/
 * ├── hero.html
 * ├── hero.css
 * └── hero.js
 * ============================================================
 */


/**
 * ============================================================
 * LOAD COMPONENT
 * ============================================================
 */

export async function loadComponent(
    containerId,
    componentPath
) {

    try {

        // ------------------------------------------------------
        // FETCH HTML
        // ------------------------------------------------------

        const response = await fetch(componentPath);


        if (!response.ok) {

            throw new Error(
                `Erro ao carregar o componente: ${componentPath}`
            );

        }


        const html = await response.text();


        // ------------------------------------------------------
        // FIND CONTAINER
        // ------------------------------------------------------

        const container =
            document.getElementById(containerId);


        if (!container) {

            throw new Error(
                `Container "${containerId}" não encontrado.`
            );

        }


        // ------------------------------------------------------
        // LOAD COMPONENT CSS
        // ------------------------------------------------------

        await loadComponentStylesheet(
            componentPath
        );


        // ------------------------------------------------------
        // INSERT HTML
        // ------------------------------------------------------

        container.innerHTML = html;


        console.log(
            `✓ Componente carregado: ${componentPath}`
        );


    } catch (error) {

        console.error(
            "Erro no Component Loader:",
            error
        );

    }

}


/**
 * ============================================================
 * LOAD COMPONENT STYLESHEET
 * ------------------------------------------------------------
 * Descobre automaticamente o CSS correspondente ao HTML.
 *
 * hero.html
 *     ↓
 * hero.css
 * ============================================================
 */

async function loadComponentStylesheet(
    componentPath
) {

    // ----------------------------------------------------------
    // REMOVE .html
    // ----------------------------------------------------------

    const stylesheetPath =
        componentPath.replace(
            /\.html$/,
            ".css"
        );


    // ----------------------------------------------------------
    // CHECK IF CSS ALREADY EXISTS
    // ----------------------------------------------------------

    const existingStylesheet =
        document.querySelector(
            `link[data-component-css="${stylesheetPath}"]`
        );


    if (existingStylesheet) {

        return;

    }


    // ----------------------------------------------------------
    // CREATE LINK
    // ----------------------------------------------------------

    const link =
        document.createElement("link");


    link.rel = "stylesheet";

    link.href = stylesheetPath;

    link.dataset.componentCss =
        stylesheetPath;


    // ----------------------------------------------------------
    // WAIT FOR CSS
    // ----------------------------------------------------------

    await new Promise((resolve, reject) => {

        link.onload = resolve;

        link.onerror = () => {

            console.warn(
                `CSS não encontrado para o componente: ${stylesheetPath}`
            );

            resolve();

        };

        document.head.appendChild(link);

    });

}