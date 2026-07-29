# DATABASE

> Estrutura oficial do banco de dados do projeto Suzana & Juan.

---

# 1. Objetivo

O banco de dados será desenvolvido utilizando PostgreSQL através do Supabase.

Seu principal objetivo é centralizar todas as informações do casamento de forma organizada, segura e de fácil manutenção.

Mesmo sendo um projeto relativamente pequeno, a estrutura seguirá boas práticas de modelagem para facilitar futuras alterações.

---

# 2. Tecnologias

Banco de Dados

- PostgreSQL

Backend

- Supabase

Autenticação

- Supabase Auth (Área Administrativa)

Storage

- Supabase Storage

---

# 3. Estrutura Geral

O banco será dividido em módulos.

- Administração
- Convidados
- Famílias
- Confirmações
- Fotografias
- Configurações

Cada módulo possuirá suas próprias tabelas.

---

# 4. Tabela: administrators

Responsável pelos usuários administrativos.

Campos previstos

- id
- nome
- email
- senha (Auth)
- função
- criado_em
- atualizado_em

Funções possíveis

- Administrador
- Organizador

---

# 5. Tabela: families

Representa cada convite enviado.

Exemplo

Família Bruno

Quantidade permitida

4 pessoas

Cidade

Valencia

Categoria

Família

Observações

Nenhuma

Campos previstos

- id
- nome
- cidade
- categoria
- quantidade_permitida
- observacoes
- ativo

---

# 6. Tabela: guests

Lista oficial de convidados.

Campos previstos

- id
- nome
- family_id
- categoria
- idade
- telefone (opcional)
- observacoes
- ativo

Categorias

- Família
- Testigos
- Damas
- Caballeros
- Convidado

---

# 7. Tabela: RSVP

Solicitações enviadas pelo formulário.

Campos previstos

- id
- convidado
- email
- family_id
- comparecera
- restricao_alimentar
- observacoes
- status
- criado_em

Status

- Pendente
- Confirmado
- Recusado

---

# 8. Tabela: gallery_uploads

Fotografias enviadas pelos convidados.

Campos

- id
- autor
- email
- url
- legenda
- status
- aprovado_por
- enviado_em

Status

- Pendente
- Aprovado
- Rejeitado

---

# 9. Tabela: settings

Configurações gerais.

Exemplos

- Data do casamento
- Música
- Prazo RSVP
- Senha geral
- Idioma padrão
- Contato
- WhatsApp

---

# 10. Relacionamentos

Família

↓

Convidados

↓

RSVP

↓

Galeria

Todos os relacionamentos utilizarão chaves estrangeiras.

---

# 11. Segurança

Nenhuma tabela administrativa será pública.

Os convidados terão acesso apenas às operações necessárias.

Todas as permissões serão definidas utilizando Row Level Security (RLS).

---

# 12. Backup

O banco poderá ser exportado periodicamente.

Também será documentado como restaurar um backup caso necessário.

---

# 13. Escalabilidade

Novas tabelas poderão ser adicionadas futuramente sem alterar a estrutura existente.

---

# 14. Objetivo Final

Construir um banco de dados simples, seguro, organizado e fácil de administrar.