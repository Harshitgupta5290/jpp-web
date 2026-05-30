-- ─────────────────────────────────────────────────────────────────────────────
-- Jawahar Printing Press — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CATEGORIES ───────────────────────────────────────────────────────────────
create table public.categories (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  description text,
  sort_order  int default 0,
  active      boolean default true,
  created_at  timestamptz not null default now()
);

insert into public.categories (slug, name, description, sort_order) values
  ('business-cards',  'Business Cards',           'Premium matte, glossy, and spot UV cards',        1),
  ('brochures',       'Brochures & Pamphlets',    'Tri-fold, bi-fold, Z-fold — any size',            2),
  ('banners',         'Banners & Flex',           'Outdoor flex, vinyl, canvas banners',             3),
  ('packaging',       'Packaging Boxes',          'Custom printed boxes for every product',          4),
  ('letterheads',     'Letterheads & Stationery', 'Professional corporate stationery sets',          5),
  ('wedding-cards',   'Wedding Cards',            'Elegant invitation cards & inserts',              6),
  ('photo-printing',  'Photo Printing',           'High-res photo prints, canvas, frames',           7),
  ('merchandise',     'Branded Merchandise',      'T-shirts, mugs, pens with your logo',             8);

-- ─── PRODUCTS ─────────────────────────────────────────────────────────────────
create table public.products (
  id              uuid primary key default uuid_generate_v4(),
  category_id     uuid references public.categories(id) on delete cascade,
  slug            text unique not null,
  name            text not null,
  description     text,
  sizes           text[]  default '{}',
  paper_types     text[]  default '{}',
  finishes        text[]  default '{}',
  sides_options   text[]  default '{"Single Side","Double Side"}',
  min_qty         int not null default 100,
  turnaround_days int not null default 3,
  active          boolean default true,
  created_at      timestamptz not null default now()
);

-- ─── PRICING SLABS ────────────────────────────────────────────────────────────
create table public.pricing_slabs (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references public.products(id) on delete cascade,
  min_qty     int not null,
  max_qty     int,          -- null means unlimited
  price_per   numeric(10,2) not null,  -- price per unit
  created_at  timestamptz not null default now()
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────────
create table public.orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text unique not null,
  user_id         uuid references auth.users(id),
  -- customer info (stored for guest orders too)
  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text,
  -- address
  address_line1   text not null,
  address_line2   text,
  city            text not null,
  state           text not null,
  pincode         text not null,
  -- amounts
  subtotal        numeric(12,2) not null,
  shipping        numeric(12,2) not null default 0,
  total           numeric(12,2) not null,
  advance_paid    numeric(12,2) not null default 0,
  balance_due     numeric(12,2) generated always as (total - advance_paid) stored,
  -- status
  status          text not null default 'pending'
    check (status in ('pending','confirmed','design_approved','printing','dispatched','delivered','cancelled')),
  -- payment
  razorpay_order_id   text,
  razorpay_payment_id text,
  payment_status      text default 'pending' check (payment_status in ('pending','advance_paid','fully_paid','refunded')),
  -- notes
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── ORDER ITEMS ──────────────────────────────────────────────────────────────
create table public.order_items (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid references public.orders(id) on delete cascade,
  product_id      uuid references public.products(id),
  product_name    text not null,    -- snapshot at order time
  category_name   text not null,
  -- specs chosen
  quantity        int not null,
  size            text,
  paper_type      text,
  finish          text,
  sides           text,
  -- pricing
  unit_price      numeric(10,2) not null,
  total_price     numeric(12,2) not null,
  -- file
  design_file_url text,
  design_notes    text,
  created_at      timestamptz not null default now()
);

-- ─── ORDER STATUS HISTORY ─────────────────────────────────────────────────────
create table public.order_status_history (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references public.orders(id) on delete cascade,
  status      text not null,
  note        text,
  updated_by  uuid references auth.users(id),
  created_at  timestamptz not null default now()
);

-- Trigger to log status changes automatically
create or replace function public.log_order_status()
returns trigger language plpgsql as $$
begin
  if (old.status is distinct from new.status) then
    insert into public.order_status_history (order_id, status, note)
    values (new.id, new.status, 'Status updated');
  end if;
  return new;
end;
$$;

create trigger order_status_changed
  after update on public.orders
  for each row execute procedure public.log_order_status();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ─── REVIEWS ──────────────────────────────────────────────────────────────────
create table public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid references public.orders(id),
  user_id     uuid references auth.users(id),
  product_id  uuid references public.products(id),
  rating      int not null check (rating between 1 and 5),
  message     text,
  verified    boolean default false,
  created_at  timestamptz not null default now()
);

-- ─── PAYMENT LINKS ────────────────────────────────────────────────────────────
create table public.payment_links (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid references public.orders(id) on delete cascade,
  amount          numeric(12,2) not null,
  razorpay_link_id text,
  short_url       text,
  status          text default 'created' check (status in ('created','paid','expired','cancelled')),
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

alter table public.profiles             enable row level security;
alter table public.categories           enable row level security;
alter table public.products             enable row level security;
alter table public.pricing_slabs        enable row level security;
alter table public.orders               enable row level security;
alter table public.order_items          enable row level security;
alter table public.order_status_history enable row level security;
alter table public.reviews              enable row level security;
alter table public.payment_links        enable row level security;

-- Profiles: users see only their own
create policy "users view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "admins view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Categories + Products + Pricing: public read
create policy "public read categories"    on public.categories    for select using (active = true);
create policy "public read products"      on public.products       for select using (active = true);
create policy "public read pricing"       on public.pricing_slabs  for select using (true);

-- Orders: users see their own; admins see all
create policy "users view own orders" on public.orders for select
  using (auth.uid() = user_id);
create policy "users insert orders"   on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);
create policy "admins manage orders"  on public.orders for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Order items: same as orders
create policy "users view own order items" on public.order_items for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "users insert order items"   on public.order_items for insert
  with check (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));

-- Order status history: users can read their order's history
create policy "users view own order history" on public.order_status_history for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "admins manage history" on public.order_status_history for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Reviews: public read, authenticated insert
create policy "public read reviews"  on public.reviews for select using (true);
create policy "auth insert reviews"  on public.reviews for insert with check (auth.uid() = user_id);

-- Payment links: user sees own, admin sees all
create policy "users view own payment links" on public.payment_links for select
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
create policy "admins manage payment links"  on public.payment_links for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─── STORAGE BUCKET ───────────────────────────────────────────────────────────
-- Run separately in Supabase Dashboard → Storage → New Bucket
-- Name: design-uploads
-- Public: false
-- File size limit: 50MB
-- Allowed MIME: application/pdf, image/*, application/postscript

-- ─── INDEXES FOR PERFORMANCE ──────────────────────────────────────────────────
create index idx_products_category    on public.products(category_id);
create index idx_products_slug        on public.products(slug);
create index idx_orders_user          on public.orders(user_id);
create index idx_orders_status        on public.orders(status);
create index idx_orders_number        on public.orders(order_number);
create index idx_order_items_order    on public.order_items(order_id);
create index idx_pricing_product      on public.pricing_slabs(product_id);
create index idx_reviews_product      on public.reviews(product_id);
