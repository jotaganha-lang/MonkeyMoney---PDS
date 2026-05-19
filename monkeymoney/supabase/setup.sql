-- ============================================================
-- MonkeyMoney — Supabase Setup
-- Executa este ficheiro no SQL Editor do Supabase Dashboard
-- ============================================================

-- 1. Tabela de perfis
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  mfa_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Ativar Row Level Security
alter table public.profiles enable row level security;

-- 3. Políticas de acesso
create policy "Utilizador vê o seu próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Utilizador atualiza o seu próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Inserção automática de perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 4. Trigger para criar perfil automaticamente no registo
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Utilizador')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 5. Criar o trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Função para atualizar updated_at automaticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
