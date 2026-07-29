# ARCHITECTURE

> Arquitetura oficial do projeto Suzana & Juan.

---

# 1. Objetivo

Este documento define a arquitetura completa do sistema.

Seu propósito é garantir que todo o desenvolvimento siga uma estrutura consistente, modular e de fácil manutenção.

---

# 2. Arquitetura Geral

O projeto será dividido em duas grandes áreas.

## Área Pública

Destinada aos convidados.

Funções principais:

- Visualização das informações do casamento.
- Alteração de idioma.
- Contagem regressiva.
- Formulário de confirmação.
- Envio de fotografias.
- Galeria oficial.
- Contato.
- Reprodução da música oficial (sem autoplay).

---

## Área Administrativa

Destinada exclusivamente à organização.

Funções principais:

- Login administrativo.
- Gestão completa dos convidados.
- Gestão das famílias.
- Aprovação das confirmações.
- Aprovação das fotografias.
- Estatísticas.
- Configurações gerais.

---

# 3. Tecnologias

## Frontend

- HTML5
- CSS3
- JavaScript (ES Modules)

---

## Backend

Supabase

---

## Banco de Dados

PostgreSQL

---

## Hospedagem

GitHub Pages

---

# 4. Estrutura de Módulos

O JavaScript será dividido em módulos independentes.

Exemplos:

auth/

admin/

gallery/

rsvp/

countdown/

music/

language/

animations/

storage/

utils/

Cada módulo terá apenas uma responsabilidade.

---

# 5. Estrutura de Componentes

Os componentes serão reutilizáveis.

Exemplos:

Navbar

Hero

Button

Card

Gallery

Countdown

Language Switch

Footer

Toast

Modal

Upload

Form

Nenhum componente será duplicado.

---

# 6. Fluxo do Convidado

1. Acessa o site.
2. Digita a senha geral.
3. Escolhe o idioma.
4. Navega pelas seções.
5. Preenche o formulário de presença.
6. Recebe confirmação de recebimento.
7. Aguarda o retorno da organização por e-mail.

---

# 7. Fluxo da Organização

1. Login administrativo.
2. Visualiza novas solicitações.
3. Confere se o convidado existe na lista.
4. Aprova ou rejeita a solicitação.
5. Entra em contato pelo e-mail informado.
6. Atualiza o status da presença.

---

# 8. Fluxo da Galeria

1. Convidado envia uma fotografia.
2. A imagem fica em estado "pendente".
3. A administração analisa o conteúdo.
4. Se aprovada, passa para a galeria pública.
5. Se rejeitada, permanece privada.

---

# 9. Fluxo dos Idiomas

Todo texto exibido será carregado a partir dos arquivos de tradução.

Nenhum texto ficará fixo dentro do HTML.

Idiomas suportados:

- Español (padrão)
- Português

A arquitetura permitirá adicionar novos idiomas no futuro.

---

# 10. Segurança

- Senha geral para acesso ao site.
- Login exclusivo para administradores.
- Políticas de acesso no Supabase.
- Validação de formulários.
- Sanitização de entradas.
- Controle de permissões.
- Aprovação manual de conteúdo enviado pelos convidados.

---

# 11. Escalabilidade

A arquitetura foi planejada para permitir novas funcionalidades sem reestruturar o projeto.

Exemplos futuros:

- Vídeo da cerimônia.
- Mensagens dos convidados.
- Área privada para familiares.
- Download de fotografias.
- Linha do tempo do casamento.

---

# 12. Objetivo Final

Construir um sistema simples para o usuário, mas organizado internamente como um software profissional, facilitando manutenção, evolução e reutilização do código.