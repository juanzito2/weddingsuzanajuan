export async function loadComponent(
componentPath,
containerId
) {


try {

    const container =
        document.getElementById(containerId);


    if (!container) {

        throw new Error(
            `Container "${containerId}" não encontrado.`
        );

    }


    const response =
        await fetch(componentPath);


    if (!response.ok) {

        throw new Error(
            `Não foi possível carregar ${componentPath}`
        );

    }


    const html =
        await response.text();


    const template =
        document.createElement("template");


    template.innerHTML =
        html.trim();


    const content =
        template.content.cloneNode(true);


    container.appendChild(content);


    console.log(
        `✓ Componente carregado: ${componentPath}`
    );


    return true;


} catch (error) {

    console.error(
        "❌ Erro no Component Loader:",
        error
    );


    return false;

}


}
