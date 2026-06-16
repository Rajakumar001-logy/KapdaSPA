-- Run this in Supabase SQL Editor if location save fails or profile row is missing.
-- Safe to run more than once.

-- Column needed for city / served vs unserved tracking
alter table public.profiles
  add column if not exists location_status text check (location_status in ('served', 'unserved'));

-- Allow users to create their own profile row (if signup trigger did not run)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Backfill profiles for existing auth users who have no profile row
insert into public.profiles (id, full_name)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', '')
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
