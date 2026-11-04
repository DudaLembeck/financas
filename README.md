# Finanças – Controle financeiro pessoal

App mobile (Ionic + Vue 3 + TypeScript) com Supabase e Vue ApexCharts.

## Funcionalidades
- Login, cadastro e logout (Supabase Auth)
- CRUD de receitas e despesas (descrição, valor, categoria, data) com validação
- Dashboard: cards (receitas, despesas, saldo), gráfico de pizza (despesas por categoria),
  gráfico de barras (receitas x despesas por mês), maior categoria de gasto,
  quantidade de lançamentos e % de despesas sobre receitas
- Extras: **filtro por período** (tudo / mês / 3 meses / ano) e **modo escuro**

## Como rodar
1. `npm install`
2. `npm install @supabase/supabase-js vue3-apexcharts apexcharts`
3. Crie um projeto em https://supabase.com
4. No **SQL Editor**, execute o conteúdo de `supabase.sql`
5. Substituia`.env` e preencha URL e anon key (Project Settings > API) com a do seu projeto.
6. (Opcional, para testes) Authentication > Providers > Email > desative **Confirm email**
7. `npm run dev` (ou `ionic serve`)

## Estrutura
```
src/
  lib/supabase.ts          cliente Supabase
  composables/             useAuth, useLancamentos, useTheme
  components/              LancamentosPage, LancamentoFormModal, SummaryCards, gráficos
  views/                   Login, Cadastro, Dashboard, Receitas, Despesas, Tabs
  router/index.ts          rotas + guarda de autenticação
```

## Banco de dados
`receitas` e `despesas` (id, descricao, valor, categoria, data, user_id → auth.users.id),
com Row Level Security: cada usuário acessa somente os próprios dados.
