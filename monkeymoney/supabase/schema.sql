create extension if not exists "pgcrypto";

do $$ begin
    create type transaction_type as enum ('income', 'expense');
exception when duplicate_object then null; end $$;

do $$ begin
    create type goal_status as enum ('active', 'completed', 'paused');
exception when duplicate_object then null; end $$;

do $$ begin
    create type quiz_difficulty as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    username text unique,
    avatar_url text,
    date_of_birth date,
    country text,
    currency text default 'EUR',
    mfa_enabled boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.expense_categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    color text,
    icon text,
    created_at timestamptz default now(),
    unique (user_id, name)
);

create table if not exists public.income_categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    color text,
    icon text,
    created_at timestamptz default now(),
    unique (user_id, name)
);

create table if not exists public.transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    type transaction_type not null,
    category_id uuid,
    amount numeric(12,2) not null check (amount > 0),
    title text not null,
    description text,
    transaction_date date not null default current_date,
    payment_method text,
    is_recurring boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.saving_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    target_amount numeric(12,2) not null check (target_amount > 0),
    current_amount numeric(12,2) default 0 check (current_amount >= 0),
    deadline date,
    status goal_status default 'active',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.financial_tips (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text not null,
    category text,
    difficulty quiz_difficulty default 'easy',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.quiz_questions (
    id uuid primary key default gen_random_uuid(),
    question text not null,
    option_a text not null,
    option_b text not null,
    option_c text not null,
    option_d text not null,
    correct_option char(1) not null check (correct_option in ('A','B','C','D')),
    explanation text,
    created_at timestamptz default now()
);

create table if not exists public.quiz_attempts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    score integer not null check (score >= 0),
    total_questions integer not null check (total_questions > 0),
    completed_at timestamptz default now()
);

create table if not exists public.user_security_settings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null unique references auth.users(id) on delete cascade,
    mfa_enabled boolean default false,
    two_factor_method text default 'email',
    security_level text default 'standard',
    last_password_change timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.login_audit (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    login_status text not null,
    ip_address inet,
    device_info text,
    created_at timestamptz default now()
);

create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(transaction_date);
create index if not exists idx_goals_user_id on public.saving_goals(user_id);
create index if not exists idx_quiz_attempts_user_id on public.quiz_attempts(user_id);
create index if not exists idx_login_audit_user_id on public.login_audit(user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_transactions_updated_at on public.transactions;
create trigger trg_transactions_updated_at before update on public.transactions
for each row execute function public.set_updated_at();

drop trigger if exists trg_saving_goals_updated_at on public.saving_goals;
create trigger trg_saving_goals_updated_at before update on public.saving_goals
for each row execute function public.set_updated_at();

drop trigger if exists trg_user_security_settings_updated_at on public.user_security_settings;
create trigger trg_user_security_settings_updated_at before update on public.user_security_settings
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.expense_categories enable row level security;
alter table public.income_categories enable row level security;
alter table public.transactions enable row level security;
alter table public.saving_goals enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.user_security_settings enable row level security;
alter table public.login_audit enable row level security;
alter table public.financial_tips enable row level security;
alter table public.quiz_questions enable row level security;

create policy "owner profiles" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "owner expense categories" on public.expense_categories
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner income categories" on public.income_categories
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner transactions" on public.transactions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner goals" on public.saving_goals
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner attempts" on public.quiz_attempts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner security settings" on public.user_security_settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "owner login audit" on public.login_audit
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "public read tips" on public.financial_tips
for select using (true);
create policy "public read quiz questions" on public.quiz_questions
for select using (true);

insert into public.financial_tips (title, content, category, difficulty)
values
('Regra 50/30/20', 'Distribui rendimento: 50% necessidades, 30% desejos, 20% poupanca.', 'orcamento', 'easy'),
('Evita juros altos', 'Paga dividas com taxa de juro mais alta primeiro.', 'dividas', 'medium')
on conflict do nothing;

-- Function and trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Utilizador')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
