-- KapdaSPA — Laundries, services & order extensions
-- Run in Supabase SQL Editor after schema.sql
--
-- HOW ADMINS MANAGE LAUNDRIES (no code deploy needed):
-- 1. Supabase Dashboard → Table Editor → "laundries"
--    Add row: name, city (must match serving city e.g. "Lucknow"), address, phone, is_active = true
--    To remove: set is_active = false (hidden from customers) or delete the row
-- 2. Table Editor → "laundry_services"
--    Add row: laundry_id, name, service_type, price, price_unit (kg/piece/item), is_active = true
--    To remove a service: set is_active = false or delete the row
-- 3. View new orders: Table Editor → "orders" (includes laundry name, prices, delivery charge)

-- Laundries per city
create table if not exists public.laundries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  address text,
  phone text,
  rating numeric(2,1) default 4.5 check (rating >= 0 and rating <= 5),
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists laundries_city_idx on public.laundries (city) where is_active = true;

-- Services offered by each laundry
create table if not exists public.laundry_services (
  id uuid primary key default gen_random_uuid(),
  laundry_id uuid references public.laundries(id) on delete cascade not null,
  name text not null,
  service_type text not null,
  price numeric(10,2) not null check (price >= 0),
  price_unit text default 'kg' not null,
  description text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists laundry_services_laundry_idx on public.laundry_services (laundry_id) where is_active = true;

-- Profile: track whether user's city is served
alter table public.profiles
  add column if not exists location_status text check (location_status in ('served', 'unserved'));

-- Order: link to laundry + pricing
alter table public.orders
  add column if not exists laundry_id uuid references public.laundries(id),
  add column if not exists laundry_service_id uuid references public.laundry_services(id),
  add column if not exists laundry_name text,
  add column if not exists service_name text,
  add column if not exists service_price numeric(10,2),
  add column if not exists delivery_charge numeric(10,2) default 49,
  add column if not exists total_amount numeric(10,2);

-- Make service_type optional for new laundry-based orders
alter table public.orders alter column service_type drop not null;

-- Updated_at triggers
drop trigger if exists laundries_updated_at on public.laundries;
create trigger laundries_updated_at
  before update on public.laundries
  for each row execute function public.set_updated_at();

drop trigger if exists laundry_services_updated_at on public.laundry_services;
create trigger laundry_services_updated_at
  before update on public.laundry_services
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.laundries enable row level security;
alter table public.laundry_services enable row level security;

drop policy if exists "Anyone can view active laundries" on public.laundries;
create policy "Anyone can view active laundries"
  on public.laundries for select using (is_active = true);

drop policy if exists "Anyone can view active laundry services" on public.laundry_services;
create policy "Anyone can view active laundry services"
  on public.laundry_services for select using (is_active = true);

-- Sample laundries (edit or delete in Table Editor)
insert into public.laundries (name, city, address, phone, rating) values
  ('Sparkle Clean', 'Delhi', 'Connaught Place, New Delhi', '+91 9876543210', 4.7),
  ('FreshFold Laundry', 'Delhi', 'Saket, South Delhi', '+91 9876543211', 4.5),
  ('Noida Wash Hub', 'Noida', 'Sector 18, Noida', '+91 9876543212', 4.6),
  ('Gurgaon Premium Clean', 'Gurgaon', 'DLF Phase 3, Gurgaon', '+91 9876543213', 4.8),
  ('Lucknow Kapda Care', 'Lucknow', 'Hazratganj, Lucknow', '+91 9876543214', 4.7),
  ('Raipur Fresh & Clean', 'Raipur', 'Pandri, Raipur', '+91 9876543215', 4.5)
on conflict do nothing;

-- Sample services per laundry (uses laundry name + city to find id)
insert into public.laundry_services (laundry_id, name, service_type, price, price_unit, description)
select l.id, s.name, s.service_type, s.price, s.price_unit, s.description
from public.laundries l
cross join lateral (values
  ('Wash & Fold', 'wash_fold', 49.00, 'kg', 'Everyday clothes washed, dried & folded'),
  ('Wash & Iron', 'wash_iron', 79.00, 'kg', 'Crisp, wrinkle-free everyday wear'),
  ('Dry Cleaning', 'dry_cleaning', 149.00, 'piece', 'Suits, sarees & delicate fabrics'),
  ('Premium Garment Care', 'premium_care', 199.00, 'piece', 'Designer & luxury garment handling')
) as s(name, service_type, price, price_unit, description)
where l.name = 'Sparkle Clean' and l.city = 'Delhi'
on conflict do nothing;

insert into public.laundry_services (laundry_id, name, service_type, price, price_unit, description)
select l.id, s.name, s.service_type, s.price, s.price_unit, s.description
from public.laundries l
cross join lateral (values
  ('Wash & Fold', 'wash_fold', 45.00, 'kg', 'Affordable everyday laundry'),
  ('Wash & Iron', 'wash_iron', 75.00, 'kg', 'Ironed and ready to wear'),
  ('Dry Cleaning', 'dry_cleaning', 139.00, 'piece', 'Formal wear & silks')
) as s(name, service_type, price, price_unit, description)
where l.name = 'FreshFold Laundry' and l.city = 'Delhi'
on conflict do nothing;

insert into public.laundry_services (laundry_id, name, service_type, price, price_unit, description)
select l.id, s.name, s.service_type, s.price, s.price_unit, s.description
from public.laundries l
cross join lateral (values
  ('Wash & Fold', 'wash_fold', 49.00, 'kg', 'Doorstep-quality wash & fold'),
  ('Dry Cleaning', 'dry_cleaning', 159.00, 'piece', 'Office wear & party outfits')
) as s(name, service_type, price, price_unit, description)
where l.name = 'Noida Wash Hub' and l.city = 'Noida'
on conflict do nothing;

insert into public.laundry_services (laundry_id, name, service_type, price, price_unit, description)
select l.id, s.name, s.service_type, s.price, s.price_unit, s.description
from public.laundries l
cross join lateral (values
  ('Wash & Fold', 'wash_fold', 55.00, 'kg', 'Premium wash for Gurgaon homes'),
  ('Wash & Iron', 'wash_iron', 85.00, 'kg', 'Executive finish ironing'),
  ('Dry Cleaning', 'dry_cleaning', 169.00, 'piece', 'Premium dry clean')
) as s(name, service_type, price, price_unit, description)
where l.name = 'Gurgaon Premium Clean' and l.city = 'Gurgaon'
on conflict do nothing;

insert into public.laundry_services (laundry_id, name, service_type, price, price_unit, description)
select l.id, s.name, s.service_type, s.price, s.price_unit, s.description
from public.laundries l
cross join lateral (values
  ('Wash & Fold', 'wash_fold', 42.00, 'kg', 'Lucknow''s trusted wash & fold'),
  ('Wash & Iron', 'wash_iron', 69.00, 'kg', 'Crisp kurtas & shirts'),
  ('Dry Cleaning', 'dry_cleaning', 129.00, 'piece', 'Chikan & formal wear')
) as s(name, service_type, price, price_unit, description)
where l.name = 'Lucknow Kapda Care' and l.city = 'Lucknow'
on conflict do nothing;

insert into public.laundry_services (laundry_id, name, service_type, price, price_unit, description)
select l.id, s.name, s.service_type, s.price, s.price_unit, s.description
from public.laundries l
cross join lateral (values
  ('Wash & Fold', 'wash_fold', 44.00, 'kg', 'Fresh laundry in Raipur'),
  ('Dry Cleaning', 'dry_cleaning', 135.00, 'piece', 'Suits & sarees')
) as s(name, service_type, price, price_unit, description)
where l.name = 'Raipur Fresh & Clean' and l.city = 'Raipur'
on conflict do nothing;
