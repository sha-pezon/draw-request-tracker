create extension if not exists pgcrypto;

create table if not exists public.drawops_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.drawops_state (
  id text primary key default 'main' check (id = 'main'),
  project jsonb not null default '{}'::jsonb,
  draws jsonb not null default '[]'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.drawops_activity (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  target text not null,
  detail text,
  user_id uuid references auth.users(id) on delete set null,
  user_name text,
  user_email text,
  created_at timestamptz not null default now()
);

alter table public.drawops_profiles enable row level security;
alter table public.drawops_state enable row level security;
alter table public.drawops_activity enable row level security;

create or replace function public.is_pezon_user()
returns boolean
language sql
stable
as $$
  select coalesce(lower(auth.jwt() ->> 'email') like '%@pezonproperties.com', false);
$$;

drop policy if exists "pezon profiles readable" on public.drawops_profiles;
create policy "pezon profiles readable"
on public.drawops_profiles for select
to authenticated
using (public.is_pezon_user());

drop policy if exists "users upsert own profile" on public.drawops_profiles;
create policy "users upsert own profile"
on public.drawops_profiles for insert
to authenticated
with check (public.is_pezon_user() and auth.uid() = user_id);

drop policy if exists "users update own profile" on public.drawops_profiles;
create policy "users update own profile"
on public.drawops_profiles for update
to authenticated
using (public.is_pezon_user() and auth.uid() = user_id)
with check (public.is_pezon_user() and auth.uid() = user_id);

drop policy if exists "pezon state readable" on public.drawops_state;
create policy "pezon state readable"
on public.drawops_state for select
to authenticated
using (public.is_pezon_user());

drop policy if exists "pezon state insertable" on public.drawops_state;
create policy "pezon state insertable"
on public.drawops_state for insert
to authenticated
with check (public.is_pezon_user());

drop policy if exists "pezon state editable" on public.drawops_state;
create policy "pezon state editable"
on public.drawops_state for update
to authenticated
using (public.is_pezon_user())
with check (public.is_pezon_user());

drop policy if exists "pezon activity readable" on public.drawops_activity;
create policy "pezon activity readable"
on public.drawops_activity for select
to authenticated
using (public.is_pezon_user());

drop policy if exists "pezon activity insertable" on public.drawops_activity;
create policy "pezon activity insertable"
on public.drawops_activity for insert
to authenticated
with check (public.is_pezon_user() and auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.drawops_profiles to authenticated;
grant select, insert, update on public.drawops_state to authenticated;
grant select, insert on public.drawops_activity to authenticated;

insert into public.drawops_state (id, project, draws)
values ('main', '{}'::jsonb, '[]'::jsonb)
on conflict (id) do nothing;
