# Sistema de Biblioteca - Guia do Usuário

Este documento descreve como utilizar o sistema de biblioteca, incluindo autenticação, empréstimos, reservas e outras funcionalidades.

## Índice

1. [Visão Geral](#visao-geral)
2. [Autenticação](#autenticacao)
3. [Explorar Catálogo](#explorar-catálogo)
4. [Reservar e Pegar Emprestado](#reservar-e-pegat-emprestado)
5. [Meus Empréstimos](#meus-empréstimos)
6. [Área Administrativa](#area-administrativa)
7. [Perguntas Frequentes](#perguntas-frequentes)

## Visão Geral

O Sistema de Biblioteca é uma plataforma completa para gerenciar empréstimos de livros. Os usuários podem:

- Criar uma conta e fazer login
- Explorar o catálogo de livros disponíveis
- Reservar livros (quando não disponíveis)
- Pegar livros emprestados (quando disponíveis)
- Acompanhar seus empréstimos ativos
- Devolver livros em atraso
- Acessar a área administrativa (para administradores)

## Autenticação

### Login

1. Clique em **"Entrar"** no menu superior
2. Preencha seu e-mail e senha
3. Clique em **"Entrar"**

### Cadastro

1. Clique em **"Cadastre-se"** no menu superior
2. Preencha seus dados: nome, e-mail e senha
3. Clique em **"Cadastrar"**

> **Nota:** Novos cadastros entram como `Member` com aprovação pendente (`IsApproved = false`). Usuários pendentes não conseguem logar até aprovação administrativa.

### Recuperação de Senha

Se você esqueceu sua senha, entre em contato com o administrador do sistema.

## Explorar Catálogo

### Navegação

1. Clique em **"Catálogo"** no menu superior
2. Visualize todos os livros disponíveis

### Recursos do Catálogo

- **Busca:** Use a barra de pesquisa para encontrar livros por título, autor ou categoria
- **Filtros:** Use os filtros avançados para refinar sua busca
- **Visualização:** Veja os detalhes de cada livro antes de reservar

### Ações Disponíveis

- **Pegar Emprestado:** Disponível apenas para livros com cópias disponíveis
- **Reservar:** Disponível para livros sem cópias disponíveis (cria uma reserva)
- **Ver Detalhes:** Acesse informações completas sobre o livro

## Reservar e Pegar Emprestado

### Reservar Livro

1. Encontre um livro no catálogo
2. Clique em **"Reservar"** (se o livro estiver sem cópias disponíveis)
3. O livro será reservado para você
4. Você será notificado quando o livro estiver disponível

### Pegar Livro Emprestado

1. Encontre um livro no catálogo
2. Clique em **"Pegar Emprestado"** (se o livro tiver cópias disponíveis)
3. O empréstimo será criado automaticamente
4. O prazo de devolução será de 14 dias

### Regras de Empréstimo

- **Limite de Empréstimos:** Máximo de 3 empréstimos ativos por usuário
- **Prazo Padrão:** 14 dias para devolução
- **Empréstimos em Atraso:** Usuários com empréstimos em atraso não podem realizar novos empréstimos
- **Verificação de Disponibilidade:** O sistema verifica automaticamente a disponibilidade do livro antes de criar um empréstimo

## Meus Empréstimos

### Acessar

1. Clique em **"Perfil"** no menu superior
2. Clique em **"Meus Empréstimos"**

### Acompanhamento de Empréstimos

A página exibe todos os seus empréstimos, organizados por status:

- **Ativos:** Empréstimos atualmente válidos
- **Em Atraso:** Empréstimos com data de devolução passada
- **Reservados:** Livros reservados aguardando disponibilidade
- **Devolvidos:** Histórico de empréstimos concluídos

### Ações Disponíveis

- **Devolver:** Conclua um empréstimo ativo ou em atraso
- **Converter:** Transforme uma reserva em um empréstimo ativo (quando o livro fica disponível)

### Alertas de Atraso

O sistema exibe alertas visuais para empréstimos em atraso:

- **Banner Vermelho:** Indica empréstimos em atraso
- **Texto Vermelho:** Destaca datas de vencimento passadas
- **Ação Imediata:** Botão "Devolver" destacado para empréstimos em atraso

## Área Administrativa

### Acesso

Apenas usuários com função `Admin` podem acessar a área administrativa:

1. Faça login com uma conta de administrador
2. Clique em **"Admin"** no menu superior (desktop) ou na barra inferior (mobile)
3. Navegue pelas diferentes seções

### Funcionalidades Administrativas

#### Gerenciamento de Usuários

- **Listar Usuários:** Visualize todos os usuários com filtros por nome, status de aprovação e função
- **Aprovar Usuários:** Aprovar contas pendentes (`IsApproved = false`)
- **Gerenciar Funções:** Atribuir funções `Admin` ou `Member` a usuários

#### Gerenciamento de Livros

- **Listar Livros:** Visualize todos os livros no catálogo
- **Adicionar Livros:** Cadastre novos livros no sistema
- **Atualizar Livros:** Modifique informações de livros existentes
- **Remover Livros:** Exclua livros do catálogo

#### Gerenciamento de Empréstimos

- **Listar Empréstimos:** Visualize todos os empréstimos do sistema
- **Monitorar Atrasos:** Identifique empréstimos em atraso
- **Ações em Massa:** Realize ações em vários empréstimos

## Perguntas Frequentes

### Q: Posso reservar um livro se já tenho 3 empréstimos ativos?

R: Não. O sistema bloqueia novas reservas se você já tiver 3 empréstimos ativos. Você deve devolver um livro antes de poder reservar outro.

### Q: O que acontece se eu não devolver um livro em dia?

R: O empréstimo será marcado como `Overdue` (em atraso). Você não poderá realizar novos empréstimos até regular a situação.

### Q: Como vejo o status de um empréstimo?

R: O status é exibido em cada empréstimo:
- `Reserved`: Livro reservado aguardando disponibilidade
- `Active`: Livro emprestado e válido
- `Overdue`: Empréstimo em atraso
- `Returned`: Empréstimo concluído

### Q: Posso cancelar uma reserva?

R: Sim. As reservas podem ser canceladas antes da conversão em empréstimo.

### Q: Como entro em contato com o suporte?

R: Se tiver problemas, entre em contato com o administrador do sistema através do e-mail de suporte.

## Suporte

Para dúvidas, problemas ou solicitações de ajuda:

1. Acesse a área administrativa
2. Entre em contato com o administrador do sistema
3. Reporte o problema através do sistema de tickets

## Atualizações e Novidades

Acompanhe as atualizações do sistema na página inicial ou entre em contato com o administrador para saber sobre:

- Novos livros adicionados
- Funcionalidades aprimoradas
- Correções de bugs
- Manutenções programadas

## Licença

Este sistema está sob a licença [MIT](LICENSE). Consulte a documentação completa para mais informações.
