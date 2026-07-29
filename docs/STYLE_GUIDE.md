# STYLE_GUIDE

> Manual oficial de desenvolvimento do projeto Suzana & Juan.

---

# 1. Objetivo

Este documento define todas as convenções utilizadas durante o desenvolvimento.

Seu propósito é garantir que qualquer alteração futura mantenha o mesmo padrão de qualidade.

Todo código escrito deverá seguir estas diretrizes.

---

# 2. Filosofia

O projeto deverá ser:

Simples de entender.

Fácil de manter.

Bem documentado.

Organizado.

Escalável.

Legível.

Cada arquivo deverá parecer escrito pela mesma pessoa.

---

# 3. Estrutura HTML

Todo HTML deverá ser semântico.

Priorizar:

header

main

section

article

aside

footer

nav

button

form

figure

picture

Nunca utilizar div quando existir uma tag semântica mais adequada.

---

# 4. Organização das Seções

Cada seção deverá seguir sempre a mesma estrutura.

Exemplo

Comentário

↓


Section

↓

Container

↓

Header da seção

↓

Conteúdo

↓

Fechamento

---

# 5. Comentários HTML

Toda seção deverá começar com um comentário.

Exemplo

<!-- ========================= -->

<!-- Hero -->

<!-- ========================= -->

Isso facilita localizar rapidamente qualquer parte do projeto.

---

# 6. CSS

Todo CSS será dividido por responsabilidade.

Base

Layout

Componentes

Páginas

Animações

Temas

Utilidades

Nunca criar arquivos gigantes.

---

# 7. Variáveis CSS

Todas as cores deverão utilizar Custom Properties.

Jamais escrever valores HEX diretamente dentro dos componentes.

Exemplo

--color-primary

--color-gold

--color-surface

--spacing-lg

--radius-xl

---

# 8. Ordem das Propriedades

Sempre seguir a mesma ordem.

Posicionamento

Display

Dimensões

Margin

Padding

Border

Background

Tipografia

Transform

Transition

Animation

Outros

---

# 9. Componentes

Cada componente deverá possuir seu próprio arquivo.

Exemplo

button.css

card.css

navbar.css

gallery.css

countdown.css

Nunca misturar componentes.

---

# 10. JavaScript

Todo JavaScript será modular.

Nenhum arquivo deverá concentrar toda a lógica.

Cada módulo possuirá apenas uma responsabilidade.

---

# 11. Nome das Funções

As funções deverão utilizar nomes descritivos.

Exemplos

loadGallery()

renderCountdown()

changeLanguage()

sendRSVP()

approvePhoto()

Nunca utilizar nomes genéricos.

---

# 12. Comentários JavaScript

Explicar o motivo.

Nunca explicar o óbvio.

Comentários devem facilitar futuras manutenções.

---

# 13. Imports

Todos os imports deverão permanecer organizados.

Bibliotecas

↓

Componentes

↓

Utilidades

↓

Constantes

---

# 14. Tratamento de Erros

Toda operação assíncrona deverá possuir tratamento adequado.

O usuário nunca verá mensagens técnicas.

Sempre receberá mensagens amigáveis.

---

# 15. Arquivos

Utilizar nomes consistentes.

Exemplos

gallery.js

countdown.js

hero.css

footer.css

Nunca utilizar espaços.

Nunca utilizar acentos.

---

# 16. Imagens

Todas deverão possuir:

Alt

Boa resolução

Compressão

Nome padronizado

Sempre utilizar formatos modernos quando possível.

---

# 17. SVG

Todos os ícones serão SVG.

Nunca PNG quando existir alternativa vetorial.

---

# 18. Fontes

As fontes serão hospedadas localmente.

Nunca depender de CDN.

Utilizar apenas as famílias definidas no Brandbook.

---

# 19. Responsividade

Todo componente deverá funcionar em:

Mobile

Tablet

Notebook

Desktop

Ultra Wide

---

# 20. Acessibilidade

Todos os elementos interativos deverão possuir:

Focus

ARIA quando necessário

Contraste adequado

Texto alternativo

---

# 21. Performance

Priorizar:

Lazy Loading

Code Splitting

Compressão

Pré-carregamento estratégico

Poucas dependências externas

---

# 22. SEO

Toda página deverá possuir:

Title

Description

Open Graph

Canonical

Structured Data

---

# 23. Internacionalização

Nenhum texto ficará diretamente no HTML.

Todo conteúdo será carregado pelo sistema de tradução.

---

# 24. Git

Commits pequenos.

Commits descritivos.

Uma alteração por commit sempre que possível.

---

# 25. Documentação

Sempre que um novo módulo for criado.

Sua documentação deverá ser atualizada.

O código nunca poderá evoluir sem atualizar a documentação correspondente.

---

# 26. Objetivo Final

Escrever código que permaneça organizado, compreensível e fácil de manter durante muitos anos.