-- City & call request tables (run in Supabase SQL Editor if not already applied)

create table if not exists public.city_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  city text not null,
  message text,
  created_at timestamptz default now() not null
);

create table if not exists public.call_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  preferred_time text,
  message text,
  created_at timestamptz default now() not null
);

alter table public.city_requests enable row level security;
alter table public.call_requests enable row level security;

drop policy if exists "Anyone can submit city request" on public.city_requests;
create policy "Anyone can submit city request"
  on public.city_requests for insert with check (true);

drop policy if exists "Anyone can submit call request" on public.call_requests;
create policy "Anyone can submit call request"
  on public.call_requests for insert with check (true);
