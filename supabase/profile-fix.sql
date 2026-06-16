-- Run this in Supabase SQL Editor if location save fails or profile row is missing.
-- Safe to run more than once.

-- Ensure profiles has all columns the app expects
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists pin_code text;
alter table public.profiles add column if not exists location_status text;
alter table public.profiles add column if not exists created_at timestamptz default now() not null;
alter table public.profiles add column if not exists updated_at timestamptz default now() not null;

-- Re-apply location_status check (skip if already exists)
do $$ begin
  alter table public.profiles
    add constraint profiles_location_status_check
    check (location_status in ('served', 'unserved'));
exception when duplicate_object then null;
end $$;

-- Updated_at trigger (needs updated_at column above)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Allow users to create their own profile row (if signup trigger did not run)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

-- Backfill profiles for existing auth users who have no profile row
insert into public.profiles (id, full_name, created_at, updated_at)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  now(),
  now()
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- Backfill updated_at on any rows that have null
update public.profiles set updated_at = now() where updated_at is null;
update public.profiles set created_at = now() where created_at is null;
