-- Rode no Supabase: SQL Editor > New query > Run

create table if not exists public.receitas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric(12,2) not null check (valor > 0),
  categoria text not null,
  data date not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade
);

create table if not exists public.despesas (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric(12,2) not null check (valor > 0),
  categoria text not null,
  data date not null,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade
);

create index if not exists receitas_user_idx on public.receitas(user_id);
create index if not exists despesas_user_idx on public.despesas(user_id);

alter table public.receitas enable row level security;
alter table public.despesas enable row level security;

create policy "receitas_select" on public.receitas for select using (auth.uid() = user_id);
create policy "receitas_insert" on public.receitas for insert with check (auth.uid() = user_id);
create policy "receitas_update" on public.receitas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "receitas_delete" on public.receitas for delete using (auth.uid() = user_id);

create policy "despesas_select" on public.despesas for select using (auth.uid() = user_id);
create policy "despesas_insert" on public.despesas for insert with check (auth.uid() = user_id);
create policy "despesas_update" on public.despesas for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "despesas_delete" on public.despesas for delete using (auth.uid() = user_id);
