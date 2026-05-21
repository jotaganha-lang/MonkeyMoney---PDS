# RELATÓRIO DE PROJETO

---

## Ficha do trabalho

| | |
|---|---|
| **Disciplina** | Projeto de Desenvolvimento de Software (PDS) |
| **Título do projeto** | MonkeyMoney — Plataforma de Literacia Financeira |
| **Ano letivo** | 2025/2026 |
| **Turma** | 12.º P |
| **Slogan** | *Aprender a gerir hoje para viver melhor amanhã.* |
| **Tipo de trabalho** | Relatório descritivo do projeto desenvolvido |
| **Data** | Maio de 2026 |

---

## Elementos do grupo

| N.º | Nome |
|-----|------|
| 13 | João Andrade |
| 14 | Julien Manolico |
| 16 | Lucas Uchôa |

---

## Índice

1. [Resumo](#1-resumo)
2. [Introdução](#2-introdução)
3. [Objetivos](#3-objetivos)
4. [Enquadramento e justificação](#4-enquadramento-e-justificação)
5. [Tecnologias utilizadas](#5-tecnologias-utilizadas)
6. [Arquitetura da aplicação](#6-arquitetura-da-aplicação)
7. [Funcionalidades desenvolvidas](#7-funcionalidades-desenvolvidas)
8. [Base de dados](#8-base-de-dados)
9. [Segurança](#9-segurança)
10. [Interface e experiência do utilizador](#10-interface-e-experiência-do-utilizador)
11. [Persistência de dados](#11-persistência-de-dados)
12. [Estrutura do projeto](#12-estrutura-do-projeto)
13. [Instalação e execução](#13-instalação-e-execução)
14. [Dificuldades encontradas e soluções](#14-dificuldades-encontradas-e-soluções)
15. [Limitações e trabalho futuro](#15-limitações-e-trabalho-futuro)
16. [Conclusão](#16-conclusão)
17. [Bibliografia e referências](#17-bibliografia-e-referências)

---

## 1. Resumo

O **MonkeyMoney** é uma aplicação web desenvolvida no âmbito da disciplina de Projeto de Desenvolvimento de Software. A plataforma destina-se a jovens que pretendem aprender a gerir o dinheiro de forma consciente, combinando ferramentas práticas (registo de movimentos, orçamento, metas e simulador) com conteúdos educativos e um quiz de literacia financeira.

A solução foi implementada com **Next.js**, **TypeScript**, **Tailwind CSS** e **Supabase** (autenticação e base de dados). O relatório descreve os objetivos, a arquitetura, as funcionalidades, a segurança e o estado atual do projeto, incluindo melhorias realizadas durante o desenvolvimento.

---

## 2. Introdução

A gestão financeira pessoal é uma competência essencial, mas pouco trabalhada de forma prática no ensino secundário. Muitos jovens não têm ferramentas simples para registar receitas e despesas, definir objetivos de poupança ou compreender conceitos como inflação, juros compostos ou a regra 50/30/20.

Este projeto surge para responder a essa necessidade: criar uma plataforma acessível, em português, que una **educação** e **prática**. O utilizador pode criar conta, registar movimentos, visualizar o saldo no dashboard, planear o orçamento, simular investimentos ao longo do tempo e testar os seus conhecimentos num quiz.

O presente documento constitui o relatório oficial do trabalho, destinado à apresentação e avaliação escolar.

---

## 3. Objetivos

### 3.1 Objetivo geral

Desenvolver uma aplicação web de literacia financeira que permita aos utilizadores gerir e aprender sobre as suas finanças pessoais.

### 3.2 Objetivos específicos

- Implementar um sistema de **registo e autenticação** seguro;
- Permitir o **registo de receitas e despesas** com categorias e filtros;
- Apresentar um **dashboard** com saldo, totais e gráficos;
- Oferecer ferramentas de **orçamento**, **metas de poupança** e **simulador financeiro**;
- Disponibilizar **conteúdos educativos** e um **quiz** interativo;
- Garantir **persistência de dados** associada à conta do utilizador;
- Aplicar boas práticas de **interface**, **validação de formulários** e **segurança** (MFA).

---

## 4. Enquadramento e justificação

A literacia financeira inclui a capacidade de interpretar informação económica, planear um orçamento, poupar e evitar endividamento desnecessário. Segundo orientações de organizações como a OCDE e o Banco de Portugal, a educação financeira deve começar cedo e usar linguagem clara.

A MonkeyMoney posiciona-se como uma ferramenta **gratuita e orientada a jovens**, com design moderno e funcionalidades progressivas: começa-se por registar movimentos e evolui-se para metas, simulações e testes de conhecimento. O projeto integra competências de **programação web full-stack**, **bases de dados**, **UX/UI** e **trabalho em equipa**.

---

## 5. Tecnologias utilizadas

| Área | Tecnologia | Função no projeto |
|------|------------|-------------------|
| Framework web | Next.js 16 | Rotas, renderização, App Router |
| Linguagem | TypeScript 5 | Tipagem e manutenção do código |
| Interface | React 19 | Componentes interativos |
| Estilos | Tailwind CSS 4 | Layout responsivo e design system |
| Backend / Auth / BD | Supabase | Utilizadores, sessões, PostgreSQL |
| Formulários | React Hook Form + Zod | Validação de dados |
| Gráficos | Recharts | Dashboard e simulador |
| Notificações | Sonner | Mensagens de sucesso/erro |

---

## 6. Arquitetura da aplicação

A aplicação divide-se em três zonas principais:

```
┌─────────────────────────────────────────────────────────┐
│                    ÁREA PÚBLICA                        │
│  Landing (/)  →  Login / Registo / Recuperar password │
└──────────────────────────┬──────────────────────────────┘
                           │ sessão válida
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   ÁREA PRIVADA (AppShell)                │
│  Dashboard │ Movimentos │ Metas │ Orçamento │ Simulador │
│  Aprender  │ Quiz       │ Perfil │ Segurança            │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              PERSISTÊNCIA DE DADOS                       │
│  localStorage (por utilizador)  +  Supabase (nuvem)     │
└─────────────────────────────────────────────────────────┘
```

- As **rotas privadas** verificam no servidor se existe utilizador autenticado; caso contrário, redirecionam para o login.
- O **menu lateral** (`AppShell`) mantém a navegação consistente em todas as páginas da aplicação.

---

## 7. Funcionalidades desenvolvidas

### 7.1 Página inicial (Landing Page)

Apresentação do projeto, slogan, estatísticas (conteúdos, perguntas do quiz, ferramentas) e botões para criar conta ou entrar. Tema visual escuro com detalhes em verde.

### 7.2 Autenticação

- Registo de nova conta;
- Login com email e palavra-passe;
- Recuperação e redefinição de palavra-passe;
- Verificação em dois passos (MFA) por código enviado por email, quando ativada nas definições de segurança.

### 7.3 Dashboard

- Cartões com **saldo total**, **receitas**, **despesas** e **número de movimentos**;
- Gráfico de evolução mensal (receitas vs despesas);
- Lista das últimas transações;
- Mensagem orientadora quando ainda não existem movimentos.

### 7.4 Movimentos financeiros

- Criar, editar e eliminar receitas e despesas;
- Categorias específicas (ex.: Alimentação, Transportes, Salário, Bolsa);
- Método de pagamento e data;
- Pesquisa por título e filtro por tipo;
- Validação dos campos obrigatórios antes de guardar.

### 7.5 Metas de poupança

- Definir objetivo com valor alvo;
- Registar depósitos parciais;
- Estados: ativa, pausada ou concluída;
- Barra de progresso visual.

### 7.6 Orçamento

- Categorias com limite mensal (ex.: alimentação, lazer, saúde);
- Registo de gastos por categoria;
- Alertas quando o gasto se aproxima ou ultrapassa o limite.

### 7.7 Simulador financeiro

- Parâmetros: capital inicial, aporte mensal, taxa de juro anual e número de anos;
- Cálculo com juros compostos mensais;
- Gráfico da evolução da poupança ao longo do tempo.

### 7.8 Secção «Aprender»

Mais de **10 artigos** sobre orçamento, poupança, investimento, dívida e impostos, com tempo de leitura estimado e texto explicativo (ex.: regra 50/30/20, reserva de emergência, inflação).

### 7.9 Quiz

**15 perguntas** em três categorias (básico, poupança, investimento), com feedback após cada resposta e pontuação final.

### 7.10 Segurança

Página para ativar ou desativar a verificação em dois passos (MFA) ligada ao perfil na base de dados.

---

## 8. Base de dados

A base de dados PostgreSQL no Supabase inclui, entre outras, as seguintes tabelas:

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Dados do perfil (nome, MFA, moeda) |
| `transactions` | Movimentos financeiros do utilizador |
| `saving_goals` | Metas de poupança |
| `expense_categories` / `income_categories` | Categorias personalizadas |
| `financial_tips` | Dicas financeiras (conteúdo seed) |
| `quiz_questions` | Perguntas do quiz (estrutura preparada) |
| `quiz_attempts` | Histórico de tentativas |
| `user_security_settings` | Definições de segurança |
| `login_audit` | Registo de tentativas de login |

Foi aplicada **Row Level Security (RLS)**: cada utilizador só acede aos seus próprios registos.

O ficheiro `monkeymoney/supabase/schema.sql` contém o script completo de criação das tabelas, políticas e triggers.

---

## 9. Segurança

- Palavra-passe com mínimo de 8 caracteres (validação no formulário);
- Autenticação gerida pelo Supabase Auth;
- MFA opcional por email (código OTP);
- Proteção das rotas privadas no servidor;
- Políticas RLS na base de dados.

Recomenda-se que as chaves do Supabase sejam configuradas apenas no ficheiro `.env.local` e não partilhadas publicamente.

---

## 10. Interface e experiência do utilizador

- **Páginas públicas e de login:** tema escuro, tipografia clara, botões em verde esmeralda;
- **Área autenticada:** fundo claro, cartões brancos, cor de destaque teal/verde;
- Menu lateral com ícones e nomes das secções;
- Formulários com mensagens de erro compreensíveis;
- Notificações toast para confirmar ações (ex.: sessão terminada, MFA ativado).

Durante o desenvolvimento foi corrigido um problema de **texto claro sobre fundo claro** (letras invisíveis nos formulários), ajustando as cores na área privada da aplicação.

---

## 11. Persistência de dados

| Funcionalidade | Onde são guardados os dados |
|----------------|----------------------------|
| Movimentos financeiros | `localStorage` por utilizador + tabela `transactions` (Supabase) |
| Metas de poupança | `localStorage` por utilizador |
| Orçamento | `localStorage` por utilizador |
| Quiz e artigos «Aprender» | Dados incorporados no código da aplicação |
| Conta e perfil | Supabase Auth + tabela `profiles` |

Foi implementada migração automática de dados antigos (chave global) para chave associada ao ID do utilizador, evitando perda de movimentos ao iniciar sessão.

---

## 12. Estrutura do projeto

```
MonkeyMoney - PDS/
├── RELATORIO_MONKEYMONEY.md    ← este relatório
└── monkeymoney/
    ├── src/
    │   ├── app/                 # Páginas e rotas
    │   ├── components/          # Componentes reutilizáveis
    │   ├── hooks/               # Lógica partilhada (auth, transações)
    │   └── lib/                 # Supabase, utilitários, conteúdos
    ├── supabase/
    │   └── schema.sql           # Script da base de dados
    ├── public/                  # Imagens e ícones
    ├── package.json
    └── README.md
```

---

## 13. Instalação e execução

### Requisitos

- Node.js (versão LTS recomendada);
- Conta Supabase com projeto criado;
- Ficheiro `.env.local` com as variáveis do Supabase.

### Passos

1. Abrir a pasta `monkeymoney` no terminal;
2. Executar `npm install`;
3. Configurar `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`;
4. Executar o script `supabase/schema.sql` no editor SQL do Supabase;
5. Executar `npm run dev` e aceder a `http://localhost:3000`.

Para verificar que o projeto compila sem erros: `npm run build`.

---

## 14. Dificuldades encontradas e soluções

| Problema | Solução adotada |
|--------|-----------------|
| Texto branco invisível em formulários com fundo branco | Definição de `text-slate-900` na área privada e regras CSS nos inputs |
| Saldo e movimentos «resetavam» após recarregar | Persistência por utilizador + sincronização com Supabase |
| Dashboard e página de movimentos desatualizados | Hook partilhado `useTransactions` e recarregamento ao focar a janela |
| Dados de contas diferentes misturados | Chaves de `localStorage` com sufixo do ID do utilizador |

---

## 15. Limitações e trabalho futuro

- Metas e orçamento ainda não estão totalmente integrados na base de dados Supabase;
- O quiz e os artigos da secção «Aprender» estão no código; no futuro podem ser carregados da BD;
- As páginas de perfil e definições podem ser expandidas (editar nome, avatar, moeda);
- Guardar histórico de tentativas do quiz na tabela `quiz_attempts`;
- Alterar o idioma do documento HTML de `en` para `pt` no layout principal.

---

## 16. Conclusão

O projeto **MonkeyMoney** cumpre o objetivo de disponibilizar uma plataforma educativa e prática para a gestão financeira pessoal. A equipa desenvolveu uma aplicação web moderna, com autenticação segura, várias ferramentas úteis e conteúdo formativo em português.

O trabalho demonstra competências em desenvolvimento front-end e back-end, integração com serviços na nuvem, desenho de interface e resolução de problemas reais (persistência de dados e legibilidade do texto). O projeto está funcional e preparado para evolução futura, nomeadamente com maior ligação entre todas as funcionalidades e a base de dados Supabase.

---

## 17. Bibliografia e referências

- Next.js — Documentação oficial: https://nextjs.org/docs  
- Supabase — Documentação oficial: https://supabase.com/docs  
- React — Documentação oficial: https://react.dev  
- Tailwind CSS — Documentação oficial: https://tailwindcss.com/docs  
- OCDE (2017) — *PISA 2015 Results: Students’ Financial Literacy*  
- Banco de Portugal — Educação financeira: https://www.bportugal.pt/educacaofinanceira  
- Ficheiros do projeto: `monkeymoney/README.md`, `monkeymoney/supabase/schema.sql`

---

<div align="center">

**MonkeyMoney** — Turma 12.º P — 2025/2026

*João Andrade (n.º 13) · Julien Manolico (n.º 14) · Lucas Uchôa (n.º 16)*

</div>
